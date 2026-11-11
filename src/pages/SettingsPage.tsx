import React, { useState } from 'react';
import { AuthPage } from '../types';
import { supabase, isSupabaseConfigured, getAuthRedirectUrl } from '../lib/supabase';
import { 
  Settings, 
  ShieldCheck, 
  Mail, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  LogOut, 
  ArrowLeft,
  Bell,
  Smartphone,
  Sparkles
} from 'lucide-react';

interface SettingsPageProps {
  userEmail: string | null;
  onNavigate: (page: AuthPage) => void;
  onSignOut: () => Promise<void>;
  onOpenOnboarding?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  userEmail,
  onNavigate,
  onSignOut,
  onOpenOnboarding,
}) => {
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  // Notifications toggle (local preference state, transparently marked as future push/SMS integration)
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handlePasswordReset = async () => {
    setResetSuccess(null);
    setResetError(null);

    if (!userEmail) {
      setResetError('No email associated with current session.');
      return;
    }

    if (!isSupabaseConfigured) {
      setResetError('Supabase configuration is not active.');
      return;
    }

    setIsResetting(true);

    try {
      const redirectUrl = getAuthRedirectUrl();
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: redirectUrl,
      });

      if (error) {
        throw error;
      }

      setResetSuccess(
        `A secure password-reset link has been sent to ${userEmail}. Please check your inbox and spam folder.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to request password reset.';
      if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('seconds')) {
        setResetError('Supabase security limit: Too many password reset attempts. Please wait 60 seconds before trying again.');
      } else {
        setResetError(msg);
      }
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#16365B] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-white tracking-tight">Account Settings</h1>
          </div>
          <p className="text-xs text-slate-400 pl-8">
            Manage your login security, authentication credentials, and notification channels.
          </p>
        </div>

        <button
          onClick={() => onNavigate('profile')}
          className="text-xs text-[#B9E5FF] hover:underline"
        >
          View Profile →
        </button>
      </div>

      {/* Messages */}
      {resetSuccess && (
        <div className="p-3.5 bg-[#071629] border border-emerald-800/60 rounded-lg flex items-start gap-2.5 text-xs text-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{resetSuccess}</p>
        </div>
      )}

      {resetError && (
        <div className="p-3.5 bg-[#071629] border border-rose-800/60 rounded-lg flex items-start gap-2.5 text-xs text-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{resetError}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Security & Password Section */}
        <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-semibold text-white border-b border-[#16365B] pb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#B9E5FF]" />
            <span>Security & Authentication</span>
          </h2>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#071629] border border-[#16365B] rounded-lg">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-white block">Email Address</span>
                <span className="text-xs text-slate-400">{userEmail || '—'}</span>
                <p className="text-[11px] text-slate-400">
                  Primary identifier for sign-in and security notifications.
                </p>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 w-fit">
                Verified
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#071629] border border-[#16365B] rounded-lg">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-white block">Password</span>
                <span className="text-xs text-slate-400">••••••••••••</span>
                <p className="text-[11px] text-slate-400">
                  Change your password or request recovery instructions via Supabase Auth.
                </p>
              </div>

              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={isResetting}
                className="px-4 py-2 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2 shrink-0"
              >
                {isResetting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isResetting ? 'Dispatching...' : 'Request Password Reset'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications & Preferences Section */}
        <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-semibold text-white border-b border-[#16365B] pb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#B9E5FF]" />
            <span>Communications & Alerts</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-4 bg-[#071629] border border-[#16365B] rounded-lg">
              <div className="space-y-0.5 max-w-lg">
                <span className="font-semibold text-white block">Product & Readiness Announcements</span>
                <p className="text-[11px] text-slate-400">
                  Receive email notifications for platform milestones, maintenance guides, and new features.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-[#16365B] bg-[#0B1B33] text-[#B9E5FF] focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="p-4 bg-[#071629] border border-[#16365B] rounded-lg space-y-2 opacity-80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300 font-semibold">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                  <span>SMS & Urgent Outage Broadcasts</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-950 text-[#B9E5FF] border border-blue-900">
                  Planned for Stage 4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Direct SMS outage alerts will connect alongside the cellular hardware telemetry rollout. No telecom carrier integration is active in Stage 2.
              </p>
            </div>
          </div>
        </div>

        {/* Platform Onboarding & Setup Guide Section */}
        <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B9E5FF]" />
              <h3 className="text-sm font-semibold text-white">Platform Onboarding & Setup Guide</h3>
            </div>
            <p className="text-xs text-slate-400">
              Revisit the step-by-step account onboarding and product walkthrough anytime.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenOnboarding}
            className="px-4 py-2 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-xs font-semibold text-white transition-colors cursor-pointer w-fit flex items-center gap-2 shrink-0 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Setup Guide</span>
          </button>
        </div>

        {/* Session & Sign Out Section */}
        <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">Active Session</h3>
            <p className="text-xs text-slate-400">
              Sign out of your EnerGuru account on this device.
            </p>
          </div>

          <button
            type="button"
            onClick={onSignOut}
            className="px-4 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer w-fit"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
