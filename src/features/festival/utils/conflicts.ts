import type { FestivalSet } from '../types/festival';

export function overlaps(a: FestivalSet, b: FestivalSet) {
  const aStart = new Date(a.start).getTime();
  const aEnd = new Date(a.end).getTime();
  const bStart = new Date(b.start).getTime();
  const bEnd = new Date(b.end).getTime();
  return aStart < bEnd && bStart < aEnd;
}

export type Conflict = {
  id: string; // stable id for rendering
  a: FestivalSet;
  b: FestivalSet;
  key: string; // "aId|bId" in sorted order
};

function pairKey(aId: string, bId: string) {
  return [aId, bId].sort().join('|');
}

export function computeConflicts(planned: FestivalSet[]) {
  const conflicts: Conflict[] = [];

  const sorted = [...planned].sort(
    (x, y) => new Date(x.start).getTime() - new Date(y.start).getTime(),
  );

  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      if (
        new Date(sorted[j].start).getTime() >= new Date(sorted[i].end).getTime()
      )
        break;
      if (!overlaps(sorted[i], sorted[j])) continue;

      const key = pairKey(sorted[i].id, sorted[j].id);
      conflicts.push({
        id: key,
        key,
        a: sorted[i],
        b: sorted[j],
      });
    }
  }

  return conflicts;
}
