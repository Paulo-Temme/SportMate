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
});
