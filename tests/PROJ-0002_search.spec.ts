import { test, expect } from '@playwright/test';

test.describe('PROJ-0002: Juice Shop Product Search Test', () => {
  test('Search for apple juice and verify results @desktop', async ({ page }) => {
    // Schritt 1
    await page.goto('/');

    // Schritt 2
    await page.locator('button[aria-label="Close Welcome Banner"]').click();
    await page.locator('[aria-label="dismiss cookie message"]').click();

    // Schritt 3
    await page.locator('.mat-search_icon-search').click();
    const searchInput = page.locator('input#mat-input-0');
    await searchInput.fill('apple');
    await page.keyboard.press('Enter');

    // Schritt 4
    const results = page.locator('mat-grid-tile:has-text("Apple Juice")');
    await expect(results.first()).toBeVisible();

    // Schritt 5
    await expect(page.locator('mat-grid-tile:has-text("Banana Milkshake")')).not.toBeVisible();
  });
});
