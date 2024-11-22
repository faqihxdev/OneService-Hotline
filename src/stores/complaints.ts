// Complaints Jotai Store
import { Complaint } from '../types';
import { atomWithStorage } from 'jotai/utils';
import { atom } from 'jotai';

// Base atom for complaints storage
export const complaintsAtom = atomWithStorage<Complaint[]>("complaints", []);

// Derived atom for adding complaints
export const addComplaintAtom = atom(
  null,
  (get, set, data: Partial<Complaint>) => {
    const complaints = get(complaintsAtom);
    const newComplaint: Complaint = {
      name: '',
      complaint: '',
      location: '',
      timestamp: new Date().toISOString(),
      status: 'pending',
      audio_url: '',
      ...data,
      id: crypto.randomUUID(),
    };

    console.log('newComplaint', newComplaint);

    set(complaintsAtom, [...complaints, newComplaint]);
  }
);

// Derived atom for removing complaints
export const removeComplaintAtom = atom(
  null,
  (get, set, id: string) => {
    const complaints = get(complaintsAtom);
    set(complaintsAtom, complaints.filter(complaint => complaint.id !== id));
  }
);
