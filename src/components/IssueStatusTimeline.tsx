'use client';

import React from 'react';
import { IssueStatus, IssueUpdate } from '@/types';
import {
  CheckCircle2,
  Clock,
  Send,
  AlertTriangle,
  FileCheck,
  Building2,
  Wrench,
  XCircle
} from 'lucide-react';

interface IssueStatusTimelineProps {
  currentStatus: IssueStatus | string;
  updates: IssueUpdate[];
  authorityResponse?: string;
}

const ORDERED_STEPS: IssueStatus[] = [
  'Submitted',
  'Under Review',
  'Verified',
  'Forwarded to Concerned Authority',
  'Action Taken',
  'Resolved'
];

export const IssueStatusTimeline: React.FC<IssueStatusTimelineProps> = ({
  currentStatus,
  updates,
  authorityResponse
}) => {
  const isRejected = currentStatus === 'Rejected';
  const currentIndex = ORDERED_STEPS.indexOf(currentStatus as IssueStatus);

  const getStepIcon = (status: IssueStatus | string) => {
    switch (status) {
      case 'Submitted':
        return <Send className="w-4 h-4" />;
      case 'Under Review':
        return <Clock className="w-4 h-4" />;
      case 'Verified':
        return <FileCheck className="w-4 h-4" />;
      case 'Forwarded to Concerned Authority':
        return <Building2 className="w-4 h-4" />;
      case 'Action Taken':
        return <Wrench className="w-4 h-4" />;
      case 'Resolved':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Step Progress Bar */}
      {!isRejected ? (
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">
            Official Resolution Roadmap
          </div>
          <div className="relative flex items-center justify-between">
            {/* Background connecting bar */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-200 z-0"></div>
            {/* Active connecting bar */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-black z-0 transition-all duration-500"
              style={{
                width: `${Math.max(0, (currentIndex / (ORDERED_STEPS.length - 1)) * 100)}%`
              }}
            ></div>

            {ORDERED_STEPS.map((step, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              return (
                <div key={step} className="relative z-10 flex flex-col items-center group">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-black text-white ring-4 ring-black/20 shadow-lg scale-110'
                        : isPast
                        ? 'bg-black text-white'
                        : 'bg-white text-neutral-400 border-2 border-neutral-300'
                    }`}
                  >
                    {getStepIcon(step)}
                  </div>
                  <span
                    className={`text-[10px] text-center font-bold mt-2 max-w-[70px] leading-tight hidden sm:block ${
                      isCurrent ? 'text-black font-black' : isPast ? 'text-neutral-700' : 'text-neutral-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-neutral-100 border-l-4 border-black p-4 rounded-xl text-xs text-neutral-700">
          <strong className="block text-black font-bold mb-1">Status: Report Rejected / Withdrawn</strong>
          <span>This submission could not be verified by MBN ground scouts or violated community reporting terms.</span>
        </div>
      )}

      {/* Official Authority Response Card if available */}
      {authorityResponse && (
        <div className="bg-black text-white p-5 rounded-2xl border border-neutral-800 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-white" />
            <span className="text-xs font-black uppercase tracking-wider text-neutral-300">
              Official Authority Dispatch & Redressal
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-100 font-medium leading-relaxed">
            "{authorityResponse}"
          </p>
        </div>
      )}

      {/* Detailed Chronological Audit History */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-wider text-black border-b pb-2">
          Chronological Investigation Log ({updates.length} Verified Entries)
        </h4>

        <div className="space-y-3">
          {updates.map((upd, idx) => (
            <div
              key={upd.id}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-neutral-200 shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center text-black shrink-0 mt-0.5">
                {getStepIcon(upd.status)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-black uppercase tracking-wide">
                    {upd.status}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {new Date(upd.created_at).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <p className="text-xs text-neutral-700 leading-relaxed mb-1">
                  {upd.update_description}
                </p>

                <div className="text-[10px] text-neutral-500 font-semibold">
                  Logged by: <span className="text-black">{upd.updated_by}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
