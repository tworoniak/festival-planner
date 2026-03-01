import styles from './PlanToolbar.module.scss';

type Props = {
  title: string;
  subtitle?: string;
  onPrint: () => void;
};

export function PlanToolbar({ title, subtitle, onPrint }: Props) {
  return (
    <div className={styles.bar}>
      <div>
        <div className={styles.title}>{title}</div>
        {subtitle ? <div className={styles.sub}>{subtitle}</div> : null}
      </div>

      <button type='button' className={styles.btn} onClick={onPrint}>
        Print / Save PDF
      </button>
    </div>
  );
}
