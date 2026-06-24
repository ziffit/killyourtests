import { test, expect } from '../fixtures/spec-annotation';

test.describe('PROJ-0008: Juice Shop Basket Negative Tests', () => {
  test.setTimeout(60000);

  test.use({ viewport: { width: 390, height: 844 } });

  const registerAndLogin = async (page: import('@playwright/test').Page, email: string) => {
    // Schritte 1-4
    await page.goto('/#/login');
    await page.locator('button[aria-label="Close Welcome Banner"]').click();
    await page.locator('[aria-label="dismiss cookie message"]').click();
    await page.getByText('Not yet a customer?').click();
    await page.locator('input#emailControl').fill(email);
    await page.locator('input#passwordControl').fill('SuperSafe123!');
    await page.locator('input#repeatPasswordControl').fill('SuperSafe123!');
    await page.locator('.mat-select-trigger').click();
    await page.locator('mat-option').first().click();
    await page.locator('input#securityAnswerControl').fill('Alex');
    await page.locator('button#registerButton').click();
    await expect(page).toHaveURL(/.*\/login/);
    await page.locator('input#email').fill(email);
    await page.locator('input#password').fill('SuperSafe123!');
    await page.locator('button#loginButton').click();
    await expect(page.locator('button[aria-label="Show the shopping cart"]')).toBeVisible();
  };

  test('Checkout with empty basket is not possible @mobile', async ({ page }) => {
    const email = `user_proj0008_empty_${Date.now()}@example.com`;
    // Schritte 1-4 (via helper)
    await registerAndLogin(page, email);

    // Schritt 5
    await page.goto('/#/basket');
    await expect(page).toHaveURL(/.*\/basket/);

    // Schritt 6
    await expect(page.locator('button#checkoutButton')).toBeDisabled();
  });

  test('Remove all items from basket leaves basket empty @mobile', async ({ page }) => {
    const email = `user_proj0008_remove_${Date.now()}@example.com`;
    // Schritte 1-4 (via helper)
    await registerAndLogin(page, email);

    // Schritt 5
    await page.goto('/');
    await page.locator('.mat-search_icon-search').click();
    await page.waitForTimeout(500);
    await page.locator('input#mat-input-0').fill('Apple Juice');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    // Schritt 6
    await page.locator('[aria-label="Add to Basket"]').first().click();

    // Schritt 7
    await page.locator('button[aria-label="Show the shopping cart"]').click();
    await expect(page).toHaveURL(/.*\/basket/);

    // Schritt 8
    const appleRow = page.locator('mat-row:has-text("Apple Juice")');
    await expect(appleRow).toBeVisible();
    await appleRow.locator('button').last().click();

    // Schritt 9
    await expect(appleRow).not.toBeVisible();

    // Schritt 10
    await expect(page.locator('button#checkoutButton')).toBeDisabled();
  });
});
