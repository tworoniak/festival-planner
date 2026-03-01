import styles from './FiltersBar.module.scss';

type Props = {
  query: string;
  onQueryChange: (v: string) => void;

  allGenres: string[];
  selectedGenres: string[];
  onToggleGenre: (genre: string) => void;

  favoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
};

export function FiltersBar({
  query,
  onQueryChange,
  allGenres,
  selectedGenres,
  onToggleGenre,
  favoritesOnly,
  onToggleFavoritesOnly,
}: Props) {
  return (
    <div className={`${styles.wrap} noPrint`}>
      <div className={styles.row}>
        <input
          className={styles.search}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder='Search bands…'
          aria-label='Search bands'
        />
        <label className={styles.toggle}>
          <input
            type='checkbox'
            checked={favoritesOnly}
            onChange={onToggleFavoritesOnly}
          />
          <span>Favorites only</span>
        </label>
      </div>

      <div className={styles.genres} aria-label='Genre filters'>
        {allGenres.map((g) => {
          const active = selectedGenres.includes(g);
          return (
            <button
              key={g}
              type='button'
              onClick={() => onToggleGenre(g)}
              className={`${styles.chip} ${active ? styles.active : ''}`}
              aria-pressed={active}
            >
              {g}
            </button>
          );
        })}
      </div>
    </div>
  );
}
