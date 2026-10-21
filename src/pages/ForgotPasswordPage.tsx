import React, { useState } from 'react';
import { Page } from '../types';
import { Logo } from '../components/Logo';
import { supabase, isSupabaseConfigured, supabaseUrl, getAuthRedirectUrl } from '../lib/supabase';
import { 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft, 
  Mail,
  ShieldCheck 
} from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigate: (page: Page) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setServerError('Please enter your email address.');
      return;
    }

    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setServerError('Please enter a valid email address.');
      return;
    }

    if (!isSupabaseConfigured) {
      setServerError('Supabase configuration is not active. Please ensure environment variables are configured.');
      return;
    }

    setIsLoading(true);

    try {
      // Dynamic origin ensures email link redirects to published website or localhost during dev
      const redirectUrl = getAuthRedirectUrl();

      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: redirectUrl,
      });

      if (error) {
        const errorMsg = error.message.toLowerCase();
        if (errorMsg.includes('failed to fetch') || errorMsg.includes('network')) {
          setServerError(`Connection failed: Unable to communicate with the authentication server (${supabaseUrl || 'configured endpoint'}). Please verify your internet connection.`);
        } else if (errorMsg.includes('rate limit')) {
          setServerError('Too many password reset requests. Please wait a few minutes before trying again.');
        } else {
          // Supabase generic message or error
          setServerError(error.message);
        }
        return;
      }

      // Safe confirmation: Always show confirmation without exposing whether account exists
      setSubmittedEmail(trimmedEmail);
      setIsSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred while requesting password reset.';
      if (message.toLowerCase().includes('failed to fetch')) {
        setServerError(`Connection failed: Unable to reach the authentication server (${supabaseUrl || 'configured endpoint'}).`);
      } else {
        setServerError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md bg-[#0B1B33] border border-[#16365B] rounded-xl p-8 shadow-xl space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <p className="text-xs text-slate-300 font-medium tracking-wide text-center">
            Tekm EnerGuru Technologies and Solutions
          </p>
        </div>

        {/* Success View */}
        {isSubmitted ? (
          <div className="p-5 bg-[#071629] border border-emerald-800/60 rounded-lg text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <Mail className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">Reset Link Dispatched</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                If an EnerGuru account matches <strong className="text-white">{submittedEmail}</strong>, you will receive an email containing a secure password reset link.
              </p>
              <div className="p-3 bg-[#0B1B33] rounded border border-[#16365B] text-[11px] text-slate-300 text-left space-y-1">
                <p className="font-semibold text-[#B9E5FF]">Next Steps:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                  <li>Check your inbox and spam/junk folder.</li>
                  <li>Click the password reset link in the email.</li>
                  <li>You will be redirected back here to enter your new password.</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('signin')}
                className="w-full py-2.5 px-4 rounded bg-[#B9E5FF] text-[#071629] font-semibold text-sm hover:bg-white transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <span>Return to Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                  setServerError(null);
                }}
                className="w-full py-2 px-4 rounded bg-transparent text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
              >
                Try a different email address
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-1 text-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16365B]/60 border border-[#B9E5FF]/20 text-[11px] text-[#B9E5FF] font-medium mb-1">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Account Recovery</span>
              </div>
              <h2 className="text-lg font-bold text-white">Reset Your Password</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter the email address registered with your account. We will send you instructions to choose a new password.
              </p>
            </div>

            {/* Server Error banner */}
            {serverError && (
              <div className="p-3.5 bg-[#071629] border border-rose-800/60 rounded-lg flex items-start gap-2.5 text-xs text-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <p className="leading-relaxed flex-1">{serverError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="forgot-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Registered Email Address <span className="text-[#B9E5FF]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    disabled={isLoading}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (serverError) setServerError(null);
                    }}
                    placeholder="name@example.com"
                    className="w-full bg-[#071629] border border-[#16365B] focus:border-[#B9E5FF] rounded px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors disabled:opacity-60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded bg-[#B9E5FF] text-[#071629] font-semibold text-sm hover:bg-white transition-colors cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isLoading ? 'Sending Reset Link...' : 'Send Recovery Link'}</span>
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-400 border-t border-[#16365B]">
              <button
                type="button"
                onClick={() => onNavigate('signin')}
                className="text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
