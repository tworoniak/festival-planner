import styles from './ScrollToTopButton.module.scss';
import { useScrollPosition } from '../../../hooks/useScrollPosition';
import { ArrowUp } from 'lucide-react';

const ScrollToTopButton = () => {
  const isVisible = useScrollPosition(300);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`${styles.scrollToTop} ${isVisible ? styles.show : ''}`}
      aria-label='Scroll to top'
    >
      <ArrowUp size={20} />
    </button>
  );
};

export default ScrollToTopButton;
