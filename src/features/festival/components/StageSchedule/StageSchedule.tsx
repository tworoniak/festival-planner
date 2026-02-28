import styles from './StageSchedule.module.scss';
import type { FestivalSet, FestivalStage } from '../../types/festival';
import { SetCard } from '../SetCard/SetCard';

type Props = {
  stages: FestivalStage[];
  sets: FestivalSet[];

  plannedIds: Set<string>;
  favoriteIds: Set<string>;
  conflictingIds: Set<string>;
  highlightedSetId?: string | null;
  onTogglePlanned: (setId: string) => void;
  onToggleFavorite: (setId: string) => void;
};

export function StageSchedule({
  stages,
  sets,
  plannedIds,
  favoriteIds,
  conflictingIds,
  highlightedSetId,
  onTogglePlanned,
  onToggleFavorite,
}: Props) {
  // group by stageId
  const byStage = new Map<string, FestivalSet[]>();
  for (const s of sets) {
    const arr = byStage.get(s.stageId) ?? [];
    arr.push(s);
    byStage.set(s.stageId, arr);
  }

  // sort each stage list by start
  for (const [k, arr] of byStage) {
    arr.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    );
    byStage.set(k, arr);
  }

  return (
    <div className={styles.grid}>
      {stages.map((stage) => {
        const stageSets = byStage.get(stage.id) ?? [];
        return (
          <section key={stage.id} className={styles.stage}>
            <h3 className={styles.stageTitle}>{stage.label}</h3>
            <div className={styles.list}>
              {stageSets.length === 0 ? (
                <div className={styles.empty}>No sets match filters.</div>
              ) : (
                stageSets.map((set) => (
                  <SetCard
                    key={set.id}
                    set={set}
                    stageLabel={stage.label}
                    isPlanned={plannedIds.has(set.id)}
                    isFavorite={favoriteIds.has(set.id)}
                    isConflicting={conflictingIds.has(set.id)}
                    isHighlighted={highlightedSetId === set.id}
                    onTogglePlanned={() => onTogglePlanned(set.id)}
                    onToggleFavorite={() => onToggleFavorite(set.id)}
                  />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
