// Akzeptanztests F-02 und F-31/F-32: Stöbern ohne Konto, Anmeldung erst beim Mitmachen mit Rücksprung, Erstbesuch-Hinweis, Demo-Hinweis.
import { expect, test } from '@playwright/test';
import { eventCards, openDiscover, openEventFromList, readResultCount } from './support';

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
    await expect(page.getByRole('status').getByText('Du bist angemeldet')).toBeVisible();
    await expect(detail.getByText('Du bist dabei')).toBeVisible();
  });

  test('F-02 AK4: Gäste landen bei "Treffen erstellen" in der Anmeldung', async ({ page }) => {
    await openDiscover(page);
    await page.getByRole('link', { name: 'Treffen erstellen' }).first().click();
    await expect(page).toHaveURL(/\/anmelden/);
    await expect(page.getByRole('heading', { level: 1, name: 'Anmelden' })).toBeVisible();
  });
});

test('F-31 AK1/AK2: Erstbesuch-Hinweis erklärt SportMate in drei Schritten und bleibt nach dem Schließen weg', async ({ page }) => {
  await page.goto('/');
  const hint = page.getByRole('complementary', { name: /Sporttreffen in Flensburg/ });
  await expect(hint).toBeVisible();
  await expect(hint.getByText('Sportart auswählen')).toBeVisible();
  await expect(hint.getByText('Treffen finden')).toBeVisible();
  await expect(hint.getByText('Gemeinsam Sport machen')).toBeVisible();
  await hint.getByRole('button', { name: 'Treffen entdecken' }).click();
  await expect(hint).toBeHidden();
  await page.reload();
  await expect(eventCards(page).first()).toBeVisible();
  await expect(page.getByRole('complementary', { name: /Sporttreffen in Flensburg/ })).toHaveCount(0);
});

test('F-32 AK1: im lokalen Modus steht dauerhaft der Demo-Hinweis', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Demo-Modus – Beispieldaten, nichts wird gespeichert')).toBeVisible();
  await page.goto('/profil');
  await expect(page.getByText('Demo-Modus – Beispieldaten, nichts wird gespeichert')).toBeVisible();
});
