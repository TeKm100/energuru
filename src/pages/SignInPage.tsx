import React, { useState } from 'react';
import { Page, InfoModalType } from '../types';
import { Logo } from '../components/Logo';
import { supabase, isSupabaseConfigured, supabaseUrl } from '../lib/supabase';
import { AlertCircle, CheckCircle2, Info, Loader2, Eye, EyeOff } from 'lucide-react';

interface SignInPageProps {
  onNavigate: (page: Page) => void;
  onOpenModal: (type: InfoModalType) => void;
  authNotice?: {
    type: 'success' | 'error' | 'info';
    text: string;
    detail?: string;
  } | null;
  onClearAuthNotice?: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ 
  onNavigate, 
  onOpenModal, 
  authNotice, 
  onClearAuthNotice 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    onClearAuthNotice?.();

    const errs: Record<string, string> = {};

    if (!email.trim()) {
      errs.email = 'Please enter your email.';
    } else if (!email.includes('@')) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Please enter your password.';
    }

    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      return;
    }

    if (!isSupabaseConfigured) {
      setServerError('Supabase configuration is not active. Please ensure SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are configured in AI Studio.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        const errorMsg = error.message.toLowerCase();
        if (errorMsg.includes('failed to fetch') || errorMsg.includes('network')) {
          setServerError(`Connection failed: Unable to communicate with the Supabase authentication server (${supabaseUrl || 'configured endpoint'}). Please verify your internet connection.`);
        } else if (errorMsg.includes('invalid login credentials')) {
          setServerError('Invalid login credentials. Please verify your email and password.');
        } else if (errorMsg.includes('email not confirmed')) {
          setServerError('Your email address has not been confirmed yet. Please check your inbox for the verification email.');
        } else {
          setServerError(error.message);
        }
        return;
      }

      if (data.session) {
        onNavigate('dashboard');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during sign-in.';
      if (message.toLowerCase().includes('failed to fetch')) {
        setServerError(`Connection failed: Unable to communicate with the Supabase authentication server (${supabaseUrl || 'configured endpoint'}).`);
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
          {/* Centered company name directly beneath the brand */}
          <p className="text-xs text-slate-300 font-medium tracking-wide text-center">
            Tekm EnerGuru Technologies and Solutions
          </p>
        </div>

        {/* Global Auth Notice banner (Email verification result, password recovery result) */}
        {authNotice && (
          <div className={`p-3.5 rounded-lg flex items-start gap-2.5 text-xs border ${
            authNotice.type === 'success' 
              ? 'bg-[#071629] border-emerald-800/80 text-emerald-200' 
              : authNotice.type === 'error'
              ? 'bg-[#071629] border-rose-800/80 text-rose-200'
              : 'bg-[#071629] border-[#16365B] text-[#B9E5FF]'
          }`}>
            {authNotice.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />}
            {authNotice.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />}
            {authNotice.type === 'info' && <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#B9E5FF]" />}
            <div className="space-y-0.5 flex-1 leading-relaxed">
              <p className="font-semibold text-white">{authNotice.text}</p>
              {authNotice.detail && <p className="text-[11px] opacity-90">{authNotice.detail}</p>}
            </div>
          </div>
        )}

        {/* Server Error banner */}
        {serverError && (
          <div className="p-3.5 bg-[#071629] border border-rose-800/60 rounded-lg flex items-start gap-2.5 text-xs text-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <p className="leading-relaxed flex-1">{serverError}</p>
          </div>
        )}

        {/* Form fields: Notice NO separate "Welcome back" or "Sign In" heading above the fields */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="signin-email" className="block text-xs font-medium text-slate-300 mb-1.5">
              Email
            </label>
            <input
              id="signin-email"
              type="email"
              value={email}
              disabled={isLoading}
              onChange={(e) => {
                setEmail(e.target.value);
                if (serverError) setServerError(null);
                if (authNotice) onClearAuthNotice?.();
              }}
              placeholder="name@example.com"
              className={`w-full bg-[#071629] border rounded px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors disabled:opacity-60 ${
                errors.email ? 'border-amber-400' : 'border-[#16365B] focus:border-[#B9E5FF]'
              }`}
            />
            {errors.email && <p className="text-xs text-amber-300 mt-1">{errors.email}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="signin-password" className="block text-xs font-medium text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-xs text-[#B9E5FF] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                disabled={isLoading}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (serverError) setServerError(null);
                }}
                placeholder="••••••••"
                className={`w-full bg-[#071629] border rounded pl-3.5 pr-10 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors disabled:opacity-60 ${
                  errors.password ? 'border-amber-400' : 'border-[#16365B] focus:border-[#B9E5FF]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-amber-300 mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded bg-[#B9E5FF] text-[#071629] font-semibold text-sm hover:bg-white transition-colors cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Create Account link */}
        <div className="pt-2 text-center text-xs text-slate-400 border-t border-[#16365B]">
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={() => onNavigate('create-account')}
            className="text-[#B9E5FF] font-medium hover:underline cursor-pointer"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};
