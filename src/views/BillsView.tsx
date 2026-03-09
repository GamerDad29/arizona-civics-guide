import { useState } from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import { bills } from '../data/bills';
import type { BillLevel } from '../data/bills';

const TAG_COLORS: Record<string, string> = {
  housing:       'rgba(240,160,48,0.12),#f0a030,rgba(240,160,48,0.3)',
  education:     'rgba(79,126,245,0.12),#4f7ef5,rgba(79,126,245,0.3)',
  healthcare:    'rgba(47,215,112,0.12),#2fd770,rgba(47,215,112,0.3)',
  transportation:'rgba(155,111,232,0.12),#9b6fe8,rgba(155,111,232,0.3)',
  environment:   'rgba(28,176,190,0.12),#1cb0be,rgba(28,176,190,0.3)',
  economy:       'rgba(240,160,48,0.08),#e8a055,rgba(240,160,48,0.2)',
  'public-safety':'rgba(240,83,83,0.12),#f05353,rgba(240,83,83,0.3)',
  water:         'rgba(28,176,190,0.12),#1cb0be,rgba(28,176,190,0.3)',
  immigration:   'rgba(155,111,232,0.12),#9b6fe8,rgba(155,111,232,0.3)',
};

function TagChip({ tag }: { tag: string }) {
  const [bg, text, border] = (TAG_COLORS[tag] ?? 'rgba(74,90,114,0.15),#8896b0,rgba(74,90,114,0.3)').split(',');
  return (
    <span className="text-2xs font-semibold px-2 py-0.5 rounded capitalize" style={{ background: bg, color: text, border: `1px solid ${border}` }}>
      {tag.replace('-', ' ')}
    </span>
  );
}

const STATUS_COLORS = {
  active:  { bg: 'rgba(240,160,48,0.08)', color: '#f0a030', border: 'rgba(240,160,48,0.25)', label: 'ACTIVE' },
  passed:  { bg: 'rgba(47,215,112,0.08)', color: '#2fd770', border: 'rgba(47,215,112,0.25)', label: 'PASSED' },
  failed:  { bg: 'rgba(240,83,83,0.08)',  color: '#f05353', border: 'rgba(240,83,83,0.25)',  label: 'FAILED' },
  pending: { bg: 'rgba(74,90,114,0.08)',  color: '#8896b0', border: 'rgba(74,90,114,0.25)',  label: 'PENDING' },
};

const LEVEL_LABELS: Record<BillLevel, string> = { federal: 'Federal', state: 'State', local: 'Local' };

export function BillsView() {
  const [filter, setFilter] = useState<'all' | BillLevel>('all');

  const filtered = filter === 'all' ? bills : bills.filter(b => b.level === filter);

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <FileText size={16} className="text-text2" />
          <span className="label-xs">Legislation</span>
        </div>
        <h1 className="font-display font-bold text-text1 text-3xl mb-1">Bill Tracker</h1>
        <p className="text-text2 text-sm">Active and recent legislation affecting Mesa and Arizona residents.</p>
      </div>

      <div className="flex gap-2 mb-5">
        {(['all', 'local', 'state', 'federal'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="btn text-xs capitalize"
            style={{
              background: filter === f ? '#c97b30' : 'transparent',
              color: filter === f ? '#fff' : '#8896b0',
              borderColor: filter === f ? '#c97b30' : '#1f2d45',
            }}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(bill => {
          const s = STATUS_COLORS[bill.status];
          return (
            <div key={bill.id} className="p-4 rounded-lg" style={{ background: '#131928', border: '1px solid #1f2d45' }}>
              <div className="flex items-start gap-3 flex-wrap mb-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(201,123,48,0.12)', color: '#c97b30', border: '1px solid rgba(201,123,48,0.25)' }}>
                  {bill.number}
                </span>
                <span className={`level-badge level-${bill.level}`}>{LEVEL_LABELS[bill.level]}</span>
                <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                  {s.label}
                </span>
              </div>
              <h3 className="font-semibold text-text1 text-sm mb-1">{bill.title}</h3>
              <p className="text-xs text-text2 leading-relaxed mb-2">{bill.summary}</p>
              {bill.impact && <p className="text-2xs text-text3 mb-2">{bill.impact}</p>}
              {bill.yourRep && <p className="text-2xs text-copper font-medium mb-2">Your reps: {bill.yourRep}</p>}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {bill.tags.map(t => <TagChip key={t} tag={t} />)}
              </div>
              {bill.trackerUrl && (
                <div className="mt-3">
                  <a href={bill.trackerUrl} target="_blank" rel="noreferrer" className="btn btn-outline text-2xs">
                    <ExternalLink size={10} /> Track Bill
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 mt-5">
        <a href="https://www.azleg.gov/" target="_blank" rel="noreferrer" className="btn btn-outline text-xs">AZ Legislature</a>
        <a href="https://www.mesaaz.gov/Government/City-Clerk/Introduced-Ordinances" target="_blank" rel="noreferrer" className="btn btn-outline text-xs">Mesa Ordinances</a>
      </div>
    </div>
  );
}
