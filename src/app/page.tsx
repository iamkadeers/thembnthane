'use client';

import React, { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Article } from '@/types';
import { HeroNewsSection } from '@/components/HeroNewsSection';
import { TrendingNews } from '@/components/TrendingNews';
import { LatestNewsGrid } from '@/components/LatestNewsGrid';
import { GroundRealitySection } from '@/components/GroundRealitySection';
import { MBNSquadCampaign } from '@/components/MBNSquadCampaign';
import { VideoNewsSection } from '@/components/VideoNewsSection';
import { NewsletterSection } from '@/components/NewsletterSection';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    setArticles(storage.getArticles());
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Hero News Section (Lead story on left, 4 trending on right) */}
      <HeroNewsSection articles={articles} />

      {/* 2. Numbered Trending News Horizontal Showcase */}
      <TrendingNews articles={articles} />

      {/* 3. Ground Reality & Civic Issues Section */}
      <GroundRealitySection />

      {/* 4. Latest News Grid with Category Tabs & Load More */}
      <LatestNewsGrid articles={articles} />

      {/* 5. MBN Squad Campaign Showcase */}
      <MBNSquadCampaign />

      {/* 6. Video News & YouTube Style Player */}
      <VideoNewsSection />

      {/* 7. Newsletter Subscription Box */}
      <NewsletterSection />
    </div>
  );
}
