import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { fetchBills } from '../lib/api';

const TAG_COLORS: Record<string, string> = {
  housing: '#C4623A', education: '#2E5EA8', healthcare: '#5C7A5E',
  transportation: '#7B6B9E', environment: '#5A8A90', economy: '#C4623A',
  'public-safety': '#B83A3A', water: '#5A8A90', immigration: '#7B6B9E',
};

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  active:  { bg: '#C4623A15', color: '#C4623A', label: 'ACTIVE' },
  passed:  { bg: '#5C7A5E15', color: '#5C7A5E', label: 'PASSED' },
  failed:  { bg: '#B83A3A15', color: '#B83A3A', label: 'FAILED' },
  pending: { bg: '#1C1A1810', color: '#1C1A1860', label: 'PENDING' },
};

export function BillsPage() {
  const [filter, setFilter] = useState<string>('all');
  const { data: bills, loading } = useApi(() => fetchBills(filter !== 'all' ? filter : undefined), [filter]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="wpa-label mb-2">Legislation</p>
        <h1 className="font-display font-bold text-ink text-3xl mb-2">Bill Tracker</h1>
        <p className="text-ink/60 text-sm">Active and recent legislation affecting Mesa and Arizona residents.</p>
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'local', 'state', 'federal'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="btn capitalize"
            style={{
              background: filter === f ? '#C4623A' : 'transparent',
              color: filter === f ? '#FAF8F2' : '#1C1A1860',
              borderColor: filter === f ? '#C4623A' : '#D5D0C2',
            }}>
            {f}
          </button>
        ))}
      </div>

      {loading && <p className="text-ink/40 text-sm">Loading...</p>}

      <div className="space-y-3">
        {bills?.map(bill => {
          const s = STATUS_STYLES[bill.status] ?? STATUS_STYLES.pending;
          return (
            <motion.div key={bill.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="wpa-card p-4">
              <div className="flex items-start gap-3 flex-wrap mb-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded"
                  style={{ background: '#C4623A15', color: '#C4623A', border: '1px solid #C4623A25' }}>
                  {bill.number}
                </span>
                <span className={`zone-badge zone-badge-${bill.level}`}>{bill.level}</span>
                <span className="wpa-label-zone" style={{ background: s.bg, color: s.color }}>{s.label}</span>
              </div>
              <h3 className="font-display font-bold text-ink text-sm mb-1">{bill.title}</h3>
              <p className="text-xs text-ink/60 leading-relaxed mb-2">{bill.summary}</p>
              {bill.impact && <p className="text-2xs text-ink/40 mb-2">{bill.impact}</p>}
              {bill.tags && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {bill.tags.map(t => (
                    <span key={t} className="text-2xs font-ui font-semibold px-2 py-0.5 rounded capitalize"
                      style={{ background: (TAG_COLORS[t] ?? '#1C1A18') + '12', color: TAG_COLORS[t] ?? '#1C1A1860' }}>
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
    </div>
  );
}
