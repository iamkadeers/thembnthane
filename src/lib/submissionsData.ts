import { NewsSubmission } from '@/types';
import { aiNewsroomEngine } from './aiNewsroomEngine';

const SUBMISSION_1_AI = aiNewsroomEngine.processNewsSubmission({
  headline: 'Chembur highway pedestrian bridge lifts stalled for 8 months senior citizens struggling',
  content: 'The newly constructed foot overbridge on Eastern Express Highway near Chembur station was opened without connecting power to the elevators. Senior citizens and persons with physical disabilities are forced to climb 64 steep steps or risk their lives crossing the 8-lane expressway beneath speeding trucks. MMRDA contractor left work incomplete citing meter connection disputes.',
  category: 'Mumbai',
  city: 'Mumbai',
  area: 'Chembur East, EEH Junction',
  reporter_name: 'Sneha Tambe',
  source_evidence: 'Direct photos, interviews with 4 senior citizens, MMRDA project board dated March 2025'
});

export const INITIAL_NEWS_SUBMISSIONS: NewsSubmission[] = [
  {
    id: 'sub-1',
    submission_code: 'MBN-SUB-2026-0001',
    member_id: 'MBN-2026-00045',
    reporter_name: 'Sneha Tambe',
    mobile_number: '+919833455432',
    headline: 'Chembur highway pedestrian bridge lifts stalled for 8 months senior citizens struggling',
    category: 'Mumbai',
    content: 'The newly constructed foot overbridge on Eastern Express Highway near Chembur station was opened without connecting power to the elevators. Senior citizens and persons with physical disabilities are forced to climb 64 steep steps or risk their lives crossing the 8-lane expressway beneath speeding trucks. MMRDA contractor left work incomplete citing meter connection disputes.',
    city: 'Mumbai',
    area: 'Chembur East, EEH Junction',
    latitude: 19.0626,
    longitude: 72.8997,
    news_date_time: '2026-11-09T14:30:00Z',
    main_image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    supporting_images: [
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80'
    ],
    video_url: 'https://youtube.com',
    source_evidence: 'Direct photos, interviews with 4 senior citizens, MMRDA project board dated March 2025',
    status: 'Pending Approval',
    ai_processed: true,
    ai_data: SUBMISSION_1_AI,
    created_at: '2026-11-09T14:35:00Z',
    updated_at: '2026-11-09T14:36:00Z'
  },
  {
    id: 'sub-2',
    submission_code: 'MBN-SUB-2026-0002',
    member_id: 'MBN-2026-00001',
    reporter_name: 'Mahesh Jadhav',
    mobile_number: '+919820112345',
    headline: 'Thane Zilla Parishad school roof repaired after community crowdfunding drive',
    category: 'Education',
    content: 'Following persistent delays in state public works department sanctions, parents, local shopkeepers and youth volunteers gathered funds to fix the leaking ceiling slabs of 3 classrooms before semester exams.',
    city: 'Thane',
    area: 'Bhiwandi Taluka',
    latitude: 19.2969,
    longitude: 73.0631,
    news_date_time: '2026-11-08T11:00:00Z',
    main_image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    supporting_images: [],
    source_evidence: 'School headmaster statement, local village trust receipts',
    status: 'Approved',
    ai_processed: true,
    ai_data: aiNewsroomEngine.processNewsSubmission({
      headline: 'Thane Zilla Parishad school roof repaired after community crowdfunding drive',
      content: 'Following persistent delays in state public works department sanctions, parents, local shopkeepers and youth volunteers gathered funds to fix the leaking ceiling slabs of 3 classrooms before semester exams.',
      category: 'Education',
      city: 'Thane',
      area: 'Bhiwandi Taluka',
      reporter_name: 'Mahesh Jadhav',
      source_evidence: 'School headmaster statement, local village trust receipts'
    }),
    created_at: '2026-11-08T11:15:00Z',
    updated_at: '2026-11-08T12:00:00Z'
  }
];
