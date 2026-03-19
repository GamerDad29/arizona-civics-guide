import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { fetchBills } from '../lib/api';

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

export function BillsPage() {
  const [filter, setFilter] = useState<string>('all');
  const { data: bills, loading } = useApi(() => fetchBills(filter !== 'all' ? filter : undefined), [filter]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="az-label mb-2">Legislation</p>
        <h1 className="font-display font-bold text-3xl mb-2" style={{ color: '#F0F4F8' }}>Bill Tracker</h1>
        <p className="text-sm" style={{ color: 'rgba(240,244,248,0.5)' }}>Active and recent legislation affecting Mesa and Arizona residents.</p>
      </div>

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
    </div>
  );
}
