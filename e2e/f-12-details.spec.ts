// Akzeptanztests F-12/F-13/F-14/F-15/F-25: Detailansicht mit Plätzen, Niveau, Alter, Kosten, Mitbringen, Organisator und Status.
import { expect, test } from '@playwright/test';
import { openDiscover, openEventFromList } from './support';

test.describe('F-12 Detailansicht', () => {
  test('F-12 AK1: zeigt Sportart, Zeit, Treffpunkt, Niveau und freie Plätze', async ({ page }) => {
    await openDiscover(page);
    await openEventFromList(page, 'Fußball am Campus – Anfänger willkommen');
    const detail = page.getByTestId('event-detail');
    await expect(detail.getByText('Fußball', { exact: true })).toBeVisible();
    await expect(detail.getByText(/^[A-Z][a-z], \d{2}\.\d{2}\., 17:00–19:00 Uhr · 2 Std\.$/)).toBeVisible();
    await expect(detail.getByText('Campus Flensburg, Sportplatz (Beispiel)')).toBeVisible();
    await expect(detail.getByText('Niveau: Anfänger')).toBeVisible();
    await expect(detail.getByText('Anfänger willkommen', { exact: true })).toBeVisible();
    await expect(detail.getByText('5 von 10 Plätzen frei')).toBeVisible();
  });

  test('F-12 AK2: Altersangabe ist eindeutig mit Jahren beschriftet', async ({ page }) => {
    await openDiscover(page);
    await openEventFromList(page, 'Basketball auf dem Exe');
    await expect(page.getByTestId('event-detail').getByText('Alter: 20–25 Jahre', { exact: true })).toBeVisible();
  });

  test('F-12 AK2 (FB-45): Treffen ohne Altersgrenze zeigt "Alter: offen für alle"', async ({ page }) => {
    await openDiscover(page);
    await openEventFromList(page, 'Lockere Laufrunde im Volkspark');
    await expect(page.getByTestId('event-detail').getByText('Alter: offen für alle', { exact: true })).toBeVisible();
  });

  test('F-12 AK4: ausgebuchtes Treffen zeigt "Ausgebucht" statt "0 von 4 Plätzen frei"', async ({ page }) => {
    await openDiscover(page);
    await openEventFromList(page, 'Volleyball an der Hafenspitze');
    const detail = page.getByTestId('event-detail');
    await expect(detail.getByRole('button', { name: 'Ausgebucht' })).toBeDisabled();
    await expect(detail.getByText('0 von 4 Plätzen frei')).toHaveCount(0);
  });

  test('F-12 AK5: abgesagtes Treffen per Direktlink zeigt "Abgesagt" ohne Teilnahme-Button', async ({ page }) => {
    await page.goto('/treffen/demo-volleyball-ostseebad');
    const detail = page.getByTestId('event-detail');
    await expect(detail.getByText(/^Abgesagt/).first()).toBeVisible();
    await expect(detail.getByRole('button', { name: 'Jetzt teilnehmen' })).toHaveCount(0);
  });
});

test.describe('F-13 Kosten, Mitbringen, Was erwartet dich', () => {
  test('F-13 AK1/AK3: kostenloses Treffen zeigt "Kostenlos" und was mitzubringen ist', async ({ page }) => {
    await openDiscover(page);
    await openEventFromList(page, 'Fußball am Campus – Anfänger willkommen');
    const detail = page.getByTestId('event-detail');
    await expect(detail.getByText('Kostenlos')).toBeVisible();
    await expect(detail.getByText('Mitbringen: Sportschuhe, Getränk')).toBeVisible();
    await expect(detail.getByRole('heading', { name: 'Was erwartet dich?' })).toBeVisible();
  });

  test('F-13 AK2: kostenpflichtiges Treffen zeigt den Preis pro Person', async ({ page }) => {
    await openDiscover(page);
    await openEventFromList(page, 'Badminton zu zweit');
    await expect(page.getByTestId('event-detail').getByText(/3,50 € pro Person/)).toBeVisible();
  });

  test('F-13 AK3: ohne Angabe steht "Mitbringen: nichts Besonderes"', async ({ page }) => {
    await openDiscover(page);
    await openEventFromList(page, 'Volleyball an der Hafenspitze');
    await expect(page.getByTestId('event-detail').getByText('Mitbringen: nichts Besonderes')).toBeVisible();
  });
});

test('F-14 AK1: Details nennen den Organisator ohne Kontaktdaten', async ({ page }) => {
  await openDiscover(page);
  await openEventFromList(page, 'Basketball auf dem Exe');
  const detail = page.getByTestId('event-detail');
  await expect(detail.getByText('Organisiert von Tom')).toBeVisible();
  await expect(detail.getByText(/@/)).toHaveCount(0);
});

test('F-15 AK3: unbekannter Link zeigt "Treffen nicht gefunden" mit Weg zur Übersicht', async ({ page }) => {
  await page.goto('/treffen/gibt-es-nicht');
  await expect(page.getByRole('heading', { name: 'Treffen nicht gefunden' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Zur Übersicht' })).toHaveAttribute('href', '/entdecken');
});

test('F-25 AK1: Mindestzahl nicht erreicht zeigt "noch 1"', async ({ page }) => {
  await openDiscover(page);
  await openEventFromList(page, 'Fußball am Campus – Anfänger willkommen');
  await expect(page.getByTestId('event-detail').getByText(/\(noch 1\)/)).toBeVisible();
});
