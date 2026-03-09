import type { CivicOfficial } from '../types';
import type { ContactMethod } from '../data/officials';
import {
  senators, houseReps, governor, statewideOfficials, sheriff, mayor, cityCouncil, schoolBoard,
} from '../data/officials';

const CIVIC_API_BASE = 'https://www.googleapis.com/civicinfo/v2/representatives';

// ── Google Civic API response shapes ────────────────────
interface GoogleCivicAddress { line1?: string; city?: string; state?: string; zip?: string; }
interface GoogleCivicChannel { type: string; id: string; }
interface GoogleCivicOfficial {
  name: string;
  address?: GoogleCivicAddress[];
  party?: string;
  phones?: string[];
  urls?: string[];
  emails?: string[];
  photoUrl?: string;
  channels?: GoogleCivicChannel[];
}
interface GoogleCivicOffice {
  name: string;
  divisionId: string;
  levels?: string[];
  roles?: string[];
  officialIndices: number[];
}
interface GoogleCivicResponse {
  normalizedInput?: { line1?: string; city?: string; state?: string; zip?: string };
  offices: GoogleCivicOffice[];
  officials: GoogleCivicOfficial[];
}

// ── Party normalization ─────────────────────────────────
export function normalizeCivicParty(apiParty?: string): 'D' | 'R' | 'I' | 'NP' {
  if (!apiParty) return 'NP';
  const p = apiParty.toLowerCase();
  if (p.includes('democrat')) return 'D';
  if (p.includes('republican')) return 'R';
  if (p.includes('nonpartisan') || p.includes('no party') || p === '') return 'NP';
  return 'I';
}

// ── Level mapping ───────────────────────────────────────
export function mapCivicLevel(levels?: string[]): 'federal' | 'state' | 'local' {
  if (!levels || levels.length === 0) return 'local';
  if (levels.includes('country')) return 'federal';
  if (levels.includes('administrativeArea1')) return 'state';
  return 'local'; // administrativeArea2 (county) + locality both map to local
}

// ── Photo URL safety ─────────────────────────────────────
function safePhotoUrl(url?: string): string | undefined {
  if (!url) return undefined;
  return url.replace(/^http:\/\//, 'https://');
}

// ── Static to unified mapper ─────────────────────────────
function staticToUnified(
  source: (typeof senators)[number],
  level: 'federal' | 'state' | 'local',
): CivicOfficial {
  return {
    id: source.id,
    name: source.name,
    title: source.title,
    party: source.party,
    level,
    elected: source.elected,
    termStart: source.termStart,
    termEnd: source.termEnd,
    nextElection: source.nextElection,
    nextElectionSafe: source.nextElectionSafe,
    isUserDistrict: source.isUserDistrict,
    bio: source.bio,
    background: source.background,
    priorities: source.priorities,
    backers: source.backers,
    votes: source.votes,
    contacts: source.contacts,
    links: source.links,
    congressGovUrl: source.congressGovUrl,
    fecUrl: source.fecUrl,
    ballotpediaUrl: source.ballotpediaUrl,
    dataSource: 'static',
  };
}

// ── Build unified list from static data ─────────────────
export function buildStaticOfficials(): CivicOfficial[] {
  return [
    ...senators.map(o => staticToUnified(o, 'federal')),
    ...houseReps.map(o => staticToUnified(o, 'federal')),
    staticToUnified(governor, 'state'),
    ...statewideOfficials.map(o => staticToUnified(o, 'state')),
    staticToUnified(sheriff, 'state'),
    staticToUnified(mayor, 'local'),
    ...cityCouncil.map(o => staticToUnified(o, 'local')),
    ...schoolBoard.map(o => staticToUnified(o, 'local')),
  ];
}

// ── Merge Civic API official with static ─────────────────
function mergeOrCreate(
  apiOfficial: GoogleCivicOfficial,
  office: GoogleCivicOffice,
  staticOfficials: CivicOfficial[],
  idxInApiList: number,
): CivicOfficial {
  const level = mapCivicLevel(office.levels);
  const photoUrl = safePhotoUrl(apiOfficial.photoUrl);

  // Try to match by name
  const match = staticOfficials.find(s =>
    s.name.toLowerCase().includes(apiOfficial.name.toLowerCase().split(' ').slice(-1)[0]) ||
    apiOfficial.name.toLowerCase().includes(s.name.toLowerCase().split(' ').slice(-1)[0])
  );

  const contacts: ContactMethod[] = [];
  if (apiOfficial.emails?.[0]) contacts.push({ label: 'Email', value: apiOfficial.emails[0], href: `mailto:${apiOfficial.emails[0]}`, icon: 'email' });
  if (apiOfficial.phones?.[0]) contacts.push({ label: 'Office', value: apiOfficial.phones[0], href: `tel:${apiOfficial.phones[0]}`, icon: 'phone' });
  if (apiOfficial.urls?.[0]) contacts.push({ label: 'Website', value: 'Official Site', href: apiOfficial.urls[0], icon: 'web' });
  const twChannel = apiOfficial.channels?.find(c => c.type === 'Twitter');
  if (twChannel) contacts.push({ label: 'Twitter/X', value: `@${twChannel.id}`, href: `https://x.com/${twChannel.id}`, icon: 'twitter' });

  if (match) {
    return {
      ...match,
      photoUrl: photoUrl ?? match.photoUrl,
      contacts: contacts.length > 0 ? contacts : match.contacts,
      civicApiChannels: apiOfficial.channels ?? [],
      dataSource: 'hybrid',
    };
  }

  // No static match — create from API data
  return {
    id: `civic-${idxInApiList}`,
    name: apiOfficial.name,
    title: office.name,
    office: office.name,
    party: normalizeCivicParty(apiOfficial.party),
    level,
    photoUrl,
    contacts,
    civicApiChannels: apiOfficial.channels ?? [],
    dataSource: 'civic-api',
  };
}

// ── Main API call ────────────────────────────────────────
export async function fetchCivicOfficials(
  address: string,
): Promise<{ officials: CivicOfficial[]; normalizedAddress: string }> {
  const key = import.meta.env.VITE_GOOGLE_CIVIC_API_KEY;

  if (!key) {
    // No API key — return static data with notice
    return { officials: buildStaticOfficials(), normalizedAddress: address };
  }

  const url = `${CIVIC_API_BASE}?address=${encodeURIComponent(address)}&includeOffices=true&key=${key}`;
  const res = await fetch(url);

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(err?.error?.message ?? `Civic API error ${res.status}`);
  }

  const data: GoogleCivicResponse = await res.json();

  // Build officialIndex → office reverse map
  const indexToOffice = new Map<number, GoogleCivicOffice>();
  data.offices.forEach(office => {
    office.officialIndices.forEach(idx => indexToOffice.set(idx, office));
  });

  const staticAll = buildStaticOfficials();
  const merged: CivicOfficial[] = data.officials.map((apiOff, idx) => {
    const office = indexToOffice.get(idx);
    if (!office) return null;
    return mergeOrCreate(apiOff, office, staticAll, idx);
  }).filter(Boolean) as CivicOfficial[];

  // Filter out President/VP — not locally actionable
  const filtered = merged.filter(o =>
    !o.title?.toLowerCase().includes('president of the united states') &&
    !o.title?.toLowerCase().includes('vice president')
  );

  const norm = data.normalizedInput;
  const normalizedAddress = norm
    ? [norm.line1, norm.city, norm.state, norm.zip].filter(Boolean).join(', ')
    : address;

  return { officials: filtered, normalizedAddress };
}
