import React from 'react';
import { AuthPage, UserProfile } from '../types';
import { 
  Zap, 
  Wrench, 
  ShieldAlert, 
  LineChart, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Layers, 
  Cpu, 
  Sparkles 
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
  const displayName = userProfile?.nickname || userProfile?.full_name || userEmail?.split('@')[0] || 'User';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0B1B33] to-[#16365B]/60 border border-[#16365B] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#16365B] text-xs font-medium text-[#B9E5FF] border border-[#B9E5FF]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#B9E5FF]" />
            <span>Energy Intelligence & Readiness Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="text-[#B9E5FF]">{displayName}</span>
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Monitor equipment readiness, stay ahead of power interruptions, and track maintenance logs across your locations.
          </p>
        </div>

        {/* Quick Profile / Onboarding trigger */}
        <div className="flex flex-col sm:flex-row items-start md:items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('profile')}
            className="px-4 py-2 rounded-lg bg-[#16365B] hover:bg-[#16365B]/80 text-xs font-semibold text-white border border-[#B9E5FF]/30 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Edit Profile</span>
          </button>
          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="px-4 py-2 rounded-lg bg-[#B9E5FF] hover:bg-white text-[#071629] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Setup Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Energy Readiness Status Overview (Functional Readouts) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Card 1 */}
        <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Account Status</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white">Active & Verified</div>
          <p className="text-[11px] text-slate-400">Authenticated via Supabase</p>
        </div>

        {/* Status Card 2 */}
        <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Primary Location</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-950 text-[#B9E5FF]">Planned</span>
          </div>
          <div className="text-lg font-bold text-white">Default Hub</div>
          <p className="text-[11px] text-slate-400">Location manager coming in Stage 3</p>
        </div>

        {/* Status Card 3 */}
        <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Registered Equipment</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-950 text-[#B9E5FF]">Stage 3</span>
          </div>
          <div className="text-lg font-bold text-white">0 Items</div>
          <p className="text-[11px] text-slate-400">Generators, solar, batteries</p>
        </div>

        {/* Status Card 4 */}
        <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Outage Readiness</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-white">Pending Setup</div>
          <p className="text-[11px] text-slate-400">Checklists queued for next release</p>
        </div>
      </div>

      {/* Core Platform Modules */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#16365B] pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#B9E5FF]" />
              <span>Platform Modules</span>
            </h2>
            <p className="text-xs text-slate-400">
              Core energy management systems scheduled for upcoming feature rollouts.
            </p>
          </div>
          <span className="text-[11px] font-mono text-cyan-300">Phase 2: App Foundation Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Equipment Registry */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-6 flex flex-col justify-between hover:border-[#B9E5FF]/50 transition-all space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#16365B] text-[#B9E5FF] flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-white">Equipment Registry</h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                  Interactive
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Register generators, solar PV systems, hybrid inverters, and battery banks. Add assets, view technical specs, and check troubleshooting runbooks.
              </p>
            </div>
            <div className="pt-4 border-t border-[#16365B]/60 flex items-center justify-between">
              <button
                onClick={() => onNavigate('equipment')}
                className="w-full py-2 px-3 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Manage Equipment Registry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Maintenance Logbook */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-6 flex flex-col justify-between hover:border-[#B9E5FF]/50 transition-all space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#16365B] text-[#B9E5FF] flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-white">Maintenance Logbook</h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                  Interactive
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Digital service records for oil changes, spark plug replacements, battery electrolyte top-ups, technician servicing, and operating hours.
              </p>
            </div>
            <div className="pt-4 border-t border-[#16365B]/60 flex items-center justify-between">
              <button
                onClick={() => onNavigate('equipment')}
                className="w-full py-2 px-3 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Maintenance Logs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Outage Contingency Checklists */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-6 flex flex-col justify-between hover:border-[#B9E5FF]/50 transition-all space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#16365B] text-[#B9E5FF] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-white">Outage Checklists</h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                  Interactive
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Structured protocols for blackouts and load shedding. Interactive checklists for water pumping, device charging, fuel storage, and appliance safety.
              </p>
            </div>
            <div className="pt-4 border-t border-[#16365B]/60 flex items-center justify-between">
              <button
                onClick={() => onNavigate('outage-prep')}
                className="w-full py-2 px-3 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Open Outage Checklists</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: Energy Insights & Analytics */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-6 flex flex-col justify-between hover:border-[#B9E5FF]/50 transition-all space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#16365B] text-[#B9E5FF] flex items-center justify-center">
                <LineChart className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-white">Tariff & Cost Modeling</h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                  Interactive Tool
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Compare grid utility Band A/B/C billing against generator fuel costs per kWh. Log actual fuel and electricity tokens with cost metrics.
              </p>
            </div>
            <div className="pt-4 border-t border-[#16365B]/60 flex items-center justify-between">
              <button
                onClick={() => onNavigate('energy-costs')}
                className="w-full py-2 px-3 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Launch Cost Calculator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 5: Hardware Connector Telemetry (EnerGuru Connector) */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-6 flex flex-col justify-between hover:border-[#B9E5FF]/50 transition-all space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#16365B] text-[#B9E5FF] flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-white">Hardware Connector R&D</h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-950 text-[#B9E5FF] border border-blue-900">
                  R&D Prototype
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Explore cellular IoT architecture for live voltage and phase monitoring. Review device specs, simulate hardware pairing, or join notify waitlist.
              </p>
            </div>
            <div className="pt-4 border-t border-[#16365B]/60 flex items-center justify-between gap-2">
              <button
                onClick={() => onNavigate('connector')}
                className="flex-1 py-2 px-3 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Overview</span>
              </button>
              <button
                onClick={() => onNavigate('connect-device')}
                className="flex-1 py-2 px-2.5 rounded-lg bg-[#071629] hover:bg-[#16365B] text-slate-300 hover:text-white border border-[#16365B] text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Pair Demo</span>
              </button>
            </div>
          </div>

          {/* Card 6: Community Energy Initiatives */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-6 flex flex-col justify-between hover:border-[#B9E5FF]/50 transition-all space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#16365B] text-[#B9E5FF] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-white">Community Energy</h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                  Concept Framework
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Explore transparent crowd-supported microgrid and facility solar proposals for unpowered health clinics, schools, and agricultural pumps.
              </p>
            </div>
            <div className="pt-4 border-t border-[#16365B]/60 flex items-center justify-between">
              <button
                onClick={() => onNavigate('community-funding')}
                className="w-full py-2 px-3 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Community Framework</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Commercial Solutions & Quotation Banner */}
        <div className="mt-8 bg-gradient-to-r from-[#16365B] to-[#0B1B33] border border-[#B9E5FF]/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-wider text-[#B9E5FF] bg-blue-950/80 px-2.5 py-1 rounded border border-[#B9E5FF]/20">
              Commercial & Advisory Services
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Need custom energy assessment or commercial deployment?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We prepare tailored energy readiness quotes for households, hotels, healthcare centers, and educational facilities. Review our plans or submit a quote enquiry.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('plans')}
              className="px-4 py-2.5 rounded-lg bg-[#071629] hover:bg-[#16365B] text-white text-xs font-semibold border border-[#16365B] transition-colors text-center cursor-pointer"
            >
              Subscription Plans
            </button>
            <button
              onClick={() => onNavigate('get-quote')}
              className="px-5 py-2.5 rounded-lg bg-[#B9E5FF] hover:bg-white text-[#071629] text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Request a Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
