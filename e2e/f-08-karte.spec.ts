// Akzeptanztests F-08: Karte zeigt dieselben Treffen wie die Liste, Marker öffnet Details, Offline-Ersatz, kein seitliches Scrollen.
import { expect, test } from '@playwright/test';
import {
  clickMapMarker,
  eventCards,
  expectMapMatchesList,
  expectNoHorizontalOverflow,
  mapClusters,
  mapMarkers,
  openDiscover,
  readMapEventIds,
  readResultCount,
  revealMap,
} from './support';

test.describe('F-08 Karte mit denselben Treffen wie die Liste', () => {
  test('F-08 AK1: Karte zeigt genau die Treffen der Liste (einzeln oder gruppiert), auch nach dem Filtern', async ({ page }) => {
    await openDiscover(page);
    const all = await readResultCount(page);
    await expect(eventCards(page)).toHaveCount(all);
    await expectMapMatchesList(page);
    expect(await readMapEventIds(page)).toHaveLength(all);
    await page.getByRole('button', { name: 'Fußball', exact: true }).click();
    const filtered = await readResultCount(page);
    expect(filtered).toBeLessThan(all);
    await expectMapMatchesList(page);
    expect(await readMapEventIds(page)).toHaveLength(filtered);
  });

  test('F-08 AK2: Klick auf einen Marker öffnet die Details und markiert ihn', async ({ page, isMobile }) => {
    await openDiscover(page);
    await revealMap(page, isMobile);
    const marker = await clickMapMarker(page, 'demo-tischtennis-duburg');
    await expect(page).toHaveURL(/\/treffen\/demo-tischtennis-duburg$/);
    await expect(page.getByRole('heading', { level: 2, name: 'Tischtennis in der Duburg' })).toBeVisible();
    await expect(marker).toHaveAttribute('aria-pressed', 'true');
  });

  test('F-08 AK3: ohne Kartenkacheln bleibt die Liste bedienbar und die Karte ist als offline gekennzeichnet', async ({ page }) => {
    await openDiscover(page);
    await expect(page.getByText('Karte offline')).toBeVisible();
    await expect(page.getByText(/Karte nicht verfügbar/)).toBeVisible();
    await page.getByRole('link', { name: 'Basketball auf dem Exe' }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Basketball auf dem Exe' })).toBeVisible();
  });

  test('F-08 AK4: bei 360 px Breite gibt es kein seitliches Scrollen', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await openDiscover(page);
    await expectNoHorizontalOverflow(page);
    await page.getByRole('link', { name: 'Basketball auf dem Exe' }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Basketball auf dem Exe' })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.goto('/anmelden');
    await expect(page.getByRole('heading', { level: 1, name: 'Anmelden' })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test('F-08 AK5: Marker und Gruppen überlappen sich nicht', async ({ page, isMobile }) => {
    await openDiscover(page);
    await revealMap(page, isMobile);
    await expectMapMatchesList(page);
    const pills = page.locator('[data-testid="map-marker"] [data-part="pill"], [data-testid="map-cluster"] [data-part="pill"]');
    const boxes = [];
    for (const pill of await pills.all()) boxes.push(await pill.boundingBox());
    expect(boxes.length).toBeGreaterThan(1);
    for (let first = 0; first < boxes.length; first += 1) {
      for (let second = first + 1; second < boxes.length; second += 1) {
        const a = boxes[first]!;
        const b = boxes[second]!;
        const overlaps = a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
        expect(overlaps, `Marker ${first} und ${second} überlappen`).toBe(false);
      }
    }
  });

  test('F-08 AK6: Klick auf eine Gruppe mit Anzahl fächert ihre Treffen einzeln auf', async ({ page, isMobile }) => {
    await openDiscover(page);
    await revealMap(page, isMobile);
    const cluster = mapClusters(page).first();
    await expect(cluster).toBeVisible();
    const ids = ((await cluster.getAttribute('data-event-ids')) ?? '').split(' ');
    expect(ids.length).toBeGreaterThan(1);
    await expect(cluster).toContainText(String(ids.length));
    await cluster.click();
    for (const id of ids) await expect(page.locator(`[data-testid="map-marker"][data-event-id="${id}"]`)).toBeVisible();
    await page.getByRole('button', { name: 'Alle Treffen auf der Karte zeigen' }).click();
    await expectMapMatchesList(page);
    await expect(mapMarkers(page).or(mapClusters(page)).first()).toBeVisible();
  });
});
