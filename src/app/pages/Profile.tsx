import { User, Mail, Calendar, Shield, Award, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
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
          Profile
        </h1>
        <p 
          className="text-sm"
          style={{ 
            fontFamily: 'var(--font-ui)',
            color: 'var(--text-secondary)'
          }}
        >
          Manage your account and view achievements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div 
            className="rounded-lg border p-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-dim)'
            }}
          >
            <div className="flex flex-col items-center">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4 text-sm font-semibold"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-card)',
                  fontFamily: 'var(--font-ui)'
                }}
              >
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--text-primary)'
                }}
              >
                {user?.username || 'User'}
              </h3>
              <div 
                className="px-3 py-1 rounded-full mb-4 text-xs font-medium tabular-nums"
                style={{
                  backgroundColor: 'var(--accent-dim)',
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                Level 5 Trader
              </div>
              <button 
                className="w-full h-9 rounded-md text-[13px] font-semibold"
                style={{
                  fontFamily: 'var(--font-ui)',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Achievements */}
          <div 
            className="rounded-lg border p-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-dim)'
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <h3 
                className="text-sm font-bold"
                style={{ 
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--text-primary)'
                }}
              >
                Achievements
              </h3>
            </div>
            <div className="space-y-2">
              {['First Trade', 'Profit Master', '7-Day Streak'].map((achievement, index) => {
                const icons = ['🎯', '💰', '🔥'];
                return (
                  <div 
                    key={achievement}
                    className="flex items-center gap-3 p-3 rounded-md"
                    style={{ backgroundColor: 'var(--bg-elevated)' }}
                  >
                    <span className="text-lg">{icons[index]}</span>
                    <span 
                      className="text-[13px] font-medium"
                      style={{ 
                        fontFamily: 'var(--font-ui)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {achievement}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div 
            className="rounded-lg border p-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-dim)'
            }}
          >
            <h3 
              className="text-sm font-bold mb-4"
              style={{ 
                fontFamily: 'var(--font-heading)',
                color: 'var(--text-primary)'
              }}
            >
              Personal Information
            </h3>
            <div className="space-y-3">
              <div 
                className="flex items-center gap-3 p-3 rounded-md"
                style={{ backgroundColor: 'var(--bg-elevated)' }}
              >
                <User className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <div>
                  <p 
                    className="text-[10px] font-semibold uppercase tracking-wider mb-0.5"
                    style={{ 
                      fontFamily: 'var(--font-ui)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    Full Name
                  </p>
                  <p 
                    className="text-[13px] font-medium"
                    style={{ 
                      fontFamily: 'var(--font-ui)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {user?.username || 'User'}
                  </p>
                </div>
              </div>
              
              <div 
                className="flex items-center gap-3 p-3 rounded-md"
                style={{ backgroundColor: 'var(--bg-elevated)' }}
              >
                <Mail className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <div>
                  <p 
                    className="text-[10px] font-semibold uppercase tracking-wider mb-0.5"
                    style={{ 
                      fontFamily: 'var(--font-ui)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    Email
                  </p>
                  <p 
                    className="text-[13px] font-medium"
                    style={{ 
                      fontFamily: 'var(--font-ui)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    john.investor@example.com
                  </p>
                </div>
              </div>

              <div 
                className="flex items-center gap-3 p-3 rounded-md"
                style={{ backgroundColor: 'var(--bg-elevated)' }}
              >
                <Calendar className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <div>
                  <p 
                    className="text-[10px] font-semibold uppercase tracking-wider mb-0.5"
                    style={{ 
                      fontFamily: 'var(--font-ui)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    Member Since
                  </p>
                  <p 
                    className="text-[13px] font-medium"
                    style={{ 
                      fontFamily: 'var(--font-ui)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    January 15, 2026
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div 
            className="rounded-lg border p-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-dim)'
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <h3 
                className="text-sm font-bold"
                style={{ 
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--text-primary)'
                }}
              >
                Trading Statistics
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Trades', value: '47' },
                { label: 'Successful Trades', value: '32' },
                { label: 'Trading Days', value: '28' },
                { label: 'Win Rate', value: '68%' },
              ].map((stat) => (
                <div 
                  key={stat.label}
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-dim)'
                  }}
                >
                  <p 
                    className="text-[10px] font-semibold uppercase tracking-wider mb-2"
                    style={{ 
                      fontFamily: 'var(--font-ui)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {stat.label}
                  </p>
                  <p 
                    className="text-2xl font-medium tabular-nums"
                    style={{ 
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div 
            className="rounded-lg border p-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-dim)'
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <h3 
                className="text-sm font-bold"
                style={{ 
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--text-primary)'
                }}
              >
                Security
              </h3>
            </div>
            <div className="space-y-3">
              <button 
                className="w-full h-9 rounded-md text-[13px] font-semibold text-left px-4"
                style={{
                  fontFamily: 'var(--font-ui)',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                Change Password
              </button>
              <button 
                className="w-full h-9 rounded-md text-[13px] font-semibold text-left px-4"
                style={{
                  fontFamily: 'var(--font-ui)',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                Enable Two-Factor Authentication
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
