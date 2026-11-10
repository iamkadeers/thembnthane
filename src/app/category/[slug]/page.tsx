'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES } from '@/lib/mockData';
import { storage } from '@/lib/storage';
import { Article, Category } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { Clock, MapPin, ArrowRight } from 'lucide-react';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const { language, t } = useLanguage();

  useEffect(() => {
    params.then((p) => {
      setResolvedParams(p);
      const cat = CATEGORIES.find((c) => c.slug === p.slug);
      if (cat) {
        setCategory(cat);
        const all = storage.getArticles();
        setArticles(all.filter((a) => a.category_slug === p.slug));
      }
    });
  }, [params]);

  if (resolvedParams && !category) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Category Not Found</h2>
        <Link href="/" className="bg-red-600 text-white font-bold px-5 py-2.5 rounded-lg text-sm">
          Return to MBN Home
        </Link>
      </div>
    );
  }

  if (!category) return null;

  const catName =
    language === 'hi' && category.name_hi
      ? category.name_hi
      : language === 'mr' && category.name_mr
      ? category.name_mr
      : category.name;

  return (
    <div className="py-4">
      {/* Category Header */}
      <div className="border-b-4 border-red-600 pb-6 mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-widest mb-1">
          <span>DESK COVERAGE</span>
          <span>•</span>
          <span>MBN LIVE REGIONAL & NATIONAL FEED</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
          {catName} News
        </h1>
        {category.description && (
          <p className="text-sm text-neutral-600 mt-2 max-w-2xl font-medium">
            {category.description}
          </p>
        )}
      </div>

      {articles.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200">
          <p className="text-neutral-500 text-sm mb-4">
            No published stories in this desk currently. Real-time dispatches arriving shortly.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg"
          >
            <span>Back to Homepage</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <article
              key={art.id}
              className="group flex flex-col bg-white border border-neutral-200/90 hover:border-neutral-400 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                <img
                  src={art.featured_image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-neutral-900/90 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  {art.category_name || art.category_slug}
                </span>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2 font-medium">
                    <span className="flex items-center gap-1 font-semibold text-neutral-700">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      {art.location}
                    </span>
                    <span>•</span>
                    <span>{new Date(art.published_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                  </div>

                  <Link href={`/news/${art.slug}`}>
                    <h2 className="text-base sm:text-lg font-bold text-neutral-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug mb-2">
                      {language === 'hi' && art.title_hi
                        ? art.title_hi
                        : language === 'mr' && art.title_mr
                        ? art.title_mr
                        : art.title}
                    </h2>
                  </Link>

                  <p className="text-neutral-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-neutral-500">
                    By {art.author_name}
                  </span>
                  <Link
                    href={`/news/${art.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-red-600 group-hover:text-red-700"
                  >
                    <span>{t('readMore')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
