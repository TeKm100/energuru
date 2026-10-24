import React from 'react';
import { AuthPage, UserProfile } from '../types';
import { 
  Cpu, 
  Users, 
  Briefcase, 
  Wrench, 
  ArrowRight, 
  Activity, 
  FileText, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  Radio,
  Layers,
  HelpCircle
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0B1B33] via-[#0E223F] to-[#16365B]/70 border border-[#16365B] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#B9E5FF]">
            <Sparkles className="w-3.5 h-3.5 text-[#B9E5FF]" />
            <span>Energy Intelligence & Hardware Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="text-[#B9E5FF]">{displayName}</span>
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Advancing building-level electrical monitoring, cellular telemetry, community energy initiatives, and customized commercial advisory.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-start md:items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('profile')}
            className="px-4 py-2.5 rounded-lg bg-[#071629] hover:bg-[#16365B] text-xs font-semibold text-slate-200 hover:text-white border border-[#16365B] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Edit Profile</span>
          </button>
          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="px-4 py-2.5 rounded-lg bg-[#B9E5FF] hover:bg-white text-[#071629] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Platform Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Feature Cards Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#16365B] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-[#B9E5FF]" />
              <span>Core Platform Programs</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Explore EnerGuru’s flagship hardware R&D, community electrification initiatives, and commercial advisory services.
            </p>
          </div>
          <span className="text-[11px] font-mono text-cyan-300 self-start sm:self-auto bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 rounded">
            Stage 1: Architecture Active
          </span>
        </div>

        {/* EXACTLY THREE PRIMARY FEATURE CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          
          {/* CARD 1: HARDWARE CONNECTOR R&D */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#B9E5FF]/60 transition-all duration-200 shadow-lg group">
            <div>
              {/* Image Above Title */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#071629] border-b border-[#16365B]">
                <img
                  src="/images/energuru/connector-rd.jpg"
                  alt="EnerGuru Smart Hardware Connector Prototype in Engineering Lab"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider bg-[#071629]/90 text-[#B9E5FF] border border-[#B9E5FF]/40 backdrop-blur-sm">
                    Flagship R&D
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-950/90 text-amber-300 border border-amber-700/60 backdrop-blur-sm">
                    Demo / Simulated
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-3.5">
                <div className="flex items-center gap-2 text-xs text-[#B9E5FF] font-medium">
                  <Cpu className="w-4 h-4 shrink-0" />
                  <span>Hardware Engineering</span>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight">
                  Hardware Connector R&D
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  EnerGuru’s flagship product in active development: building-level incoming electricity monitoring and, in the future, authorized remote control through a professionally engineered smart connector.
                </p>

                <div className="pt-2 border-t border-[#16365B]/50 space-y-2 text-[11px] text-slate-400">
                  <div className="flex items-start gap-2">
                    <Radio className="w-3.5 h-3.5 text-[#B9E5FF] shrink-0 mt-0.5" />
                    <span>Independent cellular IoT connectivity for outage and restoration alerts without domestic Wi-Fi dependency.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Activity className="w-3.5 h-3.5 text-[#B9E5FF] shrink-0 mt-0.5" />
                    <span>Line voltage, brownout, and surge diagnostics with future safety-interlocked remote switching when physical hardware and certifications complete.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 space-y-2.5">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => onNavigate('connector')}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Explore Connector R&D</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('connect-device')}
                  className="py-2.5 px-3 rounded-lg bg-[#071629] hover:bg-[#16365B] text-slate-300 hover:text-white border border-[#16365B] text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  title="Simulated hardware pairing sandbox"
                >
                  <span>Pairing Demo</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-500 text-center font-mono">
                Hardware is in R&D stage. Readings are simulated demos.
              </p>
            </div>
          </div>

          {/* CARD 2: COMMUNITY ENERGY */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#B9E5FF]/60 transition-all duration-200 shadow-lg group">
            <div>
              {/* Image Above Title */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#071629] border-b border-[#16365B]">
                <img
                  src="/images/energuru/community-energy.jpg"
                  alt="Community Solar and Microgrid Installation at Healthcare Facility"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider bg-[#071629]/90 text-[#B9E5FF] border border-[#B9E5FF]/40 backdrop-blur-sm">
                    Access & Participation
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-950/90 text-cyan-300 border border-cyan-800/60 backdrop-blur-sm">
                    Framework Preview
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-3.5">
                <div className="flex items-center gap-2 text-xs text-[#B9E5FF] font-medium">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Public & Social Impact</span>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight">
                  Community Energy
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  A transparent framework for future community electricity-access projects, project proposals, funding opportunities, citizen participation, and verified project progress.
                </p>

                <div className="pt-2 border-t border-[#16365B]/50 space-y-2 text-[11px] text-slate-400">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Clear separation between proposed, under-development, funded, and commissioned solar facilities.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B9E5FF] shrink-0 mt-0.5" />
                    <span>Rigorous engineering audits for unpowered rural clinics, schools, and agricultural cold-storage hubs.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 space-y-2.5">
              <button
                onClick={() => onNavigate('community-funding')}
                className="w-full py-2.5 px-3 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Explore Community Initiatives</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <p className="text-[10px] text-slate-500 text-center font-mono">
                Concept framework. No active commercial solicitation.
              </p>
            </div>
          </div>

          {/* CARD 3: COMMERCIAL & ADVISORY SERVICES */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#B9E5FF]/60 transition-all duration-200 shadow-lg group">
            <div>
              {/* Image Above Title */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#071629] border-b border-[#16365B]">
                <img
                  src="/images/energuru/commercial-advisory.jpg"
                  alt="Professional Energy Engineer Presenting Commercial Power Solutions"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider bg-[#071629]/90 text-[#B9E5FF] border border-[#B9E5FF]/40 backdrop-blur-sm">
                    Client Solutions
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/90 text-emerald-300 border border-emerald-800/60 backdrop-blur-sm">
                    Open for Enquiries
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-3.5">
                <div className="flex items-center gap-2 text-xs text-[#B9E5FF] font-medium">
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span>Commercial & Enterprise</span>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight">
                  Commercial & Advisory Services
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Tailored electrical engineering consultations, business energy assessments, subscription plan structures, and custom commercial energy requests for Nigerian facilities.
                </p>

                <div className="pt-2 border-t border-[#16365B]/50 space-y-2 text-[11px] text-slate-400">
                  <div className="flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#B9E5FF] shrink-0 mt-0.5" />
                    <span>Interactive quotation workflow for residential, hospitality, health clinics, and industrial properties.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#B9E5FF] shrink-0 mt-0.5" />
                    <span>Transparent subscription and advisory tiers designed for predictable backup power economics.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 space-y-2.5">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => onNavigate('get-quote')}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-[#B9E5FF] hover:bg-white text-[#071629] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Request a Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('plans')}
                  className="py-2.5 px-3 rounded-lg bg-[#071629] hover:bg-[#16365B] text-slate-300 hover:text-white border border-[#16365B] text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>View Plans</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-500 text-center font-mono">
                Direct consultation requests. Non-binding advisory.
              </p>
            </div>
          </div>
        </div>

        {/* SECONDARY FEATURE: EQUIPMENT REGISTRY & MAINTENANCE LOGBOOK (VISIBLY LESS PROMINENT) */}
        <div className="mt-8 bg-[#0B1B33]/60 border border-[#16365B] rounded-xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-colors hover:border-[#16365B]/90">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#071629] border border-[#16365B] text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
              <Wrench className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-bold text-white">
                  Equipment Registry & Maintenance Logbook
                </h4>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#071629] text-slate-400 border border-[#16365B]">
                  Planned • Coming Later
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                A future workspace for tracking energy equipment, service history, and maintenance activities.
              </p>
            </div>
          </div>

          <div className="shrink-0 self-stretch sm:self-auto flex items-center gap-3">
            <button
              onClick={() => onNavigate('equipment')}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#071629] hover:bg-[#16365B] text-slate-300 hover:text-white text-xs font-semibold border border-[#16365B] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore Preview</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
