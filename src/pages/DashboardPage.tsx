import React, { useState, useRef, useEffect } from 'react';
import { AuthPage, UserProfile } from '../types';
import { 
  Zap, 
  Activity, 
  Power, 
  Bell, 
  Wrench, 
  Briefcase, 
  Users, 
  User, 
  Settings, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Radio, 
  X, 
  Gauge, 
  TrendingUp, 
  ShieldCheck, 
  ChevronRight, 
  Info,
  Layers,
  Cpu
} from 'lucide-react';

interface DashboardPageProps {
  userProfile: UserProfile | null;
  userEmail: string | null;
  onNavigate: (page: AuthPage) => void;
  onOpenOnboarding?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  userProfile,
  userEmail,
  onNavigate,
  onOpenOnboarding,
}) => {
  const displayName = userProfile?.nickname || userProfile?.full_name || userEmail?.split('@')[0] || 'Member';
  const initial = (displayName || userEmail || 'U').charAt(0).toUpperCase();

  // Profile completion check
  const isProfileComplete = Boolean(userProfile?.full_name && userProfile.full_name.trim().length > 0);

  // Notification panel toggle state
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Quick Control Preview simulated toggle state
  const [simulatedPowerState, setSimulatedPowerState] = useState<'ON' | 'OFF'>('ON');
  const [controlActionNotice, setControlActionNotice] = useState<string | null>(null);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleSimulatedSwitch = (newState: 'ON' | 'OFF') => {
    setSimulatedPowerState(newState);
    setControlActionNotice(
      newState === 'ON'
        ? 'Simulated breaker state: ONLINE. (Visual demonstration only. No command was transmitted to physical electrical hardware).'
        : 'Simulated breaker state: DISCONNECTED. (Visual demonstration only. No command was transmitted to physical electrical hardware).'
    );
  };

  // 5 Primary Navigation Groups
  const navigationGroups = [
    {
      id: 'energy-management' as AuthPage,
      title: 'Energy Management',
      category: 'Telemetry & Controls',
      desc: 'Live telemetry, energy consumption trends, remote power control sandbox, and dispatch alerts.',
      icon: Activity,
      featuresCount: '5 Modules',
      badge: 'Active & Planned',
      badgeType: 'live',
    },
    {
      id: 'devices-operations' as AuthPage,
      title: 'Devices & Operations',
      category: 'Hardware & Workspaces',
      desc: 'Equipment registry, generator logs, blackout checklists, and hardware connector engineering R&D.',
      icon: Wrench,
      featuresCount: '4 Workspaces',
      badge: 'Interactive Tools',
      badgeType: 'interactive',
    },
    {
      id: 'business-enterprise' as AuthPage,
      title: 'Business & Enterprise',
      category: 'Commercial Solutions',
      desc: 'Custom facility power consultations, quotation requests, tariff modeling, and subscription packages.',
      icon: Briefcase,
      featuresCount: '3 Services',
      badge: 'Open for Enquiries',
      badgeType: 'live',
    },
    {
      id: 'community-impact' as AuthPage,
      title: 'Community & Impact',
      category: 'Public Energy Access',
      desc: 'Crowd-supported solar microgrid frameworks for unpowered rural clinics, schools, and productive hubs.',
      icon: Users,
      featuresCount: 'Framework',
      badge: 'Concept Framework',
      badgeType: 'framework',
    },
    {
      id: 'account-plans' as AuthPage,
      title: 'Account & Plans',
      category: 'Profile & Subscriptions',
      desc: 'Profile credentials, authentication security settings, and enterprise advisory tier management.',
      icon: User,
      featuresCount: 'Account Hub',
      badge: 'Active Account',
      badgeType: 'live',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 text-white">
      
      {/* 1. WELCOME AREA */}
      <section className="bg-gradient-to-r from-[#0B1B33] via-[#0E223F] to-[#16365B]/70 border border-[#16365B] rounded-2xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Greeting text */}
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#B9E5FF]">
              <Sparkles className="w-3.5 h-3.5 text-[#B9E5FF]" />
              <span>Electricity Intelligence Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-[#B9E5FF]">{displayName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Here’s what’s happening with your electricity supply today.
            </p>
          </div>

          {/* Quick Actions, Notification Bell & Profile Controls */}
          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
            {/* Notification Bell Dropdown Trigger */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-lg bg-[#071629] hover:bg-[#16365B] text-slate-300 hover:text-white border border-[#16365B] transition-colors cursor-pointer"
                aria-label="Alerts and notifications"
                title="View electricity notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-[#071629] font-bold text-[10px] flex items-center justify-center shadow-xs">
                  2
                </span>
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0B1B33] border border-[#16365B] rounded-xl shadow-2xl p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#16365B] pb-2.5">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#B9E5FF]" />
                      <span className="text-xs font-bold text-white">Notifications & Alerts</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#B9E5FF] bg-[#16365B] px-2 py-0.5 rounded border border-[#B9E5FF]/20">
                      Simulated Examples
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-lg bg-[#071629] border border-[#16365B] text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold text-white">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Simulated Example: Grid Voltage Stable</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">10m ago</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Illustrative demo notification: Feeder 11kV line voltage measuring 232V (nominal band). No active brownout or surge alerts detected.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold text-amber-300">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Simulated Example: Maintenance Reminder</span>
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono">Yesterday</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Illustrative demo notification: Generator service interval approaching: 45 operating hours recorded in Equipment Registry.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#16365B] flex items-center justify-between">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigate('alerts');
                      }}
                      className="text-xs font-semibold text-[#B9E5FF] hover:underline cursor-pointer"
                    >
                      View All in Alerts Hub →
                    </button>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-slate-400 hover:text-white cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Profile Trigger */}
            <button
              onClick={() => onNavigate('profile')}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#071629] hover:bg-[#16365B] text-slate-300 hover:text-white border border-[#16365B] text-xs font-medium transition-colors cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-[#16365B] text-[#B9E5FF] font-bold text-[10px] flex items-center justify-center">
                {initial}
              </div>
              <span className="hidden sm:inline">Profile</span>
            </button>

            {/* Setup Guide / Onboarding Trigger */}
            {onOpenOnboarding && (
              <button
                onClick={onOpenOnboarding}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#B9E5FF] hover:bg-white text-[#071629] text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Setup Guide</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Completion Prompt if Full Name is Missing */}
        {!isProfileComplete && (
          <div className="mt-4 pt-4 border-t border-[#16365B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-[#071629]/60 p-3.5 rounded-xl border border-[#16365B]/80">
            <div className="flex items-center gap-2 text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Your profile information is incomplete. Add your full name for customized quote consultation.</span>
            </div>
            <button
              onClick={() => onNavigate('profile')}
              className="text-[#B9E5FF] font-semibold hover:underline shrink-0 text-left sm:text-right cursor-pointer"
            >
              Complete Profile →
            </button>
          </div>
        )}
      </section>

      {/* 2. ENERGY OVERVIEW (FOUR COMPACT SUMMARY CARDS - SIMULATED DATA) */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#B9E5FF]" />
              <span>Energy Overview</span>
            </h2>
            <p className="text-xs text-slate-400">
              Building electricity readings and daily utility telemetry.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 self-start sm:self-auto px-2.5 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-[10px] font-mono text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>SIMULATED DATA • HARDWARE IN R&D</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Voltage */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-4.5 space-y-2 hover:border-[#B9E5FF]/50 transition-colors shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Incoming Voltage</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                Simulated
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white tracking-tight">232</span>
              <span className="text-xs font-semibold text-slate-400">V AC</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Normal Band (210V – 240V)</span>
            </div>
          </div>

          {/* Metric 2: Current Demand */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-4.5 space-y-2 hover:border-[#B9E5FF]/50 transition-colors shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Current Demand</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                Simulated
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white tracking-tight">1.85</span>
              <span className="text-xs font-semibold text-slate-400">kW</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <Gauge className="w-3.5 h-3.5 text-[#B9E5FF]" />
              <span>Active Load • 8.04 Amps (Phase 1)</span>
            </div>
          </div>

          {/* Metric 3: Today's Consumption */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-4.5 space-y-2 hover:border-[#B9E5FF]/50 transition-colors shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Today's Consumption</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                Simulated
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white tracking-tight">14.6</span>
              <span className="text-xs font-semibold text-slate-400">kWh</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <TrendingUp className="w-3.5 h-3.5 text-[#B9E5FF]" />
              <span>24h Aggregate • Est. Band A</span>
            </div>
          </div>

          {/* Metric 4: Electricity Supply Status */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-4.5 space-y-2 hover:border-[#B9E5FF]/50 transition-colors shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Supply Status</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                Simulated
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-emerald-400 truncate">Grid Active</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Mains Online • 50.1 Hz</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POWER STATUS OVERVIEW & QUICK CONTROL PREVIEW */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Power Status Overview Panel (7 cols on lg) */}
        <div className="lg:col-span-7 bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#16365B] pb-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#B9E5FF]" />
                <span>Power Status Overview</span>
              </h2>
              <p className="text-xs text-slate-400">
                Operational status of building electricity and telemetry links.
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#071629] text-slate-300 border border-[#16365B]">
              Diagnostic Feed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#071629] border border-[#16365B] space-y-1">
              <span className="text-slate-400 block text-[11px]">Electricity Supply Status</span>
              <div className="flex items-center gap-2 font-semibold text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Mains Utility Power (Online)</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Feeder 11kV Phase Synchronized</span>
            </div>

            <div className="p-3 rounded-lg bg-[#071629] border border-[#16365B] space-y-1">
              <span className="text-slate-400 block text-[11px]">Smart Connector Connection Status</span>
              <div className="flex items-center gap-2 font-semibold text-amber-300">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>Hardware R&D Standby</span>
              </div>
              <span className="text-[10px] text-slate-400 block">No physical unit commissioned</span>
            </div>

            <div className="p-3 rounded-lg bg-[#071629] border border-[#16365B] space-y-1">
              <span className="text-slate-400 block text-[11px]">Last Communication Telemetry</span>
              <div className="flex items-center gap-2 font-semibold text-white">
                <Clock className="w-3.5 h-3.5 text-[#B9E5FF]" />
                <span>2 mins ago (Simulated Ping)</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Cellular IoT Sandbox Link</span>
            </div>

            <div className="p-3 rounded-lg bg-[#071629] border border-[#16365B] space-y-1">
              <span className="text-slate-400 block text-[11px]">Active Grid Stability Notice</span>
              <div className="flex items-center gap-2 font-semibold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nominal Line Voltage</span>
              </div>
              <span className="text-[10px] text-slate-400 block">No critical over-voltage alerts</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#071629] border border-[#16365B] text-xs text-slate-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#B9E5FF] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-white block">System Architecture Boundary</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Account authenticated via Supabase. Hardware development in progress — no physical unit commissioned. Live physical telemetry will activate upon certified installation.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Control Preview (5 cols on lg) */}
        <div className="lg:col-span-5 bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#16365B] pb-3">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Power className="w-4 h-4 text-[#B9E5FF]" />
                  <span>Power Control Centre Preview</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Remote switching simulation preview.
                </p>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                DEMO / SIMULATED
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Visual interface demonstration for building-level breaker switching. Physical switching requires certified hardware interlocks.
            </p>

            {/* Displayed State Card */}
            <div className="p-3.5 rounded-lg bg-[#071629] border border-[#16365B] flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Displayed State:</span>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${simulatedPowerState === 'ON' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                <span className={`text-xs font-bold font-mono ${simulatedPowerState === 'ON' ? 'text-emerald-300' : 'text-slate-400'}`}>
                  {simulatedPowerState === 'ON' ? 'POWER ON (SIMULATED)' : 'POWER OFF (SIMULATED)'}
                </span>
              </div>
            </div>

            {/* Simulated Action Notice */}
            {controlActionNotice && (
              <div className="p-2.5 rounded bg-[#071629] border border-[#16365B] text-[11px] text-slate-300 leading-relaxed animate-in fade-in">
                {controlActionNotice}
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleSimulatedSwitch('ON')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                  simulatedPowerState === 'ON'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                    : 'bg-[#071629] text-slate-300 border border-[#16365B] hover:bg-[#16365B]'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>TURN ON</span>
              </button>
              <button
                onClick={() => handleSimulatedSwitch('OFF')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                  simulatedPowerState === 'OFF'
                    ? 'bg-rose-600 text-white hover:bg-rose-500'
                    : 'bg-[#071629] text-slate-300 border border-[#16365B] hover:bg-[#16365B]'
                }`}
              >
                <X className="w-3.5 h-3.5" />
                <span>TURN OFF</span>
              </button>
            </div>

            <div className="text-[10px] text-slate-500 text-center font-mono">
              Strictly a visual demonstration. Does not control physical electrical circuits.
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRIMARY NAVIGATION DESTINATIONS (THE 5 MAIN GROUPS) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#16365B] pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#B9E5FF]" />
              <span>Platform Workspaces & Navigation Groups</span>
            </h2>
            <p className="text-xs text-slate-400">
              Select a workspace to access its detailed feature modules, tools, and operational workspaces.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#B9E5FF] self-start sm:self-auto">
            5 Core Groups
          </span>
        </div>

        {/* 5 Compact Navigation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {navigationGroups.map((group) => {
            const Icon = group.icon;

            const badgeClasses = {
              live: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
              interactive: 'bg-cyan-950/80 text-cyan-300 border-cyan-800',
              framework: 'bg-amber-950/80 text-amber-300 border-amber-800',
            }[group.badgeType] || 'bg-[#071629] text-slate-400 border-[#16365B]';

            return (
              <button
                key={group.id}
                onClick={() => onNavigate(group.id)}
                className="text-left bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 flex flex-col justify-between hover:border-[#B9E5FF]/60 hover:shadow-lg transition-all duration-200 cursor-pointer group shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B9E5FF]/40"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-lg bg-[#16365B] border border-[#B9E5FF]/20 text-[#B9E5FF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400">{group.featuresCount}</span>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${badgeClasses}`}>
                        {group.badge}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#B9E5FF] transition-colors flex items-center gap-1.5">
                      <span>{group.title}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#B9E5FF] group-hover:translate-x-0.5 transition-all" />
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1.5 line-clamp-2">
                      {group.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-[#16365B]/60 text-xs font-semibold text-[#B9E5FF] flex items-center justify-between">
                  <span>Enter {group.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. FOOTER ARCHITECTURAL NOTE */}
      <footer className="pt-4 border-t border-[#16365B] text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          EnerGuru Platform • Building Electricity Intelligence & Hardware Innovation
        </p>
        <p className="font-mono text-[11px] text-slate-500">
          Supabase Connected • Simulated Telemetry Engine Active
        </p>
      </footer>
    </div>
  );
};
