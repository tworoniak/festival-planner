import styles from './Footer.module.scss';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.flexInner}>
        <a
          href='https://github.com/tworoniak'
          target='_blank'
          rel='noreferrer'
          className='flex items-center gap-2 hover:text-white/70 duration-300 transition'
        >
          <Github size={16} strokeWidth={1.5} />
          <span className='hidden lg:block'>GitHub</span>
        </a>
        <a
          href='https://www.linkedin.com/in/thomasworoniak/'
          target='_blank'
          rel='noreferrer'
          className='flex items-center gap-2 hover:text-white/70 duration-300 transition'
        >
          <Linkedin size={16} strokeWidth={1.5} />
          <span className='hidden lg:block'>LinkedIn</span>
        </a>
        <a
          href='mailto:thomasworoniak@gmail.com'
          target='_blank'
          rel='noreferrer'
          className='flex items-center gap-2 hover:text-white/70 duration-300 transition'
        >
          <Mail size={16} strokeWidth={1.5} />
          <span className='hidden lg:block'>thomasworoniak@gmail.com</span>
        </a>
      </div>
      <div className={styles.flexInner}>
        <p>&copy; {new Date().getFullYear()} Woroniak.dev</p>
      </div>
    </footer>
  );
};

export default Footer;
