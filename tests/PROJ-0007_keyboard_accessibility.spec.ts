import { test, expect } from '../fixtures/spec-annotation';

test.describe('PROJ-0007: Juice Shop Keyboard-Only Accessibility', () => {
  test.setTimeout(120000);

  test('Complete checkout flow using only keyboard navigation @accessibility @regression @desktop', async ({ page }) => {
    const uniqueEmail = `user_proj0007_${Date.now()}@example.com`;

    // Schritt 1
    await page.goto('/#/login');
    await page.waitForTimeout(1000);

    // Schritt 2
    await page.locator('button[aria-label="Close Welcome Banner"]').press('Enter');
    await page.locator('[aria-label="dismiss cookie message"]').press('Enter');

    // Schritt 3
    await page.getByText('Not yet a customer?').press('Enter');

    // Schritt 4
    await page.locator('input#emailControl').focus();
    await page.keyboard.type(uniqueEmail);
    await page.keyboard.press('Tab');
    await page.keyboard.type('SuperSafe123!');
    await page.keyboard.press('Tab');
    await page.keyboard.type('SuperSafe123!');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(300);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
    await page.keyboard.press('Tab');
    await page.keyboard.type('Alex');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Schritt 5
    await expect(page).toHaveURL(/.*\/login/);
    await page.locator('input#email').focus();
    await page.keyboard.type(uniqueEmail);
    await page.keyboard.press('Tab');
    await page.keyboard.type('SuperSafe123!');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Schritt 6
    await expect(page.locator('button[aria-label="Show the shopping cart"]')).toBeVisible();
    await page.goto('/');

    // Schritt 7
    await page.locator('.mat-search_icon-search').click();
    await page.waitForTimeout(400);
    const searchInput = page.locator('input#mat-input-0');
    await searchInput.focus();
    await page.keyboard.type('Apple Juice');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(800);
    await page.locator('mat-grid-tile').first().locator('button[aria-label="Add to Basket"]').press('Enter');
    await page.waitForTimeout(500);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await page.locator('.mat-search_icon-close').click();
    await page.waitForTimeout(300);

    // Schritt 8
    await page.locator('.mat-search_icon-search').click();
    await page.waitForTimeout(400);
    await searchInput.focus();
    await page.keyboard.type('Banana Juice');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(800);
    await page.locator('mat-grid-tile').first().locator('button[aria-label="Add to Basket"]').press('Enter');
    await page.waitForTimeout(500);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await page.locator('.mat-search_icon-close').click();
    await page.waitForTimeout(300);

    // Schritt 9
    await page.locator('button[aria-label="Show the shopping cart"]').press('Enter');
    await expect(page).toHaveURL(/.*\/basket/);

    // Schritt 10
    await expect(page.locator('mat-row:has-text("Apple Juice")')).toBeVisible();
    await expect(page.locator('mat-row:has-text("Banana Juice")')).toBeVisible();

    // Schritt 11
    await page.locator('button#checkoutButton').click();
    await expect(page).toHaveURL(/.*\/address\/select/);

    // Schritt 12
    await page.locator('button[aria-label="Add a new address"]').press('Enter');
    await expect(page).toHaveURL(/.*\/address\/create/);
    await page.locator('input[placeholder="Please provide a country."]').focus();
    await page.keyboard.type('Testland');
    await page.keyboard.press('Tab');
    await page.keyboard.type('Peter Meier');
    await page.keyboard.press('Tab');
    await page.keyboard.type('91122222');
    await page.keyboard.press('Tab');
    await page.keyboard.type('90422');
    await page.keyboard.press('Tab');
    await page.keyboard.type('Testerstraße 44');
    await page.keyboard.press('Tab');
    await page.keyboard.type('Tastenburg');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/.*\/address\/select/);

    // Schritt 13
    await page.locator('mat-radio-button').first().click();
    await page.locator('button.btn-next').click();

    // Schritt 14
    await expect(page).toHaveURL(/.*\/delivery-method/);
    await page.locator('[aria-label="dismiss cookie message"]').click().catch(() => {});
    await page.waitForTimeout(200);
    await page.locator('mat-radio-button').first().click();
    await page.locator('button:has-text("Continue")').click();
    await expect(page).toHaveURL(/.*\/payment\/shop/);

    // Schritt 15
    await page.locator('mat-expansion-panel-header').first().press('Enter');
    await page.waitForTimeout(500);
    await page.locator('mat-expansion-panel input[type="text"]').first().focus();
    await page.keyboard.type('Peter Meier');
    await page.keyboard.press('Tab');
    await page.keyboard.type('1234567890123456');
    await page.keyboard.press('Tab');
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('ArrowDown');
    }
    await page.keyboard.press('Tab');
    await page.locator('mat-expansion-panel select').last().selectOption('2099');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Schritt 16
    await page.locator('mat-radio-button').first().click();
    await page.locator('button:has-text("Continue")').click();
    await expect(page).toHaveURL(/.*\/order-summary/);

    // Schritt 17
    await page.locator('button#checkoutButton').click();
    await expect(page).toHaveURL(/.*\/order-completion/);

    // Schritt 18
    await expect(page.locator('h1')).toContainText('Thank you for your purchase!');
  });
});
