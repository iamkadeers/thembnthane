'use client';

import React, { useState } from 'react';
import { NewsSubmission } from '@/types';
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Globe,
  Share2,
  Copy,
  Languages,
  Layers,
  FileText
} from 'lucide-react';

interface AIComparisonModalProps {
  submission: NewsSubmission;
  isOpen: boolean;
  onClose: () => void;
  onApproveAndPublish: (sub: NewsSubmission, chosenLanguage: 'en' | 'hi' | 'mr') => void;
  onApprove: (sub: NewsSubmission) => void;
  onReject: (sub: NewsSubmission, reason: string) => void;
}

export const AIComparisonModal: React.FC<AIComparisonModalProps> = ({
  submission,
  isOpen,
  onClose,
  onApproveAndPublish,
  onApprove,
  onReject
}) => {
  const [activeTab, setActiveTab] = useState<'compare' | 'translations' | 'seo_social' | 'audit'>('compare');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'mr'>('en');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const ai = submission.ai_data;

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl my-8 space-y-6 max-h-[90vh] flex flex-col border border-neutral-300">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-black text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-white" />
                MBN AI NEWSROOM CO-PILOT
              </span>
              <span className="font-mono text-xs font-bold text-neutral-500">
                {submission.submission_code}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-black mt-1">
              Editorial Verification & Multi-Language Desk
            </h2>
            <p className="text-xs text-neutral-500">
              Reporter: <strong>{submission.reporter_name}</strong> ({submission.member_id}) • {submission.area}, {submission.city}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-black font-mono font-bold text-lg p-1.5 self-start sm:self-auto"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-neutral-200 overflow-x-auto pb-1 text-xs font-bold shrink-0">
          {[
            { id: 'compare', label: 'Original vs AI Corrected', icon: Layers },
            { id: 'translations', label: 'Multi-Language (EN / हिंदी / मराठी)', icon: Languages },
            { id: 'seo_social', label: 'SEO & Social Media Captions', icon: Share2 },
            { id: 'audit', label: 'Fact-Check & Grammar Safety Flags', icon: AlertTriangle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-black text-white shadow-sm'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: SIDE-BY-SIDE COMPARISON */}
        {activeTab === 'compare' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-1 flex-1">
            {/* Version A: Original Reporter Raw Text */}
            <div className="bg-neutral-50 border border-neutral-300 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-neutral-500">
                  Version A: Original Reporter Submission
                </span>
                <span className="text-[10px] font-mono bg-neutral-200 px-2 py-0.5 rounded font-bold">
                  RAW UNEDITED
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Headline</span>
                <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                  {submission.headline}
                </h3>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Raw Description</span>
                <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap">
                  {submission.content}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200 text-[11px] text-neutral-600 space-y-1">
                <div><strong>Category:</strong> {submission.category}</div>
                <div><strong>Source / Reference:</strong> {submission.source_evidence || 'None provided'}</div>
                <div><strong>Location:</strong> {submission.area}, {submission.city}</div>
              </div>
            </div>

            {/* Version B: AI Corrected & Polished Newsroom Story */}
            <div className="bg-white border-2 border-black rounded-2xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Version B: AI Corrected Newsroom Draft
                </span>
                <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5 rounded font-bold">
                  AP/PTI STANDARDIZED
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Polished Headline</span>
                <h3 className="text-sm font-black text-black leading-snug">
                  {ai?.corrected_headline || submission.headline}
                </h3>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Editorial Summary</span>
                <p className="text-xs font-semibold text-neutral-800 leading-relaxed">
                  {ai?.corrected_summary}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">Formatted Article Body</span>
                <div
                  className="text-xs text-neutral-700 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: ai?.corrected_content || `<p>${submission.content}</p>` }}
                />
              </div>

              <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">Category Suggested: <strong>{ai?.suggested_category}</strong></span>
                <button
                  onClick={() => handleCopyText(ai?.corrected_content || submission.content)}
                  className="font-bold text-black hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied' : 'Copy Draft'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MULTI-LANGUAGE TRANSLATIONS */}
        {activeTab === 'translations' && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-xl border border-neutral-300 w-fit">
              <button
                onClick={() => setSelectedLanguage('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedLanguage === 'en' ? 'bg-black text-white shadow' : 'text-neutral-700'
                }`}
              >
                English (Original)
              </button>
              <button
                onClick={() => setSelectedLanguage('hi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedLanguage === 'hi' ? 'bg-black text-white shadow' : 'text-neutral-700'
                }`}
              >
                हिंदी (Hindi)
              </button>
              <button
                onClick={() => setSelectedLanguage('mr')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedLanguage === 'mr' ? 'bg-black text-white shadow' : 'text-neutral-700'
                }`}
              >
                मराठी (Marathi)
              </button>
            </div>

            <div className="bg-neutral-50 border border-neutral-300 rounded-2xl p-5 space-y-4">
              {selectedLanguage === 'en' && (
                <>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">English Headline</span>
                    <h3 className="text-base font-black text-black">{ai?.corrected_headline || submission.headline}</h3>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">English Summary</span>
                    <p className="text-xs text-neutral-700 leading-relaxed">{ai?.corrected_summary}</p>
                  </div>
                </>
              )}

              {selectedLanguage === 'hi' && (
                <>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">हिंदी शीर्षक</span>
                    <h3 className="text-base font-black text-black">{ai?.headline_hi}</h3>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">हिंदी सारांश</span>
                    <p className="text-xs text-neutral-700 leading-relaxed">{ai?.summary_hi}</p>
                  </div>
                  <div
                    className="text-xs text-neutral-700 leading-relaxed border-t pt-3 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: ai?.content_hi || '' }}
                  />
                </>
              )}

              {selectedLanguage === 'mr' && (
                <>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">मराठी मथळा</span>
                    <h3 className="text-base font-black text-black">{ai?.headline_mr}</h3>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">मराठी सारांश</span>
                    <p className="text-xs text-neutral-700 leading-relaxed">{ai?.summary_mr}</p>
                  </div>
                  <div
                    className="text-xs text-neutral-700 leading-relaxed border-t pt-3 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: ai?.content_mr || '' }}
                  />
                </>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SEO & SOCIAL MEDIA */}
        {activeTab === 'seo_social' && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            <div className="bg-neutral-50 border border-neutral-300 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-black">SEO Metadata</h4>
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">Meta Title (Google Preview)</span>
                <span className="text-xs font-bold text-black">{ai?.seo_title}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">Meta Description</span>
                <span className="text-xs text-neutral-700">{ai?.seo_description}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Keywords</span>
                <div className="flex flex-wrap gap-1.5">
                  {ai?.keywords.map((k, i) => (
                    <span key={i} className="bg-white border border-neutral-300 text-black text-[10px] px-2 py-0.5 rounded-md font-mono">
                      #{k}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 border border-neutral-300 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-black">Auto-Generated Social Captions</h4>
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">WhatsApp Broadcast</span>
                <div className="bg-white p-3 rounded-xl border text-xs font-mono text-neutral-800 whitespace-pre-wrap">
                  {ai?.social_captions.whatsapp}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">X (Twitter) Dispatch</span>
                <div className="bg-white p-3 rounded-xl border text-xs font-mono text-neutral-800 whitespace-pre-wrap">
                  {ai?.social_captions.twitter}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FACT-CHECK & GRAMMAR AUDIT */}
        {activeTab === 'audit' && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            {/* Fact check flags */}
            <div className="bg-neutral-50 border border-neutral-300 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
                <AlertTriangle className="w-4 h-4" />
                <span>Editorial Fact-Check Safety Flags</span>
              </div>
              {ai?.fact_check_flags && ai.fact_check_flags.length > 0 ? (
                <ul className="space-y-2">
                  {ai.fact_check_flags.map((flag, i) => (
                    <li key={i} className="text-xs text-neutral-800 bg-white p-2.5 rounded-xl border border-neutral-300 flex items-start gap-2">
                      <span className="text-black font-bold">⚠️</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-neutral-600">No dangerous unverified allegations detected. Clean submission.</p>
              )}
            </div>

            {/* Grammar improvements applied */}
            <div className="bg-neutral-50 border border-neutral-300 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
                <CheckCircle className="w-4 h-4" />
                <span>Grammar & Stylistic Refinements Applied</span>
              </div>
              <ul className="space-y-1.5 text-xs text-neutral-700">
                {ai?.grammar_improvements.map((g, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Rejection Reason Form */}
        {showRejectBox && (
          <div className="p-4 bg-neutral-100 border border-neutral-300 rounded-2xl space-y-2 shrink-0">
            <label className="block text-xs font-bold text-black uppercase">
              Specify Reason for Rejection / Request More Info *
            </label>
            <input
              type="text"
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Please provide photo of project board or RTI copy to substantiate numbers..."
              className="w-full bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-black"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowRejectBox(false)}
                className="px-3 py-1 text-xs text-neutral-600 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onReject(submission, rejectReason)}
                className="bg-black text-white text-xs font-bold px-4 py-1.5 rounded-lg"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-200 shrink-0">
          <div className="flex items-center gap-2">
            {!showRejectBox && (
              <>
                <button
                  type="button"
                  onClick={() => setShowRejectBox(true)}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold px-4 py-2.5 rounded-xl border border-neutral-300"
                >
                  Reject News
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectBox(true)}
                  className="border border-black text-black hover:bg-neutral-100 text-xs font-bold px-4 py-2.5 rounded-xl"
                >
                  Request Info
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onApprove(submission)}
              className="border-2 border-black hover:bg-neutral-100 text-black text-xs font-black px-4 py-2.5 rounded-xl"
            >
              Approve (Stage in Approved Queue)
            </button>

            <button
              type="button"
              onClick={() => onApproveAndPublish(submission, selectedLanguage)}
              className="bg-black hover:bg-neutral-800 text-white text-xs font-black px-5 py-2.5 rounded-xl shadow flex items-center gap-1.5"
            >
              <span>Publish Immediately to Live Site</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
