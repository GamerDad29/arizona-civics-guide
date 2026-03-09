import type { ContactMethod, VoteRecord } from '../data/officials';

export type DataSource = 'static' | 'civic-api' | 'hybrid';
export type NavView = 'local' | 'state' | 'federal' | 'elections' | 'budget' | 'bills' | 'issues' | 'official-profile';

export interface SponsoredBill {
  number: string;
  title: string;
  introducedDate: string;
  latestActionDate?: string;
  latestAction?: string;
  url?: string;
}

export interface CongressMemberData {
  bioguideId: string;
  sponsoredCount?: number;
  cosponsoredCount?: number;
  sponsoredBills?: SponsoredBill[];
}

export interface CivicOfficial {
  id: string;
  name: string;
  title: string;
  office?: string;
  party?: 'D' | 'R' | 'I' | 'NP';
  level: 'local' | 'state' | 'federal';
  sublevel?: 'city' | 'county' | 'state' | 'country';

  elected?: number;
  termStart?: number;
  termEnd?: number;
  nextElection?: number;
  nextElectionSafe?: boolean;
  isUserDistrict?: boolean;

  bio?: string;
  background?: string[];
  priorities?: string[];
  backers?: string[];
  photoUrl?: string;

  votes?: VoteRecord[];
  contacts: ContactMethod[];
  links?: { label: string; href: string }[];

  congressGovUrl?: string;
  fecUrl?: string;
  ballotpediaUrl?: string;
  bioguideId?: string;
  congressData?: CongressMemberData;

  dataSource: DataSource;
  civicApiChannels?: { type: string; id: string }[];
}
