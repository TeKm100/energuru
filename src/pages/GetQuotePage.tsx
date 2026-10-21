import React, { useState, useEffect } from 'react';
import { Page, QuoteEnquiry, QuoteStatus, UserProfile } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  FileText, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Phone, 
  Mail, 
  MessageSquare, 
  Send, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Copy, 
  Check,
  Clock,
  Sparkles
} from 'lucide-react';

interface GetQuotePageProps {
  onNavigate: (page: Page) => void;
  userProfile?: UserProfile | null;
  userEmail?: string | null;
  userId?: string | null;
}

export const GetQuotePage: React.FC<GetQuotePageProps> = ({
  onNavigate,
  userProfile,
  userEmail,
  userId,
}) => {
  const [formData, setFormData] = useState({
    fullName: userProfile?.full_name || '',
    email: userEmail || userProfile?.email || '',
    contactChannel: 'whatsapp' as 'whatsapp' | 'telegram' | 'email' | 'callback',
    contactDetail: '',
    stateLocation: 'Lagos',
    customerType: 'household' as 'household' | 'small-business' | 'hotel' | 'institution' | 'other',
    energyProblem: '',
    equipmentCount: '1-2 items',
    installationNeeded: 'yes' as 'yes' | 'no' | 'unsure',
    additionalDetails: '',
    consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState<QuoteEnquiry | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [myQuotes, setMyQuotes] = useState<QuoteEnquiry[]>([]);

  // Pre-fill user data if available
  useEffect(() => {
    if (userProfile?.full_name && !formData.fullName) {
      setFormData((prev) => ({ ...prev, fullName: userProfile.full_name || '' }));
    }
    if (userEmail && !formData.email) {
      setFormData((prev) => ({ ...prev, email: userEmail }));
    }
  }, [userProfile, userEmail]);

  // Load existing quotes for this session
  useEffect(() => {
    try {
      const stored = localStorage.getItem('energuru_quote_history');
      if (stored) {
        setMyQuotes(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) errs.fullName = 'Please enter your full name.';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Please provide a valid email address.';
    }

    if (formData.contactChannel !== 'email' && !formData.contactDetail.trim()) {
      errs.contactDetail = `Please enter your ${
        formData.contactChannel === 'whatsapp' ? 'WhatsApp phone number' : 
        formData.contactChannel === 'telegram' ? 'Telegram handle or phone number' : 
        'telephone number for callback'
      }.`;
    }

    if (!formData.stateLocation.trim()) errs.stateLocation = 'Please specify your state or region.';
    if (!formData.energyProblem.trim()) errs.energyProblem = 'Please describe your main energy problem or monitoring need.';
    if (!formData.consent) errs.consent = 'You must consent to be contacted regarding this quotation request.';

    return errs;
  };

  const generateReference = () => {
    const year = new Date().getFullYear();
    const randomHex = Math.floor(100000 + Math.random() * 900000);
    return `EG-QT-${year}-${randomHex}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);

    const ref = generateReference();
    const newQuoteRecord: QuoteEnquiry = {
      id: `quote-${Date.now()}`,
      reference: ref,
      user_id: userId || null,
      full_name: formData.fullName.trim(),
      email: formData.email.trim(),
      contact_channel: formData.contactChannel,
      contact_detail: formData.contactDetail.trim() || formData.email.trim(),
      state_location: formData.stateLocation.trim(),
      customer_type: formData.customerType,
      energy_problem: formData.energyProblem.trim(),
      equipment_count: formData.equipmentCount,
      installation_needed: formData.installationNeeded,
      additional_details: formData.additionalDetails.trim() || undefined,
      consent: formData.consent,
      status: 'Submitted',
      created_at: new Date().toISOString(),
    };

    try {
      // 1. Attempt Supabase persistence if table exists
      if (isSupabaseConfigured) {
        const { error: dbError } = await supabase
          .from('quote_enquiries')
          .insert([
            {
              reference: newQuoteRecord.reference,
              user_id: newQuoteRecord.user_id,
              full_name: newQuoteRecord.full_name,
              email: newQuoteRecord.email,
              contact_channel: newQuoteRecord.contact_channel,
              contact_detail: newQuoteRecord.contact_detail,
              state_location: newQuoteRecord.state_location,
              customer_type: newQuoteRecord.customer_type,
              energy_problem: newQuoteRecord.energy_problem,
              equipment_count: newQuoteRecord.equipment_count,
              installation_needed: newQuoteRecord.installation_needed,
              additional_details: newQuoteRecord.additional_details,
              status: 'Submitted',
            },
          ]);

        if (dbError) {
          // If table does not yet exist in schema, log diagnostic without breaking user flow
          console.warn('Note: public.quote_enquiries table not found in Supabase schema. Storing locally:', dbError.message);
        }
      }

      // 2. Persist locally for immediate user access
      const updatedList = [newQuoteRecord, ...myQuotes];
      setMyQuotes(updatedList);
      try {
        localStorage.setItem('energuru_quote_history', JSON.stringify(updatedList));
      } catch {
        // ignore
      }

      setSubmittedQuote(newQuoteRecord);
    } catch (err) {
      console.error('Submission error:', err);
      // Still show receipt so user does not lose their inputs
      setSubmittedQuote(newQuoteRecord);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyReference = () => {
    if (submittedQuote?.reference) {
      navigator.clipboard.writeText(submittedQuote.reference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

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
              Get a Quote
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 pl-8">
            Tell us about your property, backup hardware, and energy goals for tailored technical consultation.
          </p>
        </div>

        <div className="flex items-center gap-2 pl-8 md:pl-0">
          <StatusBadge status="available" label="Quotation Service Open" />
        </div>
      </div>

      {/* Honest Legal Disclaimer */}
      <div className="bg-[#0B1B33] border-l-4 border-[#B9E5FF] border-y border-r border-[#16365B] rounded-r-xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-[#B9E5FF] font-bold text-sm">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Non-Binding Quotation Notice</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Submitting this quotation inquiry does not constitute a financial order, guarantee immediate hardware delivery, 
          or establish a binding contract. Prices and technical specifications are prepared individually following site review.
        </p>
      </div>

      {/* Main Content */}
      {submittedQuote ? (
        /* Confirmation Receipt */
        <div className="max-w-3xl mx-auto bg-[#0B1B33] border border-[#16365B] rounded-2xl p-6 sm:p-10 space-y-6 shadow-2xl">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-600/50 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Quotation Request Received</h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Thank you, <strong className="text-white">{submittedQuote.full_name}</strong>. Your quotation request has been 
              assigned a unique tracking reference.
            </p>
          </div>

          <div className="p-4 bg-[#071629] border border-[#16365B] rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#16365B]/60 pb-2">
              <span className="text-xs text-slate-400">Tracking Reference:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#B9E5FF] text-sm">{submittedQuote.reference}</span>
                <button
                  onClick={handleCopyReference}
                  className="p-1 hover:text-white text-slate-400 rounded transition-colors"
                  title="Copy reference"
                >
                  {copiedRef ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Preferred Channel:</span>
                <span className="text-white font-medium capitalize">{submittedQuote.contact_channel} ({submittedQuote.contact_detail})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Location / State:</span>
                <span className="text-white font-medium">{submittedQuote.state_location}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Customer Type:</span>
                <span className="text-white font-medium capitalize">{submittedQuote.customer_type}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Current Status:</span>
                <span className="text-cyan-300 font-mono font-medium">{submittedQuote.status}</span>
              </div>
            </div>
          </div>

          {/* Workflow Status Timeline */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-white block">Next Review Stages:</span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center text-[10px] font-mono">
              <span className="p-1.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">Submitted</span>
              <span className="p-1.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">Under Review</span>
              <span className="p-1.5 rounded bg-slate-800 text-slate-400">Info Check</span>
              <span className="p-1.5 rounded bg-slate-800 text-slate-400">Quote Prep</span>
              <span className="p-1.5 rounded bg-slate-800 text-slate-400">Sent</span>
              <span className="p-1.5 rounded bg-slate-800 text-slate-400">Closed</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#16365B]/60 flex justify-between items-center text-xs">
            <button
              onClick={() => {
                setSubmittedQuote(null);
                setFormData({
                  fullName: userProfile?.full_name || '',
                  email: userEmail || '',
                  contactChannel: 'whatsapp',
                  contactDetail: '',
                  stateLocation: 'Lagos',
                  customerType: 'household',
                  energyProblem: '',
                  equipmentCount: '1-2 items',
                  installationNeeded: 'yes',
                  additionalDetails: '',
                  consent: false,
                });
              }}
              className="text-[#B9E5FF] hover:underline cursor-pointer"
            >
              ← Submit Another Inquiry
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-white font-semibold rounded-lg transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      ) : (
        /* The Form Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-[#0B1B33] border border-[#16365B] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#16365B] pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#B9E5FF]" />
                <span>Quotation Request Form</span>
              </h2>
              <p className="text-xs text-slate-400">
                Please complete all required fields so we can estimate your equipment and hardware sizing accurately.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs" noValidate>
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quote-name" className="block text-slate-300 font-medium mb-1.5">
                    Full Name <span className="text-[#B9E5FF]">*</span>
                  </label>
                  <input
                    id="quote-name"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Samuel Bennett"
                    className={`w-full bg-[#071629] border rounded px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-colors ${
                      errors.fullName ? 'border-amber-400' : 'border-[#16365B] focus:border-[#B9E5FF]'
                    }`}
                  />
                  {errors.fullName && <p className="text-amber-300 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="quote-email" className="block text-slate-300 font-medium mb-1.5">
                    Email Address <span className="text-[#B9E5FF]">*</span>
                  </label>
                  <input
                    id="quote-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className={`w-full bg-[#071629] border rounded px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-colors ${
                      errors.email ? 'border-amber-400' : 'border-[#16365B] focus:border-[#B9E5FF]'
                    }`}
                  />
                  {errors.email && <p className="text-amber-300 mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Preferred Contact Channel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quote-channel" className="block text-slate-300 font-medium mb-1.5">
                    Preferred Contact Channel <span className="text-[#B9E5FF]">*</span>
                  </label>
                  <select
                    id="quote-channel"
                    value={formData.contactChannel}
                    onChange={(e) => setFormData({ ...formData, contactChannel: e.target.value as any })}
                    className="w-full bg-[#071629] border border-[#16365B] rounded px-3.5 py-2.5 text-white focus:outline-none focus:border-[#B9E5FF]"
                  >
                    <option value="whatsapp">WhatsApp Message</option>
                    <option value="telegram">Telegram</option>
                    <option value="email">Email</option>
                    <option value="callback">Direct Phone Call</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="quote-contact-detail" className="block text-slate-300 font-medium mb-1.5">
                    {formData.contactChannel === 'whatsapp' ? 'WhatsApp Phone Number' :
                     formData.contactChannel === 'telegram' ? 'Telegram Username or Mobile' :
                     formData.contactChannel === 'callback' ? 'Direct Callback Phone Number' :
                     'Alternate Email (Optional)'} <span className="text-[#B9E5FF]">*</span>
                  </label>
                  <input
                    id="quote-contact-detail"
                    type="text"
                    required={formData.contactChannel !== 'email'}
                    placeholder={
                      formData.contactChannel === 'whatsapp' ? '+234 801 234 5678' :
                      formData.contactChannel === 'telegram' ? '@username or phone' :
                      '+234 801 234 5678'
                    }
                    value={formData.contactDetail}
                    onChange={(e) => setFormData({ ...formData, contactDetail: e.target.value })}
                    className={`w-full bg-[#071629] border rounded px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-colors ${
                      errors.contactDetail ? 'border-amber-400' : 'border-[#16365B] focus:border-[#B9E5FF]'
                    }`}
                  />
                  {errors.contactDetail && <p className="text-amber-300 mt-1">{errors.contactDetail}</p>}
                </div>
              </div>

              {/* State & Customer Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="quote-state" className="block text-slate-300 font-medium mb-1.5">
                    State / Location <span className="text-[#B9E5FF]">*</span>
                  </label>
                  <input
                    id="quote-state"
                    type="text"
                    required
                    placeholder="e.g. Lagos, Abuja, Rivers"
                    value={formData.stateLocation}
                    onChange={(e) => setFormData({ ...formData, stateLocation: e.target.value })}
                    className={`w-full bg-[#071629] border rounded px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-colors ${
                      errors.stateLocation ? 'border-amber-400' : 'border-[#16365B] focus:border-[#B9E5FF]'
                    }`}
                  />
                  {errors.stateLocation && <p className="text-amber-300 mt-1">{errors.stateLocation}</p>}
                </div>

                <div>
                  <label htmlFor="quote-type" className="block text-slate-300 font-medium mb-1.5">
                    Customer / Facility Type
                  </label>
                  <select
                    id="quote-type"
                    value={formData.customerType}
                    onChange={(e) => setFormData({ ...formData, customerType: e.target.value as any })}
                    className="w-full bg-[#071629] border border-[#16365B] rounded px-3.5 py-2.5 text-white focus:outline-none focus:border-[#B9E5FF]"
                  >
                    <option value="household">Household / Residential</option>
                    <option value="small-business">Small Business / Shop</option>
                    <option value="hotel">Hotel / Hospitality</option>
                    <option value="institution">Institution / Clinic / School</option>
                    <option value="other">Other Commercial Facility</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="quote-count" className="block text-slate-300 font-medium mb-1.5">
                    Approximate Hardware Units
                  </label>
                  <select
                    id="quote-count"
                    value={formData.equipmentCount}
                    onChange={(e) => setFormData({ ...formData, equipmentCount: e.target.value })}
                    className="w-full bg-[#071629] border border-[#16365B] rounded px-3.5 py-2.5 text-white focus:outline-none focus:border-[#B9E5FF]"
                  >
                    <option value="1 site (single connector)">1 site (1 connector)</option>
                    <option value="2-5 sites / equipment">2–5 items / locations</option>
                    <option value="6-15 commercial points">6–15 commercial points</option>
                    <option value="15+ enterprise network">15+ enterprise deployment</option>
                  </select>
                </div>
              </div>

              {/* Installation Need */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Do you require on-site technical installation and wiring consultation?
                </label>
                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="install"
                      checked={formData.installationNeeded === 'yes'}
                      onChange={() => setFormData({ ...formData, installationNeeded: 'yes' })}
                      className="text-[#B9E5FF]"
                    />
                    <span>Yes, include professional technician visit</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="install"
                      checked={formData.installationNeeded === 'no'}
                      onChange={() => setFormData({ ...formData, installationNeeded: 'no' })}
                      className="text-[#B9E5FF]"
                    />
                    <span>No, self-install with licensed electrician</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="install"
                      checked={formData.installationNeeded === 'unsure'}
                      onChange={() => setFormData({ ...formData, installationNeeded: 'unsure' })}
                      className="text-[#B9E5FF]"
                    />
                    <span>Unsure / Need guidance</span>
                  </label>
                </div>
              </div>

              {/* Energy Problem Description */}
              <div>
                <label htmlFor="quote-problem" className="block text-slate-300 font-medium mb-1.5">
                  Main Energy Problem or Monitoring Need <span className="text-[#B9E5FF]">*</span>
                </label>
                <textarea
                  id="quote-problem"
                  rows={3}
                  required
                  placeholder="e.g. Erratic grid power tripping our cold room; need live SMS alerts when generator cuts out, and tracking weekly diesel usage."
                  value={formData.energyProblem}
                  onChange={(e) => setFormData({ ...formData, energyProblem: e.target.value })}
                  className={`w-full bg-[#071629] border rounded p-3 text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    errors.energyProblem ? 'border-amber-400' : 'border-[#16365B] focus:border-[#B9E5FF]'
                  }`}
                />
                {errors.energyProblem && <p className="text-amber-300 mt-1">{errors.energyProblem}</p>}
              </div>

              {/* Additional Context */}
              <div>
                <label htmlFor="quote-extra" className="block text-slate-300 font-medium mb-1.5">
                  Additional Details or Existing Equipment Models (Optional)
                </label>
                <input
                  id="quote-extra"
                  type="text"
                  placeholder="e.g. 15 kVA Perkins generator, 5kVA Felicity solar inverter with 48V battery"
                  value={formData.additionalDetails}
                  onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
                  className="w-full bg-[#071629] border border-[#16365B] rounded px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#B9E5FF]"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="p-3 bg-[#071629] rounded-lg border border-[#16365B] space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded border-[#16365B] bg-[#0B1B33] text-[#B9E5FF] focus:ring-0"
                  />
                  <span className="text-slate-300 text-[11px] leading-relaxed">
                    I consent to Tekm EnerGuru Technologies and Solutions contacting me via my selected channel regarding this quotation enquiry. 
                    I understand this inquiry is non-binding and does not establish immediate commercial delivery.
                  </span>
                </label>
                {errors.consent && <p className="text-amber-300 text-[11px]">{errors.consent}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#B9E5FF] hover:bg-white text-[#071629] font-bold text-xs transition-colors cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isSubmitting ? 'Transmitting Request...' : 'Submit Quotation Request'}</span>
              </button>
            </form>
          </div>

          {/* Sidebar Info & Recent Inquiries */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">How We Review Inquiries</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Each submission is reviewed by our electrical engineering team. We cross-reference your generator rating and electrical phase 
                to determine the appropriate CT sensor clamps and cellular antenna specs.
              </p>
              <div className="pt-2 border-t border-[#16365B]/60 text-[11px] text-slate-400">
                Official contact from EnerGuru will always reference your unique tracking number.
              </div>
            </div>

            {/* My Recent Quotes */}
            {myQuotes.length > 0 && (
              <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#B9E5FF]" />
                  <span>My Submitted Quotes ({myQuotes.length})</span>
                </h3>

                <div className="space-y-2.5">
                  {myQuotes.slice(0, 3).map((q) => (
                    <div key={q.id} className="p-3 bg-[#071629] border border-[#16365B] rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[#B9E5FF] font-semibold text-[11px]">{q.reference}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {q.status}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] truncate">{q.energy_problem}</p>
                      <span className="text-slate-500 text-[10px] block">{new Date(q.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
