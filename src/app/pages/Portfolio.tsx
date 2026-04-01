import { TrendingUp, TrendingDown } from 'lucide-react';
import { mockPortfolio, totalPortfolioValue, totalProfitLoss, totalProfitLossPercent } from '../data/mockData';

export function Portfolio() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 
          className="text-2xl font-bold mb-1"
          style={{ 
            fontFamily: 'var(--font-heading)',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em'
          }}
        >
          My Portfolio
        </h1>
        <p 
          className="text-sm"
          style={{ 
            fontFamily: 'var(--font-ui)',
            color: 'var(--text-secondary)'
          }}
        >
          Track your current holdings and performance
        </p>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div 
          className="rounded-lg border p-5"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-dim)'
          }}
        >
          <p 
            className="text-[10px] font-semibold uppercase tracking-wider mb-1"
            style={{ 
              fontFamily: 'var(--font-ui)',
              color: 'var(--text-muted)'
            }}
          >
            Total Value
          </p>
          <p 
            className="text-2xl font-medium tabular-nums"
            style={{ 
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)'
            }}
          >
            ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        
        <div 
          className="rounded-lg border p-5"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-dim)'
          }}
        >
          <p 
            className="text-[10px] font-semibold uppercase tracking-wider mb-1"
            style={{ 
              fontFamily: 'var(--font-ui)',
              color: 'var(--text-muted)'
            }}
          >
            Total Profit/Loss
          </p>
          <div className="flex items-center gap-2">
            <p 
              className="text-2xl font-medium tabular-nums"
              style={{ 
                fontFamily: 'var(--font-mono)',
                color: totalProfitLoss >= 0 ? 'var(--accent)' : 'var(--red)'
              }}
            >
              {totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span 
              className="text-xs font-medium tabular-nums"
              style={{ 
                fontFamily: 'var(--font-mono)',
                color: totalProfitLoss >= 0 ? 'var(--accent)' : 'var(--red)'
              }}
            >
              ({totalProfitLoss >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div 
          className="rounded-lg border p-5"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-dim)'
          }}
        >
          <p 
            className="text-[10px] font-semibold uppercase tracking-wider mb-1"
            style={{ 
              fontFamily: 'var(--font-ui)',
              color: 'var(--text-muted)'
            }}
          >
            Total Holdings
          </p>
          <p 
            className="text-2xl font-medium tabular-nums"
            style={{ 
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)'
            }}
          >
            {mockPortfolio.length} Stocks
          </p>
        </div>
      </div>

      {/* Portfolio Holdings Table */}
      <div 
        className="rounded-lg border overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-dim)'
        }}
      >
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--border-dim)' }}>
          <h3 
            className="text-sm font-bold"
            style={{ 
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-primary)'
            }}
          >
            Holdings
          </h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border-dim)' }}>
                <th 
                  className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wider"
                  style={{ 
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--text-muted)'
                  }}
                >
                  Symbol
                </th>
                <th 
                  className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wider"
                  style={{ 
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--text-muted)'
                  }}
                >
                  Company
                </th>
                <th 
                  className="px-4 py-2 text-right text-[10px] font-semibold uppercase tracking-wider"
                  style={{ 
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--text-muted)'
                  }}
                >
                  Shares
                </th>
                <th 
                  className="px-4 py-2 text-right text-[10px] font-semibold uppercase tracking-wider"
                  style={{ 
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--text-muted)'
                  }}
                >
                  Avg. Price
                </th>
                <th 
                  className="px-4 py-2 text-right text-[10px] font-semibold uppercase tracking-wider"
                  style={{ 
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--text-muted)'
                  }}
                >
                  Current Price
                </th>
                <th 
                  className="px-4 py-2 text-right text-[10px] font-semibold uppercase tracking-wider"
                  style={{ 
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--text-muted)'
                  }}
                >
                  Total Value
                </th>
                <th 
                  className="px-4 py-2 text-right text-[10px] font-semibold uppercase tracking-wider"
                  style={{ 
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--text-muted)'
                  }}
                >
                  P/L
                </th>
              </tr>
            </thead>
            <tbody>
              {mockPortfolio.map((stock, index) => {
                const isProfit = stock.profitLoss >= 0;
                const isLastRow = index === mockPortfolio.length - 1;

                return (
                  <tr 
                    key={stock.symbol}
                    className="cursor-pointer"
                    style={{
                      borderBottom: isLastRow ? 'none' : '1px solid var(--border-dim)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td className="px-4 py-3">
                      <span 
                        className="text-[13px] font-semibold tabular-nums"
                        style={{ 
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        {stock.symbol}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span 
                        className="text-xs"
                        style={{ 
                          fontFamily: 'var(--font-ui)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {stock.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span 
                        className="text-[13px] font-medium tabular-nums"
                        style={{ 
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        {stock.shares}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span 
                        className="text-[13px] font-medium tabular-nums"
                        style={{ 
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        ${stock.avgPrice.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span 
                        className="text-[13px] font-medium tabular-nums"
                        style={{ 
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        ${stock.currentPrice.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span 
                        className="text-[13px] font-medium tabular-nums"
                        style={{ 
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        ${stock.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isProfit ? (
                          <TrendingUp className="w-3 h-3" style={{ color: 'var(--accent)' }} />
                        ) : (
                          <TrendingDown className="w-3 h-3" style={{ color: 'var(--red)' }} />
                        )}
                        <div>
                          <span 
                            className="text-[13px] font-medium tabular-nums"
                            style={{ 
                              fontFamily: 'var(--font-mono)',
                              color: isProfit ? 'var(--accent)' : 'var(--red)'
                            }}
                          >
                            {isProfit ? '+' : ''}${Math.abs(stock.profitLoss).toFixed(2)}
                          </span>
                          <span 
                            className="text-xs ml-1 tabular-nums"
                            style={{ 
                              fontFamily: 'var(--font-mono)',
                              color: isProfit ? 'var(--accent)' : 'var(--red)'
                            }}
                          >
                            ({isProfit ? '+' : ''}{stock.profitLossPercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
