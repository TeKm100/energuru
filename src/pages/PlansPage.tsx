import React, { useState } from 'react';
import { Page } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { 
  Check, 
  ArrowLeft, 
  Sparkles, 
  Building2, 
  Home as HomeIcon, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';

interface PlansPageProps {
  onNavigate: (page: Page) => void;
}

export const PlansPage: React.FC<PlansPageProps> = ({ onNavigate }) => {
  const [interestNoted, setInterestNoted] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'EnerGuru Free',
      badge: 'Available Now',
      target: 'Households, Students & Individual Users',
      price: 'Free',
      period: 'No subscription required',
      features: [
        { text: 'Full access to Stage 1 & 2 web platform', available: true },
        { text: 'Manual equipment registry & service logging', available: true },
        { text: 'Fuel vs. grid cost-per-kWh comparison tool', available: true },
        { text: 'Outage preparedness & safety runbooks', available: true },
        { text: 'Standard single-user profile & account settings', available: true },
        { text: 'Live automated hardware telemetry', available: false },
      ],
      ctaText: 'Current Plan',
      ctaAction: () => onNavigate('dashboard'),
      isCurrent: true,
    },
    {
      id: 'plus',
      name: 'EnerGuru Plus',
      badge: 'Proposed Tier',
      target: 'Homes with Solar & Critical Power Requirements',
      price: 'Proposed',
      period: 'Pricing to be announced',
      features: [
        { text: 'Everything in Free plan', available: true },
        { text: 'Automated maintenance cycle alert triggers', available: false },
        { text: 'Connector telemetry dashboard for 1 site', available: false },
        { text: 'Instant SMS & WhatsApp blackout alerts', available: false },
        { text: 'Extended 12-month expense history export', available: false },
        { text: 'Priority technician booking assistance', available: false },
      ],
      ctaText: 'Express Interest in Plus',
      ctaAction: () => setInterestNoted('EnerGuru Plus'),
      isCurrent: false,
      popular: true,
    },
    {
      id: 'business',
      name: 'EnerGuru Business',
      badge: 'Proposed Commercial',
      target: 'Hotels, Clinics, Multi-Store Retail & Institutions',
      price: 'Quotation Basis',
      period: 'Custom commercial deployment',
      features: [
        { text: 'Everything in Plus plan', available: true },
        { text: 'Multi-location fleet management & multi-inverter views', available: false },
        { text: 'Dedicated 3-phase commercial connector integration', available: false },
        { text: 'Diesel generator runtime & fuel theft anomaly flags', available: false },
        { text: 'Team member role delegation & audit reports', available: false },
        { text: 'Priority on-site engineering advisory', available: false },
      ],
      ctaText: 'Request Business Quote',
      ctaAction: () => onNavigate('get-quote'),
      isCurrent: false,
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
              Plans & Subscriptions
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 pl-8">
            Proposed subscription tiers, commercial models, and feature packages for EnerGuru users.
          </p>
        </div>

        <div className="flex items-center gap-2 pl-8 md:pl-0">
          <StatusBadge status="coming-soon" label="Commercial Tiers Proposed" />
        </div>
      </div>

      {/* Honest Billing Disclaimer */}
      <div className="bg-[#0B1B33] border-l-4 border-[#B9E5FF] border-y border-r border-[#16365B] rounded-r-xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-[#B9E5FF] font-bold text-sm">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Billing & Commercial Model Transparency</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          EnerGuru does not process credit card transactions or activate paid subscriptions at this stage. 
          The tiers below reflect our proposed service structure. Hardware connector purchases are intended to include 
          an initial complimentary period of cloud telemetry and cellular connectivity, with clear renewal terms announced prior to commercial sales.
        </p>
      </div>

      {/* Interest Confirmation banner */}
      {interestNoted && (
        <div className="p-4 bg-[#071629] border border-emerald-800/60 rounded-xl flex items-center justify-between gap-4 text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              Thank you! Your interest in <strong className="text-white">{interestNoted}</strong> has been logged for early-access notifications.
            </span>
          </div>
          <button
            onClick={() => setInterestNoted(null)}
            className="text-xs underline text-[#B9E5FF] hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Plans Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`bg-[#0B1B33] border rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
              p.popular
                ? 'border-[#B9E5FF] shadow-2xl'
                : 'border-[#16365B] hover:border-[#16365B]/90'
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#B9E5FF] text-[#071629] text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-md font-mono">
                Most Popular Proposal
              </span>
            )}

            <div className="space-y-5">
              <div className="border-b border-[#16365B] pb-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-white text-lg">{p.name}</h3>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-950 text-[#B9E5FF] border border-blue-900">
                    {p.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-300 min-h-[32px]">{p.target}</p>
                <div className="pt-2">
                  <span className="text-2xl font-black text-white font-mono block">{p.price}</span>
                  <span className="text-[11px] text-slate-400">{p.period}</span>
                </div>
              </div>

              {/* Feature list */}
              <div className="space-y-2.5 text-xs">
                <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">
                  Included Capabilities:
                </span>
                {p.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${feat.available ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className={feat.available ? 'text-slate-200' : 'text-slate-400 italic'}>
                      {feat.text}
                      {!feat.available && <span className="text-[10px] text-amber-300 font-mono ml-1.5">(Planned)</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#16365B]/60 mt-6">
              <button
                type="button"
                onClick={p.ctaAction}
                className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
                  p.isCurrent
                    ? 'bg-[#16365B] text-slate-300 hover:text-white'
                    : p.popular
                    ? 'bg-[#B9E5FF] text-[#071629] hover:bg-white'
                    : 'bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-white'
                }`}
              >
                <span>{p.ctaText}</span>
                {!p.isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Hardware Bundling Policy Notice */}
      <div className="p-6 bg-[#0B1B33] border border-[#16365B] rounded-2xl space-y-2 text-xs text-slate-300">
        <h4 className="font-bold text-white text-sm">Connectivity & Hardware Subscription Policy</h4>
        <p className="leading-relaxed">
          Because the EnerGuru Connector utilizes cellular M2M telemetry, each physical device purchased will include an 
          all-inclusive period (intended for 12 months) of automated cellular SIM data and cloud telemetry streaming. 
          Subsequent connectivity renewal options will be simple, transparent, and announced prior to hardware shipment.
        </p>
      </div>
    </div>
  );
};
