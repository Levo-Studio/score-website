import { cpSync, existsSync, rmSync } from "node:fs";

// Serves the production build with the same file layout as the runtime stage
// of Dockerfile.dokploy: static assets and public/ next to the standalone server.
const root = new URL("../../", import.meta.url);
const standalone = new URL(".next/standalone/", root);
const server = new URL("server.js", standalone);

if (!existsSync(server)) {
  throw new Error("No standalone build found. Run `pnpm build` first.");
}

for (const [from, to] of [
  [".next/static/", ".next/static/"],
  ["public/", "public/"],
]) {
  const target = new URL(to, standalone);
  rmSync(target, { recursive: true, force: true });
  cpSync(new URL(from, root), target, { recursive: true });
}

await import(server.href);
