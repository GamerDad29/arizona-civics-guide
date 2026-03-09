export type BillStatus = 'active' | 'passed' | 'failed' | 'pending';
export type BillLevel = 'federal' | 'state' | 'local';
export type BillTag = 'housing' | 'education' | 'healthcare' | 'transportation' | 'environment' | 'economy' | 'public-safety' | 'water' | 'immigration';

export interface Bill {
  id: string;
  number: string;
  title: string;
  status: BillStatus;
  level: BillLevel;
  tags: BillTag[];
  summary: string;
  impact?: string;
  yourRep?: string;
  trackerUrl?: string;
  sponsorUrl?: string;
}

export const bills: Bill[] = [
  {
    id: 'hb2234',
    number: 'HB 2234',
    title: 'Property Tax Relief Act',
    status: 'active',
    level: 'state',
    tags: ['housing', 'economy'],
    summary: 'State House Bill to cap property tax increases at 5% annually.',
    impact: 'Currently in committee.',
    yourRep: 'Contact State Legislature (awaiting district ID)',
    trackerUrl: 'https://www.azleg.gov/',
  },
  {
    id: 'sb1445',
    number: 'SB 1445',
    title: 'Water Conservation Mandate',
    status: 'active',
    level: 'state',
    tags: ['water', 'environment'],
    summary: 'Requires cities to reduce water usage by 15% by 2028. Impacts Mesa directly.',
    yourRep: 'Contact State Legislature',
    trackerUrl: 'https://www.azleg.gov/',
  },
  {
    id: 'ord5782',
    number: 'Ordinance 5782',
    title: 'Mesa Housing Density Near Light Rail',
    status: 'passed',
    level: 'local',
    tags: ['housing', 'transportation'],
    summary: 'Allows increased density near light rail stations. Passed 5-2.',
    impact: 'Somers voted YES. Enables higher-density housing near Valley Metro stops.',
    trackerUrl: 'https://www.mesaaz.gov/Government/City-Clerk/Introduced-Ordinances',
  },
];
