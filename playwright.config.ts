import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.E2E_PORT ?? 6239);
const baseURL = `http://127.0.0.1:${port}`;
const chromiumExecutable = process.env.E2E_CHROMIUM_EXECUTABLE;

export default defineConfig({
  testDir: "tests/e2e",
  forbidOnly: !!process.env.CI,
  reporter: "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: chromiumExecutable ? { executablePath: chromiumExecutable } : {},
      },
    },
  ],
  webServer: {
    command: "node tests/e2e/standalone-server.mts",
    url: `${baseURL}/api/health`,
    reuseExistingServer: false,
    env: {
      NODE_ENV: "production",
      PORT: String(port),
      HOSTNAME: "127.0.0.1",
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
});
