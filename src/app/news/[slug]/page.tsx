'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { storage } from '@/lib/storage';
import { Article } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import {
  Clock,
  MapPin,
  Eye,
  Share2,
  Bookmark,
  ChevronRight,
  ArrowRight,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';
import { Icons } from '@/components/SocialIcons';

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [copied, setCopied] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    params.then((p) => {
      setResolvedParams(p);
      const items = storage.getArticles();
      setAllArticles(items);
      const found = items.find((a) => a.slug === p.slug);
      if (found) {
        setArticle(found);
      }
    });
  }, [params]);

  if (resolvedParams && !article) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Article Not Found</h2>
        <p className="text-sm text-neutral-500 mb-6">The story you are looking for may have been moved or archived.</p>
        <Link href="/" className="bg-red-600 text-white font-bold px-5 py-2.5 rounded-lg text-sm">
          Return to MBN Home
        </Link>
      </div>
    );
  }

  if (!article) return null;

  const displayTitle =
    language === 'hi' && article.title_hi
      ? article.title_hi
      : language === 'mr' && article.title_mr
      ? article.title_mr
      : article.title;

  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && a.category_slug === article.category_slug)
    .slice(0, 3);

  const suggestedArticles = allArticles
    .filter((a) => a.id !== article.id && a.category_slug !== article.category_slug)
    .slice(0, 4);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="max-w-5xl mx-auto py-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-4 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-red-600 font-medium">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <Link href={`/category/${article.category_slug}`} className="hover:text-red-600 font-medium capitalize">
          {article.category_name || article.category_slug}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-neutral-400 truncate max-w-xs">{article.title}</span>
      </nav>

      {/* Category badge & location */}
      <div className="flex items-center gap-3 mb-3">
        <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider">
          {article.category_name || article.category_slug}
        </span>
        <span className="flex items-center gap-1 text-xs font-bold text-neutral-700">
          <MapPin className="w-3.5 h-3.5 text-red-600" />
          {article.location}
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-tight sm:leading-snug mb-4">
        {displayTitle}
      </h1>

      {/* Summary Deck */}
      <p className="text-base sm:text-xl text-neutral-600 font-normal leading-relaxed mb-6 border-l-4 border-red-600 pl-4 py-1 italic">
        {article.summary}
      </p>

      {/* Author and Date Bar with Social Shares */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-y border-neutral-200 mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 border border-red-300 text-red-700 flex items-center justify-center font-bold text-sm">
            {article.author_name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-neutral-900">
              By {article.author_name}
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-neutral-400" />
                Published {new Date(article.published_at).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-neutral-400" />
                {article.views_count.toLocaleString('en-IN')} reads
              </span>
            </div>
          </div>
        </div>

        {/* Share buttons */}
        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            title="Share on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            title="Share on X (Twitter)"
          >
            <Icons.Twitter className="w-4 h-4" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="Share on Facebook"
          >
            <Icons.Facebook className="w-4 h-4" />
          </a>
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
            title="Copy Article URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Featured Lead Image */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-8 bg-neutral-100 shadow-md">
        <img
          src={article.featured_image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        {article.image_caption && (
          <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-sm text-neutral-300 text-xs px-4 py-2">
            {article.image_caption}
          </div>
        )}
      </div>

      {/* Layout Grid: Article Body & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Body */}
        <div className="lg:col-span-8">
          <div
            className="prose prose-neutral max-w-none prose-headings:font-black prose-p:text-neutral-700 prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-lg prose-blockquote:border-red-600 prose-blockquote:text-neutral-800 prose-blockquote:font-semibold prose-blockquote:not-italic"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Citizen Verification Note */}
          <div className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between">
            <div>
              <strong className="block font-bold">MBN Fact-Checking Transparency</strong>
              <span>This report has been reviewed by the MBN Central Desk under strict journalistic verifications.</span>
            </div>
            <Link
              href="/editorial-policy"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg whitespace-nowrap ml-3"
            >
              Our Policy
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* MBN Squad Box in Article */}
          <div className="bg-neutral-900 text-white p-5 rounded-2xl border border-neutral-800">
            <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold">
              JOIN THE INVESTIGATION
            </span>
            <h3 className="text-base font-extrabold text-white mt-1 mb-2">
              Have Information On This Story?
            </h3>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Whistleblowers and local residents can securely report confidential updates or register with MBN Squad.
            </p>
            <div className="space-y-2">
              <Link
                href="/ground-issues/report"
                className="w-full inline-block text-center bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-lg transition-colors"
              >
                Send Secure Tip
              </Link>
              <Link
                href="/squad/register"
                className="w-full inline-block text-center border border-neutral-700 hover:border-neutral-500 text-neutral-300 text-xs font-semibold py-2 rounded-lg transition-colors"
              >
                Join MBN Squad
              </Link>
            </div>
          </div>

          {/* Related In This Category */}
          {relatedArticles.length > 0 && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 pb-2 mb-3 border-b-2 border-red-600">
                Related {article.category_name} News
              </h3>
              <div className="space-y-3">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/news/${rel.slug}`}
                    className="group flex gap-3 items-start"
                  >
                    <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-neutral-100">
                      <img
                        src={rel.featured_image}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 group-hover:text-red-600 line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                      <span className="text-[10px] text-neutral-500 mt-1 block">
                        {new Date(rel.published_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggested Articles Carousel / Grid */}
      <div className="mt-16 pt-8 border-t border-neutral-200">
        <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tight mb-6 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          Suggested News & Investigations
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {suggestedArticles.map((sug) => (
            <Link
              key={sug.id}
              href={`/news/${sug.slug}`}
              className="group flex flex-col bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                <img
                  src={sug.featured_image}
                  alt={sug.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-3.5 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block mb-1">
                    {sug.category_name || sug.category_slug}
                  </span>
                  <h4 className="text-xs font-bold text-neutral-900 group-hover:text-red-600 line-clamp-2 leading-snug">
                    {sug.title}
                  </h4>
                </div>
                <span className="text-[10px] text-neutral-400 mt-2 block">
                  {sug.location}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
