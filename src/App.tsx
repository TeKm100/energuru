/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Page, PublicPage, AuthPage, InfoModalType, UserProfile } from './types';
import { supabase, isSupabaseConfigured, extractAuthCallbackParams, cleanAuthUrlParams } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { AuthNavbar } from './components/AuthNavbar';
import { Footer } from './components/Footer';
import { InfoModal } from './components/InfoModal';
import { OnboardingModal } from './components/OnboardingModal';
import { Logo } from './components/Logo';

// Public & Core Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ContactPage } from './pages/ContactPage';
import { SignInPage } from './pages/SignInPage';
import { CreateAccountPage } from './pages/CreateAccountPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

// Authenticated App & Platform Feature Pages
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { EnergyCostsPage } from './pages/EnergyCostsPage';
import { OutagePrepPage } from './pages/OutagePrepPage';
import { CommunityFundingPage } from './pages/CommunityFundingPage';
import { ConnectorPage } from './pages/ConnectorPage';
import { ConnectDevicePage } from './pages/ConnectDevicePage';
import { BuyConnectorPage } from './pages/BuyConnectorPage';
import { GetQuotePage } from './pages/GetQuotePage';
import { PlansPage } from './pages/PlansPage';
import { ModulePlaceholderPage } from './pages/ModulePlaceholderPage';
import { EnergyMonitoringPage } from './pages/EnergyMonitoringPage';
import { GroupLandingPage } from './pages/GroupLandingPage';

import { Loader2 } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [activeModal, setActiveModal] = useState<InfoModalType>(null);
  const [userSession, setUserSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isInitialSessionLoading, setIsInitialSessionLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [authNotice, setAuthNotice] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
    detail?: string;
  } | null>(null);
  const [isPasswordRecoveryMode, setIsPasswordRecoveryMode] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  // Fetch user profile from public.profiles table
  const fetchUserProfile = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data && !error) {
        setUserProfile(data as UserProfile);
      }
    } catch (err) {
      console.warn('Could not retrieve user profile from database:', err);
    }
  }, []);

  // Determine if user has completed or dismissed onboarding
  const checkOnboardingStatus = (user: any) => {
    if (!user) return;
    const userId = user.id;
    const metaCompleted = user.user_metadata?.onboarding_completed;
    const localCompleted = localStorage.getItem(`energuru_onboarding_completed_${userId}`);
    const localDismissed = localStorage.getItem(`energuru_onboarding_dismissed_${userId}`);

    if (!metaCompleted && !localCompleted && !localDismissed) {
      setShowOnboarding(true);
    }
  };

  // Listen to Supabase auth state changes and initial session check
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsInitialSessionLoading(false);
      return;
    }

    let isMounted = true;

    // 1. Inspect URL callback parameters for verification or recovery tokens/errors
    const callbackParams = extractAuthCallbackParams();

    if (callbackParams.hasAuthData) {
      if (callbackParams.errorCode || callbackParams.errorDescription) {
        const isOtpExpired = callbackParams.errorCode === 'otp_expired' || 
          callbackParams.errorDescription?.toLowerCase().includes('expired') ||
          callbackParams.errorDescription?.toLowerCase().includes('invalid');

        if (callbackParams.type === 'recovery' || (typeof window !== 'undefined' && window.location.hash.includes('recovery'))) {
          setRecoveryError(
            isOtpExpired 
              ? 'Your password recovery link has expired or has already been used. Please request a new link.'
              : (callbackParams.errorDescription || 'Password recovery link is invalid or expired.')
          );
          setCurrentPage('reset-password');
        } else {
          setAuthNotice({
            type: 'error',
            text: isOtpExpired 
              ? 'Verification link has expired or has already been used.' 
              : 'Email verification could not be completed.',
            detail: callbackParams.errorDescription || 'Please try signing in, or register again if your account is not yet active.',
          });
          setCurrentPage('signin');
        }
        cleanAuthUrlParams();
      } else if (callbackParams.type === 'recovery') {
        setIsPasswordRecoveryMode(true);
        setCurrentPage('reset-password');
      } else if (callbackParams.type === 'signup') {
        setAuthNotice({
          type: 'success',
          text: 'Email verified successfully!',
          detail: 'Your EnerGuru account is activated. Please sign in below.',
        });
        setCurrentPage('signin');
        cleanAuthUrlParams();
      }
    }

    // 2. Check initial active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      setUserSession(session);
      setIsInitialSessionLoading(false);

      if (session?.user) {
        fetchUserProfile(session.user.id);
        // Only navigate to dashboard if NOT in recovery flow and NOT already on reset-password
        if (!isPasswordRecoveryMode && callbackParams.type !== 'recovery' && !callbackParams.errorCode) {
          setCurrentPage('dashboard');
          checkOnboardingStatus(session.user);
        }
      }
    }).catch(() => {
      if (isMounted) setIsInitialSessionLoading(false);
    });

    // 3. Subscribe to auth events (SIGN_IN, SIGN_OUT, PASSWORD_RECOVERY, TOKEN_REFRESHED)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      setUserSession(session);

      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecoveryMode(true);
        setCurrentPage('reset-password');
        setRecoveryError(null);
        cleanAuthUrlParams();
        return;
      }

      if (session?.user) {
        await fetchUserProfile(session.user.id);
        if (event === 'SIGNED_IN') {
          if (isPasswordRecoveryMode) {
            setCurrentPage('reset-password');
            return;
          }
          if (callbackParams.type === 'signup') {
            setAuthNotice({
              type: 'success',
              text: 'Email verified successfully!',
              detail: 'Your EnerGuru account is activated and you are signed in.',
            });
            cleanAuthUrlParams();
          }
          setCurrentPage('dashboard');
          checkOnboardingStatus(session.user);
        }
      } else {
        setUserProfile(null);
        setShowOnboarding(false);
        // If logged out while viewing a protected page, return to home
        setCurrentPage((prev) => {
          const protectedPages: Page[] = [
            'dashboard', 
            'profile', 
            'settings', 
            'equipment', 
            'energy-costs', 
            'outage-prep', 
            'connect-device'
          ];
          return protectedPages.includes(prev) ? 'home' : prev;
        });
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  // Handle navigation
  const handleNavigate = (page: Page) => {
    const protectedPages: Page[] = [
      'dashboard', 
      'profile', 
      'settings', 
      'equipment', 
      'energy-costs', 
      'outage-prep', 
      'connect-device'
    ];

    if (userSession && !isPasswordRecoveryMode && currentPage !== 'reset-password') {
      if (page === 'signin' || page === 'create-account') {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage(page);
      }
    } else {
      if (protectedPages.includes(page)) {
        setCurrentPage('signin');
      } else {
        setCurrentPage(page);
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sign out handler (immediate optimistic local state clearance for single-click response)
  const handleSignOut = async () => {
    setUserSession(null);
    setUserProfile(null);
    setIsPasswordRecoveryMode(false);
    setRecoveryError(null);
    setShowOnboarding(false);
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out error:', err);
      }
    }
  };

  // Complete onboarding handler (updates nickname and sets completion flag)
  const handleCompleteOnboarding = async (nickname?: string) => {
    if (!userSession?.user) return;
    const userId = userSession.user.id;

    try {
      if (nickname && nickname.trim()) {
        await supabase
          .from('profiles')
          .update({ nickname: nickname.trim(), updated_at: new Date().toISOString() })
          .eq('id', userId);

        await supabase.auth.updateUser({
          data: { nickname: nickname.trim(), onboarding_completed: true },
        });

        await fetchUserProfile(userId);
      } else {
        await supabase.auth.updateUser({
          data: { onboarding_completed: true },
        });
      }

      localStorage.setItem(`energuru_onboarding_completed_${userId}`, 'true');
    } catch (e) {
      console.warn('Error completing onboarding:', e);
    } finally {
      setShowOnboarding(false);
    }
  };

  // Dismiss onboarding handler
  const handleDismissOnboarding = () => {
    if (userSession?.user) {
      localStorage.setItem(`energuru_onboarding_dismissed_${userSession.user.id}`, 'true');
    }
    setShowOnboarding(false);
  };

  const displayName = userProfile?.nickname || userProfile?.full_name || userSession?.user?.email?.split('@')[0] || 'User';

  // 1. Initial Session Loading Screen (Prevents flickering public website for authenticated users)
  if (isInitialSessionLoading) {
    return (
      <div className="min-h-screen bg-[#071629] text-white flex flex-col items-center justify-center p-6 space-y-4">
        <Logo size="lg" />
        <div className="flex items-center gap-2 text-xs text-[#B9E5FF]">
          <Loader2 className="w-4 h-4 animate-spin text-[#B9E5FF]" />
          <span>Verifying secure session...</span>
        </div>
      </div>
    );
  }

  // 2. Authenticated App Experience (Signed In - but NOT during password recovery)
  if (userSession && !isPasswordRecoveryMode && currentPage !== 'reset-password') {
    // Current page cast for AuthNavbar active tab
    const authCurrentPage = (
      [
        'dashboard', 
        'energy-management',
        'devices-operations',
        'business-enterprise',
        'community-impact',
        'account-plans',
        'equipment', 
        'energy-costs', 
        'outage-prep', 
        'community-funding', 
        'connector', 
        'connect-device', 
        'buy-connector', 
        'get-quote', 
        'plans', 
        'profile', 
        'settings',
        'energy-monitoring',
        'power-control',
        'alerts',
        'ai-intelligence',
        'connector-management'
      ].includes(currentPage)
        ? currentPage
        : 'dashboard'
    ) as AuthPage;

    return (
      <div className="min-h-screen bg-[#071629] text-white flex flex-col font-sans selection:bg-[#B9E5FF] selection:text-[#071629]">
        {/* Authenticated Navigation Bar */}
        <AuthNavbar
          currentPage={authCurrentPage}
          onNavigate={(p) => handleNavigate(p)}
          onSignOut={handleSignOut}
          displayName={displayName}
          userEmail={userSession.user?.email || ''}
        />

        {/* Authenticated Page Content */}
        <main className="flex-1 pb-16">
          {(![
            'energy-management',
            'devices-operations',
            'business-enterprise',
            'community-impact',
            'account-plans',
            'equipment',
            'energy-costs',
            'outage-prep',
            'community-funding',
            'connector',
            'connect-device',
            'buy-connector',
            'get-quote',
            'plans',
            'profile',
            'settings',
            'about',
            'how-it-works',
            'contact',
            'energy-monitoring',
            'power-control',
            'alerts',
            'ai-intelligence',
            'connector-management'
          ].includes(currentPage) || currentPage === 'dashboard') && (
            <DashboardPage
              userProfile={userProfile}
              userEmail={userSession.user?.email || null}
              onNavigate={(p) => handleNavigate(p)}
              onOpenOnboarding={() => setShowOnboarding(true)}
            />
          )}

          {/* Group Landing Pages */}
          {[
            'energy-management',
            'devices-operations',
            'business-enterprise',
            'community-impact',
            'account-plans'
          ].includes(currentPage) && (
            <GroupLandingPage
              groupId={currentPage as AuthPage}
              onNavigate={handleNavigate}
            />
          )}

          {/* Full Energy Monitoring & Analytics Module */}
          {currentPage === 'energy-monitoring' && (
            <EnergyMonitoringPage onNavigate={handleNavigate} />
          )}

          {/* Upcoming In-Development Modules */}
          {[
            'power-control',
            'alerts',
            'ai-intelligence',
            'connector-management'
          ].includes(currentPage) && (
            <ModulePlaceholderPage
              pageId={currentPage as AuthPage}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'equipment' && (
            <EquipmentPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'energy-costs' && (
            <EnergyCostsPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'outage-prep' && (
            <OutagePrepPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'community-funding' && (
            <CommunityFundingPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'connector' && (
            <ConnectorPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'connect-device' && (
            <ConnectDevicePage onNavigate={handleNavigate} />
          )}

          {currentPage === 'buy-connector' && (
            <BuyConnectorPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'get-quote' && (
            <GetQuotePage
              onNavigate={handleNavigate}
              userProfile={userProfile}
              userEmail={userSession.user?.email || null}
              userId={userSession.user?.id || null}
            />
          )}

          {currentPage === 'plans' && (
            <PlansPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'profile' && (
            <ProfilePage
              userProfile={userProfile}
              userEmail={userSession.user?.email || null}
              userId={userSession.user?.id || null}
              onNavigate={(p) => handleNavigate(p)}
              onProfileUpdated={() => fetchUserProfile(userSession.user.id)}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              userEmail={userSession.user?.email || null}
              onNavigate={(p) => handleNavigate(p)}
              onSignOut={handleSignOut}
            />
          )}

          {currentPage === 'about' && (
            <AboutPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'how-it-works' && (
            <HowItWorksPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'contact' && (
            <ContactPage onNavigate={handleNavigate} />
          )}
        </main>

        {/* First-time Onboarding Modal */}
        <OnboardingModal
          isOpen={showOnboarding}
          userProfile={userProfile}
          userEmail={userSession.user?.email || null}
          onComplete={handleCompleteOnboarding}
          onDismiss={handleDismissOnboarding}
          onNavigateToProfile={() => handleNavigate('profile')}
        />
      </div>
    );
  }

  // 3. Public Website Experience (Signed Out or Password Recovery Flow)
  const publicCurrentPage = (
    ['home', 'about', 'how-it-works', 'contact', 'signin', 'create-account', 'forgot-password', 'reset-password', 'plans', 'connector', 'buy-connector', 'community-funding', 'get-quote'].includes(currentPage) 
      ? currentPage 
      : 'home'
  ) as Page;

  return (
    <div className="min-h-screen bg-[#071629] text-white flex flex-col font-sans selection:bg-[#B9E5FF] selection:text-[#071629]">
      {/* Public Navigation Header */}
      <Navbar 
        currentPage={publicCurrentPage} 
        onNavigate={handleNavigate}
        isAuthenticated={false}
      />

      {/* Public Main Page Content */}
      <main className="flex-1">
        {publicCurrentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {publicCurrentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {publicCurrentPage === 'how-it-works' && <HowItWorksPage onNavigate={handleNavigate} />}
        {publicCurrentPage === 'contact' && <ContactPage onNavigate={handleNavigate} />}
        {publicCurrentPage === 'signin' && (
          <SignInPage 
            onNavigate={handleNavigate} 
            onOpenModal={setActiveModal} 
            authNotice={authNotice}
            onClearAuthNotice={() => setAuthNotice(null)}
          />
        )}
        {publicCurrentPage === 'create-account' && (
          <CreateAccountPage onNavigate={handleNavigate} />
        )}
        {publicCurrentPage === 'forgot-password' && (
          <ForgotPasswordPage onNavigate={handleNavigate} />
        )}
        {publicCurrentPage === 'reset-password' && (
          <ResetPasswordPage 
            onNavigate={(p) => {
              if (p === 'signin') {
                setIsPasswordRecoveryMode(false);
                setRecoveryError(null);
                setAuthNotice({
                  type: 'success',
                  text: 'Password updated successfully!',
                  detail: 'Please sign in with your new password.',
                });
              }
              handleNavigate(p);
            }} 
            initialError={recoveryError} 
          />
        )}
        {publicCurrentPage === 'plans' && (
          <PlansPage onNavigate={handleNavigate} />
        )}
        {publicCurrentPage === 'connector' && (
          <ConnectorPage onNavigate={handleNavigate} />
        )}
        {publicCurrentPage === 'buy-connector' && (
          <BuyConnectorPage onNavigate={handleNavigate} />
        )}
        {publicCurrentPage === 'community-funding' && (
          <CommunityFundingPage onNavigate={handleNavigate} />
        )}
        {publicCurrentPage === 'get-quote' && (
          <GetQuotePage 
            onNavigate={handleNavigate} 
            userProfile={null} 
            userEmail={null} 
            userId={null} 
          />
        )}
      </main>

      {/* Public Global Footer */}
      <Footer onNavigate={handleNavigate} onOpenModal={setActiveModal} />

      {/* Accessible Informational & Legal Modal */}
      <InfoModal 
        modalType={activeModal} 
        onClose={() => setActiveModal(null)} 
        onNavigate={handleNavigate} 
      />
    </div>
  );
}
