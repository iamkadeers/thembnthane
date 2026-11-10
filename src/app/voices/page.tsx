'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { storage } from '@/lib/storage';
import { PublicIssue, IssueCategory, IssueStatus } from '@/types';
import { JAN_AAWAAZ_CATEGORIES } from '@/lib/janAawaazData';
import { InteractiveLocationMap } from '@/components/InteractiveLocationMap';
import {
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  ThumbsUp,
  Filter,
  Search,
  ArrowRight,
  Eye,
  Map as MapIcon,
  Grid
} from 'lucide-react';

export default function VoicesOfThePeoplePage() {
  const [issues, setIssues] = useState<PublicIssue[]>([]);
  const [cityFilter, setCityFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');
  const [selectedMapIssue, setSelectedMapIssue] = useState<PublicIssue | null>(null);

  useEffect(() => {
    // Only published and verified issues for the general public
    const published = storage.getPublishedIssues();
    setIssues(published);
    if (published.length > 0) {
      setSelectedMapIssue(published[0]);
    }
  }, []);

  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    storage.upvoteIssue(id);
    setIssues(storage.getPublishedIssues());
  };

  // Get distinct cities
  const cities = Array.from(new Set(issues.map((i) => i.city)));

  // Filter logic
  const filteredIssues = issues.filter((iss) => {
    const matchCity = cityFilter === 'all' || iss.city.toLowerCase() === cityFilter.toLowerCase();
    const matchArea = !areaFilter.trim() || (iss.area || iss.location_area || '').toLowerCase().includes(areaFilter.toLowerCase());
    const matchCategory = categoryFilter === 'all' || iss.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || iss.status === statusFilter;
    const matchSearch =
      !searchQuery.trim() ||
      iss.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iss.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (iss.tracking_id || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchCity && matchArea && matchCategory && matchStatus && matchSearch;
  });

  return (
    <div className="py-4 space-y-8">
      {/* Hero Section */}
      <div className="bg-black text-white rounded-3xl p-6 sm:p-10 border border-neutral-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-700 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <span>MBN JAN AAWAAZ</span>
            <span>•</span>
            <span>VERIFIED CITIZEN ROSTER</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            VOICES OF THE PEOPLE
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-2xl font-normal leading-relaxed">
            Real civic grievances filed by citizens across Maharashtra — verified by MBN ground scouts with exact GPS coordinates and tracked until municipal resolution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/track"
            className="border-2 border-white hover:bg-white hover:text-black text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all"
          >
            Track Status By ID
          </Link>
          <Link
            href="/report"
            className="bg-white hover:bg-neutral-200 text-black text-xs sm:text-sm font-black px-5 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>REPORT A PUBLIC ISSUE</span>
          </Link>
        </div>
      </div>

      {/* Filter and View Toggles Bar */}
      <div className="bg-white border border-neutral-300 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keyword or tracking ID..."
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-black"
            />
          </div>

          {/* City Filter */}
          <div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-black font-semibold"
            >
              <option value="all">All Cities ({cities.length})</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-black font-semibold"
            >
              <option value="all">All Categories</option>
              {JAN_AAWAAZ_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-black font-semibold"
            >
              <option value="all">All Resolution Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Verified">Verified</option>
              <option value="Forwarded to Concerned Authority">Forwarded to Authority</option>
              <option value="Action Taken">Action Taken</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* View Mode Toggle: Cards vs Map */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-300">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${
                viewMode === 'cards' ? 'bg-black text-white shadow' : 'text-neutral-700 hover:text-black'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Cards ({filteredIssues.length})</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all ${
                viewMode === 'map' ? 'bg-black text-white shadow' : 'text-neutral-700 hover:text-black'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: Grid of Issue Cards */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="group flex flex-col bg-white border border-neutral-300 hover:border-black rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              {/* Media Image */}
              <div className="relative aspect-[16/10] w-full bg-neutral-100 overflow-hidden">
                <img
                  src={
                    issue.media_urls && issue.media_urls.length > 0
                      ? issue.media_urls[0]
                      : 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={issue.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-black text-white text-[10px] font-black uppercase px-2.5 py-1 rounded">
                    {issue.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="bg-neutral-900/90 backdrop-blur-sm text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-neutral-700">
                    {issue.tracking_id}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                    <span className="flex items-center gap-1 font-semibold text-black">
                      <MapPin className="w-3.5 h-3.5 text-black" />
                      {issue.area}, {issue.city}
                    </span>
                    <span className="text-[11px]">
                      {new Date(issue.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <Link href={`/track?id=${issue.tracking_id}`}>
                    <h3 className="text-base font-bold text-black group-hover:underline transition-colors line-clamp-2 leading-snug mb-2">
                      {issue.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed mb-4">
                    {issue.description}
                  </p>

                  {issue.authority_response && (
                    <div className="bg-neutral-50 border-l-2 border-black p-2.5 rounded-r text-[11px] text-neutral-800 mb-4">
                      <strong>Authority Dispatch:</strong> {issue.authority_response}
                    </div>
                  )}
                </div>

                {/* Bottom Row */}
                <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                  <button
                    onClick={(e) => handleUpvote(issue.id, e)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-black hover:opacity-75 transition-opacity"
                    title="Endorse this public issue"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-black" />
                    <span>{issue.upvotes} Citizens</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      issue.status === 'Resolved'
                        ? 'bg-black text-white'
                        : issue.status === 'Action Taken'
                        ? 'bg-neutral-800 text-white'
                        : 'border border-neutral-400 text-black'
                    }`}>
                      {issue.status}
                    </span>

                    <Link
                      href={`/track?id=${issue.tracking_id}`}
                      className="bg-neutral-100 hover:bg-black hover:text-white text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>View Full Report</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: Interactive Map View */}
      {viewMode === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-neutral-300 rounded-3xl p-6 shadow-sm">
          {/* Map Section */}
          <div className="lg:col-span-8">
            <h3 className="text-xs font-black uppercase tracking-wider text-black mb-3">
              Geolocated Civic Incidents Across Maharashtra
            </h3>
            <InteractiveLocationMap
              latitude={selectedMapIssue?.latitude || 19.0760}
              longitude={selectedMapIssue?.longitude || 72.8777}
              address={selectedMapIssue?.location_address}
              interactive={false}
              className="h-[480px]"
            />
          </div>

          {/* Interactive Incident Selector */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-black mb-3 border-b pb-2">
                Select Hotspot ({filteredIssues.length} Points)
              </h3>
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {filteredIssues.map((iss) => (
                  <div
                    key={iss.id}
                    onClick={() => setSelectedMapIssue(iss)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedMapIssue?.id === iss.id
                        ? 'bg-black text-white border-black shadow'
                        : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-black'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                      <span className="font-mono">{iss.tracking_id}</span>
                      <span className="uppercase">{iss.status}</span>
                    </div>
                    <h4 className="text-xs font-bold line-clamp-2 leading-snug">{iss.title}</h4>
                    <span className="text-[10px] opacity-75 mt-1 block">
                      {iss.area}, {iss.city}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedMapIssue && (
              <Link
                href={`/track?id=${selectedMapIssue.tracking_id}`}
                className="w-full bg-black hover:bg-neutral-800 text-white font-bold text-xs py-3 rounded-xl text-center block transition-colors shadow"
              >
                Inspect Selected Incident Timeline →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
