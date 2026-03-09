import { motion } from 'framer-motion';
import { Building2, Users, GraduationCap } from 'lucide-react';
import type { CivicOfficial } from '../types';
import type { UseCivicDataReturn } from '../hooks/useCivicData';
import { AddressInput } from '../components/AddressInput';
import { buildStaticOfficials } from '../services/civicService';

const PARTY_COLORS: Record<string, string> = {
  D: '#4f7ef5', R: '#f05353', I: '#9b6fe8', NP: '#4a5a72',
};

interface OfficialGridCardProps {
  official: CivicOfficial;
  featured?: boolean;
  onClick: () => void;
}

function OfficialGridCard({ official, featured, onClick }: OfficialGridCardProps) {
  const color = PARTY_COLORS[official.party ?? 'NP'];
  const initials = official.name.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <motion.button
      onClick={onClick}
      className={`official-card text-left w-full ${featured ? 'featured' : ''}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <div className="party-stripe" style={{ background: `linear-gradient(90deg, ${color}, ${color}99)` }} />
      <div className="official-card-body">
        <div className="flex items-start gap-3 mb-3">
          {official.photoUrl ? (
            <img src={official.photoUrl} alt={official.name}
              className="rounded-lg object-cover object-top flex-shrink-0"
              style={{ width: featured ? 56 : 44, height: featured ? 56 : 44, border: `1.5px solid ${color}30` }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div className="rounded-lg flex items-center justify-center flex-shrink-0 font-display font-bold"
              style={{ width: featured ? 56 : 44, height: featured ? 56 : 44, background: `${color}15`, color, fontSize: featured ? '1.1rem' : '0.9rem', border: `1.5px solid ${color}25` }}>
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display font-bold text-text1 leading-tight" style={{ fontSize: featured ? '1.05rem' : '0.9rem' }}>
                {official.name}
              </h3>
              {official.party && official.party !== 'NP' && (
                <span className={`party-badge ${official.party.toLowerCase()} flex-shrink-0`}>{official.party}</span>
              )}
            </div>
            <p className="text-text2 text-xs mt-0.5 leading-snug">{official.title}</p>
            {official.isUserDistrict && (
              <span className="inline-flex items-center mt-1 text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{ background: '#1cb0be18', color: '#1cb0be', border: '1px solid #1cb0be30' }}>
                Your Rep
              </span>
            )}
          </div>
        </div>

        {official.bio && featured && (
          <p className="text-text3 text-xs leading-relaxed mb-3 line-clamp-2">{official.bio}</p>
        )}

        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-2xs text-text3">
          {official.termStart && official.termEnd && <span>Term {official.termStart}–{official.termEnd}</span>}
          {official.nextElection && (
            <span style={{ color: official.nextElectionSafe ? '#2fd77080' : '#f0a03080' }}>
              ↻ {official.nextElection}
            </span>
          )}
        </div>

        <div className="mt-3 text-2xs font-semibold flex items-center gap-1" style={{ color }}>
          View Profile <span style={{ fontSize: '0.7rem' }}>→</span>
        </div>
      </div>
    </motion.button>
  );
}

interface Props {
  civic: UseCivicDataReturn;
  onSelectOfficial: (o: CivicOfficial) => void;
}

export function LocalView({ civic, onSelectOfficial }: Props) {
  const localOfficials = civic.officialsByLevel('local');
  const mayor = localOfficials.find(o => o.id === 'freeman');
  const council = localOfficials.filter(o => ['adams','taylor','heredia','duff','goforth','somers'].includes(o.id));
  const board = buildStaticOfficials().filter(o => ['tavolacci','thomason','ketchmark','perry','williams'].includes(o.id));

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <Building2 size={16} className="text-turq" />
          <span className="label-xs" style={{ color: '#1cb0be' }}>Local Government</span>
        </div>
        <h1 className="font-display font-bold text-text1 text-3xl mb-1">City of Mesa</h1>
        <p className="text-text2 text-sm">
          Your most immediate representatives — local government shapes your daily life.
        </p>
      </div>

      {/* Address hero if no address */}
      {civic.addressStatus === 'idle' && (
        <div className="mb-8 rounded-xl overflow-hidden" style={{ border: '1px solid #1f2d45', background: '#0f1520' }}>
          <AddressInput
            value={civic.address}
            normalizedAddress={civic.normalizedAddress}
            status={civic.addressStatus}
            error={civic.addressError}
            onSubmit={civic.submitAddress}
            onClear={civic.clearAddress}
            variant="hero"
          />
        </div>
      )}

      {/* Mayor */}
      {mayor && (
        <section className="mb-7">
          <p className="label-copper mb-3 flex items-center gap-1.5"><Users size={11} /> Mayor</p>
          <div className="max-w-sm">
            <OfficialGridCard official={mayor} featured onClick={() => onSelectOfficial(mayor)} />
          </div>
        </section>
      )}

      {/* City Council */}
      {council.length > 0 && (
        <section className="mb-7">
          <p className="label-copper mb-3 flex items-center gap-1.5"><Users size={11} /> City Council</p>
          <motion.div className="grid grid-cols-2 lg:grid-cols-3 gap-3" variants={container} initial="hidden" animate="show">
            {council.map(o => (
              <motion.div key={o.id} variants={item}>
                <OfficialGridCard official={o} featured={!!o.isUserDistrict} onClick={() => onSelectOfficial(o)} />
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-3 alert alert-info text-xs">
            <strong>District 6 seat up for election November 2026.</strong> Your councilmember is Vice Mayor Scott Somers.
          </div>
        </section>
      )}

      {/* School Board */}
      {board.length > 0 && (
        <section>
          <p className="label-copper mb-3 flex items-center gap-1.5"><GraduationCap size={11} /> Mesa Public Schools Board</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {board.map(o => (
              <OfficialGridCard key={o.id} official={o} onClick={() => onSelectOfficial(o)} />
            ))}
          </div>
          <div className="mt-3 p-3 rounded-lg text-xs text-text3" style={{ background: '#131928', border: '1px solid #1f2d45' }}>
            All-mesa at-large elections · ~$1.2B annual budget · 60,000 students · 85+ schools
          </div>
        </section>
      )}
    </div>
  );
}
