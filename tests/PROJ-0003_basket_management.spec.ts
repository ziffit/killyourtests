import { test, expect } from '@playwright/test';

test.describe('PROJ-0003: Juice Shop Basket Management', () => {
  test('Add products, modify quantities, delete one item and verify total value @desktop', async ({ page }) => {
    const uniqueEmail = `user_proj0003_${Date.now()}@example.com`;

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
    await page.locator('.mat-search_icon-search').click();
    await page.waitForTimeout(500);
    await page.locator('input#mat-input-0').fill('Apple Juice');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    // Schritt 6
    await page.locator('[aria-label="Add to Basket"]').first().click();
    await page.waitForTimeout(500);

    // Schritt 7
    await page.locator('input#mat-input-0').fill('');
    await page.locator('input#mat-input-0').fill('Banana Juice');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    await page.locator('[aria-label="Add to Basket"]').first().click();
    await page.waitForTimeout(500);

    // Schritt 8
    await page.locator('button[aria-label="Show the shopping cart"]').click();
    await expect(page).toHaveURL(/.*\/basket/);

    // Schritt 9
    const appleRow = page.locator('mat-row:has-text("Apple Juice")');
    const bananaRow = page.locator('mat-row:has-text("Banana Juice")');
    await expect(appleRow).toBeVisible();
    await expect(bananaRow).toBeVisible();

    // Schritt 10
    await appleRow.locator('button').nth(1).click();

    // Schritt 11
    await bananaRow.locator('button').last().click();

    // Schritt 12
    await expect(bananaRow).not.toBeVisible();

    // Schritt 13
    await expect(appleRow).toBeVisible();
    await expect(page.locator('#price')).toContainText('3.98');
  });
});
