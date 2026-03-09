export interface ElectionDeadline {
  label: string;
  sublabel: string;
  date: string;
  dateISO: string; // for countdown calculation
  urgent?: boolean;
}

export interface Race {
  id: string;
  name: string;
  type: string;
  rating: string;
  context: string;
  incumbentId?: string;
}

export const electionDeadlines: ElectionDeadline[] = [
  {
    label: 'Candidate Filing Opens',
    sublabel: 'State & Federal offices',
    date: 'April 2026',
    dateISO: '2026-04-01',
  },
  {
    label: 'Voter Registration Deadline',
    sublabel: 'Primary Election',
    date: 'July 6, 2026',
    dateISO: '2026-07-06',
    urgent: true,
  },
  {
    label: 'Primary Election',
    sublabel: 'State, Federal, Mesa City Council',
    date: 'August 4, 2026',
    dateISO: '2026-08-04',
    urgent: true,
  },
  {
    label: 'Voter Registration Deadline',
    sublabel: 'General Election',
    date: 'October 5, 2026',
    dateISO: '2026-10-05',
    urgent: true,
  },
  {
    label: 'General Election Day',
    sublabel: 'ALL races decided',
    date: 'November 3, 2026',
    dateISO: '2026-11-03',
    urgent: true,
  },
];

export const races2026: Race[] = [
  {
    id: 'governor',
    name: 'Arizona Governor',
    type: 'state',
    rating: 'Toss-Up / Lean Democratic',
    context: 'Hobbs won by narrow margin in 2022 (0.6%). Highly competitive expected.',
    incumbentId: 'hobbs',
  },
  {
    id: 'council-d6',
    name: 'Mesa City Council — District 6',
    type: 'local',
    rating: 'Likely Competitive',
    context: 'Your district! Scott Somers is eligible for re-election. Filing opens early 2026.',
    incumbentId: 'somers',
  },
  {
    id: 'house-cd4',
    name: 'U.S. House — Congressional District 4',
    type: 'federal',
    rating: 'Lean Democratic',
    context: 'Greg Stanton seeking re-election. District leans Democratic.',
    incumbentId: 'stanton',
  },
  {
    id: 'house-cd5',
    name: 'U.S. House — Congressional District 5',
    type: 'federal',
    rating: 'Safe Republican',
    context: 'Andy Biggs in conservative-leaning district.',
    incumbentId: 'biggs',
  },
  {
    id: 'state-legislature',
    name: 'All Arizona State Legislature Seats',
    type: 'state',
    rating: 'Mixed',
    context: 'All 90 seats (30 Senate + 60 House) on ballot. Current: 16R/14D Senate, 33R/27D House.',
  },
];
