import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.flexInner}>
        <span className={styles.brand}>Festival Planner</span>
      </div>
    </header>
  );
};

export default Header;
