'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Article } from '@/types';
import { TrendingUp, ArrowRight, Eye } from 'lucide-react';

interface TrendingNewsProps {
  articles: Article[];
}

export const TrendingNews: React.FC<TrendingNewsProps> = ({ articles }) => {
  const { language, t } = useLanguage();

  const trendingList = articles
    .slice(0, 5)
    .sort((a, b) => (b.views_count || 0) - (a.views_count || 0));

  const getTitle = (art: Article) => {
    if (language === 'hi' && art.title_hi) return art.title_hi;
    if (language === 'mr' && art.title_mr) return art.title_mr;
    return art.title;
  };

  return (
    <section className="mb-12 bg-black text-white rounded-2xl p-6 sm:p-8 border border-neutral-900 shadow-md">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
              {t('trending')} • 24H Radar
            </h2>
            <p className="text-xs text-neutral-400">Most engaged citizen stories and national investigations</p>
          </div>
        </div>

        <Link
          href="/category/india"
          className="hidden sm:flex items-center gap-1 text-xs font-bold text-neutral-300 hover:text-white transition-colors uppercase tracking-wider"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {trendingList.map((art, index) => (
          <Link
            key={art.id}
            href={`/news/${art.slug}`}
            className="group relative flex flex-col justify-between bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 rounded-xl p-4 transition-all"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl font-black text-white tracking-tighter">
                  0{index + 1}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                  {art.category_name || art.category_slug}
                </span>
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-neutral-100 group-hover:text-white transition-colors line-clamp-3 leading-snug mb-3">
                {getTitle(art)}
              </h3>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
              <span className="truncate">{art.location}</span>
              <span className="flex items-center gap-1 font-mono text-[10px] text-neutral-300 shrink-0">
                <Eye className="w-3 h-3 text-white" />
                {Math.round(art.views_count / 1000)}k
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
