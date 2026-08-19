import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Next's file tracer misses this ESM helper under pnpm's symlinked node_modules,
  // so the standalone build ships a dangling symlink and crashes on boot. Force it in.
  outputFileTracingIncludes: {
    "/**": ["./node_modules/@swc/helpers/**/*"],
  },
};

export default nextConfig;
