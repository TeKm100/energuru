import React from 'react';
import { Page } from '../types';
import { 
  UserPlus, 
  MapPin, 
  SlidersHorizontal, 
  Lightbulb, 
  Activity, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface HowItWorksPageProps {
  onNavigate: (page: Page) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  const journeySteps = [
    {
      number: '01',
      title: 'Create an account',
      icon: UserPlus,
      status: 'Initial Stage (Registration Setup)',
      description:
        'Sign up for an EnerGuru profile to securely save your location, household or business preferences, and notification rules.',
      detail:
        'In this Stage 1 release, registration forms demonstrate account data fields; backend user directory provisioning connects in subsequent deployment.'
    },
    {
      number: '02',
      title: 'Tell EnerGuru about your energy situation',
      icon: MapPin,
      status: 'Planned Capability',
      description:
        'Provide baseline details regarding your local power reliability, average daily grid hours, backup availability, and typical utility expenditure.',
      detail:
        'Helps benchmark your environment against regional outage trends and grid stability patterns.'
    },
    {
      number: '03',
      title: 'Record relevant equipment and energy challenges',
      icon: SlidersHorizontal,
      status: 'Planned Capability',
      description:
        'Catalog key energy assets—such as petrol or diesel generators, solar PV panels, hybrid inverters, lithium or tubular batteries, and heavy appliances.',
      detail:
        'Capture capacities (kVA/kW), battery amp-hour ratings, fuel tank sizes, purchase dates, and current operating condition.'
    },
    {
      number: '04',
      title: 'Receive suitable guidance as features become available',
      icon: Lightbulb,
      status: 'In Development',
      description:
        'Access practical checklists, runtime calculators, load shedding guides, and proactive maintenance alerts.',
      detail:
        'Guidance is rolled out progressively based on engineering validation and vetted electrical guidelines.'
    },
    {
      number: '05',
      title: 'Track maintenance and energy-related information over time',
      icon: Activity,
      status: 'Planned Roadmap',
      description:
        'Log oil changes, filter cleanings, battery water top-ups, technician visits, and fuel expenses in a structured digital service book.',
      detail:
        'Prevents sudden breakdowns, preserves warranty records, and improves equipment resale and operating longevity.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12 pb-20">
      {/* Header */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#16365B]/60 border border-[#16365B] text-xs font-medium text-[#B9E5FF]">
          <span>Intended User Journey</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          How EnerGuru is Designed to Work
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
          A step-by-step framework to turn chaotic energy headaches into structured, manageable everyday routines.
        </p>
      </section>

      {/* Development Disclaimer Callout */}
      <section className="bg-[#0B1B33] border-l-4 border-[#B9E5FF] border-y border-r border-[#16365B] rounded-r-lg p-5 space-y-2">
        <div className="flex items-center gap-2 text-[#B9E5FF] font-semibold text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Important Development Notice</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The full experience is currently being developed by Tekm EnerGuru Technologies and Solutions. 
          The workflow outlined below reflects the intended user architecture. Capabilities are being implemented 
          incrementally and future features are not yet guaranteed to be available or operational immediately.
        </p>
      </section>

      {/* The 5 Steps */}
      <section className="space-y-6">
        <div className="border-b border-[#16365B] pb-3">
          <h2 className="text-xl font-bold text-white tracking-tight">
            The 5 Planned Phases
          </h2>
        </div>

        <div className="space-y-6">
          {journeySteps.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.number}
                className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-6 hover:border-[#16365B]/90 transition-all flex flex-col md:flex-row gap-6 items-start"
              >
                {/* Step number and badge */}
                <div className="flex items-center md:flex-col justify-between w-full md:w-28 shrink-0 gap-2 border-b md:border-b-0 md:border-r border-[#16365B]/60 pb-3 md:pb-0 md:pr-4">
                  <span className="font-mono text-2xl font-black text-[#B9E5FF]">
                    {step.number}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-[#16365B] text-[#B9E5FF] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Step content */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <h3 className="text-lg font-bold text-white">
                      {step.title}
                    </h3>
                    <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800/40 w-fit">
                      {step.status}
                    </span>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="pt-2 text-xs text-slate-400 bg-[#071629] p-3 rounded border border-[#16365B]/60">
                    <strong className="text-slate-300">Phase Details: </strong>
                    {step.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Box */}
      <section className="bg-gradient-to-r from-[#0B1B33] to-[#16365B]/50 border border-[#16365B] rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-white">
            Ready to follow our development?
          </h3>
          <p className="text-xs text-slate-300">
            Create an early account placeholder or submit your feedback to help shape upcoming features.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('create-account')}
            className="px-5 py-2.5 rounded bg-[#B9E5FF] text-[#071629] font-semibold text-xs hover:bg-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Create Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="px-4 py-2.5 rounded border border-[#16365B] text-slate-200 text-xs font-medium hover:bg-[#071629] transition-colors"
          >
            Contact Team
          </button>
        </div>
      </section>
    </div>
  );
};
