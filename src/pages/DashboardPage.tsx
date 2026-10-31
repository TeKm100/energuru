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
  Cpu,
  ExternalLink
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
  const [controlNotice, setControlNotice] = useState<string | null>(null);

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
    setControlNotice(
      newState === 'ON'
        ? 'Simulated breaker state: ONLINE (Demo only — no physical command sent)'
        : 'Simulated breaker state: ISOLATED (Demo only — no physical command sent)'
    );
    setTimeout(() => setControlNotice(null), 4000);
  };

  // 4 Core Workspace Navigation Groups (Account & Plans remains accessible via top navigation and profile)
  const navigationGroups = [
    {
      id: 'energy-management' as AuthPage,
      title: 'Energy Management',
      category: 'Telemetry & Controls',
      desc: 'Live telemetry, energy consumption trends, remote power control sandbox, and dispatch alerts.',
      icon: Activity,
      featuresCount: '5 Modules',
      badge: 'Live & Dev',
      badgeType: 'live',
    },
    {
      id: 'devices-operations' as AuthPage,
      title: 'Devices & Operations',
      category: 'Hardware & Workspaces',
      desc: 'Equipment registry, generator logs, outage checklists, and Smart Connector hardware R&D.',
      icon: Wrench,
      featuresCount: '5 Workspaces',
      badge: 'Interactive',
      badgeType: 'interactive',
    },
    {
      id: 'business-enterprise' as AuthPage,
      title: 'Business & Enterprise',
      category: 'Commercial Solutions',
      desc: 'Facility engineering consultations, quotation requests, and tariff cost modeling.',
      icon: Briefcase,
      featuresCount: '2 Services',
      badge: 'Advisory',
      badgeType: 'live',
    },
    {
      id: 'community-impact' as AuthPage,
      title: 'Community & Impact',
      category: 'Public Energy Access',
      desc: 'Crowd-supported solar microgrids and electrification frameworks for underserved rural hubs.',
      icon: Users,
      featuresCount: 'Framework',
      badge: 'Concept',
      badgeType: 'framework',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-5 text-white">
      
      {/* 1. REFINED COMPACT WELCOME AREA */}
      <section className="bg-gradient-to-r from-[#0B1B33] via-[#0E223F] to-[#16365B]/60 border border-[#16365B] rounded-xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Greeting text */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#B9E5FF]">
              <Sparkles className="w-3 h-3 text-[#B9E5FF]" />
              <span>Electricity Intelligence Workspace</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Welcome back, <span className="text-[#B9E5FF]">{displayName}</span>
            </h1>
            <p className="text-xs text-slate-300">
              Here is your building-level electricity overview and operational workspaces.
            </p>
          </div>

          {/* Quick Actions, Notification Bell & Profile Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {/* Notification Bell Dropdown Trigger */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-[#071629] hover:bg-[#16365B] text-slate-300 hover:text-white border border-[#16365B] transition-colors cursor-pointer"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4 text-slate-300" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B9E5FF]" />
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0B1B33] border border-[#16365B] rounded-xl shadow-2xl p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#16365B] pb-2">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#B9E5FF]" />
                      <span className="text-xs font-bold text-white">Notifications & Alerts</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#B9E5FF] bg-[#16365B] px-2 py-0.5 rounded border border-[#B9E5FF]/20">
                      Simulated Examples
                    </span>
                  </div>

                  <div className="space-y-2">
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

            {/* Quick Profile Shortcut */}
            <button
              onClick={() => onNavigate('profile')}
              className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#071629] hover:bg-[#16365B] text-slate-300 hover:text-white border border-[#16365B] text-xs font-medium transition-colors cursor-pointer"
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B9E5FF] hover:bg-white text-[#071629] text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Setup Guide</span>
              </button>
            )}
          </div>
        </div>

        {/* Compact Profile Completion Prompt if Full Name is Missing */}
        {!isProfileComplete && (
          <div className="mt-3 pt-3 border-t border-[#16365B] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-[#071629]/70 px-3 py-2 rounded-lg border border-[#16365B]/80">
            <div className="flex items-center gap-2 text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Incomplete profile: Add your full name for personalized engineering consultations.</span>
            </div>
            <button
              onClick={() => onNavigate('profile')}
              className="text-[#B9E5FF] font-semibold hover:underline shrink-0 text-left sm:text-right cursor-pointer text-[11px]"
            >
              Complete Profile →
            </button>
          </div>
        )}
      </section>

      {/* 2. COMPACT ENERGY OVERVIEW CARDS (SIMULATED DATA) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#B9E5FF]" />
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Energy Overview
            </h2>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-[10px] font-mono text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>SIMULATED DATA • R&D</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Metric 1: Voltage */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-3.5 space-y-1.5 hover:border-[#B9E5FF]/40 transition-colors shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px] font-medium">Incoming Voltage</span>
              <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                Simulated
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">232</span>
              <span className="text-xs font-semibold text-slate-400">V AC</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 truncate">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>Normal Band (210–240V)</span>
            </div>
          </div>

          {/* Metric 2: Current Demand */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-3.5 space-y-1.5 hover:border-[#B9E5FF]/40 transition-colors shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px] font-medium">Current Demand</span>
              <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                Simulated
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">1.85</span>
              <span className="text-xs font-semibold text-slate-400">kW</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-300 truncate">
              <Gauge className="w-3 h-3 text-[#B9E5FF] shrink-0" />
              <span>8.04A Load • Phase 1</span>
            </div>
          </div>

          {/* Metric 3: Today's Consumption */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-3.5 space-y-1.5 hover:border-[#B9E5FF]/40 transition-colors shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px] font-medium">Today's Energy</span>
              <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                Simulated
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">14.6</span>
              <span className="text-xs font-semibold text-slate-400">kWh</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-300 truncate">
              <TrendingUp className="w-3 h-3 text-[#B9E5FF] shrink-0" />
              <span>24h Aggregate • Est. Band A</span>
            </div>
          </div>

          {/* Metric 4: Supply Status */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-3.5 space-y-1.5 hover:border-[#B9E5FF]/40 transition-colors shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px] font-medium">Supply Status</span>
              <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                Simulated
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-bold text-emerald-400 truncate">Grid Active</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>Mains Online • 50.1 Hz</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STREAMLINED DIAGNOSTIC STATUS & CONTROL SANDBOX PREVIEW */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Diagnostic Status (7 cols) */}
        <div className="lg:col-span-7 bg-[#0B1B33] border border-[#16365B] rounded-xl p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#16365B] pb-2.5">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#B9E5FF]" />
              <h3 className="text-xs sm:text-sm font-bold text-white">System Telemetry Status</h3>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#071629] text-slate-300 border border-[#16365B]">
              Simulated Diagnostic
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-[#071629] border border-[#16365B] space-y-0.5">
              <span className="text-slate-400 text-[10px] block">Mains Feed</span>
              <span className="font-semibold text-emerald-400 block truncate">232V Nominal</span>
              <span className="text-[9px] text-slate-500 block truncate">11kV Feeder Line</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#071629] border border-[#16365B] space-y-0.5">
              <span className="text-slate-400 text-[10px] block">Connector Unit</span>
              <span className="font-semibold text-amber-400 block truncate">R&D Standby</span>
              <span className="text-[9px] text-slate-500 block truncate">No physical unit</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#071629] border border-[#16365B] space-y-0.5">
              <span className="text-slate-400 text-[10px] block">Simulated Ping</span>
              <span className="font-semibold text-white block truncate">Active (4s)</span>
              <span className="text-[9px] text-slate-500 block truncate">Client simulation</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#071629] border border-[#16365B] space-y-0.5">
              <span className="text-slate-400 text-[10px] block">Power Quality</span>
              <span className="font-semibold text-emerald-400 block truncate">Stable</span>
              <span className="text-[9px] text-slate-500 block truncate">Zero surges logged</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B9E5FF] shrink-0" />
              <span>Hardware in engineering R&D. Physical telemetry activates upon hardware release.</span>
            </span>
            <button
              onClick={() => onNavigate('energy-monitoring')}
              className="text-[#B9E5FF] hover:underline font-semibold shrink-0 text-right cursor-pointer"
            >
              Full Analytics →
            </button>
          </div>
        </div>

        {/* Compact Power Control Sandbox Preview (5 cols) */}
        <div className="lg:col-span-5 bg-[#0B1B33] border border-[#16365B] rounded-xl p-4 space-y-3 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#16365B] pb-2.5">
              <div className="flex items-center gap-2">
                <Power className="w-4 h-4 text-[#B9E5FF]" />
                <h3 className="text-xs sm:text-sm font-bold text-white">Power Control Preview</h3>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                Sandbox Demo
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 mt-2.5 rounded-lg bg-[#071629] border border-[#16365B] text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${simulatedPowerState === 'ON' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                <span className="font-semibold text-white">
                  {simulatedPowerState === 'ON' ? 'Breaker Online (Simulated)' : 'Breaker Isolated (Simulated)'}
                </span>
              </div>
              
              {/* Compact Switch Preview Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleSimulatedSwitch('ON')}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    simulatedPowerState === 'ON'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#0B1B33] text-slate-300 hover:text-white border border-[#16365B]'
                  }`}
                >
                  ON
                </button>
                <button
                  onClick={() => handleSimulatedSwitch('OFF')}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    simulatedPowerState === 'OFF'
                      ? 'bg-rose-600 text-white'
                      : 'bg-[#0B1B33] text-slate-300 hover:text-white border border-[#16365B]'
                  }`}
                >
                  OFF
                </button>
              </div>
            </div>

            {controlNotice && (
              <p className="text-[10px] text-amber-300 bg-amber-950/40 border border-amber-800/60 p-1.5 rounded mt-1.5 font-mono">
                {controlNotice}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-[#16365B]/60">
            <span>Visual simulation only; no physical circuits switched.</span>
            <button
              onClick={() => onNavigate('power-control')}
              className="text-[#B9E5FF] hover:underline font-semibold shrink-0 cursor-pointer"
            >
              Control Sandbox →
            </button>
          </div>
        </div>
      </section>

      {/* 4. PRIMARY NAVIGATION DESTINATIONS (THE 4 CORE WORKSPACE GROUPS) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#16365B] pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#B9E5FF]" />
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Workspaces & Navigation Groups
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#B9E5FF]">
            4 Groups
          </span>
        </div>

        {/* 4 Compact Navigation Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
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
                className="text-left bg-[#0B1B33] border border-[#16365B] rounded-xl p-4 flex flex-col justify-between hover:border-[#B9E5FF]/60 hover:bg-[#0E223F] transition-all duration-200 cursor-pointer group shadow-sm focus:outline-none focus:ring-1 focus:ring-[#B9E5FF]/40"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#071629] border border-[#16365B] text-[#B9E5FF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400">{group.featuresCount}</span>
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${badgeClasses}`}>
                        {group.badge}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#B9E5FF] transition-colors flex items-center gap-1">
                      <span>{group.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#B9E5FF] group-hover:translate-x-0.5 transition-all" />
                    </h3>
                    <p className="text-[11px] text-slate-300 leading-snug mt-1 line-clamp-2">
                      {group.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2.5 mt-2.5 border-t border-[#16365B]/60 text-[11px] font-semibold text-[#B9E5FF] flex items-center justify-between">
                  <span>Enter {group.title}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. FOOTER ARCHITECTURAL NOTE */}
      <footer className="pt-3 border-t border-[#16365B] text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          EnerGuru Platform • Building Electricity Intelligence & Hardware Innovation
        </p>
        <p className="font-mono text-[10px] text-slate-500">
          Supabase Connected • Simulated Telemetry Engine Active
        </p>
      </footer>
    </div>
  );
};
