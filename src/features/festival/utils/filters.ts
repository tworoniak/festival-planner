import type { FestivalSet } from '../types/festival';

export type Filters = {
  dayId: string;
  query: string;
  selectedGenres: string[];
  favoritesOnly: boolean;
  view?: 'list' | 'timeline' | 'plan';
};

export function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function collectGenres(sets: FestivalSet[]) {
  const all = new Set<string>();
  for (const s of sets) for (const g of s.genres) all.add(g);
  return [...all].sort((a, b) => a.localeCompare(b));
}

export function applyFilters(
  sets: FestivalSet[],
  filters: Filters,
  favoriteSetIds: Set<string>,
) {
  const q = normalize(filters.query);

  return sets.filter((s) => {
    if (s.dayId !== filters.dayId) return false;

    if (filters.favoritesOnly && !favoriteSetIds.has(s.id)) return false;

    if (q && !normalize(s.bandName).includes(q)) return false;

    if (filters.selectedGenres.length > 0) {
      const hasAny = filters.selectedGenres.some((g) =>
        s.genres.map(normalize).includes(normalize(g)),
      );
      if (!hasAny) return false;
    }

    return true;
  });
}
