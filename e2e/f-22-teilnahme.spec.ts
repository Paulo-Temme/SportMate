// Akzeptanztests F-22/F-23/F-24/F-18: beitreten, voll, zurückziehen, Meine Treffen, absagen.
import { expect, test } from '@playwright/test';
import { eventCards, openEventFromList, signInAsDemo } from './support';

async function openDiscoverSignedIn(page: import('@playwright/test').Page, name: string) {
  await signInAsDemo(page, name);
  // Neu laden statt Tab-Klick: Die Anmeldung bleibt im Browser, die Demo-Treffen starten frisch.
  await page.goto('/');
  await expect(page.getByTestId('result-count')).toBeVisible();
  const close = page.getByRole('button', { name: 'Hinweis schließen' });
  if (await close.isVisible()) await close.click();
}

test.describe('F-22 Einem Treffen beitreten', () => {
  test('F-22 AK5: Karten mit freien Plätzen tragen "Jetzt teilnehmen"', async ({ page }) => {
    await page.goto('/');
    const card = eventCards(page).filter({ hasText: 'Basketball auf dem Exe' });
    await expect(card.getByRole('button', { name: /Jetzt teilnehmen/ })).toBeVisible();
  });

  test('F-22 AK1: Beitritt zeigt "Du bist angemeldet", danach ausgebucht und unter Meine Treffen', async ({ page }) => {
    await openDiscoverSignedIn(page, 'Lea');
    await openEventFromList(page, 'Badminton zu zweit');
    const detail = page.getByTestId('event-detail');
    await detail.getByRole('button', { name: 'Jetzt teilnehmen' }).click();
    await expect(page.getByRole('status').getByText('Du bist angemeldet')).toBeVisible();
    await expect(detail.getByText('Ausgebucht', { exact: true })).toBeVisible();
    await page.getByRole('link', { name: 'Meine Treffen' }).click();
    await expect(page.getByTestId('my-event').filter({ hasText: 'Badminton zu zweit' })).toContainText('Angemeldet');
  });

  test('F-22 AK1: Beitritt direkt aus der Liste', async ({ page }) => {
    await openDiscoverSignedIn(page, 'Lea');
    const card = eventCards(page).filter({ hasText: 'Basketball auf dem Exe' });
    await card.getByRole('button', { name: /Jetzt teilnehmen/ }).click();
    await expect(page.getByRole('status').getByText('Du bist angemeldet')).toBeVisible();
    await expect(card.getByText('Dabei')).toBeVisible();
    await expect(card.getByText('5 von 10 Plätzen frei')).toBeVisible();
  });

  test('F-22 AK2: ausgebuchtes Treffen bietet keinen Beitritt', async ({ page }) => {
    await openDiscoverSignedIn(page, 'Lea');
    const card = eventCards(page).filter({ hasText: 'Volleyball an der Hafenspitze' });
    await expect(card.getByRole('button', { name: /Ausgebucht/ })).toBeDisabled();
    await openEventFromList(page, 'Volleyball an der Hafenspitze');
    const detail = page.getByTestId('event-detail');
    await expect(detail.getByRole('button', { name: 'Ausgebucht' })).toBeDisabled();
    await expect(detail.getByRole('button', { name: 'Jetzt teilnehmen' })).toHaveCount(0);
  });
});

test('F-23 AK1: Teilnahme zurückziehen gibt den Platz frei und entfernt das Treffen aus Meine Treffen', async ({ page }) => {
  await openDiscoverSignedIn(page, 'Tom');
  await openEventFromList(page, 'Strandlauf Solitüde');
  const detail = page.getByTestId('event-detail');
  await expect(detail.getByText('10 von 12 Plätzen frei')).toBeVisible();
  await detail.getByRole('button', { name: 'Teilnahme zurückziehen' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Zurückziehen' }).click();
  await expect(page.getByRole('status').getByText('Teilnahme zurückgezogen')).toBeVisible();
  await expect(detail.getByText('11 von 12 Plätzen frei')).toBeVisible();
  await page.getByRole('link', { name: 'Meine Treffen' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Meine Treffen' })).toBeVisible();
  await expect(page.getByTestId('my-event').filter({ hasText: 'Strandlauf Solitüde' })).toHaveCount(0);
});

test.describe('F-24 Meine Treffen', () => {
  test('F-24 AK1/AK2: zeigt organisierte Treffen mit "Organisiert von dir" und abgesagte mit "Abgesagt"', async ({ page }) => {
    await signInAsDemo(page, 'Lea');
    await page.getByRole('link', { name: 'Meine Treffen' }).click();
    await page.getByRole('tab', { name: 'Ich organisiere' }).click();
    await expect(page.getByTestId('my-event').filter({ hasText: 'Strandlauf Solitüde' })).toContainText('Organisiert von dir');
    await expect(page.getByTestId('my-event').filter({ hasText: 'Beachvolleyball am Ostseebad' })).toContainText('Abgesagt');
  });

  test('F-24 AK3: ohne Teilnahmen erscheint "Noch keine Treffen" mit Link zur Übersicht', async ({ page }) => {
    await signInAsDemo(page, 'Lea');
    await page.getByRole('link', { name: 'Meine Treffen' }).click();
    await expect(page.getByText('Noch keine Treffen')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Zur Übersicht' })).toBeVisible();
  });
});

test('F-18 AK1: Organisatorin sagt ab; Treffen ist abgesagt und verschwindet aus Liste und Karte', async ({ page }) => {
  await openDiscoverSignedIn(page, 'Lea');
  await openEventFromList(page, 'Strandlauf Solitüde');
  const detail = page.getByTestId('event-detail');
  await detail.getByRole('button', { name: 'Treffen absagen' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Treffen absagen' }).click();
  await expect(page.getByRole('status').getByText('Treffen abgesagt')).toBeVisible();
  await expect(detail.getByText(/^Abgesagt/).first()).toBeVisible();
  await page.getByRole('button', { name: 'Alle Treffen' }).click();
  await expect(page.getByRole('link', { name: 'Strandlauf Solitüde' })).toHaveCount(0);
  await expect(page.locator('[data-testid="map-marker"][data-event-id="demo-laufen-solitude"]')).toHaveCount(0);
});
