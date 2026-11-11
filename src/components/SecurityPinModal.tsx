import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  RefreshCw,
  ArrowRight,
  Mail,
  KeyRound,
  Check
} from 'lucide-react';
import { 
  validateSecurityPin, 
  verifySecurityPin, 
  setSecurityPin, 
  resetSecurityPin, 
  getSecurityPinStatus,
  requestPinResetOtp,
  verifyPinResetOtp,
  maskEmail
} from '../lib/securityPin';

export type PinModalMode = 'verify' | 'setup' | 'change' | 'reset';

interface SecurityPinModalProps {
  isOpen: boolean;
  mode: PinModalMode;
  userId: string;
  userEmail?: string | null;
  actionDescription?: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const SecurityPinModal: React.FC<SecurityPinModalProps> = ({
  isOpen,
  mode: initialMode,
  userId,
  userEmail,
  actionDescription,
  onSuccess,
  onClose,
}) => {
  const [currentMode, setCurrentMode] = useState<PinModalMode>(initialMode);
  
  // Reset flow stages (1: Request Email, 2: Enter OTP, 3: Create PIN, 4: Confirm PIN, 5: Done)
  const [resetStage, setResetStage] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Inputs
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '']);
  const [confirmDigits, setConfirmDigits] = useState<string[]>(['', '', '', '']);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);

  // Reset Authorization Token from backend
  const [resetToken, setResetToken] = useState<string | null>(null);

  // Resend OTP countdown
  const [resendCooldown, setResendCooldown] = useState(0);

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Messaging
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Verification & Lockout Status
  const [isLocked, setIsLocked] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);
  const [otpAttemptsRemaining, setOtpAttemptsRemaining] = useState(3);

  // Input refs
  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const confirmRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Sync mode & reset form when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentMode(initialMode);
      setResetStage(1);
      setPinDigits(['', '', '', '']);
      setConfirmDigits(['', '', '', '']);
      setOtpDigits(['', '', '', '', '', '']);
      setResetToken(null);
      setErrorMessage(null);
      setSuccessMessage(null);

      // Check user PIN status
      if (userId) {
        getSecurityPinStatus(userId).then((status) => {
          setIsLocked(status.isLocked);
          setAttemptsRemaining(status.attemptsRemaining);
          if (status.isLocked && initialMode === 'verify') {
            setErrorMessage('No more attempts. Reset your Security PIN to continue.');
          }
        });
      }

      // Auto-focus first input
      setTimeout(() => {
        if (initialMode === 'reset') {
          // Stage 1 doesn't need digit focus
        } else {
          pinRefs[0].current?.focus();
        }
      }, 100);
    }
  }, [isOpen, initialMode, userId]);

  if (!isOpen) return null;

  const handleDigitChange = (
    index: number,
    value: string,
    digitArray: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>,
    refs: React.RefObject<HTMLInputElement | null>[]
  ) => {
    // Numeric only
    const char = value.replace(/\D/g, '').slice(-1);
    const newArray = [...digitArray];
    newArray[index] = char;
    setArray(newArray);
    setErrorMessage(null);

    // Auto advance focus
    if (char && index < refs.length - 1) {
      refs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    digitArray: string[],
    refs: React.RefObject<HTMLInputElement | null>[]
  ) => {
    if (e.key === 'Backspace' && !digitArray[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  // =========================================================================
  // VERIFY MODE SUBMIT (4-Digit Switching Authorization)
  // =========================================================================
  const handleVerifySubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const pin = pinDigits.join('');
    if (pin.length !== 4) {
      setErrorMessage('Please enter all 4 digits.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await verifySecurityPin(userId, pin);
      if (result.success) {
        setSuccessMessage('PIN verified successfully.');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 300);
      } else {
        setIsLocked(result.isLocked);
        setAttemptsRemaining(result.attemptsRemaining);
        setErrorMessage(
          result.isLocked
            ? 'No more attempts. Reset your Security PIN to continue.'
            : `${result.message || 'Incorrect Security PIN.'} (${result.attemptsRemaining} ${result.attemptsRemaining === 1 ? 'attempt' : 'attempts'} remaining)`
        );
        setPinDigits(['', '', '', '']);
        pinRefs[0].current?.focus();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================================
  // SETUP MODE SUBMIT (Initial Setup Only - No Recovery Needed)
  // =========================================================================
  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pin = pinDigits.join('');
    const confirm = confirmDigits.join('');

    if (pin.length !== 4) {
      setErrorMessage('Please enter all 4 digits for your new PIN.');
      return;
    }

    const validation = validateSecurityPin(pin);
    if (!validation.valid) {
      setErrorMessage(validation.reason || 'Invalid PIN combination.');
      return;
    }

    if (pin !== confirm) {
      setErrorMessage('The confirmation digits do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await setSecurityPin(userId, pin);
      if (result.success) {
        setIsLocked(false);
        setAttemptsRemaining(3);
        setSuccessMessage('Security PIN configured successfully.');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 500);
      } else {
        setErrorMessage(result.error || 'Failed to save Security PIN.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================================
  // RESET STAGE 1: Request Email Verification Code
  // =========================================================================
  const handleSendOtp = async () => {
    if (!userEmail) {
      setErrorMessage('Unable to locate account email. Please sign in again.');
      return;
    }

    setIsSendingOtp(true);
    setErrorMessage(null);

    try {
      const result = await requestPinResetOtp(userId, userEmail);
      if (result.success) {
        setResendCooldown(result.cooldownSeconds || 60);
        setSuccessMessage(result.message || `Verification code sent to ${maskEmail(userEmail)}.`);
        setResetStage(2);
        setOtpDigits(['', '', '', '', '', '']);
        setOtpAttemptsRemaining(3);
        setTimeout(() => {
          otpRefs[0].current?.focus();
        }, 150);
      } else {
        setErrorMessage(result.error || 'Failed to send verification code.');
        if (result.cooldownSeconds) {
          setResendCooldown(result.cooldownSeconds);
        }
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  // =========================================================================
  // RESET STAGE 2: Verify Entered 6-Digit Email Code
  // =========================================================================
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setErrorMessage('Please enter all 6 digits of your verification code.');
      return;
    }

    if (!userEmail) {
      setErrorMessage('User session email missing.');
      return;
    }

    setIsVerifyingOtp(true);
    setErrorMessage(null);

    try {
      const result = await verifyPinResetOtp(userId, userEmail, code);
      if (result.success && result.resetToken) {
        setResetToken(result.resetToken);
        setSuccessMessage('Email verified successfully! Please create your new Security PIN.');
        setResetStage(3);
        setPinDigits(['', '', '', '']);
        setConfirmDigits(['', '', '', '']);
        setTimeout(() => {
          pinRefs[0].current?.focus();
        }, 150);
      } else {
        if (result.attemptsRemaining !== undefined) {
          setOtpAttemptsRemaining(result.attemptsRemaining);
        }
        setErrorMessage(result.message || 'Verification failed. Please check the code.');
        setOtpDigits(['', '', '', '', '', '']);
        otpRefs[0].current?.focus();
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // =========================================================================
  // RESET STAGE 3: Proceed from New PIN to Confirm PIN
  // =========================================================================
  const handleProceedToConfirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = pinDigits.join('');
    if (pin.length !== 4) {
      setErrorMessage('Please enter all 4 digits for your new Security PIN.');
      return;
    }

    const validation = validateSecurityPin(pin);
    if (!validation.valid) {
      setErrorMessage(validation.reason || 'Invalid PIN combination.');
      return;
    }

    setErrorMessage(null);
    setResetStage(4);
    setTimeout(() => {
      confirmRefs[0].current?.focus();
    }, 150);
  };

  // =========================================================================
  // RESET STAGE 4: Finalize PIN Reset with Backend Authorization Token
  // =========================================================================
  const handleFinalizeResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pin = pinDigits.join('');
    const confirm = confirmDigits.join('');

    if (confirm.length !== 4) {
      setErrorMessage('Please enter all 4 digits to confirm your PIN.');
      return;
    }

    if (pin !== confirm) {
      setErrorMessage('The confirmation digits do not match. Please re-enter.');
      return;
    }

    if (!resetToken) {
      setErrorMessage('Reset authorization token missing. Please restart the email verification.');
      setResetStage(1);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await resetSecurityPin(userId, pin, resetToken);
      if (result.success) {
        setIsLocked(false);
        setAttemptsRemaining(3);
        setResetStage(5);
        setSuccessMessage('Your Security PIN has been reset and lockout cleared.');
      } else {
        setErrorMessage(result.error || 'Failed to finalize PIN reset.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl sm:rounded-2xl w-full max-w-sm sm:max-w-md text-white shadow-2xl p-4 sm:p-5 space-y-3.5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#16365B] pb-2.5">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isLocked && currentMode !== 'reset'
                ? 'bg-rose-950 text-rose-400' 
                : 'bg-[#16365B] text-[#B9E5FF]'
            }`}>
              {currentMode === 'reset' ? <KeyRound className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white">
                {currentMode === 'verify' && 'Authorize Power Control'}
                {currentMode === 'setup' && 'Create Security PIN'}
                {currentMode === 'reset' && 'Reset Security PIN'}
              </h3>
              <span className="text-[9px] font-mono text-slate-400">
                {currentMode === 'reset' ? 'Email OTP Recovery Flow' : '4-Digit Transaction Security'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#16365B] cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action description context banner for switching */}
        {actionDescription && currentMode === 'verify' && (
          <div className="p-2 rounded bg-[#071629] border border-[#16365B] text-[11px] text-slate-300">
            <span className="text-slate-400 block text-[9px] font-mono uppercase">Authorizing Request:</span>
            <span className="font-semibold text-white">{actionDescription}</span>
          </div>
        )}

        {/* Messages */}
        {errorMessage && (
          <div className="p-2.5 rounded bg-rose-950/50 border border-rose-800/80 text-[11px] text-rose-200 flex items-start gap-1.5 leading-snug">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-2.5 rounded bg-emerald-950/50 border border-emerald-800/80 text-[11px] text-emerald-200 flex items-start gap-1.5 leading-snug">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span className="flex-1">{successMessage}</span>
          </div>
        )}

        {/* =====================================================================
            RESET MODE WITH 5-STAGE FLOW
           ===================================================================== */}
        {currentMode === 'reset' && (
          <div className="space-y-3.5">
            {/* Compact Stage Progress Stepper */}
            <div className="py-1 border-b border-[#16365B]/60">
              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                {[
                  { num: 1, label: 'Email' },
                  { num: 2, label: 'Code' },
                  { num: 3, label: 'New PIN' },
                  { num: 4, label: 'Confirm' },
                  { num: 5, label: 'Done' }
                ].map((s) => {
                  const isActive = resetStage === s.num;
                  const isDone = resetStage > s.num;
                  return (
                    <div key={s.num} className="flex items-center gap-1">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        isActive
                          ? 'bg-[#B9E5FF] text-[#071629]'
                          : isDone
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-[#071629] text-slate-500 border border-[#16365B]'
                      }`}>
                        {isDone ? '✓' : s.num}
                      </span>
                      <span className={`text-[10px] hidden xs:inline ${
                        isActive ? 'text-white font-semibold' : 'text-slate-400'
                      }`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STAGE 1: Verify Email (Request OTP) */}
            {resetStage === 1 && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-[#071629] border border-[#16365B] space-y-2">
                  <div className="flex items-center gap-2 text-[#B9E5FF]">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-xs text-white">Registered Account Verification</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    To protect your building's power controls, Security PIN reset requires proof of ownership for your registered email address:
                  </p>
                  <div className="py-1 px-2.5 rounded bg-[#0B1B33] border border-[#16365B] font-mono text-xs text-[#B9E5FF] font-semibold">
                    {maskEmail(userEmail)}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    A 6-digit one-time code will be dispatched to this address.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#16365B]">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-1.5 px-3 rounded-lg bg-[#071629] hover:bg-[#16365B] text-slate-300 text-xs font-semibold border border-[#16365B] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    className="py-1.5 px-3.5 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                  >
                    {isSendingOtp ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending Code...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5" />
                        <span>Send Verification Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 2: Enter Verification Code */}
            {resetStage === 2 && (
              <form onSubmit={handleVerifyOtpSubmit} className="space-y-3">
                <div className="space-y-1 text-center">
                  <p className="text-xs text-white font-medium">
                    Enter the 6-digit code sent to
                  </p>
                  <p className="text-[11px] font-mono text-[#B9E5FF] font-semibold">
                    {maskEmail(userEmail)}
                  </p>
                </div>

                {/* 6-Digit OTP Box */}
                <div className="flex items-center justify-center gap-2 py-1">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      disabled={isVerifyingOtp}
                      onChange={(e) => handleDigitChange(idx, e.target.value, otpDigits, setOtpDigits, otpRefs)}
                      onKeyDown={(e) => handleKeyDown(idx, e, otpDigits, otpRefs)}
                      className="w-9 h-11 text-center text-lg font-bold bg-[#071629] border border-[#16365B] focus:border-[#B9E5FF] focus:ring-1 focus:ring-[#B9E5FF] rounded-lg text-white transition-colors"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                  <span>Attempts remaining: <strong className="text-white">{otpAttemptsRemaining}</strong></span>
                  {resendCooldown > 0 ? (
                    <span className="text-slate-400 font-mono">Resend in {resendCooldown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp}
                      className="text-[#B9E5FF] hover:underline font-semibold cursor-pointer"
                    >
                      Resend Code
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#16365B]">
                  <button
                    type="button"
                    onClick={() => {
                      setResetStage(1);
                      setErrorMessage(null);
                    }}
                    className="py-1.5 px-3 rounded-lg text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    ← Back
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="py-1.5 px-3 rounded-lg bg-[#071629] hover:bg-[#16365B] text-slate-300 text-xs font-semibold border border-[#16365B] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isVerifyingOtp || otpDigits.some((d) => !d)}
                      className="py-1.5 px-3.5 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                    >
                      {isVerifyingOtp ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <span>Verify Code</span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* STAGE 3: Create New PIN */}
            {resetStage === 3 && (
              <form onSubmit={handleProceedToConfirmPin} className="space-y-3">
                <div className="space-y-1 text-center">
                  <p className="text-xs text-white font-medium">
                    Create New 4-Digit Security PIN
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Avoid easily guessed combinations like 0000, 1234, or 1122.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2.5 py-1">
                  {pinDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={pinRefs[idx]}
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value, pinDigits, setPinDigits, pinRefs)}
                      onKeyDown={(e) => handleKeyDown(idx, e, pinDigits, pinRefs)}
                      className="w-11 h-12 text-center text-lg font-bold bg-[#071629] border border-[#16365B] focus:border-[#B9E5FF] focus:ring-1 focus:ring-[#B9E5FF] rounded-lg text-white transition-colors"
                    />
                  ))}
                </div>

                <div className="p-2 rounded bg-[#071629] border border-[#16365B] text-[10px] text-slate-400">
                  <strong className="text-slate-300">Security Rule:</strong> Unpatterned numbers like 2850 or 5384 are allowed.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#16365B]">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-1.5 px-3 rounded-lg bg-[#071629] hover:bg-[#16365B] text-slate-300 text-xs font-semibold border border-[#16365B] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pinDigits.some((d) => !d)}
                    className="py-1.5 px-3.5 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Proceed to Confirm</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* STAGE 4: Confirm New PIN */}
            {resetStage === 4 && (
              <form onSubmit={handleFinalizeResetSubmit} className="space-y-3">
                <div className="space-y-1 text-center">
                  <p className="text-xs text-white font-medium">
                    Confirm Your New 4-Digit PIN
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Re-enter the digits to verify they match.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2.5 py-1">
                  {confirmDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={confirmRefs[idx]}
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      disabled={isSubmitting}
                      onChange={(e) => handleDigitChange(idx, e.target.value, confirmDigits, setConfirmDigits, confirmRefs)}
                      onKeyDown={(e) => handleKeyDown(idx, e, confirmDigits, confirmRefs)}
                      className="w-11 h-12 text-center text-lg font-bold bg-[#071629] border border-[#16365B] focus:border-[#B9E5FF] focus:ring-1 focus:ring-[#B9E5FF] rounded-lg text-white transition-colors"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#16365B]">
                  <button
                    type="button"
                    onClick={() => {
                      setResetStage(3);
                      setErrorMessage(null);
                    }}
                    className="py-1.5 px-3 rounded-lg text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    ← Back
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="py-1.5 px-3 rounded-lg bg-[#071629] hover:bg-[#16365B] text-slate-300 text-xs font-semibold border border-[#16365B] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || confirmDigits.some((d) => !d)}
                      className="py-1.5 px-3.5 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save & Clear Lockout</span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* STAGE 5: Reset Successful */}
            {resetStage === 5 && (
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Security PIN Reset Successful!</h4>
                  <p className="text-xs text-slate-300">
                    Your previous PIN and failed attempt lockout have been cleared. Your new 4-digit PIN is active for remote power controls.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSuccess();
                    onClose();
                  }}
                  className="w-full py-2 px-4 rounded-lg bg-[#B9E5FF] hover:bg-white text-[#071629] text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            VERIFY MODE (For remote power switching authorization)
           ===================================================================== */}
        {currentMode === 'verify' && (
          <form onSubmit={handleVerifySubmit} className="space-y-3">
            <p className="text-[11px] text-slate-300 text-center">
              Enter your 4-digit Security PIN to authorise this electricity switching command.
            </p>

            {/* Digit boxes */}
            <div className="flex items-center justify-center gap-2.5 py-1">
              {pinDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={pinRefs[idx]}
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  disabled={isLocked || isSubmitting}
                  onChange={(e) => handleDigitChange(idx, e.target.value, pinDigits, setPinDigits, pinRefs)}
                  onKeyDown={(e) => handleKeyDown(idx, e, pinDigits, pinRefs)}
                  className="w-11 h-12 text-center text-lg font-bold bg-[#071629] border border-[#16365B] focus:border-[#B9E5FF] focus:ring-1 focus:ring-[#B9E5FF] rounded-lg text-white disabled:opacity-50 transition-colors"
                />
              ))}
            </div>

            {/* Lockout or Attempts Notice */}
            {isLocked ? (
              <div className="p-2.5 rounded bg-rose-950/60 border border-rose-800 text-center space-y-2">
                <p className="text-[11px] text-rose-300 font-semibold leading-snug">
                  No more attempts. Reset your Security PIN to continue.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentMode('reset');
                    setResetStage(1);
                    setErrorMessage(null);
                  }}
                  className="w-full py-1.5 px-3 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Reset Security PIN via Email</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span>Attempts remaining: <strong className="text-white">{attemptsRemaining} of 3</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentMode('reset');
                    setResetStage(1);
                    setErrorMessage(null);
                  }}
                  className="text-[#B9E5FF] hover:underline cursor-pointer"
                >
                  Forgot PIN?
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#16365B]">
              <button
                type="button"
                onClick={onClose}
                className="py-1.5 px-3 rounded-lg bg-[#071629] hover:bg-[#16365B] text-slate-300 text-xs font-semibold border border-[#16365B] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLocked || isSubmitting || pinDigits.some((d) => !d)}
                className="py-1.5 px-4 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Confirm PIN</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* =====================================================================
            SETUP MODE (Initial setup for users with NO PIN configured yet)
           ===================================================================== */}
        {currentMode === 'setup' && (
          <form onSubmit={handleSetupSubmit} className="space-y-3">
            <p className="text-[11px] text-slate-300">
              Choose a memorable 4-digit PIN. Avoid repeated (1111) or sequential (1234) patterns.
            </p>

            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">
                  Enter 4-Digit Security PIN:
                </label>
                <div className="flex items-center justify-center gap-2">
                  {pinDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={pinRefs[idx]}
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      disabled={isSubmitting}
                      onChange={(e) => handleDigitChange(idx, e.target.value, pinDigits, setPinDigits, pinRefs)}
                      onKeyDown={(e) => handleKeyDown(idx, e, pinDigits, pinRefs)}
                      className="w-10 h-11 text-center text-lg font-bold bg-[#071629] border border-[#16365B] focus:border-[#B9E5FF] focus:ring-1 focus:ring-[#B9E5FF] rounded-lg text-white transition-colors"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">
                  Confirm 4-Digit PIN:
                </label>
                <div className="flex items-center justify-center gap-2">
                  {confirmDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={confirmRefs[idx]}
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      disabled={isSubmitting}
                      onChange={(e) => handleDigitChange(idx, e.target.value, confirmDigits, setConfirmDigits, confirmRefs)}
                      onKeyDown={(e) => handleKeyDown(idx, e, confirmDigits, confirmRefs)}
                      className="w-10 h-11 text-center text-lg font-bold bg-[#071629] border border-[#16365B] focus:border-[#B9E5FF] focus:ring-1 focus:ring-[#B9E5FF] rounded-lg text-white transition-colors"
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[9px] text-slate-400">
              Pattern rules: Reject 0000, 1234, 1122, etc. Allowed examples: 2850, 5384, 7062.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#16365B]">
              <button
                type="button"
                onClick={onClose}
                className="py-1.5 px-3 rounded-lg bg-[#071629] hover:bg-[#16365B] text-slate-300 text-xs font-semibold border border-[#16365B] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || pinDigits.some((d) => !d) || confirmDigits.some((d) => !d)}
                className="py-1.5 px-3.5 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Security PIN</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
