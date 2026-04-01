import { Search, Wallet, Bell, ChevronRight } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useLocation } from 'react-router';

interface TopBarProps {
  walletBalance: number;
  profitLoss: number;
  profitLossPercent: number;
}

export function TopBar({ walletBalance, profitLoss, profitLossPercent }: TopBarProps) {
  const isProfit = profitLoss >= 0;
  const location = useLocation();
  const marketOpen = true; // Mock market status

  // Get page name from route
  const getPageName = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/portfolio') return 'Portfolio';
    if (path === '/markets') return 'Markets';
    if (path === '/trade') return 'Buy/Sell';
    if (path === '/watchlist') return 'Watchlist';
    if (path === '/transactions') return 'Transactions';
    if (path === '/profile') return 'Profile';
    if (path === '/settings') return 'Settings';
    if (path === '/leaderboard') return 'Leaderboard';
    return 'Dashboard';
  };

  return (
    <div 
      className="h-[52px] flex items-center justify-between px-6 border-b"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-dim)'
      }}
    >
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2">
        <span 
          className="text-xs"
          style={{ 
            fontFamily: 'var(--font-ui)',
            color: 'var(--text-muted)'
          }}
        >
          Home
        </span>
        <ChevronRight className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
        <span 
          className="text-xs font-medium"
          style={{ 
            fontFamily: 'var(--font-ui)',
            color: 'var(--text-secondary)'
          }}
        >
          {getPageName()}
        </span>
      </div>

      {/* Center: Search */}
      <div className="relative w-[320px]">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
          style={{ color: 'var(--text-muted)' }}
        />
        <input
          type="text"
          placeholder="Search stocks, indices..."
          className="w-full h-8 pl-9 pr-3 rounded-md text-[13px] outline-none"
          style={{
            fontFamily: 'var(--font-ui)',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-primary)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-default)';
            e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
          }}
        />
      </div>

      {/* Right: Status, Wallet, P/L, Theme, Notifications, Avatar */}
      <div className="flex items-center gap-4">
        {/* Market Status */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div 
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: marketOpen ? 'var(--accent)' : 'var(--red)' }}
            />
            {marketOpen && (
              <div 
                className="absolute inset-0 w-1.5 h-1.5 rounded-full animate-ping"
                style={{ backgroundColor: 'var(--accent)' }}
              />
            )}
          </div>
          <span 
            className="text-[11px] font-medium"
            style={{ 
              fontFamily: 'var(--font-ui)',
              color: marketOpen ? 'var(--accent)' : 'var(--red)'
            }}
          >
            {marketOpen ? 'NSE Open' : 'NSE Closed'}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-4" style={{ backgroundColor: 'var(--border-default)' }} />

        {/* Wallet */}
        <div className="flex items-center gap-2">
          <Wallet className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
          <span 
            className="text-sm font-medium tabular-nums"
            style={{ 
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)'
            }}
          >
            ${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* P/L Badge */}
        <div 
          className="px-2 py-1 rounded"
          style={{
            backgroundColor: isProfit ? 'var(--accent-dim)' : 'var(--red-dim)',
            color: isProfit ? 'var(--accent)' : 'var(--red)'
          }}
        >
          <span 
            className="text-xs font-medium tabular-nums"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {isProfit ? '+' : ''}${profitLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            {' '}
            ({isProfit ? '+' : ''}{profitLossPercent.toFixed(2)}%)
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-4" style={{ backgroundColor: 'var(--border-default)' }} />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <button 
          className="relative p-1.5 rounded-md"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <Bell className="w-4 h-4" />
          <div 
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: 'var(--red)' }}
          />
        </button>

        {/* Avatar */}
        <button 
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
          style={{ 
            backgroundColor: 'var(--accent)',
            color: 'var(--bg-card)',
            fontFamily: 'var(--font-ui)'
          }}
        >
          JD
        </button>
      </div>
    </div>
  );
}
