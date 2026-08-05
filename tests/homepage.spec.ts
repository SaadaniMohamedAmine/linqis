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
