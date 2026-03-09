export type Party = 'D' | 'R' | 'I';
export type Level = 'federal' | 'state' | 'local';

export interface ContactMethod {
  label: string;
  value: string;
  href: string;
  icon: 'phone' | 'email' | 'twitter' | 'facebook' | 'web';
}

export interface VoteRecord {
  bill: string;
  vote: 'yes' | 'no' | 'abstain';
  date: string;
  description: string;
}

export interface Official {
  id: string;
  name: string;
  title: string;
  party?: Party;
  level: Level;
  elected?: number;
  termStart?: number;
  termEnd?: number;
  nextElection?: number;
  nextElectionSafe?: boolean; // true = not up for election soon
  bio?: string;
  background?: string[];
  priorities?: string[];
  backers?: string[];
  contacts: ContactMethod[];
  links?: { label: string; href: string }[];
  votes?: VoteRecord[];
  congressGovUrl?: string;
  fecUrl?: string;
  ballotpediaUrl?: string;
  isUserDistrict?: boolean;
}

// ── U.S. SENATORS ────────────────────────────────────────────────────
export const senators: Official[] = [
  {
    id: 'gallego',
    name: 'Ruben Gallego',
    title: 'U.S. Senator from Arizona',
    party: 'D',
    level: 'federal',
    elected: 2024,
    termStart: 2025,
    termEnd: 2031,
    nextElection: 2030,
    nextElectionSafe: true,
    bio: 'Former U.S. Representative (AZ-03, 2015-2024). Marine Corps veteran. Defeated Kari Lake in 2024.',
    backers: ['Progressive Caucus', 'Labor Unions'],
    contacts: [
      { label: 'Phoenix Office', value: '(602) XXX-XXXX', href: 'tel:602-xxx-xxxx', icon: 'phone' },
      { label: 'DC Office', value: '(202) 224-XXXX', href: 'tel:202-224-xxxx', icon: 'phone' },
      { label: 'Twitter/X', value: '@SenatorGallego', href: 'https://twitter.com/SenatorGallego', icon: 'twitter' },
      { label: 'Facebook', value: 'SenatorGallego', href: 'https://facebook.com/SenatorGallego', icon: 'facebook' },
      { label: 'Email', value: 'senator_gallego@gallego.senate.gov', href: 'mailto:senator_gallego@gallego.senate.gov', icon: 'email' },
    ],
    congressGovUrl: 'https://www.congress.gov/member/ruben-gallego/G000574',
    fecUrl: 'https://www.fec.gov/data/candidate/S4AZ00355/',
    ballotpediaUrl: 'https://ballotpedia.org/Ruben_Gallego',
  },
  {
    id: 'kelly',
    name: 'Mark Kelly',
    title: 'U.S. Senator from Arizona',
    party: 'D',
    level: 'federal',
    elected: 2020,
    termStart: 2023,
    termEnd: 2029,
    nextElection: 2028,
    nextElectionSafe: false,
    bio: 'Former NASA astronaut and U.S. Navy pilot. Husband of former Rep. Gabrielle Giffords.',
    backers: ['Moderate Democrats', 'Gun Safety Advocates'],
    contacts: [
      { label: 'Phoenix Office', value: '(602) 671-7901', href: 'tel:602-671-7901', icon: 'phone' },
      { label: 'DC Office', value: '(202) 224-2235', href: 'tel:202-224-2235', icon: 'phone' },
      { label: 'Twitter/X', value: '@SenMarkKelly', href: 'https://twitter.com/SenMarkKelly', icon: 'twitter' },
      { label: 'Facebook', value: 'SenMarkKelly', href: 'https://facebook.com/SenMarkKelly', icon: 'facebook' },
      { label: 'Email', value: 'senator_kelly@kelly.senate.gov', href: 'mailto:senator_kelly@kelly.senate.gov', icon: 'email' },
    ],
    congressGovUrl: 'https://www.congress.gov/member/mark-kelly/K000377',
    fecUrl: 'https://www.fec.gov/data/candidate/S0AZ00327/',
    ballotpediaUrl: 'https://ballotpedia.org/Mark_Kelly_(Arizona)',
  },
];

// ── U.S. HOUSE REPRESENTATIVES ────────────────────────────────────────
export const houseReps: Official[] = [
  {
    id: 'stanton',
    name: 'Greg Stanton',
    title: 'U.S. Representative, District 4',
    party: 'D',
    level: 'federal',
    elected: 2019,
    nextElection: 2026,
    nextElectionSafe: false,
    bio: 'Former Mayor of Phoenix (2012-2018). District includes central Phoenix, Tempe, and parts of Mesa.',
    contacts: [
      { label: 'Email', value: 'greg.stanton@mail.house.gov', href: 'mailto:greg.stanton@mail.house.gov', icon: 'email' },
    ],
    congressGovUrl: 'https://www.congress.gov/member/greg-stanton/S001211',
    fecUrl: 'https://www.fec.gov/data/candidate/H8AZ09148/',
    ballotpediaUrl: 'https://ballotpedia.org/Greg_Stanton',
  },
  {
    id: 'biggs',
    name: 'Andy Biggs',
    title: 'U.S. Representative, District 5',
    party: 'R',
    level: 'federal',
    elected: 2017,
    nextElection: 2026,
    nextElectionSafe: false,
    bio: 'Former Arizona State Senator. Member of House Freedom Caucus. District includes parts of Mesa, Gilbert, Queen Creek.',
    backers: ['MAGA Movement', 'Turning Point USA', 'House Freedom Caucus'],
    contacts: [
      { label: 'Gilbert Office', value: '(480) 699-8239', href: 'tel:480-699-8239', icon: 'phone' },
      { label: 'DC Office', value: '(202) 225-2635', href: 'tel:202-225-2635', icon: 'phone' },
      { label: 'Twitter/X', value: '@RepAndyBiggsAZ', href: 'https://twitter.com/RepAndyBiggsAZ', icon: 'twitter' },
      { label: 'Facebook', value: 'RepAndyBiggsAZ', href: 'https://facebook.com/RepAndyBiggsAZ', icon: 'facebook' },
      { label: 'Email', value: 'andy.biggs@mail.house.gov', href: 'mailto:andy.biggs@mail.house.gov', icon: 'email' },
    ],
    congressGovUrl: 'https://www.congress.gov/member/andy-biggs/B001302',
    fecUrl: 'https://www.fec.gov/data/candidate/H6AZ05155/',
    ballotpediaUrl: 'https://ballotpedia.org/Andy_Biggs',
  },
];

// ── GOVERNOR ────────────────────────────────────────────────────────────
export const governor: Official = {
  id: 'hobbs',
  name: 'Katie Hobbs',
  title: 'Governor of Arizona',
  party: 'D',
  level: 'state',
  elected: 2022,
  termStart: 2023,
  termEnd: 2027,
  nextElection: 2026,
  nextElectionSafe: false,
  bio: 'Former Arizona Secretary of State (2019-2023) and State Senator. First Democratic governor since Janet Napolitano.',
  contacts: [
    { label: 'Email', value: 'azgovernor@az.gov', href: 'mailto:azgovernor@az.gov', icon: 'email' },
  ],
  links: [
    { label: 'Governor Office', href: 'https://azgovernor.gov/' },
    { label: 'Secretary of State', href: 'https://azsos.gov/' },
    { label: 'Campaign Finance', href: 'https://apps.azsos.gov/election/cfs/' },
  ],
  ballotpediaUrl: 'https://ballotpedia.org/Katie_Hobbs',
};

// ── OTHER STATEWIDE OFFICIALS ────────────────────────────────────────
export const statewideOfficials: Official[] = [
  {
    id: 'mayes',
    name: 'Kris Mayes',
    title: 'Arizona Attorney General',
    party: 'D',
    level: 'state',
    nextElection: 2026,
    contacts: [
      { label: 'Email', value: 'ag@azag.gov', href: 'mailto:ag@azag.gov', icon: 'email' },
    ],
    ballotpediaUrl: 'https://ballotpedia.org/Kris_Mayes',
  },
  {
    id: 'fontes',
    name: 'Adrian Fontes',
    title: 'Arizona Secretary of State',
    party: 'D',
    level: 'state',
    nextElection: 2026,
    contacts: [
      { label: 'Email', value: 'sosadmin@azsos.gov', href: 'mailto:sosadmin@azsos.gov', icon: 'email' },
    ],
    ballotpediaUrl: 'https://ballotpedia.org/Adrian_Fontes',
  },
];

// ── MARICOPA COUNTY SHERIFF ────────────────────────────────────────
export const sheriff: Official = {
  id: 'skinner',
  name: 'Russ Skinner',
  title: 'Maricopa County Sheriff',
  party: 'R',
  level: 'state',
  elected: 2024,
  termStart: 2025,
  termEnd: 2028,
  nextElection: 2028,
  nextElectionSafe: true,
  bio: 'Former Pinal County Sheriff. Defeated Democrat Tyler Kamp in 2024. First term as Maricopa County Sheriff.',
  background: [
    'One of the largest sheriff offices in the nation',
    'Responsible for county jail system',
    'Law enforcement in unincorporated areas',
    'Court security and civil process service',
  ],
  contacts: [
    { label: 'Email', value: 'sheriff@mcso.maricopa.gov', href: 'mailto:sheriff@mcso.maricopa.gov', icon: 'email' },
  ],
  links: [
    { label: 'MCSO Website', href: 'https://www.mcso.org/' },
    { label: 'Campaign Finance', href: 'https://apps.azsos.gov/election/cfs/' },
  ],
  ballotpediaUrl: 'https://ballotpedia.org/Russ_Skinner',
};

// ── MESA MAYOR ────────────────────────────────────────────────────────
export const mayor: Official = {
  id: 'freeman',
  name: 'Mark Freeman',
  title: '41st Mayor of Mesa, Arizona',
  party: 'R',
  level: 'local',
  elected: 2024,
  termStart: 2025,
  termEnd: 2029,
  nextElection: 2028,
  nextElectionSafe: true,
  bio: 'Lifelong Mesa resident, former firefighter.',
  background: [
    'Retired Captain Paramedic, Mesa Fire & Medical (31 years)',
    'Mesa City Councilmember, District 1 (2017-2024)',
    'Vice Mayor (2019-2021)',
    'Fourth-generation Mesa resident',
  ],
  priorities: [
    'Public safety and crime prevention',
    'Economic growth and fiscal responsibility',
    'Preserving Mesa heritage',
    'Mesa College Promise initiative',
  ],
  contacts: [
    { label: 'Email', value: 'mayor.freeman@mesaaz.gov', href: 'mailto:mayor.freeman@mesaaz.gov', icon: 'email' },
  ],
  links: [
    { label: 'Official Page', href: 'https://www.mesaaz.gov/Government/Mayor-City-Council/Mayor-Mark-Freeman' },
    { label: 'Council Meetings', href: 'https://www.mesaaz.gov/Government/City-Council-Meetings' },
  ],
  ballotpediaUrl: 'https://ballotpedia.org/Mark_Freeman_(Arizona)',
};

// ── MESA CITY COUNCIL ────────────────────────────────────────────────
export const cityCouncil: Official[] = [
  {
    id: 'adams',
    name: 'Rich Adams',
    title: 'Mesa City Councilmember',
    level: 'local',
    elected: 2024,
    nextElection: 2028,
    nextElectionSafe: true,
    contacts: [
      { label: 'Email', value: 'rich.adams@mesaaz.gov', href: 'mailto:rich.adams@mesaaz.gov', icon: 'email' },
    ],
    background: ['District 1'],
  },
  {
    id: 'taylor',
    name: 'Dorean Taylor',
    title: 'Mesa City Councilmember',
    level: 'local',
    nextElection: 2026,
    nextElectionSafe: false,
    contacts: [
      { label: 'Email', value: 'dorean.taylor@mesaaz.gov', href: 'mailto:dorean.taylor@mesaaz.gov', icon: 'email' },
    ],
    background: ['District 2'],
  },
  {
    id: 'heredia',
    name: 'Francisco Heredia',
    title: 'Mesa City Councilmember',
    level: 'local',
    elected: 2024,
    nextElection: 2028,
    nextElectionSafe: true,
    contacts: [
      { label: 'Email', value: 'francisco.heredia@mesaaz.gov', href: 'mailto:francisco.heredia@mesaaz.gov', icon: 'email' },
    ],
    background: ['District 3'],
  },
  {
    id: 'duff',
    name: 'Jenn Duff',
    title: 'Mesa City Councilmember',
    level: 'local',
    nextElection: 2026,
    nextElectionSafe: false,
    contacts: [
      { label: 'Email', value: 'jenn.duff@mesaaz.gov', href: 'mailto:jenn.duff@mesaaz.gov', icon: 'email' },
    ],
    background: ['District 4'],
  },
  {
    id: 'goforth',
    name: 'Alicia Goforth',
    title: 'Mesa City Councilmember',
    level: 'local',
    nextElection: 2028,
    nextElectionSafe: true,
    contacts: [
      { label: 'Email', value: 'alicia.goforth@mesaaz.gov', href: 'mailto:alicia.goforth@mesaaz.gov', icon: 'email' },
    ],
    background: ['District 5'],
  },
  {
    id: 'somers',
    name: 'Scott Somers',
    title: 'Mesa City Councilmember (Vice Mayor)',
    level: 'local',
    nextElection: 2026,
    nextElectionSafe: false,
    isUserDistrict: true,
    contacts: [
      { label: 'Email', value: 'scott.somers@mesaaz.gov', href: 'mailto:scott.somers@mesaaz.gov', icon: 'email' },
    ],
    links: [
      { label: 'Official Page', href: 'https://www.mesaaz.gov/Government/Mayor-City-Council/Vice-Mayor-Scott-Somers' },
    ],
    background: ['District 6 — YOUR REPRESENTATIVE'],
    votes: [
      { bill: 'Budget Amendment for Public Safety', vote: 'yes', date: 'Dec 18, 2025', description: 'Approved additional $2.4M for Mesa PD equipment' },
      { bill: 'Downtown Mesa Revitalization Zone', vote: 'yes', date: 'Dec 4, 2025', description: 'Created tax incentive zone for downtown development' },
      { bill: 'Short-Term Rental Restrictions', vote: 'no', date: 'Nov 20, 2025', description: 'Voted against expanded STR permit requirements' },
      { bill: 'Water Infrastructure Bond', vote: 'yes', date: 'Nov 6, 2025', description: 'Supported $18M bond for water system upgrades' },
    ],
    ballotpediaUrl: 'https://ballotpedia.org/Mesa_City_Council,_Arizona',
  },
];

// ── SCHOOL BOARD ────────────────────────────────────────────────────
export const schoolBoard: Official[] = [
  {
    id: 'tavolacci',
    name: 'Elaine Tavolacci',
    title: 'Mesa School Board — President',
    level: 'local',
    nextElection: 2026,
    contacts: [
      { label: 'Email', value: 'elaine.tavolacci@mpsaz.org', href: 'mailto:elaine.tavolacci@mpsaz.org', icon: 'email' },
    ],
  },
  {
    id: 'thomason',
    name: 'Adam Thomason',
    title: 'Mesa School Board — Vice President',
    level: 'local',
    nextElection: 2028,
    contacts: [],
  },
  {
    id: 'ketchmark',
    name: 'Andrea Ketchmark',
    title: 'Mesa School Board Member',
    level: 'local',
    nextElection: 2028,
    contacts: [],
  },
  {
    id: 'perry',
    name: 'Leslie Ann Perry',
    title: 'Mesa School Board Member',
    level: 'local',
    nextElection: 2026,
    contacts: [],
  },
  {
    id: 'williams',
    name: 'Stephanie Williams',
    title: 'Mesa School Board Member',
    level: 'local',
    nextElection: 2026,
    contacts: [],
  },
];
