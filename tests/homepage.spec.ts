import { test, expect } from "@playwright/test";

test("Homepage loads correctly", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await expect(page).toHaveTitle(/Linqis/);
  await expect(page.getByText("Every meeting, decoded.")).toBeVisible();
});

test("Sign Up page is accessible", async ({ page }) => {
  await page.goto("http://localhost:3000/sign-up");
  await expect(page.getByText("Create your account")).toBeVisible();
});
