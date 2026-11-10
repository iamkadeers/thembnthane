import { PublicIssue } from '@/types';

export const JAN_AAWAAZ_CATEGORIES = [
  'Road & Potholes',
  'Garbage & Cleanliness',
  'Water Supply',
  'Street Lights',
  'Drainage & Sewage',
  'Electricity',
  'Traffic & Parking',
  'Public Transport',
  'Government Hospital',
  'School & Education',
  'Public Safety',
  'Corruption',
  'Illegal Construction',
  'Other Issues'
] as const;

export const INITIAL_JAN_AAWAAZ_ISSUES: PublicIssue[] = [
  {
    id: 'iss-jan-1',
    tracking_id: 'MBN-ISSUE-2026-00001',
    title: 'Massive 3-foot crater pothole causing fatal bike skids on arterial flyover junction',
    category: 'Road & Potholes',
    description: 'During monsoon asphalt washaway, an entire 4-meter road section caved in. Over 15 commuters suffered fractures this week. Ward engineers have only placed wooden branches instead of concrete barricades.',
    latitude: 19.0760,
    longitude: 72.8777,
    location_address: 'Opposite Railway Flyover, Sion-Bandra Link Road',
    area: 'Sion East, Ward F/N',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400022',
    reporter_name: 'Aditya S. Kulkarni',
    mobile_number: '9820112345',
    whatsapp_number: '9820112345',
    media_urls: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Action Taken',
    verification_status: 'verified',
    is_published: true,
    authority_contacted: 'BMC Chief Engineer (Roads & Traffic)',
    authority_response: 'BMC dispatched emergency cold-mix mastic asphalt repair crew within 12 hours of MBN ground reporting.',
    ground_report: {
      reporter_name: 'Vikramaditya Shinde (MBN Central)',
      before_photo_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      after_photo_url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
      interview_summary: 'Spoke with local traffic constable and injured delivery worker. Road contractor fined ₹1.5 Lakhs.',
      notes: 'Mastic re-layering completed under police supervision at midnight.'
    },
    updates: [
      {
        id: 'upd-1',
        issue_id: 'iss-jan-1',
        status: 'Submitted',
        update_description: 'Citizen report logged with geolocation coordinates (19.0760° N, 72.8777° E).',
        updated_by: 'MBN System',
        created_at: '2026-11-06T10:15:00Z'
      },
      {
        id: 'upd-2',
        issue_id: 'iss-jan-1',
        status: 'Verified',
        update_description: 'MBN Ground Squad visited spot. Photographic evidence and hospital records verified.',
        updated_by: 'MBN Verification Desk',
        created_at: '2026-11-06T14:30:00Z'
      },
      {
        id: 'upd-3',
        issue_id: 'iss-jan-1',
        status: 'Forwarded to Concerned Authority',
        update_description: 'Formal inspection notice and footage served to BMC Ward F/North Executive Engineer.',
        updated_by: 'MBN Legal & Civic Bureau',
        created_at: '2026-11-07T09:00:00Z'
      },
      {
        id: 'upd-4',
        issue_id: 'iss-jan-1',
        status: 'Action Taken',
        update_description: 'Road repair completed with cold mix. CCTV surveillance installed to prevent overloaded trucks.',
        updated_by: 'MBN Ground Bureau',
        authority_response: 'Repair completed and certified by junior road inspector.',
        created_at: '2026-11-08T18:00:00Z'
      }
    ],
    upvotes: 624,
    created_at: '2026-11-06T10:15:00Z',
    updated_at: '2026-11-08T18:00:00Z'
  },
  {
    id: 'iss-jan-2',
    tracking_id: 'MBN-ISSUE-2026-00002',
    title: 'Untreated industrial sewage overflowing into public drinking reservoir supply',
    category: 'Water Supply',
    description: 'Black frothing chemical effluent leaking from nearby small-scale electroplating units into the open distribution canal. Over 800 families experiencing contaminated muddy water at taps.',
    latitude: 18.5204,
    longitude: 73.8567,
    location_address: 'Near Indrayani river bridge, Chakan MIDC link',
    area: 'Chakan Industrial Zone',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '410501',
    reporter_name: 'Sunita Gaikwad',
    mobile_number: '9833455432',
    whatsapp_number: '9833455432',
    media_urls: [
      'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Forwarded to Concerned Authority',
    verification_status: 'verified',
    is_published: true,
    authority_contacted: 'Maharashtra Pollution Control Board (MPCB) Pune Regional Officer',
    authority_response: 'MPCB inspection squad collected water sample for laboratory chemical analysis.',
    updates: [
      {
        id: 'upd-21',
        issue_id: 'iss-jan-2',
        status: 'Submitted',
        update_description: 'Report filed by resident association with tap water photos.',
        updated_by: 'MBN System',
        created_at: '2026-11-07T08:00:00Z'
      },
      {
        id: 'upd-22',
        issue_id: 'iss-jan-2',
        status: 'Verified',
        update_description: 'MBN Pune Bureau verified chemical stench and collected citizen affidavits.',
        updated_by: 'MBN Verification Desk',
        created_at: '2026-11-07T12:00:00Z'
      },
      {
        id: 'upd-23',
        issue_id: 'iss-jan-2',
        status: 'Forwarded to Concerned Authority',
        update_description: 'Direct notice issued to MPCB and Pune District Health Officer.',
        updated_by: 'MBN Civic Desk',
        created_at: '2026-11-08T11:00:00Z'
      }
    ],
    upvotes: 489,
    created_at: '2026-11-07T08:00:00Z',
    updated_at: '2026-11-08T11:00:00Z'
  },
  {
    id: 'iss-jan-3',
    tracking_id: 'MBN-ISSUE-2026-00003',
    title: 'Unauthorized 2-acre biomedical waste mountain burning open near government school',
    category: 'Garbage & Cleanliness',
    description: 'Used syringes, discarded PPE sets and expired medicine packaging dumped illegally behind the playground and set on fire every evening. Toxic fumes causing respiratory distress among 450 school children.',
    latitude: 19.2183,
    longitude: 72.9781,
    location_address: 'Behind Municipal High School, Ghodbunder Link',
    area: 'Majiwada',
    city: 'Thane',
    state: 'Maharashtra',
    pincode: '400601',
    reporter_name: 'Dinesh Patil',
    mobile_number: '9765432109',
    media_urls: [
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Resolved',
    verification_status: 'verified',
    is_published: true,
    authority_contacted: 'Thane Municipal Corporation (TMC) Solid Waste Department',
    authority_response: 'TMC deployed 6 compactors, cleared all biomedical waste, sealed the plot and filed police FIR against commercial clinic owner.',
    ground_report: {
      reporter_name: 'Sneha Tambe (MBN Squad Lead)',
      before_photo_url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
      after_photo_url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
      interview_summary: 'School principal expressed relief after TMC erected 10-foot boundary fence and warning notice boards.'
    },
    updates: [
      {
        id: 'upd-31',
        issue_id: 'iss-jan-3',
        status: 'Submitted',
        update_description: 'Citizen report filed with evening smoke photos.',
        updated_by: 'MBN System',
        created_at: '2026-11-04T16:00:00Z'
      },
      {
        id: 'upd-32',
        issue_id: 'iss-jan-3',
        status: 'Verified',
        update_description: 'MBN investigative broadcast carried on prime 8 PM bulletin.',
        updated_by: 'MBN Broadcast Desk',
        created_at: '2026-11-04T20:00:00Z'
      },
      {
        id: 'upd-33',
        issue_id: 'iss-jan-3',
        status: 'Action Taken',
        update_description: 'TMC anti-dumping squad seized 2 private commercial trucks.',
        updated_by: 'TMC Bureau',
        created_at: '2026-11-05T10:00:00Z'
      },
      {
        id: 'upd-34',
        issue_id: 'iss-jan-3',
        status: 'Resolved',
        update_description: 'Ground cleared, sanitised with bleaching powder and perimeter fenced.',
        updated_by: 'MBN Verification Desk',
        created_at: '2026-11-06T15:00:00Z'
      }
    ],
    upvotes: 752,
    created_at: '2026-11-04T16:00:00Z',
    updated_at: '2026-11-06T15:00:00Z'
  },
  {
    id: 'iss-jan-4',
    tracking_id: 'MBN-ISSUE-2026-00004',
    title: '14 consecutive non-functioning high-mast lights on women worker transit route',
    category: 'Street Lights',
    description: 'The 1.2-km stretch from railway station to industrial garments cluster has zero street illumination for past 90 days. Women commuters face constant harassment and phone snatching attempts.',
    latitude: 19.1663,
    longitude: 72.8526,
    location_address: 'Station Link Road, between Gate 2 and Bus Depot',
    area: 'Kandivali East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400101',
    reporter_name: 'Pooja Sawant',
    mobile_number: '9819987654',
    media_urls: [
      'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Verified',
    verification_status: 'verified',
    is_published: true,
    authority_contacted: 'Adani Electricity & BMC Lighting Department',
    updates: [
      {
        id: 'upd-41',
        issue_id: 'iss-jan-4',
        status: 'Submitted',
        update_description: 'Night footage of pitch dark stretch submitted by commuter.',
        updated_by: 'MBN System',
        created_at: '2026-11-08T22:30:00Z'
      },
      {
        id: 'upd-42',
        issue_id: 'iss-jan-4',
        status: 'Verified',
        update_description: 'Light lux audit conducted by MBN safety team. Reading 0.2 lux (near total dark).',
        updated_by: 'MBN Verification Desk',
        created_at: '2026-11-09T08:00:00Z'
      }
    ],
    upvotes: 318,
    created_at: '2026-11-08T22:30:00Z',
    updated_at: '2026-11-09T08:00:00Z'
  }
];
