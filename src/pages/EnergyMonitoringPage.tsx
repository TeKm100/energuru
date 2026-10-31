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
  Info
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
  const [lastHeartbeat, setLastHeartbeat] = useState('Just now');
  const [hoveredPoint, setHoveredPoint] = useState<{ label: string; value: number; cost?: number } | null>(null);

  // Simulated live fluctuating telemetry
  const [liveReadings, setLiveReadings] = useState({
    voltage: 231.8,
    current: 8.12,
    power: 1.88,
    energyToday: 14.72,
    frequency: 50.1,
    powerFactor: 0.94,
    status: 'Grid Utility Mains (Online)',
  });

  // Pulse simulation every 4 seconds when active
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
      setLastHeartbeat('Just now (5s poll)');
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulatingLive]);

  // Hourly consumption data for Daily (24h)
  const hourlyData = [
    { label: '00:00', kwh: 0.42, cost: 95 },
    { label: '02:00', kwh: 0.38, cost: 85 },
    { label: '04:00', kwh: 0.35, cost: 79 },
    { label: '06:00', kwh: 0.72, cost: 162 },
    { label: '08:00', kwh: 1.15, cost: 259 },
    { label: '10:00', kwh: 1.48, cost: 333 },
    { label: '12:00', kwh: 1.82, cost: 410 },
    { label: '14:00', kwh: 1.64, cost: 369 },
    { label: '16:00', kwh: 1.45, cost: 326 },
    { label: '18:00', kwh: 2.10, cost: 473 },
    { label: '20:00', kwh: 2.45, cost: 551 },
    { label: '22:00', kwh: 1.20, cost: 270 },
  ];

  // Daily consumption data for Weekly (7 days)
  const weeklyData = [
    { label: 'Mon', kwh: 14.2, cost: 3195 },
    { label: 'Tue', kwh: 15.8, cost: 3555 },
    { label: 'Wed', kwh: 13.9, cost: 3127 },
    { label: 'Thu', kwh: 16.4, cost: 3690 },
    { label: 'Fri', kwh: 17.1, cost: 3848 },
    { label: 'Sat', kwh: 19.3, cost: 4342 },
    { label: 'Sun', kwh: 18.0, cost: 4050 },
  ];

  // Monthly consumption data (30 days summarized in 4 weeks)
  const monthlyData = [
    { label: 'Week 1', kwh: 104.5, cost: 23512 },
    { label: 'Week 2', kwh: 112.8, cost: 25380 },
    { label: 'Week 3', kwh: 98.4, cost: 22140 },
    { label: 'Week 4', kwh: 108.2, cost: 24345 },
  ];

  const currentChartData = 
    timeframe === 'daily' ? hourlyData : 
    timeframe === 'weekly' ? weeklyData : 
    monthlyData;

  const maxVal = Math.max(...currentChartData.map((d) => d.kwh), 1);

  // Simulated voltage curve points across 12 periods
  const voltageTrend = [228, 229, 231, 230, 234, 232, 227, 229, 232, 235, 231, 233];

  // Simulated power quality / interruption events
  const powerEvents = [
    {
      id: 'evt-1',
      type: 'Restoration',
      title: 'Grid Power Synchronized',
      time: 'Today, 06:14 AM',
      duration: '42 min outage restored',
      status: 'Normal',
      impact: 'Feeder 11kV back online at 230V 50Hz',
    },
    {
      id: 'evt-2',
      type: 'Outage',
      title: 'Utility Grid Interruption',
      time: 'Today, 05:32 AM',
      duration: '42 mins duration',
      status: 'Resolved',
      impact: 'Zero incoming mains voltage detected',
    },
    {
      id: 'evt-3',
      type: 'Voltage Fluctuated',
      title: 'Transient Voltage Sag (198V)',
      time: 'Yesterday, 08:45 PM',
      duration: '3.2 seconds',
      status: 'Recovered',
      impact: 'Temporary heavy industrial load on local transformer',
    },
    {
      id: 'evt-4',
      type: 'Restoration',
      title: 'Grid Reconnected Post-Loadshedding',
      time: 'Yesterday, 02:10 PM',
      duration: '1 hr 15 mins outage',
      status: 'Normal',
      impact: 'Phase balance verified within 2.1% tolerance',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-white">
      {/* 1. Page Header & Live Status Banner */}
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

        {/* Live Simulation Controls & Badge */}
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
                <span>Pause Polling</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Polling</span>
              </>
            )}
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-800 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>SIMULATED DATA</span>
          </span>
        </div>
      </div>

      {/* Hardware Status Notice (Mandatory Architectural Transparency) */}
      <div className="bg-[#0B1B33] border-l-4 border-amber-400 border-y border-r border-[#16365B] rounded-r-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Hardware Status Notice
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hardware development in progress — no physical unit commissioned. All measurements below are simulated demonstration telemetry to validate analytics architecture.
            </p>
          </div>
        </div>
        <div className="text-[11px] font-mono text-slate-400 shrink-0 sm:text-right">
          Telemetry Polling: <span className="text-[#B9E5FF]">{lastHeartbeat}</span>
        </div>
      </div>

      {/* SECTION A: MONITORING OVERVIEW (TELEMETRY READOUT CARDS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#B9E5FF]" />
            <span>Live Telemetry Readouts (Simulated)</span>
          </h2>
          <div className="flex items-center gap-1 bg-[#0B1B33] p-1 rounded-lg border border-[#16365B] text-xs">
            <button
              onClick={() => setPhaseView('single')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                phaseView === 'single'
                  ? 'bg-[#16365B] text-[#B9E5FF]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Single Phase
            </button>
            <button
              onClick={() => setPhaseView('three')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                phaseView === 'three'
                  ? 'bg-[#16365B] text-[#B9E5FF]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Three Phase
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Voltage */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-2 hover:border-[#B9E5FF]/50 transition-colors shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Incoming Voltage</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#16365B] text-[#B9E5FF]">
                Live Stream
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {liveReadings.voltage}
              </span>
              <span className="text-sm font-semibold text-slate-400">V AC</span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#16365B]/60">
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Nominal Band (210–240V)</span>
              </span>
              <span className="text-slate-400 font-mono">{liveReadings.frequency} Hz</span>
            </div>
          </div>

          {/* Card 2: Current */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-2 hover:border-[#B9E5FF]/50 transition-colors shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Current Draw</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#16365B] text-[#B9E5FF]">
                {phaseView === 'single' ? 'Phase L1' : 'Balanced L1-L3'}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {liveReadings.current}
              </span>
              <span className="text-sm font-semibold text-slate-400">Amps</span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#16365B]/60">
              <span className="text-slate-300">Max Breaker: 32A</span>
              <span className="text-slate-400 font-mono">25.3% Load</span>
            </div>
          </div>

          {/* Card 3: Active Power */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-2 hover:border-[#B9E5FF]/50 transition-colors shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Active Power</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#16365B] text-[#B9E5FF]">
                Demand
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#B9E5FF] tracking-tight">
                {liveReadings.power}
              </span>
              <span className="text-sm font-semibold text-slate-400">kW</span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#16365B]/60">
              <span className="text-slate-300">Power Factor:</span>
              <span className="text-emerald-400 font-mono">{liveReadings.powerFactor} PF</span>
            </div>
          </div>

          {/* Card 4: Energy Today */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-2 hover:border-[#B9E5FF]/50 transition-colors shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Today's Consumption</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#16365B] text-[#B9E5FF]">
                Aggregate
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {liveReadings.energyToday}
              </span>
              <span className="text-sm font-semibold text-slate-400">kWh</span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#16365B]/60">
              <span className="text-slate-300">Est. Band A:</span>
              <span className="text-[#B9E5FF] font-mono">
                ₦{(liveReadings.energyToday * 225).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION B: ENERGY CONSUMPTION ANALYTICS (TRENDS & BAR CHARTS) */}
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 sm:p-6 space-y-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#16365B] pb-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#B9E5FF]" />
              <span>Energy Consumption Trends</span>
            </h2>
            <p className="text-xs text-slate-400">
              Historical consumption patterns and peak demand intervals.
            </p>
          </div>

          {/* Timeframe Selection Tabs */}
          <div className="flex items-center gap-1.5 bg-[#071629] p-1 rounded-lg border border-[#16365B] self-start sm:self-auto text-xs">
            <button
              onClick={() => setTimeframe('daily')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                timeframe === 'daily'
                  ? 'bg-[#16365B] text-[#B9E5FF] font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Daily (24h)
            </button>
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                timeframe === 'weekly'
                  ? 'bg-[#16365B] text-[#B9E5FF] font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Weekly (7d)
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                timeframe === 'monthly'
                  ? 'bg-[#16365B] text-[#B9E5FF] font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Interactive Responsive Consumption Chart */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              {timeframe === 'daily' ? 'Hourly Load (kWh)' : 
               timeframe === 'weekly' ? 'Daily Energy Total (kWh)' : 
               'Weekly Energy Totals (kWh)'}
            </span>
            {hoveredPoint ? (
              <span className="font-mono text-[#B9E5FF]">
                {hoveredPoint.label}: <strong className="text-white">{hoveredPoint.value} kWh</strong> (≈ ₦{hoveredPoint.cost?.toLocaleString()})
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">Hover over bars for detailed kWh & utility cost</span>
            )}
          </div>

          {/* Visual SVG / CSS Bar Chart */}
          <div className="h-48 flex items-end gap-2 pt-6 pb-2 border-b border-[#16365B]/80 px-2 bg-[#071629]/50 rounded-lg">
            {currentChartData.map((d, idx) => {
              const heightPct = Math.max(12, Math.round((d.kwh / maxVal) * 100));
              const isPeak = d.kwh > maxVal * 0.85;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  onMouseEnter={() => setHoveredPoint({ label: d.label, value: d.kwh, cost: d.cost })}
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

        {/* Peak Usage & Comparative Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-lg bg-[#071629] border border-[#16365B] space-y-1">
            <span className="text-[11px] text-slate-400 block">Peak Demand Interval</span>
            <span className="text-sm font-bold text-amber-400">19:00 – 21:30 (Evening Peak)</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Air conditioning and pumping loads coincide with utility off-peak tariff boundary.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#071629] border border-[#16365B] space-y-1">
            <span className="text-[11px] text-slate-400 block">Efficiency Compared to Last Period</span>
            <span className="text-sm font-bold text-emerald-400">-6.4% Demand Reduction</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Consistent solar hybrid inverter pass-through during daylight peak hours.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#071629] border border-[#16365B] space-y-1">
            <span className="text-[11px] text-slate-400 block">Estimated Utility Cost (Band A)</span>
            <span className="text-sm font-bold text-[#B9E5FF]">₦3,307.50 Projected Today</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Based on standard NERC Band A tariff index (₦225/kWh benchmark).
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
                <span>Voltage Quality Stability</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Safe Band
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Incoming line voltage sampling curve over the last 12 sampling blocks.
            </p>
          </div>

          {/* Simple Sparkline Curve Representation */}
          <div className="p-4 bg-[#071629] border border-[#16365B] rounded-lg space-y-3">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-slate-400">Max: <strong className="text-white">235V</strong></span>
              <span className="text-slate-400">Average: <strong className="text-[#B9E5FF]">231V</strong></span>
              <span className="text-slate-400">Min: <strong className="text-white">227V</strong></span>
            </div>

            {/* Sparkline curve */}
            <div className="h-16 flex items-end gap-1.5 pt-2">
              {voltageTrend.map((v, i) => {
                const height = ((v - 220) / 20) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div
                      style={{ height: `${height}%` }}
                      className="w-full bg-[#B9E5FF] rounded-t-sm hover:bg-white transition-colors"
                      title={`${v}V`}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-[#16365B]/60">
              <span>-6h ago</span>
              <span>-3h ago</span>
              <span>Live</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#071629] border border-[#16365B] text-xs text-slate-300 space-y-1">
            <span className="font-semibold text-white block">Surge & Brownout Protection Guard</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              No dangerous destructive surges (&gt;260V) or deep brownouts (&lt;175V) logged in the previous 24-hour sampling window.
            </p>
          </div>
        </div>

        {/* Supply Interruption & Event Log (7 cols) */}
        <div className="lg:col-span-7 bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#16365B] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B9E5FF]" />
                <span>Power Outage & Quality Events Log</span>
              </h3>
              <p className="text-xs text-slate-400">
                Timestamped grid cuts, voltage anomalies, and restoration events.
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
            <span className="text-slate-400 block text-[11px]">Telemetry Sample Rate:</span>
            <span className="text-white font-semibold block">5-Second Live Bursts</span>
            <p className="text-[10px] text-slate-500">Non-volatile offline flash buffer</p>
          </div>

          <div className="p-3 bg-[#071629] border border-[#16365B] rounded-lg space-y-1">
            <span className="text-slate-400 block text-[11px]">Certified Physical Disconnect:</span>
            <span className="text-slate-300 font-semibold block">Hardware Safety Lock</span>
            <p className="text-[10px] text-slate-500">Requires certified physical unit</p>
          </div>
        </div>
      </div>
    </div>
  );
};
