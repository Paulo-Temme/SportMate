// Akzeptanztests F-05: Liste kommender Treffen mit freien Plätzen, ausgebuchte zuletzt, abgesagte nicht sichtbar.
import { expect, test } from '@playwright/test';
import { eventCards, openDiscover } from './support';

test.describe('F-05 Liste kommender Treffen', () => {
  test('F-05 AK1: zeigt nur kommende, nicht abgesagte Treffen', async ({ page }) => {
    await openDiscover(page);
    await expect(page).toHaveTitle(/SportMate/);
    await expect(eventCards(page).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Beachvolleyball am Ostseebad' })).toHaveCount(0);
  });

  test('F-05 AK2: Karte zeigt "x von y Plätzen frei"', async ({ page }) => {
    await openDiscover(page);
    const card = eventCards(page).filter({ hasText: 'Fußball am Campus' });
    await expect(card.getByText('5 von 10 Plätzen frei')).toBeVisible();
  });

  test('F-05 AK3: ausgebuchte Treffen stehen am Ende und tragen "Ausgebucht"', async ({ page }) => {
    await openDiscover(page);
    const last = eventCards(page).last();
    await expect(last).toContainText('Volleyball an der Hafenspitze');
    await expect(last.getByText('Ausgebucht').first()).toBeVisible();
  });

  test('F-05 AK2: Meta-Angaben brechen ohne Trennpunkt am Zeilenanfang um (320 px)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await openDiscover(page);
    await expect(eventCards(page).first()).toBeVisible();
    const report = await page.locator('[data-part="meta-row"]').evaluateAll((rows) =>
      rows.map((row) => {
        const rowLeft = row.getBoundingClientRect().left;
        const clipMatch = /inset\(([^)]*)\)/.exec(getComputedStyle(row).clipPath);
        const clipLeft = clipMatch ? parseFloat(clipMatch[1].trim().split(/\s+/).at(-1) ?? '0') : 0;
        const items = [...row.children].map((child) => {
          const rect = child.getBoundingClientRect();
          const dot = getComputedStyle(child, '::before');
          const hasDot = dot.content !== 'none' && dot.content !== 'normal';
          return { startsLine: Math.abs(rect.left - rowLeft) < 1, hasDot, dotWidth: parseFloat(dot.width) || 0, height: rect.height };
        });
        return { clipLeft, items };
      }),
    );
    expect(report.length).toBeGreaterThan(0);
    // Bei 320 px bricht mindestens eine Zeile um; sonst prüfte der Test nichts.
    expect(report.some((row) => row.items.slice(1).some((item) => item.startsLine))).toBe(true);
    for (const row of report) {
      for (const item of row.items) {
        // Ein Element am Zeilenanfang trägt seinen Trennpunkt im abgeschnittenen Rand: unsichtbar.
        if (item.startsLine && item.hasDot) {
          expect(item.dotWidth).toBeGreaterThan(0);
          expect(row.clipLeft).toBeGreaterThanOrEqual(item.dotWidth);
        }
        // Kein Element bricht in sich um (eine Zeile hoch).
        expect(item.height).toBeLessThan(24);
      }
    }
  });

  test('F-05 AK2: Niveau, Alter und Kosten passen auf Mobilgeräten in eine Zeile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'nur mobil relevant');
    await openDiscover(page);
    const facts = eventCards(page).filter({ hasText: 'Basketball auf dem Exe' }).locator('[data-part="meta-row"]').nth(1);
    await expect(facts).toContainText('Alter: 20–25 Jahre');
    const tops = await facts.evaluate((row) => [...row.children].map((child) => Math.round(child.getBoundingClientRect().top)));
    expect(tops).toHaveLength(3);
    expect(new Set(tops).size).toBe(1);
  });
});
