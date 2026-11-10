'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { storage } from '@/lib/storage';
import { Mail, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      storage.subscribeNewsletter(email);
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="mb-14 rounded-3xl bg-black border border-neutral-800 text-white p-6 sm:p-10 relative overflow-hidden">
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-700 text-white flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6" />
        </div>

        <h2 className="text-xl sm:text-3xl font-black tracking-tight mb-2">
          {t('newsletterTitle')}
        </h2>

        <p className="text-xs sm:text-sm text-neutral-400 mb-6 max-w-xl mx-auto leading-relaxed">
          {t('newsletterDesc')}
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-700 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{t('subscribeSuccess')}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
            />
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-200 text-black font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow shrink-0"
            >
              <span>{t('subscribe')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-500 mt-4">
          <span className="flex items-center gap-1 text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            Strict Privacy Guarantee
          </span>
          <span>•</span>
          <span>No Spam, Ever</span>
          <span>•</span>
          <span>One-Click Unsubscribe</span>
        </div>
      </div>
    </section>
  );
};
