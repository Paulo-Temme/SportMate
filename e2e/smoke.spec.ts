import { expect, test } from '@playwright/test';

test('F-00 AK8: Startseite lädt und zeigt den Platzhalter', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/SportMate/);
  await expect(page.getByRole('heading', { level: 1, name: 'SportMate' })).toBeVisible();
  await expect(page.getByText('im Aufbau')).toBeVisible();
});
