import { Link } from 'react-router-dom';
import { FESTIVALS } from '../data/festivals';

export function FestivalListPage() {
  return (
    <div className='container'>
      <h1>Festivals</h1>
      <p style={{ color: 'var(--muted)' }}>
        Pick a festival to plan your schedule.
      </p>

      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        {FESTIVALS.map((f) => (
          <Link
            key={f.id}
            to={`/festivals/${f.id}`}
            style={{
              textDecoration: 'none',
              border: '1px solid var(--border)',
              background: 'var(--panel)',
              padding: 14,
              borderRadius: 'var(--r)',
            }}
          >
            <div style={{ fontWeight: 800 }}>{f.name}</div>
            <div style={{ color: 'var(--muted)', marginTop: 4, fontSize: 13 }}>
              {f.location ? `${f.location} • ` : ''}
              {f.dates ?? ''}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
