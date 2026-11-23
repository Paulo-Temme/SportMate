'use client';
// Entdecken: vollflächige Karte, schwebende Suche und Chips, Bottom Sheet mit Trefferliste oder Details; eine Trefferliste für Karte und Liste (F-05–F-09, F-12).
import { ArrowLeft, LocateFixed } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppServices } from '@/components/app/app-services';
import { EventDetail } from '@/components/event/event-detail';
import { EventMap } from '@/components/map/event-map';
import type { CameraRequest, MapMarkerItem } from '@/components/map/map-marker-item';
import { BottomSheet } from '@/components/sheet/bottom-sheet';
import { computeSnapHeights, type SnapHeights, type SnapPoint } from '@/lib/ui/sheet-snap';
import { useEventList } from '@/hooks/use-event-list';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useParticipation } from '@/hooks/use-participation';
import { readSportParam } from '@/lib/events/discover-link';
import { emptyFilters, type EventFilters, type SportEvent } from '@/lib/events/event-model';
import { describeDayLabel, formatEventTime, summarizePlaces } from '@/lib/events/event-presentation';
import { FilterPanel } from './filter-panel';
import { ResultList } from './result-list';
import { SearchBar } from './search-bar';
import { SportChips } from './sport-chips';
import styles from './discover-screen.module.css';

const tabBarHeight = 64;

function readSelectedId(pathname: string | null): string | null {
  const match = pathname?.match(/^\/treffen\/([^/]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function hasActiveFilters(filters: EventFilters): boolean {
  return JSON.stringify(filters) !== JSON.stringify(emptyFilters);
}

// Einstieg von der Startseite: `?sport=Volleyball` wählt die Sportart vor; spätere Änderungen bleiben in der Ansicht (F-31).
function readInitialFilters(sportParam: string | null): EventFilters {
  const sport = readSportParam(sportParam);
  return sport ? { ...emptyFilters, sports: [sport] } : emptyFilters;
}

function toMarker(event: SportEvent, selectedId: string | null, now: Date): MapMarkerItem {
  const full = summarizePlaces(event).full;
  const time = formatEventTime(event.startsAt);
  return {
    id: event.id,
    sport: event.sport,
    timeLabel: time,
    accessibleLabel: `${event.title}, ${describeDayLabel(event.startsAt, now)} ${time} Uhr${full ? ', ausgebucht' : ''}`,
    latitude: event.latitude,
    longitude: event.longitude,
    state: event.id === selectedId ? 'selected' : full ? 'full' : 'default',
  };
}

function useSelectedCoordinates(selectedId: string | null, list: SportEvent[]) {
  const { events } = useAppServices();
  const [fetched, setFetched] = useState<{ id: string; latitude: number; longitude: number } | null>(null);
  const fromList = list.find((event) => event.id === selectedId);

  useEffect(() => {
    if (!selectedId || fromList) return;
    let active = true;
    events
      .getEvent(selectedId)
      .then((event) => active && event && setFetched({ id: event.id, latitude: event.latitude, longitude: event.longitude }))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [events, selectedId, fromList]);

  if (fromList) return { latitude: fromList.latitude, longitude: fromList.longitude };
  return fetched && fetched.id === selectedId ? fetched : null;
}

function SheetHeader({ count, ready, selected, onBack }: { count: number; ready: boolean; selected: boolean; onBack: () => void }) {
  if (selected) {
    return (
      <div className={styles.sheetHeader}>
        <button type="button" className={styles.back} onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          Alle Treffen
        </button>
      </div>
    );
  }
  return (
    <div className={styles.sheetHeader}>
      <h1 className={styles.count}>
        {ready ? (
          <>
            <span className="tabular" data-testid="result-count">
              {count}
            </span>{' '}
            Treffen
          </>
        ) : (
          'Treffen werden geladen'
        )}
      </h1>
      <p className={styles.countHint}>kommend in Flensburg</p>
    </div>
  );
}

/**
 * Entdecken-Ansicht unter `/entdecken`. Die Route `/treffen/[id]` zeigt dieselbe Ansicht mit geöffneten Details im Sheet.
 * Rückgabe: Kartenbühne mit schwebenden Bedienelementen und Sheet.
 * Feature: F-05, F-08
 */
export function DiscoverScreen() {
  const pathname = usePathname();
  const router = useRouter();
  const selectedId = readSelectedId(pathname);
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [filters, setFilters] = useState<EventFilters>(() => readInitialFilters(searchParams.get('sport')));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [snap, setSnap] = useState<SnapPoint>('half');
  const [heights, setHeights] = useState<SnapHeights>(() => computeSnapHeights(700));
  const [cameraRequest, setCameraRequest] = useState<CameraRequest | null>(null);
  const list = useEventList(filters);
  const participation = useParticipation();
  const [now] = useState(() => new Date());
  const coordinates = useSelectedCoordinates(selectedId, list.events);
  const bottomInset = isDesktop ? 0 : heights[snap === 'full' ? 'half' : snap] + tabBarHeight;

  const markers = useMemo(() => list.events.map((event) => toMarker(event, selectedId, now)), [list.events, selectedId, now]);

  const selectEvent = useCallback(
    (id: string) => {
      setSnap((current) => (current === 'peek' ? 'half' : current));
      router.push(`/treffen/${encodeURIComponent(id)}`, { scroll: false });
    },
    [router],
  );

  const showList = useCallback(() => router.push('/entdecken', { scroll: false }), [router]);
  const closeFilters = useCallback(() => setFiltersOpen(false), []);
  const resetFilters = useCallback(() => setFilters(emptyFilters), []);

  // Die Karte fliegt nur bei neuer Auswahl, nicht bei jeder Sheet-Bewegung; der Abstand wird darum per Ref gelesen.
  const insetRef = useRef(bottomInset);
  useEffect(() => {
    insetRef.current = bottomInset;
  }, [bottomInset]);
  // Beim ersten Laden alle Treffer ins Bild holen, oberhalb des Sheets.
  const fitted = useRef(false);
  useEffect(() => {
    if (fitted.current || list.status !== 'ready' || list.events.length === 0 || selectedId) return;
    fitted.current = true;
    const points = list.events.map(({ latitude, longitude }) => ({ latitude, longitude }));
    setCameraRequest({ kind: 'fit', points, bottomInset: insetRef.current, key: Date.now() });
  }, [list.status, list.events, selectedId]);

  const latitude = coordinates?.latitude;
  const longitude = coordinates?.longitude;
  useEffect(() => {
    if (latitude === undefined || longitude === undefined) return;
    setCameraRequest({ kind: 'event', latitude, longitude, bottomInset: insetRef.current, key: Date.now() });
  }, [latitude, longitude, selectedId]);

  const centerOnFlensburg = () => setCameraRequest({ kind: 'home', bottomInset, key: Date.now() });
  const controls = (
    <>
      <SearchBar filters={filters} onChange={setFilters} onOpenFilters={() => setFiltersOpen(true)} />
      <SportChips filters={filters} onChange={setFilters} />
    </>
  );

  return (
    <div className={styles.screen}>
      <div className={styles.mapArea}>
        <EventMap markers={markers} cameraRequest={cameraRequest} onSelectMarker={selectEvent} />
      </div>
      <div className={styles.floating}>{controls}</div>
      <button type="button" className={styles.centerButton} onClick={centerOnFlensburg} aria-label="Auf Flensburg zentrieren">
        <LocateFixed size={20} aria-hidden="true" />
      </button>
      <BottomSheet
        snap={snap}
        onSnapChange={setSnap}
        onHeightsChange={setHeights}
        label={selectedId ? 'Treffen-Details' : 'Trefferliste'}
        contentKey={selectedId ?? 'liste'}
        header={
          <>
            <div className={styles.panelControls}>{controls}</div>
            <SheetHeader count={list.events.length} ready={list.status !== 'loading'} selected={Boolean(selectedId)} onBack={showList} />
          </>
        }
      >
        {selectedId ? (
          <EventDetail eventId={selectedId} now={now} />
        ) : (
          <ResultList
            state={list}
            selectedId={selectedId}
            pendingId={participation.pendingId}
            onSelect={selectEvent}
            onJoin={participation.join}
            onResetFilters={resetFilters}
            hasFilters={hasActiveFilters(filters)}
          />
        )}
      </BottomSheet>
      <FilterPanel open={filtersOpen} filters={filters} onChange={setFilters} onClose={closeFilters} resultCount={list.events.length} />
    </div>
  );
}
