'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  ShieldCheck,
  Megaphone,
  Camera,
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export const MBNSquadCampaign: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="mb-14 relative overflow-hidden rounded-3xl bg-black text-white border-2 border-neutral-800 shadow-2xl">
      <div className="relative z-10 p-6 sm:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Pitch */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-white px-3.5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-4">
              <ShieldCheck className="w-4 h-4 text-white" />
              PEOPLE'S MOVEMENT • MBN SQUAD
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
              JOIN THE MBN SQUAD
            </h2>

            <div className="text-lg sm:text-xl font-extrabold text-neutral-300 italic mb-4">
              "{t('squadMission')}"
            </div>

            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl font-normal">
              {t('squadDesc')} MBN Squad is not just a reader club — it is India's most energetic network of citizen whistleblowers, student researchers, photographers, and youth leaders driving real civic impact.
            </p>

            {/* Core Member Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <div className="flex items-start gap-2.5 bg-neutral-900/80 border border-neutral-800 p-3 rounded-xl">
                <CheckCircle className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-bold">Official Citizen ID Card</strong>
                  <span className="text-neutral-400 text-[11px]">Unique verifiable MBN Member ID & Digital Certificate</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-neutral-900/80 border border-neutral-800 p-3 rounded-xl">
                <Megaphone className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-bold">Direct Editorial Priority</strong>
                  <span className="text-neutral-400 text-[11px]">Your reported ground issues covered directly on MBN prime</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-neutral-900/80 border border-neutral-800 p-3 rounded-xl">
                <Camera className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-bold">Ground Journalism Workshops</strong>
                  <span className="text-neutral-400 text-[11px]">Free digital journalism, RTI training, and fact-check webinars</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-neutral-900/80 border border-neutral-800 p-3 rounded-xl">
                <Users className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-bold">Local Community Action</strong>
                  <span className="text-neutral-400 text-[11px]">Lead ward cleanup drives, safety audits, and public hearings</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/squad/register"
                className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-black text-sm px-7 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-wider"
              >
                <span>JOIN MBN SQUAD NOW</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/squad/dashboard"
                className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 text-sm font-bold px-5 py-3.5 rounded-xl transition-all"
              >
                <span>Member Portal Login</span>
              </Link>
            </div>
          </div>

          {/* Right Card: Digital ID Sample Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-white text-black font-black px-2 py-0.5 rounded text-sm">
                    MBN
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    SQUAD CITIZEN PASS
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-neutral-900 text-white border border-neutral-700 px-2 py-0.5 rounded font-bold">
                  VERIFIED ACTIVE
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-800 border-2 border-white shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                    alt="Squad Member"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Pooja K. Deshmukh</h4>
                  <p className="text-xs text-neutral-400">Ground Reporter • Pune Ward 14</p>
                  <p className="text-[11px] font-mono text-white mt-0.5">ID: MBN-2026-00042</p>
                </div>
              </div>

              <div className="bg-neutral-900 rounded-xl p-3 border border-neutral-800 text-[11px] space-y-1.5 mb-4 text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Citizen Track:</span>
                  <span className="font-semibold text-white">Public Issues & Water Audits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Status:</span>
                  <span className="text-white font-bold">Approved Field Contributor</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Issued By:</span>
                  <span className="font-semibold text-white">MBN Citizens Bureau</span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-mono">
                  MBN CITIZEN ACTION INITIATIVE • 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
