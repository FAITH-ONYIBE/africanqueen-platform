'use client';
import { useKV } from './useKV';
import { mentorsSeed, type Mentor } from '@/lib/mock-data/mentors';

export function useMentors() {
  return useKV<Mentor[]>('mentors', mentorsSeed);
}
