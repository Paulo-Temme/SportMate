// Akzeptanztests F-08: Karte zeigt dieselben Treffen wie die Liste, Marker öffnet Details, Offline-Ersatz, kein seitliches Scrollen.
import { expect, test } from '@playwright/test';
import { eventCards, expectNoHorizontalOverflow, mapMarkers, openDiscover, readResultCount, revealMap } from './support';

test.describe('F-08 Karte mit denselben Treffen wie die Liste', () => {
  test('F-08 AK1: Anzahl der Marker entspricht der Trefferzahl, auch nach dem Filtern', async ({ page }) => {
    await openDiscover(page);
    const all = await readResultCount(page);
    await expect(mapMarkers(page)).toHaveCount(all);
    await expect(eventCards(page)).toHaveCount(all);
    await page.getByRole('button', { name: 'Fußball', exact: true }).click();
    const filtered = await readResultCount(page);
    expect(filtered).toBeLessThan(all);
    await expect(mapMarkers(page)).toHaveCount(filtered);
  });

  test('F-08 AK2: Klick auf einen Marker öffnet die Details und markiert ihn', async ({ page, isMobile }) => {
    await openDiscover(page);
    await revealMap(page, isMobile);
    const marker = page.locator('[data-testid="map-marker"][data-event-id="demo-tischtennis-duburg"]');
    await marker.click();
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
});
