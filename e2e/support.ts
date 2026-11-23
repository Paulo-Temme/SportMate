// Gemeinsame Schritte der Akzeptanztests: Entdecken öffnen, Hinweis schließen, als Demo-Person anmelden, Karte freilegen (F-05, F-08, F-32).
import { expect, type Page } from '@playwright/test';

/** Öffnet Entdecken, wartet auf die Trefferzahl und schließt den Erstbesuch-Hinweis. */
export async function openDiscover(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page.getByTestId('result-count')).toBeVisible();
  await dismissFirstVisitHint(page);
}

/** Schließt den Erstbesuch-Hinweis, falls er sichtbar ist. */
export async function dismissFirstVisitHint(page: Page): Promise<void> {
  const close = page.getByRole('button', { name: 'Hinweis schließen' });
  if (await close.isVisible()) await close.click();
}

/** Meldet als Demo-Person an (lokaler Modus) und wartet auf das Profil. */
export async function signInAsDemo(page: Page, name: string): Promise<void> {
  await page.goto('/anmelden');
  await page.getByRole('button', { name: `${name} – als Demo-Person anmelden` }).click();
  await expect(page).toHaveURL(/\/profil$/);
}

/** Liest die Trefferzahl aus dem Sheet-Kopf. */
export async function readResultCount(page: Page): Promise<number> {
  return Number(await page.getByTestId('result-count').textContent());
}

/** Karten der Trefferliste. */
export function eventCards(page: Page) {
  return page.getByTestId('event-card');
}

/** Marker auf der (Offline-)Karte. */
export function mapMarkers(page: Page) {
  return page.getByTestId('map-marker');
}

/** Klappt das Sheet auf Mobilgeräten auf die Spitze zusammen, damit die Karte frei liegt. */
export async function revealMap(page: Page, isMobile: boolean): Promise<void> {
  if (!isMobile) return;
  const sheet = page.locator('section[data-snap]');
  for (let attempt = 0; attempt < 3; attempt += 1) {
    if ((await sheet.getAttribute('data-snap')) === 'peek') return;
    await page.getByRole('button', { name: /Liste (vergrößern|verkleinern)/ }).click();
  }
  await expect(sheet).toHaveAttribute('data-snap', 'peek');
}

/** Öffnet die Details eines Treffens über seine Karte in der Liste. */
export async function openEventFromList(page: Page, title: string): Promise<void> {
  await page.getByRole('link', { name: title }).click();
  await expect(page.getByRole('heading', { level: 2, name: title })).toBeVisible();
}

/** Öffnet den Filterdialog, ruft `choose` auf und schließt ihn wieder. */
export async function withFilterPanel(page: Page, choose: () => Promise<void>): Promise<void> {
  await page.getByRole('button', { name: /^Filter/ }).click();
  await expect(page.getByRole('dialog', { name: 'Filter' })).toBeVisible();
  await choose();
  await page.getByRole('button', { name: 'Filter schließen' }).click();
  await expect(page.getByRole('dialog', { name: 'Filter' })).toBeHidden();
}

/** Prüft, dass die Seite nicht seitlich scrollt. */
export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}
