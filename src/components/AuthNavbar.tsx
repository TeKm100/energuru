import React, { useState } from 'react';
import { Logo } from './Logo';
import { AuthPage } from '../types';
import { 
  LayoutDashboard, 
  Zap, 
  LineChart, 
  ShieldAlert, 
  Cpu, 
  FileText, 
  Sparkles, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown 
} from 'lucide-react';

interface AuthNavbarProps {
  currentPage: AuthPage;
  onNavigate: (page: AuthPage) => void;
  onSignOut: () => Promise<void>;
  displayName: string;
  userEmail: string;
}

export const AuthNavbar: React.FC<AuthNavbarProps> = ({
  currentPage,
  onNavigate,
  onSignOut,
  displayName,
  userEmail,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const mainNavLinks: { id: AuthPage; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'equipment', label: 'Equipment', icon: Zap },
    { id: 'energy-costs', label: 'Costs', icon: LineChart },
    { id: 'outage-prep', label: 'Outage Prep', icon: ShieldAlert },
    { id: 'plans', label: 'Plans', icon: Sparkles },
    { id: 'connector', label: 'Connector', icon: Cpu },
  ];

  const handleNav = (page: AuthPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const initial = (displayName || userEmail || 'U').charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-[#0B1B33] border-b border-[#16365B] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6 lg:gap-8 shrink-0">
          <button 
            onClick={() => handleNav('dashboard')} 
            className="cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B9E5FF] rounded"
            aria-label="EnerGuru Dashboard Home"
          >
            <Logo size="md" />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#16365B] text-white'
                      : 'text-slate-300 hover:text-white hover:bg-[#16365B]/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B9E5FF]' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Desktop Right Side CTA & Profile Menu */}
        <div className="hidden md:flex items-center gap-3">
          {/* Quote Request CTA */}
          <button
            onClick={() => handleNav('get-quote')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              currentPage === 'get-quote'
                ? 'bg-[#B9E5FF] text-[#071629]'
                : 'bg-[#16365B] text-[#B9E5FF] hover:bg-[#B9E5FF] hover:text-[#071629] border border-[#B9E5FF]/30'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Get a Quote</span>
          </button>

          {/* User Account Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#16365B]/60 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#B9E5FF]"
              aria-label="User account menu"
              aria-expanded={profileDropdownOpen}
            >
              <div className="w-8 h-8 rounded-full bg-[#16365B] border border-[#B9E5FF]/40 text-[#B9E5FF] font-bold text-xs flex items-center justify-center">
                {initial}
              </div>
              <div className="text-left text-xs max-w-[120px] truncate hidden xl:block">
                <span className="font-semibold text-white block truncate">{displayName}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-[#0B1B33] border border-[#16365B] rounded-lg shadow-2xl py-1.5 z-50 text-xs"
                onMouseLeave={() => setProfileDropdownOpen(false)}
              >
                <div className="px-3.5 py-2 border-b border-[#16365B]/80">
                  <span className="text-slate-400 block text-[11px]">Signed in as</span>
                  <span className="text-white font-semibold truncate block mt-0.5">{userEmail}</span>
                </div>
                
                <button
                  onClick={() => handleNav('profile')}
                  className="w-full text-left px-3.5 py-2.5 text-slate-200 hover:bg-[#16365B] hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => handleNav('settings')}
                  className="w-full text-left px-3.5 py-2.5 text-slate-200 hover:bg-[#16365B] hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Account Settings</span>
                </button>

                <div className="border-t border-[#16365B]/80 my-1" />

                <button
                  onClick={async () => {
                    setProfileDropdownOpen(false);
                    await onSignOut();
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded text-slate-300 hover:text-white hover:bg-[#16365B] focus:outline-none focus:ring-2 focus:ring-[#B9E5FF]"
          aria-label="Toggle authenticated menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#071629] border-b border-[#16365B] px-4 pt-3 pb-6 space-y-4">
          {/* User info card */}
          <div className="p-3 bg-[#0B1B33] border border-[#16365B] rounded-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 truncate">
              <div className="w-9 h-9 rounded-full bg-[#16365B] border border-[#B9E5FF]/40 text-[#B9E5FF] font-bold text-sm flex items-center justify-center shrink-0">
                {initial}
              </div>
              <div className="truncate">
                <span className="font-semibold text-white block text-sm truncate">{displayName}</span>
                <span className="text-xs text-slate-400 block truncate">{userEmail}</span>
              </div>
            </div>
            <button
              onClick={() => handleNav('profile')}
              className="text-xs text-[#B9E5FF] hover:underline shrink-0"
            >
              Profile
            </button>
          </div>

          {/* Navigation Links Grid */}
          <nav className="grid grid-cols-2 gap-2">
            {mainNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`text-left px-3 py-2.5 rounded-lg font-medium text-xs flex items-center gap-2 transition-colors ${
                    isActive
                      ? 'bg-[#16365B] text-white border border-[#B9E5FF]/40'
                      : 'bg-[#0B1B33] text-slate-300 hover:text-white border border-[#16365B]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#B9E5FF]' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Get a Quote Action */}
          <button
            onClick={() => handleNav('get-quote')}
            className="w-full py-2.5 px-3 rounded-lg bg-[#B9E5FF] text-[#071629] font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Request a Commercial Quote</span>
          </button>

          {/* Footer settings & signout */}
          <div className="pt-2 border-t border-[#16365B] flex items-center justify-between">
            <button
              onClick={() => handleNav('settings')}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Settings</span>
            </button>
            <button
              onClick={async () => {
                setMobileMenuOpen(false);
                await onSignOut();
              }}
              className="text-xs text-rose-300 hover:text-rose-200 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
