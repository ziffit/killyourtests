import { test, expect } from '../fixtures/spec-annotation';

test.describe('PROJ-0001: Juice Shop Login Test', () => {
  test('Successful Login with a test user @regression @fast @desktop', async ({ page }) => {
    const testEmail = `user_proj0001_${Date.now()}@example.com`;
    const testPassword = 'SuperSafe123!';

    // Schritt 1: Navigiere zur Login-Seite (`/#/login`)
    await page.goto('/#/login');

    // Schritt 2: Schließe den Welcome-Banner und den Cookie-Consent-Banner
    await page.locator('button[aria-label="Close Welcome Banner"]').click();
    await page.locator('[aria-label="dismiss cookie message"]').click();

    // Schritt 3: Klicke auf "Not yet a customer?"
    await page.getByText('Not yet a customer?').click();

    // Schritt 4: Registriere einen neuen Benutzer mit einer eindeutigen E-Mail und Passwort SuperSafe123!, Sicherheitsfrage "Your eldest siblings middle name?" und Antwort "Alex"
    await page.locator('input#emailControl').fill(testEmail);
    await page.locator('input#passwordControl').fill(testPassword);
    await page.locator('input#repeatPasswordControl').fill(testPassword);
    await page.locator('.mat-select-trigger').click();
    await page.locator('mat-option').first().click();
    await page.locator('input#securityAnswerControl').fill('Alex');
    await page.locator('button#registerButton').click();

    // Schritt 5: Logge dich mit der erstellten E-Mail und SuperSafe123! ein
    await expect(page).toHaveURL(/.*\/login/);
    await page.locator('input#email').fill(testEmail);
    await page.locator('input#password').fill(testPassword);
    await page.locator('button#loginButton').click();

    // Schritt 6: Verifiziere dass das Warenkorb-Symbol in der Navigationsleiste sichtbar ist
    await expect(page.locator('button[aria-label="Show the shopping cart"]')).toBeVisible();
  });
});
