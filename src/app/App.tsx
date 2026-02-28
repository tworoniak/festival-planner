import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from '../components/ui/Toast/ToastProvider';
import { FestivalListPage } from '../features/festival/pages/FestivalListPage';
import { FestivalPage } from '../features/festival/pages/FestivalPage';
import ScrollToTop from '../components/ui/Scroll/ScrollToTop';
import ScrollToTopButton from '../components/ui/Scroll/ScrollToTopButton';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<FestivalListPage />} />
          <Route path='/festivals/:festivalId' element={<FestivalPage />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
        <ScrollToTopButton />
      </BrowserRouter>
    </ToastProvider>
  );
}
