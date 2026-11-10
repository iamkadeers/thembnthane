'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Article } from '@/types';
import { ArrowRight, Clock, MapPin, Eye, Radio, ShieldAlert } from 'lucide-react';

interface HeroNewsSectionProps {
  articles: Article[];
}

export const HeroNewsSection: React.FC<HeroNewsSectionProps> = ({ articles }) => {
  const { language, t } = useLanguage();

  if (!articles || articles.length === 0) return null;

  const leadArticle = articles.find((a) => a.is_featured) || articles[0];
  const sideArticles = articles.filter((a) => a.id !== leadArticle.id).slice(0, 4);

  const getTitle = (art: Article) => {
    if (language === 'hi' && art.title_hi) return art.title_hi;
    if (language === 'mr' && art.title_mr) return art.title_mr;
    return art.title;
  };

  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Large Featured Lead Story */}
        <div className="lg:col-span-8 group relative bg-black text-white border border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-neutral-900">
            <img
              src={leadArticle.featured_image}
              alt={leadArticle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

            {/* Badges on Top */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="bg-white text-black text-xs font-black px-3 py-1 rounded shadow-md tracking-wider uppercase flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                {t('heroBadge')}
              </span>
              <span className="bg-black/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded border border-neutral-700">
                {leadArticle.category_name || leadArticle.category_slug.toUpperCase()}
              </span>
            </div>

            {/* Bottom Overlay on Lead */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 text-white">
              <div className="flex items-center gap-4 text-xs font-medium text-neutral-300 mb-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-white" />
                  {leadArticle.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  {new Date(leadArticle.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-neutral-400" />
                  {leadArticle.views_count.toLocaleString('en-IN')} {t('views')}
                </span>
              </div>

              <Link href={`/news/${leadArticle.slug}`}>
                <h1 className="text-xl sm:text-3xl md:text-4xl font-black leading-tight sm:leading-snug mb-3 hover:text-neutral-300 transition-colors">
                  {getTitle(leadArticle)}
                </h1>
              </Link>

              <p className="text-neutral-300 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 mb-4 max-w-3xl font-normal leading-relaxed opacity-95">
                {leadArticle.summary}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                <span className="text-xs text-neutral-400 font-semibold">
                  By {leadArticle.author_name}
                </span>
                <Link
                  href={`/news/${leadArticle.slug}`}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-neutral-200 text-black font-bold text-xs sm:text-sm px-4 py-2 rounded-lg transition-colors shadow"
                >
                  <span>{t('readMore')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: 4 Trending Editorial Stories */}
        <div className="lg:col-span-4 flex flex-col space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b-2 border-black">
            <h3 className="font-extrabold text-base tracking-tight text-black uppercase flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-black"></span>
              {t('trending')}
            </h3>
            <span className="text-[11px] font-bold text-black uppercase tracking-widest">
              NATIONAL DESK
            </span>
          </div>

          <div className="flex flex-col space-y-3">
            {sideArticles.map((art, idx) => (
              <Link
                key={art.id}
                href={`/news/${art.slug}`}
                className="group flex gap-3.5 p-3 rounded-xl bg-white border border-neutral-200 hover:border-black shadow-sm transition-all"
              >
                <div className="relative w-28 h-20 sm:w-32 sm:h-22 shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                  <img
                    src={art.featured_image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-1 right-1 bg-black text-[10px] font-bold text-white px-1.5 py-0.5 rounded">
                    #{idx + 1}
                  </span>
                </div>

                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-black uppercase tracking-wider mb-1">
                    <span>{art.category_name || art.category_slug}</span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-neutral-500 font-normal capitalize">
                      {art.location}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-black group-hover:underline line-clamp-2 leading-snug">
                    {getTitle(art)}
                  </h4>

                  <div className="flex items-center gap-2 text-[10px] text-neutral-500 mt-1 font-medium">
                    <span>By {art.author_name}</span>
                    <span>•</span>
                    <span>{new Date(art.published_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Citizen Reporter Callout Box */}
          <div className="mt-2 p-3.5 rounded-xl bg-black text-white border border-neutral-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-white text-xs font-black uppercase tracking-wider mb-1">
                <ShieldAlert className="w-3.5 h-3.5 text-white" />
                Witnessed An Injustice?
              </div>
              <p className="text-[11px] text-neutral-400 leading-tight">
                Submit raw photos, videos & civic grievances to MBN ground desk.
              </p>
            </div>
            <Link
              href="/ground-issues/report"
              className="shrink-0 bg-white hover:bg-neutral-200 text-black font-bold text-xs px-3 py-2 rounded-lg transition-colors ml-3 text-center whitespace-nowrap"
            >
              Report Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
