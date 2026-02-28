import { Link } from 'react-router-dom';
import styles from './FestivalListPage.module.scss';
import { FESTIVALS } from '../data/festivals';

export function FestivalListPage() {
  return (
    <div className='container'>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Festivals</h1>
          <div className={styles.sub}>Pick a festival and build your plan.</div>
        </div>
      </div>

      <div className={styles.grid}>
        {FESTIVALS.map((f, idx) => {
          const wide = idx === 0; // subtle “bento” variation
          return (
            <Link
              key={f.id}
              to={`/festivals/${f.id}`}
              className={`${styles.card} ${wide ? styles.cardWide : ''}`}
            >
              <div className={styles.media}>
                {f.image ? (
                  <>
                    <img className={styles.img} src={f.image} alt='' />
                    <div className={styles.fade} />
                  </>
                ) : null}
              </div>

              <div className={styles.body}>
                <div className={styles.name}>{f.name}</div>

                <div className={styles.meta}>
                  {f.location ? <span>{f.location}</span> : null}
                  {f.location && f.dates ? <span>•</span> : null}
                  {f.dates ? <span>{f.dates}</span> : null}
                  <span className={styles.arrow}>→</span>
                </div>

                <div className={styles.pill}>Open planner</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
