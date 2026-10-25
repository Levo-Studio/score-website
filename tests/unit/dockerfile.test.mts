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

test("all stages build on the same base image", () => {
  const images = instructions.filter(isFrom).map((instruction) => instruction.split(" ")[1]);
  assert.ok(images.length > 0, "no FROM instruction found");
  assert.deepEqual(new Set(images).size, 1, `different base images: ${images.join(", ")}`);
});

test("runtime listens on port 6239", () => {
  assert.deepEqual(inRuntime(/^ENV PORT[= ]/), ["ENV PORT=6239"]);
  assert.deepEqual(inRuntime(/^EXPOSE /), ["EXPOSE 6239"]);
});

test("runtime health check probes /api/health", () => {
  assert.deepEqual(instructions.filter((instruction) => /^HEALTHCHECK /.test(instruction)), [
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
