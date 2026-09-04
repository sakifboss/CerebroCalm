import { test, expect } from "@playwright/test";

test.describe("CerebroCalm Recovery Companion Core Flows", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("1. First Launch & Calm Photophobia UI", async ({ page }) => {
    // Check main title
    await expect(page).toHaveTitle(/CerebroCalm/i);
    // Check presence of 3 core recovery questions
    await expect(page.locator("text=1. How am I feeling?")).toBeVisible();
    await expect(page.locator("text=2. What should I do now?")).toBeVisible();
    await expect(page.locator("text=3. When should I take a break?")).toBeVisible();
  });

  test("2. Fast Symptom Logging", async ({ page }) => {
    await page.click("text=Log Symptoms");
    await expect(page).toHaveURL(/.*symptoms/);

    // Verify 1-5 tactile scales are present
    await expect(page.locator("text=1. How is your head right now?")).toBeVisible();

    // Select ratings
    await page.click('button[role="radio"][aria-checked="false"] >> text=3');
    
    // Save entry
    await page.click('button:has-text("Save Recovery Check")');
    await expect(page.locator("text=Check Logged Safely")).toBeVisible();
  });

  test("3. Start Cognitive Pacing Session", async ({ page }) => {
    await page.goto("/pacing");
    await expect(page.locator("text=Cognitive Pacing Assistant")).toBeVisible();

    // Click start activity
    await page.click('button:has-text("Start Activity Session")');
    await expect(page.locator("text=Paced Activity Block")).toBeVisible();

    // Pause timer
    await page.click('button:has-text("Pause Timer")');
    await expect(page.locator("text=Activity Paused")).toBeVisible();
  });

  test("4. Enter Dark Sanctuary & Box Breathing", async ({ page }) => {
    await page.goto("/sanctuary");
    await page.click('button:has-text("Enter Dark Sanctuary Now")');

    // Sanctuary overlay should open
    await expect(page.locator("text=Dark Sanctuary — Sensory Rest")).toBeVisible();
    await expect(page.locator("text=Recovery Rest Countdown")).toBeVisible();

    // Close sanctuary
    await page.click('button[aria-label="Exit Dark Sanctuary"]');
    await expect(page.locator("text=Dark Sanctuary — Sensory Rest")).not.toBeVisible();
  });

  test("5. View Recovery Trends", async ({ page }) => {
    await page.goto("/insights");
    await expect(page.locator("text=Recovery Insights & Trends")).toBeVisible();
    await expect(page.locator("text=Symptom Burden Trend")).toBeVisible();

    // Toggle table fallback view
    await page.click('button:has-text("Table")');
    await expect(page.locator("table")).toBeVisible();
  });

  test("6. Trigger Simulated Safety Warning Override", async ({ page }) => {
    // Open demo tools if not visible
    const enableDemoBtn = page.locator('button:has-text("Enable Demo Tools")');
    if (await enableDemoBtn.isVisible()) {
      await enableDemoBtn.click();
    }

    // Click Trigger Red Flag in Demo banner
    await page.click('button:has-text("Trigger Red Flag")');

    // Verify deterministic safety modal overrides interface
    await expect(page.locator("text=Emergency Safety Alert")).toBeVisible();
    await expect(page.locator("text=Urgent Medical Evaluation Required")).toBeVisible();
    await expect(page.locator("text=Call 911 / Emergency")).toBeVisible();

    // Acknowledge and close
    await page.click('button:has-text("I Acknowledge / Close")');
    await expect(page.locator("text=Urgent Medical Evaluation Required")).not.toBeVisible();
  });

  test("7. Change Accessibility & Theme Settings", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.locator("text=Display Theme")).toBeVisible();

    // Select Low-Light theme
    await page.click('button:has-text("Low-Light")');
    await expect(page.locator("html")).toHaveClass(/theme-low-light/);

    // Toggle Reduce Motion
    await page.click('button:has-text("Off")');
    await expect(page.locator("html")).toHaveClass(/reduce-motion/);
  });
});
