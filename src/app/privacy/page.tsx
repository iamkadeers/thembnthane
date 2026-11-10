import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div className="border-b pb-4">
        <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
          LEGAL & CITIZEN SAFETY
        </span>
        <h1 className="text-3xl font-black text-neutral-900 tracking-tight mt-1">
          Privacy Policy & Whistleblower Data Protection
        </h1>
        <p className="text-xs text-neutral-500 mt-1">Compliant with the Digital Personal Data Protection Act</p>
      </div>

      <div className="prose prose-neutral text-sm leading-relaxed text-neutral-700 space-y-4">
        <h3 className="font-bold text-neutral-900 text-base">1. Whistleblower & Citizen Reporter Confidentiality</h3>
        <p>
          MBN Squad prioritizes the safety of citizen contributors. Personal phone numbers, home addresses, and private identification documents submitted during Squad onboarding or grievance submissions are stored with strict encryption and never sold or made public without explicit written authorization.
        </p>

        <h3 className="font-bold text-neutral-900 text-base">2. Purpose of Information Collection</h3>
        <p>
          We only collect mobile numbers and locality details to verify the authenticity of reported local issues and issue official member credentials.
        </p>

        <h3 className="font-bold text-neutral-900 text-base">3. Data Deletion Rights</h3>
        <p>
          Members can request complete removal of their profile or reports at any time by contacting <code>privacy@mbnnews.in</code>.
        </p>
      </div>
    </div>
  );
}
