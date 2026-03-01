import styles from './ViewToggle.module.scss';

type View = 'list' | 'timeline' | 'plan';

type Props = {
  value: View;
  onChange: (v: View) => void;
};

export function ViewToggle({ value, onChange }: Props) {
  return (
    <div
      className={`${styles.wrap} noPrint`}
      role='tablist'
      aria-label='View toggle'
    >
      <button
        type='button'
        role='tab'
        aria-selected={value === 'list'}
        className={`${styles.btn} ${value === 'list' ? styles.active : ''}`}
        onClick={() => onChange('list')}
      >
        List
      </button>

      <button
        type='button'
        role='tab'
        aria-selected={value === 'timeline'}
        className={`${styles.btn} ${value === 'timeline' ? styles.active : ''}`}
        onClick={() => onChange('timeline')}
      >
        Timeline
      </button>

      <button
        type='button'
        role='tab'
        aria-selected={value === 'plan'}
        className={`${styles.btn} ${value === 'plan' ? styles.active : ''}`}
        onClick={() => onChange('plan')}
      >
        My Plan
      </button>
    </div>
  );
}
