import { test, expect } from '../fixtures/spec-annotation';

test.describe('PROJ-0002: Juice Shop Product Search Test', () => {
  const doSearch = async (page: import('@playwright/test').Page, term: string) => {
    await page.locator('.mat-search_icon-search').click();
    await page.getByRole('textbox').fill(term);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
  };

  const goToTestReadyStartpage = async (page: import('@playwright/test').Page) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
    await page.getByRole('button', { name: 'dismiss cookie message' }).click().catch(() => {});
  };

  test('Search for products and verify results — apple @regression @fast @desktop', async ({ page }) => {
    await goToTestReadyStartpage(page);

    // Schritt 2
    await doSearch(page, 'apple');

    // Schritt 3
    await expect(page.getByText('Apple Juice').first()).toBeVisible();

    // Schritt 4
    await expect(page.getByText('Banana Milkshake')).not.toBeVisible();
  });

  test('Search for products and verify results — banana @regression @fast @desktop', async ({ page }) => {
    await goToTestReadyStartpage(page);

    // Schritt 2
    await doSearch(page, 'banana');

    // Schritt 3
    await expect(page.getByText('Banana Juice').first()).toBeVisible();

    // Schritt 4
    await expect(page.getByText('Apple Juice')).not.toBeVisible();
  });

  test('Search for products and verify results — carrot @regression @fast @desktop', async ({ page }) => {
    await goToTestReadyStartpage(page);

    // Schritt 2
    await doSearch(page, 'carrot');

    // Schritt 3
    await expect(page.getByText('Carrot Juice').first()).toBeVisible();

    // Schritt 4
    await expect(page.getByText('Apple Juice')).not.toBeVisible();
  });
});
