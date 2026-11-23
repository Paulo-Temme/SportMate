// Akzeptanztests F-02 und F-32: Stöbern ohne Konto, Anmeldung erst beim Mitmachen mit Rücksprung, Demo-Hinweis.
// Der frühere Erstbesuch-Hinweis (F-31) ist durch die Startseite ersetzt; deren Tests stehen in f-31-landing.spec.ts.
import { expect, test } from '@playwright/test';
import { openDiscover, openEventFromList, readResultCount } from './support';

test.describe('F-02 Ohne Konto stöbern', () => {
  test('F-02 AK1: Gäste sehen Treffen und Details ohne Anmeldeaufforderung', async ({ page }) => {
    await openDiscover(page);
    expect(await readResultCount(page)).toBeGreaterThanOrEqual(3);
    await openEventFromList(page, 'Basketball auf dem Exe');
    await expect(page).not.toHaveURL(/anmelden/);
  });

  test('F-02 AK2/AK3: "Jetzt teilnehmen" führt zur Anmeldung und danach zurück, ohne automatisch beizutreten', async ({ page }) => {
    await openDiscover(page);
    await openEventFromList(page, 'Badminton zu zweit');
    await page.getByTestId('event-detail').getByRole('button', { name: 'Jetzt teilnehmen' }).click();
    await expect(page).toHaveURL(/\/anmelden\?weiter=%2Ftreffen%2Fdemo-badminton-halle$/);
    await page.getByRole('button', { name: 'Lea – als Demo-Person anmelden' }).click();
    await expect(page).toHaveURL(/\/treffen\/demo-badminton-halle$/);
    const detail = page.getByTestId('event-detail');
    await expect(detail.getByText('1 von 2 Plätzen frei')).toBeVisible();
    await detail.getByRole('button', { name: 'Jetzt teilnehmen' }).click();
    await expect(page.getByRole('status').getByText('Du bist dabei', { exact: true })).toBeVisible();
    await expect(detail.getByText('Du bist dabei')).toBeVisible();
  });

  test('F-02 AK4: Gäste landen bei "Treffen erstellen" in der Anmeldung', async ({ page }) => {
    await openDiscover(page);
    await page.getByRole('link', { name: 'Treffen erstellen' }).first().click();
    await expect(page).toHaveURL(/\/anmelden/);
    await expect(page.getByRole('heading', { level: 1, name: 'Anmelden' })).toBeVisible();
  });
});

test('F-32 AK1: im lokalen Modus steht dauerhaft der Demo-Hinweis', async ({ page }) => {
  await page.goto('/entdecken');
  await expect(page.getByText('Demo-Modus – Beispieldaten, Änderungen gehen beim Neuladen verloren')).toBeVisible();
  await page.goto('/profil');
  await expect(page.getByText('Demo-Modus – Beispieldaten, Änderungen gehen beim Neuladen verloren')).toBeVisible();
});
