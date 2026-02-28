import { useMemo, useState } from 'react';
import styles from './FestivalPage.module.scss';

import { useFestivalData } from '../hooks/useFestivalData';
import { DayTabs } from '../components/DayTabs/DayTabs';
import { FiltersBar } from '../components/FiltersBar/FiltersBar';
import { StageSchedule } from '../components/StageSchedule/StageSchedule';
import { MyPlanDrawer } from '../components/MyPlanDrawer/MyPlanDrawer';

import { usePlannerStore } from '../state/planner.store';
import { applyFilters, collectGenres, type Filters } from '../utils/filters';
import { computeConflicts } from '../utils/conflicts';
import type { FestivalSet } from '../types/festival';

export function FestivalPage() {
  const { festival } = useFestivalData();
  const planner = usePlannerStore();
  const [highlightedSetId, setHighlightedSetId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  function resolveConflict(setId: string) {
    setDrawerOpen(false);

    // Allow drawer to start closing before scroll (helps visual)
    window.setTimeout(() => {
      const el = document.getElementById(`set-${setId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedSetId(setId);

        // clear highlight after animation
        window.setTimeout(() => setHighlightedSetId(null), 1000);
      }
    }, 80);
  }

  const [filters, setFilters] = useState<Filters>(() => ({
    dayId: festival.days[0]?.id ?? 'day1',
    query: '',
    selectedGenres: [],
    favoritesOnly: false,
  }));

  const allGenres = useMemo(
    () => collectGenres(festival.sets),
    [festival.sets],
  );

  const visibleSets = useMemo(() => {
    return applyFilters(festival.sets, filters, planner.favorites);
  }, [festival.sets, filters, planner.favorites]);

  const plannedSets = useMemo(() => {
    const byId = new Map<string, FestivalSet>(
      festival.sets.map((s) => [s.id, s]),
    );
    const sets = planner.plannedSetIds
      .map((id) => byId.get(id))
      .filter(Boolean) as FestivalSet[];
    return sets.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    );
  }, [festival.sets, planner.plannedSetIds]);

  const conflicts = useMemo(() => computeConflicts(plannedSets), [plannedSets]);

  const conflictingIds = useMemo(() => {
    const ids = new Set<string>();
    for (const c of conflicts) {
      ids.add(c.a.id);
      ids.add(c.b.id);
    }
    return ids;
  }, [conflicts]);

  function toggleGenre(genre: string) {
    setFilters((prev) => {
      const has = prev.selectedGenres.includes(genre);
      return {
        ...prev,
        selectedGenres: has
          ? prev.selectedGenres.filter((g) => g !== genre)
          : [...prev.selectedGenres, genre],
      };
    });
  }

  return (
    <div className='container'>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{festival.name}</h1>
          <div className={styles.subtitle}>
            Build your schedule • spot conflicts • save it locally
          </div>
        </div>

        <button
          type='button'
          className={styles.planButton}
          onClick={() => setDrawerOpen(true)}
        >
          My Plan ({plannedSets.length})
          {conflicts.length > 0
            ? ` • ${conflicts.length} conflict${conflicts.length === 1 ? '' : 's'}`
            : ''}
        </button>
      </header>

      <DayTabs
        days={festival.days}
        value={filters.dayId}
        onChange={(dayId) => setFilters((p) => ({ ...p, dayId }))}
      />

      <FiltersBar
        query={filters.query}
        onQueryChange={(query) => setFilters((p) => ({ ...p, query }))}
        allGenres={allGenres}
        selectedGenres={filters.selectedGenres}
        onToggleGenre={toggleGenre}
        favoritesOnly={filters.favoritesOnly}
        onToggleFavoritesOnly={() =>
          setFilters((p) => ({ ...p, favoritesOnly: !p.favoritesOnly }))
        }
      />

      <StageSchedule
        stages={festival.stages}
        sets={visibleSets}
        plannedIds={planner.planned}
        favoriteIds={planner.favorites}
        conflictingIds={conflictingIds}
        highlightedSetId={highlightedSetId}
        onTogglePlanned={(id) => planner.togglePlanned(id)}
        onToggleFavorite={(id) => planner.toggleFavorite(id)}
      />

      <MyPlanDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        days={festival.days}
        plannedSets={plannedSets}
        conflicts={conflicts}
        onRemove={(id) => planner.togglePlanned(id)}
        onClear={() => planner.clearPlan()}
        onResolveConflict={resolveConflict}
      />
    </div>
  );
}
