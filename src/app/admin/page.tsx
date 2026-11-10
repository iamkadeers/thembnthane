'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { storage } from '@/lib/storage';
import { Article, PublicIssue, SquadMember, IssueStatus, NewsSubmission } from '@/types';
import { CATEGORIES } from '@/lib/mockData';
import { JAN_AAWAAZ_CATEGORIES } from '@/lib/janAawaazData';
import { InteractiveLocationMap } from '@/components/InteractiveLocationMap';
import { AIComparisonModal } from '@/components/AIComparisonModal';
import {
  Lock,
  Newspaper,
  Users,
  AlertTriangle,
  BarChart3,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Download,
  Filter,
  LogOut,
  Sparkles,
  MapPin,
  Building2,
  Camera,
  FileCheck,
  Languages,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function AdminPage() {
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'news_approvals' | 'jan_aawaaz' | 'news' | 'squad' | 'analytics'>('news_approvals');

  // Data states
  const [articles, setArticles] = useState<Article[]>([]);
  const [squadMembers, setSquadMembers] = useState<SquadMember[]>([]);
  const [issues, setIssues] = useState<PublicIssue[]>([]);
  const [submissions, setSubmissions] = useState<NewsSubmission[]>([]);

  // News Approval Center State
  const [approvalSubTab, setApprovalSubTab] = useState<'Pending Approval' | 'Approved' | 'Rejected' | 'Published' | 'Draft'>('Pending Approval');
  const [selectedSubmissionForAI, setSelectedSubmissionForAI] = useState<NewsSubmission | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [approvalSearch, setApprovalSearch] = useState('');

  // News Modal / Form
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [newsForm, setNewsForm] = useState({
    title: '',
    summary: '',
    content: '',
    featured_image: '',
    category_slug: 'india',
    author_name: 'MBN National Desk',
    location: 'Mumbai',
    is_breaking: false,
    is_featured: false,
  });

  // Squad Filters
  const [squadSearch, setSquadSearch] = useState('');
  const [squadStatusFilter, setSquadStatusFilter] = useState('all');

  // Jan Aawaaz Issue Inspection / Edit State
  const [selectedIssue, setSelectedIssue] = useState<PublicIssue | null>(null);
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);
  const [statusUpdateNote, setStatusUpdateNote] = useState('');
  const [targetStatus, setTargetStatus] = useState<IssueStatus>('Verified');
  const [authorityResponseInput, setAuthorityResponseInput] = useState('');
  const [issueSearch, setIssueSearch] = useState('');
  const [issueCityFilter, setIssueCityFilter] = useState('all');
  const [issueCategoryFilter, setIssueCategoryFilter] = useState('all');

  // Ground report form inside inspect modal
  const [groundReportForm, setGroundReportForm] = useState({
    reporter_name: '',
    before_photo_url: '',
    after_photo_url: '',
    interview_summary: '',
    notes: ''
  });

  useEffect(() => {
    if (sessionStorage.getItem('mbn_admin_authenticated') === 'true') {
      setIsAdminAuth(true);
      loadAdminData();
    }
  }, []);

  const loadAdminData = () => {
    setArticles(storage.getArticles());
    setSquadMembers(storage.getSquadMembers());
    setIssues(storage.getIssues());
    setSubmissions(storage.getSubmissions());
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = adminUsername.trim().toLowerCase();
    const cleanPass = adminPassword.trim();

    // Check credentials: Admin ID: Sameer, Password: Kadeer@786 (with backward-compatible mbn2026 fallback)
    if (
      (cleanUser === 'sameer' && cleanPass === 'Kadeer@786') ||
      (cleanUser === 'admin' && (cleanPass === 'Kadeer@786' || cleanPass === 'mbn2026')) ||
      (cleanPass === 'Kadeer@786')
    ) {
      setIsAdminAuth(true);
      sessionStorage.setItem('mbn_admin_authenticated', 'true');
      sessionStorage.setItem('mbn_admin_user', 'Sameer');
      loadAdminData();
    } else {
      alert('Invalid admin credentials. Please enter Admin ID: Sameer & Password: Kadeer@786');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuth(false);
    sessionStorage.removeItem('mbn_admin_authenticated');
  };

  // Article Actions
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newsForm.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    const cat = CATEGORIES.find((c) => c.slug === newsForm.category_slug);

    const articleToSave: Article = {
      id: editingArticle ? editingArticle.id : `art-${Date.now()}`,
      slug: editingArticle ? editingArticle.slug : slug,
      title: newsForm.title,
      summary: newsForm.summary,
      content: newsForm.content || `<p>${newsForm.summary}</p>`,
      featured_image: newsForm.featured_image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
      category_slug: newsForm.category_slug,
      category_name: cat ? cat.name : 'General',
      author_name: newsForm.author_name,
      location: newsForm.location,
      is_breaking: newsForm.is_breaking,
      is_featured: newsForm.is_featured,
      views_count: editingArticle ? editingArticle.views_count : 120,
      published_at: editingArticle ? editingArticle.published_at : new Date().toISOString(),
      created_at: editingArticle ? editingArticle.created_at : new Date().toISOString(),
    };

    storage.saveArticle(articleToSave);
    loadAdminData();
    setIsArticleModalOpen(false);
    setEditingArticle(null);
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      storage.deleteArticle(id);
      loadAdminData();
    }
  };

  const openNewArticleModal = () => {
    setEditingArticle(null);
    setNewsForm({
      title: '',
      summary: '',
      content: '',
      featured_image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
      category_slug: 'india',
      author_name: 'MBN National Desk',
      location: 'Mumbai',
      is_breaking: false,
      is_featured: false,
    });
    setIsArticleModalOpen(true);
  };

  // Squad Member Status Updates
  const handleUpdateSquadStatus = (memberId: string, status: SquadMember['status']) => {
    storage.updateMemberStatus(memberId, status);
    loadAdminData();
  };

  // Export Squad to CSV
  const exportSquadCSV = () => {
    const headers = ['MemberID,FullName,Mobile,City,Area,Profession,Status,CreatedAt'];
    const rows = squadMembers.map(m =>
      `"${m.member_id}","${m.full_name}","${m.mobile_number}","${m.city}","${m.area_locality}","${m.profession}","${m.status}","${m.created_at}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mbn_squad_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Jan Aawaaz Issues to CSV
  const exportIssuesCSV = () => {
    const headers = ['TrackingID,Category,Title,Area,City,Pincode,Status,VerificationStatus,Upvotes,CreatedAt'];
    const rows = issues.map(i =>
      `"${i.tracking_id}","${i.category}","${i.title.replace(/"/g, '""')}","${i.area}","${i.city}","${i.pincode || ''}","${i.status}","${i.verification_status}","${i.upvotes}","${i.created_at}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mbn_jan_aawaaz_issues_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open Inspect Modal for Issue
  const openInspectIssue = (issue: PublicIssue) => {
    setSelectedIssue(issue);
    setTargetStatus((issue.status as IssueStatus) || 'Verified');
    setStatusUpdateNote('');
    setAuthorityResponseInput(issue.authority_response || '');
    setGroundReportForm({
      reporter_name: issue.ground_report?.reporter_name || 'MBN Ground Scout',
      before_photo_url: issue.ground_report?.before_photo_url || (issue.media_urls?.[0] || ''),
      after_photo_url: issue.ground_report?.after_photo_url || '',
      interview_summary: issue.ground_report?.interview_summary || '',
      notes: issue.ground_report?.notes || ''
    });
    setIsInspectModalOpen(true);
  };

  const handleSaveIssueStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;

    const note = statusUpdateNote.trim() || `Status updated to ${targetStatus} by MBN Admin Desk.`;
    const updated = storage.updateIssueStatus(
      selectedIssue.id,
      targetStatus,
      note,
      'MBN Admin Desk',
      authorityResponseInput.trim() || undefined
    );

    // Save ground report if filled
    if (updated && (groundReportForm.after_photo_url || groundReportForm.interview_summary)) {
      updated.ground_report = {
        reporter_name: groundReportForm.reporter_name,
        before_photo_url: groundReportForm.before_photo_url,
        after_photo_url: groundReportForm.after_photo_url,
        interview_summary: groundReportForm.interview_summary,
        notes: groundReportForm.notes
      };
      storage.saveIssue(updated);
    }

    loadAdminData();
    setIsInspectModalOpen(false);
    setSelectedIssue(null);
  };

  const handleDeleteIssue = (id: string) => {
    if (confirm('Are you sure you want to delete this public issue report?')) {
      storage.deleteIssue(id);
      loadAdminData();
    }
  };

  // Filtered Issues list
  const filteredIssues = issues.filter((iss) => {
    const matchSearch =
      !issueSearch.trim() ||
      (iss.tracking_id || '').toLowerCase().includes(issueSearch.toLowerCase()) ||
      (iss.title || '').toLowerCase().includes(issueSearch.toLowerCase()) ||
      (iss.area || iss.location_area || '').toLowerCase().includes(issueSearch.toLowerCase());
    const matchCity = issueCityFilter === 'all' || iss.city.toLowerCase() === issueCityFilter.toLowerCase();
    const matchCat = issueCategoryFilter === 'all' || iss.category === issueCategoryFilter;
    return matchSearch && matchCity && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto py-6">
      {!isAdminAuth ? (
        /* Protected Admin Login */
        <div className="max-w-md mx-auto bg-white border border-neutral-300 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-black tracking-tight">
              MBN Administrative Console
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Secure Central Command for News, Jan Aawaaz Grievance Moderation & Squad
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Admin ID / Username
              </label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="Enter Admin ID (e.g. Sameer)"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:bg-neutral-800 text-white font-bold text-sm py-3 rounded-xl transition-all shadow"
            >
              Authenticate & Enter Console
            </button>
          </form>
        </div>
      ) : (
        /* Authenticated Admin Dashboard */
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="bg-black text-white rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white text-black font-black px-2 py-0.5 rounded text-xs">MBN</span>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">LOGGED IN AS SAMEER</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                Jan Aawaaz Grievance & News Operations Panel
              </h1>
            </div>

            <button
              onClick={handleAdminLogout}
              className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-xl border border-neutral-700 transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-neutral-200 overflow-x-auto pb-1 text-xs sm:text-sm font-bold">
            {[
              { id: 'news_approvals', label: `NEWS APPROVAL CENTER (${submissions.filter(s => s.status === 'Pending Approval').length} Pending)`, icon: Sparkles },
              { id: 'jan_aawaaz', label: `Public Issues Management (${issues.length})`, icon: AlertTriangle },
              { id: 'news', label: `Published News (${articles.length})`, icon: Newspaper },
              { id: 'squad', label: `MBN Squad (${squadMembers.length})`, icon: Users },
              { id: 'analytics', label: 'Analytics & Overview', icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-black text-white shadow-sm'
                    : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB 0: NEWS APPROVAL CENTER */}
          {activeTab === 'news_approvals' && (
            <div className="space-y-4">
              {/* Header explanation & sub-tabs */}
              <div className="bg-white border border-neutral-300 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-black animate-pulse" />
                      <span className="text-[11px] font-black uppercase tracking-wider text-neutral-500">
                        Editorial Desk Control Room
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-black tracking-tight mt-0.5">
                      Squad Member News Submissions & AI Verification Engine
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">
                      Review reporter stories side-by-side with AI-corrected prose, fact audit checks, and multi-language translations (English, Hindi, Marathi).
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-300">
                      Total Inflow: {submissions.length}
                    </span>
                  </div>
                </div>

                {/* Sub Tabs: Pending Approval, Approved, Rejected, Published, Drafts */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(
                      [
                        { id: 'Pending Approval', label: 'Pending Approval' },
                        { id: 'Approved', label: 'Approved News' },
                        { id: 'Published', label: 'Published Live' },
                        { id: 'Rejected', label: 'Rejected News' },
                        { id: 'Draft', label: 'Drafts' },
                      ] as const
                    ).map((t) => {
                      const count = submissions.filter((s) => s.status === t.id).length;
                      const isCur = approvalSubTab === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setApprovalSubTab(t.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                            isCur
                              ? 'bg-black text-white shadow-sm'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                        >
                          <span>{t.label}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                              isCur ? 'bg-white text-black' : 'bg-neutral-200 text-neutral-700'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search filter */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search headline, reporter or ID..."
                      value={approvalSearch}
                      onChange={(e) => setApprovalSearch(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-black font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Submissions List */}
              {submissions.filter((s) => {
                const matchesTab = s.status === approvalSubTab;
                const matchesSearch =
                  approvalSearch === '' ||
                  s.headline.toLowerCase().includes(approvalSearch.toLowerCase()) ||
                  s.reporter_name.toLowerCase().includes(approvalSearch.toLowerCase()) ||
                  (s.submission_id || s.submission_code).toLowerCase().includes(approvalSearch.toLowerCase());
                return matchesTab && matchesSearch;
              }).length === 0 ? (
                <div className="bg-white border border-neutral-300 rounded-3xl p-12 text-center">
                  <Sparkles className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-neutral-700">No submissions found in {approvalSubTab}</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Incoming stories from verified MBN Squad members will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions
                    .filter((s) => {
                      const matchesTab = s.status === approvalSubTab;
                      const matchesSearch =
                        approvalSearch === '' ||
                        s.headline.toLowerCase().includes(approvalSearch.toLowerCase()) ||
                        s.reporter_name.toLowerCase().includes(approvalSearch.toLowerCase()) ||
                        (s.submission_id || s.submission_code).toLowerCase().includes(approvalSearch.toLowerCase());
                      return matchesTab && matchesSearch;
                    })
                    .map((sub) => (
                      <div
                        key={sub.id}
                        className="bg-white border border-neutral-300 rounded-2xl p-5 hover:border-black transition-all space-y-4 shadow-sm"
                      >
                        {/* Header Details */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-mono font-black text-black bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                              {sub.submission_id}
                            </span>
                            <span className="text-neutral-300">•</span>
                            <span className="font-bold text-black uppercase">{sub.category}</span>
                            <span className="text-neutral-300">•</span>
                            <span className="text-neutral-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-neutral-400" />
                              {sub.city}, {sub.area}
                            </span>
                            <span className="text-neutral-300">•</span>
                            <span className="text-neutral-400">
                              {new Date(sub.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {sub.ai_data && (
                              <span className="text-[11px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-black" />
                                AI Scored: {sub.ai_data.quality_score}/100
                              </span>
                            )}
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-black text-white">
                              {sub.status}
                            </span>
                          </div>
                        </div>

                        {/* Content grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-3 space-y-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                Original Reporter Headline
                              </span>
                              <h3 className="text-base font-black text-black leading-snug">{sub.headline}</h3>
                            </div>

                            <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                              {sub.content}
                            </p>

                            {/* AI Correction Preview Card */}
                            {sub.ai_data && (
                              <div className="mt-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-black" />
                                  AI Formatted Version (Ready to Publish)
                                </span>
                                <p className="text-xs font-bold text-black">{sub.ai_data.polished_headline}</p>
                                <p className="text-[11px] text-neutral-600 line-clamp-2">{sub.ai_data.polished_content}</p>
                              </div>
                            )}

                            {/* Source evidence */}
                            {sub.source_reference && (
                              <p className="text-[11px] text-neutral-500">
                                <strong className="text-neutral-700">Source / Proof:</strong> {sub.source_reference}
                              </p>
                            )}
                          </div>

                          {/* Reporter Profile & Media */}
                          <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200 flex flex-col justify-between space-y-3 text-xs">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                                Reporter Details
                              </span>
                              <p className="font-bold text-black">{sub.reporter_name}</p>
                              <p className="text-[11px] font-mono text-neutral-500">{sub.member_id}</p>
                              <p className="text-[11px] text-neutral-500">+91 {sub.reporter_phone}</p>
                            </div>

                            {sub.main_image_url && (
                              <div className="aspect-video rounded-lg overflow-hidden bg-neutral-200 border">
                                <img
                                  src={sub.main_image_url}
                                  alt="Thumbnail"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions Row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100">
                          <button
                            onClick={() => {
                              setSelectedSubmissionForAI(sub);
                              setIsAIModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Review with AI Co-Pilot (Compare & Publish)
                          </button>

                          <div className="flex items-center gap-2">
                            {sub.status !== 'Approved' && sub.status !== 'Published' && (
                              <button
                                onClick={() => {
                                  storage.updateSubmissionStatus(sub.id, 'Approved');
                                  loadAdminData();
                                }}
                                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300 text-xs font-bold rounded-xl transition-colors"
                              >
                                Quick Approve
                              </button>
                            )}

                            {sub.status !== 'Published' && (
                              <button
                                onClick={() => {
                                  storage.publishSubmissionToArticle(sub.id, 'en');
                                  loadAdminData();
                                  alert('Story published to live MBN Newsfeed!');
                                }}
                                className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors"
                              >
                                Publish Live Now
                              </button>
                            )}

                            {sub.status !== 'Rejected' && (
                              <button
                                onClick={() => {
                                  const reason = prompt('Please enter reason for rejection:') || 'Content does not meet editorial guidelines';
                                  storage.updateSubmissionStatus(sub.id, 'Rejected', reason);
                                  loadAdminData();
                                }}
                                className="px-3 py-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 text-xs font-bold rounded-xl transition-colors"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 1: JAN AAWAAZ - PUBLIC ISSUES MANAGEMENT */}
          {activeTab === 'jan_aawaaz' && (
            <div className="space-y-4">
              {/* Filter & Export Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={issueSearch}
                      onChange={(e) => setIssueSearch(e.target.value)}
                      placeholder="Search tracking ID or keyword..."
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-black"
                    />
                  </div>

                  <select
                    value={issueCategoryFilter}
                    onChange={(e) => setIssueCategoryFilter(e.target.value)}
                    className="bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    {JAN_AAWAAZ_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  <select
                    value={issueCityFilter}
                    onChange={(e) => setIssueCityFilter(e.target.value)}
                    className="bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="all">All Cities</option>
                    {Array.from(new Set(issues.map(i => i.city))).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={exportIssuesCSV}
                    className="inline-flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <Link
                    href="/report"
                    className="inline-flex items-center gap-1.5 border border-black text-black hover:bg-neutral-100 text-xs font-bold px-3 py-2 rounded-xl"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>File New</span>
                  </Link>
                </div>
              </div>

              {/* Table of Issues */}
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-100 text-neutral-700 uppercase tracking-wider border-b border-neutral-200">
                      <tr>
                        <th className="p-3.5">Tracking ID & Title</th>
                        <th className="p-3.5">Category & Area</th>
                        <th className="p-3.5">Reporter (Protected)</th>
                        <th className="p-3.5">Resolution Status</th>
                        <th className="p-3.5">Public State</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {filteredIssues.map((iss) => (
                        <tr key={iss.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="p-3.5 max-w-xs">
                            <span className="font-mono text-[11px] font-black text-black block">
                              {iss.tracking_id}
                            </span>
                            <span className="font-bold text-neutral-900 line-clamp-1 block">
                              {iss.title}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              GPS: {iss.latitude?.toFixed(4)}, {iss.longitude?.toFixed(4)}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="bg-neutral-100 text-neutral-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase block w-fit mb-1">
                              {iss.category}
                            </span>
                            <span className="text-[11px] text-neutral-600 block">
                              {iss.area}, {iss.city}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-neutral-800 block">
                              {iss.reporter_name || 'Anonymous'}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-500">
                              {iss.mobile_number}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              iss.status === 'Resolved'
                                ? 'bg-black text-white'
                                : iss.status === 'Action Taken'
                                ? 'bg-neutral-800 text-white'
                                : iss.status === 'Rejected'
                                ? 'bg-neutral-200 text-neutral-600 line-through'
                                : 'border border-neutral-400 text-black'
                            }`}>
                              {iss.status}
                            </span>
                            <span className="text-[10px] text-neutral-400 block mt-1">
                              {iss.updates?.length || 0} audit logs
                            </span>
                          </td>
                          <td className="p-3.5">
                            {iss.is_published ? (
                              <span className="bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                                PUBLISHED
                              </span>
                            ) : (
                              <span className="bg-neutral-200 text-neutral-700 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                                INTERNAL REVIEW
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => openInspectIssue(iss)}
                              className="bg-black hover:bg-neutral-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg"
                            >
                              Inspect / Edit
                            </button>
                            <button
                              onClick={() => handleDeleteIssue(iss.id)}
                              className="p-1.5 text-neutral-500 hover:text-black rounded"
                              title="Delete report"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: News Management */}
          {activeTab === 'news' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-neutral-900">Articles & Editorial Reports</h3>
                <button
                  onClick={openNewArticleModal}
                  className="inline-flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Article</span>
                </button>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-100 text-neutral-700 uppercase tracking-wider border-b border-neutral-200">
                      <tr>
                        <th className="p-3.5">Headline & Category</th>
                        <th className="p-3.5">Author & Location</th>
                        <th className="p-3.5">Reads</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {articles.map((art) => (
                        <tr key={art.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="p-3.5">
                            <span className="font-bold text-neutral-900 block line-clamp-1">{art.title}</span>
                            <span className="text-[10px] text-neutral-500 uppercase font-semibold">
                              {art.category_name || art.category_slug}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="text-neutral-700 font-medium block">{art.author_name}</span>
                            <span className="text-[10px] text-neutral-400">{art.location}</span>
                          </td>
                          <td className="p-3.5 font-mono text-neutral-600">
                            {art.views_count.toLocaleString()}
                          </td>
                          <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteArticle(art.id)}
                              className="p-1.5 text-neutral-500 hover:text-black rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MBN Squad */}
          {activeTab === 'squad' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <Search className="w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={squadSearch}
                    onChange={(e) => setSquadSearch(e.target.value)}
                    placeholder="Search member by name, mobile, city..."
                    className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <button
                  onClick={exportSquadCSV}
                  className="inline-flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export to Excel/CSV</span>
                </button>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-100 text-neutral-700 uppercase tracking-wider border-b border-neutral-200">
                    <tr>
                      <th className="p-3.5">Member ID & Name</th>
                      <th className="p-3.5">City & Locality</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Moderation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {squadMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="p-3.5">
                          <span className="font-mono text-[11px] font-bold text-black block">{m.member_id}</span>
                          <span className="font-bold text-neutral-900">{m.full_name}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-neutral-800 block">{m.city}</span>
                          <span className="text-[10px] text-neutral-500">{m.area_locality}</span>
                        </td>
                        <td className="p-3.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            m.status === 'approved'
                              ? 'bg-black text-white'
                              : 'bg-neutral-200 text-neutral-800'
                          }`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          {m.status !== 'approved' && (
                            <button
                              onClick={() => handleUpdateSquadStatus(m.id, 'approved')}
                              className="bg-black hover:bg-neutral-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg"
                            >
                              Approve
                            </button>
                          )}
                          {m.status !== 'rejected' && (
                            <button
                              onClick={() => handleUpdateSquadStatus(m.id, 'rejected')}
                              className="bg-neutral-200 hover:bg-neutral-300 text-black text-[10px] font-bold px-2.5 py-1 rounded-lg"
                            >
                              Reject
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Analytics */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-neutral-300 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-bold text-neutral-500 uppercase block mb-1">Total Public Issues</span>
                <span className="text-3xl font-black text-black">{issues.length}</span>
                <span className="text-[11px] text-neutral-500 block mt-1">Logged by citizens</span>
              </div>

              <div className="bg-white border border-neutral-300 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-bold text-neutral-500 uppercase block mb-1">Action Taken / Resolved</span>
                <span className="text-3xl font-black text-black">
                  {issues.filter(i => i.status === 'Resolved' || i.status === 'Action Taken').length}
                </span>
                <span className="text-[11px] text-neutral-500 block mt-1">Ground impact completed</span>
              </div>

              <div className="bg-white border border-neutral-300 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-bold text-neutral-500 uppercase block mb-1">Published On MBN</span>
                <span className="text-3xl font-black text-black">
                  {issues.filter(i => i.is_published).length}
                </span>
                <span className="text-[11px] text-neutral-500 block mt-1">Verified for public roster</span>
              </div>

              <div className="bg-white border border-neutral-300 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-bold text-neutral-500 uppercase block mb-1">Squad Members</span>
                <span className="text-3xl font-black text-black">{squadMembers.length}</span>
                <span className="text-[11px] text-neutral-500 block mt-1">Citizen journalists</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* JAN AAWAAZ INSPECTION & GROUND REPORT MODAL */}
      {isInspectModalOpen && selectedIssue && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div>
                <span className="font-mono text-xs font-black text-black">
                  {selectedIssue.tracking_id} • {selectedIssue.category}
                </span>
                <h2 className="text-lg font-black text-black">{selectedIssue.title}</h2>
              </div>
              <button
                onClick={() => setIsInspectModalOpen(false)}
                className="text-neutral-400 hover:text-black text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* GPS Map View */}
            <div>
              <span className="text-xs font-bold text-black uppercase tracking-wider block mb-2">
                Geolocated Pin Location ({selectedIssue.area}, {selectedIssue.city})
              </span>
              <InteractiveLocationMap
                latitude={selectedIssue.latitude || 19.0760}
                longitude={selectedIssue.longitude || 72.8777}
                address={selectedIssue.location_address}
                interactive={false}
                className="h-48"
              />
            </div>

            {/* Evidence Photos */}
            {selectedIssue.media_urls && selectedIssue.media_urls.length > 0 && (
              <div>
                <span className="text-xs font-bold text-black uppercase tracking-wider block mb-2">
                  Uploaded Photos ({selectedIssue.media_urls.length})
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {selectedIssue.media_urls.map((url, i) => (
                    <div key={i} className="aspect-video rounded-xl overflow-hidden bg-neutral-100 border">
                      <img src={url} alt={`Evidence ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Change & Authority Dispatch Form */}
            <form onSubmit={handleSaveIssueStatusUpdate} className="space-y-4 pt-4 border-t border-neutral-200">
              <h3 className="text-xs font-black uppercase tracking-wider text-black">
                Update Resolution Status & Authority Action
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Change Status
                  </label>
                  <select
                    value={targetStatus}
                    onChange={(e) => setTargetStatus(e.target.value as IssueStatus)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Verified">Verified & Publish</option>
                    <option value="Forwarded to Concerned Authority">Forwarded to Concerned Authority</option>
                    <option value="Action Taken">Action Taken</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Authority Contacted / Response
                  </label>
                  <input
                    type="text"
                    value={authorityResponseInput}
                    onChange={(e) => setAuthorityResponseInput(e.target.value)}
                    placeholder="e.g. BMC Ward Officer dispatched mastic team..."
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Investigation Log / Audit Note *
                </label>
                <textarea
                  required
                  rows={2}
                  value={statusUpdateNote}
                  onChange={(e) => setStatusUpdateNote(e.target.value)}
                  placeholder="Explain actions taken: site visited, notices sent, timeline committed..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              {/* Before and After Ground Report Fields */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-3">
                <span className="text-xs font-bold text-black uppercase tracking-wider block">
                  Ground Report / Before & After Audit (Optional)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-600 uppercase mb-1">Before Photo URL</label>
                    <input
                      type="url"
                      value={groundReportForm.before_photo_url}
                      onChange={(e) => setGroundReportForm({ ...groundReportForm, before_photo_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-600 uppercase mb-1">After Photo URL</label>
                    <input
                      type="url"
                      value={groundReportForm.after_photo_url}
                      onChange={(e) => setGroundReportForm({ ...groundReportForm, after_photo_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-600 uppercase mb-1">Interview Summary / Official Quote</label>
                  <input
                    type="text"
                    value={groundReportForm.interview_summary}
                    onChange={(e) => setGroundReportForm({ ...groundReportForm, interview_summary: e.target.value })}
                    placeholder="e.g. Ward Engineer confirmed work completion on camera..."
                    className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsInspectModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black hover:bg-neutral-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow"
                >
                  Save Status & Audit Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Article Create Modal */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8">
            <h2 className="text-xl font-black text-black mb-4">
              {editingArticle ? 'Edit Article' : 'Publish New Article'}
            </h2>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Headline *</label>
                <input
                  type="text"
                  required
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  placeholder="Article headline..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Summary / Deck *</label>
                <textarea
                  required
                  rows={2}
                  value={newsForm.summary}
                  onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                  placeholder="Short introductory summary..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-2 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black hover:bg-neutral-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI NEWSROOM COMPARISON MODAL */}
      {selectedSubmissionForAI && (
        <AIComparisonModal
          submission={selectedSubmissionForAI}
          isOpen={isAIModalOpen}
          onClose={() => {
            setIsAIModalOpen(false);
            setSelectedSubmissionForAI(null);
          }}
          onApprove={(sub) => {
            storage.updateSubmissionStatus(sub.id, 'Approved');
            loadAdminData();
            setIsAIModalOpen(false);
          }}
          onReject={(sub, reason) => {
            storage.updateSubmissionStatus(sub.id, 'Rejected', reason);
            loadAdminData();
            setIsAIModalOpen(false);
          }}
          onApproveAndPublish={(sub, chosenLang) => {
            storage.publishSubmissionToArticle(sub.id, chosenLang);
            loadAdminData();
            setIsAIModalOpen(false);
            alert(`Story approved & published live on MBN in language: ${chosenLang.toUpperCase()}!`);
          }}
        />
      )}
    </div>
  );
}
