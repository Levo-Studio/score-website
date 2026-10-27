import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const config = readFileSync(new URL("../../.github/dependabot.yml", import.meta.url), "utf8");

// Lines with their indentation, without comments, blank lines and a leading
// document marker.
const lines = config
  .split(/\r?\n/)
  .map((line) => line.replace(/\s+#.*$/, "").trimEnd())
  .filter((line) => line.trim() !== "" && !line.trim().startsWith("#"))
  .filter((line, i) => !(i === 0 && line === "---"));

type Node = string | Node[] | { [key: string]: Node };

const KEY = /^([\w-]+):(?:\s+(.*))?$/;
const indent = (line: string) => line.length - line.trimStart().length;
const unquote = (value: string) => value.replace(/^(["'])(.*)\1$/, "$2");

// A scalar, or a flow list of scalars such as [minor, "patch"].
function scalar(value: string): Node {
  const flow = value.match(/^\[(.*)\]$/);
  if (!flow) return unquote(value);
  return flow[1]
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "")
    .map(unquote);
}

// Reads the block-style YAML subset Dependabot configs use: mappings,
// sequences (also at the indentation of their key), scalars and flow lists.
function parse(block: string[]): Node {
  if (block.length === 0) return "";
  const base = indent(block[0]);
  const isSequence = block[0].trimStart().startsWith("-");
  const heads = block.flatMap((line, i) =>
    indent(line) === base && line.trimStart().startsWith("-") === isSequence ? [i] : [],
  );
  const parts = heads.map((head, n) => block.slice(head, heads[n + 1]));

  if (isSequence) {
    return parts.map(([first, ...rest]) => {
      // "- key: value" reads like the other keys of its item once the dash is gone.
      const item = [first.replace("-", " "), ...rest];
      return item.length === 1 && !KEY.test(item[0].trim()) ? scalar(item[0].trim()) : parse(item);
    });
  }
  return Object.fromEntries(
    parts.map(([first, ...rest]) => {
      const [, key, value] = first.trim().match(KEY) ?? [];
      assert.ok(key, `not a key: ${first.trim()}`);
      if (value === undefined) return [key, parse(rest)];
      assert.deepEqual(rest, [], `${key} has a value and nested lines`);
      return [key, scalar(value)];
    }),
  );
}

function mapping(node: Node | undefined, what: string): Record<string, Node> {
  assert.ok(typeof node === "object" && !Array.isArray(node), `${what} is not a mapping`);
  return node;
}

function strings(node: Node | undefined, what: string): string[] {
  assert.ok(Array.isArray(node), `${what} is not a list`);
  return node.map((item) => {
    assert.equal(typeof item, "string", `${what} holds a non-scalar item`);
    return item as string;
  });
}

const dependabot = mapping(parse(lines), ".github/dependabot.yml");

const updates = () => {
  assert.ok(Array.isArray(dependabot.updates), "updates is not a list");
  return dependabot.updates.map((update) => mapping(update, "an update"));
};

const ECOSYSTEMS = ["docker", "github-actions", "npm"];

// Every other setting (allow, ignore, target-branch, versioning-strategy,
// cooldown, open-pull-requests-limit, ...) would change what gets updated.
const UPDATE_KEYS = ["commit-message", "directories", "directory", "groups", "package-ecosystem", "schedule"];

test("Dependabot uses config version 2", () => {
  assert.equal(dependabot.version, "2");
});

test("Dependabot updates exactly GitHub Actions, npm and Docker", () => {
  assert.deepEqual(updates().map((update) => update["package-ecosystem"]).sort(), ECOSYSTEMS);
});

for (const ecosystem of ECOSYSTEMS) {
  const update = () => {
    const found = updates().find((candidate) => candidate["package-ecosystem"] === ecosystem);
    assert.ok(found, `${ecosystem} is not configured`);
    return found;
  };

  test(`${ecosystem} updates the repository root once a week in Berlin time`, () => {
    const { directory, directories } = update();
    assert.ok((directory === undefined) !== (directories === undefined), "set directory or directories");
    assert.deepEqual(directory === undefined ? strings(directories, "directories") : [directory], ["/"]);

    const schedule = mapping(update().schedule, "schedule");
    assert.equal(schedule.interval, "weekly");
    assert.equal(schedule.timezone, "Europe/Berlin");
    assert.match(String(schedule.day), /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/);
    assert.match(String(schedule.time), /^\d{2}:\d{2}$/);
  });

  test(`${ecosystem} groups all minor and patch updates into one pull request`, () => {
    const groups = mapping(update().groups, "groups");
    const names = Object.keys(groups);
    assert.equal(names.length, 1, `expected one group, got ${names.join(", ")}`);
    const {
      "update-types": updateTypes,
      "applies-to": appliesTo = "version-updates",
      ...filters
    } = mapping(groups[names[0]], `group ${names[0]}`);
    // No patterns or dependency-type filter: every minor and patch update belongs to it.
    assert.deepEqual(Object.keys(filters), []);
    assert.equal(appliesTo, "version-updates");
    assert.deepEqual(strings(updateTypes, "update-types").sort(), ["minor", "patch"]);
  });

  test(`${ecosystem} opens a separate pull request for each major update`, () => {
    for (const [name, group] of Object.entries(mapping(update().groups, "groups"))) {
      const updateTypes = mapping(group, `group ${name}`)["update-types"];
      assert.ok(updateTypes !== undefined, `group ${name} has no update-types and would take major updates`);
      assert.ok(!strings(updateTypes, "update-types").includes("major"), `group ${name} takes major updates`);
    }
  });

  test(`${ecosystem} updates every dependency against the default branch`, () => {
    // E.g. ignoring version-update:semver-major would silently stop all major pull requests.
    const unexpected = Object.keys(update()).filter((key) => !UPDATE_KEYS.includes(key));
    assert.deepEqual(unexpected, [], `unexpected settings: ${unexpected.join(", ")}`);
  });

  test(`${ecosystem} commits start with the deps prefix`, () => {
    // Without prefix-development the prefix applies to devDependencies as well.
    const {
      prefix,
      "prefix-development": prefixDevelopment = prefix,
      ...rest
    } = mapping(update()["commit-message"], "commit-message");
    assert.deepEqual({ prefix, prefixDevelopment, rest }, { prefix: "deps", prefixDevelopment: "deps", rest: {} });
  });
}
