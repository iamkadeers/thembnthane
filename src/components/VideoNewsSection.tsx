'use client';

import React, { useState } from 'react';
import { INITIAL_VIDEOS } from '@/lib/mockData';
import { Play, Eye, Clock, X } from 'lucide-react';
import { Icons } from './SocialIcons';

export const VideoNewsSection: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section className="mb-14 bg-black text-white rounded-3xl p-6 sm:p-8 border border-neutral-900 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-neutral-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl">
            <Icons.Youtube className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              MBN Prime Video • Field Investigations
            </h2>
            <p className="text-xs text-neutral-400">High-impact video documentaries and ground reality footage</p>
          </div>
        </div>

        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
        >
          <Icons.Youtube className="w-4 h-4" />
          <span>Subscribe on YouTube</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {INITIAL_VIDEOS.map((vid) => (
          <div
            key={vid.id}
            onClick={() => setActiveVideo(vid.title)}
            className="group cursor-pointer flex flex-col bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 hover:border-neutral-600 transition-all hover:-translate-y-1"
          >
            {/* Thumbnail with big play overlay */}
            <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
              <img
                src={vid.thumbnail}
                alt={vid.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-black ml-0.5" />
                </div>
              </div>

              <span className="absolute bottom-2 right-2 bg-black/80 font-mono text-[11px] font-bold px-2 py-0.5 rounded text-white">
                {vid.duration}
              </span>

              <span className="absolute top-2 left-2 bg-white text-black text-[10px] font-black uppercase px-2 py-0.5 rounded">
                {vid.category}
              </span>
            </div>

            {/* Video Meta */}
            <div className="p-4 flex flex-col justify-between flex-1">
              <h3 className="text-sm font-bold text-white group-hover:underline transition-colors line-clamp-2 leading-snug mb-3">
                {vid.title}
              </h3>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium pt-2 border-t border-neutral-800">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-neutral-500" />
                  {vid.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  {vid.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player (Preview) */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                <h4 className="text-sm font-bold text-white truncate max-w-md">{activeVideo}</h4>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-black flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mb-4">
                <Play className="w-8 h-8 fill-black ml-1" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">{activeVideo}</h3>
              <p className="text-xs text-neutral-400 max-w-md mb-4">
                MBN 4K Digital Broadcast Feed. Streaming through official high-bandwidth media server.
              </p>
              <button
                onClick={() => setActiveVideo(null)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold px-4 py-2 rounded-lg"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
