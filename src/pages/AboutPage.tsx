import React from 'react';
import { Page } from '../types';
import { Target, Compass, Sparkles, Building, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: Page) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-16 pb-20">
      {/* Title & Introduction */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#16365B]/60 border border-[#16365B] text-xs font-medium text-[#B9E5FF]">
          <span>About EnerGuru</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Smarter Energy. Stay Aware. Stay Prepared.
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed pt-2">
          EnerGuru was conceived to bring order, foresight, and practical intelligence to the 
          daily energy decisions made by individuals, families, and businesses.
        </p>
      </section>

      {/* Purpose & Problems Addressed */}
      <section className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#16365B] text-[#B9E5FF]">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">The Energy Challenges We Seek to Address</h2>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          Access to stable, affordable electricity is one of the most critical determinants of modern productivity and comfort. 
          Yet across many regions—and increasingly in developing and strained grid environments worldwide—energy is unpredictable:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-[#071629] border border-[#16365B] rounded-lg space-y-1.5">
            <h3 className="font-semibold text-white text-sm">Unscheduled Grid Disruptions</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Blackouts strike without warning, leaving households without cooking or ventilation, and businesses without point-of-sale systems.
            </p>
          </div>

          <div className="p-4 bg-[#071629] border border-[#16365B] rounded-lg space-y-1.5">
            <h3 className="font-semibold text-white text-sm">Premature Equipment Breakdown</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generators, deep-cycle inverter batteries, and solar charge controllers are often neglected or operated under sub-optimal loads, shortening their lifespans.
            </p>
          </div>

          <div className="p-4 bg-[#071629] border border-[#16365B] rounded-lg space-y-1.5">
            <h3 className="font-semibold text-white text-sm">Volatile Energy Tariffs & Fuel Costs</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Consumers lack clear visibility into how much running a supplemental generator actually costs per kilowatt-hour versus grid tariffs or solar ROI.
            </p>
          </div>

          <div className="p-4 bg-[#071629] border border-[#16365B] rounded-lg space-y-1.5">
            <h3 className="font-semibold text-white text-sm">Confusing Energy Transitions</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Evaluating whether to buy a lithium-ion battery, add 4 solar panels, or upgrade a backup generator is complex and filled with unverified sales pitches.
            </p>
          </div>
        </div>
      </section>

      {/* Commitment to Practical & Responsible Solutions */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#16365B] text-[#B9E5FF]">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Our Commitment: Practical, Responsible, and Honest</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          EnerGuru is founded on direct, grounded reality. We believe energy technology should not just cater to 
          subsidized smart-grid homes in select metropolitan hubs, but must work reliably for people operating 
          in decentralized, hybrid, and intermittent energy environments.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          We do not believe in exaggerating claims, promising magical zero-cost solutions, or offering unvetted advice. 
          Our commitment is to provide structured checklists, maintenance accountability, and actionable insights that respect real-world budget constraints.
        </p>
      </section>

      {/* Long-Term Ambition */}
      <section className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#16365B] text-[#B9E5FF]">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Long-Term Ambition</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          Over time, our ambition is to make energy-related decisions intuitive, accessible, and universally approachable. 
          Whether you are a student budgeting generator fuel with flatmates, a small clinic maintaining vaccine refrigeration, 
          or an expanding business planning a commercial hybrid microgrid, EnerGuru aims to serve as your dependable digital advisor.
        </p>
      </section>

      {/* Corporate Status & Transparency */}
      <section className="border border-amber-800/50 bg-[#0B1B33] rounded-xl p-6 space-y-3">
        <div className="flex items-center gap-2.5 text-amber-300 font-bold text-sm">
          <Building className="w-5 h-5 shrink-0" />
          <span>Entity & Development Status Disclosure</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>Working Company:</strong> Tekm EnerGuru Technologies and Solutions.
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">
          EnerGuru is currently at the public foundation stage (Stage 1). The company name is proposed and statutory incorporation 
          has not yet been completed. Features described in our roadmap are under engineering design and are not yet operational. 
          We are sharing this website to establish our architectural baseline, collect user feedback, and transparently outline our direction.
        </p>
      </section>

      {/* Navigation action */}
      <div className="pt-4 flex items-center justify-between border-t border-[#16365B]">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          ← Return to Home
        </button>
        <button
          onClick={() => onNavigate('how-it-works')}
          className="px-4 py-2 rounded bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
        >
          <span>See How It Works</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
