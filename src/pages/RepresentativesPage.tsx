import { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronRight, Users } from 'lucide-react';
import { fetchRepresentatives } from '../lib/api';
import type { Representative } from '../lib/api';
import { useApi } from '../hooks/useApi';

const ZONES = ['local', 'state', 'federal'] as const;
type Zone = (typeof ZONES)[number];

const ZONE_COLORS: Record<Zone, { bar: string; bg: string; text: string; label: string }> = {
  local:   { bar: '#7B1D3A', bg: '#7B1D3A12', text: '#7B1D3A', label: 'Local' },
  state:   { bar: '#5C7A5E', bg: '#5C7A5E12', text: '#5C7A5E', label: 'State' },
  federal: { bar: '#A8C4C8', bg: '#A8C4C825', text: '#5A8A90', label: 'Federal' },
};

function partyClass(party: string | null) {
  if (!party) return 'party-badge party-i';
  const p = party.toLowerCase();
  if (p.startsWith('d')) return 'party-badge party-d';
  if (p.startsWith('r')) return 'party-badge party-r';
  return 'party-badge party-i';
}

function partyLabel(party: string | null) {
  if (!party) return 'Independent';
  const p = party.toLowerCase();
  if (p.startsWith('d')) return 'Democrat';
  if (p.startsWith('r')) return 'Republican';
  return party;
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function InitialsAvatar({ name, zone }: { name: string; zone: Zone }) {
  return (
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-lg text-cream flex-shrink-0"
      style={{ background: ZONE_COLORS[zone].bar }}
    >
      {initials(name)}
    </div>
  );
}

export function RepresentativesPage() {
  const [activeZone, setActiveZone] = useState<Zone>('local');
  const { data: reps, loading, error } = useApi<Representative[]>(
    () => fetchRepresentatives(),
    []
  );

  const filtered = reps?.filter(r => r.level === activeZone) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-burgundy/10">
          <Users size={20} className="text-burgundy" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Your Representatives</h1>
          <p className="text-sm text-ink/50 font-body">Elected officials serving Mesa and Arizona</p>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 mb-8 p-1 rounded-lg bg-sand-dark/50 w-fit">
        {ZONES.map(zone => {
          const active = activeZone === zone;
          const zc = ZONE_COLORS[zone];
          return (
            <button
              key={zone}
              onClick={() => setActiveZone(zone)}
              className="px-5 py-2 rounded-md font-ui font-semibold text-xs uppercase tracking-wider transition-all"
              style={{
                background: active ? zc.bar : 'transparent',
                color: active ? '#FAF8F2' : '#1C1A1880',
              }}
            >
              {zc.label}
            </button>
          );
        })}
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-block w-6 h-6 border-2 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
          <p className="text-sm text-ink/50 mt-3 font-body">Loading representatives...</p>
        </div>
      )}

      {error && (
        <div className="wpa-alert wpa-alert-warn">
          <p className="font-body text-sm">Could not load representatives: {error}</p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <motion.div
          key={activeZone}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.length === 0 && (
            <p className="text-sm text-ink/50 col-span-full text-center py-12 font-body">
              No {ZONE_COLORS[activeZone].label.toLowerCase()} representatives found.
            </p>
          )}

          {filtered.map((rep, i) => (
            <motion.div
              key={rep.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Link href={`/representatives/${rep.id}`} className="block">
                <div className="wpa-card overflow-hidden group cursor-pointer">
                  {/* Zone top bar */}
                  <div className="h-1" style={{ background: ZONE_COLORS[activeZone].bar }} />

                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {rep.photo_url ? (
                        <img
                          src={rep.photo_url}
                          alt={rep.name}
                          className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2"
                          style={{ borderColor: ZONE_COLORS[activeZone].bar + '40' }}
                        />
                      ) : (
                        <InitialsAvatar name={rep.name} zone={activeZone} />
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-ink text-base leading-tight truncate">
                          {rep.name}
                        </h3>
                        <p className="font-body text-xs text-ink/60 mt-0.5 truncate">{rep.title}</p>

                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className={partyClass(rep.party)}>{partyLabel(rep.party)}</span>
                          {rep.district && (
                            <span className="wpa-label text-2xs">{rep.district}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Term info */}
                    {(rep.term_start || rep.term_end) && (
                      <p className="text-2xs text-ink/40 font-body mt-3">
                        Term: {rep.term_start ?? '?'} &ndash; {rep.term_end ?? '?'}
                        {rep.next_election && <span> &middot; Next election: {rep.next_election}</span>}
                      </p>
                    )}

                    {/* View profile link */}
                    <div className="flex items-center gap-1 mt-3 font-ui font-semibold text-xs uppercase tracking-wider text-terracotta group-hover:text-terracotta-dark transition-colors">
                      View Profile
                      <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
