import type { CongressMemberData, SponsoredBill } from '../types';

const BASE = 'https://api.congress.gov/v3';

interface CongressMemberRaw {
  bioguideId: string;
  name: string;
  partyName?: string;
  state?: string;
  district?: number;
  terms?: { item?: { chamber?: string; startYear?: number }[] };
  sponsoredLegislation?: { count: number };
  cosponsoredLegislation?: { count: number };
  url?: string;
}

interface SponsoredBillRaw {
  number?: string;
  title?: string;
  introducedDate?: string;
  latestAction?: { actionDate?: string; text?: string };
  url?: string;
}

function key(): string {
  return import.meta.env.VITE_CONGRESS_API_KEY ?? '';
}

function apiUrl(path: string, params: Record<string, string> = {}): string {
  const p = new URLSearchParams({ ...params, ...(key() ? { api_key: key() } : {}) });
  return `${BASE}${path}?${p.toString()}`;
}

export function extractBioguideId(congressGovUrl?: string): string | null {
  if (!congressGovUrl) return null;
  const parts = congressGovUrl.replace(/\/$/, '').split('/');
  const last = parts[parts.length - 1];
  // Bioguide IDs are 1 letter + 6 digits, e.g. G000574
  if (/^[A-Z]\d{6}$/.test(last)) return last;
  return null;
}

export async function fetchAZMembers(): Promise<CongressMemberData[]> {
  if (!key()) return [];
  try {
    const res = await fetch(apiUrl('/member', { state: 'AZ', limit: '50' }));
    if (!res.ok) return [];
    const data: { members: CongressMemberRaw[] } = await res.json();
    return data.members.map(m => ({
      bioguideId: m.bioguideId,
      sponsoredCount: m.sponsoredLegislation?.count,
      cosponsoredCount: m.cosponsoredLegislation?.count,
    }));
  } catch {
    return [];
  }
}

export async function fetchSponsoredBills(bioguideId: string): Promise<SponsoredBill[]> {
  if (!key() || !bioguideId) return [];
  try {
    const res = await fetch(apiUrl(`/member/${bioguideId}/sponsored-legislation`, { limit: '8' }));
    if (!res.ok) return [];
    const data: { sponsoredLegislation: SponsoredBillRaw[] } = await res.json();
    return data.sponsoredLegislation.map(b => ({
      number: b.number ?? '',
      title: b.title ?? 'Untitled',
      introducedDate: b.introducedDate ?? '',
      latestActionDate: b.latestAction?.actionDate,
      latestAction: b.latestAction?.text,
      url: b.url,
    }));
  } catch {
    return [];
  }
}
