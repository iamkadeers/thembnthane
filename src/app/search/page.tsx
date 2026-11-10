'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { storage } from '@/lib/storage';
import { Article } from '@/types';
import { Search, MapPin, Clock, ArrowRight } from 'lucide-react';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Article[]>([]);

  useEffect(() => {
    if (query) {
      const q = query.toLowerCase();
      const all = storage.getArticles();
      const matches = all.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.category_slug.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.author_name.toLowerCase().includes(q)
      );
      setResults(matches);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="py-6 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
          Search Results for: <span className="text-red-600">"{query}"</span>
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Found {results.length} matching news reports and investigations.
        </p>
      </div>

      {results.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200">
          <p className="text-neutral-500 text-sm mb-4">No stories found matching your search.</p>
          <Link href="/" className="bg-neutral-900 text-white text-xs font-bold px-4 py-2 rounded-lg">
            Back to Homepage
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((art) => (
            <article
              key={art.id}
              className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                <img
                  src={art.featured_image}
                  alt={art.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                    <span className="font-bold text-red-600 uppercase">{art.category_name || art.category_slug}</span>
                    <span>•</span>
                    <span>{art.location}</span>
                  </div>

                  <Link href={`/news/${art.slug}`}>
                    <h3 className="text-base font-bold text-neutral-900 hover:text-red-600 transition-colors line-clamp-2 leading-snug mb-2">
                      {art.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed mb-4">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">By {art.author_name}</span>
                  <Link
                    href={`/news/${art.slug}`}
                    className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                  >
                    Read <ArrowRight className="w-3.5 h-3.5" />
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-neutral-500">Searching MBN archives...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
