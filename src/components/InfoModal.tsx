import React, { useState } from 'react';
import { InfoModalType, Page } from '../types';
import { X, Search, CheckCircle2, ShieldAlert, Loader2, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured, getAuthRedirectUrl } from '../lib/supabase';

interface InfoModalProps {
  modalType: InfoModalType;
  onClose: () => void;
  onNavigate: (page: Page) => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ modalType, onClose, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('correction');
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  if (!modalType) return null;

  const sitePages = [
    { title: 'Home', page: 'home' as Page, desc: 'EnerGuru overview, core mission, audience groups, and newsletter' },
    { title: 'About', page: 'about' as Page, desc: 'Why EnerGuru was founded, energy challenges addressed, and company status' },
    { title: 'How It Works', page: 'how-it-works' as Page, desc: 'The 5-step intended user journey and planned capabilities' },
    { title: 'Contact', page: 'contact' as Page, desc: 'Direct inquiries form and transparent submission notice' },
    { title: 'Sign In', page: 'signin' as Page, desc: 'Account access screen with proposed company details' },
    { title: 'Create Account', page: 'create-account' as Page, desc: 'Registration screen for early platform interest' },
  ];

  const filteredPages = sitePages.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-lg w-full max-w-xl text-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#16365B] flex items-center justify-between bg-[#071629]">
          <h3 className="font-semibold text-base text-white">
            {modalType === 'search' && 'Site Directory & Search'}
            {modalType === 'feedback' && 'Corrections & Feedback'}
            {modalType === 'legal' && 'Legal Notice & Platform Structure'}
            {modalType === 'privacy' && 'Privacy Policy'}
            {modalType === 'terms' && 'Terms of Service'}
            {modalType === 'disclaimer' && 'General Energy Disclaimer'}
            {modalType === 'affiliate' && 'Affiliate Disclosure'}
            {modalType === 'forgot-password' && 'Password Reset Assistance'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#16365B] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto text-sm text-slate-300 space-y-4 leading-relaxed">
          {modalType === 'search' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search pages or topics (e.g., equipment, about, outages)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#071629] border border-[#16365B] rounded pl-9 pr-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#B9E5FF]"
                  autoFocus
                />
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                  Available Pages ({filteredPages.length})
                </p>
                {filteredPages.map(page => (
                  <div 
                    key={page.page}
                    className="p-3 bg-[#16365B]/40 border border-[#16365B] rounded hover:border-[#B9E5FF]/40 transition-colors flex items-start justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-medium text-white text-sm">{page.title}</h4>
                      <p className="text-xs text-slate-300 mt-0.5">{page.desc}</p>
                    </div>
                    <button
                      onClick={() => {
                        onNavigate(page.page);
                        onClose();
                      }}
                      className="px-3 py-1 bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-xs font-medium rounded transition-colors shrink-0"
                    >
                      Visit
                    </button>
                  </div>
                ))}
                {filteredPages.length === 0 && (
                  <p className="text-slate-400 text-xs py-4 text-center">
                    No matching pages found for "{searchQuery}".
                  </p>
                )}
              </div>
            </div>
          )}

          {modalType === 'feedback' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                We value accuracy and user perspective. If you spot an error, confusing wording, or want to suggest regional energy factors, let us know.
              </p>

              {feedbackSent ? (
                <div className="bg-[#16365B] border border-[#B9E5FF]/40 p-4 rounded text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#B9E5FF] mx-auto" />
                  <p className="font-medium text-white text-sm">Thank You for Your Feedback</p>
                  <p className="text-xs text-slate-300">
                    Your note has been recorded for the engineering and research team review.
                  </p>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (feedbackText.trim()) setFeedbackSent(true);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Feedback Type</label>
                    <select
                      value={feedbackCategory}
                      onChange={(e) => setFeedbackCategory(e.target.value)}
                      className="w-full bg-[#071629] border border-[#16365B] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B9E5FF]"
                    >
                      <option value="correction">Factual / Typo Correction</option>
                      <option value="regional">Regional Energy Specifics</option>
                      <option value="feature">Planned Feature Suggestion</option>
                      <option value="accessibility">Accessibility Observation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Details & Context</label>
                    <textarea
                      rows={4}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      required
                      placeholder="Please describe the correction or observation..."
                      className="w-full bg-[#071629] border border-[#16365B] rounded p-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#B9E5FF]"
                    />
                  </div>

                  <div className="text-[11px] text-amber-200/80 bg-amber-950/30 p-2 rounded border border-amber-900/40">
                    Notice: Feedback captured in Stage 1 is stored locally for product iteration.
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-3 py-1.5 text-xs rounded border border-[#16365B] text-slate-300 hover:bg-[#16365B]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!feedbackText.trim()}
                      className="px-4 py-1.5 text-xs font-semibold rounded bg-[#B9E5FF] text-[#071629] hover:bg-white disabled:opacity-50"
                    >
                      Submit Feedback
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {modalType === 'legal' && (
            <div className="space-y-3 text-xs leading-relaxed">
              <h4 className="font-semibold text-white text-sm">Entity Status & Pre-Incorporation Disclosure</h4>
              <p>
                <strong>EnerGuru</strong> is an early-stage digital product concept operating under the working company name <strong>Tekm EnerGuru Technologies and Solutions</strong>.
              </p>
              <p>
                This website is currently published as an informational prototype and foundational public portal. The platform has not yet finalized formal statutory incorporation and is not offering commercial utility services, retail electricity, licensed engineering certification, or warranty-backed products.
              </p>
              <p>
                All trademarks, logos, and service names referenced herein remain the intellectual property of their respective creators during the development lifecycle.
              </p>
            </div>
          )}

          {modalType === 'privacy' && (
            <div className="space-y-3 text-xs leading-relaxed">
              <h4 className="font-semibold text-white text-sm">Privacy Guidelines</h4>
              <p>
                At EnerGuru and Tekm EnerGuru Technologies and Solutions, data stewardship and privacy are built into our architectural planning from day one.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-300">
                <li><strong>No Tracking Pixels:</strong> We do not deploy invasive third-party ad retargeting trackers or behavioral monitoring tools.</li>
                <li><strong>Voluntary Details Only:</strong> Information submitted via contact inquiries or newsletter sign-ups is used strictly to communicate product milestones.</li>
                <li><strong>Data Retention:</strong> You may request full removal of your email from early waiting lists at any time by contacting our support channel.</li>
              </ul>
              <p className="text-slate-400">
                A formalized, jurisdiction-compliant Privacy Policy will be published alongside the live backend user authentication deployment.
              </p>
            </div>
          )}

          {modalType === 'terms' && (
            <div className="space-y-3 text-xs leading-relaxed">
              <h4 className="font-semibold text-white text-sm">Terms of Public Website Use</h4>
              <p>
                By accessing this public preview website, you acknowledge that EnerGuru is an evolving initiative under development by Tekm EnerGuru Technologies and Solutions.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-300">
                <li><strong>Informational Purposes:</strong> The content provided across all public pages is intended exclusively for educational, awareness, and conceptual planning purposes.</li>
                <li><strong>No Commercial Reliance:</strong> Users should not base mission-critical electrical installations, life-support power decisions, or regulatory compliance strictly on pre-release guidance.</li>
                <li><strong>Updates:</strong> Features, timelines, and interface capabilities may change without prior notice as development progresses.</li>
              </ul>
            </div>
          )}

          {modalType === 'disclaimer' && (
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>General Energy & Safety Disclaimer</span>
              </div>
              <p>
                Electricity, backup generators, high-capacity inverter batteries, and solar PV installations carry inherent physical and fire hazards.
              </p>
              <p className="bg-[#16365B]/60 p-3 rounded border border-[#16365B] text-slate-200">
                <strong>Always consult certified professionals:</strong> EnerGuru does not replace qualified, licensed electricians, certified solar technicians, fire safety codes, or official instructions from your local utility provider. Always adhere to local electrical wiring codes and equipment manufacturer manuals.
              </p>
              <p>
                Calculations or tips presented on EnerGuru are conceptual indicators and do not constitute an engineering guarantee or certified utility audit.
              </p>
            </div>
          )}

          {modalType === 'affiliate' && (
            <div className="space-y-3 text-xs leading-relaxed">
              <h4 className="font-semibold text-white text-sm">Affiliate & Commercial Relationship Disclosure</h4>
              <p>
                Transparency is a core pillar of EnerGuru's philosophy.
              </p>
              <p>
                <strong>Current Status:</strong> EnerGuru currently maintains <em>no active commercial affiliate links, sponsored hardware promotions, or paid commission partnerships</em>.
              </p>
              <p>
                <strong>Future Policy:</strong> In future platform stages, if EnerGuru ever links to third-party equipment (such as surge protectors, battery monitors, solar gear, or maintenance supplies) that yields an affiliate commission, every single link will be clearly and explicitly tagged with visible affiliate labeling prior to redirection.
              </p>
            </div>
          )}

          {modalType === 'forgot-password' && (
            <div className="space-y-3 text-xs">
              <p>
                Enter the email address associated with your EnerGuru account to receive recovery instructions.
              </p>

              {resetError && (
                <div className="p-3 bg-[#071629] border border-rose-800/60 rounded flex items-start gap-2 text-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{resetError}</span>
                </div>
              )}

              {resetSubmitted ? (
                <div className="bg-[#16365B] border border-[#B9E5FF]/50 p-4 rounded text-center space-y-1.5">
                  <CheckCircle2 className="w-6 h-6 text-[#B9E5FF] mx-auto" />
                  <p className="font-medium text-white text-sm">Recovery Email Dispatched</p>
                  <p className="text-slate-300 text-xs">
                    If an EnerGuru account matches <strong className="text-white">{resetEmail}</strong>, you will receive password reset instructions shortly.
                  </p>
                </div>
              ) : (
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setResetError(null);
                    if (!resetEmail.includes('@')) {
                      setResetError('Please enter a valid email address.');
                      return;
                    }
                    if (!isSupabaseConfigured) {
                      setResetError('Supabase configuration is not active.');
                      return;
                    }
                    setIsResetting(true);
                    try {
                      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
                        redirectTo: getAuthRedirectUrl(),
                      });
                      if (error) {
                        setResetError(error.message);
                      } else {
                        setResetSubmitted(true);
                      }
                    } catch (err: unknown) {
                      setResetError(err instanceof Error ? err.message : 'Failed to request recovery link.');
                    } finally {
                      setIsResetting(false);
                    }
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Account Email</label>
                    <input
                      type="email"
                      required
                      disabled={isResetting}
                      placeholder="user@example.com"
                      value={resetEmail}
                      onChange={(e) => {
                        setResetEmail(e.target.value);
                        if (resetError) setResetError(null);
                      }}
                      className="w-full bg-[#071629] border border-[#16365B] rounded px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#B9E5FF] disabled:opacity-60"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-3 py-1.5 text-xs rounded border border-[#16365B] text-slate-300 hover:bg-[#16365B]"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isResetting}
                      className="px-4 py-1.5 text-xs font-semibold rounded bg-[#B9E5FF] text-[#071629] hover:bg-white disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isResetting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>{isResetting ? 'Sending...' : 'Request Recovery Link'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#16365B] bg-[#071629] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium bg-[#16365B] hover:bg-slate-700 text-white rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
