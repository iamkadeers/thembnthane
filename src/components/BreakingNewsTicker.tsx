'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { storage } from '@/lib/storage';
import { Article } from '@/types';
import { ChevronRight, Radio } from 'lucide-react';

export const BreakingNewsTicker: React.FC = () => {
  const { language, t } = useLanguage();
  const [breakingArticles, setBreakingArticles] = useState<Article[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const articles = storage.getArticles().filter((a) => a.is_breaking || a.is_trending);
    setBreakingArticles(articles);
  }, []);

  useEffect(() => {
    if (breakingArticles.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingArticles.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [breakingArticles]);

  if (breakingArticles.length === 0) return null;

  const current = breakingArticles[currentIndex];
  const displayTitle =
    language === 'hi' && current.title_hi
      ? current.title_hi
      : language === 'mr' && current.title_mr
      ? current.title_mr
      : current.title;

  return (
    <div className="bg-black text-white border-b border-neutral-800 text-xs sm:text-sm font-medium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-10">
        <div className="flex items-center gap-3 overflow-hidden flex-1 mr-4">
          <div className="flex items-center gap-1.5 bg-white text-black px-2.5 py-1 rounded text-[11px] font-black tracking-wider shrink-0 uppercase">
            <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
            {t('live')} {t('breaking')}
          </div>
          
          <div className="flex items-center gap-2 truncate text-neutral-300 hover:text-white transition-colors">
            <Link
              href={`/news/${current.slug}`}
              className="truncate hover:underline font-medium text-neutral-100 flex items-center gap-1.5"
            >
              <span>{displayTitle}</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0 inline" />
            </Link>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-[11px] text-neutral-400 shrink-0 border-l border-neutral-800 pl-4">
          <span className="flex items-center gap-1.5 text-neutral-300">
            <Radio className="w-3 h-3 text-white animate-pulse" />
            24/7 Digital Desk
          </span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-300 font-mono">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
