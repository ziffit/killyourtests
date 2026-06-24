import { test, expect } from '../fixtures/spec-annotation';

test.describe('PROJ-0001: Juice Shop Login Test', () => {
  test('Successful Login with a test user @desktop', async ({ page }) => {
    const testEmail = `user_proj0001_${Date.now()}@example.com`;
    const testPassword = 'SuperSafe123!';

    // Schritt 1
    await page.goto('/#/login');

    // Schritt 2
    await page.locator('button[aria-label="Close Welcome Banner"]').click();
    await page.locator('[aria-label="dismiss cookie message"]').click();

    // Schritt 3
    await page.getByText('Not yet a customer?').click();

    // Schritt 4
    await page.locator('input#emailControl').fill(testEmail);
    await page.locator('input#passwordControl').fill(testPassword);
    await page.locator('input#repeatPasswordControl').fill(testPassword);
    await page.locator('.mat-select-trigger').click();
    await page.locator('mat-option').first().click();
    await page.locator('input#securityAnswerControl').fill('Alex');
    await page.locator('button#registerButton').click();

    // Schritt 5
    await expect(page).toHaveURL(/.*\/login/);
    await page.locator('input#email').fill(testEmail);
    await page.locator('input#password').fill(testPassword);
    await page.locator('button#loginButton').click();

    // Schritt 6
    await expect(page.locator('button[aria-label="Show the shopping cart"]')).toBeVisible();
  });
});
