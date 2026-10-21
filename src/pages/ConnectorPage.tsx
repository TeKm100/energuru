import React, { useState } from 'react';
import { Page } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { 
  Cpu, 
  Wifi, 
  ShieldCheck, 
  Activity, 
  ArrowLeft, 
  ArrowRight, 
  Bell, 
  CheckCircle2, 
  Radio, 
  HelpCircle,
  FileText,
  Sliders,
  Sparkles
} from 'lucide-react';

interface ConnectorPageProps {
  onNavigate: (page: Page) => void;
}

export const ConnectorPage: React.FC<ConnectorPageProps> = ({ onNavigate }) => {
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notified, setNotified] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notifyEmail.includes('@')) {
      setNotified(true);
    }
  };

  const featurePillars = [
    {
      title: 'Autonomous Cellular IoT (SIM/eSIM)',
      icon: Radio,
      desc: 'Operates independently of domestic home Wi-Fi routers. Transmits telemetry even when home internet routers lose power during total blackouts.',
    },
    {
      title: 'Real-Time Voltage & Phase Monitoring',
      icon: Activity,
      desc: 'Samples line voltages to detect destructive over-voltage spikes (300V+), deep brownouts (under 160V), and phase imbalance across commercial lines.',
    },
    {
      title: 'Instant Outage & Restoration Signals',
      icon: Bell,
      desc: 'Broadcasts instant cloud alerts when grid power cuts out or restores, enabling rapid generator scheduling and appliance safety.',
    },
    {
      title: 'Decentralized Micro-Storage Buffer',
      icon: Cpu,
      desc: 'Internal non-volatile flash memory caches timestamped voltage measurements during regional cellular dropouts, bursting data on reconnection.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#16365B] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              EnerGuru Connector
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 pl-8">
            The dedicated cellular hardware device engineered for live grid monitoring, outage alerts, and power quality protection.
          </p>
        </div>

        <div className="flex items-center gap-2 pl-8 md:pl-0">
          <StatusBadge status="hardware-required" label="Hardware in R&D" />
        </div>
      </div>

      {/* Main Hero Card */}
      <div className="bg-gradient-to-r from-[#0B1B33] via-[#0B1B33] to-[#16365B]/60 border border-[#16365B] rounded-2xl p-6 sm:p-10 space-y-6 shadow-xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#16365B] text-xs font-semibold text-[#B9E5FF] border border-[#B9E5FF]/30">
            <Cpu className="w-4 h-4" />
            <span>Planned Physical Hardware Device</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Independent, Cellular-Connected Energy Intelligence
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            The EnerGuru Connector is an upcoming IoT monitoring device designed to connect directly into your distribution board or backup changeover switch. 
            By utilizing a dedicated cellular data link, it maintains continuous cloud communication without relying on home Wi-Fi or vulnerable local routers.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('get-quote')}
            className="px-5 py-2.5 rounded-lg bg-[#B9E5FF] hover:bg-white text-[#071629] font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Get a Quote for Your Site</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onNavigate('buy-connector')}
            className="px-4 py-2.5 rounded-lg bg-[#16365B] hover:bg-[#16365B]/80 text-white font-semibold text-xs border border-[#16365B] transition-colors"
          >
            Buy Your Connector (Availability)
          </button>

          <button
            onClick={() => onNavigate('connect-device')}
            className="px-4 py-2.5 rounded-lg border border-[#16365B] hover:bg-[#071629] text-slate-300 hover:text-white text-xs font-medium transition-colors"
          >
            Connect Your Device (Workflow)
          </button>
        </div>
      </div>

      {/* R&D & Engineering Readiness Disclosure */}
      <div className="bg-[#0B1B33] border-l-4 border-[#B9E5FF] border-y border-r border-[#16365B] rounded-r-xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-[#B9E5FF] font-bold text-sm">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Engineering Validation Status</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The EnerGuru Connector is in active hardware prototyping and electrical engineering design by Tekm EnerGuru Technologies and Solutions. 
          Final capabilities depend on bench testing, thermal safety validation, telecom type-approvals, and firmware hardening. 
          Live readings and pairing require actual physical hardware and will become available following pilot deployment.
        </p>
      </div>

      {/* Core Intended Capabilities */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight">Intended Architecture & Hardware Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {featurePillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="p-6 bg-[#0B1B33] border border-[#16365B] rounded-xl space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#16365B] text-[#B9E5FF] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm">{p.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notify Me When Available Banner */}
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl p-6 sm:p-8 max-w-2xl">
        <div className="space-y-2 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#B9E5FF]" />
            <span>Notify Me When Connector Hardware Launches</span>
          </h3>
          <p className="text-xs text-slate-400">
            Receive priority invitations for our regional pilot batches and early-bird hardware distribution.
          </p>
        </div>

        {notified ? (
          <div className="p-3 bg-[#071629] border border-emerald-800/60 rounded-lg flex items-center gap-2 text-xs text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Thank you! Your notification request has been recorded for early pilot release updates.</span>
          </div>
        ) : (
          <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              className="flex-1 bg-[#071629] border border-[#16365B] rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#B9E5FF]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#B9E5FF] hover:bg-white text-[#071629] font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Notify Me
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
