// Akzeptanztests F-17: Treffen in drei Schritten erstellen, Fehler am Feld, Erfolg mit Weiterleitung.
import { expect, test, type Page } from '@playwright/test';
import { signInAsDemo } from './support';

async function openWizard(page: Page) {
  await signInAsDemo(page, 'Lea');
  await page.getByRole('link', { name: 'Treffen erstellen' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Was wird gespielt?' })).toBeVisible();
}

async function fillUntilDetails(page: Page) {
  await page.getByRole('radio', { name: 'Volleyball' }).check();
  await page.getByLabel('Titel').fill('Volleyball am Abend');
  await page.getByRole('button', { name: 'Weiter' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Wo und wann?' })).toBeVisible();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Details' })).toBeVisible();
}

test.describe('F-17 Treffen erstellen', () => {
  test('F-17 AK1: veröffentlichtes Treffen erscheint mit "7 von 8 Plätzen frei", Lea ist dabei', async ({ page }) => {
    await openWizard(page);
    await fillUntilDetails(page);
    await page.getByLabel('Treffpunkt').fill('Halle Sandberg, Eingang Nord');
    await page.getByLabel('Plätze insgesamt').fill('8');
    await page.getByRole('button', { name: 'Veröffentlichen' }).click();
    await expect(page).toHaveURL(/\/treffen\/[^/]+$/);
    const detail = page.getByTestId('event-detail');
    await expect(detail.getByRole('heading', { level: 2, name: 'Volleyball am Abend' })).toBeVisible();
    await expect(detail.getByText('7 von 8 Plätzen frei')).toBeVisible();
    await expect(detail.getByText('Organisiert von dir')).toBeVisible();
  });

  test('F-17 AK1: zu kurzer Titel wird in Schritt 1 am Feld gemeldet', async ({ page }) => {
    await openWizard(page);
    await page.getByLabel('Titel').fill('V');
    await page.getByRole('button', { name: 'Weiter' }).click();
    await expect(page.getByText(/Bitte einen Titel mit 3–80 Zeichen/)).toBeVisible();
    await expect(page.getByLabel('Titel')).toHaveAttribute('aria-invalid', 'true');
  });

  test('F-17 AK2: ohne Treffpunkt wird nichts gespeichert und das Feld ist markiert', async ({ page }) => {
    await openWizard(page);
    await fillUntilDetails(page);
    await page.getByRole('button', { name: 'Veröffentlichen' }).click();
    await expect(page.getByText(/Bitte den Treffpunkt/)).toBeVisible();
    await expect(page.getByLabel('Treffpunkt')).toHaveAttribute('aria-invalid', 'true');
    await expect(page).toHaveURL(/\/erstellen$/);
  });

  test('F-17 AK3: Ende vor Beginn wird in Schritt 2 gemeldet', async ({ page }) => {
    await openWizard(page);
    await page.getByLabel('Titel').fill('Volleyball am Abend');
    await page.getByRole('button', { name: 'Weiter' }).click();
    await page.getByLabel('Beginn').fill('18:00');
    await page.getByLabel('Ende').fill('17:00');
    await page.getByRole('button', { name: 'Weiter' }).click();
    await expect(page.getByText('Das Ende muss nach dem Beginn liegen.')).toBeVisible();
  });

  test('F-17 AK4: 51 Plätze werden abgelehnt', async ({ page }) => {
    await openWizard(page);
    await fillUntilDetails(page);
    await page.getByLabel('Treffpunkt').fill('Halle Sandberg, Eingang Nord');
    await page.getByLabel('Plätze insgesamt').fill('51');
    await page.getByRole('button', { name: 'Veröffentlichen' }).click();
    await expect(page.getByText(/zwischen 2 und 50/)).toBeVisible();
    await expect(page).toHaveURL(/\/erstellen$/);
  });

  test('F-17 AK5: "Treffen erstellen" ist auf 360 px ohne Scrollen sichtbar', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Treffen erstellen' }).first()).toBeInViewport();
  });
});
