// Akzeptanztests F-06/F-07/F-09: Filter nach Sportart, Zeitraum, Niveau, Alter und Freitext mit Leerzustand.
import { expect, test } from '@playwright/test';
import { eventCards, expectMapMatchesList, mapClusters, mapMarkers, openDiscover, readMapEventIds, readResultCount, withFilterPanel } from './support';

test.describe('F-06 Filter Sportart und Zeitraum', () => {
  test('F-06 AK1: Volleyball und Laufen zeigen genau diese Sportarten (Liste = Karte)', async ({ page }) => {
    await openDiscover(page);
    await page.getByRole('button', { name: 'Volleyball', exact: true }).click();
    await page.getByRole('button', { name: 'Laufen', exact: true }).click();
    await expect(page.getByRole('link', { name: 'Basketball auf dem Exe' })).toHaveCount(0);
    const count = await readResultCount(page);
    expect(count).toBeGreaterThan(1);
    await expect(eventCards(page)).toHaveCount(count);
    for (const text of await eventCards(page).allTextContents()) expect(text).toMatch(/Volleyball|Laufen/);
    await expectMapMatchesList(page);
    expect(await readMapEventIds(page)).toHaveLength(count);
  });

  test('F-06 AK2: "Morgen" zeigt nur Treffen von morgen', async ({ page }) => {
    await openDiscover(page);
    await withFilterPanel(page, () => page.getByRole('radio', { name: 'Morgen' }).check());
    await expect(eventCards(page).first()).toBeVisible();
    const days = await eventCards(page).locator('[class*="day"]').allTextContents();
    for (const day of days) expect(day).toBe('Morgen');
  });

  test('F-06 AK4: ohne Treffer erscheint der Leerzustand mit "Selbst ein Treffen erstellen"', async ({ page }) => {
    await openDiscover(page);
    await page.getByRole('button', { name: 'Tischtennis', exact: true }).click();
    await withFilterPanel(page, () => page.getByRole('radio', { name: 'Heute' }).check());
    await expect(page.getByRole('heading', { name: 'Keine Treffen gefunden' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Selbst ein Treffen erstellen' })).toBeVisible();
    await expect(mapMarkers(page)).toHaveCount(0);
    await expect(mapClusters(page)).toHaveCount(0);
  });

  test('F-06 AK5: "Filter zurücksetzen" zeigt wieder alle Treffen', async ({ page }) => {
    await openDiscover(page);
    const all = await readResultCount(page);
    await page.getByRole('button', { name: 'Tischtennis', exact: true }).click();
    await withFilterPanel(page, () => page.getByRole('radio', { name: 'Heute' }).check());
    await page.getByRole('button', { name: 'Filter zurücksetzen' }).click();
    await expect(page.getByTestId('result-count')).toHaveText(String(all));
    await expectMapMatchesList(page);
    expect(await readMapEventIds(page)).toHaveLength(all);
  });
});

test.describe('F-07 Filter Niveau und Altersgruppe', () => {
  test('F-07 AK1: "Anfänger" zeigt Anfänger- und Alle-Niveaus-Treffen', async ({ page }) => {
    await openDiscover(page);
    await withFilterPanel(page, () => page.getByRole('radio', { name: 'Anfänger' }).check());
    await expect(page.getByRole('link', { name: 'Basketball auf dem Exe' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Strandlauf Solitüde' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Fußball am Campus/ })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Lockere Laufrunde im Volkspark' })).toBeVisible();
  });

  test('F-07 AK2: "20–25" zeigt passende Treffen und solche ohne Altersgruppe', async ({ page }) => {
    await openDiscover(page);
    await withFilterPanel(page, () => page.getByRole('radio', { name: '20–25' }).check());
    await expect(page.getByRole('link', { name: 'Tischtennis in der Duburg' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Basketball auf dem Exe' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Lockere Laufrunde im Volkspark' })).toBeVisible();
  });

  test('F-07 AK3: kein passendes Treffen ergibt den Leerzustand', async ({ page }) => {
    await openDiscover(page);
    await page.getByRole('button', { name: 'Tischtennis', exact: true }).click();
    await withFilterPanel(page, () => page.getByRole('radio', { name: 'Fortgeschritten' }).check());
    await expect(page.getByRole('heading', { name: 'Keine Treffen gefunden' })).toBeVisible();
  });
});

test.describe('F-09 Freitextsuche', () => {
  test('F-09 AK1: "duburg" findet nur das Treffen in der Duburg', async ({ page }) => {
    await openDiscover(page);
    await page.getByRole('searchbox', { name: 'Treffen suchen' }).fill('duburg');
    await expect(page.getByTestId('result-count')).toHaveText('1');
    await expect(page.getByRole('link', { name: 'Tischtennis in der Duburg' })).toBeVisible();
  });

  test('F-09 AK2: nur Leerzeichen zeigt alle Treffen', async ({ page }) => {
    await openDiscover(page);
    const all = await readResultCount(page);
    await page.getByRole('searchbox', { name: 'Treffen suchen' }).fill('   ');
    await expect(page.getByTestId('result-count')).toHaveText(String(all));
  });
});
