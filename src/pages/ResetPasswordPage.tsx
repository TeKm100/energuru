import React, { useState, useMemo, useEffect } from 'react';
import { Page } from '../types';
import { Logo } from '../components/Logo';
import { supabase, isSupabaseConfigured, supabaseUrl } from '../lib/supabase';
import { 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  ArrowLeft,
  KeyRound,
  ShieldCheck
} from 'lucide-react';

interface ResetPasswordPageProps {
  onNavigate: (page: Page) => void;
  initialError?: string | null;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ 
  onNavigate, 
  initialError 
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingSession, setIsVerifyingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [serverError, setServerError] = useState<string | null>(initialError || null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Live Password Strength & Requirements Analysis
  const passwordAnalysis = useMemo(() => {
    const pwd = password;
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
      isAcceptable: hasMinLength && checksPassed >= 2,
    };
  }, [password]);

  // Confirmation match calculation
  const confirmMatch = useMemo(() => {
    if (!confirmPassword) return null;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  // Verify that an active recovery session exists in Supabase Auth
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsVerifyingSession(false);
      setServerError('Supabase configuration is not active. Please ensure environment variables are configured.');
      return;
    }

    if (initialError) {
      setIsVerifyingSession(false);
      setServerError(initialError);
      return;
    }

    // Check if a recovery session is present
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsVerifyingSession(false);
      if (session) {
        setHasValidSession(true);
      } else {
        // No active session — link might be missing or expired
        setHasValidSession(false);
      }
    }).catch((err) => {
      setIsVerifyingSession(false);
      setHasValidSession(false);
      console.warn('Error checking recovery session:', err);
    });
  }, [initialError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!password) {
      setServerError('Please enter a new password.');
      return;
    }

    if (!passwordAnalysis.hasMinLength) {
      setServerError('Password must be at least 8 characters long.');
      return;
    }

    if (!confirmPassword) {
      setServerError('Please confirm your new password.');
      return;
    }

    if (password !== confirmPassword) {
      setServerError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    if (!isSupabaseConfigured) {
      setServerError('Supabase configuration is not active.');
      return;
    }

    setIsLoading(true);

    try {
      // Use Supabase Auth supported updateUser method to change password
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        const errorMsg = error.message.toLowerCase();
        if (errorMsg.includes('same password') || errorMsg.includes('different from old')) {
          setServerError('The new password must be different from your previous password.');
        } else if (errorMsg.includes('session') || errorMsg.includes('expired') || errorMsg.includes('jwt')) {
          setServerError('Your password recovery session has expired. Please request a new recovery link.');
          setHasValidSession(false);
        } else {
          setServerError(error.message);
        }
        return;
      }

      if (data?.user) {
        setIsSuccess(true);
        // Sign out of the temporary recovery session so the user signs in cleanly
        await supabase.auth.signOut();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred while updating your password.';
      if (message.toLowerCase().includes('failed to fetch')) {
        setServerError(`Connection failed: Unable to communicate with the authentication server (${supabaseUrl || 'configured endpoint'}).`);
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

        {/* Verifying Session Loading State */}
        {isVerifyingSession && (
          <div className="py-8 text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#B9E5FF] mx-auto" />
            <p className="text-xs text-slate-300">Verifying secure password recovery authorization...</p>
          </div>
        )}

        {/* Success View */}
        {!isVerifyingSession && isSuccess && (
          <div className="p-5 bg-[#071629] border border-emerald-800/60 rounded-lg text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white">Password Updated Successfully</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your EnerGuru account password has been updated. You can now sign in using your new credentials.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('signin')}
                className="w-full py-2.5 px-4 rounded bg-[#B9E5FF] text-[#071629] font-semibold text-sm hover:bg-white transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <span>Proceed to Sign In</span>
              </button>
            </div>
          </div>
        )}

        {/* Expired / Invalid Link State */}
        {!isVerifyingSession && !isSuccess && (!hasValidSession || initialError) && (
          <div className="p-5 bg-[#071629] border border-amber-800/60 rounded-lg text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white">Recovery Link Expired or Invalid</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {serverError || 'The password recovery link you clicked is invalid, has expired, or has already been used. For security, recovery links can only be used once.'}
              </p>
            </div>
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="w-full py-2.5 px-4 rounded bg-[#B9E5FF] text-[#071629] font-semibold text-sm hover:bg-white transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Request New Reset Link</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('signin')}
                className="w-full py-2 px-4 rounded bg-[#16365B]/60 text-slate-300 hover:text-white hover:bg-[#16365B] font-medium text-xs transition-colors cursor-pointer"
              >
                Return to Sign In
              </button>
            </div>
          </div>
        )}

        {/* Active Password Reset Form */}
        {!isVerifyingSession && !isSuccess && hasValidSession && !initialError && (
          <>
            <div className="space-y-1 text-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16365B]/60 border border-[#B9E5FF]/20 text-[11px] text-[#B9E5FF] font-medium mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Secure Password Reset</span>
              </div>
              <h2 className="text-lg font-bold text-white">Set Your New Password</h2>
              <p className="text-xs text-slate-400">
                Choose a strong password with at least 8 characters.
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
              {/* New Password */}
              <div>
                <label htmlFor="reset-password-input" className="block text-xs font-medium text-slate-300 mb-1.5">
                  New Password <span className="text-[#B9E5FF]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="reset-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    disabled={isLoading}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (serverError) setServerError(null);
                    }}
                    placeholder="At least 8 characters"
                    className="w-full bg-[#071629] border border-[#16365B] focus:border-[#B9E5FF] rounded pl-3.5 pr-10 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors disabled:opacity-60"
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

                {/* Password Strength Indicator */}
                {password.length > 0 && (
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
                    <div className="grid grid-cols-2 gap-1 pt-1 text-[11px]">
                      <div className={`flex items-center gap-1.5 ${passwordAnalysis.hasMinLength ? 'text-emerald-300' : 'text-slate-400'}`}>
                        {passwordAnalysis.hasMinLength ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-500" />}
                        <span>At least 8 characters</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${passwordAnalysis.hasNumber ? 'text-emerald-300' : 'text-slate-400'}`}>
                        {passwordAnalysis.hasNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-500" />}
                        <span>Includes number</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="reset-confirm-password" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Confirm New Password <span className="text-[#B9E5FF]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="reset-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    disabled={isLoading}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (serverError) setServerError(null);
                    }}
                    placeholder="Re-enter your new password"
                    className={`w-full bg-[#071629] border rounded pl-3.5 pr-10 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors disabled:opacity-60 ${
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
                {confirmPassword.length > 0 && (
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
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !password || !confirmPassword || confirmMatch === false}
                className="w-full py-2.5 px-4 rounded bg-[#B9E5FF] text-[#071629] font-semibold text-sm hover:bg-white transition-colors cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isLoading ? 'Updating Password...' : 'Save New Password'}</span>
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
