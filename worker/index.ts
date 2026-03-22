/**
 * Arizona Civics API Worker
 * Serves data from D1 + proxies Google Civic & Congress.gov APIs
 * Deployed to Cloudflare Workers, bound to D1 database "arizona-civics"
 */

interface Env {
  DB: D1Database;
  GOOGLE_CIVIC_API_KEY: string;
  CONGRESS_API_KEY: string;
  OPENSTATES_API_KEY: string;
  FEC_API_KEY: string;
  ALLOWED_ORIGIN: string; // e.g. "https://arizona-civics-guide.pages.dev"
}

type Ctx = ExecutionContext;

const CORS_HEADERS = {
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

function cors(origin: string, env: Env): Record<string, string> {
  const allowed = env.ALLOWED_ORIGIN || '*';
  const allowOrigin = allowed === '*' ? '*'
    : origin && (allowed.split(',').some(a => origin.startsWith(a.trim()))) ? origin
    : '';
  return { ...CORS_HEADERS, 'Access-Control-Allow-Origin': allowOrigin };
}

function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

// ── Route handlers ──────────────────────────────────────

async function getRepresentatives(env: Env, url: URL, corsH: Record<string, string>): Promise<Response> {
  const level = url.searchParams.get('level');
  const id = url.searchParams.get('id');

  if (id) {
    const row = await env.DB.prepare('SELECT * FROM representatives WHERE id = ?').bind(id).first();
    if (!row) return json({ error: 'Not found' }, 404, corsH);
    return json(parseJsonFields(row, ['contacts', 'links', 'votes', 'background', 'priorities', 'backers']), 200, corsH);
  }

  const query = level
    ? 'SELECT * FROM representatives WHERE level = ? ORDER BY name'
    : 'SELECT * FROM representatives ORDER BY level, name';
  const { results } = level
    ? await env.DB.prepare(query).bind(level).all()
    : await env.DB.prepare(query).all();

  return json(results.map(r => parseJsonFields(r, ['contacts', 'links', 'votes', 'background', 'priorities', 'backers'])), 200, corsH);
}

async function getElections(env: Env, corsH: Record<string, string>): Promise<Response> {
  const { results: deadlines } = await env.DB.prepare('SELECT * FROM elections ORDER BY date_iso').all();
  const { results: races } = await env.DB.prepare('SELECT * FROM races ORDER BY name').all();
  return json({ deadlines, races }, 200, corsH);
}

async function getBills(env: Env, url: URL, corsH: Record<string, string>): Promise<Response> {
  const level = url.searchParams.get('level');
  const status = url.searchParams.get('status');

  let query = 'SELECT * FROM bills WHERE 1=1';
  const params: string[] = [];
  if (level && level !== 'all') { query += ' AND level = ?'; params.push(level); }
  if (status) { query += ' AND status = ?'; params.push(status); }
  query += ' ORDER BY number';

  const stmt = env.DB.prepare(query);
  const { results } = params.length > 0
    ? await stmt.bind(...params).all()
    : await stmt.all();

  return json(results.map(r => parseJsonFields(r, ['tags'])), 200, corsH);
}

async function getBudget(env: Env, corsH: Record<string, string>): Promise<Response> {
  const { results } = await env.DB.prepare('SELECT * FROM budget_segments ORDER BY percent DESC').all();
  return json({
    fiscalYear: '2025-26',
    total: '$2.1 Billion',
    segments: results,
  }, 200, corsH);
}

async function getIssues(env: Env, url: URL, corsH: Record<string, string>): Promise<Response> {
  const issueId = url.searchParams.get('id');

  if (issueId) {
    const issue = await env.DB.prepare('SELECT * FROM issues WHERE id = ?').bind(issueId).first();
    if (!issue) return json({ error: 'Not found' }, 404, corsH);
    const { results: contacts } = await env.DB.prepare('SELECT * FROM issue_contacts WHERE issue_id = ?').bind(issueId).all();
    return json({ ...issue, contacts }, 200, corsH);
  }

  const { results: issues } = await env.DB.prepare('SELECT * FROM issues').all();
  const { results: allContacts } = await env.DB.prepare('SELECT * FROM issue_contacts').all();

  const issuesWithContacts = issues.map(iss => ({
    ...iss,
    contacts: allContacts.filter(c => c.issue_id === iss.id),
  }));

  return json(issuesWithContacts, 200, corsH);
}

// ── Google Civic API proxy ──────────────────────────────

async function getCivicByAddress(env: Env, url: URL, corsH: Record<string, string>): Promise<Response> {
  const address = url.searchParams.get('address');
  if (!address) return json({ error: 'address parameter required' }, 400, corsH);

  if (!env.GOOGLE_CIVIC_API_KEY) {
    return json({ error: 'Google Civic API key not configured' }, 503, corsH);
  }

  // Check cache first
  const cached = await env.DB.prepare(
    "SELECT reps_json, cached_at FROM zip_cache WHERE zip = ? AND datetime(cached_at, '+24 hours') > datetime('now')"
  ).bind(address.trim().toLowerCase()).first();

  if (cached?.reps_json) {
    return json(JSON.parse(cached.reps_json as string), 200, { ...corsH, 'X-Cache': 'HIT' });
  }

  const civicUrl = `https://www.googleapis.com/civicinfo/v2/representatives?address=${encodeURIComponent(address)}&key=${env.GOOGLE_CIVIC_API_KEY}`;
  const resp = await fetch(civicUrl);
  if (!resp.ok) {
    const err = await resp.text();
    return json({ error: 'Google Civic API error', detail: err }, resp.status, corsH);
  }

  const data = await resp.json();

  // Cache the result
  await env.DB.prepare(
    "INSERT OR REPLACE INTO zip_cache (zip, reps_json, cached_at) VALUES (?, ?, datetime('now'))"
  ).bind(address.trim().toLowerCase(), JSON.stringify(data)).run();

  return json(data, 200, { ...corsH, 'X-Cache': 'MISS' });
}

// ── Congress.gov API proxy ──────────────────────────────

async function getCongressMembers(env: Env, url: URL, corsH: Record<string, string>): Promise<Response> {
  if (!env.CONGRESS_API_KEY) {
    return json({ error: 'Congress API key not configured' }, 503, corsH);
  }

  const bioguideId = url.searchParams.get('bioguideId');

  if (bioguideId) {
    // Get sponsored legislation for a specific member
    const congressUrl = `https://api.congress.gov/v3/member/${bioguideId}/sponsored-legislation?api_key=${env.CONGRESS_API_KEY}&limit=10&sort=updateDate+desc`;
    const resp = await fetch(congressUrl);
    if (!resp.ok) return json({ error: 'Congress API error' }, resp.status, corsH);
    const data = await resp.json();
    return json(data, 200, corsH);
  }

  // Get current AZ members (119th Congress, path-based state filter)
  const congressUrl = `https://api.congress.gov/v3/member/congress/119/AZ?api_key=${env.CONGRESS_API_KEY}&limit=50&currentMember=true`;
  const resp = await fetch(congressUrl);
  if (!resp.ok) return json({ error: 'Congress API error' }, resp.status, corsH);
  const data = await resp.json();
  return json(data, 200, corsH);
}

// ── OpenStates API proxy (state legislators, bills, votes) ──

async function getOpenStates(env: Env, url: URL, corsH: Record<string, string>): Promise<Response> {
  const apiKey = env.OPENSTATES_API_KEY;
  if (!apiKey) return json({ error: 'OpenStates API key not configured' }, 503, corsH);

  const endpoint = url.searchParams.get('endpoint') || 'people';
  const lat = url.searchParams.get('lat');
  const lng = url.searchParams.get('lng');
  const jurisdiction = url.searchParams.get('jurisdiction') || 'Arizona';
  const district = url.searchParams.get('district');
  const session = url.searchParams.get('session');
  const q = url.searchParams.get('q');
  const sponsor = url.searchParams.get('sponsor');

  let osUrl = '';

  switch (endpoint) {
    case 'people.geo':
      // Find reps by lat/lng (for geolocation feature)
      if (!lat || !lng) return json({ error: 'lat and lng required for people.geo' }, 400, corsH);
      osUrl = `https://v3.openstates.org/people.geo?lat=${lat}&lng=${lng}&include=other_identifiers`;
      break;

    case 'people':
      // Search state legislators by jurisdiction and optionally district
      osUrl = `https://v3.openstates.org/people?jurisdiction=${encodeURIComponent(jurisdiction)}&org_classification=legislature&per_page=50`;
      if (district) osUrl += `&district=${encodeURIComponent(district)}`;
      break;

    case 'bills':
      // Search state bills
      osUrl = `https://v3.openstates.org/bills?jurisdiction=${encodeURIComponent(jurisdiction)}&per_page=20&sort=updated_desc&include=votes,sponsorships`;
      if (session) osUrl += `&session=${encodeURIComponent(session)}`;
      if (q) osUrl += `&q=${encodeURIComponent(q)}`;
      if (sponsor) osUrl += `&sponsor=${encodeURIComponent(sponsor)}`;
      break;

    case 'committees':
      osUrl = `https://v3.openstates.org/committees?jurisdiction=${encodeURIComponent(jurisdiction)}&per_page=100&include=memberships`;
      break;

    default:
      return json({ error: `Unknown endpoint: ${endpoint}. Valid: people, people.geo, bills, committees` }, 400, corsH);
  }

  const resp = await fetch(osUrl, {
    headers: { 'X-API-KEY': apiKey },
  });

  if (!resp.ok) {
    const err = await resp.text();
    return json({ error: 'OpenStates API error', status: resp.status, detail: err }, resp.status, corsH);
  }

  const data = await resp.json();
  return json(data, 200, corsH);
}

// ── FEC API proxy (campaign finance) ─────────────────────

async function getFEC(env: Env, url: URL, corsH: Record<string, string>): Promise<Response> {
  const apiKey = env.FEC_API_KEY || 'DEMO_KEY';

  const endpoint = url.searchParams.get('endpoint') || 'candidates';
  const candidateId = url.searchParams.get('candidate_id');
  const name = url.searchParams.get('name');
  const state = url.searchParams.get('state') || 'AZ';
  const cycle = url.searchParams.get('cycle') || '2024';
  const office = url.searchParams.get('office'); // H, S, P

  let fecUrl = '';

  switch (endpoint) {
    case 'candidates':
      // Search candidates
      fecUrl = `https://api.open.fec.gov/v1/candidates/search/?api_key=${apiKey}&state=${state}&sort=name&per_page=20`;
      if (name) fecUrl += `&name=${encodeURIComponent(name)}`;
      if (office) fecUrl += `&office=${office}`;
      if (cycle) fecUrl += `&cycle=${cycle}`;
      break;

    case 'candidate':
      // Get specific candidate financials
      if (!candidateId) return json({ error: 'candidate_id required' }, 400, corsH);
      fecUrl = `https://api.open.fec.gov/v1/candidate/${candidateId}/totals/?api_key=${apiKey}&per_page=5&sort=-cycle`;
      break;

    case 'contributions':
      // Get top donors/contributions for a candidate's committee
      if (!candidateId) return json({ error: 'candidate_id required' }, 400, corsH);
      fecUrl = `https://api.open.fec.gov/v1/schedules/schedule_a/by_size/by_candidate/?api_key=${apiKey}&candidate_id=${candidateId}&cycle=${cycle}&per_page=10`;
      break;

    case 'spending':
      // Get independent expenditures for/against a candidate
      if (!candidateId) return json({ error: 'candidate_id required' }, 400, corsH);
      fecUrl = `https://api.open.fec.gov/v1/schedules/schedule_e/by_candidate/?api_key=${apiKey}&candidate_id=${candidateId}&cycle=${cycle}&per_page=20`;
      break;

    case 'races':
      // Get all candidates for a specific race (AZ House/Senate)
      const districtNum = url.searchParams.get('district');
      fecUrl = `https://api.open.fec.gov/v1/candidates/search/?api_key=${apiKey}&state=${state}&cycle=${cycle}&per_page=50&sort=name&is_active_candidate=true`;
      if (office) fecUrl += `&office=${office}`;
      if (districtNum) fecUrl += `&district=${districtNum}`;
      break;

    default:
      return json({ error: `Unknown endpoint: ${endpoint}. Valid: candidates, candidate, contributions, spending, races` }, 400, corsH);
  }

  const resp = await fetch(fecUrl);
  if (!resp.ok) {
    const err = await resp.text();
    return json({ error: 'FEC API error', status: resp.status, detail: err }, resp.status, corsH);
  }

  const data = await resp.json();
  return json(data, 200, corsH);
}

// ── Location resolver (personalization engine) ──────────

function normalizeName(name: string): string {
  return name.toLowerCase()
    .replace(/\b(jr|sr|iii|ii|iv)\b\.?/gi, '')
    .replace(/\b[a-z]\.\s*/g, '') // strip middle initials
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

interface CivicOfficial {
  name: string;
  party: string | null;
  phones: string[];
  urls: string[];
  photoUrl: string | null;
  emails: string[];
  channels: { type: string; id: string }[];
  office: { name: string; divisionId: string; levels: string[]; roles: string[] };
}

function parseDivisionsResponse(data: Record<string, unknown>, addressInput: string): {
  city: string; county: string; state: string;
  legislativeDistrict: number | null; congressionalDistrict: number | null;
  divisions: Record<string, { name: string }>;
} {
  let legislativeDistrict: number | null = null;
  let congressionalDistrict: number | null = null;
  let county = '';
  let city = '';
  let state = 'AZ';

  // Parse normalizedInput if available
  const input = (data.normalizedInput || {}) as Record<string, string>;
  if (input.city) city = input.city;
  if (input.state) state = input.state;

  const divisions = (data.divisions || {}) as Record<string, { name: string; aliases?: string[] }>;
  for (const [ocdId, div] of Object.entries(divisions)) {
    const cdMatch = ocdId.match(/\/cd:(\d+)/);
    if (cdMatch) congressionalDistrict = parseInt(cdMatch[1], 10);

    const sldlMatch = ocdId.match(/\/sldl:(\d+)/);
    const slduMatch = ocdId.match(/\/sldu:(\d+)/);
    if (sldlMatch) legislativeDistrict = parseInt(sldlMatch[1], 10);
    else if (slduMatch && !legislativeDistrict) legislativeDistrict = parseInt(slduMatch[1], 10);

    if (ocdId.includes('/county:')) county = div.name || '';

    // Extract city from place division
    if (ocdId.match(/\/place:/)) {
      city = city || div.name || '';
    }
  }

  // Fallback: extract city from address string
  if (!city && addressInput) {
    const parts = addressInput.split(',').map(p => p.trim());
    if (parts.length >= 2) city = parts[parts.length - 2] || parts[1] || '';
    // Clean up city (remove state/zip if stuck together)
    city = city.replace(/\s+(AZ|Arizona)\s*\d*/i, '').trim();
  }

  return { city, county, state, legislativeDistrict, congressionalDistrict, divisions };
}

async function getLocation(env: Env, url: URL, corsH: Record<string, string>): Promise<Response> {
  let address = url.searchParams.get('address');
  const lat = url.searchParams.get('lat');
  const lng = url.searchParams.get('lng');

  if (!address && (!lat || !lng)) {
    return json({ error: 'Provide address or lat+lng' }, 400, corsH);
  }

  // Reverse geocode if lat/lng provided
  if (!address && lat && lng) {
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
        { headers: { 'User-Agent': 'ArizonaCivicsGuide/1.0', 'Accept-Language': 'en' } }
      );
      const geo = await resp.json() as Record<string, unknown>;
      const addr = geo.address as Record<string, string> | undefined;
      if (addr) {
        const parts = [
          addr.house_number, addr.road, addr.city || addr.town || addr.village,
          addr.state, addr.postcode
        ].filter(Boolean);
        address = parts.join(', ');
      }
    } catch { /* fall through */ }
    if (!address) return json({ error: 'Could not reverse geocode coordinates' }, 400, corsH);
  }

  if (!address) return json({ error: 'No address resolved' }, 400, corsH);

  if (!env.GOOGLE_CIVIC_API_KEY) {
    return json({ error: 'Google Civic API key not configured' }, 503, corsH);
  }

  const cacheKey = `locate:${address.trim().toLowerCase()}`;
  const cached = await env.DB.prepare(
    "SELECT reps_json, cached_at FROM zip_cache WHERE zip = ? AND datetime(cached_at, '+24 hours') > datetime('now')"
  ).bind(cacheKey).first();

  let divisionsData: Record<string, unknown>;
  if (cached?.reps_json) {
    divisionsData = JSON.parse(cached.reps_json as string);
  } else {
    // Use divisionsByAddress (the replacement for deprecated representatives endpoint)
    const divUrl = `https://civicinfo.googleapis.com/civicinfo/v2/divisionsByAddress?address=${encodeURIComponent(address)}&key=${env.GOOGLE_CIVIC_API_KEY}`;
    const resp = await fetch(divUrl);
    if (!resp.ok) {
      const err = await resp.text();
      return json({ error: 'Google Civic API error', detail: err }, resp.status, corsH);
    }
    divisionsData = await resp.json() as Record<string, unknown>;
    await env.DB.prepare(
      "INSERT OR REPLACE INTO zip_cache (zip, reps_json, cached_at) VALUES (?, ?, datetime('now'))"
    ).bind(cacheKey, JSON.stringify(divisionsData)).run();
  }

  const parsed = parseDivisionsResponse(divisionsData, address);

  // Fetch D1 reps and build officials list from them
  const { results: d1Reps } = await env.DB.prepare('SELECT * FROM representatives ORDER BY name').all();
  const enrichedReps = d1Reps.map(r => parseJsonFields(r, ['contacts', 'links', 'votes', 'background', 'priorities', 'backers']));

  // Filter D1 reps to those matching this user's location
  const matchingOfficials: CivicOfficial[] = [];

  for (const rep of enrichedReps) {
    const repLevel = rep.level as string;
    const repCity = (rep.district as string || '').toLowerCase();
    const userCity = parsed.city.toLowerCase();

    let matches = false;

    if (repLevel === 'federal') {
      // Federal reps: match if same CD or senators (statewide)
      const title = (rep.title as string || '').toLowerCase();
      if (title.includes('senator')) {
        matches = true; // Senators represent all AZ
      } else if (parsed.congressionalDistrict) {
        const distStr = rep.district as string || '';
        const distNum = parseInt(distStr.replace(/\D/g, ''), 10);
        if (distNum === parsed.congressionalDistrict) matches = true;
      }
    } else if (repLevel === 'state') {
      // State reps: match statewide officials (governor etc) or by LD
      const title = (rep.title as string || '').toLowerCase();
      if (title.includes('governor') || title.includes('secretary') || title.includes('attorney') || title.includes('treasurer') || title.includes('superintendent')) {
        matches = true; // Statewide officials
      } else if (parsed.legislativeDistrict) {
        const distStr = rep.district as string || '';
        const distNum = parseInt(distStr.replace(/\D/g, ''), 10);
        if (distNum === parsed.legislativeDistrict) matches = true;
      }
    } else if (repLevel === 'local') {
      // Local reps: match by city name
      if (userCity && (repCity.includes(userCity) || userCity.includes(repCity))) {
        matches = true;
      }
      // Also match if district contains city name
      const repName = (rep.name as string || '').toLowerCase();
      if (!matches && repCity === '' && userCity === 'mesa') {
        // Mesa-specific: all local reps without district are Mesa officials
        matches = true;
      }
    }

    if (matches) {
      matchingOfficials.push({
        name: rep.name as string,
        party: rep.party as string | null,
        phones: [],
        urls: [],
        photoUrl: rep.photo_url as string | null,
        emails: [],
        channels: [],
        office: {
          name: rep.title as string,
          divisionId: '',
          levels: [repLevel === 'federal' ? 'country' : repLevel === 'state' ? 'administrativeArea1' : 'locality'],
          roles: [],
        },
        d1Match: rep as unknown as Record<string, unknown>,
      });
    }
  }

  return json({
    address,
    city: parsed.city,
    county: parsed.county,
    state: parsed.state,
    zip: '',
    legislativeDistrict: parsed.legislativeDistrict,
    congressionalDistrict: parsed.congressionalDistrict,
    officials: matchingOfficials,
    lat: lat ? parseFloat(lat) : null,
    lng: lng ? parseFloat(lng) : null,
  }, 200, corsH);
}

// ── Full-text search ────────────────────────────────────

async function search(env: Env, url: URL, corsH: Record<string, string>): Promise<Response> {
  const q = url.searchParams.get('q');
  if (!q || q.length < 2) return json({ error: 'q parameter required (min 2 chars)' }, 400, corsH);

  const like = `%${q}%`;

  const [reps, bills, issues] = await Promise.all([
    env.DB.prepare("SELECT id, name, title, party, level FROM representatives WHERE name LIKE ? OR title LIKE ? OR bio LIKE ? LIMIT 10")
      .bind(like, like, like).all(),
    env.DB.prepare("SELECT id, number, title, status, level FROM bills WHERE title LIKE ? OR summary LIKE ? OR number LIKE ? LIMIT 10")
      .bind(like, like, like).all(),
    env.DB.prepare("SELECT id, label, subtitle FROM issues WHERE label LIKE ? OR description LIKE ? LIMIT 10")
      .bind(like, like).all(),
  ]);

  return json({
    representatives: reps.results,
    bills: bills.results,
    issues: issues.results,
  }, 200, corsH);
}

// ── Helpers ─────────────────────────────────────────────

function parseJsonFields(row: Record<string, unknown>, fields: string[]): Record<string, unknown> {
  const out = { ...row };
  for (const f of fields) {
    if (typeof out[f] === 'string') {
      try { out[f] = JSON.parse(out[f] as string); } catch { /* leave as string */ }
    }
  }
  return out;
}

// ── Router ──────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env, _ctx: Ctx): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const corsH = cors(origin, env);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsH });
    }

    // Only allow GET
    if (request.method !== 'GET') {
      return json({ error: 'Method not allowed' }, 405, corsH);
    }

    const path = url.pathname;

    try {
      if (path === '/api/representatives') return await getRepresentatives(env, url, corsH);
      if (path === '/api/elections')       return await getElections(env, corsH);
      if (path === '/api/bills')           return await getBills(env, url, corsH);
      if (path === '/api/budget')          return await getBudget(env, corsH);
      if (path === '/api/issues')          return await getIssues(env, url, corsH);
      if (path === '/api/civic')           return await getCivicByAddress(env, url, corsH);
      if (path === '/api/congress')        return await getCongressMembers(env, url, corsH);
      if (path === '/api/openstates')      return await getOpenStates(env, url, corsH);
      if (path === '/api/fec')             return await getFEC(env, url, corsH);
      if (path === '/api/search')          return await search(env, url, corsH);
      if (path === '/api/locate')           return await getLocation(env, url, corsH);
      if (path === '/api/health')          return json({ status: 'ok', db: 'arizona-civics' }, 200, corsH);

      return json({ error: 'Not found', endpoints: [
        '/api/representatives?level=local|state|federal&id=',
        '/api/elections',
        '/api/bills?level=&status=',
        '/api/budget',
        '/api/issues?id=',
        '/api/civic?address=',
        '/api/congress?bioguideId=',
        '/api/openstates?endpoint=people|people.geo|bills|committees&lat=&lng=&jurisdiction=&district=&q=',
        '/api/fec?endpoint=candidates|candidate|contributions|spending|races&candidate_id=&name=&state=AZ&cycle=2024&office=H|S',
        '/api/locate?address=|lat=&lng=',
        '/api/search?q=',
        '/api/health',
      ]}, 404, corsH);
    } catch (err) {
      return json({ error: 'Internal error', message: (err as Error).message }, 500, corsH);
    }
  },
};
