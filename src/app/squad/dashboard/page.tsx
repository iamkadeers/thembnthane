'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { storage } from '@/lib/storage';
import { SquadMember, NewsSubmission, PublicIssue } from '@/types';
import {
  User,
  ShieldCheck,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  MapPin,
  FileText,
  Phone,
  Camera,
  MessageSquare,
  KeyRound,
  Send,
  Sparkles,
  Layers,
  Upload,
  Video,
  Bookmark,
  Share2,
  Calendar,
  Crosshair,
  Info
} from 'lucide-react';

const NEWS_CATEGORIES = [
  'India',
  'Maharashtra',
  'Politics',
  'Crime',
  'Business',
  'Technology',
  'Sports',
  'Entertainment',
  'Ground Reports',
  'Civic & Education'
];

export default function MemberDashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginPhone, setLoginPhone] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [currentMember, setCurrentMember] = useState<SquadMember | null>(null);

  // Dashboard content tabs
  const [activeTab, setActiveTab] = useState<'submit_news' | 'my_submissions' | 'submit_issue' | 'my_reports'>('submit_news');

  // Submissions state
  const [mySubmissions, setMySubmissions] = useState<NewsSubmission[]>([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState('');

  // Submit News Form State
  const [newsForm, setNewsForm] = useState({
    headline: '',
    category: 'Ground Reports',
    content: '',
    city: 'Mumbai',
    area: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    news_datetime: new Date().toISOString().slice(0, 16),
    main_image_url: '',
    supporting_images: '',
    video_url: '',
    source_reference: '',
    status: 'Pending Approval' as 'Pending Approval' | 'Draft'
  });

  // Jan Aawaaz Issue Form State
  const [issueForm, setIssueForm] = useState({
    title: '',
    category: 'Public Safety' as any,
    description: '',
    locationArea: '',
    city: '',
    pincode: '',
    mediaUrl: '',
  });
  const [issueSubmitted, setIssueSubmitted] = useState(false);

  useEffect(() => {
    const savedMember = sessionStorage.getItem('mbn_active_member');
    if (savedMember) {
      try {
        const parsed: SquadMember = JSON.parse(savedMember);
        setCurrentMember(parsed);
        setIsLoggedIn(true);
        refreshSubmissions(parsed.member_id);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const refreshSubmissions = (memberId: string) => {
    const subs = storage.getSubmissionsByMember(memberId);
    setMySubmissions(subs);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = loginPhone.replace(/\D/g, '');
    const members = storage.getSquadMembers();
    const found = members.find((m) => m.mobile_number.includes(cleanPhone));

    if (found) {
      setCurrentMember(found);
      setOtpStep(true);
    } else {
      const first = members[0];
      if (first) {
        setCurrentMember(first);
        setOtpStep(true);
      } else {
        alert('No registered squad account found for this number. Please register first!');
      }
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp.length >= 4 && currentMember) {
      sessionStorage.setItem('mbn_active_member', JSON.stringify(currentMember));
      setIsLoggedIn(true);
      setOtpStep(false);
      refreshSubmissions(currentMember.member_id);
    } else {
      alert('Please enter valid 4-digit demo OTP (e.g. 1234)');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('mbn_active_member');
    setIsLoggedIn(false);
    setCurrentMember(null);
    setOtpStep(false);
  };

  // GPS Location Fetch for News
  const handleFetchGpsLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNewsForm((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          alert(`GPS captured: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (error) => {
          alert('GPS permission denied or unavailable. You can enter the location manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Submit News Story (with AI processing)
  const handleSubmitNews = async (isDraft: boolean = false) => {
    if (!currentMember) return;
    if (!newsForm.headline || !newsForm.content) {
      alert('Please provide a headline and full story description.');
      return;
    }

    setIsAiProcessing(true);

    try {
      const supportingImgsArray = newsForm.supporting_images
        ? newsForm.supporting_images.split(',').map((u) => u.trim()).filter(Boolean)
        : [];

      const submissionData = {
        member_id: currentMember.member_id,
        reporter_name: currentMember.full_name,
        reporter_phone: currentMember.mobile_number,
        headline: newsForm.headline,
        category: newsForm.category,
        content: newsForm.content,
        city: newsForm.city || currentMember.city,
        area: newsForm.area || 'City Center',
        latitude: newsForm.latitude,
        longitude: newsForm.longitude,
        news_datetime: newsForm.news_datetime || new Date().toISOString(),
        main_image_url:
          newsForm.main_image_url ||
          'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
        supporting_images: supportingImgsArray,
        video_url: newsForm.video_url,
        source_reference: newsForm.source_reference,
        status: (isDraft ? 'Draft' : 'Pending Approval') as any,
      };

      const newSub = await storage.submitNewsWithAI(submissionData);

      setIsAiProcessing(false);
      setSubmitSuccessMsg(
        isDraft
          ? 'Draft saved successfully!'
          : 'News submitted to MBN AI Newsroom! AI has reviewed grammar and generated translations. Now pending Admin verification.'
      );

      refreshSubmissions(currentMember.member_id);

      // Reset form
      setNewsForm({
        headline: '',
        category: 'Ground Reports',
        content: '',
        city: currentMember.city || 'Mumbai',
        area: '',
        latitude: undefined,
        longitude: undefined,
        news_datetime: new Date().toISOString().slice(0, 16),
        main_image_url: '',
        supporting_images: '',
        video_url: '',
        source_reference: '',
        status: 'Pending Approval'
      });

      setTimeout(() => {
        setSubmitSuccessMsg('');
        setActiveTab('my_submissions');
      }, 2500);
    } catch (err) {
      setIsAiProcessing(false);
      alert('Submission failed. Please check connection.');
    }
  };

  // Submit Jan Aawaaz Issue
  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMember) return;

    const trackingId = `MBN-ISSUE-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newIssue: PublicIssue = {
      id: `issue-${Date.now()}`,
      tracking_id: trackingId,
      issue_code: trackingId,
      title: issueForm.title,
      category: issueForm.category,
      description: issueForm.description,
      area: issueForm.locationArea,
      location_area: issueForm.locationArea,
      city: issueForm.city || currentMember.city,
      state: currentMember.state,
      pincode: issueForm.pincode,
      media_urls: issueForm.mediaUrl ? [issueForm.mediaUrl] : ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'],
      reporter_name: currentMember.full_name,
      mobile_number: currentMember.mobile_number,
      reporter_phone: currentMember.mobile_number,
      reporter_member_id: currentMember.member_id,
      status: 'Submitted',
      verification_status: 'pending',
      is_published: false,
      upvotes: 1,
      created_at: new Date().toISOString(),
    };

    storage.saveIssue(newIssue);
    setIssueSubmitted(true);
    setTimeout(() => {
      setIssueSubmitted(false);
      setActiveTab('my_reports');
      setIssueForm({
        title: '',
        category: 'Public Safety',
        description: '',
        locationArea: '',
        city: '',
        pincode: '',
        mediaUrl: '',
      });
    }, 1500);
  };

  const memberIssues = currentMember
    ? storage.getIssues().filter((i) => i.reporter_member_id === currentMember.member_id || i.reporter_phone === currentMember.mobile_number || i.mobile_number === currentMember.mobile_number)
    : [];

  return (
    <div className="max-w-6xl mx-auto py-6">
      {!isLoggedIn ? (
        <div className="max-w-md mx-auto bg-white border border-neutral-300 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight">
              MBN Squad Member Login
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Secure mobile OTP authentication for approved citizen reporters & news correspondents
            </p>
          </div>

          {!otpStep ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Registered Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98201 12345"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-black"
                  />
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Demo numbers: <code className="text-black font-bold">9820112345</code> (Mahesh Jadhav) or{' '}
                  <code className="text-black font-bold">9833455432</code> (Sneha Tambe)
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
              >
                Request Access Code (OTP)
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-center">
                <p className="text-xs text-neutral-600">
                  Access Code dispatched to{' '}
                  <span className="font-bold text-black">+91 {currentMember?.mobile_number}</span>
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Demo OTP: <strong className="text-black">1234</strong></p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Enter 4-Digit Access Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  placeholder="1234"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  className="w-full text-center tracking-[0.5em] text-lg font-black py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-black"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
              >
                Verify & Enter Newsroom
              </button>

              <button
                type="button"
                onClick={() => setOtpStep(false)}
                className="w-full py-2 text-xs font-bold text-neutral-500 hover:text-black transition-colors"
              >
                Back to Mobile Number
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-neutral-200 text-center">
            <p className="text-xs text-neutral-500">
              Not an MBN Squad member yet?{' '}
              <Link href="/squad#register" className="font-bold text-black underline underline-offset-2">
                Register Here
              </Link>
            </p>
          </div>
        </div>
      ) : (
        /* Member Dashboard View */
        <div className="space-y-6">
          {/* Member Header Card */}
          <div className="bg-black text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white shrink-0 font-black text-2xl">
                {currentMember?.full_name?.charAt(0) || 'M'}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight">{currentMember?.full_name}</h1>
                  <span className="inline-flex items-center gap-1 bg-white/10 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-white/20">
                    <ShieldCheck className="w-3 h-3 text-white" />
                    Verified Squad Reporter
                  </span>
                </div>
                <p className="text-xs text-neutral-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>ID: <strong className="text-white font-mono">{currentMember?.member_id}</strong></span>
                  <span>•</span>
                  <span>Phone: <strong className="text-white">{currentMember?.mobile_number}</strong></span>
                  <span>•</span>
                  <span>Region: <strong className="text-white">{currentMember?.city}, {currentMember?.state}</strong></span>
                </p>
                <p className="text-[11px] text-neutral-400 mt-2">
                  Role: <span className="text-white font-semibold">{currentMember?.role_interest || 'Citizen Journalist'}</span> | Badge: <span className="text-white font-semibold">MBN Newsroom Bureau</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Submissions</span>
                <span className="text-2xl font-black text-white">{mySubmissions.length}</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-xs font-bold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-neutral-300 pb-2">
            <button
              onClick={() => setActiveTab('submit_news')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-2 ${
                activeTab === 'submit_news'
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Submit News Story (AI Co-Pilot)
            </button>
            <button
              onClick={() => setActiveTab('my_submissions')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-2 ${
                activeTab === 'my_submissions'
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              My News Submissions ({mySubmissions.length})
            </button>
            <button
              onClick={() => setActiveTab('submit_issue')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-2 ${
                activeTab === 'submit_issue'
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Report Jan Aawaaz Issue
            </button>
            <button
              onClick={() => setActiveTab('my_reports')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-2 ${
                activeTab === 'my_reports'
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              My Jan Aawaaz Grievances ({memberIssues.length})
            </button>
          </div>

          {/* Feedback banner */}
          {submitSuccessMsg && (
            <div className="p-4 bg-neutral-900 text-white border border-neutral-700 rounded-2xl flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
              <p className="text-xs font-bold">{submitSuccessMsg}</p>
            </div>
          )}

          {/* TAB 1: SUBMIT NEWS STORY */}
          {activeTab === 'submit_news' && (
            <div className="bg-white border border-neutral-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-neutral-200 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-black animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-neutral-500">
                    MBN AI Newsroom Dispatch Desk
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight mt-1">
                  Submit News Report for Verification & Publishing
                </h2>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Every submitted report is analyzed by our automated <strong>AI News Engine</strong> to correct grammar, generate neutral journalistic prose, draft SEO snippets, and translate into Hindi and Marathi for Admin editorial sign-off.
                </p>
              </div>

              <div className="space-y-4">
                {/* Reporter Read-Only Badge */}
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-neutral-500 font-medium">Bylined Reporter: </span>
                    <strong className="text-black font-bold">{currentMember?.full_name}</strong>
                    <span className="text-neutral-400 ml-2">({currentMember?.member_id})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-black" />
                    <span>Account Authenticated via Mobile OTP</span>
                  </div>
                </div>

                {/* News Headline */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    News Headline / Story Title <span className="text-black">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Heavy Rainfall Inundates Hindmata Flyover; Traffic Diverted Towards Parel"
                    value={newsForm.headline}
                    onChange={(e) => setNewsForm({ ...newsForm, headline: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-bold text-black focus:outline-none focus:border-black"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Provide a factual, clear title. AI will polish headline rhythm while preserving original facts.
                  </p>
                </div>

                {/* Category & Date/Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      News Category <span className="text-black">*</span>
                    </label>
                    <select
                      value={newsForm.category}
                      onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-bold text-black focus:outline-none focus:border-black"
                    >
                      {NEWS_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Incident Date & Time <span className="text-black">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        required
                        value={newsForm.news_datetime}
                        onChange={(e) => setNewsForm({ ...newsForm, news_datetime: e.target.value })}
                        className="w-full px-4 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-bold text-black focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>

                {/* City, Area & GPS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      City / District <span className="text-black">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai, Pune, Nagpur"
                      value={newsForm.city}
                      onChange={(e) => setNewsForm({ ...newsForm, city: e.target.value })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Area / Locality <span className="text-black">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dadar West, Near Railway Station"
                      value={newsForm.area}
                      onChange={(e) => setNewsForm({ ...newsForm, area: e.target.value })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Exact GPS Coordinates
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleFetchGpsLocation}
                        className="flex-1 px-3 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                        {newsForm.latitude ? `${newsForm.latitude.toFixed(2)}, ${newsForm.longitude?.toFixed(2)}` : 'Capture GPS'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Full News Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Full News Story Description <span className="text-black">*</span>
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Write detailed facts: what happened, where, who was affected, official statements, current situation on the ground..."
                    value={newsForm.content}
                    onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                    className="w-full p-4 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-normal text-black leading-relaxed focus:outline-none focus:border-black"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Tip: Do not worry about minor typos or rough grammar; the AI Assistant will refine into AP/PTI wire formatting.
                  </p>
                </div>

                {/* Media Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Main Featured Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newsForm.main_image_url}
                      onChange={(e) => setNewsForm({ ...newsForm, main_image_url: e.target.value })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono text-neutral-800 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Video URL (YouTube / Stream / MP4)
                    </label>
                    <input
                      type="url"
                      placeholder="https://youtu.be/... or raw video link"
                      value={newsForm.video_url}
                      onChange={(e) => setNewsForm({ ...newsForm, video_url: e.target.value })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono text-neutral-800 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Supporting Images (Comma separated URLs)
                  </label>
                  <input
                    type="text"
                    placeholder="https://image1.jpg, https://image2.jpg"
                    value={newsForm.supporting_images}
                    onChange={(e) => setNewsForm({ ...newsForm, supporting_images: e.target.value })}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono text-neutral-800 focus:outline-none focus:border-black"
                  />
                </div>

                {/* Source / Evidence */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Source / Official Reference / Evidence Document
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BMC Disaster Control Room Bulletin, Eye-witness quote from resident Arvind Sawant"
                    value={newsForm.source_reference}
                    onChange={(e) => setNewsForm({ ...newsForm, source_reference: e.target.value })}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none focus:border-black"
                  />
                </div>

                {/* AI Processing Note */}
                <div className="p-4 bg-neutral-100 rounded-2xl border border-neutral-200 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-black shrink-0 mt-0.5" />
                  <div className="text-xs text-neutral-700 space-y-1">
                    <p className="font-bold text-black">MBN AI Newsroom Safeguard Guarantee:</p>
                    <p className="text-[11px] leading-relaxed text-neutral-600">
                      Our AI engine standardizes grammar, generates three-language translations (English, Hindi, Marathi), and evaluates fact integrity. Under strict editorial rules, AI will <strong>never invent facts, quotes, or fake witnesses</strong>. Final publication authority rests with Chief Editor Sameer.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                  <button
                    type="button"
                    disabled={isAiProcessing}
                    onClick={() => handleSubmitNews(true)}
                    className="px-5 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Save as Draft
                  </button>

                  <button
                    type="button"
                    disabled={isAiProcessing}
                    onClick={() => handleSubmitNews(false)}
                    className="px-6 py-3 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-sm flex items-center gap-2"
                  >
                    {isAiProcessing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        AI Parsing & Translating...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit News For Approval
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY NEWS SUBMISSIONS */}
          {activeTab === 'my_submissions' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-black tracking-tight">My Newsroom Submissions</h2>
                  <p className="text-xs text-neutral-500">
                    Track AI evaluation scores, editorial approval status, and published articles
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('submit_news')}
                  className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors self-start sm:self-auto flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  New Story
                </button>
              </div>

              {mySubmissions.length === 0 ? (
                <div className="bg-white border border-neutral-300 rounded-3xl p-10 text-center">
                  <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-neutral-700">No news submissions yet</p>
                  <p className="text-xs text-neutral-400 mt-1">Submit your first news story or ground report today.</p>
                  <button
                    onClick={() => setActiveTab('submit_news')}
                    className="mt-4 px-5 py-2.5 bg-black text-white rounded-xl text-xs font-bold"
                  >
                    Create Submission
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {mySubmissions.map((sub) => {
                    const statusColors: Record<string, string> = {
                      'Pending Approval': 'bg-neutral-100 text-neutral-800 border-neutral-300',
                      Approved: 'bg-neutral-200 text-neutral-900 border-neutral-400',
                      Published: 'bg-black text-white border-black',
                      Rejected: 'bg-neutral-100 text-neutral-500 line-through border-neutral-300',
                      Draft: 'bg-neutral-50 text-neutral-600 border-neutral-200'
                    };

                    return (
                      <div
                        key={sub.id}
                        className="bg-white border border-neutral-300 rounded-2xl p-5 hover:border-black transition-colors space-y-3 shadow-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-neutral-500">{sub.submission_id}</span>
                            <span className="text-neutral-300">•</span>
                            <span className="text-xs font-bold text-black uppercase tracking-wider">{sub.category}</span>
                            <span className="text-neutral-300">•</span>
                            <span className="text-xs text-neutral-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-neutral-400" />
                              {sub.city}, {sub.area}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                              statusColors[sub.status] || 'bg-neutral-100 text-black border-neutral-300'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>

                        <h3 className="text-base font-black text-black tracking-tight">{sub.headline}</h3>

                        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">{sub.content}</p>

                        {/* AI Processed Preview Pill */}
                        {sub.ai_data && (
                          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-black flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-black" />
                                AI Optimized Headline:
                              </span>
                              <span className="font-mono text-neutral-500">Quality Score: {sub.ai_data.quality_score}/100</span>
                            </div>
                            <p className="text-xs font-semibold text-neutral-800">{sub.ai_data.polished_headline}</p>
                            <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-bold text-neutral-600">
                              <span className="bg-white px-2 py-0.5 rounded border border-neutral-200">
                                🇮🇳 English
                              </span>
                              {sub.ai_data.translations?.hi && (
                                <span className="bg-white px-2 py-0.5 rounded border border-neutral-200">
                                  🇮🇳 हिंदी: {sub.ai_data.translations.hi.headline.slice(0, 30)}...
                                </span>
                              )}
                              {sub.ai_data.translations?.mr && (
                                <span className="bg-white px-2 py-0.5 rounded border border-neutral-200">
                                  🇮🇳 मराठी: {sub.ai_data.translations.mr.headline.slice(0, 30)}...
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100 text-[11px] text-neutral-400">
                          <span>Submitted: {new Date(sub.created_at).toLocaleString()}</span>
                          {sub.rejection_reason && (
                            <span className="text-black font-semibold">
                              Editorial Feedback: {sub.rejection_reason}
                            </span>
                          )}
                          {sub.published_article_id && (
                            <Link
                              href={`/news/${sub.headline.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`}
                              className="text-black font-black underline underline-offset-2 flex items-center gap-1"
                            >
                              View Published Article →
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REPORT JAN AAWAAZ ISSUE */}
          {activeTab === 'submit_issue' && (
            <div className="bg-white border border-neutral-300 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="border-b border-neutral-200 pb-4 mb-6">
                <span className="text-[11px] font-black uppercase tracking-widest text-neutral-500">
                  Jan Aawaaz Squad Dispatch
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight mt-1">
                  Report Civic & Public Issue Directly
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Squad member reports carry high-priority verification badges in the MBN Civic Redressal cell.
                </p>
              </div>

              {issueSubmitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-black">Civic Report Registered!</h3>
                  <p className="text-xs text-neutral-500">Redirecting to your registered grievance log...</p>
                </div>
              ) : (
                <form onSubmit={handleReportIssue} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Issue Title <span className="text-black">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Broken Water Pipeline Flooding SV Road"
                      value={issueForm.title}
                      onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-bold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                        Issue Category
                      </label>
                      <select
                        value={issueForm.category}
                        onChange={(e) => setIssueForm({ ...issueForm, category: e.target.value })}
                        className="w-full px-4 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      >
                        <option value="Road & Potholes">Road & Potholes</option>
                        <option value="Garbage & Cleanliness">Garbage & Cleanliness</option>
                        <option value="Water Supply">Water Supply</option>
                        <option value="Street Lights">Street Lights</option>
                        <option value="Drainage & Sewage">Drainage & Sewage</option>
                        <option value="Public Safety">Public Safety</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Corruption">Corruption</option>
                        <option value="Illegal Construction">Illegal Construction</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                        Area / Landmark
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Near Station Gate No. 2"
                        value={issueForm.locationArea}
                        onChange={(e) => setIssueForm({ ...issueForm, locationArea: e.target.value })}
                        className="w-full px-4 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Issue Description <span className="text-black">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Detail the ground situation, how long the issue has persisted, and affected citizen numbers..."
                      value={issueForm.description}
                      onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
                      className="w-full p-4 bg-neutral-50 border border-neutral-300 rounded-xl text-xs leading-relaxed focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Photo Evidence Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={issueForm.mediaUrl}
                      onChange={(e) => setIssueForm({ ...issueForm, mediaUrl: e.target.value })}
                      className="w-full px-4 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="pt-4 border-t border-neutral-200 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm"
                    >
                      File Priority Jan Aawaaz Issue
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: MY JAN AAWAAZ REPORTS */}
          {activeTab === 'my_reports' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-black tracking-tight">My Jan Aawaaz Grievance Records</h2>
                  <p className="text-xs text-neutral-500">Live official progress from municipal and police desks</p>
                </div>
                <button
                  onClick={() => setActiveTab('submit_issue')}
                  className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  New Grievance
                </button>
              </div>

              {memberIssues.length === 0 ? (
                <div className="bg-white border border-neutral-300 rounded-3xl p-10 text-center">
                  <AlertTriangle className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-neutral-700">No civic grievances logged</p>
                  <p className="text-xs text-neutral-400 mt-1">Report civic issues in your area to mobilize local authorities.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {memberIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="bg-white border border-neutral-300 rounded-2xl p-5 hover:border-black transition-colors space-y-2 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-neutral-500">{issue.tracking_id}</span>
                          <span className="text-neutral-300">•</span>
                          <span className="text-xs font-bold text-black uppercase">{issue.category}</span>
                          <span className="text-neutral-300">•</span>
                          <span className="text-xs text-neutral-500">{issue.area || issue.location_area}, {issue.city}</span>
                        </div>
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-300 text-black">
                          {issue.status}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-black">{issue.title}</h3>
                      <p className="text-xs text-neutral-600 line-clamp-2">{issue.description}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[11px] text-neutral-400">
                        <span>Reported: {new Date(issue.created_at).toLocaleDateString()}</span>
                        <Link
                          href={`/track?id=${issue.tracking_id}`}
                          className="font-bold text-black underline underline-offset-2"
                        >
                          View Live Tracking Timeline →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
