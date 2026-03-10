const API = 'https://arizona-civics-api.gamerdad29.workers.dev';

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ── Types ───────────────────────────────────────────

export interface Representative {
  id: string;
  name: string;
  title: string;
  party: string | null;
  level: 'local' | 'state' | 'federal';
  district: string | null;
  elected: number | null;
  term_start: number | null;
  term_end: number | null;
  next_election: number | null;
  next_election_safe: number;
  is_user_district: number;
  bio: string | null;
  background: string[] | null;
  priorities: string[] | null;
  backers: string[] | null;
  photo_url: string | null;
  contacts: { label: string; value: string; href: string; icon: string }[];
  links: { label: string; href: string }[] | null;
  votes: { bill: string; vote: string; date: string; description: string }[] | null;
  congress_gov_url: string | null;
  fec_url: string | null;
  ballotpedia_url: string | null;
  bioguide_id: string | null;
}

export interface ElectionDeadline {
  id: number;
  label: string;
  sublabel: string | null;
  date_display: string;
  date_iso: string;
  urgent: number;
  level: string | null;
  type: string | null;
}

export interface Race {
  id: string;
  name: string;
  type: string;
  rating: string | null;
  context: string | null;
  level: string | null;
}

export interface Bill {
  id: string;
  number: string;
  title: string;
  summary: string | null;
  status: 'active' | 'passed' | 'failed' | 'pending';
  level: 'local' | 'state' | 'federal';
  impact: string | null;
  your_rep: string | null;
  tags: string[] | null;
  tracker_url: string | null;
}

export interface BudgetData {
  fiscalYear: string;
  total: string;
  segments: { label: string; percent: number; color: string; description: string | null }[];
}

export interface Issue {
  id: string;
  label: string;
  icon: string | null;
  subtitle: string | null;
  description: string | null;
  contacts: { official_id: string | null; name: string; title: string | null; reason: string | null; email_href: string | null }[];
}

export interface CongressMember {
  bioguideId: string;
  name: string;
  partyName: string;
  state: string;
  depiction?: { imageUrl: string };
}

// ── Fetchers ────────────────────────────────────────

export const fetchRepresentatives = (level?: string) =>
  apiFetch<Representative[]>(level ? `/api/representatives?level=${level}` : '/api/representatives');

export const fetchRepresentativeById = (id: string) =>
  apiFetch<Representative>(`/api/representatives?id=${id}`);

export const fetchElections = () =>
  apiFetch<{ deadlines: ElectionDeadline[]; races: Race[] }>('/api/elections');

export const fetchBills = (level?: string, status?: string) => {
  const params = new URLSearchParams();
  if (level && level !== 'all') params.set('level', level);
  if (status) params.set('status', status);
  const qs = params.toString();
  return apiFetch<Bill[]>(`/api/bills${qs ? `?${qs}` : ''}`);
};

export const fetchBudget = () => apiFetch<BudgetData>('/api/budget');

export const fetchIssues = (id?: string) =>
  apiFetch<Issue[]>(id ? `/api/issues?id=${id}` : '/api/issues');

export const fetchCivicByAddress = (address: string) =>
  apiFetch<unknown>(`/api/civic?address=${encodeURIComponent(address)}`);

export const fetchCongressMembers = () =>
  apiFetch<{ members: CongressMember[] }>('/api/congress');

export const fetchSponsoredBills = (bioguideId: string) =>
  apiFetch<unknown>(`/api/congress?bioguideId=${bioguideId}`);

export const searchAll = (q: string) =>
  apiFetch<{ representatives: Representative[]; bills: Bill[]; issues: Issue[] }>(`/api/search?q=${encodeURIComponent(q)}`);
