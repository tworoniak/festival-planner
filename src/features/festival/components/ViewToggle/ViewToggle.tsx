import styles from './ViewToggle.module.scss';

type Props = {
  value: 'list' | 'timeline';
  onChange: (v: 'list' | 'timeline') => void;
};

export function ViewToggle({ value, onChange }: Props) {
  return (
    <div className={styles.wrap} role='tablist' aria-label='View toggle'>
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
    </div>
  );
}
