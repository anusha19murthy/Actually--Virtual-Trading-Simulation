/// <reference types="vite/client" />
import { NewsFeed } from '../components/NewsFeed';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router';
import { walletBalance, totalPortfolioValue, todayProfitLoss, todayProfitLossPercent, netWorth } from '../data/mockData';

export function Dashboard() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Stats Bar */}
      <div
        className="h-[72px] flex items-stretch border-b"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-dim)' }}
      >
        <StatBlock label="Net Worth" value={netWorth} change={todayProfitLoss} changePercent={todayProfitLossPercent} />
        <div className="w-px" style={{ backgroundColor: 'var(--border-dim)' }} />
        <StatBlock label="Cash Balance" value={walletBalance} />
        <div className="w-px" style={{ backgroundColor: 'var(--border-dim)' }} />
        <StatBlock label="Portfolio Value" value={totalPortfolioValue} />
        <div className="w-px" style={{ backgroundColor: 'var(--border-dim)' }} />
        <StatBlock label="Today P/L" value={todayProfitLoss} change={todayProfitLoss} changePercent={todayProfitLossPercent} showSign />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 overflow-hidden">
        <div className="flex flex-col gap-5 overflow-y-auto">
          <RecentTransactions />
        </div>
        <div className="flex flex-col gap-5 overflow-y-auto">
          <NewsFeed />
        </div>
      </div>
    </div>
  );
}

interface StatBlockProps {
  label: string;
  value: number;
  change?: number;
  changePercent?: number;
  showSign?: boolean;
}

function StatBlock({ label, value, change, changePercent, showSign }: StatBlockProps) {
  const isProfit = (change ?? 0) >= 0;
  return (
    <div className="flex-1 flex flex-col justify-center px-6">
      <div className="text-[10px] font-semibold uppercase tracking-wider mb-1"
        style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xl font-medium tabular-nums"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
          {showSign && value >= 0 ? '+' : ''}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        {change !== undefined && changePercent !== undefined && (
          <div className="flex items-center gap-1">
            {isProfit
              ? <TrendingUp className="w-3 h-3" style={{ color: 'var(--accent)' }} />
              : <TrendingDown className="w-3 h-3" style={{ color: 'var(--red)' }} />}
            <span className="text-[11px] font-medium tabular-nums"
              style={{ fontFamily: 'var(--font-mono)', color: isProfit ? 'var(--accent)' : 'var(--red)' }}>
              {isProfit ? '+' : ''}{changePercent.toFixed(2)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function RecentTransactions() {
  const navigate = useNavigate();
  const transactions = [
    { type: 'BUY',  symbol: 'AAPL',  company: 'Apple Inc.',      qty: 10, amount: 1784.50, pl: 32.50,  timestamp: '2h ago' },
    { type: 'SELL', symbol: 'GOOGL', company: 'Alphabet Inc.',    qty: 5,  amount: 713.40,  pl: -28.20, timestamp: '5h ago' },
    { type: 'BUY',  symbol: 'MSFT',  company: 'Microsoft Corp.',  qty: 8,  amount: 3321.84, pl: 77.84,  timestamp: '1d ago' },
    { type: 'BUY',  symbol: 'NVDA',  company: 'NVIDIA Corp.',     qty: 3,  amount: 2635.35, pl: 145.20, timestamp: '2d ago' },
  ];

  return (
    <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-dim)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
          Recent Activity
        </h3>
        <button onClick={() => navigate('/transactions')} className="text-[11px] font-medium"
          style={{ fontFamily: 'var(--font-ui)', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
          View All →
        </button>
      </div>
      <div className="space-y-2">
        {transactions.map((tx, index) => {
          const isBuy = tx.type === 'BUY';
          const isProfit = tx.pl >= 0;
          return (
            <div key={index} className="flex items-center gap-3 p-2 rounded-md"
              style={{ backgroundColor: 'var(--bg-elevated)' }}>
              <div className="px-2 py-0.5 rounded text-[9px] font-bold"
                style={{ fontFamily: 'var(--font-ui)', backgroundColor: isBuy ? 'var(--accent-dim)' : 'var(--red-dim)', color: isBuy ? 'var(--accent)' : 'var(--red)' }}>
                {tx.type}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold tabular-nums" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                  {tx.symbol}
                </div>
                <div className="text-[11px] truncate" style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-muted)' }}>
                  x{tx.qty} shares
                </div>
              </div>
              <div className="text-right">
                <div className="text-[13px] font-medium tabular-nums" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                  ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] font-medium tabular-nums" style={{ fontFamily: 'var(--font-mono)', color: isProfit ? 'var(--accent)' : 'var(--red)' }}>
                  {isProfit ? '+' : ''}${Math.abs(tx.pl).toFixed(2)}
                </div>
              </div>
              <div className="text-[11px] w-12 text-right" style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-muted)' }}>
                {tx.timestamp}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}