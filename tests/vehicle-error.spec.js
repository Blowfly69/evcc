import { test, expect } from "@playwright/test";
import { start, stop, baseUrl } from "./evcc";

test.use({ baseURL: baseUrl() });

test.beforeAll(async () => {
  await start("vehicle-error.evcc.yaml");
});
test.afterAll(async () => {
  await stop();
});

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("vehicle startup error", async () => {
  test("broken vehicle: normal title and 'not reachable' icon", async ({ page }) => {
    await expect(page.getByTestId("vehicle-name")).toHaveText("Broken Tesla");
    await expect(page.getByTestId("vehicle-not-reachable-icon")).toBeVisible();
  });

  test("guest vehicle: normal title and no icon", async ({ page }) => {
    // switch to offline vehicle
    await page.getByTestId("change-vehicle").locator("select").selectOption("Guest vehicle");

    await expect(page.getByTestId("vehicle-name")).toHaveText("Guest vehicle");
    await expect(page.getByTestId("vehicle-not-reachable-icon")).not.toBeVisible();
  });
});
