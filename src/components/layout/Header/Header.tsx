import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.flexInner}>
        <span className={styles.logoText}>Festival Planner</span>
      </div>
    </header>
  );
};

export default Header;
