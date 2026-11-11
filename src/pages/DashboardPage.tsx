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
  Loader2,
  Lock,
  Check,
  Smartphone,
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
  const displayName = userProfile?.nickname || userProfile?.full_name || userEmail?.split('@')[0] || 'Customer';
  const initial = (displayName || userEmail || 'C').charAt(0).toUpperCase();

  // Profile completion check
  const isProfileComplete = Boolean(userProfile?.full_name && userProfile.full_name.trim().length > 0);

  // Notification panel toggle state
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Power control state management
  const [supplyState, setSupplyState] = useState<'ON' | 'OFF'>('ON');
  const [hardwareConfirmedState, setHardwareConfirmedState] = useState<'ON' | 'OFF'>('ON');
  const [isCommandPending, setIsCommandPending] = useState(false);
  const [pendingTargetState, setPendingTargetState] = useState<'ON' | 'OFF' | null>(null);
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);

  // Switching confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [targetAction, setTargetAction] = useState<'ON' | 'OFF'>('OFF');

  // Optional metering toggle for devices equipped with CT current clamp sensors
  const [hasCtSensors, setHasCtSensors] = useState(true);

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

  // Handle remote switching initiation with safety confirmation prompt
  const initiateSwitch = (action: 'ON' | 'OFF') => {
    setTargetAction(action);
    setShowConfirmModal(true);
  };

  // Execute confirmed switching command (simulated hardware communication cycle)
  const confirmSwitch = () => {
    setShowConfirmModal(false);
    setIsCommandPending(true);
    setPendingTargetState(targetAction);
    setCommandFeedback('Transmitting secure command to Smart Connector...');

    // Simulate 1.5s hardware cellular handshake & contactor response
    setTimeout(() => {
      setIsCommandPending(false);
      setSupplyState(targetAction);
      setHardwareConfirmedState(targetAction);
      setPendingTargetState(null);
      setCommandFeedback(
        targetAction === 'ON'
          ? 'Hardware confirmed: Incoming electricity supply restored. (Simulated Prototype Action)'
          : 'Hardware confirmed: Incoming electricity supply isolated safely. (Simulated Prototype Action)'
      );

      // Auto-clear feedback after 6 seconds
      setTimeout(() => {
        setCommandFeedback(null);
      }, 6000);
    }, 1500);
  };

  // Dynamic values reflecting supply state
  const isElectricityAvailable = supplyState === 'ON';
  const currentVoltage = isElectricityAvailable ? 232 : 0;
  const currentSource = isElectricityAvailable ? 'Public Grid' : 'No Source Detected';
  const currentProtectionStatus = isElectricityAvailable ? 'Normal' : 'System Standby';

  // Navigation destinations linking directly to dedicated sections
  const customerSections = [
    {
      id: 'energy-management' as AuthPage,
      title: 'Energy & Power',
      desc: 'Detailed consumption trends, voltage history & tariff reports.',
      icon: Activity,
    },
    {
      id: 'devices-operations' as AuthPage,
      title: 'Devices & Operations',
      desc: 'My Smart Connectors, equipment registry & maintenance logs.',
      icon: Wrench,
    },
    {
      id: 'business-enterprise' as AuthPage,
      title: 'Business & Enterprise',
      desc: 'Commercial facility solutions, site consultations & quote requests.',
      icon: Briefcase,
    },
    {
      id: 'community-impact' as AuthPage,
      title: 'Community & Impact',
      desc: 'Solar microgrid electrification projects for rural healthcare & schools.',
      icon: Users,
    },
    {
      id: 'account-plans' as AuthPage,
      title: 'Account & Plans',
      desc: 'My profile, security settings, user permissions & subscription plans.',
      icon: User,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-6 text-white">
      
      {/* 1. COMPACT WELCOME HEADER */}
      <section className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Welcome back, <span className="text-[#B9E5FF]">{displayName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Overview of your building electricity supply and Smart Connector protection.
            </p>
          </div>

          {/* Quick Actions, Notifications & Account Shortcut */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-[#071629] hover:bg-[#16365B] text-slate-300 hover:text-white border border-[#16365B] transition-colors cursor-pointer"
                title="Notifications & Alerts"
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
                      <span className="text-xs font-bold text-white">Recent Alerts</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Simulated Demonstration
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg bg-[#071629] border border-[#16365B] text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold text-white">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Public Grid Restored</span>
                        </span>
                        <span className="text-[10px] text-slate-400">15m ago</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Mains utility reconnected at 232V 50Hz. All phases nominal.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#071629] border border-[#16365B] text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold text-white">
                        <span className="flex items-center gap-1.5 text-sky-300">
                          <Activity className="w-3.5 h-3.5 text-[#B9E5FF]" />
                          <span>Voltage Stability Verified</span>
                        </span>
                        <span className="text-[10px] text-slate-400">2h ago</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Voltage maintained inside the engineer-approved 210V–240V operating band.
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
              title="My Profile"
            >
              <div className="w-5 h-5 rounded-full bg-[#16365B] text-[#B9E5FF] font-bold text-[10px] flex items-center justify-center">
                {initial}
              </div>
              <span className="hidden sm:inline">Profile</span>
            </button>

            {/* Setup Guide Button */}
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

        {/* Profile Completion Alert if Full Name is Missing */}
        {!isProfileComplete && (
          <div className="mt-3 pt-3 border-t border-[#16365B] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-[#071629]/70 px-3 py-2 rounded-lg border border-[#16365B]/80">
            <div className="flex items-center gap-2 text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Incomplete profile: Add your full name for customized engineering consultations.</span>
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

      {/* 2. FOUR PRIMARY INFORMATION CARDS */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            Electricity Status Overview
          </h2>
          <span className="text-[11px] text-slate-400">
            Simulated Prototype Readings
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Electricity Supply Status */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-4 space-y-2 hover:border-[#B9E5FF]/40 transition-colors shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium text-slate-300">1. Electricity Supply</span>
              <span className="text-[10px] text-slate-400">Building Mains</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold tracking-tight ${isElectricityAvailable ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isElectricityAvailable ? 'Electricity Active' : 'Electricity Inactive'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              {isElectricityAvailable ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-slate-300">Building circuits receiving power</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="text-slate-300">Supply isolated or interrupted</span>
                </>
              )}
            </div>
          </div>

          {/* Card 2: Voltage Monitoring */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-4 space-y-2 hover:border-[#B9E5FF]/40 transition-colors shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium text-slate-300">2. Voltage Monitoring</span>
              <span className="text-[10px] text-slate-400">Single Phase</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-white tracking-tight">
                {currentVoltage}
              </span>
              <span className="text-xs font-semibold text-slate-400">V AC</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span className="text-slate-300">
                {isElectricityAvailable ? 'Normal (Nominal band 210–240V)' : '0V (No active line voltage)'}
              </span>
            </div>
          </div>

          {/* Card 3: Detected Power Source */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-4 space-y-2 hover:border-[#B9E5FF]/40 transition-colors shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium text-slate-300">3. Power Source</span>
              <span className="text-[10px] text-slate-400">Auto Detection</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#B9E5FF] tracking-tight">
                {currentSource}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Activity className="w-3.5 h-3.5 text-[#B9E5FF] shrink-0" />
              <span>
                {isElectricityAvailable ? 'Mains Utility Feeder (50.1 Hz)' : 'No active generator or grid feed'}
              </span>
            </div>
          </div>

          {/* Card 4: Electrical Protection Status */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-4 space-y-2 hover:border-[#B9E5FF]/40 transition-colors shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium text-slate-300">4. Electrical Protection</span>
              <span className="text-[10px] text-slate-400">Hardware Interlocks</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-400 tracking-tight">
                {currentProtectionStatus}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Safety interlocks reporting clear</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OPTIONAL ENERGY CONSUMPTION READINGS (SECTION 3.C) */}
      <section className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#16365B] pb-2.5">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#B9E5FF]" />
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Energy Consumption Readings
            </h3>
            <span className="text-[11px] text-slate-400">
              (Supported on devices with Current Transformer clamps)
            </span>
          </div>

          {/* Metering configuration toggle */}
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            <span className="text-slate-400">CT Clamp Sensor:</span>
            <button
              onClick={() => setHasCtSensors(!hasCtSensors)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer border ${
                hasCtSensors
                  ? 'bg-[#16365B] text-[#B9E5FF] border-[#B9E5FF]/30'
                  : 'bg-[#071629] text-slate-400 border-[#16365B]'
              }`}
            >
              {hasCtSensors ? 'Installed & Active' : 'Not Configured'}
            </button>
          </div>
        </div>

        {hasCtSensors ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-[#071629] border border-[#16365B] space-y-1">
              <span className="text-[11px] text-slate-400 block font-medium">Current Demand</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-white">
                  {isElectricityAvailable ? '1.85' : '0.00'}
                </span>
                <span className="text-xs text-slate-400 font-semibold">kW</span>
              </div>
              <span className="text-[11px] text-slate-400 block">
                {isElectricityAvailable ? '8.04 Amps active line draw' : '0.00 Amps'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#071629] border border-[#16365B] space-y-1">
              <span className="text-[11px] text-slate-400 block font-medium">Energy Consumed Today</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-white">14.6</span>
                <span className="text-xs text-slate-400 font-semibold">kWh</span>
              </div>
              <span className="text-[11px] text-slate-400 block">
                Aggregated building consumption
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#071629] border border-[#16365B] flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Historical Analytics</span>
                <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                  Detailed hourly load curves, daily tariff modeling, and monthly utility comparison.
                </p>
              </div>
              <button
                onClick={() => onNavigate('energy-monitoring')}
                className="text-xs font-semibold text-[#B9E5FF] hover:underline flex items-center gap-1 self-start cursor-pointer"
              >
                <span>Open Energy & Power</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-[#071629] border border-[#16365B] text-xs text-slate-400 flex items-center justify-between">
            <span>Energy metering readings are hidden because current transformer (CT) metering clamps are not configured for this installation.</span>
            <button
              onClick={() => setHasCtSensors(true)}
              className="text-[#B9E5FF] hover:underline font-semibold ml-4 shrink-0 cursor-pointer"
            >
              Simulate CT Clamps →
            </button>
          </div>
        )}
      </section>

      {/* 4. POWER CONTROL SECTION (SECTION 3.D — HIGH VISIBILITY) */}
      <section className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 sm:p-6 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#16365B] pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Power className="w-5 h-5 text-[#B9E5FF]" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Remote Electricity Supply Control
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Authorized remote ON and OFF control for building electricity supply.
            </p>
          </div>
          <span className="text-[11px] text-amber-300 bg-amber-950/60 border border-amber-800/80 px-2.5 py-0.5 rounded self-start sm:self-auto font-mono">
            Simulated Demo
          </span>
        </div>

        {/* State Display & Control Actions */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Status Breakdown (7 cols) */}
          <div className="md:col-span-7 space-y-3">
            <div className="p-4 rounded-xl bg-[#071629] border border-[#16365B] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Current Contactor State:</span>
                <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                  supplyState === 'ON' 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {supplyState === 'ON' ? 'SUPPLY ON' : 'SUPPLY ISOLATED (OFF)'}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {supplyState === 'ON' ? 'Electricity Supply Online' : 'Electricity Supply Disconnected'}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {supplyState === 'ON'
                  ? 'Main building breaker contactor is CLOSED. Electricity is actively delivered to the distribution panel.'
                  : 'Main building breaker contactor is OPEN. Incoming electricity has been isolated safely.'}
              </p>
            </div>

            {/* Hardware confirmation status */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Hardware Confirmation: <strong className="text-white">{hardwareConfirmedState === supplyState ? 'Confirmed by Connector' : 'Pending'}</strong></span>
              <span>Physical Control: <strong className="text-slate-300">Manual Override Available</strong></span>
            </div>

            {/* Command Feedback Notice */}
            {commandFeedback && (
              <div className="p-2.5 rounded-lg bg-[#071629] border border-[#B9E5FF]/40 text-xs text-[#B9E5FF] flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>{commandFeedback}</span>
              </div>
            )}
          </div>

          {/* Action Buttons (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-center space-y-3 p-4 bg-[#071629]/60 border border-[#16365B] rounded-xl">
            <span className="text-xs font-medium text-slate-300 block">
              Authorized Remote Switching:
            </span>

            {supplyState === 'ON' ? (
              <button
                onClick={() => initiateSwitch('OFF')}
                disabled={isCommandPending}
                className="w-full py-3 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-rose-900/30 cursor-pointer disabled:opacity-50"
              >
                {isCommandPending && pendingTargetState === 'OFF' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Disconnect Command...</span>
                  </>
                ) : (
                  <>
                    <Power className="w-4 h-4" />
                    <span>Turn Off Electricity Supply</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => initiateSwitch('ON')}
                disabled={isCommandPending}
                className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-900/30 cursor-pointer disabled:opacity-50"
              >
                {isCommandPending && pendingTargetState === 'ON' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Restore Command...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Restore Electricity Supply</span>
                  </>
                )}
              </button>
            )}

            <p className="text-[11px] text-slate-400 leading-tight">
              Requires confirmation before sensitive switching. Disconnection safely isolates all circuits.
            </p>
          </div>
        </div>

        {/* Critical Safety Notice (Mandatory by Requirement 3.D & 6.B) */}
        <div className="p-3 rounded-lg bg-[#071629] border border-[#16365B] text-xs text-slate-300 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-white block">Critical Safety Interlock Policy</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Essential electrical protection (overvoltage, undervoltage, and surge isolation) is hardwired into the hardware safety loop and is <strong>never disabled</strong> due to software subscription status, renewal intervals, or account inactivity.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SMART CONNECTOR STATUS & IMPORTANT ALERTS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Device Status (6 cols) */}
        <div className="lg:col-span-6 bg-[#0B1B33] border border-[#16365B] rounded-xl p-4 sm:p-5 space-y-3 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#16365B] pb-2.5">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#B9E5FF]" />
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  Smart Connector Status
                </h3>
              </div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Connected</span>
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#071629] border border-[#16365B]">
                <span className="text-slate-400">Device Name:</span>
                <span className="font-semibold text-white">Main DB Connector (Unit #1)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#071629] border border-[#16365B]">
                <span className="text-slate-400">Connection Bearer:</span>
                <span className="font-semibold text-[#B9E5FF]">Autonomous Cellular IoT (eSIM)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#071629] border border-[#16365B]">
                <span className="text-slate-400">Last Successful Sync:</span>
                <span className="font-mono text-slate-300">2 minutes ago</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#071629] border border-[#16365B]">
                <span className="text-slate-400">Active Warnings:</span>
                <span className="text-emerald-400 font-semibold">None (Operating Normally)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#16365B] flex items-center justify-between text-xs">
            <span className="text-slate-400">Hardware DIN-rail unit</span>
            <button
              onClick={() => onNavigate('devices-operations')}
              className="text-[#B9E5FF] hover:underline font-semibold cursor-pointer"
            >
              Manage in Devices & Operations →
            </button>
          </div>
        </div>

        {/* Important Customer Alerts (6 cols) */}
        <div className="lg:col-span-6 bg-[#0B1B33] border border-[#16365B] rounded-xl p-4 sm:p-5 space-y-3 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#16365B] pb-2.5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#B9E5FF]" />
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  Important Alerts & Events
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">Recent Events</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#071629] border border-[#16365B] space-y-0.5">
                <div className="flex items-center justify-between font-semibold text-white">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Public Grid Supply Restored</span>
                  </span>
                  <span className="text-[10px] text-slate-400">15m ago</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Mains supply back online at 232V 50Hz. All safety limits verified.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#071629] border border-[#16365B] space-y-0.5">
                <div className="flex items-center justify-between font-semibold text-white">
                  <span className="flex items-center gap-1.5 text-sky-300">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Voltage Stability Check</span>
                  </span>
                  <span className="text-[10px] text-slate-400">2h ago</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Line voltage verified inside the approved 210V–240V operating band.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#071629] border border-[#16365B] space-y-0.5">
                <div className="flex items-center justify-between font-semibold text-white">
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Generator Maintenance Notice</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Yesterday</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  45 run-hours logged in Equipment Registry. Routine oil service due.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#16365B] flex items-center justify-between text-xs">
            <span className="text-slate-400">Full audit log available</span>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-[#B9E5FF] hover:underline font-semibold cursor-pointer"
            >
              View All Alerts in Alerts Hub →
            </button>
          </div>
        </div>
      </section>

      {/* 6. MAIN CUSTOMER NAVIGATION DIRECTORY (5 WORKSPACES) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#16365B] pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#B9E5FF]" />
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Explore Customer Workspaces
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">
            5 Dedicated Sections
          </span>
        </div>

        {/* Responsive Grid of the 5 Main Customer Areas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {customerSections.map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => onNavigate(sec.id)}
                className="text-left bg-[#0B1B33] border border-[#16365B] rounded-xl p-3.5 flex flex-col justify-between hover:border-[#B9E5FF]/60 hover:bg-[#0E223F] transition-all cursor-pointer group shadow-sm"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#071629] border border-[#16365B] text-[#B9E5FF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#B9E5FF] transition-colors flex items-center justify-between">
                      <span>{sec.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#B9E5FF] group-hover:translate-x-0.5 transition-all" />
                    </h3>
                    <p className="text-[11px] text-slate-300 leading-snug mt-1 line-clamp-2">
                      {sec.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-[#16365B]/60 text-[11px] font-semibold text-[#B9E5FF] flex items-center justify-between">
                  <span>Open Section</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 7. FOOTER ARCHITECTURAL NOTE */}
      <footer className="pt-3 border-t border-[#16365B] text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          EnerGuru Platform • Building Electricity Intelligence & Smart Connector Hardware Innovation
        </p>
        <p className="text-[10px] text-slate-400">
          Smarter Energy. Stay Aware. Stay Prepared.
        </p>
      </footer>

      {/* POWER CONTROL CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-[#0B1B33] border border-[#16365B] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#16365B] pb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  targetAction === 'OFF' ? 'bg-rose-950 text-rose-400' : 'bg-emerald-950 text-emerald-400'
                }`}>
                  <Power className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {targetAction === 'OFF' ? 'Confirm Power Disconnection' : 'Confirm Power Restoration'}
                </h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              {targetAction === 'OFF' ? (
                <>
                  <p className="leading-relaxed">
                    You are requesting to <strong>isolate the main incoming electricity supply</strong> for this building via the Smart Connector.
                  </p>
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/80 text-rose-200 space-y-1">
                    <strong className="block text-rose-300">Safety Precaution:</strong>
                    <span>
                      This command will cut power to all lighting, sockets, and connected appliances. Verify that critical medical devices or essential equipment are not active.
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <p className="leading-relaxed">
                    You are requesting to <strong>reconnect the incoming electricity supply</strong> to the building distribution board.
                  </p>
                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/80 text-emerald-200 space-y-1">
                    <strong className="block text-emerald-300">Safety Precaution:</strong>
                    <span>
                      Verify that maintenance work on building circuits is complete and appliances are safe to receive power.
                    </span>
                  </div>
                </>
              )}

              <p className="text-[11px] text-slate-400">
                Note: This is a software prototype simulation. Real hardware will verify cryptographic device authorization before mechanical contactor actuation.
              </p>
            </div>

            <div className="pt-3 border-t border-[#16365B] flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg bg-[#071629] hover:bg-[#16365B] text-slate-300 text-xs font-semibold border border-[#16365B] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmSwitch}
                className={`px-4 py-2 rounded-lg text-white text-xs font-bold shadow-md cursor-pointer ${
                  targetAction === 'OFF'
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {targetAction === 'OFF' ? 'Confirm Disconnection' : 'Confirm Restoration'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
