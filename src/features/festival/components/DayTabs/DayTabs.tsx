import styles from './DayTabs.module.scss';
import type { FestivalDay } from '../../types/festival';

type Props = {
  days: FestivalDay[];
  value: string;
  onChange: (dayId: string) => void;
};

export function DayTabs({ days, value, onChange }: Props) {
  return (
    <div
      className={`${styles.tabs} noPrint`}
      role='tablist'
      aria-label='Festival days'
    >
      {days.map((d) => {
        const active = d.id === value;
        return (
          <button
            key={d.id}
            role='tab'
            aria-selected={active}
            className={`${styles.tab} ${active ? styles.active : ''}`}
            onClick={() => onChange(d.id)}
            type='button'
          >
            {d.label}
          </button>
        );
      })}
    </div>
  );
}
