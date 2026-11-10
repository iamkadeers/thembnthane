import React from 'react';
import Link from 'next/link';
import { MBNSquadCampaign } from '@/components/MBNSquadCampaign';
import { ShieldCheck, Users, Megaphone, CheckCircle } from 'lucide-react';

export default function SquadHubPage() {
  return (
    <div className="py-6 space-y-12">
      <MBNSquadCampaign />

      {/* Squad Mission & Manifesto */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold mb-4">
            01
          </div>
          <h3 className="text-base font-bold text-neutral-900 mb-2">Fearless Verification</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            MBN Squad members cross-verify local news before it spreads. Fighting fake news at the grassroots level with genuine ground evidence.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-4">
            02
          </div>
          <h3 className="text-base font-bold text-neutral-900 mb-2">Municipal Accountability</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Holding ward officers, local MLAs, and infrastructure contractors directly accountable for potholed roads, garbage dumping, and unlit streets.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4">
            03
          </div>
          <h3 className="text-base font-bold text-neutral-900 mb-2">Youth Civic Leadership</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Mentoring young citizens with journalism skills, RTI drafting capabilities, and digital community leadership opportunities across India.
          </p>
        </div>
      </div>
    </div>
  );
}
