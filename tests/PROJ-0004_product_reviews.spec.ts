import { test, expect } from '../fixtures/spec-annotation';

test.describe('PROJ-0004: Juice Shop Product Reviews', () => {
  test('Add a new review to a product and verify it is visible @desktop', async ({ page }) => {
    const uniqueEmail = `user_proj0004_${Date.now()}@example.com`;

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
    await page.locator('mat-grid-tile:has-text("Apple Juice")').first().click();

    // Schritt 7
    const reviewsPanel = page.locator('mat-expansion-panel-header:has-text("Reviews")');
    await expect(reviewsPanel).toBeVisible();
    await reviewsPanel.click();

    // Schritt 8
    const reviewInput = page.locator('[contenteditable="true"], textarea, input:not([type])');
    await reviewInput.first().fill('Sensational taste! Highly recommended.');
    await page.locator('button:has-text("Submit")').click();

    // Schritt 9
    await expect(page.locator('.cdk-overlay-pane').first()).toContainText(
      'Sensational taste! Highly recommended.'
    );

    // Schritt 10
    await page.locator('button[aria-label="Close Dialog"]').click();
    await expect(page.locator('mat-dialog-container')).not.toBeVisible();
  });
});
