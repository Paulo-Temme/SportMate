// @vitest-environment jsdom
// Komponententests der Filterleiste: Sportarten-Chips (Mehrfachauswahl), Zeitraum, Niveau, Alter und Zurücksetzen (F-06, F-07, F-09).
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { emptyFilters, type EventFilters } from '@/lib/events/event-model';
import { FilterPanel } from './filter-panel';
import { SearchBar } from './search-bar';
import { SportChips } from './sport-chips';

afterEach(cleanup);

function Harness({ initial = emptyFilters }: { initial?: EventFilters }) {
  const [filters, setFilters] = useState<EventFilters>(initial);
  return (
    <>
      <SearchBar filters={filters} onChange={setFilters} onOpenFilters={() => {}} />
      <SportChips filters={filters} onChange={setFilters} />
      <FilterPanel open filters={filters} onChange={setFilters} onClose={() => {}} resultCount={3} />
      <output data-testid="state">{JSON.stringify(filters)}</output>
    </>
  );
}

function readState(): EventFilters {
  return JSON.parse(screen.getByTestId('state').textContent ?? '{}') as EventFilters;
}

describe('Filterleiste', () => {
  it('F-06 AK1: Sportarten lassen sich mehrfach wählen und wieder abwählen', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Volleyball' }));
    fireEvent.click(screen.getByRole('button', { name: 'Laufen' }));
    expect(readState().sports).toEqual(['Volleyball', 'Laufen']);
    expect(screen.getByRole('button', { name: 'Volleyball' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Volleyball' }));
    expect(readState().sports).toEqual(['Laufen']);
  });

  it('F-06 AK2: Zeitraum "Heute", "Morgen" und "Diese Woche" setzen den Filter', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('radio', { name: 'Morgen' }));
    expect(readState().period).toBe('tomorrow');
    fireEvent.click(screen.getByRole('radio', { name: 'Diese Woche' }));
    expect(readState().period).toBe('week');
  });

  it('F-06 AK3: ein gewähltes Datum setzt Zeitraum "date" mit diesem Tag', () => {
    render(<Harness />);
    fireEvent.change(screen.getByLabelText('Datum'), { target: { value: '2026-12-02' } });
    expect(readState()).toMatchObject({ period: 'date', date: '2026-12-02' });
  });

  it('F-07 AK1: Niveau und Altersgruppe lassen sich wählen', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('radio', { name: 'Anfänger' }));
    fireEvent.click(screen.getByRole('radio', { name: '20–25' }));
    expect(readState()).toMatchObject({ level: 'Anfänger', ageGroup: '20–25' });
  });

  it('F-06 AK5: "Filter zurücksetzen" leert alle Filter', () => {
    render(<Harness initial={{ ...emptyFilters, sports: ['Volleyball'], period: 'today', query: 'hafen' }} />);
    fireEvent.click(screen.getByRole('button', { name: 'Filter zurücksetzen' }));
    expect(readState()).toEqual(emptyFilters);
  });

  it('F-09 AK1: Freitext landet im Suchfilter', () => {
    render(<Harness />);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Treffen suchen' }), { target: { value: 'hafen' } });
    expect(readState().query).toBe('hafen');
  });
});
