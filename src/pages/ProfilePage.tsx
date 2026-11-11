import React, { useState, useEffect } from 'react';
import { AuthPage, UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  User, 
  Mail, 
  Calendar, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowLeft,
  Copy,
  Check,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { getSecurityPinStatus, SecurityPinStatus } from '../lib/securityPin';
import { SecurityPinModal, PinModalMode } from '../components/SecurityPinModal';

interface ProfilePageProps {
  userProfile: UserProfile | null;
  userEmail: string | null;
  userId: string | null;
  onNavigate: (page: AuthPage) => void;
  onProfileUpdated: () => Promise<void>;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userProfile,
  userEmail,
  userId,
  onNavigate,
  onProfileUpdated,
}) => {
  const [fullName, setFullName] = useState(userProfile?.full_name || '');
  const [nickname, setNickname] = useState(userProfile?.nickname || '');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [pinStatus, setPinStatus] = useState<SecurityPinStatus>({
    hasPin: false,
    isLocked: false,
    attemptsRemaining: 3,
  });
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinModalMode, setPinModalMode] = useState<PinModalMode>('setup');

  const refreshPinStatus = async () => {
    if (userId) {
      const status = await getSecurityPinStatus(userId);
      setPinStatus(status);
    }
  };

  useEffect(() => {
    refreshPinStatus();
  }, [userId]);

  // Sync state if profile changes
  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
      setNickname(userProfile.nickname || '');
    }
  }, [userProfile]);

  const handleCopyId = () => {
    if (userId) {
      navigator.clipboard.writeText(userId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Full name cannot be blank.');
      return;
    }

    if (!userId || !isSupabaseConfigured) {
      setErrorMessage('Unable to connect to Supabase database. Please try again.');
      return;
    }

    setIsSaving(true);

    try {
      // 1. Update public.profiles table (governed by RLS: auth.uid() = id)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          nickname: nickname.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (profileError) {
        throw profileError;
      }

      // 2. Also update Supabase Auth user metadata so sessions stay aligned
      await supabase.auth.updateUser({
        data: {
          full_name: fullName.trim(),
          nickname: nickname.trim() || null,
        },
      });

      // 3. Refresh profile state in parent App
      await onProfileUpdated();

      setSuccessMessage('Profile changes saved successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile record.';
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Format creation timestamp
  const createdAtFormatted = userProfile?.created_at
    ? new Date(userProfile.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
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
            <h1 className="text-2xl font-bold text-white tracking-tight">My Profile</h1>
          </div>
          <p className="text-xs text-slate-400 pl-8">
            Manage your personal identity and greeting preferences across the EnerGuru platform.
          </p>
        </div>

        <button
          onClick={() => onNavigate('settings')}
          className="text-xs text-[#B9E5FF] hover:underline"
        >
          Security & Settings →
        </button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="p-3.5 bg-[#071629] border border-emerald-800/60 rounded-lg flex items-center gap-2.5 text-xs text-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-[#071629] border border-rose-800/60 rounded-lg flex items-center gap-2.5 text-xs text-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-[#0B1B33] border border-[#16365B] rounded-xl p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-semibold text-white border-b border-[#16365B] pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-[#B9E5FF]" />
            <span>Profile Details</span>
          </h2>

          <form onSubmit={handleSave} className="space-y-5" noValidate>
            {/* Full Name */}
            <div>
              <label htmlFor="profile-fullname" className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name <span className="text-[#B9E5FF]">*</span>
              </label>
              <input
                id="profile-fullname"
                type="text"
                value={fullName}
                disabled={isSaving}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (successMessage) setSuccessMessage(null);
                }}
                className="w-full bg-[#071629] border border-[#16365B] focus:border-[#B9E5FF] rounded px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors disabled:opacity-60"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Your legal or full name associated with equipment ownership records.
              </p>
            </div>

            {/* Preferred Nickname */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="profile-nickname" className="block text-xs font-medium text-slate-300">
                  Preferred Nickname
                </label>
                <span className="text-[11px] text-slate-400">Optional</span>
              </div>
              <input
                id="profile-nickname"
                type="text"
                value={nickname}
                disabled={isSaving}
                onChange={(e) => {
                  setNickname(e.target.value);
                  if (successMessage) setSuccessMessage(null);
                }}
                placeholder="e.g. Sam"
                className="w-full bg-[#071629] border border-[#16365B] focus:border-[#B9E5FF] rounded px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors disabled:opacity-60"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                How EnerGuru greets you on your dashboard. Nicknames are not required to be unique.
              </p>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Registered Email
              </label>
              <div className="flex items-center justify-between bg-[#071629] border border-[#16365B] rounded px-3.5 py-2.5 text-sm text-slate-300">
                <span className="truncate">{userEmail || '—'}</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Email addresses can be updated in account security settings.
              </p>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 rounded text-xs font-medium text-slate-300 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded bg-[#B9E5FF] text-[#071629] font-semibold text-xs hover:bg-white transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar: Account Metadata & Security Summary */}
        <div className="space-y-6">
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-[#16365B] pb-2">
              Account Overview
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <Calendar className="w-4 h-4 text-[#B9E5FF] shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Member Since</span>
                  <span className="font-medium text-white">{createdAtFormatted}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-[#B9E5FF] shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Auth Provider</span>
                  <span className="font-medium text-white">Supabase Email & Password</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security PIN Section */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#16365B] pb-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#B9E5FF]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Power Security PIN
                </h3>
              </div>
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                pinStatus.hasPin
                  ? pinStatus.isLocked 
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}>
                {pinStatus.hasPin ? (pinStatus.isLocked ? 'Locked Out' : 'Configured') : 'Not Set'}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              A 4-digit Security PIN is required to authorize remote building electricity ON/OFF switching commands.
            </p>

            {pinStatus.isLocked && (
              <div className="p-2 rounded bg-rose-950/60 border border-rose-800 text-[11px] text-rose-200">
                Security lockout active after 3 failed verification attempts. Reset your PIN below to restore access.
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {!pinStatus.hasPin ? (
                <button
                  type="button"
                  onClick={() => {
                    setPinModalMode('setup');
                    setPinModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs"
                >
                  Set Security PIN
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setPinModalMode('reset');
                      setPinModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs"
                  >
                    {pinStatus.isLocked ? 'Reset & Clear Lockout' : 'Change Security PIN'}
                  </button>
                  {!pinStatus.isLocked && (
                    <button
                      type="button"
                      onClick={() => {
                        setPinModalMode('reset');
                        setPinModalOpen(true);
                      }}
                      className="text-xs text-slate-400 hover:text-white hover:underline cursor-pointer ml-1"
                    >
                      Forgot PIN?
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Technical Details Accordion (Subtle, Not Prominent) */}
          <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              <span>Technical Account Reference</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Used when referencing your account for support or database logs.
            </p>
            <div className="pt-1 flex items-center justify-between bg-[#071629] p-2 rounded border border-[#16365B] text-[10px] font-mono text-slate-400 break-all">
              <span className="truncate mr-2">{userId || 'Not available'}</span>
              <button
                type="button"
                onClick={handleCopyId}
                className="p-1 hover:text-white rounded text-slate-400 hover:bg-[#16365B] transition-colors shrink-0"
                title="Copy User ID"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security PIN Setup / Change / Reset Modal */}
      <SecurityPinModal
        isOpen={pinModalOpen}
        mode={pinModalMode}
        userId={userId || ''}
        onSuccess={async () => {
          await refreshPinStatus();
          setSuccessMessage(
            pinModalMode === 'reset'
              ? 'Security PIN reset successfully. Lockout cleared.'
              : 'Security PIN configured successfully.'
          );
        }}
        onClose={() => setPinModalOpen(false)}
      />
    </div>
  );
};
