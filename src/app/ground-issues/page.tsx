'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { storage } from '@/lib/storage';
import { PublicIssue } from '@/types';
import {
  AlertTriangle,
  MapPin,
  CheckCircle2,
  Clock,
  PlusCircle,
  ThumbsUp,
  Search,
  Filter
} from 'lucide-react';

export default function GroundIssuesPage() {
  const [issues, setIssues] = useState<PublicIssue[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIssues(storage.getIssues());
  }, []);

  const handleUpvote = (id: string) => {
    storage.upvoteIssue(id);
    setIssues(storage.getIssues());
  };

  const filteredIssues = issues.filter((iss) => {
    const area = iss.area || iss.location_area || '';
    const matchCategory = categoryFilter === 'all' || iss.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchSearch =
      iss.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iss.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="py-4 space-y-8">
      {/* Page Header */}
      <div className="border-b-4 border-black pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-widest mb-1">
              <span>PEOPLE FIRST</span>
              <span>•</span>
              <span>MBN GROUND ACCOUNTABILITY DESK</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight">
              Ground Reality: Public Issues Tracker
            </h1>
            <p className="text-sm text-neutral-600 mt-2 max-w-2xl font-medium">
              Every pothole, sewage overflow, and dark highway submitted by citizens across Maharashtra is logged here and tracked until municipal resolution.
            </p>
          </div>

          <Link
            href="/report"
            className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow shrink-0 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>REPORT A PUBLIC ISSUE</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-300">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by area, road, or city..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-black"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          {['all', 'Public Safety', 'Water', 'Road', 'Garbage'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
              }`}
            >
              {cat === 'all' ? 'All Issues' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Issues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIssues.map((issue) => (
          <div
            key={issue.id}
            className="flex flex-col justify-between bg-white border border-neutral-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            {issue.media_urls && issue.media_urls.length > 0 && (
              <div className="relative aspect-[16/10] w-full bg-neutral-100">
                <img
                  src={issue.media_urls[0]}
                  alt={issue.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  {issue.category}
                </span>
                <span className="absolute top-2 right-2 bg-black text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                  {issue.tracking_id || issue.issue_code}
                </span>
              </div>
            )}

            <div className="p-5 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center gap-1 text-xs text-neutral-600 font-semibold mb-2">
                  <MapPin className="w-3.5 h-3.5 text-black shrink-0" />
                  <span className="truncate">{issue.area || issue.location_area}, {issue.city}</span>
                </div>

                <h3 className="text-base font-bold text-black mb-2 leading-snug">
                  {issue.title}
                </h3>

                <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed mb-4">
                  {issue.description}
                </p>

                {(issue.authority_response || issue.mbn_action_update) && (
                  <div className="bg-neutral-100 p-2.5 rounded-lg border-l-2 border-black text-xs text-black mb-4">
                    <strong>Action Update:</strong> {issue.authority_response || issue.mbn_action_update}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                <button
                  onClick={() => handleUpvote(issue.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-black hover:opacity-75 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-black" />
                  <span>{issue.upvotes} Citizens</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-neutral-400 text-black">
                    {issue.status}
                  </span>
                  <Link
                    href={`/track?id=${issue.tracking_id || issue.issue_code}`}
                    className="text-xs font-bold text-black underline"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
