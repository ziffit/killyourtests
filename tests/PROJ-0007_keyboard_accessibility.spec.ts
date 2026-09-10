import { test, expect } from '../fixtures/spec-annotation';

test.describe('PROJ-0007: Juice Shop Keyboard-Only Accessibility', () => {
  test.setTimeout(180000);

  test('Complete checkout flow using only keyboard navigation @accessibility @regression @desktop', async ({ page }) => {
    const uniqueEmail = `user_proj0007_${Date.now()}@example.com`;
    const password = 'SuperSafe123!';

    const closeBanners = async () => {
      await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
      await page.getByRole('button', { name: 'dismiss cookie message' }).click();
    };

    const addProduct = async (productName: string) => {
      await page.goto('/');
      await page.locator('.mat-search_icon-search').click();
      await page.getByRole('textbox').fill(productName);
      await page.keyboard.press('Enter');
      await page.locator('mat-grid-tile').first().getByRole('button', { name: 'Add to Basket' }).click();
      await page.locator('.mat-simple-snackbar-action button').click();
    };

    // Schritt 1
    await page.goto('/#/login');

    // Schritt 2
    await closeBanners();

    // Schritt 3
    await page.getByText('Not yet a customer?').press('Enter');

    // Schritt 4
    await page.locator('input#emailControl').focus();
    await page.keyboard.type(uniqueEmail);
    await page.keyboard.press('Tab');
    await page.keyboard.type(password);
    await page.keyboard.press('Tab');
    await page.keyboard.type(password);
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
    await page.keyboard.type(password);
    await page.locator('button#loginButton').click();

    // Schritt 6
    await expect(page.locator('button[aria-label="Show the shopping cart"]')).toBeVisible();
    await page.goto('/');

    // Schritt 7
    await addProduct('Apple Juice');

    // Schritt 8
    await addProduct('Banana Juice');

    // Schritt 9
    await page.locator('button[aria-label="Show the shopping cart"]').click();
    await expect(page).toHaveURL(/.*\/basket/);

    // Schritt 10
    await expect(page.locator('mat-row:has-text("Apple Juice")')).toBeVisible();
    await expect(page.locator('mat-row:has-text("Banana Juice")')).toBeVisible();

    // Schritt 11
    await page.locator('button#checkoutButton').click();
    await expect(page).toHaveURL(/.*\/address\/select/);

    // Schritt 12
    await page.locator('button[aria-label="Add a new address"]').click();
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
    await page.locator('button#submitButton').click();
    await expect(page).toHaveURL(/.*\/address\/select/);

    // Schritt 13
    await page.locator('mat-radio-button').first().click();
    await page.locator('button.btn-next').click();

    // Schritt 14
    await expect(page).toHaveURL(/.*\/delivery-method/);
    await page.locator('mat-row').filter({ hasText: 'Standard Delivery' }).locator('mat-radio-button').click();
    await page.locator('button:has-text("Continue")').click();

    // Schritt 15
    await expect(page).toHaveURL(/.*\/payment\/shop/);
    await page.locator('.mat-simple-snackbar-action button').click().catch(() => {});
    await page.locator('mat-expansion-panel-header').first().click();
    await page.locator('mat-expansion-panel input[type="text"]').first().fill('Peter Meier');
    await page.locator('mat-expansion-panel input[type="number"]').fill('1234567890123456');
    await page.locator('mat-expansion-panel select').first().selectOption('4');
    await page.locator('mat-expansion-panel select').last().selectOption('2099');
    await expect(page.locator('button#submitButton')).toBeEnabled();
    await page.locator('button#submitButton').click();
    await expect(page.locator('mat-radio-button')).toHaveCount(1);

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
