import { createBrowserRouter } from 'react-router';
import { Root } from './pages/Root';
import { Dashboard } from './pages/Dashboard';
import { Portfolio } from './pages/Portfolio';
import { Profile } from './pages/Profile';
import { Transactions } from './pages/Transactions';
import { News } from './pages/News';
import { Markets } from './pages/Markets';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: 'portfolio', Component: Portfolio },
      { path: 'markets', Component: Markets },
      { path: 'news', Component: News },
      { path: 'profile', Component: Profile },
      { path: 'transactions', Component: Transactions },
    ],
  },
]);