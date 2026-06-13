import { test, expect } from '@playwright/test';

test.describe('PROJ-0002: Juice Shop Product Search Test', () => {
  test('Search for apple juice and verify results @desktop', async ({ page }) => {
    // Schritt 1
    await page.goto('/');

    // Schritt 2
    await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
    await page.getByRole('button', { name: 'dismiss cookie message' }).click().catch(() => {});

    // Schritt 3
    await page.locator('.mat-search_icon-search').click();
    await page.getByRole('textbox').fill('apple');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    // Schritt 4
    await expect(page.getByText('Apple Juice').first()).toBeVisible();

    // Schritt 5
    await expect(page.getByText('Banana Milkshake')).not.toBeVisible();
  });
});
