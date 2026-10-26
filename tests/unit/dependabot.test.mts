import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const config = readFileSync(new URL("../../.github/dependabot.yml", import.meta.url), "utf8");

// Lines with their indentation, without comments and blank lines.
const lines = config
  .split(/\r?\n/)
  .map((line) => line.replace(/\s+#.*$/, "").trimEnd())
  .filter((line) => line.trim() !== "" && !line.trim().startsWith("#"));

const indent = (line: string) => line.length - line.trimStart().length;

// The lines nested under block[start].
function childrenOf(block: string[], start: number): string[] {
  const end = block.findIndex((line, i) => i > start && indent(line) <= indent(block[start]));
  return block.slice(start + 1, end === -1 ? undefined : end);
}

// The lines nested under the first "key:" line of a block.
function section(block: string[], key: string): string[] {
  const start = block.findIndex((line) => line.trim() === `${key}:`);
  assert.notEqual(start, -1, `missing "${key}:"`);
  return childrenOf(block, start);
}

// The direct "key: value" entries of a section, values unquoted.
function entries(block: string[]): Record<string, string> {
  const top = Math.min(...block.map(indent));
  return Object.fromEntries(
    block
      .filter((line) => indent(line) === top)
      .map((line) => {
        const [, key, value] = line.trim().match(/^([\w-]+):\s*(.*)$/) ?? [];
        assert.ok(key, `not a key: ${line.trim()}`);
        return [key, value.replace(/^(["'])(.*)\1$/, "$2")];
      }),
  );
}

// "[a, b]" as a list.
const flowList = (value: string) =>
  value
    .replace(/^\[(.*)\]$/, "$1")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");

const ECOSYSTEMS = ["docker", "github-actions", "npm"];

const updates = new Map<string, string[]>();
lines.forEach((line, i) => {
  const match = line.match(/^\s*- package-ecosystem:\s*["']?([\w-]+)["']?$/);
  if (!match) return;
  assert.ok(!updates.has(match[1]), `${match[1]} is configured twice`);
  updates.set(match[1], childrenOf(lines, i));
});

test("Dependabot uses config version 2", () => {
  assert.ok(lines.includes("version: 2"));
});

test("Dependabot updates exactly GitHub Actions, npm and Docker", () => {
  assert.deepEqual([...updates.keys()].sort(), ECOSYSTEMS);
});

for (const ecosystem of ECOSYSTEMS) {
  const block = () => {
    const found = updates.get(ecosystem);
    assert.ok(found, `${ecosystem} is not configured`);
    return found;
  };

  test(`${ecosystem} updates the repository root once a week in Berlin time`, () => {
    assert.equal(entries(block()).directory, "/");
    const schedule = entries(section(block(), "schedule"));
    assert.equal(schedule.interval, "weekly");
    assert.equal(schedule.timezone, "Europe/Berlin");
    assert.match(schedule.day, /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/);
    assert.match(schedule.time, /^\d{2}:\d{2}$/);
  });

  test(`${ecosystem} groups all minor and patch updates into one pull request`, () => {
    const groups = section(block(), "groups");
    const names = Object.keys(entries(groups));
    assert.equal(names.length, 1, `expected one group, got ${names.join(", ")}`);
    // No patterns or dependency-type filter: every minor and patch update belongs to it.
    const rules = entries(section(groups, names[0]));
    assert.deepEqual(Object.keys(rules), ["update-types"]);
    assert.deepEqual(flowList(rules["update-types"]).sort(), ["minor", "patch"]);
  });

  test(`${ecosystem} opens a separate pull request for each major update`, () => {
    const groups = section(block(), "groups");
    for (const name of Object.keys(entries(groups))) {
      const updateTypes = entries(section(groups, name))["update-types"];
      assert.ok(updateTypes, `group ${name} has no update-types and would take major updates`);
      assert.ok(!flowList(updateTypes).includes("major"), `group ${name} takes major updates`);
    }
  });

  test(`${ecosystem} commits start with the deps prefix`, () => {
    // Without prefix-development the prefix applies to devDependencies as well.
    assert.deepEqual(entries(section(block(), "commit-message")), { prefix: "deps" });
  });

  test(`${ecosystem} version updates are not switched off`, () => {
    assert.notEqual(entries(block())["open-pull-requests-limit"], "0");
  });
}
