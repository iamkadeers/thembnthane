'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { storage } from '@/lib/storage';
import { PublicIssue } from '@/types';
import { IssueStatusTimeline } from '@/components/IssueStatusTimeline';
import { InteractiveLocationMap } from '@/components/InteractiveLocationMap';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  MapPin,
  Share2,
  Copy,
  ThumbsUp,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

function TrackIssueContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const initialPhone = searchParams.get('phone') || '';

  const [trackingIdInput, setTrackingIdInput] = useState(initialId);
  const [mobileInput, setMobileInput] = useState(initialPhone);
  const [searchedIssue, setSearchedIssue] = useState<PublicIssue | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialId) {
      handleSearch(null, initialId, initialPhone);
    }
  }, [initialId]);

  const handleSearch = (e: React.FormEvent | null, directId?: string, directPhone?: string) => {
    if (e) e.preventDefault();
    const idToUse = directId || trackingIdInput;
    const phoneToUse = directPhone || mobileInput;

    if (!idToUse.trim()) {
      alert('Please enter your MBN Issue Tracking ID (e.g. MBN-ISSUE-2026-00001)');
      return;
    }

    const found = storage.getIssueByTrackingId(idToUse, phoneToUse || undefined);
    setSearchedIssue(found);
    setHasSearched(true);
  };

  const handleShareWhatsApp = () => {
    if (!searchedIssue) return;
    const text = `Tracking MBN Civic Grievance: *${searchedIssue.title}* | Current Status: *${searchedIssue.status}*. Tracking ID: *${searchedIssue.tracking_id}* at https://mbnnews.in/track?id=${searchedIssue.tracking_id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-6">
        <span className="text-xs font-black uppercase tracking-widest text-neutral-500">
          MBN JAN AAWAAZ • GRIEVANCE AUDIT DESK
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight mt-1">
          Track Your Public Issue Status
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1 font-medium">
          Enter your unique tracking ID and verified mobile number to view real-time ground progress, municipal inspection notices, and resolution photos.
        </p>
      </div>

      {/* Tracking Search Input Form */}
      <div className="bg-white border border-neutral-300 rounded-3xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={(e) => handleSearch(e)} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-6">
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
              MBN Tracking ID *
            </label>
            <input
              type="text"
              required
              value={trackingIdInput}
              onChange={(e) => setTrackingIdInput(e.target.value)}
              placeholder="e.g. MBN-ISSUE-2026-00001"
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-black font-mono font-bold"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
              Mobile Number (Optional)
            </label>
            <input
              type="tel"
              value={mobileInput}
              onChange={(e) => setMobileInput(e.target.value)}
              placeholder="10-digit mobile number"
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-black font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full bg-black hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Track</span>
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px] text-neutral-500">
          <span>Quick test tracking IDs:</span>
          {['MBN-ISSUE-2026-00001', 'MBN-ISSUE-2026-00002', 'MBN-ISSUE-2026-00003'].map((id) => (
            <button
              type="button"
              key={id}
              onClick={() => {
                setTrackingIdInput(id);
                handleSearch(null, id, '');
              }}
              className="font-mono underline hover:text-black"
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Searched Issue Result Display */}
      {hasSearched && !searchedIssue && (
        <div className="bg-white border border-neutral-300 rounded-2xl p-8 text-center text-neutral-600">
          <AlertTriangle className="w-8 h-8 mx-auto text-black mb-2" />
          <h3 className="text-base font-bold text-black mb-1">No Issue Found With That Tracking ID</h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto mb-4">
            Please check that the ID is formatted like <code>MBN-ISSUE-2026-XXXXX</code>. If you just submitted, please allow a few seconds for database sync.
          </p>
          <Link
            href="/report"
            className="bg-black text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Report a New Issue
          </Link>
        </div>
      )}

      {searchedIssue && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Main Card Header */}
          <div className="bg-black text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm sm:text-base font-black text-white bg-neutral-900 border border-neutral-700 px-3 py-1 rounded-lg">
                  {searchedIssue.tracking_id}
                </span>
                <span className="bg-white text-black text-[10px] font-black uppercase px-2.5 py-1 rounded">
                  {searchedIssue.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareWhatsApp}
                  className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-white mb-3 leading-snug">
              {searchedIssue.title}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
              {searchedIssue.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-300 border-t border-neutral-800 pt-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white" />
                <span>{searchedIssue.area}, {searchedIssue.city} ({searchedIssue.pincode || 'No PIN'})</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-white" />
                <span>Logged on {new Date(searchedIssue.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-white" />
                <span>{searchedIssue.upvotes} Citizens Supported</span>
              </div>
            </div>
          </div>

          {/* Evidence Photos Grid */}
          {searchedIssue.media_urls && searchedIssue.media_urls.length > 0 && (
            <div className="bg-white border border-neutral-300 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-black mb-4">
                Citizen Evidence Photos & Videos ({searchedIssue.media_urls.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {searchedIssue.media_urls.map((url, i) => (
                  <div key={i} className="aspect-video rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
                    <img src={url} alt={`Evidence ${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GPS Map Location */}
          <div className="bg-white border border-neutral-300 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-black mb-3">
              Verified GPS Coordinates on Map
            </h3>
            <InteractiveLocationMap
              latitude={searchedIssue.latitude || 19.0760}
              longitude={searchedIssue.longitude || 72.8777}
              address={searchedIssue.location_address}
              interactive={false}
              className="h-72"
            />
          </div>

          {/* Before & After Ground Report if available */}
          {searchedIssue.ground_report && (
            <div className="bg-white border border-neutral-300 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black mb-4">
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>MBN Ground Investigation & Before / After Audit</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {searchedIssue.ground_report.before_photo_url && (
                  <div>
                    <span className="text-[11px] font-bold text-neutral-500 uppercase block mb-1">Before Report</span>
                    <div className="aspect-video rounded-xl overflow-hidden border border-neutral-300 bg-neutral-100">
                      <img
                        src={searchedIssue.ground_report.before_photo_url}
                        alt="Before repair"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {searchedIssue.ground_report.after_photo_url && (
                  <div>
                    <span className="text-[11px] font-bold text-black uppercase block mb-1">After Municipal Action</span>
                    <div className="aspect-video rounded-xl overflow-hidden border-2 border-black bg-neutral-100">
                      <img
                        src={searchedIssue.ground_report.after_photo_url}
                        alt="After repair"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {searchedIssue.ground_report.interview_summary && (
                <p className="text-xs text-neutral-700 italic border-l-2 border-black pl-3 py-1">
                  <strong>Reporter Dispatch:</strong> {searchedIssue.ground_report.interview_summary}
                </p>
              )}
            </div>
          )}

          {/* Visual Status Roadmap & Audit Updates */}
          <div className="bg-white border border-neutral-300 rounded-3xl p-6 sm:p-8 shadow-sm">
            <IssueStatusTimeline
              currentStatus={searchedIssue.status}
              updates={searchedIssue.updates || []}
              authorityResponse={searchedIssue.authority_response}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-xs text-neutral-500">Loading tracking system...</div>}>
      <TrackIssueContent />
    </Suspense>
  );
}
