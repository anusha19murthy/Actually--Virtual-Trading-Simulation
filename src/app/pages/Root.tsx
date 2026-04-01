import { Outlet, useLocation } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { walletBalance, totalProfitLoss, totalProfitLossPercent } from '../data/mockData';

export function Root() {
  const location = useLocation();
  const isDashboard = location.pathname === '/';

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-root)' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar
          walletBalance={walletBalance}
          profitLoss={totalProfitLoss}
          profitLossPercent={totalProfitLossPercent}
        />

        {/* Page Content */}
        <main className={`flex-1 ${isDashboard ? 'overflow-hidden' : 'overflow-auto'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}