import React, { useState, useRef, useEffect } from 'react';
import { AuthPage, UserProfile } from '../types';
import { 
  Zap, 
  Activity, 
  Power, 
  Bell, 
  BrainCircuit, 
  Sliders, 
  Wrench, 
  ShieldAlert, 
  LineChart, 
  Users, 
  Briefcase, 
  Cpu, 
  CreditCard,
  LayoutDashboard,
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  User, 
  Settings, 
  Sparkles, 
  HelpCircle,
  Radio,
  X,
  Gauge,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Info
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
        ? 'Simulated supply state set to ONLINE. (Visual demonstration only. No real command was transmitted to physical electrical hardware).'
        : 'Simulated supply state set to DISCONNECTED. (Visual demonstration only. No real command was transmitted to physical electrical hardware).'
    );
  };

  // 13 Navigation Sections
  const navigationSections = [
    {
      id: 'dashboard' as AuthPage,
      title: 'Dashboard',
      desc: 'Central overview of power readiness, device telemetry, and platform status.',
      icon: LayoutDashboard,
      badge: 'Current View',
      badgeType: 'active',
    },
    {
      id: 'energy-monitoring' as AuthPage,
      title: 'Energy Monitoring',
      desc: 'High-frequency line voltage, current demand, and power factor logging.',
      icon: Activity,
      badge: 'In Development',
      badgeType: 'planned',
    },
    {
      id: 'power-control' as AuthPage,
      title: 'Power Control Centre',
      desc: 'Safety-interlocked remote breaker control & automated load shedding sandbox.',
      icon: Power,
      badge: 'In Development',
      badgeType: 'planned',
    },
    {
      id: 'alerts' as AuthPage,
      title: 'Alerts & Notifications',
      desc: 'Instant outage dispatch, voltage spike warnings, and maintenance alerts.',
      icon: Bell,
      badge: 'In Development',
      badgeType: 'planned',
    },
    {
      id: 'ai-intelligence' as AuthPage,
      title: 'AI Energy Intelligence',
      desc: 'DisCo feeder reliability forecasting and generator diesel fuel optimization.',
      icon: BrainCircuit,
      badge: 'In Development',
      badgeType: 'planned',
    },
    {
      id: 'connector-management' as AuthPage,
      title: 'Smart Connector Management',
      desc: 'Cellular SIM provisioning, OTA firmware updates, and electrician commissioning.',
      icon: Sliders,
      badge: 'In Development',
      badgeType: 'planned',
    },
    {
      id: 'equipment' as AuthPage,
      title: 'Equipment Registry & Maintenance',
      desc: 'Digital registry for generators, solar inverters, battery banks, and service logs.',
      icon: Wrench,
      badge: 'Interactive',
      badgeType: 'live',
    },
    {
      id: 'outage-prep' as AuthPage,
      title: 'Outage Prep',
      desc: 'Structured protocols for blackouts, water pumping, fuel storage, and safety.',
      icon: ShieldAlert,
      badge: 'Interactive',
      badgeType: 'live',
    },
    {
      id: 'energy-costs' as AuthPage,
      title: 'Cost & Energy Reports',
      desc: 'Utility Band A/B/C tariff modeling compared against generator fuel costs.',
      icon: LineChart,
      badge: 'Interactive',
      badgeType: 'live',
    },
    {
      id: 'community-funding' as AuthPage,
      title: 'Community Energy',
      desc: 'Public & social impact microgrids for clinics, schools, and farm cold storage.',
      icon: Users,
      badge: 'Concept Framework',
      badgeType: 'framework',
    },
    {
      id: 'get-quote' as AuthPage,
      title: 'Commercial & Enterprise',
      desc: 'Tailored electrical engineering consultations, site audits, and formal quotes.',
      icon: Briefcase,
      badge: 'Request a Quote',
      badgeType: 'live',
    },
    {
      id: 'connector' as AuthPage,
      title: 'Hardware Engineering',
      desc: 'DIN-rail smart electricity connector R&D specs and device pairing sandbox.',
      icon: Cpu,
      badge: 'R&D Prototype',
      badgeType: 'rd',
    },
    {
      id: 'plans' as AuthPage,
      title: 'Plans & Subscriptions',
      desc: 'Transparent advisory and hardware monitoring subscription structures.',
      icon: CreditCard,
      badge: 'View Plans',
      badgeType: 'live',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 text-slate-900">
      
      {/* 1. WELCOME AREA */}
      <section className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Greeting text */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Electricity Intelligence Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, <span className="text-emerald-700">{displayName}</span>
            </h1>
            <p className="text-sm text-slate-600">
              Here’s what’s happening with your electricity supply today.
            </p>
          </div>

          {/* Quick Actions, Notification Icon & Profile Menu */}
          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
            {/* Notification Bell Dropdown Trigger */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
                aria-label="Alerts and notifications"
                title="View electricity notifications"
              >
                <Bell className="w-4 h-4 text-slate-700" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                  2
                </span>
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-lg p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-700" />
                      <span className="text-xs font-bold text-slate-900">Notifications & Alerts</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Simulated Dispatch
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold text-slate-800">
                        <span className="flex items-center gap-1.5 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Grid Voltage Stable</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">10m ago</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Feeder 11kV line voltage measuring 232V (nominal band). No active brownout or surge alerts detected.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold text-amber-900">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                          <span>Maintenance Reminder</span>
                        </span>
                        <span className="text-[10px] text-amber-700 font-mono">Yesterday</span>
                      </div>
                      <p className="text-amber-800 text-[11px] leading-relaxed">
                        Generator service interval approaching: 45 operating hours recorded in Equipment Registry.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigate('alerts');
                      }}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                    >
                      View All in Alerts Hub →
                    </button>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
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
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center">
                {initial}
              </div>
              <span className="hidden sm:inline">Profile</span>
            </button>

            {/* Setup Guide / Onboarding Trigger */}
            {onOpenOnboarding && (
              <button
                onClick={onOpenOnboarding}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Setup Guide</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. ENERGY OVERVIEW (COMPACT SUMMARY CARDS - SIMULATED DEMO DATA) */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-700" />
              <span>Energy Overview</span>
            </h2>
            <p className="text-xs text-slate-500">
              Building electricity readings and daily utility telemetry.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 self-start sm:self-auto px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-[10px] font-mono text-amber-800">
            <Info className="w-3 h-3 text-amber-600" />
            <span>SIMULATED DEMO DATA • HARDWARE IN R&D</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Voltage */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs space-y-2 hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Incoming Voltage</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                Demo
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">232</span>
              <span className="text-xs font-semibold text-slate-500">V AC</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Normal Band (210V – 240V)</span>
            </div>
          </div>

          {/* Metric 2: Current Load */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs space-y-2 hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Current Demand</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                Demo
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">1.85</span>
              <span className="text-xs font-semibold text-slate-500">kW</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <Gauge className="w-3.5 h-3.5 text-emerald-700" />
              <span>Active Load • 8.04 Amps (Phase 1)</span>
            </div>
          </div>

          {/* Metric 3: Today's Energy Usage */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs space-y-2 hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Today's Consumption</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                Demo
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">14.6</span>
              <span className="text-xs font-semibold text-slate-500">kWh</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
              <span>24h Aggregate • Est. Band A</span>
            </div>
          </div>

          {/* Metric 4: Electricity Supply Status */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-xs space-y-2 hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">Supply Status</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                Demo
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-emerald-700 truncate">Grid Active</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Mains Supply Online • 50.1 Hz</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POWER STATUS OVERVIEW & QUICK CONTROL PREVIEW (SIDE-BY-SIDE / STACKED) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Power Status Overview Panel (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-700" />
                <span>Power Status Overview</span>
              </h2>
              <p className="text-xs text-slate-500">
                Operational status of building electricity and telemetry links.
              </p>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              Diagnostic Feed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-slate-500 block text-[11px]">Electricity Supply Status</span>
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Mains Utility Power (Online)</span>
              </div>
              <span className="text-[10px] text-slate-500 block">Feeder 11kV Phase Synchronized</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-slate-500 block text-[11px]">Smart Connector Hardware Status</span>
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Cpu className="w-3.5 h-3.5 text-blue-600" />
                <span>R&D Prototype Standby</span>
              </div>
              <span className="text-[10px] text-slate-500 block">Physical unit in engineering lab</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-slate-500 block text-[11px]">Last Telemetry Communication</span>
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>2 mins ago (Simulated Ping)</span>
              </div>
              <span className="text-[10px] text-slate-500 block">Cellular IoT Sandbox Link</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-slate-500 block text-[11px]">Active Grid Stability Notice</span>
              <div className="flex items-center gap-2 font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nominal Line Voltage</span>
              </div>
              <span className="text-[10px] text-slate-500 block">No critical over-voltage alerts</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/70 text-[11px] text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold block text-emerald-950">System Architecture Boundary</span>
              <p className="text-emerald-800 leading-relaxed">
                Account authenticated via Supabase. Live electrical measurements and physical telemetry will connect automatically upon licensed Smart Connector installation.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Control Preview (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Power className="w-4 h-4 text-emerald-700" />
                  <span>Power Control Centre Preview</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Remote switching simulation preview.
                </p>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                DEMO / SIMULATED
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Visual interface demonstration for future building-level circuit switching. Physical switching requires certified hardware interlocks.
            </p>

            {/* Displayed State Card */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Displayed State:</span>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${simulatedPowerState === 'ON' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                <span className={`text-xs font-bold font-mono ${simulatedPowerState === 'ON' ? 'text-emerald-700' : 'text-slate-600'}`}>
                  {simulatedPowerState === 'ON' ? 'POWER ON (SIMULATED)' : 'POWER OFF (SIMULATED)'}
                </span>
              </div>
            </div>

            {/* Simulated Action Notice */}
            {controlActionNotice && (
              <div className="p-2.5 rounded bg-slate-100 border border-slate-200 text-[11px] text-slate-700 leading-relaxed animate-in fade-in">
                {controlActionNotice}
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleSimulatedSwitch('ON')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                  simulatedPowerState === 'ON'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>TURN ON</span>
              </button>
              <button
                onClick={() => handleSimulatedSwitch('OFF')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                  simulatedPowerState === 'OFF'
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <X className="w-3.5 h-3.5" />
                <span>TURN OFF</span>
              </button>
            </div>

            <div className="text-[10px] text-slate-400 text-center font-mono">
              Strictly a visual demonstration. Does not control physical electrical circuits.
            </div>
          </div>
        </div>
      </section>

      {/* 4. DASHBOARD NAVIGATION SECTIONS (13 COMPACT BUTTON-LIKE CARDS) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/80 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-700" />
              <span>Dashboard Navigation Modules</span>
            </h2>
            <p className="text-xs text-slate-500">
              Access active platform tools, commercial requests, engineering specs, and developmental workspaces.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500 self-start sm:self-auto">
            13 Platform Sections
          </span>
        </div>

        {/* 13 Compact, Button-like Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
          {navigationSections.map((sec) => {
            const Icon = sec.icon;
            const isCurrent = sec.id === 'dashboard';

            // Badge styling
            const badgeClasses = {
              live: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
              planned: 'bg-slate-100 text-slate-700 border-slate-200',
              framework: 'bg-blue-50 text-blue-800 border-blue-200/80',
              rd: 'bg-purple-50 text-purple-800 border-purple-200/80',
              active: 'bg-emerald-600 text-white border-emerald-600 font-bold',
            }[sec.badgeType] || 'bg-slate-100 text-slate-700 border-slate-200';

            return (
              <button
                key={sec.id}
                onClick={() => onNavigate(sec.id)}
                className={`text-left bg-white border rounded-xl p-4 flex flex-col justify-between transition-all duration-150 cursor-pointer group shadow-xs hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                  isCurrent 
                    ? 'border-emerald-500/80 bg-emerald-50/20' 
                    : 'border-slate-200/90 hover:border-emerald-500/60 hover:bg-slate-50/60'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/70 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${badgeClasses}`}>
                      {sec.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-1">
                      <span>{sec.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1 line-clamp-2">
                      {sec.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-slate-100 text-[11px] font-semibold text-emerald-700 flex items-center justify-between">
                  <span>Open Section</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. FOOTER ARCHITECTURAL NOTE */}
      <footer className="pt-4 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          EnerGuru Platform • Building Electricity Intelligence & Hardware Innovation
        </p>
        <p className="font-mono text-[11px] text-slate-400">
          Supabase Connected • Simulated Telemetry Engine Active
        </p>
      </footer>
    </div>
  );
};
