import { useState, useEffect } from 'react';
import { SectionCard } from '../components/SectionCard';
import { electionDeadlines, races2026 } from '../data/elections';
import { Calendar, Clock } from 'lucide-react';

function daysUntil(isoDate: string): number {
  const now = new Date();
  const target = new Date(isoDate);
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function ElectionsSection() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const nextDeadline = [...electionDeadlines]
    .filter(d => daysUntil(d.dateISO) > 0)
    .sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime())[0];

  return (
    <div id="elections">
      <SectionCard
        title="2026 Election Center"
        subtitle="Key races, deadlines, and how to prepare"
        alert={
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            <strong>Major Elections in 2026:</strong> Governor • All State Legislature • U.S. House •
            Mesa Council Districts 2, 4, 6 (<strong>YOUR DISTRICT!</strong>)
          </div>
        }
      >
        {/* Countdown to next deadline */}
        {nextDeadline && (
          <div className="bg-navy rounded-xl p-5 text-white mb-6">
            <div className="flex items-center gap-2 mb-2 opacity-70 text-sm">
              <Clock size={14} />
              Next Key Deadline
            </div>
            <div className="flex items-end gap-4">
              <div>
                <div className="font-display font-bold text-5xl text-copper leading-none">
                  {daysUntil(nextDeadline.dateISO)}
                </div>
                <div className="text-white/60 text-sm mt-1">days away</div>
              </div>
              <div className="pb-1">
                <div className="font-semibold text-lg leading-tight">{nextDeadline.label}</div>
                <div className="text-white/60 text-sm">{nextDeadline.date}</div>
              </div>
            </div>
          </div>
        )}

        {/* All deadlines */}
        <div className="mb-6">
          <p className="section-label mb-3">2026 Arizona Election Calendar</p>
          <div className="space-y-2">
            {electionDeadlines.map((d, i) => {
              const days = daysUntil(d.dateISO);
              const past = days === 0;
              return (
                <div key={i} className={`flex items-center justify-between gap-4 rounded-lg p-3 border ${
                  d.urgent ? 'bg-copper/5 border-copper/20' : 'bg-sand-100 border-sand-200'
                }`}>
                  <div className="flex items-start gap-2">
                    <Calendar size={14} className="text-copper mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-navy">{d.label}</p>
                      <p className="text-xs text-navy/50">{d.sublabel}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-sm font-bold ${d.urgent ? 'text-copper' : 'text-navy'}`}>{d.date}</div>
                    {!past && (
                      <div className="text-xs text-navy/40">{days} days</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Race ratings */}
        <div className="mb-4">
          <p className="section-label mb-3">Race Ratings</p>
          <div className="space-y-3">
            {races2026.map(r => (
              <div key={r.id} className="bg-sand-100 rounded-lg p-4 border border-sand-200">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-navy text-sm">{r.name}</h4>
                  <span className="text-xs bg-navy/10 text-navy/70 rounded px-2 py-0.5 shrink-0 capitalize">{r.type}</span>
                </div>
                <p className="text-xs font-medium text-copper mb-1">{r.rating}</p>
                <p className="text-xs text-navy/60">{r.context}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <a href="https://azsos.gov/elections" target="_blank" rel="noreferrer"
            className="contact-btn outline text-xs">Full AZ Calendar</a>
          <a href="https://my.arizona.vote/" target="_blank" rel="noreferrer"
            className="contact-btn email text-xs">Check Registration</a>
          <a href="https://www.azcleanelections.gov/" target="_blank" rel="noreferrer"
            className="contact-btn outline text-xs">AZ Clean Elections</a>
          <a href="https://ballotpedia.org/Mesa_City_Council,_Arizona" target="_blank" rel="noreferrer"
            className="contact-btn outline text-xs">Ballotpedia</a>
        </div>
      </SectionCard>
    </div>
  );
}
