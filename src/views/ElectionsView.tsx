import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ExternalLink, AlertTriangle } from 'lucide-react';
import { electionDeadlines, races2026 } from '../data/elections';

function daysUntil(isoDate: string): number {
  return Math.max(0, Math.ceil((new Date(isoDate).getTime() - Date.now()) / 86400000));
}

export function ElectionsView() {
  const [, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 60000); return () => clearInterval(id); }, []);

  const upcoming = [...electionDeadlines]
    .filter(d => daysUntil(d.dateISO) > 0)
    .sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime());
  const next = upcoming[0];

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <Calendar size={16} className="text-warn" />
          <span className="label-xs" style={{ color: '#f0a030' }}>Election Intelligence</span>
        </div>
        <h1 className="font-display font-bold text-text1 text-3xl mb-1">2026 Election Center</h1>
        <p className="text-text2 text-sm">Governor · All State Legislature · U.S. House · Mesa Council Districts 2, 4, 6</p>
      </div>

      {/* Big countdown */}
      {next && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className="rounded-xl p-5 mb-7" style={{ background: '#0f1520', border: '1px solid #1f2d45' }}>
          <div className="flex items-center gap-2 mb-3 text-text3 text-xs font-semibold uppercase tracking-wider">
            <Clock size={12} /> Next Key Deadline
          </div>
          <div className="flex items-end gap-5">
            <div>
              <div className="font-display font-bold text-copper leading-none" style={{ fontSize: '4rem' }}>
                {daysUntil(next.dateISO)}
              </div>
              <div className="text-text3 text-sm mt-1">days away</div>
            </div>
            <div className="pb-1">
              <div className="font-display font-bold text-text1 text-xl leading-tight">{next.label}</div>
              <div className="text-text2 text-sm mt-0.5">{next.date}</div>
              <div className="text-text3 text-xs mt-1">{next.sublabel}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* All deadlines */}
      <section className="mb-7">
        <p className="label-copper mb-3">2026 Arizona Calendar</p>
        <div className="space-y-2">
          {electionDeadlines.map((d, i) => {
            const days = daysUntil(d.dateISO);
            const past = days === 0;
            return (
              <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-lg"
                style={{ background: '#131928', border: `1px solid ${d.urgent ? '#1f2d45' : '#1a2236'}` }}>
                <div className="flex items-center gap-3">
                  <Calendar size={13} className="text-copper flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-text1">{d.label}</p>
                    <p className="text-xs text-text3">{d.sublabel}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold" style={{ color: d.urgent ? '#f0a030' : '#8896b0' }}>{d.date}</div>
                  {!past && <div className="text-2xs text-text3">{days}d</div>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Race ratings */}
      <section className="mb-7">
        <p className="label-copper mb-3">Race Ratings</p>
        <div className="space-y-3">
          {races2026.map(r => (
            <div key={r.id} className="p-4 rounded-lg" style={{ background: '#131928', border: '1px solid #1f2d45' }}>
              <div className="flex items-start justify-between gap-3 mb-1">
                <h4 className="font-semibold text-text1 text-sm">{r.name}</h4>
                <span className="level-badge level-{r.type}" style={{}}>
                  <span className={`level-badge ${r.type === 'federal' ? 'federal' : r.type === 'state' ? 'state' : 'local'}`}>{r.type}</span>
                </span>
              </div>
              <p className="text-xs font-semibold text-copper mb-1">{r.rating}</p>
              <p className="text-xs text-text3">{r.context}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Alert */}
      <div className="alert alert-danger flex gap-2 items-start mb-5">
        <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
        <div>
          <strong>District 6 council seat is yours to decide.</strong> Scott Somers' seat is up in November 2026. Filing opens April 2026.
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <a href="https://azsos.gov/elections" target="_blank" rel="noreferrer" className="btn btn-outline text-xs"><ExternalLink size={11} /> AZ Election Calendar</a>
        <a href="https://my.arizona.vote/" target="_blank" rel="noreferrer" className="btn btn-copper-outline text-xs"><ExternalLink size={11} /> Check Registration</a>
        <a href="https://www.azcleanelections.gov/" target="_blank" rel="noreferrer" className="btn btn-outline text-xs"><ExternalLink size={11} /> AZ Clean Elections</a>
        <a href="https://ballotpedia.org/Arizona_2026_ballot_measures" target="_blank" rel="noreferrer" className="btn btn-outline text-xs"><ExternalLink size={11} /> Ballot Measures</a>
      </div>
    </div>
  );
}
