import styles from './MyPlanDrawer.module.scss';
import type { FestivalSet } from '../../types/festival';
import type { Conflict } from '../../utils/conflicts';
import { formatRange } from '../../utils/time';

type Props = {
  isOpen: boolean;
  onClose: () => void;

  plannedSets: FestivalSet[];
  conflicts: Conflict[];

  onRemove: (setId: string) => void;
  onClear: () => void;

  onResolveConflict: (setId: string) => void;
};

export function MyPlanDrawer({
  isOpen,
  onClose,
  plannedSets,
  conflicts,
  onRemove,
  onClear,
  onResolveConflict,
}: Props) {
  return (
    <div
      className={`${styles.wrap} ${isOpen ? styles.open : ''}`}
      aria-hidden={!isOpen}
    >
      <div className={styles.panel} role='dialog' aria-label='My Plan'>
        <div className={styles.header}>
          <div>
            <div className={styles.title}>My Plan</div>
            <div className={styles.sub}>
              {plannedSets.length} set{plannedSets.length === 1 ? '' : 's'}
              {conflicts.length > 0
                ? ` • ${conflicts.length} conflict${conflicts.length === 1 ? '' : 's'}`
                : ''}
            </div>
          </div>

          <div className={styles.headerBtns}>
            <button
              type='button'
              className={styles.btn}
              onClick={onClear}
              disabled={plannedSets.length === 0}
            >
              Clear
            </button>
            <button type='button' className={styles.btn} onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        <div className={styles.body}>
          {conflicts.length > 0 && (
            <section className={styles.conflicts}>
              <div className={styles.sectionTitle}>Conflicts</div>

              <div className={styles.conflictList}>
                {conflicts.map((c) => (
                  <div key={c.id} className={styles.conflictItem}>
                    <div className={styles.conflictMain}>
                      <div className={styles.conflictBands}>
                        <span>{c.a.bandName}</span>
                        <span className={styles.vs}>vs</span>
                        <span>{c.b.bandName}</span>
                      </div>
                      <div className={styles.conflictMeta}>
                        {formatRange(c.a.start, c.a.end)} overlaps{' '}
                        {formatRange(c.b.start, c.b.end)}
                      </div>
                    </div>

                    <div className={styles.conflictActions}>
                      <button
                        type='button'
                        className={styles.resolveBtn}
                        onClick={() => onResolveConflict(c.a.id)}
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className={styles.plan}>
            <div className={styles.sectionTitle}>Planned Sets</div>

            {plannedSets.length === 0 ? (
              <div className={styles.empty}>
                Add sets to build your schedule.
              </div>
            ) : (
              plannedSets.map((s) => (
                <div key={s.id} className={styles.item}>
                  <div className={styles.itemMain}>
                    <div className={styles.band}>{s.bandName}</div>
                    <div className={styles.meta}>
                      {formatRange(s.start, s.end)}
                    </div>
                  </div>
                  <button
                    type='button'
                    className={styles.remove}
                    onClick={() => onRemove(s.id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </section>
        </div>
      </div>

      <button
        className={styles.backdrop}
        onClick={onClose}
        aria-label='Close drawer'
      />
    </div>
  );
}
