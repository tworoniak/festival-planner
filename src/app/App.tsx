import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FestivalListPage } from '../features/festival/pages/FestivalListPage';
import { FestivalPage } from '../features/festival/pages/FestivalPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<FestivalListPage />} />
        <Route path='/festivals/:festivalId' element={<FestivalPage />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}
