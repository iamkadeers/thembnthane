export interface Category {
  id: string;
  slug: string;
  name: string;
  name_hi?: string;
  name_mr?: string;
  description?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  title_hi?: string;
  title_mr?: string;
  summary: string;
  summary_hi?: string;
  summary_mr?: string;
  content: string;
  content_hi?: string;
  content_mr?: string;
  featured_image: string;
  image_caption?: string;
  supporting_images?: string[];
  video_url?: string;
  category_slug: string;
  category_name?: string;
  author_name: string;
  member_id?: string;
  location: string;
  city?: string;
  area?: string;
  source_evidence?: string;
  is_breaking?: boolean;
  is_featured?: boolean;
  is_trending?: boolean;
  trending_rank?: number;
  views_count: number;
  seo_title?: string;
  seo_description?: string;
  keywords?: string[];
  published_at: string;
  created_at: string;
}

export type NewsSubmissionStatus =
  | 'Draft'
  | 'Pending Approval'
  | 'Approved'
  | 'Rejected'
  | 'Request Info'
  | 'Published';

export interface AICorrectionData {
  corrected_headline: string;
  corrected_summary: string;
  corrected_content: string;
  headline_hi: string;
  summary_hi: string;
  content_hi: string;
  headline_mr: string;
  summary_mr: string;
  content_mr: string;
  suggested_category: string;
  seo_title: string;
  seo_description: string;
  keywords: string[];
  social_captions: {
    twitter: string;
    whatsapp: string;
    facebook: string;
  };
  editorial_notes: string[];
  fact_check_flags: string[];
  grammar_improvements: string[];
  processed_at: string;
  quality_score?: number;
  polished_headline?: string;
  polished_content?: string;
  translations?: {
    en: { headline: string; content: string; summary: string };
    hi: { headline: string; content: string; summary: string };
    mr: { headline: string; content: string; summary: string };
  };
}

export interface NewsSubmission {
  id: string;
  submission_code: string; // e.g. MBN-SUB-2026-0001
  submission_id?: string; // alias
  member_id: string; // e.g. MBN-2026-00001
  reporter_name: string;
  mobile_number: string;
  reporter_phone?: string; // alias
  headline: string;
  category: string;
  content: string;
  city: string;
  area: string;
  latitude?: number;
  longitude?: number;
  news_date_time: string;
  main_image: string;
  main_image_url?: string; // alias
  supporting_images: string[];
  video_url?: string;
  source_evidence: string;
  source_reference?: string; // alias
  status: NewsSubmissionStatus;
  admin_feedback?: string;
  rejection_reason?: string; // alias
  published_article_id?: string;
  scheduled_at?: string;
  ai_processed: boolean;
  ai_data?: AICorrectionData;
  created_at: string;
  updated_at: string;
}

export type IssueCategory =
  | 'Road & Potholes'
  | 'Garbage & Cleanliness'
  | 'Water Supply'
  | 'Street Lights'
  | 'Drainage & Sewage'
  | 'Electricity'
  | 'Traffic & Parking'
  | 'Public Transport'
  | 'Government Hospital'
  | 'School & Education'
  | 'Public Safety'
  | 'Corruption'
  | 'Illegal Construction'
  | 'Other Issues';

export type IssueStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Verified'
  | 'Published'
  | 'Forwarded to Concerned Authority'
  | 'Action Taken'
  | 'Resolved'
  | 'Rejected';

export interface IssueUpdate {
  id: string;
  issue_id: string;
  status: IssueStatus;
  update_description: string;
  updated_by: string;
  authority_response?: string;
  created_at: string;
}

export interface IssueMediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  caption?: string;
  is_after_photo?: boolean;
}

export interface PublicIssue {
  id: string;
  tracking_id?: string;
  issue_code?: string;
  title: string;
  category: IssueCategory | string;
  description: string;
  latitude?: number;
  longitude?: number;
  location_address?: string;
  location_area?: string;
  area?: string;
  city: string;
  state: string;
  pincode?: string;
  reporter_name?: string;
  mobile_number: string;
  reporter_phone?: string;
  reporter_member_id?: string;
  whatsapp_number?: string;
  media_urls: string[];
  media_items?: IssueMediaItem[];
  video_url?: string;
  status: IssueStatus | string;
  verification_status?: 'pending' | 'verified' | 'rejected' | string;
  is_published: boolean;
  admin_notes?: string;
  authority_contacted?: string;
  authority_response?: string;
  mbn_action_update?: string;
  ground_report?: {
    reporter_name: string;
    video_url?: string;
    before_photo_url?: string;
    after_photo_url?: string;
    interview_summary?: string;
    notes?: string;
  };
  updates?: IssueUpdate[];
  upvotes: number;
  created_at: string;
  updated_at?: string;
}

export interface SquadMember {
  id: string;
  member_id: string;
  full_name: string;
  mobile_number: string;
  whatsapp_number: string;
  email?: string;
  age: number;
  gender?: string;
  city: string;
  area_locality: string;
  state: string;
  profession: string;
  interests: string[];
  role_interest?: string;
  reason_to_join: string;
  profile_photo_url?: string;
  verification_doc_url?: string;
  terms_agreed: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  created_at: string;
}
