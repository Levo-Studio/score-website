import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const { packageManager } = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8"));
const ci = readFileSync(new URL("../../.github/workflows/ci.yml", import.meta.url), "utf8");

test("package.json pins one exact pnpm version", () => {
  assert.match(packageManager, /^pnpm@\d+\.\d+\.\d+$/);
});

test("CI takes the pnpm version from package.json", () => {
  const lines = ci.split(/\r?\n/);
  const start = lines.findIndex((line) => /^\s*-\s+uses:\s*pnpm\/action-setup@/.test(line));
  assert.notEqual(start, -1, "pnpm/action-setup step missing");
  const indent = lines[start].indexOf("-");
  const end = lines.findIndex((line, i) => i > start && line.trim() !== "" && line.search(/\S/) <= indent);
  const step = lines.slice(start + 1, end === -1 ? undefined : end);
  assert.ok(!step.some((line) => /^\s*version:/.test(line)), "pnpm/action-setup must not set its own version");
});
