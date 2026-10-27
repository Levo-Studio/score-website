import { expect, test, type Page } from "@playwright/test";

// The e2e server runs the production build, so the CSP must not allow eval.
const CONTENT_SECURITY_POLICY =
  "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; " +
  "img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; " +
  "form-action 'self'; frame-ancestors 'none'";

const PERMISSIONS_POLICY =
  "accelerometer=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), hid=(), " +
  "magnetometer=(), microphone=(), midi=(), payment=(), serial=(), usb=()";

const expectedHeaders = {
  "content-security-policy": CONTENT_SECURITY_POLICY,
  "strict-transport-security": "max-age=63072000",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "DENY",
  "permissions-policy": PERMISSIONS_POLICY,
  "cross-origin-opener-policy": "same-origin",
};

const pagePaths = ["/", "/datenschutz", "/impressum"];

for (const path of [...pagePaths, "/api/health", "/robots.txt", "/sitemap.xml", "/diese-seite-gibt-es-nicht"]) {
  test(`${path} sends the security headers`, async ({ request }) => {
    const response = await request.get(path);
    const headers = response.headers();

    for (const [name, value] of Object.entries(expectedHeaders)) {
      expect(headers[name], name).toBe(value);
    }
    expect(headers["content-security-policy-report-only"]).toBeUndefined();
    expect(headers["x-powered-by"]).toBeUndefined();
    // Embedding the OG image and the icons elsewhere must keep working.
    expect(headers["cross-origin-resource-policy"]).toBeUndefined();
    expect(headers["cross-origin-embedder-policy"]).toBeUndefined();
  });
}

// Collects CSP violations from the page itself and from the browser console.
async function watchCspViolations(page: Page) {
  const consoleViolations: string[] = [];
  page.on("console", (message) => {
    if (/Content.Security.Policy/i.test(message.text())) consoleViolations.push(message.text());
  });
  await page.addInitScript(() => {
    const violations: string[] = [];
    (window as unknown as { __cspViolations: string[] }).__cspViolations = violations;
    document.addEventListener("securitypolicyviolation", (event) => {
      violations.push(`${event.effectiveDirective} blocked ${event.blockedURI || "inline"}`);
    });
  });
  return async () => [
    ...(await page.evaluate(() => (window as unknown as { __cspViolations: string[] }).__cspViolations)),
    ...consoleViolations,
  ];
}

// Scrolls in steps so every scroll-triggered animation actually runs.
async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = page.viewportSize()!.height / 2;
  for (let y = 0; y <= height; y += step) {
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(50);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
}

for (const path of pagePaths) {
  test(`${path} runs without CSP violations`, async ({ page }) => {
    const violations = await watchCspViolations(page);

    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await scrollThrough(page);

    const html = page.locator("html");
    const toggle = page.getByRole("navigation").getByRole("button");
    await toggle.click();
    await expect(html).toHaveAttribute("data-theme", "light");
    await scrollThrough(page);
    await toggle.click();
    await expect(html).toHaveAttribute("data-theme", "dark");

    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(await violations()).toEqual([]);
  });
}

test("the CSP is enforced and violations are detected", async ({ page }) => {
  const violations = await watchCspViolations(page);
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const blocked = await page.evaluate(
    () =>
      new Promise<boolean>((resolve) => {
        const script = document.createElement("script");
        script.src = "https://example.invalid/blocked.js";
        script.onload = () => resolve(false);
        script.onerror = () => resolve(true);
        document.head.append(script);
      }),
  );
  expect(blocked).toBe(true);
  await expect.poll(violations).toContainEqual(expect.stringContaining("script-src-elem blocked https://example.invalid"));
});
