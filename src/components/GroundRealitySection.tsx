'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { storage } from '@/lib/storage';
import { PublicIssue } from '@/types';
import {
  AlertTriangle,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  PlusCircle,
  ThumbsUp
} from 'lucide-react';

export const GroundRealitySection: React.FC = () => {
  const { t } = useLanguage();
  const [issues, setIssues] = useState<PublicIssue[]>([]);

  useEffect(() => {
    setIssues(storage.getIssues());
  }, []);

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('resolved')) {
      return (
        <span className="inline-flex items-center gap-1 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded">
          <CheckCircle2 className="w-3 h-3 text-white" /> RESOLVED
        </span>
      );
    }
    if (s.includes('action') || s.includes('investigating')) {
      return (
        <span className="inline-flex items-center gap-1 border border-black text-black text-[10px] font-bold px-2 py-0.5 rounded">
          <AlertTriangle className="w-3 h-3 text-black" /> ACTION TAKEN
        </span>
      );
    }
    if (s.includes('verified')) {
      return (
        <span className="inline-flex items-center gap-1 bg-neutral-200 text-black text-[10px] font-bold px-2 py-0.5 rounded">
          <Clock className="w-3 h-3 text-black" /> VERIFIED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 text-[10px] font-bold px-2 py-0.5 rounded">
        <Clock className="w-3 h-3 text-neutral-600" /> UNDER REVIEW
      </span>
    );
  };

  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    storage.upvoteIssue(id);
    setIssues(storage.getIssues());
  };

  return (
    <section className="mb-14 bg-neutral-50 border border-neutral-300 rounded-3xl p-6 sm:p-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-6 border-b border-neutral-300 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-black text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              MBN JAN AAWAAZ
            </span>
            <span className="text-xs font-bold text-black tracking-wider uppercase">
              • LOCAL ACCOUNTABILITY DESK
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-black tracking-tight">
            Ground Reality: People's Voice & Public Issues
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl mt-1">
            Real problems from your street — pothole accidents, contaminated drinking water, illegal garbage dumps, and dark roads. We hold authorities accountable.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/voices"
            className="text-xs font-bold text-black hover:underline whitespace-nowrap"
          >
            View All Reports
          </Link>
          <Link
            href="/report"
            className="inline-flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow transition-all active:scale-95 whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>REPORT A PUBLIC ISSUE</span>
          </Link>
        </div>
      </div>

      {/* Grid of Public Issues */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {issues.slice(0, 4).map((issue) => (
          <div
            key={issue.id}
            className="flex flex-col justify-between bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all hover:border-black"
          >
            <div>
              {issue.media_urls && issue.media_urls.length > 0 && (
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-3 bg-neutral-100">
                  <img
                    src={issue.media_urls[0]}
                    alt={issue.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-black px-2 py-0.5 rounded">
                    {issue.category}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mb-2">
                {getStatusBadge(issue.status)}
                <span className="text-[10px] font-mono text-neutral-500 font-bold">
                  {issue.tracking_id || issue.issue_code}
                </span>
              </div>

              <h3 className="text-sm font-bold text-black line-clamp-2 leading-snug mb-2">
                {issue.title}
              </h3>

              <div className="flex items-center gap-1 text-[11px] text-neutral-600 font-semibold mb-3">
                <MapPin className="w-3.5 h-3.5 text-black shrink-0" />
                <span className="truncate">
                  {issue.area || issue.location_area}, {issue.city}
                </span>
              </div>

              {(issue.authority_response || issue.mbn_action_update) && (
                <div className="bg-neutral-100 border-l-2 border-black p-2 rounded-r text-[11px] text-black mb-3 leading-snug">
                  <strong>Action:</strong> {issue.authority_response || issue.mbn_action_update}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
              <button
                onClick={(e) => handleUpvote(issue.id, e)}
                className="flex items-center gap-1.5 text-black font-semibold transition-colors hover:opacity-80"
                title="Upvote this civic grievance"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-black" />
                <span>{issue.upvotes} Citizens</span>
              </button>

              <Link
                href={`/track?id=${issue.tracking_id || issue.issue_code}`}
                className="text-[11px] font-bold text-black hover:underline flex items-center gap-0.5"
              >
                Track <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
