'use client';
import { useKV } from './useKV';
import { opportunitiesSeed, type Opportunity } from '@/lib/mock-data/opportunities';

/** Opportunity list shared by the public pages and the admin editor (stored locally for the demo). */
export function useOpportunities() {
  return useKV<Opportunity[]>('opportunities', opportunitiesSeed);
}
