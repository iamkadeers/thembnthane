'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { CATEGORIES } from '@/lib/mockData';
import {
  Search,
  Menu,
  X,
  ShieldCheck,
  UserCheck,
  Lock,
  Globe,
  Radio
} from 'lucide-react';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/10 shadow-sm transition-all">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Brand Logo: Clean Black and White */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-black text-white font-black text-3xl sm:text-4xl tracking-tighter px-3.5 py-1 rounded-lg group-hover:bg-neutral-800 transition-colors flex items-center">
            <span>MBN</span>
            <span className="w-2.5 h-2.5 rounded-full bg-white ml-2 animate-ping hidden sm:inline-block"></span>
          </div>
        </Link>

        {/* Right CTA / Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Language Selector */}
          <div className="relative flex items-center bg-neutral-100 rounded-full p-0.5 border border-neutral-300 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 ml-2 text-neutral-600 hidden sm:inline" />
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                language === 'en' ? 'bg-black text-white shadow-sm' : 'text-neutral-700 hover:text-black'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                language === 'hi' ? 'bg-black text-white shadow-sm' : 'text-neutral-700 hover:text-black'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage('mr')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                language === 'mr' ? 'bg-black text-white shadow-sm' : 'text-neutral-700 hover:text-black'
              }`}
            >
              मराठी
            </button>
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-black hover:bg-neutral-100 rounded-full transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Dedicated "REPORT A PUBLIC ISSUE" Button in Header */}
          <Link
            href="/report"
            className="flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-black px-3.5 py-2 rounded-full shadow transition-all border border-neutral-700"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
            <span className="tracking-wide uppercase">REPORT A PUBLIC ISSUE</span>
          </Link>

          {/* Voices of the People Link */}
          <Link
            href="/voices"
            className="hidden sm:flex items-center gap-1.5 text-black hover:underline text-xs font-bold px-2 py-1"
          >
            <span>Voices</span>
          </Link>

          {/* Track Issue Link */}
          <Link
            href="/track"
            className="hidden sm:flex items-center gap-1.5 text-neutral-600 hover:text-black text-xs font-semibold px-2 py-1"
          >
            <span>Track Issue</span>
          </Link>

          {/* Member Portal Link */}
          <Link
            href="/squad/dashboard"
            className="hidden md:flex items-center gap-1.5 border border-black hover:bg-black hover:text-white text-black text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{t('memberLogin')}</span>
          </Link>

          {/* Admin link */}
          <Link
            href="/admin"
            className="hidden xl:flex items-center gap-1 text-[11px] text-neutral-500 hover:text-black font-medium px-2 py-1 rounded"
            title="Secure Admin Access"
          >
            <Lock className="w-3 h-3" />
            <span>Admin</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-black hover:bg-neutral-100 rounded-lg focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Input Bar */}
      {searchOpen && (
        <div className="bg-black border-t border-neutral-800 px-4 py-3 text-white">
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto flex items-center gap-2">
            <Search className="w-5 h-5 text-neutral-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-transparent border-none text-white text-sm focus:outline-none placeholder-neutral-500"
              autoFocus
            />
            <button
              type="submit"
              className="bg-white hover:bg-neutral-200 text-black text-xs font-bold px-4 py-1.5 rounded-md transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-neutral-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Desktop Main Navigation Bar */}
      <nav className="hidden lg:block border-t border-neutral-200 bg-neutral-950 text-white font-semibold text-xs tracking-wide uppercase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-1 overflow-x-auto py-2.5 scrollbar-none">
            <Link
              href="/"
              className="px-3 py-1.5 text-white bg-neutral-800 rounded font-bold"
            >
              {t('home')}
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="px-3 py-1.5 hover:text-white hover:bg-neutral-800 rounded transition-colors whitespace-nowrap text-neutral-300"
              >
                {language === 'hi' && cat.name_hi
                  ? cat.name_hi
                  : language === 'mr' && cat.name_mr
                  ? cat.name_mr
                  : cat.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-neutral-800">
            <Link
              href="/voices"
              className="flex items-center gap-1.5 text-white hover:text-neutral-300 py-1.5 text-xs whitespace-nowrap font-bold"
            >
              <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>Voices of the People</span>
            </Link>
            <Link
              href="/report"
              className="bg-white hover:bg-neutral-200 text-black px-3 py-1 rounded text-[11px] font-black tracking-wider uppercase transition-colors"
            >
              REPORT AN ISSUE
            </Link>
            <Link
              href="/squad"
              className="text-neutral-400 hover:text-white px-2 py-1 text-[11px] font-bold uppercase transition-colors"
            >
              SQUAD
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white shadow-xl animate-in fade-in duration-150">
          <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-neutral-200">
              <Link
                href="/squad/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 bg-black text-white font-bold py-2.5 px-3 rounded-lg text-xs"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                Join MBN Squad
              </Link>
              <Link
                href="/squad/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 border border-black text-black font-semibold py-2.5 px-3 rounded-lg text-xs"
              >
                <UserCheck className="w-4 h-4" />
                Member Login
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm font-semibold text-neutral-800">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded bg-neutral-100 text-black font-bold"
              >
                {t('home')}
              </Link>
              <Link
                href="/ground-issues"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded hover:bg-neutral-100 text-black font-bold flex items-center gap-1"
              >
                <span className="w-2 h-2 rounded-full bg-black animate-ping"></span>
                Ground Issues
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded hover:bg-neutral-100 text-neutral-800"
                >
                  {language === 'hi' && cat.name_hi
                    ? cat.name_hi
                    : language === 'mr' && cat.name_mr
                    ? cat.name_mr
                    : cat.name}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1 font-semibold text-black hover:underline"
              >
                <Lock className="w-3.5 h-3.5" />
                Admin Dashboard
              </Link>
              <span className="text-[11px] text-neutral-400 font-mono">MBN National Desk</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
