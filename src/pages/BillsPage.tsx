import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Search, Loader2, ChevronDown } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { fetchBills, fetchCongressBills } from '../lib/api';
import type { CongressBill } from '../lib/api';

const TAG_COLORS: Record<string, string> = {
  housing: '#B87333', education: '#5B8FD8', healthcare: '#3D7A53',
  transportation: '#9B8BBE', environment: '#87CEEB', economy: '#D4956B',
  'public-safety': '#D86B6B', water: '#87CEEB', immigration: '#9B8BBE',
};

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  active:  { bg: 'rgba(184,115,51,0.12)', color: '#B87333', label: 'ACTIVE' },
  passed:  { bg: 'rgba(45,90,61,0.12)', color: '#3D7A53', label: 'PASSED' },
  failed:  { bg: 'rgba(184,58,58,0.12)', color: '#D86B6B', label: 'FAILED' },
  pending: { bg: 'rgba(240,244,248,0.06)', color: 'rgba(240,244,248,0.4)', label: 'PENDING' },
};

type Tab = 'tracked' | 'federal' | 'state';

export function BillsPage() {
  const [tab, setTab] = useState<Tab>('tracked');
  const [filter, setFilter] = useState<string>('all');
  const { data: bills, loading } = useApi(() => fetchBills(filter !== 'all' ? filter : undefined), [filter]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="az-label mb-2">Legislation</p>
        <h1 className="font-display font-bold text-3xl mb-2" style={{ color: '#F0F4F8' }}>Bill Tracker</h1>
        <p className="text-sm" style={{ color: 'rgba(240,244,248,0.5)' }}>
          Track legislation that affects Arizona residents at every level of government.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {([
          { id: 'tracked', label: 'Tracked Bills' },
          { id: 'federal', label: 'Active Legislation' },
          { id: 'state', label: 'State Bills' },
        ] as { id: Tab; label: string }[]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2.5 font-ui font-semibold text-xs uppercase tracking-wider transition-colors relative"
            style={{ color: tab === t.id ? '#B87333' : 'rgba(240,244,248,0.4)' }}>
            {t.label}
            {tab === t.id && (
              <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: '#B87333' }} />
            )}
          </button>
        ))}
      </div>

      {/* Tracked Bills tab */}
      {tab === 'tracked' && (
        <>
          <div className="flex gap-2 mb-6">
            {['all', 'local', 'state', 'federal'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="btn capitalize"
                style={{
                  background: filter === f ? '#B87333' : 'transparent',
                  color: filter === f ? '#F0F4F8' : 'rgba(240,244,248,0.4)',
                  borderColor: filter === f ? '#B87333' : 'rgba(255,255,255,0.15)',
                }}>
                {f}
              </button>
            ))}
          </div>

          {loading && <p className="text-sm" style={{ color: 'rgba(240,244,248,0.3)' }}>Loading...</p>}

          <div className="space-y-3">
            {bills?.map(bill => {
              const s = STATUS_STYLES[bill.status] ?? STATUS_STYLES.pending;
              return (
                <motion.div key={bill.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4">
                  <div className="flex items-start gap-3 flex-wrap mb-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded"
                      style={{ background: 'rgba(184,115,51,0.12)', color: '#B87333', border: '1px solid rgba(184,115,51,0.2)' }}>
                      {bill.number}
                    </span>
                    <span className={`zone-badge zone-badge-${bill.level}`}>{bill.level}</span>
                    <span className="az-label-zone" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                  <h3 className="font-display font-bold text-sm mb-1" style={{ color: '#F0F4F8' }}>{bill.title}</h3>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: 'rgba(240,244,248,0.5)' }}>{bill.summary}</p>
                  {bill.impact && <p className="text-2xs mb-2" style={{ color: 'rgba(240,244,248,0.3)' }}>{bill.impact}</p>}
                  {bill.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {bill.tags.map(t => (
                        <span key={t} className="text-2xs font-ui font-semibold px-2 py-0.5 rounded capitalize"
                          style={{ background: (TAG_COLORS[t] ?? '#F0F4F8') + '20', color: TAG_COLORS[t] ?? 'rgba(240,244,248,0.5)' }}>
                          {t.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                  {bill.tracker_url && (
                    <a href={bill.tracker_url} target="_blank" rel="noreferrer" className="btn btn-outline text-2xs mt-3">
                      <ExternalLink size={10} /> Track Bill
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {/* Active Federal Legislation tab */}
      {tab === 'federal' && <FederalBillsTab />}

      {/* State Bills tab (placeholder) */}
      {tab === 'state' && (
        <div className="glass-card p-8 text-center">
          <p className="font-display font-bold text-lg mb-2" style={{ color: '#F0F4F8' }}>State Legislation</p>
          <p className="text-sm mb-4" style={{ color: 'rgba(240,244,248,0.5)' }}>
            State bill tracking is coming soon. We're working on connecting to the Arizona Legislature database to show state-level legislation that affects you.
          </p>
          <a href="https://www.azleg.gov/bills/" target="_blank" rel="noreferrer"
            className="btn btn-outline text-xs">
            <ExternalLink size={12} /> Browse bills on azleg.gov
          </a>
        </div>
      )}
    </div>
  );
}

/* ── Federal bills live search ─── */
function FederalBillsTab() {
  const [query, setQuery] = useState('');
  const [bills, setBills] = useState<CongressBill[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedBill, setExpandedBill] = useState<string | null>(null);

  const searchBills = useCallback(async (searchQuery: string, searchOffset = 0) => {
    setLoading(true);
    try {
      const data = await fetchCongressBills(searchQuery || undefined, '119', 20, searchOffset);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = (data as any).bills || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newBills = raw.map((b: any) => ({
        congress: b.congress || 119,
        type: b.type || '',
        number: b.number || 0,
        title: b.title || '',
        latestAction: b.latestAction,
        originChamber: b.originChamber || '',
        url: b.url || '',
        updateDate: b.updateDate || '',
      })) as CongressBill[];

      if (searchOffset === 0) {
        setBills(newBills);
      } else {
        setBills(prev => [...prev, ...newBills]);
      }
      setTotalCount(data.pagination?.count || 0);
      setOffset(searchOffset + 20);
      setHasSearched(true);
    } catch {
      // silently fail
    }
    setLoading(false);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setOffset(0);
    searchBills(query, 0);
  }

  // Auto-load recent bills on first render
  if (!hasSearched && !loading) {
    searchBills('', 0);
  }

  const billKey = (b: CongressBill) => `${b.type}${b.number}-${b.congress}`;

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(240,244,248,0.3)' }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search bills (e.g. water, border, housing)"
            className="input-az pl-9 text-sm"
          />
        </div>
        <button type="submit" className="btn btn-copper flex-shrink-0" disabled={loading}>
          {loading ? <Loader2 size={12} className="animate-spin" /> : 'Search'}
        </button>
      </form>

      {hasSearched && (
        <p className="text-2xs mb-4" style={{ color: 'rgba(240,244,248,0.3)' }}>
          {totalCount.toLocaleString()} bills found in 119th Congress · Source: Congress.gov
        </p>
      )}

      <div className="space-y-2">
        {bills.map(bill => {
          const key = billKey(bill);
          const isExpanded = expandedBill === key;
          const typeLabel = bill.type?.toUpperCase() || '';
          const chamberColor = bill.originChamber === 'Senate' ? '#87CEEB' : '#B87333';

          return (
            <motion.div key={key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card overflow-hidden cursor-pointer" onClick={() => setExpandedBill(isExpanded ? null : key)}>
              <div className="p-4">
                <div className="flex items-start gap-3 mb-1.5">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded flex-shrink-0"
                    style={{ background: 'rgba(184,115,51,0.12)', color: '#B87333', border: '1px solid rgba(184,115,51,0.2)' }}>
                    {typeLabel} {bill.number}
                  </span>
                  <span className="text-2xs font-ui font-bold uppercase px-1.5 py-0.5 rounded"
                    style={{ background: `${chamberColor}15`, color: chamberColor }}>
                    {bill.originChamber || 'Congress'}
                  </span>
                  <motion.div className="ml-auto flex-shrink-0" animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <ChevronDown size={14} style={{ color: 'rgba(240,244,248,0.3)' }} />
                  </motion.div>
                </div>
                <h3 className="font-display font-bold text-sm leading-snug" style={{ color: '#F0F4F8' }}>{bill.title}</h3>
                {bill.latestAction && (
                  <p className="text-2xs mt-1" style={{ color: 'rgba(240,244,248,0.35)' }}>
                    {bill.latestAction.actionDate}: {bill.latestAction.text}
                  </p>
                )}
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      <div className="pt-3 flex gap-3">
                        {bill.url && (
                          <a href={bill.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                            className="btn btn-outline text-2xs">
                            <ExternalLink size={10} /> Read on Congress.gov
                          </a>
                        )}
                        {bill.updateDate && (
                          <p className="text-2xs self-center" style={{ color: 'rgba(240,244,248,0.3)' }}>
                            Updated {new Date(bill.updateDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Load more */}
      {bills.length < totalCount && (
        <div className="text-center mt-6">
          <button
            onClick={() => searchBills(query, offset)}
            className="btn btn-outline text-xs"
            disabled={loading}
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : `Load more (${bills.length} of ${totalCount.toLocaleString()})`}
          </button>
        </div>
      )}
    </div>
  );
}
