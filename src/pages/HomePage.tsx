import React, { useState } from 'react';
import { Page } from '../types';
import { 
  ArrowRight, 
  ShieldAlert, 
  Wrench, 
  LineChart, 
  Home as HomeIcon, 
  GraduationCap, 
  Building2, 
  Landmark, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError('');

    if (!newsletterEmail || !newsletterEmail.includes('@') || !newsletterEmail.includes('.')) {
      setNewsletterError('Please provide a valid email address.');
      return;
    }
    if (!consentGiven) {
      setNewsletterError('Please acknowledge your consent to receive development updates.');
      return;
    }

    setNewsletterSubmitted(true);
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Development Status Notice */}
      <section className="bg-[#0B1B33] border-b border-[#16365B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-medium text-[#B9E5FF]">Public Preview:</span>
            <span>Foundation website for Tekm EnerGuru Technologies and Solutions.</span>
          </div>
          <button 
            onClick={() => onNavigate('about')}
            className="hidden sm:inline-flex text-[#B9E5FF] hover:underline cursor-pointer"
          >
            Learn about our status →
          </button>
        </div>
      </section>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-12">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#16365B]/60 border border-[#16365B] text-xs font-medium text-[#B9E5FF]">
            <span>Motto:</span>
            <span className="text-white font-semibold">“Smarter Energy. Stay Aware. Stay Prepared.”</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Stay ready for whatever your energy brings.
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
            EnerGuru aims to help people understand energy challenges, prepare for disruptions, 
            manage equipment, and make better energy-related decisions across evolving grid conditions.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onNavigate('create-account')}
              className="px-6 py-3 rounded-md bg-[#B9E5FF] text-[#071629] font-semibold text-base hover:bg-white transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('how-it-works')}
              className="px-6 py-3 rounded-md bg-[#0B1B33] border border-[#16365B] text-slate-200 font-medium text-base hover:bg-[#16365B] hover:text-white transition-colors cursor-pointer text-center"
            >
              How It Works
            </button>
          </div>

          {/* Honest transparency note */}
          <div className="pt-2 flex items-start gap-2.5 text-xs text-slate-400">
            <AlertCircle className="w-4 h-4 text-[#B9E5FF] shrink-0 mt-0.5" />
            <p>
              EnerGuru is an early-stage initiative currently in active development. We do not make false claims 
              of completed operational tools or automated utility switching.
            </p>
          </div>
        </div>
      </section>

      {/* Intended Capabilities Overview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="border-b border-[#16365B] pb-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Intended Capabilities
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Core functional pillars currently being architected for upcoming platform releases.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Status: Planned / In Development</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-lg p-6 flex flex-col justify-between hover:border-[#16365B]/80 transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded bg-[#16365B] text-[#B9E5FF] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Outage Readiness</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-950 text-[#B9E5FF] border border-blue-900">
                  Planned
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Structured contingency planning before power interruptions occur. Guidance on battery reserve thresholds, 
                critical circuit prioritization, and emergency backup sequencing.
              </p>
            </div>
            <div className="pt-6 border-t border-[#16365B]/50 mt-6 text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Target: Incident response checklists & protocols</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-lg p-6 flex flex-col justify-between hover:border-[#16365B]/80 transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded bg-[#16365B] text-[#B9E5FF] flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Equipment & Maintenance</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-950 text-[#B9E5FF] border border-blue-900">
                  Planned
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Centralized registry for power equipment such as generators, solar inverters, batteries, and surge gear. 
                Keep track of service schedules, oil changes, and component replacements.
              </p>
            </div>
            <div className="pt-6 border-t border-[#16365B]/50 mt-6 text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Target: Equipment lifecycle & service history log</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-lg p-6 flex flex-col justify-between hover:border-[#16365B]/80 transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded bg-[#16365B] text-[#B9E5FF] flex items-center justify-center">
                <LineChart className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Energy Insights</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-950 text-[#B9E5FF] border border-blue-900">
                  Planned
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Understand tariff changes, consumption patterns, and alternative energy feasibility. 
                Data-driven clarity to help evaluate solar upgrades, fuel costs, and efficiency savings.
              </p>
            </div>
            <div className="pt-6 border-t border-[#16365B]/50 mt-6 text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Target: Comparative feasibility & cost modeling</span>
            </div>
          </div>
        </div>
      </section>

      {/* Who EnerGuru Serves */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-8 sm:p-10">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Designed for Real-World Energy Realities
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Energy challenges vary by context. EnerGuru is architected to address the practical pain points 
              experienced across four primary user groups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Audience 1 */}
            <div className="bg-[#071629] border border-[#16365B] rounded-lg p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-[#16365B] text-[#B9E5FF]">
                  <HomeIcon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Households</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Families dealing with unannounced blackouts, rising electric utility rates, and maintaining home backup supplies. 
                Helps prioritize refrigerator power, ventilation, and family communication needs during prolonged outages.
              </p>
            </div>

            {/* Audience 2 */}
            <div className="bg-[#071629] border border-[#16365B] rounded-lg p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-[#16365B] text-[#B9E5FF]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Students</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Learners in student housing or shared apartments who require dependable power for study sessions, online exams, 
                and device recharging without costly commercial infrastructure.
              </p>
            </div>

            {/* Audience 3 */}
            <div className="bg-[#071629] border border-[#16365B] rounded-lg p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-[#16365B] text-[#B9E5FF]">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Small Businesses</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Retail shops, clinics, workshops, and eateries where a power cut means immediate revenue loss, spoiled perishable inventory, 
                or halted payment terminals. Guidance on generator run-time and load balancing.
              </p>
            </div>

            {/* Audience 4 */}
            <div className="bg-[#071629] border border-[#16365B] rounded-lg p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-[#16365B] text-[#B9E5FF]">
                  <Landmark className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Institutions</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Community centers, educational facilities, and non-profits seeking structured energy auditing, multi-asset maintenance tracking, 
                and resilient operational continuity plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Area */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-b from-[#0B1B33] to-[#071629] border border-[#16365B] rounded-xl p-8 sm:p-10 max-w-3xl mx-auto">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <h3 className="text-2xl font-bold text-white">
              Stay Informed on Platform Progress
            </h3>
            <p className="text-sm text-slate-300">
              Sign up to receive early development milestones, outage readiness research notes, and pre-release access.
            </p>
          </div>

          {newsletterSubmitted ? (
            <div className="mt-8 bg-[#16365B]/60 border border-[#B9E5FF]/40 rounded-lg p-6 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#B9E5FF] mx-auto" />
              <h4 className="font-semibold text-white text-base">Registration Recorded</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Thank you for your interest! In this Stage 1 public build, automated email list distribution will connect 
                when the backend communication service is deployed in subsequent stages.
              </p>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="mt-8 space-y-4 max-w-md mx-auto">
              <div>
                <label htmlFor="newsletter-email" className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#071629] border border-[#16365B] rounded px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#B9E5FF]"
                />
              </div>

              {/* Explicit Consent Language */}
              <div className="flex items-start gap-2.5">
                <input
                  id="newsletter-consent"
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#16365B] bg-[#071629] text-[#B9E5FF] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="newsletter-consent" className="text-xs text-slate-400 leading-relaxed cursor-pointer">
                  I agree to receive occasional EnerGuru development announcements and product notices from Tekm EnerGuru Technologies and Solutions. You can unsubscribe at any time.
                </label>
              </div>

              {newsletterError && (
                <p className="text-xs text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-800/40">
                  {newsletterError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded bg-[#B9E5FF] text-[#071629] font-semibold text-sm hover:bg-white transition-colors cursor-pointer"
              >
                Sign Up for Updates
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                Honest notice: Submissions in Stage 1 demonstrate the workflow; marketing automation will integrate in later stages.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
