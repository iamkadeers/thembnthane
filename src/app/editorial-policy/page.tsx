import React from 'react';
import Link from 'next/link';

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div className="border-b pb-4">
        <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
          STANDARDS & ETHICS
        </span>
        <h1 className="text-3xl font-black text-neutral-900 tracking-tight mt-1">
          Editorial & Fact-Checking Policy
        </h1>
        <p className="text-xs text-neutral-500 mt-1">Updated for MBN National Desk operations</p>
      </div>

      <div className="prose prose-neutral text-sm leading-relaxed text-neutral-700 space-y-4">
        <h3 className="font-bold text-neutral-900 text-base">1. Commitment to Truth & Independence</h3>
        <p>
          MBN (Maharashtra Bharat Network) adheres to the highest standards of journalistic integrity. We operate completely independent of political parties, corporate lobbies, and sectarian groups. Our mission is to report truthful, verified facts that impact ordinary citizens.
        </p>

        <h3 className="font-bold text-neutral-900 text-base">2. Multi-Tier Ground Verification</h3>
        <p>
          Every report published under MBN or filed by MBN Squad members undergoes strict verification. Ground reports must feature geolocation metadata, timestamps, and quotes from affected citizens alongside responses sought from corresponding municipal officials.
        </p>

        <h3 className="font-bold text-neutral-900 text-base">3. Correction Policy</h3>
        <p>
          When errors or inaccuracies occur, MBN issues prompt and prominent corrections on the respective article and our digital channels. Readers and members can submit corrections directly to <code>editorial@mbnnews.in</code>.
        </p>
      </div>
    </div>
  );
}
