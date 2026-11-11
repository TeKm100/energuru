import React, { useState, useEffect } from 'react';
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
  Lock,
  KeyRound
} from 'lucide-react';
import { getSecurityPinStatus, SecurityPinStatus } from '../lib/securityPin';
import { SecurityPinModal, PinModalMode } from '../components/SecurityPinModal';

interface DashboardPageProps {
  userProfile: UserProfile | null;
  userEmail: string | null;
  userId?: string | null;
  onNavigate: (page: AuthPage) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  userProfile,
  userEmail,
  userId,
  onNavigate,
}) => {
  // Extract user's first name dynamically
  const getFirstName = () => {
    if (userProfile?.nickname?.trim()) {
      return userProfile.nickname.trim();
    }
    if (userProfile?.full_name?.trim()) {
      const parts = userProfile.full_name.trim().split(' ');
      return parts[0];
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

  // Switching confirmation & PIN authorization modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [targetAction, setTargetAction] = useState<'ON' | 'OFF'>('OFF');

  // Security PIN status & modal
  const [pinStatus, setPinStatus] = useState<SecurityPinStatus>({
    hasPin: false,
    isLocked: false,
    attemptsRemaining: 3,
  });
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinModalMode, setPinModalMode] = useState<PinModalMode>('verify');
  const [showNeedPinPrompt, setShowNeedPinPrompt] = useState(false);

  // Refresh PIN status
  const refreshPinStatus = async () => {
    if (userId) {
      const status = await getSecurityPinStatus(userId);
      setPinStatus(status);
    }
  };

  useEffect(() => {
    refreshPinStatus();
  }, [userId]);

  // Metering preview toggle
  const [showDemoCtReadings, setShowDemoCtReadings] = useState(true);

  // Handle remote switching initiation
  const initiateSwitch = (action: 'ON' | 'OFF') => {
    setTargetAction(action);

    // If locked out, advise reset
    if (pinStatus.isLocked) {
      setPinModalMode('reset');
      setPinModalOpen(true);
      return;
    }

    // If user has not set a Security PIN yet, prompt them to configure one
    if (!pinStatus.hasPin) {
      setShowNeedPinPrompt(true);
      return;
    }

    // Otherwise show the safety confirmation dialog
    setShowConfirmModal(true);
  };

  // When user confirms safety warning, trigger PIN verification
  const handleProceedToPin = () => {
    setShowConfirmModal(false);
    setPinModalMode('verify');
    setPinModalOpen(true);
  };

  // Execute confirmed switching command in prototype sandbox after successful PIN verification
  const executeSwitchAfterPin = () => {
    setIsCommandPending(true);
    setPendingTargetState(targetAction);
    setCommandFeedback('PIN Authorized: Simulating command dispatch in prototype sandbox...');

    // Simulate 1.5s software response in prototype mode (no physical hardware connected)
    setTimeout(() => {
      setIsCommandPending(false);
      setSupplyState(targetAction);
      setPendingTargetState(null);
      setCommandFeedback(
        targetAction === 'ON'
          ? 'Supply Restored: Contactor simulated in CLOSED state. (Software simulation only).'
          : 'Supply Isolated: Contactor simulated in OPEN state. (Software simulation only).'
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
      desc: 'Telemetry & tariffs',
      icon: Activity,
    },
    {
      id: 'devices-operations' as AuthPage,
      title: 'Devices & Ops',
      desc: 'Connectors & hardware',
      icon: Wrench,
    },
    {
      id: 'business-enterprise' as AuthPage,
      title: 'Business & Quotes',
      desc: 'Advisory & audits',
      icon: Briefcase,
    },
    {
      id: 'community-impact' as AuthPage,
      title: 'Community Impact',
      desc: 'Clinic & school solar',
      icon: Users,
    },
    {
      id: 'account-plans' as AuthPage,
      title: 'Account & Plans',
      desc: 'Security PIN & profile',
      icon: User,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-2.5 sm:py-3.5 space-y-2.5 sm:space-y-3 text-white">
      
      {/* 1. RESTRAINED WELCOME HEADER (OPAY DENSITY) */}
      <div className="flex items-center justify-between gap-2 border-b border-[#16365B]/60 pb-2">
        <div className="flex items-center gap-2">
          <h1 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-tight">
            Welcome, <span className="text-[#B9E5FF]">{userFirstName}</span>
          </h1>
          <span className="text-[9px] font-mono uppercase bg-amber-950/60 text-amber-300 border border-amber-800/80 px-1.5 py-0.2 rounded shrink-0">
            Prototype Demo
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Quick PIN status pill */}
          <button
            onClick={() => onNavigate('profile')}
            className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono uppercase px-2 py-0.5 rounded border transition-colors cursor-pointer ${
              pinStatus.hasPin
                ? pinStatus.isLocked
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                : 'bg-amber-950/80 text-amber-300 border-amber-800'
            }`}
            title="Manage 4-digit Power Security PIN in Profile"
          >
            <Lock className="w-2.5 h-2.5" />
            <span>
              {pinStatus.hasPin
                ? pinStatus.isLocked
                  ? 'PIN Locked'
                  : 'PIN Active'
                : 'Set PIN'}
            </span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className="text-[10px] sm:text-[11px] text-[#B9E5FF] hover:underline hidden xs:inline"
          >
            My Profile →
          </button>
        </div>
      </div>

      {/* 2. FOUR PRIMARY ELECTRICITY INDICATORS (2 COLUMNS ON MOBILE, 4 ON DESKTOP) */}
      <section className="space-y-1">
        <div className="flex items-center justify-between text-xs px-0.5">
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
            Electricity Overview
          </span>
          <span className="text-[9px] text-slate-400 font-mono">
            Simulated Feed
          </span>
        </div>

        {/* Responsive Grid: 2 columns on Mobile & Tablet, 4 columns on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          
          {/* Card 1: Electricity Supply Status */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-lg p-2 sm:p-2.5 flex flex-col justify-between hover:border-[#B9E5FF]/40 transition-colors shadow-xs">
            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-medium text-slate-300 truncate">1. Supply Status</span>
                <span className="text-[9px] font-mono text-slate-400">Mains</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-xs sm:text-sm font-bold tracking-tight truncate ${
                  isElectricityAvailable ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {isElectricityAvailable ? 'Active (Demo)' : 'Isolated (Demo)'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-300 pt-1 mt-1 border-t border-[#16365B]/60 truncate">
              {isElectricityAvailable ? (
                <>
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                  <span className="truncate">Circuits energized</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                  <span className="truncate">Isolated in demo</span>
                </>
              )}
            </div>
          </div>

          {/* Card 2: Voltage Reading */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-lg p-2 sm:p-2.5 flex flex-col justify-between hover:border-[#B9E5FF]/40 transition-colors shadow-xs">
            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-medium text-slate-300 truncate">2. Voltage Reading</span>
                <span className="text-[9px] font-mono text-slate-400">Line</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  {simulatedVoltage}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">V AC (Demo)</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-300 pt-1 mt-1 border-t border-[#16365B]/60 truncate">
              <Info className="w-2.5 h-2.5 text-[#B9E5FF] shrink-0" />
              <span className="truncate">
                {isElectricityAvailable ? '~210–240V nominal' : '0V (Isolated line)'}
              </span>
            </div>
          </div>

          {/* Card 3: Detected Power Source */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-lg p-2 sm:p-2.5 flex flex-col justify-between hover:border-[#B9E5FF]/40 transition-colors shadow-xs">
            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-medium text-slate-300 truncate">3. Power Source</span>
                <span className="text-[9px] font-mono text-slate-400">Feed</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xs sm:text-sm font-bold text-[#B9E5FF] tracking-tight truncate">
                  {simulatedSource}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-300 pt-1 mt-1 border-t border-[#16365B]/60 truncate">
              <Activity className="w-2.5 h-2.5 text-[#B9E5FF] shrink-0" />
              <span className="truncate">Simulated grid feed</span>
            </div>
          </div>

          {/* Card 4: Electrical Protection Status */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-lg p-2 sm:p-2.5 flex flex-col justify-between hover:border-[#B9E5FF]/40 transition-colors shadow-xs">
            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-medium text-slate-300 truncate">4. Protection</span>
                <span className="text-[9px] font-mono text-amber-300">R&D</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xs sm:text-sm font-bold text-amber-300 tracking-tight truncate">
                  Prototype Sandbox
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-300 pt-1 mt-1 border-t border-[#16365B]/60 truncate">
              <ShieldCheck className="w-2.5 h-2.5 text-amber-400 shrink-0" />
              <span className="truncate">Pending hardware build</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OPTIONAL ENERGY CONSUMPTION PREVIEW (COMPACT TWO-COLUMN MOBILE GRID) */}
      <section className="bg-[#0B1B33] border border-[#16365B] rounded-lg p-2 sm:p-2.5 space-y-1.5 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#16365B]/70 pb-1 text-xs">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3 h-3 text-[#B9E5FF]" />
            <h3 className="text-[10px] font-bold text-white uppercase tracking-wider">
              Consumption Preview (Simulated)
            </h3>
          </div>

          <div className="flex items-center gap-1 text-[9px]">
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-2">
            {/* Box 1: Demand */}
            <div className="p-1.5 sm:p-2 rounded bg-[#071629] border border-[#16365B] space-y-0.5">
              <div className="flex items-center justify-between text-[9px] text-slate-400">
                <span className="font-medium">Demand</span>
                <span className="font-mono">Demo</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xs sm:text-sm font-bold text-white">
                  {isElectricityAvailable ? '~1.85' : '0.00'}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold">kW</span>
              </div>
              <span className="text-[9px] text-slate-400 block truncate">
                {isElectricityAvailable ? '~8.0 A draw (Demo)' : '0.00 A'}
              </span>
            </div>

            {/* Box 2: Daily Energy */}
            <div className="p-1.5 sm:p-2 rounded bg-[#071629] border border-[#16365B] space-y-0.5">
              <div className="flex items-center justify-between text-[9px] text-slate-400">
                <span className="font-medium">Today</span>
                <span className="font-mono">Demo</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xs sm:text-sm font-bold text-white">~14.6</span>
                <span className="text-[9px] text-slate-400 font-semibold">kWh</span>
              </div>
              <span className="text-[9px] text-slate-400 block truncate">
                Simulated daily total
              </span>
            </div>

            {/* Box 3: Analytics Link (Spans 2 columns on mobile, 1 col on desktop) */}
            <div className="col-span-2 md:col-span-1 p-1.5 sm:p-2 rounded bg-[#071629] border border-[#16365B] flex flex-row md:flex-col items-center md:items-start justify-between gap-1">
              <div>
                <span className="text-[9px] text-slate-400 font-medium block">Analytics</span>
                <p className="text-[9px] text-slate-300 truncate md:line-clamp-1">
                  Load curves & tariffs
                </p>
              </div>
              <button
                onClick={() => onNavigate('energy-monitoring')}
                className="text-[9px] sm:text-[10px] font-semibold text-[#B9E5FF] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Open Energy & Power</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-1.5 rounded bg-[#071629] text-[9px] text-slate-400 flex items-center justify-between">
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

      {/* 4. REMOTE POWER CONTROL SECTION (COMPACT & PIN-PROTECTED) */}
      <section className="bg-[#0B1B33] border border-[#16365B] rounded-lg p-2.5 sm:p-3 space-y-2 shadow-xs">
        <div className="flex items-center justify-between gap-2 border-b border-[#16365B]/70 pb-1.5">
          <div className="flex items-center gap-1.5">
            <Power className="w-3.5 h-3.5 text-[#B9E5FF]" />
            <h3 className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider">
              Remote Electricity Supply Control
            </h3>
          </div>
          
          <div className="flex items-center gap-1.5 shrink-0">
            {/* PIN Requirement Badge */}
            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border flex items-center gap-1 ${
              pinStatus.hasPin
                ? pinStatus.isLocked
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                : 'bg-amber-950/80 text-amber-300 border-amber-800'
            }`}>
              <Lock className="w-2.5 h-2.5" />
              <span>{pinStatus.hasPin ? (pinStatus.isLocked ? 'Locked' : 'PIN Required') : 'No PIN'}</span>
            </span>

            <span className="text-[9px] text-amber-300 bg-amber-950/60 border border-amber-800/80 px-1.5 py-0.2 rounded font-mono hidden xs:inline">
              Demo Sandbox
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
          {/* Status Breakdown (7 cols on desktop) */}
          <div className="md:col-span-7 space-y-1">
            <div className="p-2 rounded bg-[#071629] border border-[#16365B] space-y-0.5">
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

              <div className="text-xs sm:text-sm font-bold text-white">
                {supplyState === 'ON' ? 'Simulated Supply Online' : 'Simulated Supply Disconnected'}
              </div>

              <p className="text-[9px] text-slate-300 leading-tight">
                {supplyState === 'ON'
                  ? 'Contactor simulated in CLOSED state. Software sandbox preview (no physical contactor connected).'
                  : 'Contactor simulated in OPEN state. Software sandbox preview (no physical contactor connected).'}
              </p>
            </div>

            <div className="flex items-center justify-between text-[9px] text-slate-400 px-0.5">
              <span>Hardware Link: <strong className="text-amber-300 font-mono">Simulated (No hardware connected)</strong></span>
              <span>Authorization: <strong className="text-slate-300">4-Digit PIN</strong></span>
            </div>

            {commandFeedback && (
              <div className="p-1 rounded bg-[#071629] border border-[#B9E5FF]/40 text-[9px] text-[#B9E5FF] flex items-center gap-1.5">
                <Info className="w-2.5 h-2.5 shrink-0" />
                <span>{commandFeedback}</span>
              </div>
            )}
          </div>

          {/* Action Button & Safety Reminder (5 cols on desktop) */}
          <div className="md:col-span-5 flex flex-col justify-center space-y-1 p-2 bg-[#071629]/60 border border-[#16365B] rounded-lg">
            <div className="flex items-center justify-between text-[9px] text-slate-300">
              <span className="font-medium">Authorized Switching:</span>
              <span className="font-mono text-slate-400 text-[8px]">PIN Verified</span>
            </div>

            {supplyState === 'ON' ? (
              <button
                onClick={() => initiateSwitch('OFF')}
                disabled={isCommandPending}
                className="w-full min-h-[40px] py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
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
                className="w-full min-h-[40px] py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
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
              Requires 4-digit Security PIN authorization before execution.
            </p>
          </div>
        </div>

        {/* Safety Policy Notice */}
        <div className="p-1.5 rounded bg-[#071629] border border-[#16365B] text-[9px] text-slate-300 flex items-start gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-tight text-slate-400">
            <strong className="text-slate-300">Safety Policy:</strong> Physical electrical protection operates autonomously at the DIN-rail hardware level and remains independent of software subscription status in the future design.
          </p>
        </div>
      </section>

      {/* 5. CUSTOMER WORKSPACES (GENUINE 2-COLUMN MOBILE GRID, 5 COLUMNS ON DESKTOP) */}
      <section className="space-y-1">
        <div className="flex items-center justify-between text-xs px-0.5">
          <div className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#B9E5FF]" />
            <h2 className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
              Customer Workspaces
            </h2>
          </div>
          <span className="text-[9px] text-slate-400 font-mono">
            5 Workspaces
          </span>
        </div>

        {/* Genuine 2-column mobile grid, 3-column tablet, 5-column desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-2">
          {customerSections.map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => onNavigate(sec.id)}
                className="text-left bg-[#0B1B33] border border-[#16365B] rounded-lg p-2 sm:p-2.5 flex flex-col justify-between hover:border-[#B9E5FF]/60 hover:bg-[#0E223F] transition-all cursor-pointer group shadow-xs h-full"
              >
                <div className="space-y-1">
                  <div className="w-5 h-5 rounded-md bg-[#071629] border border-[#16365B] text-[#B9E5FF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-2.5 h-2.5" />
                  </div>
                  <div>
                    <h3 className="text-[11px] sm:text-xs font-bold text-white group-hover:text-[#B9E5FF] transition-colors flex items-center justify-between">
                      <span className="truncate">{sec.title}</span>
                      <ChevronRight className="w-2.5 h-2.5 text-slate-500 group-hover:text-[#B9E5FF] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </h3>
                    <p className="text-[9px] text-slate-400 leading-tight mt-0.5 line-clamp-1">
                      {sec.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-1 mt-1 border-t border-[#16365B]/60 text-[9px] font-semibold text-[#B9E5FF] flex items-center justify-between">
                  <span>Open</span>
                  <ArrowRight className="w-2 h-2 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-1.5 border-t border-[#16365B]/60 text-[8px] sm:text-[9px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-1">
        <p>
          EnerGuru Platform • Building Electricity Intelligence Software Prototype
        </p>
        <p>
          Smarter Energy. Stay Aware. Stay Prepared.
        </p>
      </footer>

      {/* SAFETY CONFIRMATION MODAL (STEP 1 BEFORE PIN VERIFICATION) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-sm sm:max-w-md bg-[#0B1B33] border border-[#16365B] rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3 text-xs">
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

              <div className="p-1.5 rounded bg-[#071629] border border-[#16365B] text-[10px] text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#B9E5FF] shrink-0" />
                <span>You will be prompted for your 4-digit Security PIN to authorize this command.</span>
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
                onClick={handleProceedToPin}
                className={`px-3.5 py-1.5 rounded-lg text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 ${
                  targetAction === 'OFF'
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Enter PIN to Authorize</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROMPT TO CONFIGURE PIN IF NOT SET */}
      {showNeedPinPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-[#0B1B33] border border-[#16365B] rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-[#16365B] pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white">Security PIN Required</h3>
                  <span className="text-[9px] font-mono text-slate-400">Power Switching Protection</span>
                </div>
              </div>
              <button
                onClick={() => setShowNeedPinPrompt(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug">
              To prevent accidental or unauthorized electrical cut-offs, EnerGuru requires a 4-digit Security PIN before sending remote switching commands.
            </p>

            <div className="p-2 rounded bg-[#071629] border border-[#16365B] text-[10px] text-slate-400">
              You can set your Security PIN now in seconds.
            </div>

            <div className="pt-2 border-t border-[#16365B] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNeedPinPrompt(false)}
                className="px-3 py-1.5 rounded-lg bg-[#071629] hover:bg-[#16365B] text-slate-300 text-xs font-semibold border border-[#16365B] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNeedPinPrompt(false);
                  setPinModalMode('setup');
                  setPinModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#B9E5FF] text-[#071629] hover:bg-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Set Security PIN Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECURITY PIN VERIFICATION & MANAGEMENT MODAL */}
      <SecurityPinModal
        isOpen={pinModalOpen}
        mode={pinModalMode}
        userId={userId || ''}
        userEmail={userEmail}
        actionDescription={
          pinModalMode === 'verify'
            ? targetAction === 'OFF'
              ? 'Isolate Main Electricity Supply'
              : 'Restore Main Electricity Supply'
            : undefined
        }
        onSuccess={async () => {
          await refreshPinStatus();
          if (pinModalMode === 'verify') {
            executeSwitchAfterPin();
          }
        }}
        onClose={() => setPinModalOpen(false)}
      />
    </div>
  );
};
