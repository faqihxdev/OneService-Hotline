// Cases Jotai Store
import { Case } from '../types';
import { atomWithStorage } from 'jotai/utils';
import { atom } from 'jotai';

// Base atom for cases storage
export const casesAtom = atomWithStorage<Case[]>("cases", []);

// Derived atom for adding cases
export const addCaseAtom = atom(
  null,
  (get, set, data: Partial<Case>) => {
    const cases = get(casesAtom);
    const newCase: Case = {
      name: '',
      description: '',
      location: '',
      case_datetime: new Date().toISOString(),
      status: 'pending',
      audio_url: '',
      category: 'Others',
      postal_code: 0,
      ...data,
      id: crypto.randomUUID(),
    };

    console.log('newCase', newCase);

    set(casesAtom, [...cases, newCase]);
  }
);

// Derived atom for removing cases
export const removeCaseAtom = atom(
  null,
  (get, set, id: string) => {
    const cases = get(casesAtom);
    set(casesAtom, cases.filter(case_ => case_.id !== id));
  }
); 