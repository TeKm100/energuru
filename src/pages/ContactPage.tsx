import React, { useState } from 'react';
import { Page } from '../types';
import { AlertCircle, CheckCircle, Mail, Clock, HelpCircle } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: Page) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionAttempted, setSubmissionAttempted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = 'Please provide your name.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.subject.trim()) {
      errs.subject = 'Please provide a subject.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please write your message.';
    } else if (formData.message.trim().length < 15) {
      errs.message = 'Please provide a bit more detail (minimum 15 characters).';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSubmissionAttempted(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12 pb-20">
      {/* Title */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#16365B]/60 border border-[#16365B] text-xs font-medium text-[#B9E5FF]">
          <span>Contact & Inquiries</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Get in Touch with the EnerGuru Team
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
          Questions about our roadmap, suggestions on local grid considerations, or prospective development collaboration? 
          We welcome your inquiries.
        </p>
      </section>

      {/* Backend Integration Transparency Banner */}
      <section className="bg-[#0B1B33] border border-amber-800/60 rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>Notice: Form Submissions Require Backend Integration</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          In this Stage 1 public website foundation, external email dispatch services (e.g., SMTP or SendGrid API) 
          are not yet wired up. This form performs client-side field validation and demonstrates the workflow, 
          but will <strong>not</strong> claim an email was dispatched until live email infrastructure is provisioned.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="md:col-span-2 bg-[#0B1B33] border border-[#16365B] rounded-xl p-6 sm:p-8">
          {submissionAttempted ? (
            <div className="space-y-6">
              <div className="bg-[#16365B]/50 border border-[#B9E5FF]/40 rounded-lg p-6 space-y-3">
                <div className="flex items-center gap-2 text-[#B9E5FF]">
                  <CheckCircle className="w-6 h-6 shrink-0" />
                  <h3 className="text-base font-bold text-white">Form Validation Successful</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your inquiry details have been verified locally:
                </p>
                <div className="bg-[#071629] p-3 rounded border border-[#16365B] text-xs space-y-1.5 text-slate-300">
                  <p><strong className="text-white">Sender:</strong> {formData.name} ({formData.email})</p>
                  <p><strong className="text-white">Subject:</strong> {formData.subject}</p>
                  <p><strong className="text-white">Message preview:</strong> “{formData.message.slice(0, 120)}{formData.message.length > 120 ? '...' : ''}”</p>
                </div>
                <div className="pt-2 text-xs text-amber-200/90 bg-amber-950/40 p-3 rounded border border-amber-800/40">
                  <strong>Backend Connection Pending:</strong> As noted above, message dispatch requires connecting an email API or database service during Stage 2 infrastructure setup. No fake email was simulated.
                </div>
              </div>

              <button
                onClick={() => {
                  setSubmissionAttempted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
                className="text-xs text-[#B9E5FF] hover:underline cursor-pointer"
              >
                ← Clear form and prepare another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="contact-name" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name <span className="text-[#B9E5FF]">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className={`w-full bg-[#071629] border rounded px-3.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors ${
                    errors.name ? 'border-amber-400 focus:border-amber-400' : 'border-[#16365B] focus:border-[#B9E5FF]'
                  }`}
                />
                {errors.name && <p className="text-xs text-amber-300 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address <span className="text-[#B9E5FF]">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className={`w-full bg-[#071629] border rounded px-3.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors ${
                    errors.email ? 'border-amber-400 focus:border-amber-400' : 'border-[#16365B] focus:border-[#B9E5FF]'
                  }`}
                />
                {errors.email && <p className="text-xs text-amber-300 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Subject <span className="text-[#B9E5FF]">*</span>
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Inquiry regarding regional generator maintenance logs"
                  className={`w-full bg-[#071629] border rounded px-3.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors ${
                    errors.subject ? 'border-amber-400 focus:border-amber-400' : 'border-[#16365B] focus:border-[#B9E5FF]'
                  }`}
                />
                {errors.subject && <p className="text-xs text-amber-300 mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Message Details <span className="text-[#B9E5FF]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe your question or context..."
                  className={`w-full bg-[#071629] border rounded px-3.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors ${
                    errors.message ? 'border-amber-400 focus:border-amber-400' : 'border-[#16365B] focus:border-[#B9E5FF]'
                  }`}
                />
                {errors.message && <p className="text-xs text-amber-300 mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded bg-[#B9E5FF] text-[#071629] font-semibold text-sm hover:bg-white transition-colors cursor-pointer"
              >
                Validate & Submit Inquiry
              </button>
            </form>
          )}
        </div>

        {/* Sidebar Info Column */}
        <div className="space-y-6">
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Mail className="w-4 h-4 text-[#B9E5FF]" />
              <span>Project Inquiries</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tekm EnerGuru Technologies and Solutions welcomes technical feedback, equipment specs, and regional insights.
            </p>
            <div className="text-xs text-slate-400 pt-1 font-mono">
              inquiries@energuru.platform (designated placeholder)
            </div>
          </div>

          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Clock className="w-4 h-4 text-[#B9E5FF]" />
              <span>Response Expectations</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              As an active engineering project, correspondence is reviewed directly by our founding researchers and product builders.
            </p>
          </div>

          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <HelpCircle className="w-4 h-4 text-[#B9E5FF]" />
              <span>Looking for Guidance?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Review our 5-phase operational roadmap to see what capabilities are currently queued.
            </p>
            <button
              onClick={() => onNavigate('how-it-works')}
              className="text-xs text-[#B9E5FF] hover:underline cursor-pointer block"
            >
              Explore How It Works →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
