import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const dockerfile = readFileSync(new URL("../../Dockerfile.dokploy", import.meta.url), "utf8");

// One entry per instruction: continuation lines joined, whitespace collapsed,
// comments and blank lines dropped.
const instructions = dockerfile
  .replace(/\\\r?\n/g, " ")
  .split(/\r?\n/)
  .map((line) => line.trim().replace(/\s+/g, " "))
  .filter((line) => line !== "" && !line.startsWith("#"));

const isFrom = (instruction: string) => /^FROM /i.test(instruction);
const runtimeStage = instructions.slice(instructions.findLastIndex(isFrom));
const inRuntime = (pattern: RegExp) => runtimeStage.filter((instruction) => pattern.test(instruction));

// Instructions grouped by build stage, each group starting with its FROM.
const stages = instructions.reduce<string[][]>((groups, instruction) => {
  if (isFrom(instruction)) groups.push([]);
  groups.at(-1)?.push(instruction);
  return groups;
}, []);

test("all stages build on the same base image", () => {
  const images = instructions.filter(isFrom).map((instruction) => instruction.split(" ")[1]);
  assert.ok(images.length > 0, "no FROM instruction found");
  assert.deepEqual(new Set(images).size, 1, `different base images: ${images.join(", ")}`);
});

test("base image is pinned by Node version, Alpine version and digest", () => {
  for (const instruction of instructions.filter(isFrom)) {
    assert.match(instruction.split(" ")[1], /^node:\d+\.\d+\.\d+-alpine\d+\.\d+@sha256:[0-9a-f]{64}$/);
  }
});

test("pnpm is installed from the packageManager field in package.json", () => {
  assert.doesNotMatch(dockerfile, /corepack/i, "Node 26 images ship without corepack");
  assert.doesNotMatch(dockerfile, /pnpm@\d/, "the pnpm version belongs in package.json only");
  const installsPnpm = /^RUN .*npm install --global .*require\('[^']*package\.json'\)\.packageManager\b/;
  let pnpmStages = 0;
  for (const stage of stages) {
    const firstUse = stage.findIndex((instruction) => /^RUN pnpm /.test(instruction));
    if (firstUse === -1) continue;
    pnpmStages += 1;
    const install = stage.findIndex((instruction) => installsPnpm.test(instruction));
    assert.ok(install !== -1 && install < firstUse, `${stage[0]}: pnpm is used before it is installed`);
  }
  assert.ok(pnpmStages > 0, "no stage runs pnpm");
});

test("runtime installs no package manager", () => {
  assert.deepEqual(inRuntime(/^RUN .*\b(npm|pnpm|corepack)\b/), []);
});

test("runtime listens on port 6239", () => {
  assert.deepEqual(inRuntime(/^ENV PORT[= ]/), ["ENV PORT=6239"]);
  assert.deepEqual(inRuntime(/^EXPOSE /), ["EXPOSE 6239"]);
});

test("runtime health check probes /api/health", () => {
  assert.deepEqual(inRuntime(/^HEALTHCHECK /), [
    "HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 " +
      "CMD wget --spider -q http://127.0.0.1:6239/api/health || exit 1",
  ]);
});

test("runtime runs as the unprivileged app user", () => {
  assert.deepEqual(inRuntime(/^USER /), ["USER app"]);
});

test("runtime starts the standalone server", () => {
  assert.deepEqual(inRuntime(/^(CMD|ENTRYPOINT) /), ['CMD ["node", "server.js"]']);
});
