import { motion } from 'framer-motion';
import { Landmark, AlertTriangle } from 'lucide-react';
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
              style={{ width: 52, height: 52, border: `1.5px solid ${color}30` }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ) : (
            <div className="rounded-lg flex items-center justify-center flex-shrink-0 font-display font-bold text-lg"
              style={{ width: 52, height: 52, background: `${color}15`, color, border: `1.5px solid ${color}25` }}>{initials}</div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display font-bold text-text1 leading-tight" style={{ fontSize: '0.95rem' }}>{official.name}</h3>
              {official.party && <span className={`party-badge ${official.party.toLowerCase()} flex-shrink-0`}>{official.party}</span>}
            </div>
            <p className="text-text2 text-xs mt-0.5">{official.title}</p>
          </div>
        </div>
        {official.bio && <p className="text-text3 text-xs leading-relaxed mb-2 line-clamp-2">{official.bio}</p>}
        <div className="flex flex-wrap gap-x-3 text-2xs text-text3">
          {official.termStart && official.termEnd && <span>Term {official.termStart}–{official.termEnd}</span>}
          {official.nextElection && <span style={{ color: official.nextElectionSafe ? '#2fd77080' : '#f0a03080' }}>↻ {official.nextElection}</span>}
          {official.congressData?.sponsoredCount != null && (
            <span className="text-text3">{official.congressData.sponsoredCount} bills sponsored</span>
          )}
        </div>
        <div className="mt-2.5 text-2xs font-semibold flex items-center gap-1" style={{ color }}>View Profile →</div>
      </div>
    </motion.button>
  );
}

interface Props { civic: UseCivicDataReturn; onSelectOfficial: (o: CivicOfficial) => void; }

export function FederalView({ civic, onSelectOfficial }: Props) {
  const fedOfficials = civic.officialsByLevel('federal');
  const senators = fedOfficials.filter(o => ['gallego','kelly'].includes(o.id));
  const house = fedOfficials.filter(o => ['stanton','biggs'].includes(o.id));

  // Enrich senators with congress data from congressMembers
  const enrichedSenators = senators.map(s => {
    const cm = civic.congressMembers.find(m => m.bioguideId === (s.bioguideId ?? s.congressGovUrl?.split('/').pop()));
    if (cm && !s.congressData) return { ...s, congressData: cm };
    return s;
  });

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <Landmark size={16} className="text-dem" />
          <span className="label-xs" style={{ color: '#4f7ef5' }}>Federal Government</span>
        </div>
        <h1 className="font-display font-bold text-text1 text-3xl mb-1">U.S. Congress</h1>
        <p className="text-text2 text-sm">Your two U.S. Senators (all Arizona) and your congressional district representative.</p>
      </div>

      <section className="mb-7">
        <p className="label-copper mb-3">U.S. Senators — Arizona</p>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" variants={container} initial="hidden" animate="show">
          {enrichedSenators.map(o => (
            <motion.div key={o.id} variants={item}>
              <OfficialGridCard official={o} featured onClick={() => onSelectOfficial(o)} />
            </motion.div>
          ))}
        </motion.div>
        <div className="flex flex-wrap gap-2 mt-3">
          <a href="https://www.senate.gov/senators/senators-contact.htm" target="_blank" rel="noreferrer" className="btn btn-outline text-xs">Senate Contact Portal</a>
          <a href="https://www.congress.gov/" target="_blank" rel="noreferrer" className="btn btn-outline text-xs">Congress.gov</a>
        </div>
      </section>

      <section>
        <p className="label-copper mb-3">U.S. House Representative</p>
        <div className="alert alert-warn mb-3 flex gap-2 items-start text-xs">
          <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
          <span>Highland Ridge may be in CD-04 (Greg Stanton) or CD-05 (Andy Biggs). Enter your address in the sidebar to confirm.</span>
        </div>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" variants={container} initial="hidden" animate="show">
          {house.map(o => (
            <motion.div key={o.id} variants={item}>
              <OfficialGridCard official={o} onClick={() => onSelectOfficial(o)} />
            </motion.div>
          ))}
        </motion.div>
        <div className="flex flex-wrap gap-2 mt-3">
          <a href="https://www.house.gov/representatives/find-your-representative" target="_blank" rel="noreferrer" className="btn btn-outline text-xs">Find Your Rep</a>
          <a href="https://www.fec.gov/data/" target="_blank" rel="noreferrer" className="btn btn-outline text-xs">FEC Campaign Finance</a>
        </div>
      </section>
    </div>
  );
}
