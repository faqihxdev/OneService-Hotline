export interface RealtimeEvent {
  time: string;
  source: 'client' | 'server';
  count?: number;
  event: { [key: string]: any };
}

export interface Complaint {
  id: string;
  name: string;
  complaint: string;
  location: string;
  timestamp: string;
  status: 'pending' | 'resolved';
  audio_url?: string;
}

export interface Case {
  id: string;
  name: string;
  contact: string;
  status: 'pending' | 'resolved';
  category: 'Facilities in HDB estates' | 'Roads & Footpaths' | 'Smoking' | 'Construction Sites' | 'Others';
  description: string;
  postal_code: number;
  location: string;
  case_datetime: string;
  audio_url?: string;
}
