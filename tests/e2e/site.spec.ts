import { expect, test } from "@playwright/test";

const SITE_URL = "https://score.levo-studio.com";

const pages = [
  {
    path: "/",
    title: "Score – Abi-Planer für Baden-Württemberg",
    heading: { level: 2, name: /^Dein Abischnitt\.\s*Live mitgerechnet\.$/ },
  },
  {
    path: "/datenschutz",
    title: "Datenschutz · Score",
    heading: { level: 1, name: "Deine Noten bleiben bei dir" },
  },
  {
    path: "/impressum",
    title: "Impressum · Score",
    heading: { level: 1, name: "Angaben gemäß § 5 DDG" },
  },
];

for (const { path, title, heading } of pages) {
  test(`${path} renders without errors or third-party requests`, async ({ page, baseURL }) => {
    const errors: string[] = [];
    const thirdPartyRequests: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (url.protocol.startsWith("http") && url.origin !== new URL(baseURL!).origin) {
        thirdPartyRequests.push(request.url());
      }
    });

    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(title);
    await expect(page.getByRole("heading", { ...heading, exact: true })).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
    expect(thirdPartyRequests).toEqual([]);
  });
}

test("/api/health reports the service as ok", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/json");

  const body = await response.json();
  expect(Object.keys(body).sort()).toEqual(["service", "status", "timestamp"]);
  expect(body).toMatchObject({ status: "ok", service: "score-website" });
  expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
});

test("/robots.txt allows crawling and points to the sitemap", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/plain");
  expect(await response.text()).toBe(`User-Agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
});

test("/sitemap.xml lists every page", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("xml");

  const locations = [...(await response.text()).matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
  expect(locations).toEqual([SITE_URL, `${SITE_URL}/datenschutz`, `${SITE_URL}/impressum`]);
});

test("theme toggle switches the theme and keeps it across reloads", async ({ page }) => {
  const html = page.locator("html");
  const storedTheme = () => page.evaluate(() => localStorage.getItem("score-theme"));

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(html).not.toHaveAttribute("data-theme", "light");
  expect(await storedTheme()).toBeNull();

  await page.getByRole("button", { name: "Zu hellem Design wechseln" }).click();
  await expect(html).toHaveAttribute("data-theme", "light");
  expect(await storedTheme()).toBe("light");

  await page.reload();
  await page.waitForLoadState("networkidle");
  await expect(html).toHaveAttribute("data-theme", "light");

  await page.getByRole("button", { name: /^Zu (hellem|dunklem) Design wechseln$/ }).click();
  await expect(html).toHaveAttribute("data-theme", "dark");
  expect(await storedTheme()).toBe("dark");

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");
});

test("unknown routes answer with 404", async ({ page }) => {
  const response = await page.goto("/diese-seite-gibt-es-nicht");
  expect(response?.status()).toBe(404);
});
