import { test, expect } from '@playwright/test';

test.describe('PROJ-0005: Juice Shop Checkout Flow', () => {
  test('Complete a full checkout flow from basket to order confirmation @desktop', async ({ page }) => {
    const uniqueEmail = `user_proj0005_${Date.now()}@example.com`;

    // Schritt 1
    await page.goto('/#/login');

    // Schritt 2
    await page.locator('button[aria-label="Close Welcome Banner"]').click();
    await page.locator('[aria-label="dismiss cookie message"]').click();

    // Schritt 3
    await page.getByText('Not yet a customer?').click();
    await page.locator('input#emailControl').fill(uniqueEmail);
    await page.locator('input#passwordControl').fill('SuperSafe123!');
    await page.locator('input#repeatPasswordControl').fill('SuperSafe123!');
    await page.locator('.mat-select-trigger').click();
    await page.locator('mat-option').first().click();
    await page.locator('input#securityAnswerControl').fill('Alex');
    await page.locator('button#registerButton').click();

    // Schritt 4
    await expect(page).toHaveURL(/.*\/login/);
    await page.locator('input#email').fill(uniqueEmail);
    await page.locator('input#password').fill('SuperSafe123!');
    await page.locator('button#loginButton').click();

    // Schritt 5
    await expect(page.locator('button[aria-label="Show the shopping cart"]')).toBeVisible();
    await page.goto('/');

    // Schritt 6
    await page.locator('.mat-search_icon-search').click();
    await page.waitForTimeout(500);
    await page.locator('input#mat-input-0').fill('Apple Juice');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    await page.locator('[aria-label="Add to Basket"]').first().click();
    await page.waitForTimeout(500);
    await page.goto('/#/basket');

    // Schritt 7
    await expect(page).toHaveURL(/.*\/basket/);

    // Schritt 8
    await page.locator('button#checkoutButton').click();
    await expect(page).toHaveURL(/.*\/address\/select/);

    // Schritt 9
    await page.locator('button[aria-label="Add a new address"]').click();
    await expect(page).toHaveURL(/.*\/address\/create/);
    await page.locator('input[placeholder="Please provide a country."]').fill('Germany');
    await page.locator('input[placeholder="Please provide a name."]').fill('Felix Tester');
    await page.locator('input[placeholder="Please provide a mobile number."]').fill('1234567890');
    await page.locator('input[placeholder="Please provide a ZIP code."]').fill('12345');
    await page.locator('textarea[placeholder="Please provide an address."]').fill('Teststreet 42');
    await page.locator('input[placeholder="Please provide a city."]').fill('Testcity');
    await page.locator('button#submitButton').click();

    // Schritt 10
    await expect(page).toHaveURL(/.*\/address\/select/);
    await page.locator('mat-radio-button').first().click();
    await page.locator('button.btn-next').click();

    // Schritt 11
    await expect(page).toHaveURL(/.*\/delivery-method/);
    await page.locator('mat-row').filter({ hasText: 'Standard Delivery' }).locator('mat-radio-button').click();
    await page.locator('button:has-text("Continue")').click();

    // Schritt 12
    await expect(page).toHaveURL(/.*\/payment\/shop/);
    await page.locator('mat-expansion-panel-header').first().click();
    await page.locator('mat-expansion-panel input[type="text"]').first().fill('Felix Tester');
    await page.locator('mat-expansion-panel input[type="number"]').fill('1111222233334444');
    await page.locator('mat-expansion-panel select').first().selectOption('12');
    await page.locator('mat-expansion-panel select').last().selectOption('2099');
    await page.locator('button#submitButton').click();

    // Schritt 13
    await page.locator('mat-radio-button').first().click();
    await page.locator('button:has-text("Continue")').click();

    // Schritt 14
    await expect(page).toHaveURL(/.*\/order-summary/);
    await page.locator('button#checkoutButton').click();

    // Schritt 15
    await expect(page).toHaveURL(/.*\/order-completion/);
    await expect(page.locator('h1')).toContainText('Thank you for your purchase!');
  });
});
