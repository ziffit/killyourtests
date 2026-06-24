import { test, expect } from '../fixtures/spec-annotation';

test.describe('PROJ-0006: Juice Shop Complex Checkout Flow', () => {
  test.setTimeout(120000);

  test.use({ viewport: { width: 390, height: 844 } });

  test('Complete a large order and verify detailed order confirmation @mobile', async ({ page }) => {
    const uniqueEmail = `user_proj0006_${Date.now()}@example.com`;
    const password = 'SuperSafe123!';

    const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const cityName = pickRandom(['Groß', 'Klein', 'Mittel', 'Ober', 'Unter']) +
      pickRandom(['rot', 'blau', 'grün', 'gelb']) +
      pickRandom(['apfel', 'bannen', 'kirschen', 'rüben', 'kohlen', 'rauken']) +
      pickRandom(['berg', 'thal', 'dorf', 'furt', 'bach']);

    // Schritt 1
    await page.goto('/#/login');

    // Schritt 2
    await page.locator('button[aria-label="Close Welcome Banner"]').click();
    await page.locator('[aria-label="dismiss cookie message"]').click();

    // Schritt 3
    await page.getByText('Not yet a customer?').click();
    await page.locator('input#emailControl').fill(uniqueEmail);
    await page.locator('input#passwordControl').fill(password);
    await page.locator('input#repeatPasswordControl').fill(password);
    await page.locator('.mat-select-trigger').click();
    await page.locator('mat-option').first().click();
    await page.locator('input#securityAnswerControl').fill('Alex');
    await page.locator('button#registerButton').click();

    // Schritt 4
    await expect(page).toHaveURL(/.*\/login/);
    await page.locator('input#email').fill(uniqueEmail);
    await page.locator('input#password').fill(password);
    await page.locator('button#loginButton').click();

    // Schritt 5
    await expect(page.locator('button[aria-label="Show the shopping cart"]')).toBeVisible();
    await page.goto('/');

    // Schritte 6-9: Produkte in den Warenkorb legen
    const doSearch = async (term: string) => {
      await page.goto('/');
      await page.waitForTimeout(300);
      await page.locator('.mat-search_icon-search').click();
      await page.waitForTimeout(500);
      await page.locator('input#mat-input-0').fill(term);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1500);
    };
    const addProduct = async (productName: string, quantity: number) => {
      await doSearch(productName);
      for (let i = 0; i < quantity; i++) {
        await page.locator('[aria-label="Add to Basket"]').first().click();
        await page.waitForTimeout(500);
        await page.locator('.mat-simple-snackbar-action button').click();
        await page.waitForTimeout(200);
      }
    };

    // Schritt 6
    await addProduct('Apple Pomace', 3);

    // Schritt 7
    await addProduct('Banana Juice', 10);

    // Schritt 8
    await addProduct('DSOMM', 1);

    // Schritt 9
    await addProduct('Carrot Juice (1000ml)', 1);

    // Schritt 10
    await page.locator('button[aria-label="Show the shopping cart"]').click();
    await expect(page).toHaveURL(/.*\/basket/);

    // Schritt 11
    await expect(page.locator('#price')).toContainText('80.76');

    // Schritt 12
    await page.locator('button#checkoutButton').click();
    await expect(page).toHaveURL(/.*\/address\/select/);

    // Schritt 13
    await page.locator('button[aria-label="Add a new address"]').click();
    await expect(page).toHaveURL(/.*\/address\/create/);
    await page.locator('input[placeholder="Please provide a country."]').fill('Testland');
    await page.locator('input[placeholder="Please provide a name."]').fill('Peter Meier');
    await page.locator('input[placeholder="Please provide a mobile number."]').fill('91122222');
    await page.locator('input[placeholder="Please provide a ZIP code."]').fill('90422');
    await page.locator('textarea[placeholder="Please provide an address."]').fill('Testerstraße 44');
    await page.locator('input[placeholder="Please provide a city."]').fill(cityName);
    await page.locator('button#submitButton').click();

    // Schritt 14
    await expect(page).toHaveURL(/.*\/address\/select/);
    await page.locator('mat-radio-button').first().click();
    await page.locator('button.btn-next').click();

    // Schritt 15
    await expect(page).toHaveURL(/.*\/delivery-method/);
    await page.locator('mat-row').filter({ hasText: '5 Days' }).locator('mat-radio-button').click();
    await page.locator('button:has-text("Continue")').click();

    // Schritt 16
    await expect(page).toHaveURL(/.*\/payment\/shop/);
    await page.locator('mat-expansion-panel-header').first().click();
    await page.locator('mat-expansion-panel input[type="text"]').first().fill('Peter Meier');
    await page.locator('mat-expansion-panel input[type="number"]').fill('1234567890123456');
    await page.locator('mat-expansion-panel select').first().selectOption('4');
    await page.locator('mat-expansion-panel select').last().selectOption('2099');
    await page.locator('button#submitButton').click();

    // Schritt 17
    await page.locator('mat-radio-button').first().click();
    await page.locator('button:has-text("Continue")').click();

    // Schritt 18
    await expect(page).toHaveURL(/.*\/order-summary/);
    await page.locator('button#checkoutButton').click();
    await expect(page).toHaveURL(/.*\/order-completion/);

    await page.waitForTimeout(1000);

    // Schritt 19
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText(/will be delivered in 5 days/i)).toBeVisible();

    // Schritt 20
    await expect(page.getByRole('cell', { name: 'Apple Pomace' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Banana Juice' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'DSOMM' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Carrot Juice' })).toBeVisible();

    // Schritt 21
    await expect(page.getByRole('cell', { name: '80.76' }).last()).toBeVisible();

    // Schritt 22
    await expect(page.getByText(/6 Bonus Points/)).toBeVisible();
  });
});
