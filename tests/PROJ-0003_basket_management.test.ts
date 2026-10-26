import { test, expect } from '../fixtures/spec-annotation';

test.describe('Juice Shop Basket Management', () => {
  test('Add products, modify quantities, delete one item and verify total value @regression @desktop', async ({ page }) => {
    const uniqueEmail = `user_proj0003_${Date.now()}@example.com`;

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

    // Schritt 5: Navigiere zur Startseite (`/`) – nach dem Login automatisch erreicht, kein eigener Aufruf nötig

    // Schritt 6: Suche nach "Apple Juice" und lege 1 Stück in den Warenkorb
    await page.locator('.mat-search_icon-search').click();
    await page.waitForTimeout(500);
    await page.locator('input#mat-input-0').fill('Apple Juice');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    await page.locator('[aria-label="Add to Basket"]').first().click();
    await page.waitForTimeout(500);

    // Schritt 7: Suche nach "Banana Juice" und lege 1 Stück in den Warenkorb
    await page.locator('input#mat-input-0').fill('');
    await page.locator('input#mat-input-0').fill('Banana Juice');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    await page.locator('[aria-label="Add to Basket"]').first().click();
    await page.waitForTimeout(500);

    // Schritt 8: Navigiere zum Warenkorb (`/#/basket`)
    await page.locator('button[aria-label="Show the shopping cart"]').click();
    await expect(page).toHaveURL(/.*\/basket/);

    // Schritt 9: Verifiziere dass sowohl Apple Juice als auch Banana Juice in der Tabelle aufgeführt sind
    const appleRow = page.locator('mat-row:has-text("Apple Juice")');
    const bananaRow = page.locator('mat-row:has-text("Banana Juice")');
    await expect(appleRow).toBeVisible();
    await expect(bananaRow).toBeVisible();

    // Schritt 10: Erhöhe die Menge von Apple Juice um 1
    await appleRow.locator('button').nth(1).click();

    // Schritt 11: Entferne Banana Juice aus dem Warenkorb
    await bananaRow.locator('button').last().click();

    // Schritt 12: Verifiziere dass nur noch Apple Juice im Warenkorb ist
    await expect(bananaRow).not.toBeVisible();

    // Schritt 13: Verifiziere dass der Gesamtpreis dem doppelten Apple-Juice-Preis entspricht
    await expect(appleRow).toBeVisible();
    await expect(page.locator('#price')).toContainText('3.98');
  });
});
