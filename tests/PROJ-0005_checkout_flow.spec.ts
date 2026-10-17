import { test, expect } from '../fixtures/spec-annotation';

test.describe('PROJ-0005: Juice Shop Checkout Flow', () => {
  test.setTimeout(120000);

  test('Complete a full checkout flow from basket to order confirmation @regression @desktop', async ({ page }) => {
    const uniqueEmail = `user_proj0005_${Date.now()}@example.com`;

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

    // Schritt 6: Suche nach "Apple Juice" und lege 1 Stück in den Warenkorb
    await page.locator('.mat-search_icon-search').click();
    await page.waitForTimeout(500);
    await page.locator('input#mat-input-0').fill('Apple Juice');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    await page.locator('[aria-label="Add to Basket"]').first().click();
    await page.waitForTimeout(500);

    // Schritt 7: Navigiere zum Warenkorb (`/#/basket`)
    await page.goto('/#/basket');
    await expect(page).toHaveURL(/.*\/basket/);

    // Schritt 8: Klicke auf "Checkout"
    await page.locator('button#checkoutButton').click();
    await expect(page).toHaveURL(/.*\/address\/select/);

    // Schritt 9: Füge eine neue Adresse hinzu: Germany, Felix Tester, 1234567890, 12345, Teststreet 42, Testcity
    await page.locator('button[aria-label="Add a new address"]').click();
    await expect(page).toHaveURL(/.*\/address\/create/);
    await page.locator('input[placeholder="Please provide a country."]').fill('Germany');
    await page.locator('input[placeholder="Please provide a name."]').fill('Felix Tester');
    await page.locator('input[placeholder="Please provide a mobile number."]').fill('1234567890');
    await page.locator('input[placeholder="Please provide a ZIP code."]').fill('12345');
    await page.locator('textarea[placeholder="Please provide an address."]').fill('Teststreet 42');
    await page.locator('input[placeholder="Please provide a city."]').fill('Testcity');
    await page.locator('button#submitButton').click();

    // Schritt 10: Wähle die erste Adresse aus und klicke "Continue"
    await expect(page).toHaveURL(/.*\/address\/select/);
    await page.locator('mat-radio-button').first().click();
    await page.locator('button.btn-next').click();

    // Schritt 11: Wähle die Standard-Versandart aus und klicke "Continue"
    await expect(page).toHaveURL(/.*\/delivery-method/);
    await page.locator('mat-row').filter({ hasText: 'Standard Delivery' }).locator('mat-radio-button').click();
    await page.locator('button:has-text("Continue")').click();

    // Schritt 12: Füge eine neue Kreditkarte hinzu: Felix Tester, 1111222233334444, Ablauf 12/2099
    await expect(page).toHaveURL(/.*\/payment\/shop/);
    await page.locator('mat-expansion-panel-header').first().click();
    await page.locator('mat-expansion-panel input[type="text"]').first().fill('Felix Tester');
    await page.locator('mat-expansion-panel input[type="number"]').fill('1111222233334444');
    await page.locator('mat-expansion-panel select').first().selectOption('12');
    await page.locator('mat-expansion-panel select').last().selectOption('2099');
    await page.locator('button#submitButton').click();

    // Schritt 13: Wähle die Karte aus und klicke "Continue"
    await page.locator('mat-radio-button').first().click();
    await page.locator('button:has-text("Continue")').click();

    // Schritt 14: Klicke auf "Place your order and pay"
    await expect(page).toHaveURL(/.*\/order-summary/);
    await page.locator('button#checkoutButton').click();

    // Schritt 15: Verifiziere dass die Bestellbestätigung mit "Thank you for your purchase!" angezeigt wird
    await expect(page).toHaveURL(/.*\/order-completion/);
    await expect(page.locator('h1')).toContainText('Thank you for your purchase!');
  });
});
