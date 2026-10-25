import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const workflowsDir = new URL("../../.github/workflows/", import.meta.url);
const readWorkflow = (name: string) => readFileSync(new URL(name, workflowsDir), "utf8");

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
