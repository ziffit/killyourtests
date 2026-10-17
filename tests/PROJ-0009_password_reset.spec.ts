import { test, expect } from '../fixtures/spec-annotation';

test.describe('PROJ-0009: Juice Shop Password Reset Flow', () => {
  test.setTimeout(120000);

  test.use({ viewport: { width: 390, height: 844 } });

  test('Reset the password via security question and log in with the new password @regression @mobile', async ({ page, baseURL }) => {
    const uniqueEmail = `user_proj0009_${Date.now()}@example.com`;
    const oldPassword = 'SuperSafe123!';
    const newPassword = 'NewPass456!';

    // Vorbedingung: Die Sprache der Anwendung ist auf Deutsch eingestellt.
    await page.context().addCookies([{ name: 'language', value: 'de_DE', url: baseURL! }]);

    // Schritt 1: Gehe zur testbereiten Login-Seite (`/#/login`)
    await page.goto('/#/login');
    await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
    await page.getByRole('button', { name: 'dismiss cookie message' }).click();

    // Schritt 2: Klicke auf "Noch kein Kunde?"
    await page.getByText('Noch kein Kunde?').click();

    // Schritt 3: Registriere einen neuen Benutzer mit einer eindeutigen E-Mail-Adresse, dem Passwort SuperSafe123!, der Sicherheitsfrage "Zweitname deines ältesten Geschwisters?" und der Antwort "Alex"
    await page.locator('input#emailControl').fill(uniqueEmail);
    await page.locator('input#passwordControl').fill(oldPassword);
    await page.locator('input#repeatPasswordControl').fill(oldPassword);
    await page.locator('.mat-select-trigger').click();
    await page.getByRole('option', { name: 'Zweitname deines ältesten Geschwisters?' }).click();
    await page.locator('input#securityAnswerControl').fill('Alex');
    await page.locator('button#registerButton').click();

    // Schritt 4: Verifiziere dass die Meldung "Registrierung erfolgreich abgeschlossen. Du kannst dich jetzt anmelden." angezeigt wird
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.getByText('Registrierung erfolgreich abgeschlossen. Du kannst dich jetzt anmelden.')).toBeVisible();

    // Schritt 5: Klicke auf "Passwort vergessen?"
    // Mobile-Layout: Die Link-Mitte wird von der Passwort-mat-form-field überlagert, nur die sichtbare untere Hälfte ist klickbar.
    await page.getByRole('link', { name: 'Passwort vergessen?' }).click({ position: { x: 160, y: 18 } });

    // Schritt 6: Gib die E-Mail-Adresse des neuen Benutzers ein
    await page.locator('input#email').fill(uniqueEmail);

    // Schritt 7: Beantworte die Sicherheitsfrage mit "Alex"
    await expect(page.locator('input#securityAnswer')).toBeEnabled();
    await page.locator('input#securityAnswer').fill('Alex');

    // Schritt 8: Lege das neue Passwort NewPass456! fest
    await page.locator('input#newPassword').fill(newPassword);
    await page.locator('input#newPasswordRepeat').fill(newPassword);

    // Schritt 9: Klicke auf "Ändern"
    await page.locator('button#resetButton').click();

    // Schritt 10: Verifiziere dass die Meldung "Dein Passwort wurde erfolgreich geändert." angezeigt wird
    await expect(page.getByText('Dein Passwort wurde erfolgreich geändert.')).toBeVisible();

    // Schritt 11: Gehe zur testbereiten Login-Seite (`/#/login`)
    await page.goto('/#/login');

    // Schritt 12: Melde dich mit der E-Mail-Adresse des neuen Benutzers und dem neuen Passwort NewPass456! an
    await page.locator('input#email').fill(uniqueEmail);
    await page.locator('input#password').fill(newPassword);
    await page.locator('button#loginButton').click();

    // Schritt 13: Verifiziere dass das Warenkorb-Symbol oben rechts in der Navigationsleiste sichtbar ist
    await expect(page.locator('button[aria-label="Show the shopping cart"]')).toBeVisible();

    // Schritt 14: Öffne das Seitenmenü und klicke auf "Abmelden"
    await page.getByRole('button', { name: 'Open Sidenav' }).click();
    await page.locator('[aria-label="Logout"]').click();
    await page.waitForURL(/#\/$/);

    // Schritt 15: Gehe zur testbereiten Login-Seite (`/#/login`)
    await page.goto('/#/login');

    // Schritt 16: Versuche dich mit der E-Mail-Adresse des neuen Benutzers und dem alten Passwort SuperSafe123! anzumelden
    await page.locator('input#email').fill(uniqueEmail);
    await page.locator('input#password').fill(oldPassword);
    await page.locator('button#loginButton').click();

    // Schritt 17: Verifiziere dass die Fehlermeldung "Email-Adresse oder Passwort ungültig." angezeigt wird
    await expect(page.getByText('Email-Adresse oder Passwort ungültig.')).toBeVisible();
  });
});
