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
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-terracotta/10">
          <Vote size={20} className="text-terracotta" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Election Center</h1>
          <p className="text-sm text-ink/50 font-body">Deadlines, races, and voter resources</p>
        </div>
      </div>

      {loading && (
        <div className="text-center py-16">
          <div className="inline-block w-6 h-6 border-2 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
          <p className="text-sm text-ink/50 mt-3 font-body">Loading election data...</p>
        </div>
      )}

      {error && (
        <div className="wpa-alert wpa-alert-warn mb-6">
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
              className="wpa-card p-8 text-center mb-10"
            >
              <p className="wpa-label mb-3">Next Deadline</p>
              <div className="wpa-countdown-num text-7xl md:text-8xl">
                {nextDays}
              </div>
              <p className="font-body text-ink/60 text-lg mt-2">
                day{nextDays !== 1 ? 's' : ''} until{' '}
                <span className="font-semibold text-ink">{nextDeadline.label}</span>
              </p>
              <p className="font-body text-sm text-ink/40 mt-1">{nextDeadline.date_display}</p>
              {nextDeadline.sublabel && (
                <p className="font-body text-xs text-ink/40 mt-1">{nextDeadline.sublabel}</p>
              )}
            </motion.div>
          )}

          {/* All Deadlines */}
          <section className="mb-12">
            <h2 className="font-display text-xl font-bold text-ink mb-4 flex items-center gap-2">
              <CalendarDays size={20} className="text-burgundy" />
              Key Deadlines
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sorted.map((dl, i) => {
                const days = daysUntil(dl.date_iso);
                const isPast = days < 0;

                return (
                  <motion.div
                    key={dl.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className={`wpa-card p-4 ${isPast ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="wpa-label text-2xs mb-1">{dl.date_display}</p>
                        <h3 className="font-display font-bold text-ink text-sm">{dl.label}</h3>
                        {dl.sublabel && (
                          <p className="font-body text-xs text-ink/50 mt-0.5">{dl.sublabel}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        {isPast ? (
                          <span className="font-ui font-semibold text-xs uppercase tracking-wider text-ink/40">Past</span>
                        ) : (
                          <div>
                            <span className="wpa-countdown-num text-2xl">{days}</span>
                            <p className="font-body text-2xs text-ink/40">day{days !== 1 ? 's' : ''}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {dl.urgent === 1 && !isPast && (
                      <div className="flex items-center gap-1 mt-2">
                        <Clock size={12} className="text-terracotta" />
                        <span className="font-ui text-2xs font-bold uppercase tracking-wider text-terracotta">Urgent</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {sorted.length === 0 && (
              <p className="text-sm text-ink/50 font-body text-center py-8">No deadlines listed yet.</p>
            )}
          </section>

          {/* Race Ratings */}
          {races.length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-xl font-bold text-ink mb-4 flex items-center gap-2">
                <Vote size={20} className="text-sage" />
                Race Ratings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {races.map((race, i) => (
                  <motion.div
                    key={race.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="wpa-card p-4"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-display font-bold text-ink text-sm">{race.name}</h3>
                      {race.level && <span className={`zone-badge ${zoneBadgeClass(race.level)}`}>{race.level}</span>}
                    </div>
                    {race.rating && (
                      <p className="font-display font-bold text-terracotta text-sm">{race.rating}</p>
                    )}
                    {race.context && (
                      <p className="font-body text-xs text-ink/60 mt-1">{race.context}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* External Resources */}
          <section>
            <div className="wpa-divider mb-6" />
            <h2 className="font-display text-lg font-bold text-ink mb-4">Voter Resources</h2>
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
      className="wpa-card p-4 group"
    >
      <div className="flex items-center gap-2 mb-1">
        <ExternalLink size={14} className="text-terracotta" />
        <span className="font-ui font-semibold text-xs uppercase tracking-wider text-terracotta group-hover:text-terracotta-dark transition-colors">
          {label}
        </span>
      </div>
      <p className="font-body text-xs text-ink/50">{description}</p>
    </a>
  );
}
