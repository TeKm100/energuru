import React from 'react';
import { AuthPage } from '../types';
import { 
  ArrowLeft, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Power, 
  Bell, 
  BrainCircuit, 
  Sliders,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ModulePlaceholderPageProps {
  pageId: AuthPage;
  onNavigate: (page: AuthPage) => void;
}

interface ModuleInfo {
  title: string;
  category: string;
  icon: React.ElementType;
  description: string;
  plannedFeatures: string[];
  relatedPage?: {
    id: AuthPage;
    label: string;
  };
}

const MODULE_REGISTRY: Record<string, ModuleInfo> = {
  'energy-monitoring': {
    title: 'Energy Monitoring',
    category: 'Telemetry & Real-Time Metrics',
    icon: Activity,
    description: 'High-frequency telemetry interface for real-time voltage, current, active power, and power factor logging. Live monitoring will activate upon physical Smart Connector installation and certification.',
    plannedFeatures: [
      'Sub-second line voltage and phase imbalance telemetry',
      'Real-time generator fuel burn vs. grid utility cost tracking',
      'Automated high/low voltage surge threshold logging',
      'Exportable power quality logs for utility DisCo dispute claims'
    ],
    relatedPage: {
      id: 'energy-costs',
      label: 'View Tariff & Cost Modeling'
    }
  },
  'power-control': {
    title: 'Power Control Centre',
    category: 'Hardware Control & Safety Interlocks',
    icon: Power,
    description: 'Centralized building-level remote electrical control. In compliance with electrical safety standards, remote switching is strictly locked until verified Smart Connector hardware is physically commissioned.',
    plannedFeatures: [
      'Safety-interlocked remote main breaker switching',
      'Automated load shedding triggers during backup generator operation',
      'Priority circuit protection for medical and refrigeration units',
      'Two-factor authorized switching with cryptographic audit logging'
    ],
    relatedPage: {
      id: 'connector',
      label: 'View Hardware Connector R&D'
    }
  },
  'alerts': {
    title: 'Alerts & Notifications',
    category: 'System Warnings & Dispatch',
    icon: Bell,
    description: 'Multi-channel dispatch hub for grid power outage notifications, voltage spike alerts, generator maintenance countdowns, and phase failure warnings.',
    plannedFeatures: [
      'Instant SMS and WhatsApp outage & restoration broadcasts',
      'Voltage spike (over-voltage >250V) instant disconnect alarms',
      'Scheduled preventive maintenance reminders for generators & inverters',
      'Custom quiet hours and notification escalation rules'
    ],
    relatedPage: {
      id: 'outage-prep',
      label: 'View Outage Preparation Checklists'
    }
  },
  'ai-intelligence': {
    title: 'AI Energy Intelligence',
    category: 'Predictive Analytics & Optimization',
    icon: BrainCircuit,
    description: 'Machine learning intelligence models for forecasting utility power availability, optimizing battery charge cycles, and minimizing generator diesel consumption across Nigerian estates.',
    plannedFeatures: [
      'DisCo feeder reliability forecasting based on historical grid data',
      'Dynamic battery charging schedules synced with grid tariff windows',
      'Automated generator runtime optimization to prevent wet stacking',
      'Custom weekly energy efficiency diagnostics and cost saving tips'
    ],
    relatedPage: {
      id: 'energy-costs',
      label: 'View Energy Costs & Reports'
    }
  },
  'connector-management': {
    title: 'Smart Connector Management',
    category: 'Hardware Fleet & Device Provisioning',
    icon: Sliders,
    description: 'Fleet administration workspace for physical EnerGuru Smart Connector devices. Manage cellular SIM/eSIM provisioning, firmware OTA updates, and field installation certifications.',
    plannedFeatures: [
      'Cellular IoT connectivity diagnostic and signal strength monitor',
      'Over-the-air (OTA) cryptographic firmware updates',
      'Electrician commissioning checklists and calibration certificates',
      'Multi-device linking for estates, hospitality, and commercial sites'
    ],
    relatedPage: {
      id: 'connect-device',
      label: 'View Device Pairing Sandbox'
    }
  }
};

export const ModulePlaceholderPage: React.FC<ModulePlaceholderPageProps> = ({ pageId, onNavigate }) => {
  const moduleInfo = MODULE_REGISTRY[pageId] || {
    title: 'Platform Module',
    category: 'Upcoming Feature',
    icon: Sparkles,
    description: 'This platform capability is currently under active engineering development.',
    plannedFeatures: [
      'Under active architecture design',
      'Scheduled for subsequent platform releases'
    ]
  };

  const Icon = moduleInfo.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 text-white">
      {/* Navigation Header */}
      <div className="flex items-center gap-3 text-xs">
        <button
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-slate-300 bg-[#0B1B33] border border-[#16365B] hover:bg-[#16365B] hover:text-white shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#B9E5FF]" />
          <span>Back to Dashboard</span>
        </button>
        <span className="text-slate-500">/</span>
        <button
          onClick={() => onNavigate('energy-management')}
          className="text-[#B9E5FF] hover:underline cursor-pointer"
        >
          Energy Management
        </button>
        <span className="text-slate-500">/</span>
        <span className="text-slate-300">{moduleInfo.category}</span>
      </div>

      {/* Main Card */}
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#16365B] pb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#16365B] border border-[#B9E5FF]/30 text-[#B9E5FF] flex items-center justify-center shrink-0 shadow-sm">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#B9E5FF] bg-[#16365B]/60 px-2.5 py-0.5 rounded border border-[#B9E5FF]/20 mb-1">
                <Clock className="w-3 h-3 text-[#B9E5FF]" />
                <span>Development Roadmap • Phase 2</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {moduleInfo.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-amber-950/80 text-amber-300 border border-amber-800">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>In Development</span>
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Module Purpose & Engineering Scope
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {moduleInfo.description}
          </p>
        </div>

        {/* Planned Features */}
        <div className="bg-[#071629] border border-[#16365B] rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Target Capabilities in Upcoming Release
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
            {moduleInfo.plannedFeatures.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B9E5FF] shrink-0 mt-1.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Safe Notice */}
        <div className="p-4 rounded-xl bg-[#071629]/80 border border-[#16365B] text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#B9E5FF]" />
            <span>Honest Platform Notice</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            EnerGuru does not display simulated or placeholder controls as active operational equipment. Physical building-level switching and certified metering require certified hardware installation by a licensed electrician.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[#16365B]">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#16365B] rounded-lg transition-colors cursor-pointer text-center border border-[#16365B]"
          >
            ← Return to Dashboard
          </button>

          {moduleInfo.relatedPage && (
            <button
              onClick={() => onNavigate(moduleInfo.relatedPage!.id)}
              className="px-4 py-2 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm border border-[#B9E5FF]/30"
            >
              <span>{moduleInfo.relatedPage.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
