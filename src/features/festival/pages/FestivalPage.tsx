import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import styles from './FestivalPage.module.scss';

import { useFestivalData } from '../hooks/useFestivalData';
import { DayTabs } from '../components/DayTabs/DayTabs';
import { FiltersBar } from '../components/FiltersBar/FiltersBar';
import { StageSchedule } from '../components/StageSchedule/StageSchedule';
import { MyPlanDrawer } from '../components/MyPlanDrawer/MyPlanDrawer';

import { usePlannerStore } from '../state/planner.store';
import { applyFilters, collectGenres, type Filters } from '../utils/filters';
import { computeConflicts } from '../utils/conflicts';
import { buildPlanParam, parsePlanParam } from '../utils/planUrl';
import type { FestivalSet } from '../types/festival';

import { useToast } from '../../../components/ui/Toast';

export function FestivalPage() {
  const { festivalId } = useParams<{ festivalId: string }>();
  if (!festivalId) throw new Error('Missing festivalId');

  const { festival } = useFestivalData(festivalId);
  const planner = usePlannerStore(festivalId);
  const toast = useToast();

  const [searchParams, setSearchParams] = useSearchParams();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [highlightedSetId, setHighlightedSetId] = useState<string | null>(null);

  // Filters init from festival day list
  const [filters, setFilters] = useState<Filters>(() => ({
    dayId: festival.days[0]?.id ?? 'day1',
    query: '',
    selectedGenres: [],
    favoritesOnly: false,
  }));

  // Test if Toasts work.

  // useEffect(() => {
  //   toast.push({
  //     title: 'Test Toast',
  //     message: 'If you see this, toast works.',
  //     variant: 'success',
  //   });
  // }, []);

  // If festival changes (switching routes), keep filters.dayId valid
  useEffect(() => {
    setFilters((prev) => {
      const stillValid = festival.days.some((d) => d.id === prev.dayId);
      return stillValid
        ? prev
        : { ...prev, dayId: festival.days[0]?.id ?? prev.dayId };
    });
  }, [festival.days]);

  function resolveConflict(setId: string) {
    setDrawerOpen(false);

    window.setTimeout(() => {
      const el = document.getElementById(`set-${setId}`);
      if (!el) return;

      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedSetId(setId);

      window.setTimeout(() => setHighlightedSetId(null), 1000);
    }, 80);
  }

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

  /**
   * ✅ Load plan from URL ONCE per festival route.
   * We intentionally don't depend on searchParams to avoid overwriting user's edits repeatedly.
   */
  useEffect(() => {
    const idsFromUrl = parsePlanParam(searchParams.get('plan'));
    if (idsFromUrl.length === 0) return;

    const validIds = new Set(festival.sets.map((s) => s.id));
    const filtered = idsFromUrl.filter((id) => validIds.has(id));

    if (filtered.length > 0) {
      planner.setPlan(filtered);
      toast.push({
        variant: 'success',
        title: 'Plan loaded',
        message: `Loaded ${filtered.length} set${filtered.length === 1 ? '' : 's'} from shared link.`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [festivalId]); // intentionally only on festival change

  /**
   * ✅ Keep URL in sync with current plan.
   */
  useEffect(() => {
    const current = searchParams.get('plan') ?? '';
    const next = buildPlanParam(planner.plannedSetIds);

    if (current === next) return;

    const sp = new URLSearchParams(searchParams);
    if (next) sp.set('plan', next);
    else sp.delete('plan');

    setSearchParams(sp, { replace: true });
  }, [planner.plannedSetIds, searchParams, setSearchParams]);

  async function copyShareLink() {
    const url = window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      toast.push({
        variant: 'success',
        title: 'Link copied',
        message: 'Share link copied to clipboard.',
      });
    } catch {
      window.prompt('Copy this link:', url);
      toast.push({
        variant: 'default',
        title: 'Copy link',
        message:
          'Your browser blocked clipboard access — copied via prompt instead.',
        durationMs: 3200,
      });
    }
  }

  function clearPlanWithUndo() {
    const snapshot = [...planner.plannedSetIds];
    if (snapshot.length === 0) return;

    planner.clearPlan();

    toast.push({
      title: 'Plan cleared',
      message: `Removed ${snapshot.length} set${snapshot.length === 1 ? '' : 's'}.`,
      durationMs: 6000,
      action: {
        label: 'Undo',
        onClick: () => {
          planner.setPlan(snapshot);
          toast.push({
            variant: 'success',
            title: 'Restored',
            message: 'Your plan is back.',
            durationMs: 2000,
          });
        },
      },
    });
  }

  function findSetName(setId: string) {
    return festival.sets.find((s) => s.id === setId)?.bandName ?? 'Set';
  }

  function removeWithUndo(setId: string) {
    // Only do undo behavior when it's currently planned
    if (!planner.planned.has(setId)) return;

    planner.togglePlanned(setId);

    const name = findSetName(setId);

    toast.push({
      variant: 'default',
      title: 'Removed from plan',
      message: name,
      durationMs: 5000,
      action: {
        label: 'Undo',
        onClick: () => {
          // add it back
          if (!planner.planned.has(setId)) planner.togglePlanned(setId);

          toast.push({
            variant: 'success',
            title: 'Restored',
            message: name,
            durationMs: 2000,
          });
        },
      },
    });
  }

  return (
    <div className='container'>
      <div className={styles.backRow}>
        <Link to='/' className={styles.backLink}>
          ← All festivals
        </Link>
        <div className={styles.badge}>{festival.name}</div>
      </div>

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{festival.name}</h1>
          <div className={styles.subtitle}>
            Build your schedule • spot conflicts • save it locally
          </div>
        </div>

        <div className={styles.headerActions}>
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

          <button
            type='button'
            className={styles.planButton}
            onClick={copyShareLink}
          >
            Copy share link
          </button>
        </div>
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
        onTogglePlanned={(id) => {
          const isRemoving = planner.planned.has(id);
          if (isRemoving) removeWithUndo(id);
          else planner.togglePlanned(id);
        }}
        onToggleFavorite={(id) => planner.toggleFavorite(id)}
      />

      <MyPlanDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        days={festival.days}
        plannedSets={plannedSets}
        conflicts={conflicts}
        onRemove={(id) => removeWithUndo(id)}
        onClear={clearPlanWithUndo}
        onResolveConflict={resolveConflict}
      />
    </div>
  );
}
