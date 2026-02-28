import styles from './TimelineView.module.scss';
import type { FestivalSet, FestivalStage } from '../../types/festival';
import { formatTime } from '../../utils/time';

type Props = {
  stages: FestivalStage[];
  sets: FestivalSet[]; // expects already filtered to a single day
  plannedIds: Set<string>;
  conflictingIds: Set<string>;
  highlightedSetId?: string | null;
  onTogglePlanned: (setId: string) => void;
  onResolveScroll: (setId: string) => void; // scroll/highlight behavior
};

function minutesSinceMidnight(iso: string) {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
}

export function TimelineView({
  stages,
  sets,
  plannedIds,
  conflictingIds,
  highlightedSetId,
  onTogglePlanned,
  onResolveScroll,
}: Props) {
  if (sets.length === 0) {
    return <div className={styles.empty}>No sets match filters.</div>;
  }

  const minStart = Math.min(...sets.map((s) => minutesSinceMidnight(s.start)));
  const maxEnd = Math.max(...sets.map((s) => minutesSinceMidnight(s.end)));

  const pad = 30;
  const startMin = Math.max(0, minStart - pad);
  const endMin = Math.min(24 * 60, maxEnd + pad);
  const totalMins = Math.max(1, endMin - startMin);

  // height scale: 2px per minute (~120px/hour)
  const pxPerMin = 2;
  const height = totalMins * pxPerMin;

  // Build hour ticks
  const firstHour = Math.ceil(startMin / 60);
  const lastHour = Math.floor(endMin / 60);
  const hours = [];
  for (let h = firstHour; h <= lastHour; h++) hours.push(h);

  // group sets by stage
  const byStage = new Map<string, FestivalSet[]>();
  for (const s of sets) {
    const arr = byStage.get(s.stageId) ?? [];
    arr.push(s);
    byStage.set(s.stageId, arr);
  }
  for (const [k, arr] of byStage) {
    arr.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    );
    byStage.set(k, arr);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.timeColHeader}>Time</div>
        <div className={styles.stageHeaders}>
          {stages.map((st) => (
            <div key={st.id} className={styles.stageHeader}>
              {st.label}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.timeCol} style={{ height }}>
          {hours.map((h) => {
            const y = (h * 60 - startMin) * pxPerMin;
            return (
              <div key={h} className={styles.tick} style={{ top: y }}>
                <span className={styles.tickLabel}>
                  {String(h).padStart(2, '0')}:00
                </span>
              </div>
            );
          })}
        </div>

        <div className={styles.grid} style={{ height }}>
          {/* horizontal lines */}
          {hours.map((h) => {
            const y = (h * 60 - startMin) * pxPerMin;
            return <div key={h} className={styles.hLine} style={{ top: y }} />;
          })}

          {stages.map((st) => {
            const stageSets = byStage.get(st.id) ?? [];
            return (
              <div key={st.id} className={styles.col}>
                {stageSets.map((s) => {
                  const top =
                    (minutesSinceMidnight(s.start) - startMin) * pxPerMin;
                  const bottom =
                    (minutesSinceMidnight(s.end) - startMin) * pxPerMin;
                  const h = Math.max(18, bottom - top);

                  const planned = plannedIds.has(s.id);
                  const conflicting = conflictingIds.has(s.id);
                  const highlight = highlightedSetId === s.id;

                  return (
                    <div
                      key={s.id}
                      id={`set-${s.id}`} // keep scroll target consistent
                      className={[
                        styles.block,
                        planned ? styles.planned : '',
                        conflicting ? styles.conflict : '',
                        highlight ? styles.highlight : '',
                      ].join(' ')}
                      style={{ top, height: h }}
                      role='button'
                      tabIndex={0}
                      onClick={() => onResolveScroll(s.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ')
                          onResolveScroll(s.id);
                      }}
                    >
                      <div className={styles.blockTitle}>{s.bandName}</div>
                      <div className={styles.blockMeta}>
                        {formatTime(s.start)}–{formatTime(s.end)}
                      </div>

                      <button
                        type='button'
                        className={styles.blockBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTogglePlanned(s.id);
                        }}
                      >
                        {planned ? 'Remove' : 'Add'}
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
