import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative w-7 h-4 rounded-full flex items-center"
      style={{
        backgroundColor: theme === 'dark' ? 'var(--accent-dim)' : 'var(--bg-elevated)',
        border: '1px solid var(--border-default)'
      }}
      aria-label="Toggle theme"
    >
      <div 
        className="absolute w-3 h-3 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          backgroundColor: theme === 'dark' ? 'var(--accent)' : 'var(--text-secondary)',
          transform: theme === 'dark' ? 'translateX(14px)' : 'translateX(2px)'
        }}
      >
        {theme === 'dark' ? (
          <Moon className="w-2 h-2" style={{ color: 'var(--bg-card)' }} />
        ) : (
          <Sun className="w-2 h-2" style={{ color: 'var(--bg-card)' }} />
        )}
      </div>
    </button>
  );
}
