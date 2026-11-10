'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Article } from '@/types';
import { Clock, MapPin, ArrowRight, Sparkles, Filter } from 'lucide-react';

interface LatestNewsGridProps {
  articles: Article[];
}

export const LatestNewsGrid: React.FC<LatestNewsGridProps> = ({ articles }) => {
  const { language, t } = useLanguage();
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredArticles = selectedFilter === 'all'
    ? articles
    : articles.filter(a => a.category_slug === selectedFilter);

  const displayedArticles = filteredArticles.slice(0, visibleCount);

  const getTitle = (art: Article) => {
    if (language === 'hi' && art.title_hi) return art.title_hi;
    if (language === 'mr' && art.title_mr) return art.title_mr;
    return art.title;
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <section className="mb-14">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b-2 border-black gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight uppercase flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-black"></span>
            {t('latestNews')}
          </h2>
          <p className="text-xs text-neutral-500 font-medium">Verified news reports, field investigations & national updates</p>
        </div>

        {/* Quick category filter tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <Filter className="w-3.5 h-3.5 text-neutral-500 mr-1 shrink-0" />
          {[
            { id: 'all', label: 'All Updates' },
            { id: 'india', label: 'India' },
            { id: 'maharashtra', label: 'Maharashtra' },
            { id: 'politics', label: 'Politics' },
            { id: 'crime', label: 'Crime' },
            { id: 'business', label: 'Business' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-3 py-1 rounded-full font-semibold transition-all whitespace-nowrap text-xs border ${
                selectedFilter === cat.id
                  ? 'bg-black text-white border-black shadow-sm'
                  : 'bg-white text-black border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of news cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedArticles.map((art) => (
          <article
            key={art.id}
            className="group flex flex-col bg-white border border-neutral-300 hover:border-black rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            {/* Card Thumbnail */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
              <img
                src={art.featured_image}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {art.category_name || art.category_slug}
                </span>
                {art.is_breaking && (
                  <span className="bg-white text-black border border-black text-[10px] font-black px-2 py-0.5 rounded tracking-wide uppercase">
                    BREAKING
                  </span>
                )}
              </div>
            </div>

            {/* Card Content */}
            <div className="flex flex-col justify-between flex-1 p-5">
              <div>
                <div className="flex items-center gap-3 text-xs text-neutral-500 font-medium mb-2.5">
                  <span className="flex items-center gap-1 text-black font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-black" />
                    {art.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    {new Date(art.published_at).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <Link href={`/news/${art.slug}`}>
                  <h3 className="text-base sm:text-lg font-bold text-black group-hover:underline transition-colors line-clamp-2 leading-snug mb-2.5">
                    {getTitle(art)}
                  </h3>
                </Link>

                <p className="text-neutral-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                  {art.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-neutral-500">
                  By {art.author_name}
                </span>
                <Link
                  href={`/news/${art.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-black group-hover:underline"
                >
                  <span>{t('readMore')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < filteredArticles.length && (
        <div className="text-center mt-10">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold px-7 py-3 rounded-xl transition-all shadow active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>{t('loadMore')}</span>
          </button>
        </div>
      )}
    </section>
  );
};
