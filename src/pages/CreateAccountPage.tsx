import React, { useState, useMemo } from 'react';
import { Page } from '../types';
import { Logo } from '../components/Logo';
import { supabase, isSupabaseConfigured, supabaseUrl, getAuthRedirectUrl } from '../lib/supabase';
import { 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Lock 
} from 'lucide-react';

interface CreateAccountPageProps {
  onNavigate: (page: Page) => void;
}

export const CreateAccountPage: React.FC<CreateAccountPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    preferredNickname: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{
    message: string;
    needsEmailConfirmation: boolean;
    email: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Live Password Strength & Requirements Analysis
  const passwordAnalysis = useMemo(() => {
    const pwd = formData.password;
    const hasMinLength = pwd.length >= 8;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

    const checksPassed = [hasMinLength, hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    let strength: 'Weak' | 'Fair' | 'Good' | 'Strong' = 'Weak';
    let score = 1;

    if (!pwd) {
      score = 0;
      strength = 'Weak';
    } else if (!hasMinLength || checksPassed <= 2) {
      score = 1;
      strength = 'Weak';
    } else if (checksPassed === 3) {
      score = 2;
      strength = 'Fair';
    } else if (checksPassed === 4) {
      score = 3;
      strength = 'Good';
    } else if (checksPassed >= 5 && pwd.length >= 10) {
      score = 4;
      strength = 'Strong';
    } else {
      score = 3;
      strength = 'Good';
    }

    return {
      hasMinLength,
      hasLower,
      hasUpper,
      hasNumber,
      hasSpecial,
      score,
      strength,
      isAcceptable: hasMinLength && checksPassed >= 3,
    };
  }, [formData.password]);

  // Confirmation match calculation
  const confirmMatch = useMemo(() => {
    if (!formData.confirmPassword) return null;
    return formData.password === formData.confirmPassword;
  }, [formData.password, formData.confirmPassword]);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Please enter your full name.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Please enter your email.';
    } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errs.password = 'Please provide a password.';
    } else if (!passwordAnalysis.hasMinLength) {
      errs.password = 'Password must be at least 8 characters.';
    } else if (!passwordAnalysis.isAcceptable) {
      errs.password = 'Password must include a mix of uppercase, lowercase, numbers, or symbols.';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setIsExistingUser(false);
    setSuccessInfo(null);

    const errs = validate();
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
      // Optional nickname: fallback to first name or full name if empty
      const trimmedNickname = formData.preferredNickname.trim();
      const fallbackNickname = trimmedNickname || formData.fullName.trim().split(' ')[0] || formData.fullName.trim();

      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          emailRedirectTo: getAuthRedirectUrl(),
          data: {
            full_name: formData.fullName.trim(),
            nickname: fallbackNickname,
          },
        },
      });

      if (error) {
        // Distinguish error categories
        const errorMsg = error.message.toLowerCase();
        if (errorMsg.includes('already registered') || errorMsg.includes('user already exists') || errorMsg.includes('already in use')) {
          setIsExistingUser(true);
          setServerError('An account with this email address already exists.');
        } else if (errorMsg.includes('failed to fetch') || errorMsg.includes('network') || errorMsg.includes('fetch')) {
          setServerError(
            `Connection failed: Unable to reach the Supabase authentication server (${supabaseUrl || 'configured endpoint'}). Please verify your internet connection.`
          );
        } else if (errorMsg.includes('weak') || errorMsg.includes('password')) {
          setServerError(`Password security requirement: ${error.message}`);
        } else {
          setServerError(error.message);
        }
        return;
      }

      // Check session or confirmation state
      if (data.session) {
        // Auto-confirmed or confirmations disabled: navigate immediately
        onNavigate('dashboard');
      } else if (data.user) {
        // Confirmation required
        setSuccessInfo({
          message: 'Account created successfully! We sent a verification link to your email address.',
          needsEmailConfirmation: true,
          email: formData.email.trim(),
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during account registration.';
      if (message.toLowerCase().includes('failed to fetch')) {
        setServerError(
          `Connection failed: Unable to reach the Supabase server (${supabaseUrl || 'configured endpoint'}). Please check network or CORS availability.`
        );
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

        {/* Server Error banner */}
        {serverError && (
          <div className="p-3.5 bg-[#071629] border border-rose-800/60 rounded-lg space-y-2 text-xs text-rose-200">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <p className="leading-relaxed flex-1">{serverError}</p>
            </div>
            {isExistingUser && (
              <div className="pl-6 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('signin')}
                  className="text-[#B9E5FF] font-semibold underline hover:text-white"
                >
                  Click here to sign in with this email →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Success message banner */}
        {successInfo && (
          <div className="p-4 bg-[#071629] border border-emerald-800/60 rounded-lg space-y-3 text-xs text-emerald-200">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
              <div className="space-y-1.5 flex-1">
                <h4 className="font-bold text-white text-sm">Registration Successful</h4>
                <p className="leading-relaxed">{successInfo.message}</p>
                {successInfo.needsEmailConfirmation && (
                  <p className="text-slate-300 text-[11px] bg-[#0B1B33] p-2.5 rounded border border-[#16365B]">
                    Please check the inbox (and spam/junk folder) for <strong className="text-white">{successInfo.email}</strong> to activate your account, then return to sign in.
                  </p>
                )}
              </div>
            </div>
            <div className="pt-2 border-t border-emerald-900/50 flex justify-end">
              <button
                type="button"
                onClick={() => onNavigate('signin')}
                className="px-4 py-1.5 bg-[#B9E5FF] text-[#071629] font-semibold rounded text-xs hover:bg-white transition-colors"
              >
                Proceed to Sign In
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name */}
          <div>
            <label htmlFor="account-fullname" className="block text-xs font-medium text-slate-300 mb-1.5">
              Full Name <span className="text-[#B9E5FF]">*</span>
            </label>
            <input
              id="account-fullname"
              type="text"
              value={formData.fullName}
              disabled={isLoading}
              onChange={(e) => {
                setFormData({ ...formData, fullName: e.target.value });
                if (serverError) setServerError(null);
              }}
              placeholder="e.g. Samuel Bennett"
              className={`w-full bg-[#071629] border rounded px-3.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors disabled:opacity-60 ${
                errors.fullName ? 'border-amber-400' : 'border-[#16365B] focus:border-[#B9E5FF]'
              }`}
            />
            {errors.fullName && <p className="text-xs text-amber-300 mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="account-email" className="block text-xs font-medium text-slate-300 mb-1.5">
              Email Address <span className="text-[#B9E5FF]">*</span>
            </label>
            <input
              id="account-email"
              type="email"
              value={formData.email}
              disabled={isLoading}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (serverError) setServerError(null);
              }}
              placeholder="name@example.com"
              className={`w-full bg-[#071629] border rounded px-3.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors disabled:opacity-60 ${
                errors.email ? 'border-amber-400' : 'border-[#16365B] focus:border-[#B9E5FF]'
              }`}
            />
            {errors.email && <p className="text-xs text-amber-300 mt-1">{errors.email}</p>}
          </div>

          {/* Preferred Nickname (Explicitly Optional, Non-Unique) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="account-nickname" className="block text-xs font-medium text-slate-300">
                Preferred Nickname
              </label>
              <span className="text-[11px] text-slate-400 font-normal">Optional</span>
            </div>
            <input
              id="account-nickname"
              type="text"
              value={formData.preferredNickname}
              disabled={isLoading}
              onChange={(e) => {
                setFormData({ ...formData, preferredNickname: e.target.value });
                if (serverError) setServerError(null);
              }}
              placeholder="e.g. Sam"
              className="w-full bg-[#071629] border border-[#16365B] rounded px-3.5 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#B9E5FF] transition-colors disabled:opacity-60"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Used for greetings. If left blank, your first name will be used automatically.
            </p>
          </div>

          {/* Password with Show/Hide and Strength Meter */}
          <div>
            <label htmlFor="account-password" className="block text-xs font-medium text-slate-300 mb-1.5">
              Password <span className="text-[#B9E5FF]">*</span>
            </label>
            <div className="relative">
              <input
                id="account-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                disabled={isLoading}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (serverError) setServerError(null);
                }}
                placeholder="Minimum 8 characters"
                className={`w-full bg-[#071629] border rounded pl-3.5 pr-10 py-2 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors disabled:opacity-60 ${
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

            {/* Live Password Strength Indicator */}
            {formData.password.length > 0 && (
              <div className="mt-2.5 p-2.5 bg-[#071629] rounded border border-[#16365B] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Strength:</span>
                  <span className={`font-semibold ${
                    passwordAnalysis.strength === 'Weak' ? 'text-rose-400' :
                    passwordAnalysis.strength === 'Fair' ? 'text-amber-400' :
                    passwordAnalysis.strength === 'Good' ? 'text-[#B9E5FF]' :
                    'text-emerald-400'
                  }`}>
                    {passwordAnalysis.strength}
                  </span>
                </div>

                {/* 4-bar progress indicator */}
                <div className="grid grid-cols-4 gap-1.5 h-1.5">
                  <div className={`rounded-full transition-colors ${
                    passwordAnalysis.score >= 1 ? 
                      (passwordAnalysis.score === 1 ? 'bg-rose-500' : passwordAnalysis.score === 2 ? 'bg-amber-400' : passwordAnalysis.score === 3 ? 'bg-[#B9E5FF]' : 'bg-emerald-400') 
                      : 'bg-slate-700'
                  }`} />
                  <div className={`rounded-full transition-colors ${
                    passwordAnalysis.score >= 2 ? 
                      (passwordAnalysis.score === 2 ? 'bg-amber-400' : passwordAnalysis.score === 3 ? 'bg-[#B9E5FF]' : 'bg-emerald-400') 
                      : 'bg-slate-700'
                  }`} />
                  <div className={`rounded-full transition-colors ${
                    passwordAnalysis.score >= 3 ? 
                      (passwordAnalysis.score === 3 ? 'bg-[#B9E5FF]' : 'bg-emerald-400') 
                      : 'bg-slate-700'
                  }`} />
                  <div className={`rounded-full transition-colors ${
                    passwordAnalysis.score >= 4 ? 'bg-emerald-400' : 'bg-slate-700'
                  }`} />
                </div>

                {/* Requirements Checklist */}
                <div className="grid grid-cols-2 gap-1 pt-1 text-[11px]">
                  <div className={`flex items-center gap-1.5 ${passwordAnalysis.hasMinLength ? 'text-emerald-300' : 'text-slate-400'}`}>
                    {passwordAnalysis.hasMinLength ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-500" />}
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordAnalysis.hasLower && passwordAnalysis.hasUpper ? 'text-emerald-300' : 'text-slate-400'}`}>
                    {passwordAnalysis.hasLower && passwordAnalysis.hasUpper ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-500" />}
                    <span>Upper & lower case</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordAnalysis.hasNumber ? 'text-emerald-300' : 'text-slate-400'}`}>
                    {passwordAnalysis.hasNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-500" />}
                    <span>At least one number</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordAnalysis.hasSpecial ? 'text-emerald-300' : 'text-slate-400'}`}>
                    {passwordAnalysis.hasSpecial ? <Check className="w-3 h-3 text-emerald-400" /> : <span className="w-3 text-center text-slate-500">•</span>}
                    <span>Symbol (optional)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password with Show/Hide and Live Match Feedback */}
          <div>
            <label htmlFor="account-confirm-password" className="block text-xs font-medium text-slate-300 mb-1.5">
              Confirm Password <span className="text-[#B9E5FF]">*</span>
            </label>
            <div className="relative">
              <input
                id="account-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                disabled={isLoading}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (serverError) setServerError(null);
                }}
                placeholder="Repeat password"
                className={`w-full bg-[#071629] border rounded pl-3.5 pr-10 py-2 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors disabled:opacity-60 ${
                  errors.confirmPassword ? 'border-amber-400' : 
                  confirmMatch === true ? 'border-emerald-500 focus:border-emerald-400' :
                  confirmMatch === false ? 'border-amber-400 focus:border-amber-400' :
                  'border-[#16365B] focus:border-[#B9E5FF]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Live Match Notification */}
            {formData.confirmPassword.length > 0 && (
              <div className="mt-1.5 text-xs flex items-center gap-1.5">
                {confirmMatch ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Passwords match</span>
                  </span>
                ) : (
                  <span className="text-amber-300 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Passwords don't match</span>
                  </span>
                )}
              </div>
            )}
            {errors.confirmPassword && !formData.confirmPassword && (
              <p className="text-xs text-amber-300 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={isLoading || (formData.confirmPassword.length > 0 && confirmMatch === false)}
            className="w-full py-2.5 px-4 rounded bg-[#B9E5FF] text-[#071629] font-semibold text-sm hover:bg-white transition-colors cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
          </button>
        </form>

        {/* Already registered? Sign in */}
        <div className="pt-2 text-center text-xs text-slate-400 border-t border-[#16365B]">
          <span>Already registered? </span>
          <button
            type="button"
            onClick={() => onNavigate('signin')}
            className="text-[#B9E5FF] font-medium hover:underline cursor-pointer"
          >
            Sign in.
          </button>
        </div>
      </div>
    </div>
  );
};
