import React, { useState } from 'react';
import { AuthPage, UserProfile } from '../types';
import { 
  Activity, 
  Power, 
  Wrench, 
  Briefcase, 
  Users, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Gauge, 
  ShieldCheck, 
  ChevronRight, 
  Info,
  Layers,
  Loader2,
  Check,
  X,
  Zap,
  Sliders
} from 'lucide-react';

interface DashboardPageProps {
  userProfile: UserProfile | null;
  userEmail: string | null;
  onNavigate: (page: AuthPage) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  userProfile,
  userEmail,
  onNavigate,
}) => {
  // Extract user's first name dynamically
  const getFirstName = () => {
    if (userProfile?.full_name?.trim()) {
      const parts = userProfile.full_name.trim().split(' ');
      return parts[0];
    }
    if (userProfile?.nickname?.trim()) {
      return userProfile.nickname.trim();
    }
    if (userEmail) {
      const username = userEmail.split('@')[0];
      return username.charAt(0).toUpperCase() + username.slice(1);
    }
    return 'Customer';
  };

  const userFirstName = getFirstName();

  // Power control state management (Prototype Sandbox Mode)
  const [supplyState, setSupplyState] = useState<'ON' | 'OFF'>('ON');
  const [isCommandPending, setIsCommandPending] = useState(false);
  const [pendingTargetState, setPendingTargetState] = useState<'ON' | 'OFF' | null>(null);
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);

  // Switching confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [targetAction, setTargetAction] = useState<'ON' | 'OFF'>('OFF');

  // Metering preview toggle
  const [showDemoCtReadings, setShowDemoCtReadings] = useState(true);

  // Handle remote switching initiation with safety confirmation prompt
  const initiateSwitch = (action: 'ON' | 'OFF') => {
    setTargetAction(action);
    setShowConfirmModal(true);
  };

  // Execute confirmed switching command in prototype sandbox
  const confirmSwitch = () => {
    setShowConfirmModal(false);
    setIsCommandPending(true);
    setPendingTargetState(targetAction);
    setCommandFeedback('Simulating command dispatch in prototype sandbox...');

    // Simulate 1.5s software response in prototype mode (no physical hardware connected)
    setTimeout(() => {
      setIsCommandPending(false);
      setSupplyState(targetAction);
      setPendingTargetState(null);
      setCommandFeedback(
        targetAction === 'ON'
          ? 'State Updated: Supply ON in demo sandbox. (No physical contactor connected).'
          : 'State Updated: Supply ISOLATED in demo sandbox. (No physical contactor connected).'
      );

      // Auto-clear feedback after 6 seconds
      setTimeout(() => {
        setCommandFeedback(null);
      }, 6000);
    }, 1500);
  };

  // Dynamic values reflecting simulated supply state
  const isElectricityAvailable = supplyState === 'ON';
  const simulatedVoltage = isElectricityAvailable ? '~230' : '0';
  const simulatedSource = isElectricityAvailable ? 'Public Grid (Demo)' : 'No Active Feed (Demo)';

  // Compact customer workspaces navigation directory (5 dedicated sections)
  const customerSections = [
    {
      id: 'energy-management' as AuthPage,
      title: 'Energy & Power',
      desc: 'Telemetry, load profiles & tariffs',
      icon: Activity,
    },
    {
      id: 'devices-operations' as AuthPage,
      title: 'Devices & Operations',
      desc: 'Connector concepts & equipment logs',
      icon: Wrench,
    },
    {
      id: 'business-enterprise' as AuthPage,
      title: 'Business & Enterprise',
      desc: 'Advisory audits & quote requests',
      icon: Briefcase,
    },
    {
      id: 'community-impact' as AuthPage,
      title: 'Community & Impact',
      desc: 'Rural clinic & school solar initiatives',
      icon: Users,
    },
    {
      id: 'account-plans' as AuthPage,
      title: 'Account & Plans',
      desc: 'Profile credentials & subscriptions',
      icon: User,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-3 sm:py-4 space-y-3 sm:space-y-3.5 text-white">
      
      {/* 1. COMPACT WELCOME HEADER */}
      <div className="flex items-center justify-between gap-2 border-b border-[#16365B]/60 pb-2">
        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Welcome, <span className="text-[#B9E5FF]">{userFirstName}</span>
          </h1>
          <span className="text-[9px] font-mono uppercase bg-amber-950/60 text-amber-300 border border-amber-800/80 px-1.5 py-0.2 rounded shrink-0">
            Prototype Demo
          </span>
        </div>
        <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium hidden xs:block sm:block">
          Electricity Telemetry & Controls
        </div>
      </div>

      {/* 2. FOUR PRIMARY ELECTRICITY INDICATORS (2 COLUMNS ON MOBILE, 4 ON DESKTOP) */}
      <section className="space-y-1.5">
        <div className="flex items-center justify-between text-xs px-0.5">
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] sm:text-[11px]">
            Electricity Status Overview
          </span>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
            Simulated 2x2 Grid
          </span>
        </div>

        {/* Responsive Grid: 2 columns on Mobile & Tablet, 4 columns on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
          
          {/* Card 1: Electricity Supply Status */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-lg sm:rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-[#B9E5FF]/40 transition-colors shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
                <span className="font-medium text-slate-300 truncate">1. Supply Status</span>
                <span className="text-[9px] font-mono text-slate-400">Mains</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-xs sm:text-sm md:text-base font-bold tracking-tight truncate ${
                  isElectricityAvailable ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {isElectricityAvailable ? 'Supply Active (Demo)' : 'Supply Inactive (Demo)'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-300 pt-1.5 mt-1 border-t border-[#16365B]/60 truncate">
              {isElectricityAvailable ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">Circuits receiving power</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                  <span className="truncate">Supply isolated in demo</span>
                </>
              )}
            </div>
          </div>

          {/* Card 2: Voltage Monitoring */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-lg sm:rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-[#B9E5FF]/40 transition-colors shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
                <span className="font-medium text-slate-300 truncate">2. Voltage Reading</span>
                <span className="text-[9px] font-mono text-slate-400">Line</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xs sm:text-sm md:text-base font-bold text-white tracking-tight">
                  {simulatedVoltage}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">V AC (Demo)</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-300 pt-1.5 mt-1 border-t border-[#16365B]/60 truncate">
              <Info className="w-3 h-3 text-[#B9E5FF] shrink-0" />
              <span className="truncate">
                {isElectricityAvailable ? 'Nominal band ~210–240V' : '0V (Isolated line)'}
              </span>
            </div>
          </div>

          {/* Card 3: Detected Power Source */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-lg sm:rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-[#B9E5FF]/40 transition-colors shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
                <span className="font-medium text-slate-300 truncate">3. Power Source</span>
                <span className="text-[9px] font-mono text-slate-400">Feed</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xs sm:text-sm md:text-base font-bold text-[#B9E5FF] tracking-tight truncate">
                  {simulatedSource}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-300 pt-1.5 mt-1 border-t border-[#16365B]/60 truncate">
              <Activity className="w-3 h-3 text-[#B9E5FF] shrink-0" />
              <span className="truncate">Simulated grid feed profile</span>
            </div>
          </div>

          {/* Card 4: Electrical Protection Status */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-lg sm:rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-[#B9E5FF]/40 transition-colors shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
                <span className="font-medium text-slate-300 truncate">4. Protection</span>
                <span className="text-[9px] font-mono text-amber-300">R&D</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xs sm:text-sm md:text-base font-bold text-amber-300 tracking-tight truncate">
                  Prototype Sandbox
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-300 pt-1.5 mt-1 border-t border-[#16365B]/60 truncate">
              <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">Pending hardware validation</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OPTIONAL ENERGY CONSUMPTION PREVIEW (COMPACT TWO-COLUMN MOBILE GRID) */}
      <section className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-2.5 sm:p-3 space-y-2 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#16365B]/70 pb-1.5 text-xs">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-[#B9E5FF]" />
            <h3 className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">
              Consumption Preview (Simulated)
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="text-slate-400 hidden xs:inline">CT Readings:</span>
            <button
              onClick={() => setShowDemoCtReadings(!showDemoCtReadings)}
              className={`px-1.5 py-0.2 rounded text-[9px] font-semibold transition-colors cursor-pointer border ${
                showDemoCtReadings
                  ? 'bg-[#16365B] text-[#B9E5FF] border-[#B9E5FF]/30'
                  : 'bg-[#071629] text-slate-400 border-[#16365B]'
              }`}
            >
              {showDemoCtReadings ? 'Visible' : 'Hidden'}
            </button>
          </div>
        </div>

        {showDemoCtReadings ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {/* Box 1: Demand */}
            <div className="p-2 rounded bg-[#071629] border border-[#16365B] space-y-0.5">
              <div className="flex items-center justify-between text-[9px] text-slate-400">
                <span className="font-medium">Demand</span>
                <span className="font-mono">Demo</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm sm:text-base font-bold text-white">
                  {isElectricityAvailable ? '~1.85' : '0.00'}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">kW</span>
              </div>
              <span className="text-[9px] text-slate-400 block truncate">
                {isElectricityAvailable ? '~8.0 A draw (Demo)' : '0.00 A'}
              </span>
            </div>

            {/* Box 2: Daily Energy */}
            <div className="p-2 rounded bg-[#071629] border border-[#16365B] space-y-0.5">
              <div className="flex items-center justify-between text-[9px] text-slate-400">
                <span className="font-medium">Today</span>
                <span className="font-mono">Demo</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm sm:text-base font-bold text-white">~14.6</span>
                <span className="text-[10px] text-slate-400 font-semibold">kWh</span>
              </div>
              <span className="text-[9px] text-slate-400 block truncate">
                Simulated daily total
              </span>
            </div>

            {/* Box 3: Analytics Link (Spans 2 columns on mobile, 1 col on desktop) */}
            <div className="col-span-2 md:col-span-1 p-2 rounded bg-[#071629] border border-[#16365B] flex flex-row md:flex-col items-center md:items-start justify-between gap-1">
              <div>
                <span className="text-[9px] text-slate-400 font-medium block">Analytics</span>
                <p className="text-[9px] text-slate-300 truncate md:line-clamp-1">
                  Load curves & tariffs
                </p>
              </div>
              <button
                onClick={() => onNavigate('energy-monitoring')}
                className="text-[10px] font-semibold text-[#B9E5FF] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Open Energy & Power</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-1.5 rounded bg-[#071629] text-[10px] text-slate-400 flex items-center justify-between">
            <span>Simulated CT energy readings are hidden.</span>
            <button
              onClick={() => setShowDemoCtReadings(true)}
              className="text-[#B9E5FF] hover:underline font-semibold cursor-pointer"
            >
              Show Readings →
            </button>
          </div>
        )}
      </section>

      {/* 4. REMOTE POWER CONTROL SECTION (COMPACT & PROPORTIONAL) */}
      <section className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-3 sm:p-3.5 space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between gap-2 border-b border-[#16365B]/70 pb-2">
          <div className="flex items-center gap-1.5">
            <Power className="w-3.5 h-3.5 text-[#B9E5FF]" />
            <h3 className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">
              Remote Electricity Supply Control (Prototype Simulation)
            </h3>
          </div>
          <span className="text-[9px] text-amber-300 bg-amber-950/60 border border-amber-800/80 px-1.5 py-0.2 rounded font-mono shrink-0">
            Interactive Demo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
          {/* Status Breakdown (7 cols on desktop) */}
          <div className="md:col-span-7 space-y-1.5">
            <div className="p-2.5 rounded-lg bg-[#071629] border border-[#16365B] space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Simulated Contactor:</span>
                <span className={`font-mono text-[9px] font-bold px-1.5 py-0.2 rounded ${
                  supplyState === 'ON' 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {supplyState === 'ON' ? 'SUPPLY ON (DEMO)' : 'SUPPLY ISOLATED (DEMO)'}
                </span>
              </div>

              <div className="text-sm sm:text-base font-bold text-white">
                {supplyState === 'ON' ? 'Simulated Supply Online' : 'Simulated Supply Disconnected'}
              </div>

              <p className="text-[10px] text-slate-300 leading-tight">
                {supplyState === 'ON'
                  ? 'Contactor simulated in CLOSED state. Software sandbox preview (no physical contactor connected).'
                  : 'Contactor simulated in OPEN state. Software sandbox preview (no physical contactor connected).'}
              </p>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 px-0.5">
              <span>Hardware Link: <strong className="text-amber-300 font-mono text-[9px]">Simulated (No hardware connected)</strong></span>
              <span>Override: <strong className="text-slate-300">Manual Bypass Concept</strong></span>
            </div>

            {commandFeedback && (
              <div className="p-1.5 rounded bg-[#071629] border border-[#B9E5FF]/40 text-[10px] text-[#B9E5FF] flex items-center gap-1.5">
                <Info className="w-3 h-3 shrink-0" />
                <span>{commandFeedback}</span>
              </div>
            )}
          </div>

          {/* Action Button & Safety Reminder (5 cols on desktop) */}
          <div className="md:col-span-5 flex flex-col justify-center space-y-1.5 p-2.5 bg-[#071629]/60 border border-[#16365B] rounded-lg">
            <span className="text-[10px] font-medium text-slate-300 block">
              Authorized Remote Switching:
            </span>

            {supplyState === 'ON' ? (
              <button
                onClick={() => initiateSwitch('OFF')}
                disabled={isCommandPending}
                className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isCommandPending && pendingTargetState === 'OFF' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Simulating Disconnect...</span>
                  </>
                ) : (
                  <>
                    <Power className="w-3.5 h-3.5" />
                    <span>Turn Off Electricity Supply (Demo)</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => initiateSwitch('ON')}
                disabled={isCommandPending}
                className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isCommandPending && pendingTargetState === 'ON' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Simulating Restore...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Restore Electricity Supply (Demo)</span>
                  </>
                )}
              </button>
            )}

            <p className="text-[9px] text-slate-400 leading-tight">
              Safety confirmation required before switching simulation.
            </p>
          </div>
        </div>

        {/* Safety Policy Notice */}
        <div className="p-2 rounded bg-[#071629] border border-[#16365B] text-[10px] text-slate-300 flex items-start gap-1.5">
          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-tight text-slate-400">
            <strong className="text-slate-300">Safety Policy:</strong> Physical electrical protection operates autonomously at the DIN-rail hardware level and remains independent of software subscription status in the future design.
          </p>
        </div>
      </section>

      {/* 5. CUSTOMER WORKSPACES (GENUINE 2-COLUMN MOBILE GRID, 5 COLUMNS ON DESKTOP) */}
      <section className="space-y-1.5">
        <div className="flex items-center justify-between text-xs px-0.5">
          <div className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#B9E5FF]" />
            <h2 className="font-bold text-slate-300 uppercase tracking-wider text-[10px] sm:text-[11px]">
              Customer Workspaces
            </h2>
          </div>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
            5 Workspaces
          </span>
        </div>

        {/* Genuine 2-column mobile grid, 3-column tablet, 5-column desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
          {customerSections.map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => onNavigate(sec.id)}
                className="text-left bg-[#0B1B33] border border-[#16365B] rounded-lg sm:rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:border-[#B9E5FF]/60 hover:bg-[#0E223F] transition-all cursor-pointer group shadow-xs h-full"
              >
                <div className="space-y-1.5">
                  <div className="w-6 h-6 rounded-md bg-[#071629] border border-[#16365B] text-[#B9E5FF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-3 h-3" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-[#B9E5FF] transition-colors flex items-center justify-between">
                      <span className="truncate">{sec.title}</span>
                      <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-[#B9E5FF] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </h3>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-1">
                      {sec.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-1 mt-1 border-t border-[#16365B]/60 text-[9px] sm:text-[10px] font-semibold text-[#B9E5FF] flex items-center justify-between">
                  <span>Open</span>
                  <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-2 border-t border-[#16365B]/60 text-[9px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-1">
        <p>
          EnerGuru Platform • Building Electricity Intelligence Software Prototype
        </p>
        <p className="text-[9px] text-slate-400">
          Smarter Energy. Stay Aware. Stay Prepared.
        </p>
      </footer>

      {/* POWER CONTROL CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-[#0B1B33] border border-[#16365B] rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-[#16365B] pb-2">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  targetAction === 'OFF' ? 'bg-rose-950 text-rose-400' : 'bg-emerald-950 text-emerald-400'
                }`}>
                  <Power className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    {targetAction === 'OFF' ? 'Confirm Power Disconnection' : 'Confirm Power Restoration'}
                  </h3>
                  <span className="text-[9px] text-amber-300 font-mono">Prototype Simulation</span>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-slate-300">
              {targetAction === 'OFF' ? (
                <>
                  <p className="leading-snug text-[11px]">
                    You are testing the <strong>main electricity supply isolation</strong> flow for this building.
                  </p>
                  <div className="p-2 rounded bg-rose-950/40 border border-rose-800/80 text-rose-200 space-y-0.5">
                    <strong className="block text-rose-300 text-[10px]">Safety Precaution (Future Production Device):</strong>
                    <span className="text-[10px] leading-tight block">
                      In production, this command cuts power to all circuits. Verify that critical medical devices or essential equipment are not active.
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <p className="leading-snug text-[11px]">
                    You are testing the <strong>main electricity supply restoration</strong> flow for this building.
                  </p>
                  <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/80 text-emerald-200 space-y-0.5">
                    <strong className="block text-emerald-300 text-[10px]">Safety Precaution (Future Production Device):</strong>
                    <span className="text-[10px] leading-tight block">
                      In production, this command reconnects utility power. Verify that maintenance on building circuits is complete and appliances are safe.
                    </span>
                  </div>
                </>
              )}

              <div className="p-1.5 rounded bg-[#071629] border border-[#16365B] text-[10px] text-slate-400">
                <strong>Prototype Notice:</strong> Simulates remote switching in this software demonstration. No physical building power is interrupted.
              </div>
            </div>

            <div className="pt-2 border-t border-[#16365B] flex items-center justify-end gap-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-3 py-1.5 rounded-lg bg-[#071629] hover:bg-[#16365B] text-slate-300 text-xs font-semibold border border-[#16365B] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmSwitch}
                className={`px-3 py-1.5 rounded-lg text-white text-xs font-bold shadow-xs cursor-pointer ${
                  targetAction === 'OFF'
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {targetAction === 'OFF' ? 'Simulate Disconnection' : 'Simulate Restoration'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
