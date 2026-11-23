// Akzeptanztests F-01: Registrieren, Anmelden, Abmelden im lokalen Modus.
import { expect, test, type Page } from '@playwright/test';

async function register(page: Page, email: string, password: string) {
  await page.goto('/anmelden');
  await page.getByRole('tab', { name: 'Registrieren' }).click();
  await page.getByLabel('Anzeigename').fill('Lea');
  await page.getByLabel('E-Mail').fill(email);
  await page.getByLabel('Passwort').fill(password);
  await page.getByRole('button', { name: 'Registrieren', exact: true }).click();
}

test.describe('F-01 Registrieren, anmelden, abmelden', () => {
  test('F-01 AK1: Registrierung meldet an und zeigt "Abmelden"', async ({ page }) => {
    await register(page, 'lea@example.org', 'sportmate1');
    await expect(page).toHaveURL(/\/profil$/);
    await expect(page.getByText('lea@example.org')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Abmelden' })).toBeVisible();
  });

  test('F-01 AK2: zu kurzes Passwort legt kein Konto an', async ({ page }) => {
    await register(page, 'lea@example.org', 'kurz12');
    await expect(page.getByText(/Mindestens 8 Zeichen/).first()).toBeVisible();
    await expect(page).toHaveURL(/\/anmelden/);
  });

  test('F-01 AK3: bereits verwendete E-Mail legt kein zweites Konto an', async ({ page }) => {
    await register(page, 'lea@example.org', 'sportmate1');
    await page.getByRole('button', { name: 'Abmelden' }).click();
    await register(page, 'lea@example.org', 'sportmate1');
    await expect(page.getByText('Diese E-Mail wird bereits verwendet.')).toBeVisible();
  });

  test('F-01 AK4: falsches Passwort lässt die Person abgemeldet', async ({ page }) => {
    await register(page, 'lea@example.org', 'sportmate1');
    await page.getByRole('button', { name: 'Abmelden' }).click();
    await page.goto('/anmelden');
    await page.getByLabel('E-Mail').fill('lea@example.org');
    await page.getByLabel('Passwort').fill('falsch123');
    await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
    await expect(page.getByText('E-Mail oder Passwort falsch.')).toBeVisible();
  });

  test('F-01 AK5: nach dem Abmelden führt "Treffen erstellen" wieder zur Anmeldung', async ({ page }) => {
    await register(page, 'lea@example.org', 'sportmate1');
    await page.getByRole('button', { name: 'Abmelden' }).click();
    await expect(page.getByRole('link', { name: 'Anmelden', exact: true })).toBeVisible();
    await page.getByRole('link', { name: 'Treffen erstellen' }).click();
    await expect(page).toHaveURL(/\/anmelden\?weiter=%2Ferstellen$/);
  });
});

test('F-01 AK6: wer angemeldet ist und /anmelden öffnet, sieht einen Hinweis mit Link zum Profil statt des Formulars', async ({ page }) => {
  await page.goto('/anmelden');
  await page.getByRole('button', { name: 'Lea – als Demo-Person anmelden' }).click();
  await expect(page).toHaveURL(/\/profil$/);
  await page.goto('/anmelden');
  await expect(page.getByText('Du bist bereits angemeldet als Lea.')).toBeVisible();
  await expect(page.getByLabel('E-Mail')).toHaveCount(0);
  await page.getByRole('link', { name: 'Zum Profil' }).click();
  await expect(page).toHaveURL(/\/profil$/);
});
