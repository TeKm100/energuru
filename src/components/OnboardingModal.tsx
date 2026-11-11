import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  Sparkles, 
  CheckCircle2, 
  User, 
  Sliders, 
  Zap, 
  X, 
  ArrowRight, 
  Loader2,
  Lock,
  ShieldCheck
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  userProfile: UserProfile | null;
  userEmail: string | null;
  userId?: string | null;
  onComplete: (preferredNickname: string) => Promise<void>;
  onDismiss: () => void;
  onNavigateToProfile: () => void;
  onOpenPinSetup?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  userProfile,
  userEmail,
  userId,
  onComplete,
  onDismiss,
  onNavigateToProfile,
  onOpenPinSetup,
}) => {
  const [nickname, setNickname] = useState(userProfile?.nickname || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const displayName = nickname || userProfile?.full_name || userEmail?.split('@')[0] || 'there';

  const handleCompleteSetup = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(nickname.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl w-full max-w-lg text-white shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-[#0B1B33] to-[#16365B] border-b border-[#16365B] flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#16365B] border border-[#B9E5FF]/30 text-[11px] font-semibold text-[#B9E5FF]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Getting Started</span>
            </div>
            <h2 id="onboarding-title" className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Welcome to EnerGuru, {displayName}!
            </h2>
            <p className="text-xs text-slate-300">
              Your account is verified. Complete these quick steps to tailor your experience.
            </p>
          </div>

          <button
            onClick={onDismiss}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#16365B] transition-colors"
            aria-label="Close setup guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          <div className="space-y-3">
            <h3 className="font-semibold text-white text-sm">Recommended Setup Checklist</h3>

            {/* Step 1: Nickname input */}
            <div className="p-4 bg-[#071629] border border-[#16365B] rounded-xl space-y-2.5">
              <div className="flex items-center gap-2 text-white font-medium">
                <User className="w-4 h-4 text-[#B9E5FF]" />
                <span>1. Confirm your greeting name</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Choose a preferred nickname for dashboard greetings (optional).
              </p>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={userProfile?.full_name || 'e.g. Sam'}
                className="w-full bg-[#0B1B33] border border-[#16365B] focus:border-[#B9E5FF] rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Step 2: Profile overview */}
            <div className="p-4 bg-[#071629] border border-[#16365B] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-medium">
                  <Sliders className="w-4 h-4 text-[#B9E5FF]" />
                  <span>2. Review your profile & settings</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-950 text-[#B9E5FF] border border-blue-900">
                  Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Verify your full name and security recovery options.
              </p>
            </div>

            {/* Step 3: Equipment readiness */}
            <div className="p-4 bg-[#071629] border border-[#16365B] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-medium">
                  <Zap className="w-4 h-4 text-[#B9E5FF]" />
                  <span>3. Prepare equipment information</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  Stage 3 Preview
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Have generator kVA, battery amp-hours, and inverter ratings ready for upcoming inventory features.
              </p>
            </div>

            {/* Step 4: Security PIN Recommendation */}
            <div className="p-4 bg-[#071629] border border-[#16365B] rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-medium">
                  <Lock className="w-4 h-4 text-[#B9E5FF]" />
                  <span>4. Secure Your Power Controls</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#16365B] text-[#B9E5FF] border border-[#B9E5FF]/30">
                  Recommended
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Set a 4-digit Security PIN to authorize remote electricity supply switching commands.
              </p>
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    onDismiss();
                    if (onOpenPinSetup) {
                      onOpenPinSetup();
                    } else {
                      onNavigateToProfile();
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-xs font-semibold text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Set Security PIN in Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 bg-[#071629] border-t border-[#16365B] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onDismiss}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer text-center"
          >
            Do this later
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                onDismiss();
                onNavigateToProfile();
              }}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-lg border border-[#16365B] hover:bg-[#16365B] text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Open Full Profile
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleCompleteSetup}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-lg bg-[#B9E5FF] hover:bg-white text-[#071629] text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Complete Setup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
