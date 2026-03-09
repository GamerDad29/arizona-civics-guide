import { motion } from 'framer-motion';
import { MapPin, Scale, Gavel, AlertTriangle } from 'lucide-react';
import type { CivicOfficial } from '../types';
import type { UseCivicDataReturn } from '../hooks/useCivicData';

const PARTY_COLORS: Record<string, string> = {
  D: '#4f7ef5', R: '#f05353', I: '#9b6fe8', NP: '#4a5a72',
};

function OfficialGridCard({ official, featured, onClick }: { official: CivicOfficial; featured?: boolean; onClick: () => void }) {
  const color = PARTY_COLORS[official.party ?? 'NP'];
  const initials = official.name.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <motion.button onClick={onClick} className={`official-card text-left w-full ${featured ? 'featured' : ''}`} whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <div className="party-stripe" style={{ background: `linear-gradient(90deg, ${color}, ${color}99)` }} />
      <div className="official-card-body">
        <div className="flex items-start gap-3 mb-3">
          {official.photoUrl ? (
            <img src={official.photoUrl} alt={official.name} className="rounded-lg object-cover object-top flex-shrink-0"
              style={{ width: 48, height: 48, border: `1.5px solid ${color}30` }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ) : (
            <div className="rounded-lg flex items-center justify-center flex-shrink-0 font-display font-bold text-base"
              style={{ width: 48, height: 48, background: `${color}15`, color, border: `1.5px solid ${color}25` }}>{initials}</div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display font-bold text-text1 text-sm leading-tight">{official.name}</h3>
              {official.party && official.party !== 'NP' && (
                <span className={`party-badge ${official.party.toLowerCase()} flex-shrink-0`}>{official.party}</span>
              )}
            </div>
            <p className="text-text2 text-xs mt-0.5">{official.title}</p>
          </div>
        </div>
        {official.bio && featured && <p className="text-text3 text-xs leading-relaxed mb-2 line-clamp-2">{official.bio}</p>}
        <div className="flex flex-wrap gap-x-3 text-2xs text-text3">
          {official.termStart && official.termEnd && <span>Term {official.termStart}–{official.termEnd}</span>}
          {official.nextElection && <span style={{ color: official.nextElectionSafe ? '#2fd77080' : '#f0a03080' }}>↻ {official.nextElection}</span>}
        </div>
        <div className="mt-2.5 text-2xs font-semibold flex items-center gap-1" style={{ color }}>View Profile →</div>
      </div>
    </motion.button>
  );
}

interface Props { civic: UseCivicDataReturn; onSelectOfficial: (o: CivicOfficial) => void; }

export function StateView({ civic, onSelectOfficial }: Props) {
  const stateOfficials = civic.officialsByLevel('state');
  const governor = stateOfficials.find(o => o.id === 'hobbs');
  const statewide = stateOfficials.filter(o => ['mayes', 'fontes'].includes(o.id));
  const sheriff = stateOfficials.find(o => o.id === 'skinner');
  const stateLeg = stateOfficials.filter(o => !['hobbs','mayes','fontes','skinner'].includes(o.id));

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <MapPin size={16} className="text-ind" />
          <span className="label-xs" style={{ color: '#9b6fe8' }}>State Government</span>
        </div>
        <h1 className="font-display font-bold text-text1 text-3xl mb-1">State of Arizona</h1>
        <p className="text-text2 text-sm">Statewide officials and the Arizona Legislature — all up for election in 2026.</p>
      </div>

      {governor && (
        <section className="mb-7">
          <p className="label-copper mb-3">Governor</p>
          <div className="max-w-sm">
            <OfficialGridCard official={governor} featured onClick={() => onSelectOfficial(governor)} />
          </div>
        </section>
      )}

      {statewide.length > 0 && (
        <section className="mb-7">
          <p className="label-copper mb-3 flex items-center gap-1.5"><Scale size={11} /> Statewide Officers</p>
          <motion.div className="grid grid-cols-2 gap-3 max-w-lg" variants={container} initial="hidden" animate="show">
            {statewide.map(o => (
              <motion.div key={o.id} variants={item}>
                <OfficialGridCard official={o} onClick={() => onSelectOfficial(o)} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {sheriff && (
        <section className="mb-7">
          <p className="label-copper mb-3 flex items-center gap-1.5"><Gavel size={11} /> Maricopa County</p>
          <div className="max-w-sm">
            <OfficialGridCard official={sheriff} onClick={() => onSelectOfficial(sheriff)} />
          </div>
        </section>
      )}

      {/* AZ Legislature */}
      <section className="mb-7">
        <p className="label-copper mb-3">Arizona State Legislature</p>
        <div className="alert alert-warn mb-3 flex gap-2 items-start">
          <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
          <span>Your specific legislators depend on your address. Use the address input to find them, or the District Finder below.</span>
        </div>
        <div className="p-4 rounded-lg text-sm text-text2 space-y-2" style={{ background: '#131928', border: '1px solid #1f2d45' }}>
          <p>Arizona has <strong className="text-text1">30 Legislative Districts</strong>, each electing 1 State Senator + 2 State Representatives.</p>
          <p>Current: <span className="text-rep font-medium">16R</span> / <span className="text-dem font-medium">14D</span> Senate · <span className="text-rep font-medium">33R</span> / <span className="text-dem font-medium">27D</span> House</p>
          <p>All 90 seats on ballot in <strong className="text-warn">August & November 2026.</strong></p>
        </div>
        {stateLeg.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {stateLeg.map(o => <OfficialGridCard key={o.id} official={o} onClick={() => onSelectOfficial(o)} />)}
          </div>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          <a href="https://www.azleg.gov/find-my-legislator/" target="_blank" rel="noreferrer" className="btn btn-outline text-xs">Find My Legislators</a>
          <a href="https://www.azleg.gov/" target="_blank" rel="noreferrer" className="btn btn-outline text-xs">AZ Legislature</a>
          <a href="https://www.azleg.gov/votes/" target="_blank" rel="noreferrer" className="btn btn-outline text-xs">Voting Records</a>
        </div>
      </section>
    </div>
  );
}
