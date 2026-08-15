'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

function WebhookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c0-2.21 1.79-4 4-4h1" />
      <path d="M6 13V7a4 4 0 0 1 7.07-2.55" />
      <circle cx="18" cy="17" r="3" />
      <circle cx="6" cy="7" r="3" />
      <circle cx="15" cy="5" r="2" />
    </svg>
  );
}

function DatabaseSyncIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
    </svg>
  );
}

export function Preloader() {
  const pathname = usePathname() || '';
  const isArabic = pathname.startsWith('/ar');
  const isFrench = pathname.startsWith('/fr');
  const locale = isArabic ? 'ar' : isFrench ? 'fr' : 'en';

  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'boot' | 'dispatch' | 'verified'>('boot');
  const [isThemeSwitch, setIsThemeSwitch] = useState(false);
  const [targetTheme, setTargetTheme] = useState<'dark' | 'light'>('dark');

  const copy = {
    en: {
      boot: 'INITIALIZING AGENT...',
      dispatch: 'CONNECTING NODES...',
      verified: 'PIPELINE ACTIVE',
      trigger: 'TRIGGER',
      triggerSub: 'Webhook::In',
      crm: 'CRM SYNC',
      crmSub: 'Status: 200 OK',
      crmConnecting: 'Connecting...',
      kicker: 'ISMAIL SABBAR · AUTOMATION & CRM ARCHITECT · 99.8% SLA',
      switchingDark: 'SHIFTING TO DARK MODE...',
      switchingLight: 'SHIFTING TO LIGHT MODE...',
      skip: 'ESC / SKIP',
    },
    fr: {
      boot: "INITIALISATION DE L'AGENT...",
      dispatch: 'CONNEXION DES NŒUDS...',
      verified: 'PIPELINE ACTIF',
      trigger: 'DÉCLENCHEUR',
      triggerSub: 'Webhook::Entrant',
      crm: 'SYNC CRM',
      crmSub: 'Statut: 200 OK',
      crmConnecting: 'Connexion...',
      kicker: 'ISMAIL SABBAR · ARCHITECTE AUTOMATISATION & CRM · 99.8% DISPONIBILITÉ',
      switchingDark: 'PASSAGE EN MODE SOMBRE...',
      switchingLight: 'PASSAGE EN MODE CLAIR...',
      skip: 'PASSER',
    },
    ar: {
      boot: 'جاري تشغيل النظام الذكي...',
      dispatch: 'ربط العقد البرمجية...',
      verified: 'النظام جاهز للعمل',
      trigger: 'المُشغّل',
      triggerSub: 'Webhook::مدخل',
      crm: 'مزامنة CRM',
      crmSub: 'الحالة: 200 OK',
      crmConnecting: 'جاري الاتصال...',
      kicker: 'إسماعيل صبار · مهندس أتمتة الأنظمة وإدارة العملاء CRM · موثوقية 99.8%',
      switchingDark: 'التحويل إلى الوضع الليلي...',
      switchingLight: 'التحويل إلى الوضع النهاري...',
      skip: 'تخطي',
    },
  }[locale];

  // Initial Load Sequence
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(false);
      return;
    }

    document.body.style.overflow = 'hidden';

    const startTime = Date.now();
    const duration = 2000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct > 25 && pct <= 70) {
        setStage('dispatch');
      } else if (pct > 70) {
        setStage('verified');
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          document.body.style.overflow = '';
        }, 300);
      }
    }, 25);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
    };
  }, []);

  // Theme Switch Micro-Preloader Listener
  useEffect(() => {
    const handleThemeSwitch = (event: Event) => {
      const customEvent = event as CustomEvent<{ nextTheme: 'dark' | 'light' }>;
      const next = customEvent.detail.nextTheme;

      setIsThemeSwitch(true);
      setTargetTheme(next);
      setIsVisible(true);
      setStage('dispatch');
      setProgress(50);
      document.body.style.overflow = 'hidden';

      // Mid-point: Commit the DOM Theme Change behind the veil
      setTimeout(() => {
        localStorage.setItem('theme', next);
        document.documentElement.setAttribute('data-theme', next);
        if (next === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        }
        setStage('verified');
        setProgress(100);
      }, 280);

      // Finish and unveil
      setTimeout(() => {
        setIsVisible(false);
        setIsThemeSwitch(false);
        document.body.style.overflow = '';
      }, 650);
    };

    window.addEventListener('imsabbar-theme-switch', handleThemeSwitch);
    return () => window.removeEventListener('imsabbar-theme-switch', handleThemeSwitch);
  }, []);

  const handleSkip = () => {
    setIsVisible(false);
    setIsThemeSwitch(false);
    document.body.style.overflow = '';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="imsabbar-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: 'blur(12px)',
            transition: { duration: isThemeSwitch ? 0.35 : 0.5, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center select-none overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          {/* Ambient Cyber Radial Glow */}
          <div className="absolute w-[32rem] h-[32rem] rounded-full blur-[120px] pointer-events-none bg-[var(--color-accent-primary)]/15 transition-colors duration-500" />

          {/* Top Skip Button */}
          {!isThemeSwitch && (
            <button
              onClick={handleSkip}
              className={`absolute top-6 ${
                isArabic ? 'left-6' : 'right-6'
              } px-3.5 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-strong)] text-xs font-mono transition-all cursor-pointer z-50 shadow-lg`}
              title={copy.skip}
            >
              {copy.skip}
            </button>
          )}

          {/* Main Visual Stage */}
          <div className="relative flex flex-col items-center max-w-md sm:max-w-lg w-full px-6 z-10">
            
            {/* Robot Chassis & Connector Network */}
            <div className="relative w-full h-52 sm:h-56 flex items-center justify-center">
              
              {/* SVG Dynamic Connector Laser Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 460 200">
                <defs>
                  <linearGradient id="laserGradLeft" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="laserGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.95" />
                  </linearGradient>
                </defs>

                {/* Left Wire: Robot -> Incoming Trigger */}
                <motion.path
                  d="M 195 65 C 140 65, 100 135, 55 145"
                  fill="none"
                  stroke="url(#laserGradLeft)"
                  strokeWidth="2.5"
                  strokeDasharray="5 5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: stage !== 'boot' ? 1 : 0,
                    opacity: stage !== 'boot' ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />

                {/* Right Wire: Robot -> CRM Sync */}
                <motion.path
                  d="M 265 65 C 320 65, 360 135, 405 145"
                  fill="none"
                  stroke="url(#laserGradRight)"
                  strokeWidth="2.5"
                  strokeDasharray="5 5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: stage !== 'boot' ? 1 : 0,
                    opacity: stage !== 'boot' ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </svg>

              {/* Central Geometric Robot Head */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-2 flex flex-col items-center z-20"
              >
                {/* Antenna */}
                <div className="w-1.5 h-4 bg-cyan-500/40 rounded-full flex items-start justify-center">
                  <span className="w-3 h-3 -top-1.5 relative rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,1)] animate-pulse" />
                </div>

                {/* Bot Chassis */}
                <div className="w-20 h-16 sm:w-22 sm:h-18 rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-[0_10px_30px_rgba(6,182,212,0.18)] flex flex-col items-center justify-center p-2.5 relative transition-colors duration-300">
                  {/* Visor Screen */}
                  <div className="w-full h-8 rounded-xl bg-black/90 border border-cyan-500/35 flex items-center justify-center gap-2.5 px-2 overflow-hidden shadow-inner">
                    {stage === 'boot' ? (
                      /* Scanning Visor Bar */
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 0.4 }}
                        className="h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#06b6d4]"
                      />
                    ) : stage === 'dispatch' ? (
                      /* Blinking Optical Sensor */
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4] animate-ping" />
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]" />
                      </div>
                    ) : (
                      /* Verified Lock-on Visor */
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#10b981]" />
                        <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#10b981]" />
                      </div>
                    )}
                  </div>
                  {/* Mouth Line */}
                  <div className="w-5 h-0.5 rounded-full mt-2 bg-[var(--color-text-faint)]" />
                </div>
              </motion.div>

              {/* Left Node: Webhook Trigger */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{
                  opacity: stage !== 'boot' ? 1 : 0.25,
                  x: stage !== 'boot' ? 0 : -12,
                }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-2 left-0 sm:left-1 px-3.5 py-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 shadow-xl text-left backdrop-blur-md transition-colors duration-300"
              >
                <p className="text-xs font-bold font-display text-[var(--color-accent-primary)] flex items-center gap-1.5">
                  <WebhookIcon className="w-3.5 h-3.5 text-[var(--color-accent-primary)]" />
                  <span>{copy.trigger}</span>
                </p>
                <p className="text-[10px] font-mono mt-0.5 text-[var(--color-text-muted)]">
                  {copy.triggerSub}
                </p>
              </motion.div>

              {/* Right Node: CRM Sync */}
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{
                  opacity: stage !== 'boot' ? 1 : 0.25,
                  x: stage !== 'boot' ? 0 : 12,
                }}
                transition={{ duration: 0.3 }}
                className={`absolute bottom-2 right-0 sm:right-1 px-3.5 py-2 rounded-2xl border transition-all duration-300 shadow-xl text-left backdrop-blur-md bg-[var(--color-surface)]/95 ${
                  stage === 'verified'
                    ? 'border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                    : 'border-[var(--color-border)]'
                }`}
              >
                <p className="text-xs font-bold font-display text-emerald-500 flex items-center gap-1.5">
                  <DatabaseSyncIcon className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{copy.crm}</span>
                </p>
                <p className="text-[10px] font-mono mt-0.5 text-[var(--color-text-muted)]">
                  {stage === 'verified' ? copy.crmSub : copy.crmConnecting}
                </p>
              </motion.div>
            </div>

            {/* Monospace Telemetry Ticker & Progress Bar */}
            <div className="w-full mt-5 space-y-2.5 text-center">
              <div className="flex items-center justify-between text-xs font-mono px-1 text-[var(--color-text-muted)]">
                <span className="flex items-center gap-2 text-[var(--color-accent-primary)] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-accent-primary)] animate-ping" />
                  {isThemeSwitch
                    ? targetTheme === 'dark'
                      ? copy.switchingDark
                      : copy.switchingLight
                    : stage === 'boot'
                    ? copy.boot
                    : stage === 'dispatch'
                    ? copy.dispatch
                    : copy.verified}
                </span>
                <span className="font-bold tracking-widest text-sm text-[var(--color-text)]">
                  {progress}%
                </span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-1.5 rounded-full overflow-hidden p-0.5 border bg-[var(--color-surface-raised)] border-[var(--color-border)]">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Micro Telemetry Kicker */}
              <p className="text-[11px] font-mono tracking-wider pt-1 text-[var(--color-text-muted)] font-medium">
                {copy.kicker}
              </p>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
