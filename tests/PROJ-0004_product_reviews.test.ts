import { test, expect } from '../fixtures/spec-annotation';

test.describe('Juice Shop Product Reviews', () => {
  test('Add a new review to a product and verify it is visible @regression @desktop', async ({ page }) => {
    const uniqueEmail = `user_proj0004_${Date.now()}@example.com`;

    // Schritt 1: Navigiere zur Login-Seite (`/#/login`)
    await page.goto('/#/login');

    // Schritt 2: Schließe den Welcome-Banner und den Cookie-Consent-Banner
    await page.locator('button[aria-label="Close Welcome Banner"]').click();
    await page.locator('[aria-label="dismiss cookie message"]').click();

    // Schritt 3: Registriere einen neuen Benutzer mit einer eindeutigen E-Mail und Passwort SuperSafe123!
    await page.getByText('Not yet a customer?').click();
    await page.locator('input#emailControl').fill(uniqueEmail);
    await page.locator('input#passwordControl').fill('SuperSafe123!');
    await page.locator('input#repeatPasswordControl').fill('SuperSafe123!');
    await page.locator('.mat-select-trigger').click();
    await page.locator('mat-option').first().click();
    await page.locator('input#securityAnswerControl').fill('Alex');
    await page.locator('button#registerButton').click();

    // Schritt 4: Logge dich mit der erstellten E-Mail und SuperSafe123! ein
    await expect(page).toHaveURL(/.*\/login/);
    await page.locator('input#email').fill(uniqueEmail);
    await page.locator('input#password').fill('SuperSafe123!');
    await page.locator('button#loginButton').click();
    await expect(page.locator('button[aria-label="Show the shopping cart"]')).toBeVisible();

    // Schritt 5: Navigiere zur Startseite (`/`)
    await page.goto('/');

    // Schritt 6: Öffne die Produktdetail-Seite von "Apple Juice"
    await page.locator('mat-grid-tile:has-text("Apple Juice")').first().click();

    // Schritt 7: Klappe den Reviews-Abschnitt auf
    const reviewsPanel = page.locator('mat-expansion-panel-header:has-text("Reviews")');
    await expect(reviewsPanel).toBeVisible();
    await reviewsPanel.click();

    // Schritt 8: Gib "Sensational taste! Highly recommended." als Bewertung ein und sende sie ab
    const reviewInput = page.locator('[contenteditable="true"], textarea, input:not([type])');
    await reviewInput.first().fill('Sensational taste! Highly recommended.');
    await page.locator('button:has-text("Submit")').click();

    // Schritt 9: Verifiziere dass der Text "Sensational taste! Highly recommended." in der Bewertungsliste angezeigt wird
    await expect(page.locator('.cdk-overlay-pane').first()).toContainText(
      'Sensational taste! Highly recommended.'
    );

    // Schritt 10: Schließe das Detail-Modal
    await page.locator('button[aria-label="Close Dialog"]').click();
    await expect(page.locator('mat-dialog-container')).not.toBeVisible();
  });
});
