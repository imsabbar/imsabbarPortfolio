'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { SunIcon, MoonIcon } from '@/components/icons';

interface ThemeToggleProps {
  label?: string;
}

export function ThemeToggle({ label = 'Toggle theme' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const savedTheme = (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [pathname]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    window.dispatchEvent(new CustomEvent('imsabbar-theme-switch', { detail: { nextTheme } }));
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      className={`relative p-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2 ${
        theme === 'dark'
          ? 'hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:shadow-[0_0_14px_rgba(6,182,212,0.22)]'
          : 'hover:border-amber-400/50 hover:bg-amber-500/10 hover:shadow-[0_0_14px_rgba(245,158,11,0.18)]'
      }`}
    >
      <motion.div
        key={theme}
        initial={{ scale: 0.7, rotate: -40, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 18 }}
        whileHover={{ scale: 1.18, rotate: theme === 'dark' ? -15 : 20 }}
        className="flex items-center justify-center"
      >
        {theme === 'dark' ? (
          <MoonIcon className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]" />
        ) : (
          <SunIcon className="w-4 h-4 text-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
        )}
      </motion.div>
    </button>
  );
}
