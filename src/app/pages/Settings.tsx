import React from 'react';
import { Moon, Sun, Globe, Bell, Shield, Database, User } from 'lucide-react';
import TopBar from '../components/TopBar';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      
      <main className="container mx-auto px-6 pt-24 pb-8 max-w-4xl">
        <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground mb-8">Manage your preferences and account settings</p>

        {/* Appearance */}
        <div className="bg-card rounded-lg p-6 border border-border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sun className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-3 block">Theme</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-lg border-2 transition ${
                    theme === 'dark'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-accent/50'
                  }`}
                >
                  <Moon className="w-5 h-5 mx-auto mb-2" />
                  <p className="text-sm font-medium">Dark</p>
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-lg border-2 transition ${
                    theme === 'light'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-accent/50'
                  }`}
                >
                  <Sun className="w-5 h-5 mx-auto mb-2" />
                  <p className="text-sm font-medium">Light</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-card rounded-lg p-6 border border-border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Preferences</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Language</label>
              <p className="text-xs text-muted-foreground mb-2">App display language</p>
              <select className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-lg p-6 border border-border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Price Alerts</p>
                <p className="text-xs text-muted-foreground">Get notified when stocks hit your target price</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-accent rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Trade Confirmations</p>
                <p className="text-xs text-muted-foreground">Get notified when trades are executed</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-accent rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Market News</p>
                <p className="text-xs text-muted-foreground">Receive breaking market news and updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-accent rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Weekly Report</p>
                <p className="text-xs text-muted-foreground">Portfolio performance summary every Monday</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-accent rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="bg-card rounded-lg p-6 border border-border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Account</h2>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-between px-4 py-3 bg-background rounded-lg hover:bg-accent transition text-sm text-foreground">
              <div className="text-left">
                <p className="font-medium">Edit Profile</p>
                <p className="text-xs text-muted-foreground">Update your name and avatar</p>
              </div>
              <span className="text-muted-foreground">→</span>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 bg-background rounded-lg hover:bg-accent transition text-sm text-foreground">
              <div className="text-left">
                <p className="font-medium">Change Password</p>
                <p className="text-xs text-muted-foreground">Update your account password</p>
              </div>
              <span className="text-muted-foreground">→</span>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 bg-background rounded-lg hover:bg-accent transition text-sm text-foreground">
              <div className="text-left">
                <p className="font-medium">Reset Portfolio</p>
                <p className="text-xs text-muted-foreground">Reset all trades and start fresh with ₹1,00,000</p>
              </div>
              <span className="text-muted-foreground">→</span>
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-card rounded-lg p-6 border border-border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Security</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-4 py-3 bg-background rounded-lg">
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add extra security to your account</p>
              </div>
              <span className="text-xs text-red-500 font-medium">Not Enabled</span>
            </div>
            <button className="w-full text-left px-4 py-3 bg-background rounded-lg hover:bg-accent transition text-sm text-foreground">
              Manage Sessions
            </button>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-card rounded-lg p-6 border border-border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Data & Privacy</h2>
          </div>

          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-background rounded-lg hover:bg-accent transition text-sm text-foreground">
              Download My Data
            </button>
            <button className="w-full text-left px-4 py-3 bg-background rounded-lg hover:bg-accent transition text-sm text-foreground">
              Privacy Settings
            </button>
            <button className="w-full text-left px-4 py-3 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition text-sm text-red-500">
              Delete Account
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition">
          Save Settings
        </button>
      </main>
    </div>
  );
}