import { Article, PublicIssue, SquadMember, IssueStatus, NewsSubmission, NewsSubmissionStatus } from '@/types';
import { INITIAL_ARTICLES, INITIAL_MEMBERS } from './mockData';
import { INITIAL_JAN_AAWAAZ_ISSUES } from './janAawaazData';
import { INITIAL_NEWS_SUBMISSIONS } from './submissionsData';
import { aiNewsroomEngine } from './aiNewsroomEngine';

// Storage keys
const ARTICLES_KEY = 'mbn_articles_data';
const ISSUES_KEY = 'mbn_jan_aawaaz_issues_v2';
const SQUAD_KEY = 'mbn_squad_data';
const SUBMISSIONS_KEY = 'mbn_news_submissions_v1';
const SUBSCRIBERS_KEY = 'mbn_subscribers_data';

const isClient = typeof window !== 'undefined';

export const storage = {
  getArticles: (): Article[] => {
    if (!isClient) return INITIAL_ARTICLES;
    try {
      const data = localStorage.getItem(ARTICLES_KEY);
      if (!data) {
        localStorage.setItem(ARTICLES_KEY, JSON.stringify(INITIAL_ARTICLES));
        return INITIAL_ARTICLES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ARTICLES;
    }
  },

  saveArticle: (article: Article): Article => {
    if (!isClient) return article;
    const articles = storage.getArticles();
    const index = articles.findIndex((a) => a.id === article.id);
    let updated: Article[];
    if (index >= 0) {
      updated = [...articles];
      updated[index] = { ...article };
    } else {
      updated = [article, ...articles];
    }
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(updated));
    return article;
  },

  deleteArticle: (id: string): void => {
    if (!isClient) return;
    const articles = storage.getArticles().filter((a) => a.id !== id);
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
  },

  // JAN AAWAAZ: Public Issues
  getIssues: (): PublicIssue[] => {
    if (!isClient) return INITIAL_JAN_AAWAAZ_ISSUES;
    try {
      const data = localStorage.getItem(ISSUES_KEY);
      if (!data) {
        localStorage.setItem(ISSUES_KEY, JSON.stringify(INITIAL_JAN_AAWAAZ_ISSUES));
        return INITIAL_JAN_AAWAAZ_ISSUES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_JAN_AAWAAZ_ISSUES;
    }
  },

  getPublishedIssues: (): PublicIssue[] => {
    return storage.getIssues().filter((i) => i.is_published && i.verification_status === 'verified');
  },

  getIssueByTrackingId: (trackingId: string, mobileNumber?: string): PublicIssue | null => {
    const issues = storage.getIssues();
    const cleanId = trackingId.trim().toUpperCase();
    const found = issues.find((i) => (i.tracking_id || i.issue_code || '').toUpperCase() === cleanId);
    if (!found) return null;

    if (mobileNumber) {
      const cleanPhone = mobileNumber.replace(/\D/g, '');
      const itemPhone = found.mobile_number.replace(/\D/g, '');
      if (itemPhone.endsWith(cleanPhone) || cleanPhone.endsWith(itemPhone)) {
        return found;
      }
      return null;
    }
    return found;
  },

  saveIssue: (issue: PublicIssue): PublicIssue => {
    if (!isClient) return issue;
    const issues = storage.getIssues();
    const index = issues.findIndex((i) => i.id === issue.id || i.tracking_id === issue.tracking_id);
    let updated: PublicIssue[];
    if (index >= 0) {
      updated = [...issues];
      updated[index] = { ...issue, updated_at: new Date().toISOString() };
    } else {
      updated = [issue, ...issues];
    }
    localStorage.setItem(ISSUES_KEY, JSON.stringify(updated));
    return issue;
  },

  updateIssueStatus: (
    issueId: string,
    newStatus: IssueStatus,
    updateDescription: string,
    updatedBy: string = 'MBN Admin Desk',
    authorityResponse?: string
  ): PublicIssue | null => {
    if (!isClient) return null;
    const issues = storage.getIssues();
    const index = issues.findIndex((i) => i.id === issueId || i.tracking_id === issueId);
    if (index >= 0) {
      const current = issues[index];
      const newUpdate = {
        id: `upd-${Date.now()}`,
        issue_id: current.id,
        status: newStatus,
        update_description: updateDescription,
        updated_by: updatedBy,
        authority_response: authorityResponse,
        created_at: new Date().toISOString()
      };

      const updatedIssue: PublicIssue = {
        ...current,
        status: newStatus,
        verification_status: newStatus === 'Rejected' ? 'rejected' : 'verified',
        is_published: newStatus !== 'Rejected' && newStatus !== 'Submitted',
        authority_response: authorityResponse || current.authority_response,
        updates: [newUpdate, ...(current.updates || [])],
        updated_at: new Date().toISOString()
      };

      issues[index] = updatedIssue;
      localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
      return updatedIssue;
    }
    return null;
  },

  deleteIssue: (id: string): void => {
    if (!isClient) return;
    const issues = storage.getIssues().filter((i) => i.id !== id && i.tracking_id !== id);
    localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
  },

  upvoteIssue: (id: string): number => {
    if (!isClient) return 0;
    const issues = storage.getIssues();
    const index = issues.findIndex((i) => i.id === id);
    if (index >= 0) {
      issues[index].upvotes = (issues[index].upvotes || 0) + 1;
      localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
      return issues[index].upvotes;
    }
    return 0;
  },

  // MBN AI NEWSROOM: Submissions & Approvals
  getSubmissions: (): NewsSubmission[] => {
    if (!isClient) return INITIAL_NEWS_SUBMISSIONS;
    try {
      const data = localStorage.getItem(SUBMISSIONS_KEY);
      if (!data) {
        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(INITIAL_NEWS_SUBMISSIONS));
        return INITIAL_NEWS_SUBMISSIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_NEWS_SUBMISSIONS;
    }
  },

  getSubmissionsByMember: (memberId: string): NewsSubmission[] => {
    return storage.getSubmissions().filter((s) => s.member_id === memberId);
  },

  saveSubmission: (submission: NewsSubmission): NewsSubmission => {
    if (!isClient) return submission;
    const list = storage.getSubmissions();
    const index = list.findIndex((s) => s.id === submission.id || s.submission_code === submission.submission_code);
    let updated: NewsSubmission[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = { ...submission, updated_at: new Date().toISOString() };
    } else {
      updated = [submission, ...list];
    }
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));
    return submission;
  },

  submitNewsWithAI: (submission: Partial<NewsSubmission> & { headline: string; content: string; member_id: string }): NewsSubmission => {
    // Automatically trigger AI correction engine on submission
    const aiData = aiNewsroomEngine.processNewsSubmission({
      headline: submission.headline,
      content: submission.content,
      category: submission.category || 'Ground Reports',
      city: submission.city || 'Mumbai',
      area: submission.area || 'City Center',
      reporter_name: submission.reporter_name || 'Squad Member',
      source_evidence: submission.source_evidence || submission.source_reference || ''
    });

    const code = `MBN-SUB-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const fullSubmission: NewsSubmission = {
      id: submission.id || `sub-${Date.now()}`,
      submission_code: submission.submission_code || code,
      submission_id: submission.submission_id || code,
      member_id: submission.member_id,
      reporter_name: submission.reporter_name || 'Squad Member',
      mobile_number: submission.mobile_number || submission.reporter_phone || '',
      reporter_phone: submission.reporter_phone || submission.mobile_number,
      headline: submission.headline,
      category: submission.category || 'Ground Reports',
      content: submission.content,
      city: submission.city || 'Mumbai',
      area: submission.area || 'City Center',
      latitude: submission.latitude,
      longitude: submission.longitude,
      news_date_time: submission.news_date_time || new Date().toISOString(),
      main_image: submission.main_image || submission.main_image_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
      main_image_url: submission.main_image_url || submission.main_image,
      supporting_images: submission.supporting_images || [],
      video_url: submission.video_url,
      source_evidence: submission.source_evidence || submission.source_reference || '',
      source_reference: submission.source_reference || submission.source_evidence,
      status: submission.status || 'Pending Approval',
      ai_processed: true,
      ai_data: aiData,
      created_at: submission.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return storage.saveSubmission(fullSubmission);
  },

  updateSubmissionStatus: (
    submissionId: string,
    status: NewsSubmissionStatus,
    adminFeedback?: string,
    scheduledAt?: string
  ): NewsSubmission | null => {
    if (!isClient) return null;
    const list = storage.getSubmissions();
    const index = list.findIndex((s) => s.id === submissionId || s.submission_code === submissionId);
    if (index >= 0) {
      list[index].status = status;
      if (adminFeedback !== undefined) list[index].admin_feedback = adminFeedback;
      if (scheduledAt !== undefined) list[index].scheduled_at = scheduledAt;
      list[index].updated_at = new Date().toISOString();
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(list));
      return list[index];
    }
    return null;
  },

  publishSubmissionToArticle: (submissionOrId: NewsSubmission | string, chosenLang: 'en' | 'hi' | 'mr' = 'en'): Article => {
    let submission: NewsSubmission | undefined;
    if (typeof submissionOrId === 'string') {
      submission = storage.getSubmissions().find(s => s.id === submissionOrId || s.submission_code === submissionOrId);
    } else {
      submission = submissionOrId;
    }
    if (!submission) {
      throw new Error('Submission not found');
    }
    const ai = submission.ai_data;
    const slug = (ai?.corrected_headline || submission.headline)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    const publishedArticle: Article = {
      id: `art-sub-${Date.now()}`,
      slug: slug || `mbn-news-${Date.now()}`,
      title: ai?.corrected_headline || submission.headline,
      title_hi: ai?.headline_hi,
      title_mr: ai?.headline_mr,
      summary: ai?.corrected_summary || submission.content.slice(0, 150),
      summary_hi: ai?.summary_hi,
      summary_mr: ai?.summary_mr,
      content: ai?.corrected_content || `<p>${submission.content}</p>`,
      content_hi: ai?.content_hi,
      content_mr: ai?.content_mr,
      featured_image: submission.main_image || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
      supporting_images: submission.supporting_images,
      video_url: submission.video_url,
      category_slug: (submission.category || 'india').toLowerCase().replace(/\s+/g, '-'),
      category_name: submission.category,
      author_name: submission.reporter_name,
      member_id: submission.member_id,
      location: `${submission.area}, ${submission.city}`,
      city: submission.city,
      area: submission.area,
      source_evidence: submission.source_evidence,
      seo_title: ai?.seo_title,
      seo_description: ai?.seo_description,
      keywords: ai?.keywords,
      views_count: 1,
      is_breaking: false,
      is_featured: false,
      is_trending: false,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    storage.saveArticle(publishedArticle);
    storage.updateSubmissionStatus(submission.id, 'Published');
    return publishedArticle;
  },

  // SQUAD MEMBERS
  getSquadMembers: (): SquadMember[] => {
    if (!isClient) return INITIAL_MEMBERS;
    try {
      const data = localStorage.getItem(SQUAD_KEY);
      if (!data) {
        localStorage.setItem(SQUAD_KEY, JSON.stringify(INITIAL_MEMBERS));
        return INITIAL_MEMBERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MEMBERS;
    }
  },

  saveSquadMember: (member: SquadMember): SquadMember => {
    if (!isClient) return member;
    const members = storage.getSquadMembers();
    const index = members.findIndex((m) => m.id === member.id || m.mobile_number === member.mobile_number);
    let updated: SquadMember[];
    if (index >= 0) {
      updated = [...members];
      updated[index] = { ...member };
    } else {
      updated = [member, ...members];
    }
    localStorage.setItem(SQUAD_KEY, JSON.stringify(updated));
    return member;
  },

  updateMemberStatus: (memberId: string, status: SquadMember['status']): SquadMember | null => {
    if (!isClient) return null;
    const members = storage.getSquadMembers();
    const index = members.findIndex((m) => m.id === memberId || m.member_id === memberId);
    if (index >= 0) {
      members[index].status = status;
      localStorage.setItem(SQUAD_KEY, JSON.stringify(members));
      return members[index];
    }
    return null;
  },

  subscribeNewsletter: (email: string): boolean => {
    if (!isClient) return true;
    try {
      const list = JSON.parse(localStorage.getItem(SUBSCRIBERS_KEY) || '[]');
      if (!list.includes(email)) {
        list.push(email);
        localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(list));
      }
      return true;
    } catch {
      return false;
    }
  }
};
