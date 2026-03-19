import { createBrowserRouter, Navigate } from 'react-router-dom';
import { FestivalListPage } from '../features/festival/pages/FestivalListPage';
import { FestivalPage } from '../features/festival/pages/FestivalPage';
import AppLayout from '../components/layout/AppLayout';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <FestivalListPage /> },
      { path: '/festivals/:festivalId', element: <FestivalPage /> },
      { path: '*', element: <Navigate to='/' replace /> },
    ],
  },
]);
