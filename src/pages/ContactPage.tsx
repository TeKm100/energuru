import React, { useState } from 'react';
import { Page } from '../types';
import { AlertCircle, CheckCircle, Mail, Clock, HelpCircle, Loader2, Send } from 'lucide-react';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = 'Please provide your name.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errs.email = 'Please enter a valid email address.';
      }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validate();
    setErrors(validationErrors);
    setServerError(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('https://formspree.io/f/mdeaqwvk', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          _subject: `EnerGuru General Inquiry: ${formData.subject.trim()}`,
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
      } else {
        let errorMsg = 'Formspree was unable to process your message. Please verify your details and try again.';
        try {
          const data = await response.json();
          if (data && data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
            errorMsg = data.errors.map((err: any) => err.message || err.field).join('. ');
          } else if (data && data.error) {
            errorMsg = data.error;
          }
        } catch {
          // Keep default error message
        }
        setServerError(errorMsg);
      }
    } catch {
      setServerError('A network error occurred while sending your message. Please verify your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
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

      {/* Direct Inquiries Dispatch Notice */}
      <section className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-[#B9E5FF] font-semibold text-sm">
          <Mail className="w-5 h-5 shrink-0 text-[#B9E5FF]" />
          <span>General Enquiries Dispatch</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Inquiries submitted through this form are delivered securely to the EnerGuru team inbox via our verified Formspree dispatch service.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="md:col-span-2 bg-[#0B1B33] border border-[#16365B] rounded-xl p-6 sm:p-8">
          {submitSuccess ? (
            <div className="space-y-6">
              <div className="bg-[#16365B]/50 border border-emerald-500/40 rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-6 h-6 shrink-0" />
                  <h3 className="text-base font-bold text-white">Message Delivered Successfully</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Thank you for reaching out, <strong className="text-white">{formData.name}</strong>. Your message has been received by the EnerGuru team. We will review your inquiry and reply to <strong className="text-[#B9E5FF]">{formData.email}</strong> shortly.
                </p>
                <div className="bg-[#071629] p-3 rounded border border-[#16365B] text-xs space-y-1.5 text-slate-300">
                  <p><strong className="text-white">Sender:</strong> {formData.name} ({formData.email})</p>
                  <p><strong className="text-white">Subject:</strong> {formData.subject}</p>
                  <p><strong className="text-white">Status:</strong> Dispatched to team inbox</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmitSuccess(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                  setServerError(null);
                  setErrors({});
                }}
                className="text-xs text-[#B9E5FF] hover:underline cursor-pointer"
              >
                ← Clear form and send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {serverError && (
                <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-lg flex items-start gap-3 text-xs text-rose-200">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold block text-rose-100">Unable to Send Message</span>
                    <p>{serverError}</p>
                    <p className="text-[11px] text-rose-300/80">Please check your details and try again.</p>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="contact-name" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name <span className="text-[#B9E5FF]">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  disabled={isSubmitting}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className={`w-full bg-[#071629] border rounded px-3.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors disabled:opacity-60 ${
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
                  disabled={isSubmitting}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className={`w-full bg-[#071629] border rounded px-3.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors disabled:opacity-60 ${
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
                  disabled={isSubmitting}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Inquiry regarding regional generator maintenance logs"
                  className={`w-full bg-[#071629] border rounded px-3.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors disabled:opacity-60 ${
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
                  disabled={isSubmitting}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe your question or context..."
                  className={`w-full bg-[#071629] border rounded px-3.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors disabled:opacity-60 ${
                    errors.message ? 'border-amber-400 focus:border-amber-400' : 'border-[#16365B] focus:border-[#B9E5FF]'
                  }`}
                />
                {errors.message && <p className="text-xs text-amber-300 mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 rounded bg-[#B9E5FF] text-[#071629] font-semibold text-sm hover:bg-white transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#071629]" />
                    <span>Sending Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#071629]" />
                    <span>Send Inquiry</span>
                  </>
                )}
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
