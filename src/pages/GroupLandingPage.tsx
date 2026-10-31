import React from 'react';
import { AuthPage } from '../types';
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
  User, 
  Settings, 
  ArrowLeft, 
  ArrowRight, 
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Radio,
  Clock,
  ShoppingBag
} from 'lucide-react';

interface GroupLandingPageProps {
  groupId: AuthPage;
  onNavigate: (page: AuthPage) => void;
}

interface GroupFeatureItem {
  id: AuthPage;
  title: string;
  desc: string;
  icon: React.ElementType;
  badge: string;
  badgeType: 'live' | 'interactive' | 'rd' | 'planned' | 'framework';
}

interface GroupMetadata {
  title: string;
  category: string;
  tagline: string;
  icon: React.ElementType;
  features: GroupFeatureItem[];
}

const GROUPS_CONFIG: Record<string, GroupMetadata> = {
  'energy-management': {
    title: 'Energy Management',
    category: 'System Telemetry & Controls',
    tagline: 'Real-time building electricity telemetry, remote switching simulation, outage dispatch, and predictive load intelligence.',
    icon: Activity,
    features: [
      {
        id: 'energy-monitoring',
        title: 'Energy Monitoring & Analytics',
        desc: 'Interactive live telemetry, daily/weekly/monthly energy consumption trends, and power quality event logs.',
        icon: Activity,
        badge: 'Live Analytics',
        badgeType: 'live',
      },
      {
        id: 'power-control',
        title: 'Power Control Centre',
        desc: 'Safety-interlocked remote main breaker switching and automated load shedding simulation sandbox.',
        icon: Power,
        badge: 'In Development',
        badgeType: 'planned',
      },
      {
        id: 'alerts',
        title: 'Alerts & Notifications',
        desc: 'Multi-channel dispatch hub for grid power blackouts, voltage surges, and generator maintenance alarms.',
        icon: Bell,
        badge: 'In Development',
        badgeType: 'planned',
      },
      {
        id: 'ai-intelligence',
        title: 'AI Energy Intelligence',
        desc: 'DisCo feeder reliability forecasting and automated generator diesel fuel optimization models.',
        icon: BrainCircuit,
        badge: 'In Development',
        badgeType: 'planned',
      },
      {
        id: 'connector-management',
        title: 'Smart Connector Management',
        desc: 'Cellular IoT SIM management, OTA firmware updates, and electrician commissioning checklists.',
        icon: Sliders,
        badge: 'In Development',
        badgeType: 'planned',
      },
    ],
  },
  'devices-operations': {
    title: 'Devices & Operations',
    category: 'Hardware & Maintenance Workspaces',
    tagline: 'Manage physical backup equipment, maintenance schedules, outage runbooks, and hardware engineering specifications.',
    icon: Wrench,
    features: [
      {
        id: 'equipment',
        title: 'Equipment Registry & Maintenance',
        desc: 'Digital inventory for petrol/diesel generators, solar inverters, battery banks, runtime hours, and runbooks.',
        icon: Wrench,
        badge: 'Interactive Tool',
        badgeType: 'interactive',
      },
      {
        id: 'outage-prep',
        title: 'Outage Prep Checklists',
        desc: 'Structured protocols for blackouts, water pumping, emergency device charging, and appliance surge protection.',
        icon: ShieldAlert,
        badge: 'Interactive Tool',
        badgeType: 'interactive',
      },
      {
        id: 'connector',
        title: 'Hardware Connector R&D & Engineering',
        desc: 'DIN-rail smart electricity connector architecture, cellular IoT telemetry, and line voltage monitoring specs.',
        icon: Cpu,
        badge: 'R&D Prototype',
        badgeType: 'rd',
      },
      {
        id: 'buy-connector',
        title: 'Buy Connector Packages',
        desc: 'Reserve hardware pre-order packages, review electrical installation kit specifications, and explore tier inclusions.',
        icon: ShoppingBag,
        badge: 'Pre-Order Specs',
        badgeType: 'interactive',
      },
      {
        id: 'connect-device',
        title: 'Device Pairing Sandbox',
        desc: 'Simulated QR and cryptographic serial pairing sandbox for DIN-rail smart connector field testing.',
        icon: Radio,
        badge: 'Simulation Sandbox',
        badgeType: 'interactive',
      },
    ],
  },
  'business-enterprise': {
    title: 'Business & Enterprise',
    category: 'Commercial Solutions & Energy Economics',
    tagline: 'Tailored electrical engineering consultations, facility site audits, tariff cost modeling, and subscription packages.',
    icon: Briefcase,
    features: [
      {
        id: 'get-quote',
        title: 'Commercial & Advisory / Request a Quote',
        desc: 'Request custom energy readiness and equipment sizing consultation for residential, hospitality, or commercial sites.',
        icon: Briefcase,
        badge: 'Active Service',
        badgeType: 'live',
      },
      {
        id: 'energy-costs',
        title: 'Cost & Energy Reports',
        desc: 'Compare grid utility Band A/B/C billing against generator fuel burn costs per kWh with interactive calculators.',
        icon: LineChart,
        badge: 'Interactive Tool',
        badgeType: 'interactive',
      },
    ],
  },
  'community-impact': {
    title: 'Community & Impact',
    category: 'Public Electrification & Microgrids',
    tagline: 'Transparent crowd-supported frameworks for rural health clinic solarisation, schools, and productive agricultural hubs.',
    icon: Users,
    features: [
      {
        id: 'community-funding',
        title: 'Community Energy Initiatives',
        desc: 'Verified solar microgrid proposals and citizen participation frameworks for energy-underserved communities.',
        icon: Users,
        badge: 'Concept Framework',
        badgeType: 'framework',
      },
    ],
  },
  'account-plans': {
    title: 'Account & Plans',
    category: 'User Profile & Preferences',
    tagline: 'Manage authenticated credentials, personal preferences, account security, and enterprise subscription details.',
    icon: User,
    features: [
      {
        id: 'profile',
        title: 'My Profile',
        desc: 'View and update your display name, nickname, primary email address, and authenticated user ID.',
        icon: User,
        badge: 'Profile Settings',
        badgeType: 'live',
      },
      {
        id: 'settings',
        title: 'Account Settings',
        desc: 'Review security settings, active session controls, and platform sign-out options.',
        icon: Settings,
        badge: 'Security',
        badgeType: 'live',
      },
      {
        id: 'plans',
        title: 'Plans & Subscriptions',
        desc: 'Review your active tier details, billing frequency, and enterprise advisory upgrades.',
        icon: CreditCard,
        badge: 'Active Plans',
        badgeType: 'live',
      },
    ],
  },
};

export const GroupLandingPage: React.FC<GroupLandingPageProps> = ({ groupId, onNavigate }) => {
  const group = GROUPS_CONFIG[groupId] || {
    title: 'Navigation Group',
    category: 'Workspace',
    tagline: 'Explore platform capabilities within this functional section.',
    icon: Layers,
    features: [],
  };

  const GroupIcon = group.icon;

  const getBadgeStyle = (type: GroupFeatureItem['badgeType']) => {
    switch (type) {
      case 'live':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
      case 'interactive':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-800';
      case 'rd':
        return 'bg-blue-950 text-[#B9E5FF] border-blue-900';
      case 'framework':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'planned':
      default:
        return 'bg-[#071629] text-slate-400 border-[#16365B]';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-white">
      {/* Breadcrumb & Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#16365B] pb-6">
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
            <span className="text-slate-300">{group.category}</span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="w-10 h-10 rounded-xl bg-[#16365B] border border-[#B9E5FF]/30 text-[#B9E5FF] flex items-center justify-center shrink-0 shadow-sm">
              <GroupIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {group.title}
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {group.tagline}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 rounded-lg bg-[#0B1B33] hover:bg-[#16365B] text-slate-300 hover:text-white border border-[#16365B] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B9E5FF]" />
            <span>Group Features ({group.features.length})</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Original EnerGuru Architecture
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {group.features.map((feature) => {
            const FeatureIcon = feature.icon;
            return (
              <div
                key={feature.id}
                className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#B9E5FF]/60 hover:shadow-lg transition-all duration-200 group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-lg bg-[#16365B] border border-[#B9E5FF]/20 text-[#B9E5FF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <FeatureIcon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getBadgeStyle(feature.badgeType)}`}>
                      {feature.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#B9E5FF] transition-colors flex items-center gap-1.5">
                      <span>{feature.title}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#B9E5FF] group-hover:translate-x-0.5 transition-all" />
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1.5">
                      {feature.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#16365B]/70">
                  <button
                    onClick={() => onNavigate(feature.id)}
                    className="w-full py-2.5 px-3 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Open {feature.title.split('/')[0].trim()}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Honest Architecture & Safety Banner */}
      <div className="bg-[#0B1B33]/60 border border-[#16365B] rounded-xl p-4 sm:p-5 flex items-start gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-[#B9E5FF] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-white block">
            Platform Notice & Safety Principles
          </span>
          <p className="text-slate-400 leading-relaxed">
            All interactive tools and R&D modules operate within safe software simulation sandboxes. Certified physical electrical switching, metering, and breaker isolation require professionally certified EnerGuru Smart Connector hardware.
          </p>
        </div>
      </div>
    </div>
  );
};
