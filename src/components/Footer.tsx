'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/mockData';
import {
  ShieldAlert,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Heart
} from 'lucide-react';
import { Icons } from './SocialIcons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-neutral-300 border-t-2 border-neutral-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="bg-white text-black font-black text-3xl tracking-tighter px-3.5 py-1 rounded-lg shadow">
                MBN
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-5 max-w-sm">
              MBN is a bold, independent, people-focused digital news platform committed to fearless reporting, municipal accountability, and giving ordinary citizens a national voice.
            </p>

            <div className="text-xs space-y-2 text-neutral-400 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                <span>MBN Media Central: Nariman Point, Mumbai & Connaught Place, New Delhi</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                <span>editorial@mbnnews.in • bureau@mbnnews.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                <span>Helpline: +91 (022) 2890-MBN1 / 2890-MBN2</span>
              </div>
            </div>

            {/* Social handles */}
            <div className="flex items-center space-x-3">
              {[
                { icon: Icons.Twitter, href: 'https://twitter.com', label: 'Twitter' },
                { icon: Icons.Youtube, href: 'https://youtube.com', label: 'YouTube' },
                { icon: Icons.Facebook, href: 'https://facebook.com', label: 'Facebook' },
                { icon: Icons.Instagram, href: 'https://instagram.com', label: 'Instagram' },
                { icon: Icons.Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 hover:border-white hover:bg-white hover:text-black flex items-center justify-center transition-all text-neutral-400"
                  aria-label={item.label}
                >
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2">
              News Desks
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 7).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-white transition-colors block"
                  >
                    {cat.name} News
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Citizen & Squad */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2">
              MBN Jan Aawaaz
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/report" className="hover:text-white transition-colors font-bold text-white">
                  Report a Public Issue
                </Link>
              </li>
              <li>
                <Link href="/voices" className="hover:text-white transition-colors font-semibold">
                  Voices of the People (Public Roster)
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors font-semibold">
                  Track My Issue (By ID)
                </Link>
              </li>
              <li>
                <Link href="/squad" className="hover:text-white transition-colors">
                  Join MBN Squad Movement
                </Link>
              </li>
              <li>
                <Link href="/squad/dashboard" className="hover:text-white transition-colors">
                  Member Portal (OTP Login)
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Policies */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2">
              Organization
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About MBN Media
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="hover:text-white transition-colors">
                  Editorial & Fact-Check Policy
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="hover:text-white transition-colors">
                  Advertise With Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy & Data Rights
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors text-neutral-500 font-mono">
                  Admin System Access
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-3">
          <div className="text-center sm:text-left">
            © 2026 MBN. All Rights Reserved. Demo Preview Platform.
          </div>
          <div className="flex items-center gap-1 text-neutral-400">
            <span>Powered by fearless journalism for a progressive India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
