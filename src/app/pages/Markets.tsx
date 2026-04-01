/// <reference types="vite/client" />
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: string;
  high?: number;
  low?: number;
}

// Company names mapping
const COMPANY_NAMES: Record<string, string> = {
  AAPL: 'Apple Inc.',
  MSFT: 'Microsoft Corp.',
  GOOGL: 'Alphabet Inc.',
  AMZN: 'Amazon.com Inc.',
  TSLA: 'Tesla Inc.',
  NVDA: 'NVIDIA Corp.',
  META: 'Meta Platforms',
  NFLX: 'Netflix Inc.',
  JPM: 'JPMorgan Chase',
  V: 'Visa Inc.',
  AMD: 'Advanced Micro Devices',
  INTC: 'Intel Corp.',
  DIS: 'Walt Disney Co.',
  PYPL: 'PayPal Holdings',
  UBER: 'Uber Technologies',
  COIN: 'Coinbase Global',
  SPOT: 'Spotify Technology',
  SNAP: 'Snap Inc.',
  MA: 'Mastercard Inc.',
  UNH: 'UnitedHealth Group',
};

const SYMBOLS = Object.keys(COMPANY_NAMES);

// Fallback mock data when API limit is hit
const MOCK_DATA: Stock[] = [
  { symbol: 'AAPL',  name: 'Apple Inc.',            price: 178.45,  change: 2.35,   changePercent: 1.33  },
  { symbol: 'MSFT',  name: 'Microsoft Corp.',        price: 415.23,  change: 5.67,   changePercent: 1.38  },
  { symbol: 'GOOGL', name: 'Alphabet Inc.',          price: 142.68,  change: -1.22,  changePercent: -0.85 },
  { symbol: 'AMZN',  name: 'Amazon.com Inc.',        price: 178.92,  change: -2.45,  changePercent: -1.35 },
  { symbol: 'TSLA',  name: 'Tesla Inc.',             price: 234.56,  change: 8.92,   changePercent: 3.95  },
  { symbol: 'NVDA',  name: 'NVIDIA Corp.',           price: 878.45,  change: 15.67,  changePercent: 1.81  },
  { symbol: 'META',  name: 'Meta Platforms',         price: 512.34,  change: 3.21,   changePercent: 0.63  },
  { symbol: 'NFLX',  name: 'Netflix Inc.',           price: 623.12,  change: -4.32,  changePercent: -0.69 },
  { symbol: 'JPM',   name: 'JPMorgan Chase',         price: 198.72,  change: 1.84,   changePercent: 0.93  },
  { symbol: 'V',     name: 'Visa Inc.',              price: 275.60,  change: 2.10,   changePercent: 0.77  },
  { symbol: 'AMD',   name: 'Advanced Micro Devices', price: 168.90,  change: 5.20,   changePercent: 3.17  },
  { symbol: 'INTC',  name: 'Intel Corp.',            price: 43.22,   change: -0.98,  changePercent: -2.22 },
  { symbol: 'DIS',   name: 'Walt Disney Co.',        price: 111.34,  change: -1.56,  changePercent: -1.38 },
  { symbol: 'PYPL',  name: 'PayPal Holdings',        price: 62.45,   change: -1.18,  changePercent: -1.85 },
  { symbol: 'UBER',  name: 'Uber Technologies',      price: 74.80,   change: -2.10,  changePercent: -2.73 },
  { symbol: 'COIN',  name: 'Coinbase Global',        price: 198.30,  change: -8.45,  changePercent: -4.09 },
  { symbol: 'SPOT',  name: 'Spotify Technology',     price: 312.45,  change: -3.67,  changePercent: -1.16 },
  { symbol: 'SNAP',  name: 'Snap Inc.',              price: 11.23,   change: -0.45,  changePercent: -3.85 },
  { symbol: 'MA',    name: 'Mastercard Inc.',        price: 462.18,  change: 4.32,   changePercent: 0.94  },
  { symbol: 'UNH',   name: 'UnitedHealth Group',     price: 521.30,  change: 6.45,   changePercent: 1.25  },
];

// ─── Fetch a single stock from Alpha Vantage ───────────────────────────────
async function fetchStockQuote(symbol: string, apiKey: string): Promise<Stock | null> {
  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    );
    const data = await res.json();
    const q = data['Global Quote'];
    if (!q || !q['05. price']) return null;

    return {
      symbol: q['01. symbol'],
      name: COMPANY_NAMES[symbol] || symbol,
      price: parseFloat(q['05. price']),
      change: parseFloat(q['09. change']),
      changePercent: parseFloat(q['10. change percent']),
      volume: parseInt(q['06. volume']).toLocaleString(),
      high: parseFloat(q['03. high']),
      low: parseFloat(q['04. low']),
    };
  } catch {
    return null;
  }
}

export function Markets() {
  const [stocks, setStocks] = useState<Stock[]>(MOCK_DATA);
  const [filter, setFilter] = useState<'all' | 'gainers' | 'losers'>('all');
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  /// <reference types="vite/client" />
  const [lastUpdated, setLastUpdated] = useState<string>('Using demo data');
  const [apiKey] = useState(import.meta.env.VITE_ALPHA_VANTAGE_KEY || '');

  // Fetch live data
  const fetchLiveData = async () => {
    if (!apiKey) return;
    setLoading(true);
    try {
      // Alpha Vantage free tier: 25 requests/day, fetch first 5 only
      const symbolsToFetch = SYMBOLS.slice(0, 5);
      const results = await Promise.all(
        symbolsToFetch.map(s => fetchStockQuote(s, apiKey))
      );
      const live = results.filter(Boolean) as Stock[];

      if (live.length > 0) {
        // Merge live data with mock for remaining stocks
        const merged = MOCK_DATA.map(mock => {
          const liveStock = live.find(l => l.symbol === mock.symbol);
          return liveStock || mock;
        });
        setStocks(merged);
        setIsLive(true);
        setLastUpdated(`Live · ${new Date().toLocaleTimeString()}`);
      }
    } catch {
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apiKey) fetchLiveData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      if (apiKey) fetchLiveData();
    }, 60000);
    return () => clearInterval(interval);
  }, [apiKey]);

  const filteredStocks = stocks.filter(stock => {
    if (filter === 'gainers') return stock.changePercent > 0;
    if (filter === 'losers') return stock.changePercent < 0;
    return true;
  });

  const gainerCount = stocks.filter(s => s.changePercent > 0).length;
  const loserCount = stocks.filter(s => s.changePercent < 0).length;

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* Page Header */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-dim)' }}
      >
        <div>
          <h1
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
          >
            Markets
          </h1>
          <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
            Track stocks, filter gainers & losers
          </p>
        </div>

        {/* Live indicator + refresh */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isLive ? (
              <Wifi className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            ) : (
              <WifiOff className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
            )}
            <span className="text-[11px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
              {lastUpdated}
            </span>
          </div>
          <button
            onClick={fetchLiveData}
            disabled={loading || !apiKey}
            className="flex items-center gap-1.5 px-3 h-7 rounded text-[11px] font-medium"
            style={{
              fontFamily: 'var(--font-ui)',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              color: apiKey ? 'var(--text-secondary)' : 'var(--text-muted)',
              cursor: apiKey ? 'pointer' : 'not-allowed',
              opacity: loading ? 0.6 : 1,
            }}
          >
            <RefreshCw
              className="w-3 h-3"
              style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}
            />
            {loading ? 'Updating...' : apiKey ? 'Refresh' : 'Add API Key'}
          </button>
        </div>
      </div>

      {/* API Key Banner — shows only if no key set */}
      {!apiKey && (
        <div
          className="mx-6 mt-4 px-4 py-3 rounded-lg text-[12px] flex items-center gap-2"
          style={{
            backgroundColor: 'rgba(245,200,66,0.08)',
            border: '1px solid rgba(245,200,66,0.25)',
            color: 'var(--yellow)',
            fontFamily: 'var(--font-ui)',
          }}
        >
          <span>⚡</span>
          <span>
            Showing demo data. To get live prices, add your free Alpha Vantage API key:
            create a <strong>.env</strong> file in your project root and add{' '}
            <code
              className="px-1.5 py-0.5 rounded text-[11px]"
              style={{ backgroundColor: 'rgba(245,200,66,0.15)' }}
            >
              VITE_ALPHA_VANTAGE_KEY=your_key_here
            </code>
            {' '}— get a free key at{' '}
            <a
              href="https://alphavantage.co"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              alphavantage.co
            </a>
          </span>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div
          className="rounded-lg border overflow-hidden"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-dim)' }}
        >
          {/* Table Header */}
          <div
            className="flex items-center justify-between p-4 border-b"
            style={{ borderColor: 'var(--border-dim)' }}
          >
            <div className="flex items-center gap-3">
              <h3
                className="text-sm font-bold"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
              >
                All Stocks
              </h3>
              <span
                className="text-[11px] px-2 py-0.5 rounded"
                style={{
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: 'var(--bg-elevated)',
                  color: 'var(--text-muted)',
                }}
              >
                {filteredStocks.length} stocks
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2">
              {/* ALL */}
              <button
                onClick={() => setFilter('all')}
                className="h-6 px-3 rounded text-[11px] font-medium"
                style={{
                  fontFamily: 'var(--font-ui)',
                  backgroundColor: filter === 'all' ? 'var(--bg-elevated)' : 'transparent',
                  border: filter === 'all' ? '1px solid var(--border-strong)' : '1px solid var(--border-default)',
                  color: filter === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                All
              </button>

              {/* GAINERS */}
              <button
                onClick={() => setFilter('gainers')}
                className="h-6 px-3 rounded text-[11px] font-medium flex items-center gap-1.5"
                style={{
                  fontFamily: 'var(--font-ui)',
                  backgroundColor: filter === 'gainers' ? 'var(--accent-dim)' : 'transparent',
                  border: filter === 'gainers' ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                  color: filter === 'gainers' ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                Gainers
                <span
                  className="px-1 rounded text-[10px]"
                  style={{
                    backgroundColor: filter === 'gainers' ? 'rgba(255,255,255,0.1)' : 'var(--bg-elevated)',
                    color: filter === 'gainers' ? 'var(--accent)' : 'var(--text-muted)',
                  }}
                >
                  {gainerCount}
                </span>
              </button>

              {/* LOSERS */}
              <button
                onClick={() => setFilter('losers')}
                className="h-6 px-3 rounded text-[11px] font-medium flex items-center gap-1.5"
                style={{
                  fontFamily: 'var(--font-ui)',
                  backgroundColor: filter === 'losers' ? 'var(--red-dim)' : 'transparent',
                  border: filter === 'losers' ? '1px solid var(--red)' : '1px solid var(--border-default)',
                  color: filter === 'losers' ? 'var(--red)' : 'var(--text-secondary)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--red)' }} />
                Losers
                <span
                  className="px-1 rounded text-[10px]"
                  style={{
                    backgroundColor: filter === 'losers' ? 'rgba(255,255,255,0.1)' : 'var(--bg-elevated)',
                    color: filter === 'losers' ? 'var(--red)' : 'var(--text-muted)',
                  }}
                >
                  {loserCount}
                </span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-dim)' }}>
                  {['#', 'Symbol', 'Company', 'Price', 'Change', 'Change %', 'Volume', 'Action'].map((col, i) => (
                    <th
                      key={col}
                      className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider"
                      style={{
                        fontFamily: 'var(--font-ui)',
                        color: 'var(--text-muted)',
                        textAlign: i <= 2 ? 'left' : 'right',
                        width: i === 0 ? '40px' : i === 7 ? '80px' : undefined,
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStocks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[13px]" style={{ color: 'var(--text-muted)' }}>
                      {filter === 'gainers' ? '📉 No gainers right now' : '📈 No losers right now'}
                    </td>
                  </tr>
                ) : (
                  filteredStocks.map((stock, index) => {
                    const isPositive = stock.changePercent >= 0;
                    const isSelected = selectedRow === stock.symbol;

                    return (
                      <tr
                        key={stock.symbol}
                        className="relative cursor-pointer"
                        style={{
                          backgroundColor: isSelected ? 'var(--accent-dim)' : 'transparent',
                          borderBottom: index === filteredStocks.length - 1 ? 'none' : '1px solid var(--border-dim)',
                        }}
                        onClick={() => setSelectedRow(isSelected ? null : stock.symbol)}
                        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; }}
                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        {/* Active left bar */}
                        {isSelected && (
                          <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ backgroundColor: 'var(--accent)' }} />
                        )}

                        {/* # */}
                        <td className="px-4 py-3 text-[11px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {index + 1}
                        </td>

                        {/* Symbol */}
                        <td className="px-4 py-3">
                          <span className="text-[13px] font-semibold tabular-nums" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                            {stock.symbol}
                          </span>
                        </td>

                        {/* Company */}
                        <td className="px-4 py-3">
                          <span className="text-xs" style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-secondary)' }}>
                            {stock.name}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3 text-right">
                          <span className="text-[13px] font-medium tabular-nums" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                            ${stock.price.toFixed(2)}
                          </span>
                        </td>

                        {/* Change */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {isPositive
                              ? <TrendingUp className="w-2.5 h-2.5" style={{ color: 'var(--accent)' }} />
                              : <TrendingDown className="w-2.5 h-2.5" style={{ color: 'var(--red)' }} />
                            }
                            <span className="text-xs font-medium tabular-nums" style={{ fontFamily: 'var(--font-mono)', color: isPositive ? 'var(--accent)' : 'var(--red)' }}>
                              {isPositive ? '+' : ''}{stock.change.toFixed(2)}
                            </span>
                          </div>
                        </td>

                        {/* Change % */}
                        <td className="px-4 py-3 text-right">
                          <span
                            className="inline-block px-2 py-0.5 rounded text-xs font-medium tabular-nums"
                            style={{
                              fontFamily: 'var(--font-mono)',
                              backgroundColor: isPositive ? 'var(--accent-dim)' : 'var(--red-dim)',
                              color: isPositive ? 'var(--accent)' : 'var(--red)',
                            }}
                          >
                            {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </span>
                        </td>

                        {/* Volume */}
                        <td className="px-4 py-3 text-right">
                          <span className="text-[11px] tabular-nums" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                            {stock.volume || '—'}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={e => { e.stopPropagation(); alert(`Trade ${stock.symbol} — connect your backend!`); }}
                            className="h-6 px-3 rounded text-[11px] font-semibold"
                            style={{
                              fontFamily: 'var(--font-ui)',
                              border: '1px solid var(--border-strong)',
                              color: 'var(--text-secondary)',
                              backgroundColor: 'transparent',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.borderColor = 'var(--accent)';
                              e.currentTarget.style.color = 'var(--accent)';
                              e.currentTarget.style.backgroundColor = 'var(--accent-dim)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.borderColor = 'var(--border-strong)';
                              e.currentTarget.style.color = 'var(--text-secondary)';
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            Trade
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}