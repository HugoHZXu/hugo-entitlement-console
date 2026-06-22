import { expect, test } from '@playwright/test';

test('opens the products page', async ({ page }) => {
  await page.goto('/products');

  await expect(page.getByRole('heading', { name: 'Products', level: 1 })).toBeVisible();
});
