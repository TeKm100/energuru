import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Logo } from './Logo';
import { AuthPage } from '../types';
import { 
  LayoutDashboard, 
  Activity, 
  Wrench, 
  Briefcase, 
  Users, 
  User, 
  FileText, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  ChevronRight,
  Loader2,
  Settings,
  CreditCard,
  Zap,
  Power,
  Bell,
  BrainCircuit,
  Sliders,
  ShieldAlert,
  LineChart,
  Cpu,
  Radio,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

interface AuthNavbarProps {
  currentPage: AuthPage;
  onNavigate: (page: AuthPage) => void;
  onSignOut: () => Promise<void>;
  displayName: string;
  userEmail: string;
}

interface NavGroupItem {
  id: AuthPage;
  label: string;
  badge?: string;
  icon: React.ElementType;
}

interface NavGroup {
  id: AuthPage;
  label: string;
  icon: React.ElementType;
  items: NavGroupItem[];
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
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'energy-management': true,
  });
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Group definitions matching Phase 3 architecture
  const navGroups: NavGroup[] = [
    {
      id: 'energy-management',
      label: 'Energy Management',
      icon: Activity,
      items: [
        { id: 'energy-monitoring', label: 'Energy Monitoring & Analytics', badge: 'Live', icon: Activity },
        { id: 'power-control', label: 'Power Control Centre', badge: 'Dev', icon: Power },
        { id: 'alerts', label: 'Alerts & Notifications', badge: 'Dev', icon: Bell },
        { id: 'ai-intelligence', label: 'AI Energy Intelligence', badge: 'Dev', icon: BrainCircuit },
        { id: 'connector-management', label: 'Smart Connector Management', badge: 'Dev', icon: Sliders },
      ],
    },
    {
      id: 'devices-operations',
      label: 'Devices & Operations',
      icon: Wrench,
      items: [
        { id: 'equipment', label: 'Equipment Registry & Logs', icon: Wrench },
        { id: 'outage-prep', label: 'Outage Prep Checklists', icon: ShieldAlert },
        { id: 'connector', label: 'Hardware Connector R&D & Engineering', icon: Cpu },
        { id: 'buy-connector', label: 'Buy Connector Packages', icon: ShoppingBag },
        { id: 'connect-device', label: 'Device Pairing Sandbox', icon: Radio },
      ],
    },
    {
      id: 'business-enterprise',
      label: 'Business & Enterprise',
      icon: Briefcase,
      items: [
        { id: 'get-quote', label: 'Request a Quote / Advisory', badge: 'Active', icon: Briefcase },
        { id: 'energy-costs', label: 'Cost & Energy Reports', icon: LineChart },
      ],
    },
    {
      id: 'community-impact',
      label: 'Community & Impact',
      icon: Users,
      items: [
        { id: 'community-funding', label: 'Community Energy Projects', badge: 'Framework', icon: Users },
      ],
    },
    {
      id: 'account-plans',
      label: 'Account & Plans',
      icon: User,
      items: [
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'settings', label: 'Account Settings', icon: Settings },
        { id: 'plans', label: 'Plans & Subscriptions', icon: CreditCard },
      ],
    },
  ];

  const toggleGroup = (groupId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleNav = (page: AuthPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const handleSignOutClick = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    try {
      await onSignOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  // Lock body scroll when drawer is open without layout shift
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    const supportsScrollbarGutter = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('scrollbar-gutter', 'stable');

    if (!supportsScrollbarGutter) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [mobileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobileMenuOpen) setMobileMenuOpen(false);
        if (profileDropdownOpen) setProfileDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, profileDropdownOpen]);

  const initial = (displayName || userEmail || 'U').charAt(0).toUpperCase();

  // Helper to determine if a group is currently active
  const isGroupActive = (group: NavGroup) => {
    if (currentPage === group.id) return true;
    return group.items.some((item) => item.id === currentPage);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0B1B33] border-b border-[#16365B] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Brand & Desktop Group Nav */}
          <div className="flex items-center gap-6 shrink-0">
            <button 
              onClick={() => handleNav('dashboard')} 
              className="cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B9E5FF] rounded"
              aria-label="EnerGuru Dashboard Home"
            >
              <Logo size="md" />
            </button>

            {/* Desktop Navigation Group Links */}
            <nav className="hidden xl:flex items-center gap-1 text-xs">
              <button
                onClick={() => handleNav('dashboard')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  currentPage === 'dashboard'
                    ? 'bg-[#16365B] text-[#B9E5FF] font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-[#16365B]/60'
                }`}
              >
                Dashboard
              </button>

              {navGroups.map((group) => {
                const active = isGroupActive(group);
                return (
                  <button
                    key={group.id}
                    onClick={() => handleNav(group.id)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? 'bg-[#16365B] text-[#B9E5FF] font-semibold border-b-2 border-[#B9E5FF]'
                        : 'text-slate-300 hover:text-white hover:bg-[#16365B]/60'
                    }`}
                  >
                    <span>{group.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Side CTA, Profile Menu & Universal Drawer Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quote Request CTA */}
            <button
              onClick={() => handleNav('get-quote')}
              className={`hidden sm:inline-flex px-3 py-1.5 rounded-lg text-xs font-bold transition-all items-center gap-1.5 cursor-pointer shadow-sm ${
                currentPage === 'get-quote'
                  ? 'bg-[#B9E5FF] text-[#071629]'
                  : 'bg-[#16365B] text-[#B9E5FF] hover:bg-[#B9E5FF] hover:text-[#071629] border border-[#B9E5FF]/30'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Get a Quote</span>
            </button>

            {/* User Account Menu with Ref for Outside Click */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#16365B]/60 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#B9E5FF]"
                aria-label="User account menu"
                aria-expanded={profileDropdownOpen}
              >
                <div className="w-8 h-8 rounded-full bg-[#16365B] border border-[#B9E5FF]/40 text-[#B9E5FF] font-bold text-xs flex items-center justify-center">
                  {initial}
                </div>
                <div className="text-left text-xs max-w-[120px] truncate hidden md:block">
                  <span className="font-semibold text-white block truncate">{displayName}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-[#0B1B33] border border-[#16365B] rounded-lg shadow-2xl py-1.5 z-50 text-xs"
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

                  <button
                    onClick={() => handleNav('plans')}
                    className="w-full text-left px-3.5 py-2.5 text-slate-200 hover:bg-[#16365B] hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    <span>Plans & Subscriptions</span>
                  </button>

                  <div className="border-t border-[#16365B]/80 my-1" />

                  <button
                    onClick={handleSignOutClick}
                    disabled={isSigningOut}
                    className="w-full text-left px-3.5 py-2.5 text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 flex items-center gap-2.5 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {isSigningOut ? (
                      <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                    ) : (
                      <LogOut className="w-4 h-4 text-rose-400" />
                    )}
                    <span>{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Universal Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-slate-200 hover:text-white bg-[#071629] hover:bg-[#16365B] border border-[#16365B] hover:border-[#B9E5FF]/40 focus:outline-none focus:ring-2 focus:ring-[#B9E5FF] cursor-pointer flex items-center gap-2 transition-all shadow-xs"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5 text-[#B9E5FF]" />
              <span className="text-xs font-semibold tracking-wide uppercase">Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Universal Sliding Side Drawer with Expandable Groups */}
      {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300 z-10"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Left-sliding Drawer Panel */}
          <div 
            className="fixed inset-y-0 left-0 w-[310px] max-w-[88vw] bg-[#071629] border-r border-[#16365B] shadow-2xl z-20 flex flex-col justify-between transform transition-transform duration-300 ease-in-out"
            role="dialog"
            aria-modal="true"
            aria-label="Platform Navigation Menu"
          >
            {/* Drawer Header */}
            <div className="h-16 px-5 flex items-center justify-between border-b border-[#16365B] shrink-0 bg-[#0B1B33]">
              <button 
                onClick={() => handleNav('dashboard')} 
                className="cursor-pointer text-left focus:outline-none"
                aria-label="EnerGuru Dashboard Home"
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

            {/* Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {/* User profile summary banner */}
              <div className="p-3 bg-[#0B1B33] border border-[#16365B] rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-9 h-9 rounded-full bg-[#16365B] border border-[#B9E5FF]/40 text-[#B9E5FF] font-bold text-sm flex items-center justify-center shrink-0">
                    {initial}
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-white block text-xs truncate">{displayName}</span>
                    <span className="text-[11px] text-slate-400 block truncate">{userEmail}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleNav('profile')}
                  className="text-xs text-[#B9E5FF] hover:underline shrink-0 font-medium cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Main Dashboard Link */}
              <button
                onClick={() => handleNav('dashboard')}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg font-medium text-xs flex items-center gap-3 transition-colors cursor-pointer ${
                  currentPage === 'dashboard'
                    ? 'bg-[#16365B] text-white font-semibold border-l-2 border-[#B9E5FF]'
                    : 'text-slate-300 hover:bg-[#0B1B33] hover:text-white'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 ${currentPage === 'dashboard' ? 'text-[#B9E5FF]' : 'text-slate-400'}`} />
                <span>Dashboard Overview</span>
              </button>

              {/* Navigation Groups with Expandable Features */}
              <div className="space-y-2 pt-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 pb-1">
                  Platform Workspaces
                </div>

                {navGroups.map((group) => {
                  const GroupIcon = group.icon;
                  const isExpanded = expandedGroups[group.id] || false;
                  const active = isGroupActive(group);

                  return (
                    <div key={group.id} className="rounded-lg border border-[#16365B]/60 overflow-hidden bg-[#0B1B33]/40">
                      {/* Group Header Button */}
                      <div className="flex items-center justify-between p-1">
                        <button
                          onClick={() => handleNav(group.id)}
                          className={`flex-1 text-left px-2.5 py-2 rounded font-medium text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${
                            currentPage === group.id
                              ? 'text-[#B9E5FF] font-bold'
                              : active
                              ? 'text-white font-semibold'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          <GroupIcon className={`w-4 h-4 ${active ? 'text-[#B9E5FF]' : 'text-slate-400'}`} />
                          <span className="truncate">{group.label}</span>
                        </button>

                        <button
                          onClick={(e) => toggleGroup(group.id, e)}
                          className="p-2 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                          aria-label={`Toggle ${group.label} submenu`}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Nested Features List */}
                      {isExpanded && (
                        <div className="pl-6 pr-2 py-1.5 space-y-1 border-t border-[#16365B]/50 bg-[#071629]/70">
                          {group.items.map((item) => {
                            const ItemIcon = item.icon;
                            const isItemActive = currentPage === item.id;

                            return (
                              <button
                                key={item.id}
                                onClick={() => handleNav(item.id)}
                                className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] flex items-center justify-between transition-colors cursor-pointer ${
                                  isItemActive
                                    ? 'bg-[#16365B] text-[#B9E5FF] font-semibold'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0B1B33]'
                                }`}
                              >
                                <span className="flex items-center gap-2 truncate">
                                  <ItemIcon className={`w-3 h-3 ${isItemActive ? 'text-[#B9E5FF]' : 'text-slate-500'}`} />
                                  <span className="truncate">{item.label}</span>
                                </span>
                                {item.badge && (
                                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#071629] text-slate-400 border border-[#16365B] shrink-0 ml-1">
                                    {item.badge}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Get a Quote Action */}
              <div className="pt-2">
                <button
                  onClick={() => handleNav('get-quote')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg font-medium text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    currentPage === 'get-quote'
                      ? 'bg-[#16365B] text-[#B9E5FF] border border-[#B9E5FF]/40'
                      : 'bg-[#0B1B33] text-[#B9E5FF] hover:bg-[#16365B]/60 border border-[#16365B]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#B9E5FF]" />
                    <span>Request Commercial Quote</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Drawer Bottom Actions: Profile, Settings & Sign Out */}
            <div className="p-4 border-t border-[#16365B] bg-[#0B1B33]/80 shrink-0 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNav('profile')}
                  className="py-2 px-3 rounded-lg bg-[#071629] hover:bg-[#16365B] text-slate-300 hover:text-white border border-[#16365B] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => handleNav('settings')}
                  className="py-2 px-3 rounded-lg bg-[#071629] hover:bg-[#16365B] text-slate-300 hover:text-white border border-[#16365B] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Settings</span>
                </button>
              </div>

              <button
                onClick={handleSignOutClick}
                disabled={isSigningOut}
                className="w-full py-2 px-3 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
              >
                {isSigningOut ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                ) : (
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
