import { test, expect } from "@playwright/test";

test("Homepage loads correctly", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page).toHaveTitle(/Linqis/);
  await expect(page.getByText("Every meeting, decoded.")).toBeVisible();
  await expect(page.getByText("AI-powered meeting intelligence")).toBeVisible();
});

test("Sign Up page is accessible", async ({ page }) => {
  await page.goto("http://localhost:3000/sign-up");
  await expect(page.getByText("Create your account")).toBeVisible();
});

test("Integrations section lists real integrations", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const integrations = page.locator("#integrations");
  await expect(integrations.getByText("Notion")).toBeVisible();
  await expect(integrations.getByText("Zoom")).toBeVisible();
});

test("Ask your meetings section is visible", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page.locator("#ask").getByText("Ask your meetings anything.")).toBeVisible();
});

test("Use cases section lists all four roles", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const useCases = page.locator("#use-cases");
  await expect(useCases.getByText("Product Manager")).toBeVisible();
  await expect(useCases.getByText("Engineering Lead")).toBeVisible();
  await expect(useCases.getByText("Founder / Executive")).toBeVisible();
  await expect(useCases.getByText("Designer")).toBeVisible();
});

test("Security section is visible", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page.locator("#security").getByText("Your meetings stay yours.")).toBeVisible();
});

test("FAQ accordion expands on click", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const faqItem = page.locator("#faq details").first();
  await expect(faqItem.locator("p")).toBeHidden();
  await faqItem.locator("summary").click();
  await expect(faqItem.locator("p")).toBeVisible();
});

test("Navbar anchors point to the new sections", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page.locator('nav a[href="/#use-cases"]')).toBeVisible();
  await expect(page.locator('nav a[href="/#security"]')).toBeVisible();
});
