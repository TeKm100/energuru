import React, { useState } from 'react';
import { Logo } from './Logo';
import { Page } from '../types';
import { Menu, X, ArrowRight, UserCheck, FileText } from 'lucide-react';

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

  const navLinks: { id: Page; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'plans', label: 'Plans' },
    { id: 'connector', label: 'Hardware' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

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

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`transition-colors cursor-pointer py-1 border-b-2 text-xs font-semibold ${
                  isActive
                    ? 'text-white border-[#B9E5FF]'
                    : 'text-slate-300 border-transparent hover:text-white hover:border-slate-500'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Desktop Auth & Quote Buttons */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNav('get-quote')}
            className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              currentPage === 'get-quote'
                ? 'bg-[#16365B] text-[#B9E5FF] border border-[#B9E5FF]/40'
                : 'text-slate-300 hover:text-white border border-[#16365B] hover:bg-[#16365B]/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#B9E5FF]" />
            <span>Get a Quote</span>
          </button>

          {isAuthenticated ? (
            <button
              onClick={() => handleNav('dashboard')}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-sm ${
                currentPage === 'dashboard'
                  ? 'bg-white text-[#071629]'
                  : 'bg-[#B9E5FF] text-[#071629] hover:bg-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Dashboard ({displayName})</span>
            </button>
          ) : (
            <>
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
                className="text-xs font-semibold px-3.5 py-1.5 rounded bg-[#B9E5FF] text-[#071629] hover:bg-white transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>Create Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded text-slate-300 hover:text-white hover:bg-[#16365B] focus:outline-none focus:ring-2 focus:ring-[#B9E5FF]"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#071629] border-b border-[#16365B] px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`text-left px-3 py-2.5 rounded font-medium text-sm ${
                  currentPage === link.id
                    ? 'bg-[#16365B] text-white'
                    : 'text-slate-300 hover:bg-[#0B1B33] hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav('get-quote')}
              className={`text-left px-3 py-2.5 rounded font-medium text-sm flex items-center justify-between ${
                currentPage === 'get-quote'
                  ? 'bg-[#16365B] text-[#B9E5FF]'
                  : 'text-[#B9E5FF] hover:bg-[#0B1B33]'
              }`}
            >
              <span>Get a Quote</span>
              <FileText className="w-4 h-4" />
            </button>
          </nav>
          <div className="pt-3 border-t border-[#16365B] flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => handleNav('dashboard')}
                className="w-full text-center py-2 px-3 rounded text-sm font-semibold bg-[#B9E5FF] text-[#071629] hover:bg-white flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNav('signin')}
                  className="w-full text-center py-2 px-3 rounded text-sm font-medium border border-[#16365B] text-slate-200 hover:bg-[#16365B]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('create-account')}
                  className="w-full text-center py-2 px-3 rounded text-sm font-semibold bg-[#B9E5FF] text-[#071629] hover:bg-white flex items-center justify-center gap-2"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
