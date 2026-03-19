import { Outlet } from 'react-router-dom';
import Header from '../layout/Header/Header';
import Footer from '../layout/Footer/Footer';
import Main from '../layout/Main/Main';
import ScrollToTopButton from '../ui/Scroll/ScrollToTopButton';
import ScrollToTop from '../ui/Scroll/ScrollToTop';

const AppLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default AppLayout;
