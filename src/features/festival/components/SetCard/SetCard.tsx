import styles from './SetCard.module.scss';
import type { FestivalSet } from '../../types/festival';
import { formatRange } from '../../utils/time';

type Props = {
  set: FestivalSet;
  stageLabel: string;

  isPlanned: boolean;
  isFavorite: boolean;
  isConflicting: boolean;

  isHighlighted?: boolean;

  onTogglePlanned: () => void;
  onToggleFavorite: () => void;
};

export function SetCard({
  set,
  stageLabel,
  isPlanned,
  isFavorite,
  isConflicting,
  isHighlighted,
  onTogglePlanned,
  onToggleFavorite,
}: Props) {
  return (
    <div
      id={`set-${set.id}`}
      data-set-id={set.id}
      className={[
        styles.card,
        isPlanned ? styles.planned : '',
        isHighlighted ? styles.highlight : '',
      ].join(' ')}
    >
      <div className={styles.top}>
        <div>
          <div className={styles.band}>{set.bandName}</div>
          <div className={styles.meta}>
            <span className={styles.time}>
              {formatRange(set.start, set.end)}
            </span>
            <span className={styles.dot}>•</span>
            <span className={styles.stage}>{stageLabel}</span>
            {isConflicting && <span className={styles.conflict}>Conflict</span>}
          </div>

          {set.genres.length > 0 && (
            <div className={styles.genres}>
              {set.genres.map((g) => (
                <span key={g} className={styles.genre}>
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            type='button'
            className={styles.iconBtn}
            onClick={onToggleFavorite}
            aria-label='Toggle favorite'
          >
            {isFavorite ? '★' : '☆'}
          </button>

          <button
            type='button'
            className={styles.planBtn}
            onClick={onTogglePlanned}
          >
            {isPlanned ? 'Remove' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
