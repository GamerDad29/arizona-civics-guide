import { motion } from 'framer-motion';
import { CalendarDays, ExternalLink, Vote, Clock } from 'lucide-react';
import { fetchElections } from '../lib/api';
import type { ElectionDeadline, Race } from '../lib/api';
import { useApi } from '../hooks/useApi';

function daysUntil(isoDate: string): number {
  const target = new Date(isoDate + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function zoneBadgeClass(level: string | null) {
  if (!level) return '';
  const l = level.toLowerCase();
  if (l === 'local') return 'zone-badge-local';
  if (l === 'state') return 'zone-badge-state';
  if (l === 'federal') return 'zone-badge-federal';
  return '';
}

export function ElectionsPage() {
  const { data, loading, error } = useApi<{ deadlines: ElectionDeadline[]; races: Race[] }>(
    () => fetchElections(),
    []
  );

  const deadlines = data?.deadlines ?? [];
  const races = data?.races ?? [];

  // Sort deadlines by date
  const sorted = [...deadlines].sort(
    (a, b) => new Date(a.date_iso).getTime() - new Date(b.date_iso).getTime()
  );

  // Next upcoming deadline
  const nextDeadline = sorted.find(d => daysUntil(d.date_iso) >= 0);
  const nextDays = nextDeadline ? daysUntil(nextDeadline.date_iso) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(184,115,51,0.1)' }}>
          <Vote size={20} style={{ color: '#B87333' }} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: '#F0F4F8' }}>Election Center</h1>
          <p className="text-sm font-body" style={{ color: 'rgba(240,244,248,0.5)' }}>Everything you need to know before you vote</p>
        </div>
      </div>

      {loading && (
        <div className="text-center py-16">
          <div className="inline-block w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(184,115,51,0.3)', borderTopColor: '#B87333' }} />
          <p className="text-sm mt-3 font-body" style={{ color: 'rgba(240,244,248,0.5)' }}>Loading election data...</p>
        </div>
      )}

      {error && (
        <div className="az-alert az-alert-warn mb-6">
          <p className="font-body text-sm">Could not load election data: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Big Countdown */}
          {nextDeadline && nextDays !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="glass-card p-8 text-center mb-10"
            >
              <p className="az-label mb-3">Coming Up</p>
              <div className="az-countdown-num text-7xl md:text-8xl">
                {nextDays}
              </div>
              <p className="font-body text-lg mt-2" style={{ color: 'rgba(240,244,248,0.5)' }}>
                day{nextDays !== 1 ? 's' : ''} until{' '}
                <span className="font-semibold" style={{ color: '#F0F4F8' }}>{nextDeadline.label}</span>
              </p>
              {nextDeadline.label.toLowerCase().includes('filing') && (
                <p className="font-body text-sm mt-2" style={{ color: 'rgba(240,244,248,0.4)' }}>
                  Curious who's running for office? This is when candidates officially throw their hat in the ring.
                </p>
              )}
              <p className="font-body text-sm mt-1" style={{ color: 'rgba(240,244,248,0.3)' }}>{nextDeadline.date_display}</p>
              {nextDeadline.sublabel && (
                <p className="font-body text-xs mt-1" style={{ color: 'rgba(240,244,248,0.3)' }}>{nextDeadline.sublabel}</p>
              )}
            </motion.div>
          )}

          {/* All Deadlines */}
          <section className="mb-12">
            <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#F0F4F8' }}>
              <CalendarDays size={20} style={{ color: '#B87333' }} />
              Key Deadlines
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ gridAutoRows: '1fr' }}>
              {sorted.map((dl, i) => {
                const days = daysUntil(dl.date_iso);
                const isPast = days < 0;

                return (
                  <motion.div
                    key={dl.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className={`h-full ${isPast ? 'opacity-50' : ''}`}
                  >
                    <div className="glass-card p-4 h-full flex flex-col">
                      <div className="flex items-start justify-between gap-2 flex-1">
                        <div className="flex-1">
                          <p className="az-label text-2xs mb-1">{dl.date_display}</p>
                          <h3 className="font-display font-bold text-sm" style={{ color: '#F0F4F8' }}>{dl.label}</h3>
                          {dl.sublabel && (
                            <p className="font-body text-xs mt-0.5" style={{ color: 'rgba(240,244,248,0.4)' }}>{dl.sublabel}</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0 min-h-[3rem]">
                          {isPast ? (
                            <span className="font-ui font-semibold text-xs uppercase tracking-wider" style={{ color: 'rgba(240,244,248,0.3)' }}>Past</span>
                          ) : (
                            <div>
                              <span className="az-countdown-num text-2xl">{days}</span>
                              <p className="font-body text-2xs" style={{ color: 'rgba(240,244,248,0.3)' }}>day{days !== 1 ? 's' : ''}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {dl.urgent === 1 && !isPast && (
                        <div className="flex items-center gap-1 mt-auto pt-2">
                          <Clock size={12} style={{ color: '#B87333' }} />
                          <span className="font-ui text-2xs font-bold uppercase tracking-wider" style={{ color: '#B87333' }}>Urgent</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {sorted.length === 0 && (
              <p className="text-sm font-body text-center py-8" style={{ color: 'rgba(240,244,248,0.4)' }}>No deadlines listed yet.</p>
            )}
          </section>

          {/* Race Ratings */}
          {races.length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#F0F4F8' }}>
                <Vote size={20} style={{ color: '#2D5A3D' }} />
                Race Ratings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ gridAutoRows: '1fr' }}>
                {races.map((race, i) => (
                  <motion.div
                    key={race.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="h-full"
                  >
                    <div className="glass-card p-4 h-full flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-display font-bold text-sm" style={{ color: '#F0F4F8' }}>{race.name}</h3>
                        {race.level && <span className={`zone-badge ${zoneBadgeClass(race.level)}`}>{race.level}</span>}
                      </div>
                      <div className="flex-1">
                        {race.rating && (
                          <p className="font-display font-bold text-sm" style={{ color: '#B87333' }}>{race.rating}</p>
                        )}
                        {race.context && (
                          <p className="font-body text-xs mt-1 line-clamp-2" style={{ color: 'rgba(240,244,248,0.5)' }}>{race.context}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* External Resources */}
          <section>
            <div className="az-divider mb-6" />
            <h2 className="font-display text-lg font-bold mb-4" style={{ color: '#F0F4F8' }}>Voter Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ResourceLink
                href="https://azsos.gov/elections"
                label="AZ Elections"
                description="Official Arizona Secretary of State elections page"
              />
              <ResourceLink
                href="https://voter.azsos.gov/VoterView/RegistrationSearch.do"
                label="Check Registration"
                description="Verify your voter registration status"
              />
              <ResourceLink
                href="https://www.azcleanelections.gov/"
                label="Clean Elections"
                description="Arizona Citizens Clean Elections Commission"
              />
            </div>
          </section>
        </>
      )}
    </motion.div>
  );
}

function ResourceLink({ href, label, description }: { href: string; label: string; description: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="glass-card p-4 group"
    >
      <div className="flex items-center gap-2 mb-1">
        <ExternalLink size={14} style={{ color: '#B87333' }} />
        <span className="font-ui font-semibold text-xs uppercase tracking-wider transition-colors" style={{ color: '#B87333' }}>
          {label}
        </span>
      </div>
      <p className="font-body text-xs" style={{ color: 'rgba(240,244,248,0.4)' }}>{description}</p>
    </a>
  );
}
