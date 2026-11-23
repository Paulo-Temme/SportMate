import { expect, test } from '@playwright/test';

// Die Startseite ist seit F-05 die Entdecken-Ansicht statt des Platzhalters "im Aufbau".
test('F-00 AK8: Startseite lädt mit Titel und Hauptnavigation', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/SportMate/);
  await expect(page.getByRole('navigation', { name: 'Hauptnavigation' })).toBeVisible();
  await expect(page.getByTestId('result-count')).toBeVisible();
});
