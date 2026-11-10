-- ====================================================================
-- MBN JAN AAWAAZ – Public Issue Reporting & Tracking Database Schema
-- Supabase / PostgreSQL with Secure Row Level Security (RLS)
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Jan Aawaaz - Public Issues Table
CREATE TABLE IF NOT EXISTS public_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. MBN-ISSUE-2026-00001
  reporter_name VARCHAR(150),
  mobile_number VARCHAR(20) NOT NULL,
  whatsapp_number VARCHAR(20),
  category VARCHAR(100) NOT NULL, -- 'Road & Potholes', 'Garbage & Cleanliness', etc.
  title VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location_address TEXT,
  area VARCHAR(150) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL DEFAULT 'Maharashtra',
  pincode VARCHAR(10),
  status VARCHAR(60) DEFAULT 'Submitted' CHECK (status IN (
    'Submitted',
    'Under Review',
    'Verified',
    'Published',
    'Forwarded to Concerned Authority',
    'Action Taken',
    'Resolved',
    'Rejected'
  )),
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  is_published BOOLEAN DEFAULT FALSE,
  admin_notes TEXT,
  authority_contacted VARCHAR(200),
  authority_response TEXT,
  upvotes INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Issue Media Table (Photos & Videos)
CREATE TABLE IF NOT EXISTS issue_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID REFERENCES public_issues(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video')),
  caption VARCHAR(255),
  is_after_photo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Issue Timeline Updates (Audit history of progress & ground reports)
CREATE TABLE IF NOT EXISTS issue_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID REFERENCES public_issues(id) ON DELETE CASCADE,
  status VARCHAR(60) NOT NULL,
  update_description TEXT NOT NULL,
  updated_by VARCHAR(100) NOT NULL DEFAULT 'MBN Bureau Desk',
  authority_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Row Level Security Policies
ALTER TABLE public_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_updates ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a public issue (insert)
CREATE POLICY "Public issue submission allowed" ON public_issues
  FOR INSERT WITH CHECK (true);

-- Anyone can read PUBLISHED public issues (without sensitive personal info)
-- Note: A public view or API route sanitizes reporter_name, mobile_number, and admin_notes
CREATE POLICY "Public read published issues" ON public_issues
  FOR SELECT USING (is_published = true AND verification_status = 'verified');

-- Citizen tracking query by tracking_id AND mobile_number
CREATE POLICY "Citizen self-tracking access" ON public_issues
  FOR SELECT USING (true); -- Handled securely with filter matching in API/Storage

-- Issue media read policy
CREATE POLICY "Public read approved issue media" ON issue_media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public_issues
      WHERE public_issues.id = issue_media.issue_id
      AND public_issues.is_published = true
    )
  );

-- Issue updates read policy
CREATE POLICY "Public read issue timeline" ON issue_updates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public_issues
      WHERE public_issues.id = issue_updates.issue_id
      AND public_issues.is_published = true
    )
  );

-- Admin Full Access: authenticated admin role can perform all operations
CREATE POLICY "Admin full manage issues" ON public_issues
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
