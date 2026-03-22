import { useState } from 'react';
import { Link, useSearch } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronRight, Users } from 'lucide-react';
import { fetchRepresentatives } from '../lib/api';
import type { Representative } from '../lib/api';
import { useApi } from '../hooks/useApi';
import { useUserLocation } from '../context/UserLocationContext';

const ZONES = ['local', 'state', 'federal'] as const;
type Zone = (typeof ZONES)[number];

const ZONE_COLORS: Record<Zone, { bar: string; bg: string; text: string; label: string }> = {
  local:   { bar: '#B87333', bg: 'rgba(184,115,51,0.1)', text: '#D4956B', label: 'Local' },
  state:   { bar: '#2D5A3D', bg: 'rgba(45,90,61,0.1)', text: '#3D7A53', label: 'State' },
  federal: { bar: '#87CEEB', bg: 'rgba(135,206,235,0.1)', text: '#87CEEB', label: 'Federal' },
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
      className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-lg flex-shrink-0"
      style={{ background: ZONE_COLORS[zone].bar, color: '#0F1923' }}
    >
      {initials(name)}
    </div>
  );
}

export function RepresentativesPage() {
  const search = useSearch();
  const tabParam = new URLSearchParams(search).get('tab') as Zone | null;
  const [activeZone, setActiveZone] = useState<Zone>(
    tabParam && ZONES.includes(tabParam) ? tabParam : 'local'
  );
  const { data: reps, loading, error } = useApi<Representative[]>(
    () => fetchRepresentatives(),
    []
  );
  const { location: userLoc, isPersonalized } = useUserLocation();
  const cityName = isPersonalized ? userLoc.city || '' : '';

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
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(184,115,51,0.1)' }}
        >
          <Users size={20} style={{ color: '#B87333' }} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: '#F0F4F8' }}>Your Representatives</h1>
          <p className="text-sm font-body" style={{ color: 'rgba(240,244,248,0.5)' }}>The people making decisions on your behalf</p>
        </div>
      </div>

      {/* Tab Bar */}
      <div
        className="flex gap-1 mb-8 p-1 rounded-lg w-fit"
        style={{ background: 'rgba(26,35,50,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
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
                color: active ? '#F0F4F8' : 'rgba(240,244,248,0.4)',
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
          <div className="inline-block w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(184,115,51,0.3)', borderTopColor: '#B87333' }} />
          <p className="text-sm mt-3 font-body" style={{ color: 'rgba(240,244,248,0.5)' }}>Loading representatives...</p>
        </div>
      )}

      {error && (
        <div className="az-alert az-alert-warn">
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
          style={{ gridAutoRows: '1fr' }}
        >
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-sm font-body mb-2" style={{ color: 'rgba(240,244,248,0.5)' }}>
                {isPersonalized && activeZone === 'local' && cityName
                  ? `We don't have detailed profiles for ${cityName} city officials yet. We're adding more cities soon.`
                  : `No ${ZONE_COLORS[activeZone].label.toLowerCase()} representatives found.`}
              </p>
              {isPersonalized && activeZone === 'local' && cityName && (
                <p className="text-xs" style={{ color: 'rgba(240,244,248,0.3)' }}>
                  Your state and federal representatives are available in the other tabs.
                </p>
              )}
            </div>
          )}

          {filtered.map((rep, i) => (
            <motion.div
              key={rep.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="h-full"
            >
              <Link href={`/representatives/${rep.id}?from=${activeZone}`} className="block h-full">
                <div className="glass-card overflow-hidden group cursor-pointer h-full flex flex-col">
                  {/* Zone top bar */}
                  <div className="h-1" style={{ background: ZONE_COLORS[activeZone].bar }} />

                  <div className="p-4 flex-1 flex flex-col">
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
                        <h3 className="font-display font-bold text-base leading-tight truncate" style={{ color: '#F0F4F8' }}>
                          {rep.name}
                        </h3>
                        <p className="font-body text-xs mt-0.5 truncate" style={{ color: 'rgba(240,244,248,0.5)' }}>{rep.title}</p>

                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className={partyClass(rep.party)}>{partyLabel(rep.party)}</span>
                          {rep.district && (
                            <span className="az-label text-2xs">{rep.district}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Term info - fixed height so all cards match */}
                    <div className="flex-1 flex items-end">
                      {(rep.term_start || rep.term_end) ? (
                        <p className="text-2xs font-body mt-3" style={{ color: 'rgba(240,244,248,0.35)' }}>
                          Term: {rep.term_start ?? '?'} to {rep.term_end ?? '?'}
                          {rep.next_election && <span> · Next election: {rep.next_election}</span>}
                        </p>
                      ) : (
                        <div className="mt-3" />
                      )}
                    </div>

                    {/* View profile link */}
                    <div
                      className="flex items-center gap-1 mt-auto pt-3 font-ui font-semibold text-xs uppercase tracking-wider transition-colors"
                      style={{ color: '#B87333' }}
                    >
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
