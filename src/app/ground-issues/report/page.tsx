'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import { PublicIssue } from '@/types';
import { ShieldAlert, CheckCircle2, ArrowLeft, Upload, MapPin } from 'lucide-react';

export default function ReportIssuePage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Road & Potholes' as any,
    description: '',
    locationArea: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '',
    reporterName: '',
    reporterPhone: '',
    mediaUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trackingId = `MBN-ISSUE-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newIssue: PublicIssue = {
      id: `issue-${Date.now()}`,
      tracking_id: trackingId,
      issue_code: trackingId,
      title: formData.title,
      category: formData.category,
      description: formData.description,
      area: formData.locationArea,
      location_area: formData.locationArea,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      media_urls: formData.mediaUrl
        ? [formData.mediaUrl]
        : ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'],
      reporter_name: formData.reporterName,
      mobile_number: formData.reporterPhone,
      reporter_phone: formData.reporterPhone,
      status: 'Submitted',
      verification_status: 'pending',
      is_published: false,
      upvotes: 1,
      created_at: new Date().toISOString(),
    };

    storage.saveIssue(newIssue);
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Link
        href="/report"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Open Advanced Jan Aawaaz GPS Reporter</span>
      </Link>

      {submitted ? (
        <div className="bg-white border-2 border-black rounded-3xl p-8 text-center shadow-lg animate-in zoom-in-95">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-black mb-2">Public Issue Registered!</h2>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto mb-6">
            Your report has been dispatched to the MBN Field Desk and assigned to local ward monitors. You can track updates on the Ground Issues tracker.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/voices"
              className="bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl"
            >
              Voices of the People
            </Link>
            <Link
              href="/"
              className="border border-black text-black text-xs font-bold px-5 py-2.5 rounded-xl"
            >
              Return Home
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-neutral-300 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="border-b border-neutral-200 pb-5 mb-6">
            <div className="inline-flex items-center gap-1 bg-black text-white text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-white" />
              DIRECT CITIZEN REPORTING
            </div>
            <h1 className="text-2xl font-black text-black tracking-tight">
              Report a Local Civic Grievance
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Share details of civic issues in your neighbourhood to hold local authorities accountable.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                Headline / Problem Summary *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Hazardous deep pothole on SV Road leading to multiple bike slips"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm"
                >
                  <option value="Road & Potholes">Roads & Potholes</option>
                  <option value="Water Supply">Water Supply & Leakage</option>
                  <option value="Garbage & Cleanliness">Garbage & Cleanliness</option>
                  <option value="Street Lights">Street Lights & Dark Spots</option>
                  <option value="Public Safety">Public Safety</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Mumbai, Pune, Thane"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                Specific Area / Locality / Landmark *
              </label>
              <input
                type="text"
                required
                value={formData.locationArea}
                onChange={(e) => setFormData({ ...formData, locationArea: e.target.value })}
                placeholder="e.g. Dadar East, near railway flyover"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                Full Description & Public Impact *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide accurate facts: how long has this issue remained unresolved?"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2 text-xs sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.reporterName}
                  onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                  placeholder="Your full name"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.reporterPhone}
                  onChange={(e) => setFormData({ ...formData, reporterPhone: e.target.value })}
                  placeholder="Mobile for verification"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                Evidence Photo / Video URL (Optional)
              </label>
              <input
                type="url"
                value={formData.mediaUrl}
                onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2 text-xs sm:text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:bg-neutral-800 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow"
            >
              Submit Report to MBN Desk
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
