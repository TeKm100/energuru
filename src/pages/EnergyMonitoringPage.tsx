import React, { useState, useEffect } from 'react';
import { AuthPage } from '../types';
import { 
  Activity, 
  ArrowLeft, 
  Zap, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  Layers, 
  Cpu, 
  Radio, 
  Play, 
  Pause,
  Download,
  Info,
  DollarSign,
  Calculator
} from 'lucide-react';

interface EnergyMonitoringPageProps {
  onNavigate: (page: AuthPage) => void;
}

type Timeframe = 'daily' | 'weekly' | 'monthly';
type PhaseView = 'single' | 'three';

export const EnergyMonitoringPage: React.FC<EnergyMonitoringPageProps> = ({ onNavigate }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('daily');
  const [phaseView, setPhaseView] = useState<PhaseView>('single');
  const [isSimulatingLive, setIsSimulatingLive] = useState(true);
  const [lastHeartbeat, setLastHeartbeat] = useState('Just now (4s demo cycle)');
  const [hoveredPoint, setHoveredPoint] = useState<{ label: string; value: number } | null>(null);

  // User-configurable illustrative tariff rate (default: NERC Band A benchmark ₦225/kWh)
  const [tariffRate, setTariffRate] = useState<number>(225);
  const [customTariffInput, setCustomTariffInput] = useState<string>('225');
  const [isCustomTariff, setIsCustomTariff] = useState(false);

  // Simulated live fluctuating base telemetry (Single Phase L1 reference)
  const [liveReadings, setLiveReadings] = useState({
    voltage: 231.8,
    current: 8.12,
    power: 1.77,
    energyToday: 14.72,
    frequency: 50.1,
    powerFactor: 0.94,
  });

  // Pulse simulation every 4 seconds when active (local client-side demo animation)
  useEffect(() => {
    if (!isSimulatingLive) return;

    const interval = setInterval(() => {
      setLiveReadings((prev) => {
        const vDelta = (Math.random() - 0.48) * 1.5;
        const iDelta = (Math.random() - 0.5) * 0.2;
        const newV = Math.min(238, Math.max(222, Number((prev.voltage + vDelta).toFixed(1))));
        const newI = Math.min(12.5, Math.max(5.0, Number((prev.current + iDelta).toFixed(2))));
        const newP = Number(((newV * newI * 0.94) / 1000).toFixed(2));
        const newKwh = Number((prev.energyToday + 0.002).toFixed(3));
        return {
          ...prev,
          voltage: newV,
          current: newI,
          power: newP,
          energyToday: newKwh,
        };
      });
      setLastHeartbeat('Just now (4s demo cycle)');
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulatingLive]);

  // Phase modeling calculations
  // Single phase: Uses base L1 readings
  // Three phase: Mathematically modeled consistent simulated values for L1, L2, and L3
  const l1Voltage = liveReadings.voltage;
  const l1Current = liveReadings.current;
  const l1Power = Number(((l1Voltage * l1Current * 0.94) / 1000).toFixed(2));

  const l2Voltage = Number((liveReadings.voltage - 2.4).toFixed(1));
  const l2Current = Number((liveReadings.current * 0.94).toFixed(2));
  const l2Power = Number(((l2Voltage * l2Current * 0.94) / 1000).toFixed(2));

  const l3Voltage = Number((liveReadings.voltage + 1.4).toFixed(1));
  const l3Current = Number((liveReadings.current * 1.03).toFixed(2));
  const l3Power = Number(((l3Voltage * l3Current * 0.94) / 1000).toFixed(2));

  // Displayed metrics based on phaseView
  const displayVoltage = phaseView === 'single' ? l1Voltage : Number(((l1Voltage + l2Voltage + l3Voltage) / 3).toFixed(1));
  const displayCurrent = phaseView === 'single' ? l1Current : Number((l1Current + l2Current + l3Current).toFixed(2));
  const displayPower = phaseView === 'single' ? l1Power : Number((l1Power + l2Power + l3Power).toFixed(2));
  const displayEnergyToday = phaseView === 'single' ? liveReadings.energyToday : Number((liveReadings.energyToday * 3).toFixed(2));

  // Hourly consumption data for Daily (24h) - baseline kWh
  const hourlyData = [
    { label: '00:00', kwh: 0.42 },
    { label: '02:00', kwh: 0.38 },
    { label: '04:00', kwh: 0.35 },
    { label: '06:00', kwh: 0.72 },
    { label: '08:00', kwh: 1.15 },
    { label: '10:00', kwh: 1.48 },
    { label: '12:00', kwh: 1.82 },
    { label: '14:00', kwh: 1.64 },
    { label: '16:00', kwh: 1.45 },
    { label: '18:00', kwh: 2.10 },
    { label: '20:00', kwh: 2.45 },
    { label: '22:00', kwh: 1.20 },
  ];

  // Daily consumption data for Weekly (7 days)
  const weeklyData = [
    { label: 'Mon', kwh: 14.2 },
    { label: 'Tue', kwh: 15.8 },
    { label: 'Wed', kwh: 13.9 },
    { label: 'Thu', kwh: 16.4 },
    { label: 'Fri', kwh: 17.1 },
    { label: 'Sat', kwh: 19.3 },
    { label: 'Sun', kwh: 18.0 },
  ];

  // Monthly consumption data (30 days summarized in 4 weeks)
  const monthlyData = [
    { label: 'Week 1', kwh: 104.5 },
    { label: 'Week 2', kwh: 112.8 },
    { label: 'Week 3', kwh: 98.4 },
    { label: 'Week 4', kwh: 108.2 },
  ];

  const currentChartData = 
    timeframe === 'daily' ? hourlyData : 
    timeframe === 'weekly' ? weeklyData : 
    monthlyData;

  const maxVal = Math.max(...currentChartData.map((d) => d.kwh), 1);

  // Simulated voltage curve points across 12 periods (Illustrative Sample Trend)
  const voltageTrend = [228, 229, 231, 230, 234, 232, 227, 229, 232, 235, 231, 233];

  // Simulated power quality / interruption events (Illustrative Sample Data)
  const powerEvents = [
    {
      id: 'evt-1',
      type: 'Restoration',
      title: 'Sample Event: Grid Power Synchronized',
      time: 'Today, 06:14 AM',
      duration: '42 min outage restored',
      status: 'Normal',
      impact: 'Illustrative simulation: Feeder 11kV back online at 230V 50Hz',
    },
    {
      id: 'evt-2',
      type: 'Outage',
      title: 'Sample Event: Utility Grid Interruption',
      time: 'Today, 05:32 AM',
      duration: '42 mins duration',
      status: 'Resolved',
      impact: 'Illustrative simulation: Zero incoming mains voltage detected',
    },
    {
      id: 'evt-3',
      type: 'Voltage Fluctuated',
      title: 'Sample Event: Transient Voltage Sag (198V)',
      time: 'Yesterday, 08:45 PM',
      duration: '3.2 seconds',
      status: 'Recovered',
      impact: 'Illustrative simulation: Temporary heavy industrial load on local transformer',
    },
    {
      id: 'evt-4',
      type: 'Restoration',
      title: 'Sample Event: Grid Reconnected Post-Loadshedding',
      time: 'Yesterday, 02:10 PM',
      duration: '1 hr 15 mins outage',
      status: 'Normal',
      impact: 'Illustrative simulation: Phase balance verified within 2.1% tolerance',
    },
  ];

  const handleSelectTariff = (rate: number, isCustom: boolean = false) => {
    setIsCustomTariff(isCustom);
    setTariffRate(rate);
    setCustomTariffInput(rate.toString());
  };

  const handleCustomTariffChange = (val: string) => {
    setCustomTariffInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      setTariffRate(num);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-white">
      {/* 1. Page Header & Simulated Telemetry Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#16365B] pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-[#B9E5FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <span>/</span>
            <button
              onClick={() => onNavigate('energy-management')}
              className="text-[#B9E5FF] hover:underline cursor-pointer"
            >
              Energy Management
            </button>
            <span>/</span>
            <span className="text-slate-300">Energy Monitoring & Analytics</span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="w-10 h-10 rounded-xl bg-[#16365B] border border-[#B9E5FF]/30 text-[#B9E5FF] flex items-center justify-center shrink-0 shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Energy Monitoring & Analytics
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Building-level telemetry workspace designed for future integration with the EnerGuru Smart Connector.
          </p>
        </div>

        {/* Simulation Controls & Explicit Badge */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsSimulatingLive(!isSimulatingLive)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isSimulatingLive
                ? 'bg-[#16365B] text-[#B9E5FF] border-[#B9E5FF]/40 hover:bg-[#16365B]/80'
                : 'bg-[#0B1B33] text-slate-400 border-[#16365B] hover:text-white'
            }`}
          >
            {isSimulatingLive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Telemetry Simulation</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Telemetry Simulation</span>
              </>
            )}
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-800 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>SIMULATED TELEMETRY (DEMO)</span>
          </span>
        </div>
      </div>

      {/* Hardware Status & Simulation Notice (Mandatory Architectural Transparency) */}
      <div className="bg-[#0B1B33] border-l-4 border-amber-400 border-y border-r border-[#16365B] rounded-r-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Hardware Status & Simulation Notice
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hardware development in progress — no physical unit commissioned. The 4-second polling animation is a local client-side demonstration simulation to validate the telemetry interface and analytics algorithms. No real physical sensor is transmitting data.
            </p>
          </div>
        </div>
        <div className="text-[11px] font-mono text-slate-400 shrink-0 sm:text-right">
          Demo Polling: <span className="text-[#B9E5FF]">{lastHeartbeat}</span>
        </div>
      </div>

      {/* SECTION A: MONITORING OVERVIEW (TELEMETRY READOUT CARDS) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#B9E5FF]" />
              <span>Simulated Telemetry Readouts</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              {phaseView === 'single'
                ? 'Single Phase 230V L1-N baseline model.'
                : 'Three Phase 400V/230V modeled distribution across phases L1, L2, and L3.'}
            </p>
          </div>

          {/* Phase View Switcher */}
          <div className="flex items-center gap-1 bg-[#0B1B33] p-1 rounded-lg border border-[#16365B] text-xs self-start sm:self-auto">
            <button
              onClick={() => setPhaseView('single')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                phaseView === 'single'
                  ? 'bg-[#16365B] text-[#B9E5FF] font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Single Phase
            </button>
            <button
              onClick={() => setPhaseView('three')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                phaseView === 'three'
                  ? 'bg-[#16365B] text-[#B9E5FF] font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Three Phase
            </button>
          </div>
        </div>

        {/* Phase Simulation Disclaimer */}
        {phaseView === 'three' && (
          <div className="p-2.5 rounded-lg bg-[#071629] border border-[#16365B] text-[11px] text-slate-300 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#B9E5FF] shrink-0" />
            <span>
              <strong>Three-Phase Model Note:</strong> Actual physical phase measurements are not available from hardware. The values below are mathematically modeled simulated distributions across L1, L2, and L3 for UI validation.
            </span>
          </div>
        )}

        {/* Telemetry Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Voltage */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-2 hover:border-[#B9E5FF]/50 transition-colors shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">
                {phaseView === 'single' ? 'Incoming Voltage' : 'Line-to-Neutral Voltage (Avg)'}
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#16365B] text-[#B9E5FF]">
                Simulated Telemetry
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {displayVoltage}
              </span>
              <span className="text-sm font-semibold text-slate-400">V AC</span>
            </div>

            {/* Three Phase Individual Breakdown */}
            {phaseView === 'three' ? (
              <div className="pt-2 border-t border-[#16365B]/60 text-[11px] font-mono space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span className="text-amber-300 font-semibold">L1:</span>
                  <span>{l1Voltage} V</span>
                  <span className="text-sky-300 font-semibold ml-2">L2:</span>
                  <span>{l2Voltage} V</span>
                  <span className="text-emerald-300 font-semibold ml-2">L3:</span>
                  <span>{l3Voltage} V</span>
                </div>
                <div className="text-[10px] text-slate-400 pt-0.5">
                  Line-to-Line: ~{Math.round(displayVoltage * 1.732)} V (Nominal 400V)
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#16365B]/60">
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Nominal Band (210–240V)</span>
                </span>
                <span className="text-slate-400 font-mono">{liveReadings.frequency} Hz</span>
              </div>
            )}
          </div>

          {/* Card 2: Current */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-2 hover:border-[#B9E5FF]/50 transition-colors shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">
                {phaseView === 'single' ? 'Current Draw' : 'Total 3-Phase Current'}
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#16365B] text-[#B9E5FF]">
                {phaseView === 'single' ? 'Phase L1' : 'Sum of L1-L3'}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {displayCurrent}
              </span>
              <span className="text-sm font-semibold text-slate-400">Amps</span>
            </div>

            {/* Three Phase Individual Breakdown */}
            {phaseView === 'three' ? (
              <div className="pt-2 border-t border-[#16365B]/60 text-[11px] font-mono space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span className="text-amber-300 font-semibold">L1:</span>
                  <span>{l1Current} A</span>
                  <span className="text-sky-300 font-semibold ml-2">L2:</span>
                  <span>{l2Current} A</span>
                  <span className="text-emerald-300 font-semibold ml-2">L3:</span>
                  <span>{l3Current} A</span>
                </div>
                <div className="text-[10px] text-slate-400 pt-0.5">
                  Avg Line Draw: {(displayCurrent / 3).toFixed(2)} A (32A rated breaker)
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#16365B]/60">
                <span className="text-slate-300">Max Breaker: 32A</span>
                <span className="text-slate-400 font-mono">
                  {((displayCurrent / 32) * 100).toFixed(1)}% Load
                </span>
              </div>
            )}
          </div>

          {/* Card 3: Active Power */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-2 hover:border-[#B9E5FF]/50 transition-colors shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">
                {phaseView === 'single' ? 'Active Power Demand' : 'Total 3-Phase Active Power'}
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#16365B] text-[#B9E5FF]">
                Simulated Telemetry
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#B9E5FF] tracking-tight">
                {displayPower}
              </span>
              <span className="text-sm font-semibold text-slate-400">kW</span>
            </div>

            {/* Three Phase Individual Breakdown */}
            {phaseView === 'three' ? (
              <div className="pt-2 border-t border-[#16365B]/60 text-[11px] font-mono space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span className="text-amber-300 font-semibold">L1:</span>
                  <span>{l1Power} kW</span>
                  <span className="text-sky-300 font-semibold ml-2">L2:</span>
                  <span>{l2Power} kW</span>
                  <span className="text-emerald-300 font-semibold ml-2">L3:</span>
                  <span>{l3Power} kW</span>
                </div>
                <div className="text-[10px] text-slate-400 pt-0.5">
                  Modeled PF: {liveReadings.powerFactor} (Balanced load)
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#16365B]/60">
                <span className="text-slate-300">Power Factor:</span>
                <span className="text-emerald-400 font-mono">{liveReadings.powerFactor} PF</span>
              </div>
            )}
          </div>

          {/* Card 4: Energy Today */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-2 hover:border-[#B9E5FF]/50 transition-colors shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Today's Consumption</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#16365B] text-[#B9E5FF]">
                Illustrative
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {displayEnergyToday}
              </span>
              <span className="text-sm font-semibold text-slate-400">kWh</span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#16365B]/60">
              <span className="text-slate-300">Model @ ₦{tariffRate}/kWh:</span>
              <span className="text-[#B9E5FF] font-mono">
                ₦{(displayEnergyToday * tariffRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION B: ENERGY CONSUMPTION ANALYTICS (TRENDS & TARIFF CALCULATIONS) */}
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 sm:p-6 space-y-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#16365B] pb-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#B9E5FF]" />
              <span>Energy Consumption Trends (Illustrative Sample Data)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Simulated consumption patterns and dynamic tariff cost model.
            </p>
          </div>

          {/* Controls: Timeframe & Illustrative Tariff Selector */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Tariff Selector */}
            <div className="flex items-center gap-1.5 bg-[#071629] px-2.5 py-1.5 rounded-lg border border-[#16365B] text-xs">
              <Calculator className="w-3.5 h-3.5 text-[#B9E5FF] shrink-0" />
              <span className="text-slate-400 font-medium">Tariff:</span>
              <button
                onClick={() => handleSelectTariff(225, false)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  tariffRate === 225 && !isCustomTariff
                    ? 'bg-[#16365B] text-[#B9E5FF] font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="NERC Band A ₦225/kWh benchmark"
              >
                Band A (₦225)
              </button>
              <button
                onClick={() => handleSelectTariff(68, false)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  tariffRate === 68 && !isCustomTariff
                    ? 'bg-[#16365B] text-[#B9E5FF] font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="NERC Band B ₦68/kWh benchmark"
              >
                Band B (₦68)
              </button>
              
              <div className="flex items-center gap-1 pl-1 border-l border-[#16365B]">
                <span className="text-slate-500 text-[11px]">₦</span>
                <input
                  type="number"
                  min="0"
                  value={customTariffInput}
                  onChange={(e) => {
                    setIsCustomTariff(true);
                    handleCustomTariffChange(e.target.value);
                  }}
                  className="w-14 bg-[#0B1B33] text-white border border-[#16365B] rounded px-1.5 py-0.5 text-[11px] font-mono focus:outline-none focus:border-[#B9E5FF]"
                  placeholder="Rate"
                  title="Custom ₦/kWh rate input"
                />
                <span className="text-[10px] text-slate-400">/kWh</span>
              </div>
            </div>

            {/* Timeframe Selection Tabs */}
            <div className="flex items-center gap-1 bg-[#071629] p-1 rounded-lg border border-[#16365B] text-xs">
              <button
                onClick={() => setTimeframe('daily')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  timeframe === 'daily'
                    ? 'bg-[#16365B] text-[#B9E5FF] font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Daily (24h)
              </button>
              <button
                onClick={() => setTimeframe('weekly')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  timeframe === 'weekly'
                    ? 'bg-[#16365B] text-[#B9E5FF] font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Weekly (7d)
              </button>
              <button
                onClick={() => setTimeframe('monthly')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  timeframe === 'monthly'
                    ? 'bg-[#16365B] text-[#B9E5FF] font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        {/* Tariff Model Transparency Notice */}
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#B9E5FF] shrink-0" />
          <span>
            <strong>Tariff Calculation Disclaimer:</strong> Illustrative calculation model only. This is not an official utility bill. Utility tariffs vary across DisCos (e.g., EKEDC, IKEDC, AEDC) and service bands.
          </span>
        </div>

        {/* Interactive Consumption Chart */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              {timeframe === 'daily' ? 'Hourly Load (kWh) — Illustrative' : 
               timeframe === 'weekly' ? 'Daily Energy Total (kWh) — Illustrative' : 
               'Weekly Energy Totals (kWh) — Illustrative'}
            </span>
            {hoveredPoint ? (
              <span className="font-mono text-[#B9E5FF]">
                {hoveredPoint.label}: <strong className="text-white">{hoveredPoint.value} kWh</strong> (≈ ₦{Math.round(hoveredPoint.value * tariffRate).toLocaleString()} @ ₦{tariffRate}/kWh)
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">Hover over bars for simulated kWh & modeled utility cost</span>
            )}
          </div>

          {/* Visual CSS Bar Chart */}
          <div className="h-48 flex items-end gap-2 pt-6 pb-2 border-b border-[#16365B]/80 px-2 bg-[#071629]/50 rounded-lg">
            {currentChartData.map((d, idx) => {
              const heightPct = Math.max(12, Math.round((d.kwh / maxVal) * 100));
              const isPeak = d.kwh > maxVal * 0.85;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  onMouseEnter={() => setHoveredPoint({ label: d.label, value: d.kwh })}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[36px] rounded-t transition-all duration-300 group-hover:brightness-125 ${
                      isPeak
                        ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-amber-500/20'
                        : 'bg-gradient-to-t from-[#16365B] to-[#B9E5FF]'
                    }`}
                  />
                  <span className="text-[10px] font-mono text-slate-400 mt-2 truncate w-full text-center">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Illustrative Scenarios & Comparative Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-lg bg-[#071629] border border-[#16365B] space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">
              Illustrative Sample Scenario: Peak Interval
            </span>
            <span className="text-sm font-bold text-amber-400">19:00 – 21:30 (Evening Peak)</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Modeled residential profile simulating evening cooking, water heating, and cooling loads.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#071629] border border-[#16365B] space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">
              Illustrative Sample Scenario: Efficiency
            </span>
            <span className="text-sm font-bold text-emerald-400">-6.4% Modeled Demand Reduction</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Illustrative benchmark showing potential savings from daytime solar pass-through; not measured from physical sensors.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#071629] border border-[#16365B] space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">
              Modeled Cost Projection (@ ₦{tariffRate}/kWh)
            </span>
            <span className="text-sm font-bold text-[#B9E5FF]">
              ₦{(displayEnergyToday * tariffRate).toLocaleString(undefined, { maximumFractionDigits: 0 })} Projected
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Dynamically calculated using the selected ₦{tariffRate}/kWh illustrative tariff rate.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION C: POWER QUALITY & SUPPLY INTERRUPTION LOG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Voltage Stability Trend (5 cols) */}
        <div className="lg:col-span-5 bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#B9E5FF]" />
                <span>Voltage Quality Stability (Sample Data)</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Modeled Safe Band
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Illustrative incoming line voltage curve across 12 demonstration sampling blocks.
            </p>
          </div>

          {/* Sparkline Curve */}
          <div className="p-4 bg-[#071629] border border-[#16365B] rounded-lg space-y-3">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-slate-400">Max: <strong className="text-white">235V</strong></span>
              <span className="text-slate-400">Average: <strong className="text-[#B9E5FF]">231V</strong></span>
              <span className="text-slate-400">Min: <strong className="text-white">227V</strong></span>
            </div>

            <div className="h-16 flex items-end gap-1.5 pt-2">
              {voltageTrend.map((v, i) => {
                const height = ((v - 220) / 20) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div
                      style={{ height: `${height}%` }}
                      className="w-full bg-[#B9E5FF] rounded-t-sm hover:bg-white transition-colors"
                      title={`Simulated ${v}V`}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-[#16365B]/60">
              <span>-6h ago</span>
              <span>-3h ago</span>
              <span>Simulated Now</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#071629] border border-[#16365B] text-xs text-slate-300 space-y-1">
            <span className="font-semibold text-white block">Surge & Brownout Protection Specification</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Demonstration log: No destructive surges (&gt;260V) or deep brownouts (&lt;175V) generated in this simulated window.
            </p>
          </div>
        </div>

        {/* Supply Interruption & Event Log (7 cols) */}
        <div className="lg:col-span-7 bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#16365B] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B9E5FF]" />
                <span>Power Outage & Quality Events (Illustrative Sample Log)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Sample audit events demonstrating outage timestamps and restoration logs.
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-[#071629] px-2 py-0.5 rounded border border-[#16365B]">
              Simulated Audit
            </span>
          </div>

          <div className="space-y-2.5">
            {powerEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-lg bg-[#071629] border border-[#16365B] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:border-[#B9E5FF]/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${
                      evt.type === 'Restoration' 
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                        : evt.type === 'Outage'
                        ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                        : 'bg-amber-950/80 text-amber-300 border-amber-800'
                    }`}>
                      {evt.type}
                    </span>
                    <span className="text-xs font-bold text-white">{evt.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {evt.impact}
                  </p>
                </div>

                <div className="text-right shrink-0 sm:text-right">
                  <span className="text-[11px] font-mono text-slate-300 block">{evt.time}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{evt.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION D: DEVICE & CELLULAR TELEMETRY STATUS */}
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#16365B] pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#B9E5FF]" />
            <h3 className="text-sm font-bold text-white">Smart Connector Telemetry Architecture</h3>
          </div>
          <span className="text-[11px] font-mono text-[#B9E5FF] bg-[#16365B] px-2.5 py-0.5 rounded border border-[#B9E5FF]/30">
            Phase 1 Firmware Sandbox
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-[#071629] border border-[#16365B] rounded-lg space-y-1">
            <span className="text-slate-400 block text-[11px]">Hardware Unit Status:</span>
            <span className="text-amber-400 font-semibold block">Under Engineering R&D</span>
            <p className="text-[10px] text-slate-500">No physical unit commissioned</p>
          </div>

          <div className="p-3 bg-[#071629] border border-[#16365B] rounded-lg space-y-1">
            <span className="text-slate-400 block text-[11px]">Connection Bearer:</span>
            <span className="text-white font-semibold block">Autonomous Cellular IoT</span>
            <p className="text-[10px] text-slate-500">4G/2G eSIM telemetry target</p>
          </div>

          <div className="p-3 bg-[#071629] border border-[#16365B] rounded-lg space-y-1">
            <span className="text-slate-400 block text-[11px]">Demonstration Rate:</span>
            <span className="text-white font-semibold block">4-Second Polling Cycle</span>
            <p className="text-[10px] text-slate-500">Client-side demo simulation</p>
          </div>

          <div className="p-3 bg-[#071629] border border-[#16365B] rounded-lg space-y-1">
            <span className="text-slate-400 block text-[11px]">Physical Disconnect:</span>
            <span className="text-slate-300 font-semibold block">Hardware Safety Lockout</span>
            <p className="text-[10px] text-slate-500">Requires certified physical unit</p>
          </div>
        </div>
      </div>
    </div>
  );
};
