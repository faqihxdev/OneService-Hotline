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