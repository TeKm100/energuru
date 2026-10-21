import React, { useState } from 'react';
import { Page } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { 
  ShoppingBag, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  ShieldCheck, 
  Sliders, 
  HelpCircle,
  Bell
} from 'lucide-react';

interface BuyConnectorPageProps {
  onNavigate: (page: Page) => void;
}

export const BuyConnectorPage: React.FC<BuyConnectorPageProps> = ({ onNavigate }) => {
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyDone, setNotifyDone] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (notifyEmail.includes('@')) {
      setNotifyDone(true);
    }
  };

  const packageSpecs = [
    {
      title: 'EnerGuru Single-Phase Connector Kit',
      target: 'Residential Homes, Student Housing & Small Retail Units',
      voltage: 'Single-Phase 220V–240V AC',
      connectivity: 'Autonomous 4G/2G Cellular IoT',
      mounting: 'Standard 35mm DIN-Rail or Surface Wall Bracket',
      includes: 'Current transformer clip sensor, antenna, terminal harness, 12-month data SIM',
    },
    {
      title: 'EnerGuru Three-Phase Commercial Kit',
      target: 'Hotels, Clinics, Manufacturing Workshops & Fuel Stations',
      voltage: 'Three-Phase 380V–415V AC + Neutral',
      connectivity: 'Dual-SIM 4G IoT with High-Gain External Antenna',
      mounting: 'Enclosed Industrial Panel Mount (IP54 Rated)',
      includes: '3x Split-core CT clamps, phase imbalance sensor, 12-month data SIM',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#16365B] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('connector')}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Back to connector overview"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Buy Your Connector
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 pl-8">
            Hardware package details, availability status, and quotation journey for prospective customers.
          </p>
        </div>

        <div className="flex items-center gap-2 pl-8 md:pl-0">
          <StatusBadge status="hardware-required" label="Pre-Order Inquiries Only" />
        </div>
      </div>

      {/* Honest Availability & E-Commerce Disclaimer */}
      <div className="bg-[#0B1B33] border-l-4 border-amber-400 border-y border-r border-[#16365B] rounded-r-xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Commercial Availability Notice</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Online card checkout is not enabled at this stage. EnerGuru connector hardware is currently in pilot batch 
          engineering by Tekm EnerGuru Technologies and Solutions. We are receiving customer requirements through our 
          <strong> Get a Quote</strong> workflow rather than processing direct unverified transactions.
        </p>
      </div>

      {/* Purchase Journey Steps */}
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#16365B] pb-3">
          <h2 className="text-lg font-bold text-white">How to Procure an EnerGuru Connector</h2>
          <p className="text-xs text-slate-400">
            A four-step pathway ensuring hardware suitability before final distribution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#071629] border border-[#16365B] rounded-xl space-y-2">
            <span className="text-xs font-mono font-bold text-[#B9E5FF] uppercase">Step 1</span>
            <h3 className="font-bold text-white text-sm">Submit Quotation Request</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tell us about your electrical setup (single vs. three phase, generator size, solar configuration).
            </p>
          </div>

          <div className="p-4 bg-[#071629] border border-[#16365B] rounded-xl space-y-2">
            <span className="text-xs font-mono font-bold text-[#B9E5FF] uppercase">Step 2</span>
            <h3 className="font-bold text-white text-sm">Technical Review & Sizing</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Our engineering team determines the exact CT clamp rating and antenna package required.
            </p>
          </div>

          <div className="p-4 bg-[#071629] border border-[#16365B] rounded-xl space-y-2">
            <span className="text-xs font-mono font-bold text-[#B9E5FF] uppercase">Step 3</span>
            <h3 className="font-bold text-white text-sm">Batch Allocation</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              You receive formal quotation details with pilot deployment timelines and installation options.
            </p>
          </div>

          <div className="p-4 bg-[#071629] border border-[#16365B] rounded-xl space-y-2">
            <span className="text-xs font-mono font-bold text-[#B9E5FF] uppercase">Step 4</span>
            <h3 className="font-bold text-white text-sm">Activation & Connectivity</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Units arrive provisioned with active cellular IoT connectivity for immediate cloud telemetry.
            </p>
          </div>
        </div>

        {/* CTA to Quote */}
        <div className="pt-2 flex justify-start">
          <button
            onClick={() => onNavigate('get-quote')}
            className="px-6 py-3 rounded-lg bg-[#B9E5FF] hover:bg-white text-[#071629] font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Proceed to Get a Quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Package Configurations Overview */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">Proposed Hardware Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packageSpecs.map((pkg) => (
            <div key={pkg.title} className="bg-[#0B1B33] border border-[#16365B] rounded-2xl p-6 sm:p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-[#16365B] pb-3">
                  <h3 className="font-bold text-white text-base">{pkg.title}</h3>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-950 text-[#B9E5FF]">
                    Proposed Spec
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Recommended Application:</span>
                    <span className="text-white font-medium">{pkg.target}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Electrical Rating:</span>
                    <span className="text-[#B9E5FF] font-mono">{pkg.voltage}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Telemetry Interface:</span>
                    <span className="text-white">{pkg.connectivity}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Package Contents:</span>
                    <span className="text-slate-300">{pkg.includes}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#16365B]/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Pricing</span>
                  <span className="text-xs text-amber-300 font-semibold font-mono">Quotation on Request</span>
                </div>

                <button
                  onClick={() => onNavigate('get-quote')}
                  className="px-4 py-2 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-xs font-semibold text-white transition-colors"
                >
                  Request Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notify Form */}
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl p-6 sm:p-8 max-w-2xl">
        <div className="space-y-1 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#B9E5FF]" />
            <span>Notify Me When Commercial Ordering Opens</span>
          </h3>
          <p className="text-xs text-slate-400">
            Sign up to be notified as soon as certified retail batches become available in your area.
          </p>
        </div>

        {notifyDone ? (
          <div className="p-3 bg-[#071629] border border-emerald-800/60 rounded-lg flex items-center gap-2 text-xs text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Thank you! Your email is registered for commercial hardware announcements.</span>
          </div>
        ) : (
          <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              className="flex-1 bg-[#071629] border border-[#16365B] rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#B9E5FF]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#B9E5FF] hover:bg-white text-[#071629] font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
