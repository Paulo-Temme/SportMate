// Akzeptanztests F-31: Startseite unter "/" mit Erklärung, drei Schritten, Vorschau echter Treffen und zwei Einstiegen.
import { expect, test } from '@playwright/test';
import { eventCards, expectNoHorizontalOverflow, signInAsDemo } from './support';

test.describe('F-31 Startseite', () => {
  test('F-31 AK1: "/" zeigt Überschrift, drei Schritte und beide Einstiege, ohne Tab-Leiste', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('SportMate – Sporttreffen in Flensburg');
    await expect(page.getByRole('heading', { level: 1, name: /Sport in Flensburg/ })).toBeVisible();
    const steps = page.getByRole('region', { name: "So funktioniert's" }).getByRole('heading', { level: 3 });
    await expect(steps).toHaveText(['Finden', 'Mitmachen', 'Spielen']);
    await expect(page.getByRole('link', { name: 'Treffen entdecken' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Treffen erstellen' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Hauptnavigation' })).toHaveCount(0);
  });

  test('F-31 AK2: "Treffen entdecken" öffnet /entdecken mit Karte und Liste', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Treffen entdecken' }).click();
    await expect(page).toHaveURL(/\/entdecken$/);
    await expect(page).toHaveTitle('Treffen entdecken · SportMate');
    await expect(page.getByRole('region', { name: 'Karte offline' })).toBeVisible();
    await expect(eventCards(page).first()).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link', { name: 'Entdecken' })).toHaveAttribute('aria-current', 'page');
  });

  test('F-31 AK3: Gäste landen bei "Treffen erstellen" in der Anmeldung', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Treffen erstellen' }).click();
    await expect(page).toHaveURL(/\/anmelden/);
    await expect(page.getByRole('heading', { level: 1, name: 'Anmelden' })).toBeVisible();
  });

  test('F-31 AK3: Angemeldete kommen über "Treffen erstellen" direkt zum Formular', async ({ page }) => {
    await signInAsDemo(page, 'Lea');
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Profil' })).toBeVisible();
    await page.getByRole('link', { name: 'Treffen erstellen' }).click();
    await expect(page).toHaveURL(/\/erstellen$/);
  });

  test('F-31 AK4: Vorschau zeigt bis zu vier echte kommende Treffen, ein Marker führt zu den Details', async ({ page }) => {
    await page.goto('/');
    const markers = page.getByTestId('preview-marker');
    await expect(markers.first()).toBeVisible();
    const count = await markers.count();
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(4);
    const href = await markers.first().getAttribute('href');
    expect(href).toMatch(/^\/treffen\/demo-/);
    await markers.first().click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.getByTestId('event-detail')).toBeVisible();
  });

  test('F-31 AK6: kein seitliches Scrollen bei 360 px Breite', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/');
    await expect(page.getByTestId('preview-marker').first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test('F-31 AK6: mit reduzierter Bewegung lädt die Seite vollständig und ohne Fehler', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: /Sport in Flensburg/ })).toBeVisible();
    await expect(page.getByTestId('preview-marker').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Treffen entdecken' })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('F-31 AK7: Logo in der Seitenleiste führt von Entdecken zurück zur Startseite', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Die Seitenleiste mit Logo gibt es nur auf dem Desktop.');
    await page.goto('/entdecken');
    await page.getByRole('link', { name: 'SportMate, zur Startseite' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { level: 1, name: /Sport in Flensburg/ })).toBeVisible();
  });

  test('F-31 AK7: "Anmelden" im Kopf der Startseite führt zur Anmeldung', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Anmelden' }).click();
    await expect(page).toHaveURL(/\/anmelden$/);
  });
});
