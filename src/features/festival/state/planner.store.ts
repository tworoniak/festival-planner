import { useEffect, useMemo, useState } from 'react';

const BASE_KEY = 'mfp.planner.v1';

type StoredPlanner = {
  plannedSetIds: string[];
  favoriteSetIds: string[];
};

function readStored(key: string): StoredPlanner {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { plannedSetIds: [], favoriteSetIds: [] };
    const parsed = JSON.parse(raw) as StoredPlanner;
    return {
      plannedSetIds: Array.isArray(parsed.plannedSetIds)
        ? parsed.plannedSetIds
        : [],
      favoriteSetIds: Array.isArray(parsed.favoriteSetIds)
        ? parsed.favoriteSetIds
        : [],
    };
  } catch {
    return { plannedSetIds: [], favoriteSetIds: [] };
  }
}

export function usePlannerStore(festivalId: string) {
  const KEY = `${BASE_KEY}:${festivalId}`;

  const [plannedSetIds, setPlannedSetIds] = useState<string[]>(
    () => readStored(KEY).plannedSetIds,
  );
  const [favoriteSetIds, setFavoriteSetIds] = useState<string[]>(
    () => readStored(KEY).favoriteSetIds,
  );

  useEffect(() => {
    const payload = JSON.stringify({
      plannedSetIds,
      favoriteSetIds,
    } satisfies StoredPlanner);
    localStorage.setItem(KEY, payload);
  }, [KEY, plannedSetIds, favoriteSetIds]);

  const planned = useMemo(() => new Set(plannedSetIds), [plannedSetIds]);
  const favorites = useMemo(() => new Set(favoriteSetIds), [favoriteSetIds]);

  function togglePlanned(id: string) {
    setPlannedSetIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function toggleFavorite(id: string) {
    setFavoriteSetIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function clearPlan() {
    setPlannedSetIds([]);
  }

  return {
    plannedSetIds,
    favoriteSetIds,
    planned,
    favorites,
    togglePlanned,
    toggleFavorite,
    clearPlan,
  };
}
