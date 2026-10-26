import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

const workflowsDir = new URL("../../.github/workflows/", import.meta.url);
const readWorkflow = (name: string) => readFileSync(new URL(name, workflowsDir), "utf8");
const allWorkflows = readdirSync(workflowsDir).filter((name) => /\.ya?ml$/.test(name));

// Lines of a top-level YAML key's block, without blank and comment-only lines.
function topLevelBlock(source: string, key: string): string[] {
  const lines = source.split(/\r?\n/);
  const start = lines.indexOf(`${key}:`);
  assert.notEqual(start, -1, `missing top-level "${key}:"`);
  const end = lines.findIndex((line, i) => i > start && /^\S/.test(line));
  return lines
    .slice(start + 1, end === -1 ? undefined : end)
    .filter((line) => line.trim() !== "" && !line.trim().startsWith("#"));
}

const deploy = readWorkflow("deploy.yml");

test("deploy runs on pushes to main and on manual dispatch only", () => {
  assert.deepEqual(topLevelBlock(deploy, "on"), [
    "  push:",
    "    branches: [main]",
    "  workflow_dispatch:",
  ]);
});

test("deploy keeps its registry and region settings", () => {
  assert.deepEqual(topLevelBlock(deploy, "env"), [
    "  REGISTRY: ghcr.io",
    "  IMAGE_NAME: ${{ github.repository }}",
    "  SCW_REGISTRY: rg.nl-ams.scw.cloud",
    "  SCW_IMAGE_NAME: levo-studio/score-website",
    "  SCW_REGION: nl-ams",
  ]);
});

test("deploy job runs in the production environment", () => {
  assert.ok(topLevelBlock(deploy, "jobs").includes("    environment: production"));
});

test("deploy updates the Scaleway container only when one is configured", () => {
  const jobs = topLevelBlock(deploy, "jobs");
  const step = jobs.indexOf("      - name: Deploy to Scaleway Serverless Containers");
  assert.notEqual(step, -1, "Scaleway deploy step missing");
  assert.equal(jobs[step + 1], "        if: ${{ vars.SCW_CONTAINER_ID != '' }}");
  assert.ok(
    jobs.some((line) =>
      line.includes(
        'API="https://api.scaleway.com/containers/v1/regions/${SCW_REGION}/containers/${SCW_CONTAINER_ID}"',
      ),
    ),
    "Scaleway container API call missing",
  );
});

// Every `uses:` value of a workflow, e.g. "actions/checkout@<sha> # v1.2.3".
// A `uses` key in any other form (quoted, flow mapping, block scalar) throws, so no
// reference escapes the checks. Comments, expressions and block scalars such as run
// scripts are skipped; "uses:" inside a value does not count.
function actionRefs(name: string, source: string): string[] {
  const refs: string[] = [];
  let scalarIndent = -1;
  for (const line of source.split(/\r?\n/)) {
    const indent = line.search(/\S/);
    if (scalarIndent !== -1 && (indent === -1 || indent > scalarIndent)) continue;
    scalarIndent = -1;
    const code = line.replace(/(^|\s)#.*$/, "").replace(/\$\{\{.*?\}\}/g, "");
    const usesKey =
      /^\s*(?:-\s+)*["']?uses["']?\s*:/.test(code) ||
      (code.includes("{") && /[{,]\s*["']?uses["']?\s*:/.test(code));
    if (usesKey) {
      const ref = line.match(/^\s*(?:-\s+)?uses:\s+([\w.].*)$/);
      assert.ok(ref, `${name}: unrecognised "uses:" line: ${line.trim()}`);
      refs.push(ref[1].trim());
    } else if (/^\s*(?:-\s+)*["']?[\w-]+["']?\s*:\s*[|>][-+\d]*\s*$/.test(code)) {
      scalarIndent = indent;
    }
  }
  return refs;
}

const PINNED_ACTION = /^[\w.-]+\/[\w./-]+@[0-9a-f]{40} # v\d+\.\d+\.\d+$/;
const FIXTURE_SHA = "0123456789abcdef0123456789abcdef01234567";

test("action reference extraction reads only real uses keys", () => {
  const workflow = [
    "jobs:",
    "  build:",
    "    steps:",
    "      # - uses: actions/cache@v4",
    '      - name: "Count uses: in repo"',
    "        if: contains(github.ref, 'uses:') && ${{ format('{uses: x}') }}",
    "        run: |",
    '          echo "uses: actions/cache@v4"',
    "          - uses: not/a@step",
    `      - uses: actions/checkout@${FIXTURE_SHA} # v1.2.3`,
    "        with:",
    "          key: uses:foo",
    "          script: >-",
    "            uses: still/text@v1",
    "      - uses: ./.github/actions/local",
    "      - name: ratio a:>",
    `        uses: docker/login-action@${FIXTURE_SHA} # v4.5.6`,
    "  reuse:",
    "    uses: ./.github/workflows/reusable.yml",
  ].join("\n");
  assert.deepEqual(actionRefs("fixture", workflow), [
    `actions/checkout@${FIXTURE_SHA} # v1.2.3`,
    "./.github/actions/local",
    `docker/login-action@${FIXTURE_SHA} # v4.5.6`,
    "./.github/workflows/reusable.yml",
  ]);
});

test("action reference extraction rejects uses keys it cannot read", () => {
  for (const step of [
    "- {uses: actions/cache@v4}",
    "- {name: cache, uses: actions/cache@v4}",
    '- "uses": actions/cache@v4',
    "- 'uses': actions/cache@v4",
    "- uses: >-\n          actions/cache@v4",
    "- uses:",
  ]) {
    assert.throws(() => actionRefs("fixture", `    steps:\n      ${step}\n`), /unrecognised "uses:" line/, step);
  }
});

test("action reference extraction finds every action of the real workflows", () => {
  const actions = (name: string) => actionRefs(name, readWorkflow(name)).map((ref) => ref.split("@")[0]);
  assert.deepEqual(actions("ci.yml"), [
    "actions/checkout",
    "pnpm/action-setup",
    "actions/setup-node",
    "actions/checkout",
  ]);
  assert.deepEqual(actions("deploy.yml"), [
    "actions/checkout",
    "docker/setup-buildx-action",
    "docker/login-action",
    "docker/login-action",
    "docker/metadata-action",
    "docker/build-push-action",
  ]);
});

for (const name of allWorkflows) {
  test(`${name} pins every action to a full commit SHA and names its version`, () => {
    for (const ref of actionRefs(name, readWorkflow(name))) {
      if (ref.startsWith("./")) continue;
      assert.ok(!ref.startsWith("docker://"), `${name}: ${ref} is not allowed, a docker:// image would need a digest pin`);
      assert.match(ref, PINNED_ACTION);
    }
  });
}

test("workflows pin each action to the same commit and version", () => {
  const pins = new Map<string, Map<string, Set<string>>>();
  for (const name of allWorkflows) {
    for (const ref of actionRefs(name, readWorkflow(name))) {
      const at = ref.indexOf("@");
      const action = at === -1 ? ref : ref.slice(0, at);
      const pin = at === -1 ? "" : ref.slice(at + 1);
      const byPin = pins.get(action) ?? new Map<string, Set<string>>();
      byPin.set(pin, (byPin.get(pin) ?? new Set<string>()).add(name));
      pins.set(action, byPin);
    }
  }
  assert.ok(pins.size > 0, "no workflow uses an action");
  for (const [action, byPin] of pins) {
    const found = [...byPin].map(([pin, names]) => `${pin} (${[...names].join(", ")})`).join("; ");
    assert.equal(byPin.size, 1, `${action} is pinned differently: ${found}`);
  }
});

test("CI uses the Node major of the Docker base image", () => {
  const dockerfile = readFileSync(new URL("../../Dockerfile.dokploy", import.meta.url), "utf8");
  const dockerMajors = new Set([...dockerfile.matchAll(/^FROM node:(\d+)\b/gm)].map((m) => m[1]));
  assert.equal(dockerMajors.size, 1, "Dockerfile must use exactly one Node major");
  const [dockerMajor] = dockerMajors;

  let setupNodeSteps = 0;
  for (const name of allWorkflows) {
    const source = readWorkflow(name);
    const steps = source.match(/uses:\s*actions\/setup-node@/g)?.length ?? 0;
    const majors = [...source.matchAll(/^\s*node-version:\s*["']?(\d+)\b/gm)].map((m) => m[1]);
    assert.equal(majors.length, steps, `${name}: every setup-node step needs a node-version`);
    for (const major of majors) assert.equal(major, dockerMajor, `${name} uses Node ${major}`);
    setupNodeSteps += steps;
  }
  assert.ok(setupNodeSteps > 0, "no workflow sets up Node");
});
