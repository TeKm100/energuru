import React, { useState } from 'react';
import { Page } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { 
  Users, 
  Lightbulb, 
  ArrowLeft, 
  Building, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  FileText, 
  Send, 
  AlertTriangle,
  X,
  Clock
} from 'lucide-react';

interface CommunityFundingPageProps {
  onNavigate: (page: Page) => void;
}

type ModalAction = 'submit-project' | 'funding-interest' | 'partner' | null;

export const CommunityFundingPage: React.FC<CommunityFundingPageProps> = ({ onNavigate }) => {
  const [activeModal, setActiveModal] = useState<ModalAction>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    communityName: '',
    details: '',
  });

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalSuccess(
      'Your preliminary interest notice has been recorded. Our research team reviews community frameworks during this conceptual phase. (Notice: No commercial funds or verification are guaranteed in this pre-incorporation stage).'
    );
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalSuccess(null);
    setFormData({ name: '', email: '', communityName: '', details: '' });
  };

  const timelineSteps = [
    {
      step: '01',
      title: 'Problem Identification',
      desc: 'Community representatives or local groups identify acute power deficits (e.g. unpowered clinic, educational center, agricultural cold storage).',
    },
    {
      step: '02',
      title: 'Technical Feasibility & Demand Audit',
      desc: 'EnerGuru models actual load profiles, solar irradiance, fuel access, and community willingness-to-pay using data intelligence.',
    },
    {
      step: '03',
      title: 'System Sizing & Vendor Quotation',
      desc: 'Design of standardized microgrid or backup packages (solar-inverter-battery) with transparent bill-of-materials and safety engineering.',
    },
    {
      step: '04',
      title: 'Co-Funding & Grant Alignment',
      desc: 'Exploration of philanthropic, donor-backed, impact investment, or community co-ownership capital mechanisms.',
    },
    {
      step: '05',
      title: 'Commissioning & Long-Term Telemetry',
      desc: 'Deployment by vetted technicians followed by continuous remote monitoring via EnerGuru connectors to ensure asset longevity.',
    },
  ];

  const illustrativeProjects = [
    {
      id: 'demo-1',
      title: 'Rural Healthcare Center Solarization (Illustrative Model)',
      location: 'Ogun State (Demo Case)',
      tech: '5 kVA Hybrid Solar + 10 kWh Battery Storage',
      purpose: 'Provide 24/7 refrigeration for essential vaccines and emergency maternity lighting.',
      stage: 'Conceptual Template',
    },
    {
      id: 'demo-2',
      title: 'Agricultural Grain Mill Micro-Solar Hub (Illustrative Model)',
      location: 'Benue State (Demo Case)',
      tech: '15 kVA Commercial Solar PV + Hybrid Diesel Assist',
      purpose: 'Replace erratic petrol generators for post-harvest food processing cooperatives.',
      stage: 'Conceptual Template',
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
              Community Energy Funding Initiative
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 pl-8">
            Framework for community energy projects, feasibility audits, and prospective philanthropic/partner funding.
          </p>
        </div>

        <div className="flex items-center gap-2 pl-8 md:pl-0">
          <StatusBadge status="in-development" label="Framework in Development" />
        </div>
      </div>

      {/* Honest Regulatory & Funding Disclaimer */}
      <div className="bg-[#0B1B33] border-l-4 border-amber-400 border-y border-r border-[#16365B] rounded-r-xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Important Initiative Status & Financial Disclaimer</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          EnerGuru and Tekm EnerGuru Technologies and Solutions are currently developing the technical and assessment framework 
          for this initiative. EnerGuru <strong>does not currently hold investment funds, broker public securities, guarantee project grants, or accept public donations</strong>. 
          Submission of an inquiry does not guarantee verification, funding, or execution.
        </p>
      </div>

      {/* Overview & Purpose */}
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#B9E5FF] font-semibold">
            Purpose & Social Impact Ambition
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Bridging Energy Poverty Through Data-Driven Community Micro-Projects
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            In many developing settlements, individual households cannot afford standalone solar systems, yet communal institutions 
            (clinics, schools, pumping stations) suffer catastrophic service interruptions. Our planned initiative aims to provide 
            transparent energy auditing and monitoring so reputable impact donors and clean-energy financiers can deploy capital 
            with accountability.
          </p>
        </div>

        {/* 3 Call-To-Action Triggers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#16365B]/60">
          <button
            onClick={() => setActiveModal('submit-project')}
            className="p-4 rounded-xl bg-[#071629] border border-[#16365B] hover:border-[#B9E5FF]/60 text-left space-y-2 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#16365B] text-[#B9E5FF] flex items-center justify-center group-hover:bg-[#B9E5FF] group-hover:text-[#071629] transition-colors">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Submit a Project Proposal</h3>
            <p className="text-[11px] text-slate-400">Describe a community power challenge for technical evaluation.</p>
          </button>

          <button
            onClick={() => setActiveModal('funding-interest')}
            className="p-4 rounded-xl bg-[#071629] border border-[#16365B] hover:border-[#B9E5FF]/60 text-left space-y-2 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#16365B] text-[#B9E5FF] flex items-center justify-center group-hover:bg-[#B9E5FF] group-hover:text-[#071629] transition-colors">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Express Funding Interest</h3>
            <p className="text-[11px] text-slate-400">For impact investors, foundations, and clean energy donors.</p>
          </button>

          <button
            onClick={() => setActiveModal('partner')}
            className="p-4 rounded-xl bg-[#071629] border border-[#16365B] hover:border-[#B9E5FF]/60 text-left space-y-2 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#16365B] text-[#B9E5FF] flex items-center justify-center group-hover:bg-[#B9E5FF] group-hover:text-[#071629] transition-colors">
              <Building className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Become a Project Partner</h3>
            <p className="text-[11px] text-slate-400">For equipment vendors, local EPC contractors, and NGOs.</p>
          </button>
        </div>
      </div>

      {/* Project Lifecycle Timeline */}
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#16365B] pb-3">
          <h2 className="text-lg font-bold text-white">Planned Project Progression Lifecycle</h2>
          <p className="text-xs text-slate-400">
            How community submissions are intended to advance through verification and commissioning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {timelineSteps.map((s) => (
            <div key={s.step} className="p-4 bg-[#071629] border border-[#16365B] rounded-xl space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="font-mono text-xl font-black text-[#B9E5FF] block">{s.step}</span>
                <h3 className="font-bold text-white text-xs">{s.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Illustrative Demonstration Cases */}
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-[#16365B] pb-3">
          <div>
            <h2 className="text-lg font-bold text-white">Demonstration Model Templates</h2>
            <p className="text-xs text-slate-400">
              Representative archetypes created for architecture simulation (Not active community projects).
            </p>
          </div>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            Illustrative Only
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {illustrativeProjects.map((p) => (
            <div key={p.id} className="p-5 bg-[#071629] border border-[#16365B] rounded-xl space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-amber-300 font-semibold">{p.stage}</span>
                <span className="text-[10px] text-slate-400 font-mono">{p.location}</span>
              </div>
              <h3 className="font-bold text-white text-sm">{p.title}</h3>
              <p className="text-xs text-slate-300">{p.purpose}</p>
              <div className="pt-2 border-t border-[#16365B]/60 text-[11px] text-[#B9E5FF] font-mono">
                System Spec: {p.tech}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Dialog for Actions */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl w-full max-w-lg text-white shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#16365B] pb-3">
              <h3 className="font-bold text-white text-base">
                {activeModal === 'submit-project' && 'Submit Community Project Concept'}
                {activeModal === 'funding-interest' && 'Express Funding & Donor Interest'}
                {activeModal === 'partner' && 'Project Partnership Inquiry'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalSuccess ? (
              <div className="p-4 bg-[#071629] border border-emerald-800/60 rounded-xl space-y-3 text-xs text-emerald-200 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="leading-relaxed">{modalSuccess}</p>
                <button
                  onClick={closeModal}
                  className="px-4 py-1.5 bg-[#B9E5FF] text-[#071629] font-bold rounded text-xs hover:bg-white"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Your Name / Representative</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Kemi Adeleke"
                    className="w-full bg-[#071629] border border-[#16365B] rounded px-3 py-2 text-white focus:outline-none focus:border-[#B9E5FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-[#071629] border border-[#16365B] rounded px-3 py-2 text-white focus:outline-none focus:border-[#B9E5FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Community or Organization Name</label>
                  <input
                    type="text"
                    required
                    value={formData.communityName}
                    onChange={(e) => setFormData({ ...formData, communityName: e.target.value })}
                    placeholder="e.g. Ilaro Community Health Clinic"
                    className="w-full bg-[#071629] border border-[#16365B] rounded px-3 py-2 text-white focus:outline-none focus:border-[#B9E5FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Details & Objectives</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder="Describe the energy problem, existing backup options, and community impact..."
                    className="w-full bg-[#071629] border border-[#16365B] rounded p-2.5 text-white focus:outline-none focus:border-[#B9E5FF]"
                  />
                </div>

                <div className="p-2.5 bg-[#071629] rounded border border-amber-900/40 text-[11px] text-amber-200/80">
                  Notice: EnerGuru does not currently disburse investment capital. Submissions are for research and feasibility modeling.
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-3.5 py-1.5 rounded border border-[#16365B] text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-[#B9E5FF] text-[#071629] font-bold hover:bg-white"
                  >
                    Submit Notice
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
