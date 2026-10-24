import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Page } from '../types';
import { Menu, X, ArrowRight, UserCheck, FileText, Home, Info, Wrench, Sparkles, Cpu, Mail } from 'lucide-react';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isAuthenticated?: boolean;
  displayName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  onNavigate,
  isAuthenticated = false,
  displayName = 'Account'
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: Page; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: Info },
    { id: 'how-it-works', label: 'How It Works', icon: Wrench },
    { id: 'plans', label: 'Plans', icon: Sparkles },
    { id: 'connector', label: 'Hardware', icon: Cpu },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-[#0B1B33]/95 backdrop-blur-md border-b border-[#16365B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <button 
          onClick={() => handleNav('home')} 
          className="cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B9E5FF] rounded shrink-0"
          aria-label="EnerGuru Home"
        >
          <Logo size="md" />
        </button>

        {/* Header Right Actions & Universal Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick CTA: Get a Quote */}
          <button
            onClick={() => handleNav('get-quote')}
            className={`hidden sm:inline-flex text-xs font-semibold px-3 py-1.5 rounded transition-colors cursor-pointer items-center gap-1.5 ${
              currentPage === 'get-quote'
                ? 'bg-[#16365B] text-[#B9E5FF] border border-[#B9E5FF]/40'
                : 'text-slate-300 hover:text-white border border-[#16365B] hover:bg-[#16365B]/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#B9E5FF]" />
            <span>Get a Quote</span>
          </button>

          {/* Auth Status / Quick Actions */}
          {isAuthenticated ? (
            <button
              onClick={() => handleNav('dashboard')}
              className={`hidden sm:inline-flex text-xs font-semibold px-3.5 py-1.5 rounded transition-colors cursor-pointer items-center gap-1.5 shadow-sm ${
                currentPage === 'dashboard'
                  ? 'bg-white text-[#071629]'
                  : 'bg-[#B9E5FF] text-[#071629] hover:bg-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Dashboard ({displayName})</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => handleNav('signin')}
                className={`text-xs font-medium px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  currentPage === 'signin'
                    ? 'text-[#B9E5FF] bg-[#16365B]'
                    : 'text-slate-200 hover:text-white hover:bg-[#16365B]/60'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => handleNav('create-account')}
                className="text-xs font-semibold px-3 py-1.5 rounded bg-[#B9E5FF] text-[#071629] hover:bg-white transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>Create Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Universal Menu Toggle Button (Visible on Mobile, Tablet, Laptop, and Desktop) */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-slate-200 hover:text-white bg-[#0B1B33] hover:bg-[#16365B] border border-[#16365B] hover:border-[#B9E5FF]/40 focus:outline-none focus:ring-2 focus:ring-[#B9E5FF] cursor-pointer flex items-center gap-2 transition-all shadow-xs"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="w-5 h-5 text-[#B9E5FF]" />
            <span className="text-xs font-semibold tracking-wide uppercase">Menu</span>
          </button>
        </div>
      </div>

      {/* Universal Sliding Side Drawer & Backdrop Overlay (All Screen Sizes) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Left-sliding Drawer Panel */}
          <div 
            className="fixed inset-y-0 left-0 w-[290px] max-w-[85vw] bg-[#071629] border-r border-[#16365B] shadow-2xl z-50 flex flex-col justify-between transform transition-transform duration-300 ease-in-out"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            {/* Drawer Header */}
            <div className="h-16 px-5 flex items-center justify-between border-b border-[#16365B] shrink-0">
              <button 
                onClick={() => handleNav('home')} 
                className="cursor-pointer text-left focus:outline-none"
                aria-label="EnerGuru Home"
              >
                <Logo size="md" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#16365B] focus:outline-none focus:ring-1 focus:ring-[#B9E5FF] cursor-pointer"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Navigation List */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-3">
                Navigation
              </div>
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = currentPage === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNav(link.id)}
                      className={`text-left px-3.5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-3 transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#16365B] text-white font-semibold border-l-2 border-[#B9E5FF]'
                          : 'text-slate-300 hover:bg-[#0B1B33] hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#B9E5FF]' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="pt-2">
                <button
                  onClick={() => handleNav('get-quote')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg font-medium text-sm flex items-center justify-between transition-colors cursor-pointer ${
                    currentPage === 'get-quote'
                      ? 'bg-[#16365B] text-[#B9E5FF] border border-[#B9E5FF]/40'
                      : 'bg-[#0B1B33] text-[#B9E5FF] hover:bg-[#16365B]/60 border border-[#16365B]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#B9E5FF]" />
                    <span>Get a Commercial Quote</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B9E5FF]" />
                </button>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 border-t border-[#16365B] bg-[#0B1B33]/60 shrink-0 space-y-2">
              {isAuthenticated ? (
                <button
                  onClick={() => handleNav('dashboard')}
                  className="w-full text-center py-2.5 px-4 rounded-lg text-sm font-semibold bg-[#B9E5FF] text-[#071629] hover:bg-white flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNav('signin')}
                    className="w-full text-center py-2 px-3 rounded-lg text-xs font-semibold border border-[#16365B] text-slate-200 hover:bg-[#16365B] hover:text-white transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleNav('create-account')}
                    className="w-full text-center py-2 px-3 rounded-lg text-xs font-semibold bg-[#B9E5FF] text-[#071629] hover:bg-white transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span>Register</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <p className="text-[10px] text-slate-400 text-center pt-1 font-mono">
                Tekm EnerGuru Technologies
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
