/**
 * Arizona Civics API Worker
 * Serves data from D1 + proxies Google Civic & Congress.gov APIs
 * Deployed to Cloudflare Workers, bound to D1 database "arizona-civics"
 */

interface Env {
  DB: D1Database;
  GOOGLE_CIVIC_API_KEY: string;
  CONGRESS_API_KEY: string;
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

  // Get all AZ members
  const congressUrl = `https://api.congress.gov/v3/member?stateCode=AZ&api_key=${env.CONGRESS_API_KEY}&limit=50&currentMember=true`;
  const resp = await fetch(congressUrl);
  if (!resp.ok) return json({ error: 'Congress API error' }, resp.status, corsH);
  const data = await resp.json();
  return json(data, 200, corsH);
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
      if (path === '/api/search')          return await search(env, url, corsH);
      if (path === '/api/health')          return json({ status: 'ok', db: 'arizona-civics' }, 200, corsH);

      return json({ error: 'Not found', endpoints: [
        '/api/representatives?level=local|state|federal&id=',
        '/api/elections',
        '/api/bills?level=&status=',
        '/api/budget',
        '/api/issues?id=',
        '/api/civic?address=',
        '/api/congress?bioguideId=',
        '/api/search?q=',
        '/api/health',
      ]}, 404, corsH);
    } catch (err) {
      return json({ error: 'Internal error', message: (err as Error).message }, 500, corsH);
    }
  },
};
