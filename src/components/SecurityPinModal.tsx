import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { 
  validateSecurityPin, 
  verifySecurityPin, 
  setSecurityPin, 
  resetSecurityPin, 
  getSecurityPinStatus 
} from '../lib/securityPin';

export type PinModalMode = 'verify' | 'setup' | 'change' | 'reset';

interface SecurityPinModalProps {
  isOpen: boolean;
  mode: PinModalMode;
  userId: string;
  actionDescription?: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const SecurityPinModal: React.FC<SecurityPinModalProps> = ({
  isOpen,
  mode: initialMode,
  userId,
  actionDescription,
  onSuccess,
  onClose,
}) => {
  const [currentMode, setCurrentMode] = useState<PinModalMode>(initialMode);
  
  // Inputs
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '']);
  const [confirmDigits, setConfirmDigits] = useState<string[]>(['', '', '', '']);
  const [oldPinDigits, setOldPinDigits] = useState<string[]>(['', '', '', '']);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);

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

  // Sync mode & reset form when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentMode(initialMode);
      setPinDigits(['', '', '', '']);
      setConfirmDigits(['', '', '', '']);
      setOldPinDigits(['', '', '', '']);
      setErrorMessage(null);
      setSuccessMessage(null);

      // Check user PIN status
      if (userId) {
        getSecurityPinStatus(userId).then((status) => {
          setIsLocked(status.isLocked);
          setAttemptsRemaining(status.attemptsRemaining);
          if (status.isLocked) {
            setErrorMessage('No more attempts. Reset your Security PIN to continue.');
          }
        });
      }

      // Auto-focus first input
      setTimeout(() => {
        pinRefs[0].current?.focus();
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
    // Only numeric digits allowed
    const char = value.replace(/\D/g, '').slice(-1);
    const newArray = [...digitArray];
    newArray[index] = char;
    setArray(newArray);
    setErrorMessage(null);

    // Auto advance focus
    if (char && index < 3) {
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

  const handleSetupOrResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pin = pinDigits.join('');
    const confirm = confirmDigits.join('');

    if (pin.length !== 4) {
      setErrorMessage('Please enter all 4 digits for your new PIN.');
      return;
    }

    // Validate weak patterns
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
      const result = currentMode === 'reset'
        ? await resetSecurityPin(userId, pin)
        : await setSecurityPin(userId, pin);

      if (result.success) {
        setIsLocked(false);
        setAttemptsRemaining(3);
        setSuccessMessage(
          currentMode === 'reset'
            ? 'Security PIN successfully reset! Lockout cleared.'
            : 'Security PIN configured successfully.'
        );
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-xl sm:rounded-2xl w-full max-w-sm text-white shadow-2xl p-4 sm:p-5 space-y-3.5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#16365B] pb-2.5">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isLocked 
                ? 'bg-rose-950 text-rose-400' 
                : 'bg-[#16365B] text-[#B9E5FF]'
            }`}>
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white">
                {currentMode === 'verify' && 'Authorize Power Control'}
                {currentMode === 'setup' && 'Create Security PIN'}
                {currentMode === 'change' && 'Change Security PIN'}
                {currentMode === 'reset' && 'Reset Security PIN'}
              </h3>
              <span className="text-[9px] font-mono text-slate-400">
                4-Digit Transaction Security
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

        {/* Action description context banner */}
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
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-2.5 rounded bg-emerald-950/50 border border-emerald-800/80 text-[11px] text-emerald-200 flex items-start gap-1.5 leading-snug">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* FORM 1: VERIFY MODE */}
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
              <div className="p-2 rounded bg-rose-950/60 border border-rose-800 text-center space-y-1.5">
                <p className="text-[11px] text-rose-300 font-semibold">
                  No more attempts. Reset your Security PIN to continue.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentMode('reset');
                    setErrorMessage(null);
                  }}
                  className="w-full py-1.5 px-3 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                >
                  Reset Security PIN Now
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span>Attempts remaining: <strong className="text-white">{attemptsRemaining} of 3</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentMode('reset');
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
                className="py-2 px-3 rounded-lg bg-[#071629] hover:bg-[#16365B] text-slate-300 text-xs font-semibold border border-[#16365B] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLocked || isSubmitting || pinDigits.some((d) => !d)}
                className="py-2 px-4 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
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

        {/* FORM 2: SETUP OR RESET MODE */}
        {(currentMode === 'setup' || currentMode === 'reset') && (
          <form onSubmit={handleSetupOrResetSubmit} className="space-y-3">
            <p className="text-[11px] text-slate-300">
              {currentMode === 'reset'
                ? 'Create a new 4-digit Security PIN to clear lockout and protect remote switching.'
                : 'Choose a memorable 4-digit PIN. Avoid repeated (1111) or sequential (1234) patterns.'}
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
                className="py-1.5 px-3.5 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{currentMode === 'reset' ? 'Save & Clear Lockout' : 'Save Security PIN'}</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
