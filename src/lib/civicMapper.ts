import type { CivicOfficial, Representative } from './api';

export type MappedRep = {
  source: 'civic' | 'd1';
  name: string;
  title: string;
  party: string | null;
  level: 'local' | 'state' | 'federal';
  photoUrl: string | null;
  phones: string[];
  emails: string[];
  urls: string[];
  channels: { type: string; id: string }[];
  d1Data: Representative | null;
};

function inferLevel(official: CivicOfficial): 'local' | 'state' | 'federal' {
  const levels = official.office.levels;
  if (levels.includes('country')) return 'federal';
  if (levels.includes('administrativeArea1')) return 'state';
  if (levels.includes('administrativeArea2')) return 'state'; // county-level → state zone
  return 'local';
}

function mapOfficial(official: CivicOfficial): MappedRep {
  const d1 = official.d1Match as Representative | null;
  const level = d1 ? d1.level : inferLevel(official);

  return {
    source: d1 ? 'd1' : 'civic',
    name: d1?.name || official.name,
    title: d1?.title || official.office.name,
    party: d1?.party || official.party || null,
    level,
    photoUrl: d1?.photo_url || official.photoUrl || null,
    phones: official.phones,
    emails: official.emails,
    urls: official.urls,
    channels: official.channels,
    d1Data: d1,
  };
}

export function mapOfficials(officials: CivicOfficial[]): {
  local: MappedRep[];
  state: MappedRep[];
  federal: MappedRep[];
  all: MappedRep[];
} {
  const mapped = officials.map(mapOfficial);
  return {
    local: mapped.filter(r => r.level === 'local'),
    state: mapped.filter(r => r.level === 'state'),
    federal: mapped.filter(r => r.level === 'federal'),
    all: mapped,
  };
}
