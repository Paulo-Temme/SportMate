import { expect, test } from '@playwright/test';

// Die Startseite ist seit F-05 die Entdecken-Ansicht statt des Platzhalters "im Aufbau".
test('F-00 AK8: Startseite lädt mit Titel und Hauptnavigation', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/SportMate/);
  await expect(page.getByRole('navigation', { name: 'Hauptnavigation' })).toBeVisible();
  await expect(page.getByTestId('result-count')).toBeVisible();
});

// Seit devIndicators: false verdeckt kein Entwicklerknopf mehr die Tab-Leiste; echte Klicks statt page.goto.
test('F-05 AK5: Tab-Leiste führt per Klick zu allen vier Zielen und zurück zu Entdecken', async ({ page }) => {
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Hauptnavigation' });
  await navigation.getByRole('link', { name: 'Meine Treffen' }).click();
  await expect(page).toHaveURL(/\/meine-treffen$/);
  await navigation.getByRole('link', { name: 'Treffen erstellen' }).click();
  await expect(page).toHaveURL(/\/erstellen$/);
  await navigation.getByRole('link', { name: 'Profil' }).click();
  await expect(page).toHaveURL(/\/profil$/);
  await navigation.getByRole('link', { name: 'Entdecken' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(navigation.getByRole('link', { name: 'Entdecken' })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('button', { name: 'Open Next.js Dev Tools' })).toHaveCount(0);
});
