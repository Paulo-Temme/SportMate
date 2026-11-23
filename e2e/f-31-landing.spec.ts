// Akzeptanztests F-31: Startseite unter "/" mit Sportzeile, drei Schritten, Sportarten, Kartenvorschau echter Treffen und Einstiegen.
import { expect, test, type Page } from '@playwright/test';
import { eventCards, expectNoHorizontalOverflow, signInAsDemo } from './support';

const sportLines = ['Zusammen auf den Platz.', 'Ein Team. Viele gute Bälle.', 'Zeit für ein paar Körbe.', 'Einfach den Ball ins Spiel bringen.'];

function hero(page: Page) {
  return page.getByRole('region', { name: 'Die Stadt ist das Spielfeld.' });
}

test.describe('F-31 Startseite', () => {
  test('F-31 AK1: "/" zeigt Überschrift mit Sportzeile, drei Schritte und beide Einstiege, ohne Tab-Leiste', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('SportMate – Sporttreffen in deiner Nähe');
    await expect(page.getByRole('heading', { level: 1, name: 'Die Stadt ist das Spielfeld.' })).toBeVisible();
    const line = page.getByTestId('hero-sport-line');
    await expect(line).toBeVisible();
    expect(sportLines).toContain((await line.textContent())?.trim());
    const steps = page.getByRole('region', { name: "So funktioniert's" }).getByRole('heading', { level: 3 });
    await expect(steps).toHaveText(['Sportart wählen', 'Treffen finden', 'Bin dabei']);
    await expect(hero(page).getByRole('link', { name: 'Treffen entdecken', exact: true })).toBeVisible();
    await expect(hero(page).getByRole('link', { name: 'Treffen erstellen', exact: true })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Hauptnavigation' })).toHaveCount(0);
  });

  test('F-31 AK1: die Sportzeile wechselt ohne Neuladen zur nächsten Sportart', async ({ page }) => {
    await page.goto('/');
    const line = page.getByTestId('hero-sport-line');
    await expect(line).toHaveText(sportLines[0]);
    await expect(line).toHaveText(sportLines[1], { timeout: 8000 });
  });

  test('F-31 AK1: kein "Flensburg" im sichtbaren Text der Startseite', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('preview-marker').first()).toBeVisible();
    expect(await page.locator('body').innerText()).not.toMatch(/Flensburg/);
  });

  test('F-31 AK2: "Treffen entdecken" öffnet /entdecken mit Karte und Liste', async ({ page }) => {
    await page.goto('/');
    await hero(page).getByRole('link', { name: 'Treffen entdecken', exact: true }).click();
    await expect(page).toHaveURL(/\/entdecken$/);
    await expect(page).toHaveTitle('Treffen entdecken · SportMate');
    await expect(page.getByRole('region', { name: 'Karte offline' })).toBeVisible();
    await expect(eventCards(page).first()).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link', { name: 'Entdecken' })).toHaveAttribute('aria-current', 'page');
  });

  test('F-31 AK3: Gäste landen bei "Treffen erstellen" in der Anmeldung', async ({ page }) => {
    await page.goto('/');
    await hero(page).getByRole('link', { name: 'Treffen erstellen', exact: true }).click();
    await expect(page).toHaveURL(/\/anmelden/);
    await expect(page.getByRole('heading', { level: 1, name: 'Anmelden' })).toBeVisible();
  });

  test('F-31 AK3: Angemeldete kommen über "Treffen erstellen" direkt zum Formular', async ({ page }) => {
    await signInAsDemo(page, 'Lea');
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Profil' })).toBeVisible();
    await hero(page).getByRole('link', { name: 'Treffen erstellen', exact: true }).click();
    await expect(page).toHaveURL(/\/erstellen$/);
  });

  test('F-31 AK4: Vorschau zeigt bis zu vier echte kommende Treffen, ein Marker führt zu den Details', async ({ page }) => {
    await page.goto('/');
    const markers = page.getByTestId('preview-marker');
    await expect(markers.first()).toBeVisible();
    const count = await markers.count();
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(4);
    await expect(page.getByTestId('preview-caption')).toContainText(/Plätze/);
    const href = await markers.first().getAttribute('href');
    expect(href).toMatch(/^\/treffen\/demo-/);
    await markers.first().click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.getByTestId('event-detail')).toBeVisible();
  });

  test('F-31 AK4: die Treffen-Karte unter der Vorschau führt zum hervorgehobenen Treffen', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const card = page.getByTestId('preview-caption').getByRole('link');
    const href = await card.getAttribute('href');
    expect(href).toMatch(/^\/treffen\/demo-/);
    await card.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.getByTestId('event-detail')).toBeVisible();
  });

  test('F-31 AK9: eine Sportart unter "Was bringt dich in Bewegung?" öffnet Entdecken mit dieser Sportart', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('region', { name: 'Was bringt dich in Bewegung?' }).getByRole('link', { name: /Volleyball/ }).click();
    await expect(page).toHaveURL(/\/entdecken\?sport=Volleyball$/);
    await expect(page.getByRole('group', { name: 'Sportarten' }).first().getByRole('button', { name: 'Volleyball' })).toHaveAttribute('aria-pressed', 'true');
    await expect(eventCards(page).first()).toBeVisible();
    const sportsShown = await eventCards(page).evaluateAll((cards) => cards.map((card) => card.textContent ?? ''));
    expect(sportsShown.every((text) => text.includes('Volleyball'))).toBe(true);
  });

  test('F-31 AK8: Abschluss "Zusammen geht mehr" führt nach Entdecken', async ({ page }) => {
    await page.goto('/');
    const closing = page.getByRole('region', { name: 'Zusammen geht mehr' });
    await closing.getByRole('link', { name: /Treffen entdecken/ }).click();
    await expect(page).toHaveURL(/\/entdecken$/);
  });

  test('F-31 AK6: kein seitliches Scrollen bei 360 px Breite', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/');
    await expect(page.getByTestId('preview-marker').first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test('F-31 AK6: mit reduzierter Bewegung lädt die Seite vollständig, ohne Fehler und mit stehender Sportzeile', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'Die Stadt ist das Spielfeld.' })).toBeVisible();
    await expect(page.getByTestId('preview-marker').first()).toBeVisible();
    await expect(hero(page).getByRole('link', { name: 'Treffen entdecken', exact: true })).toBeVisible();
    const line = page.getByTestId('hero-sport-line');
    await expect(line).toHaveText(sportLines[0]);
    await page.waitForTimeout(4500);
    await expect(line).toHaveText(sportLines[0]);
    expect(errors).toEqual([]);
  });

  test('F-31 AK7: Logo in der Seitenleiste führt von Entdecken zurück zur Startseite', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Die Seitenleiste mit Logo gibt es nur auf dem Desktop.');
    await page.goto('/entdecken');
    await page.getByRole('link', { name: 'SportMate, zur Startseite' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Die Stadt ist das Spielfeld.' })).toBeVisible();
  });

  test('F-31 AK7: "Anmelden" im Kopf der Startseite führt zur Anmeldung', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Anmelden' }).click();
    await expect(page).toHaveURL(/\/anmelden$/);
  });
});
