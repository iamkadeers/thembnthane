-- ====================================================================
-- MBN - Modern Indian Digital News Platform Database Schema (PostgreSQL / Supabase)
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. News Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  name_hi VARCHAR(100),
  name_mr VARCHAR(100),
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. News Articles Table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  title_hi VARCHAR(500),
  title_mr VARCHAR(500),
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT NOT NULL,
  image_caption VARCHAR(255),
  video_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category_slug VARCHAR(50) NOT NULL,
  author_name VARCHAR(100) DEFAULT 'MBN Bureau',
  location VARCHAR(100) DEFAULT 'New Delhi / Mumbai',
  is_breaking BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  trending_rank INT,
  views_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Ground Reality / Public Issues Table
CREATE TABLE IF NOT EXISTS public_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_code VARCHAR(30) UNIQUE NOT NULL,
  title VARCHAR(300) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'Roads', 'Water', 'Garbage', 'Electricity', 'Public Safety', 'Traffic'
  description TEXT NOT NULL,
  location_area VARCHAR(150) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL DEFAULT 'Maharashtra',
  pincode VARCHAR(10),
  media_urls TEXT[] DEFAULT '{}',
  reporter_name VARCHAR(100) NOT NULL,
  reporter_phone VARCHAR(20) NOT NULL,
  reporter_member_id VARCHAR(30),
  status VARCHAR(30) DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'verified', 'mbn_investigating', 'resolved')),
  admin_notes TEXT,
  mbn_action_update TEXT,
  upvotes INT DEFAULT 1,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. MBN Squad Members Table
CREATE TABLE IF NOT EXISTS squad_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id VARCHAR(30) UNIQUE NOT NULL, -- e.g. MBN-2026-00001
  full_name VARCHAR(150) NOT NULL,
  mobile_number VARCHAR(20) UNIQUE NOT NULL,
  whatsapp_number VARCHAR(20) NOT NULL,
  email VARCHAR(150),
  age INT NOT NULL,
  gender VARCHAR(20),
  city VARCHAR(100) NOT NULL,
  area_locality VARCHAR(150) NOT NULL,
  state VARCHAR(100) NOT NULL DEFAULT 'Maharashtra',
  profession VARCHAR(100) NOT NULL,
  interests TEXT[] NOT NULL DEFAULT '{}', -- e.g. ['Ground Reporting', 'Photography']
  reason_to_join TEXT NOT NULL,
  profile_photo_url TEXT,
  verification_doc_url TEXT,
  terms_agreed BOOLEAN DEFAULT TRUE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(150) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Admin Settings & Announcements
CREATE TABLE IF NOT EXISTS platform_announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  badge VARCHAR(50) DEFAULT 'NOTICE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Row Level Security Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE squad_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anonymous users can read published articles & categories
CREATE POLICY "Public articles read access" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public categories read access" ON categories
  FOR SELECT USING (true);

-- Anyone can submit public issue
CREATE POLICY "Allow public issue insertion" ON public_issues
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public issue read" ON public_issues
  FOR SELECT USING (is_published = true);

-- Anyone can register for MBN Squad
CREATE POLICY "Allow squad registration" ON squad_members
  FOR INSERT WITH CHECK (true);

-- Only approved squad members can be seen or member queries own
CREATE POLICY "Squad member self or approved read" ON squad_members
  FOR SELECT USING (status = 'approved');
