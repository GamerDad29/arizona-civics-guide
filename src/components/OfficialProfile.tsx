import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Mail, Phone, Globe, Twitter, Facebook,
  ExternalLink, Calendar, Award, Users, ChevronRight,
  FileText, TrendingUp
} from 'lucide-react';
import type { CivicOfficial } from '../types';
import type { UseCivicDataReturn } from '../hooks/useCivicData';

interface Props {
  official: CivicOfficial;
  onBack: () => void;
  enrichOfficial: UseCivicDataReturn['enrichOfficial'];
}

const PARTY_COLORS = {
  D: '#4f7ef5',
  R: '#f05353',
  I: '#9b6fe8',
  NP: '#4a5a72',
};

const PARTY_LABELS = { D: 'Democrat', R: 'Republican', I: 'Independent', NP: 'Nonpartisan' };

const LEVEL_LABELS = { local: 'Local', state: 'State', federal: 'Federal' };

function termProgress(termStart?: number, termEnd?: number): number {
  if (!termStart || !termEnd) return 0;
  const now = new Date().getFullYear() + new Date().getMonth() / 12;
  const progress = (now - termStart) / (termEnd - termStart);
  return Math.min(100, Math.max(0, Math.round(progress * 100)));
}

function Initials({ name, color }: { name: string; color: string }) {
  const parts = name.split(' ').filter(Boolean);
  const init = parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : name.substring(0, 2);
  return (
    <div
      className="w-16 h-16 rounded-xl flex items-center justify-center font-display font-bold text-xl flex-shrink-0"
      style={{ background: `${color}20`, color, border: `1.5px solid ${color}35` }}
    >
      {init.toUpperCase()}
    </div>
  );
}

export function OfficialProfile({ official: initialOfficial, onBack, enrichOfficial }: Props) {
  const [official, setOfficial] = useState(initialOfficial);
  const [activeTab, setActiveTab] = useState<'overview' | 'votes' | 'legislation' | 'contact'>('overview');

  const partyColor = PARTY_COLORS[official.party ?? 'NP'];
  const progress = termProgress(official.termStart, official.termEnd);

  // Enrich with Congress data if federal
  useEffect(() => {
    if (official.level === 'federal' && !official.congressData?.sponsoredBills) {
      enrichOfficial(official).then(enriched => {
        if (enriched !== official) setOfficial(enriched);
      });
    }
  }, [official.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasVotes = official.votes && official.votes.length > 0;
  const hasBills = official.congressData?.sponsoredBills && official.congressData.sponsoredBills.length > 0;

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    ...(hasVotes ? [{ id: 'votes' as const, label: 'Votes' }] : []),
    ...(official.level === 'federal' ? [{ id: 'legislation' as const, label: 'Legislation' }] : []),
    { id: 'contact' as const, label: 'Contact' },
  ];

  return (
    <motion.div
      key={official.id}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="min-h-full"
      style={{ borderLeft: `3px solid ${partyColor}` }}
    >
      {/* Back bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3"
        style={{ background: '#0d1220', borderBottom: '1px solid #1f2d45' }}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text2 hover:text-text1 text-sm font-medium transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <span className={`level-badge level-${official.level}`}>{LEVEL_LABELS[official.level]}</span>
          {official.party && (
            <span className={`party-badge ${official.party.toLowerCase()}`}>{PARTY_LABELS[official.party]}</span>
          )}
        </div>
      </div>

      {/* Hero block */}
      <div className="px-6 py-6" style={{ background: '#0f1520' }}>
        <div className="flex items-start gap-5">
          {/* Photo or initials */}
          {official.photoUrl ? (
            <img
              src={official.photoUrl}
              alt={official.name}
              className="w-16 h-16 rounded-xl object-cover object-top flex-shrink-0"
              style={{ border: `1.5px solid ${partyColor}35` }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <Initials name={official.name} color={partyColor} />
          )}

          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-text1 text-2xl leading-tight mb-1">{official.name}</h1>
            <p className="text-text2 text-sm mb-3">{official.title}</p>

            {/* Meta row */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text3">
              {official.elected && <span>Elected {official.elected}</span>}
              {official.termStart && official.termEnd && (
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {official.termStart}–{official.termEnd}
                </span>
              )}
              {official.nextElection && (
                <span className={official.nextElectionSafe ? 'text-success/80' : 'text-warn/80'}>
                  Next election: {official.nextElection}
                </span>
              )}
            </div>

            {/* Term progress */}
            {official.termStart && official.termEnd && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="label-xs">Term Progress</span>
                  <span className="text-xs text-text3">{progress}%</span>
                </div>
                <div className="term-track">
                  <motion.div
                    className="term-fill"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick contact strip */}
        <div className="flex flex-wrap gap-2 mt-5">
          {official.contacts.slice(0, 4).map((c, i) => {
            const icons = { email: Mail, phone: Phone, web: Globe, twitter: Twitter, facebook: Facebook, web_alt: Globe };
            const Icon = icons[c.icon as keyof typeof icons] ?? Globe;
            const isEmail = c.icon === 'email';
            return (
              <a key={i} href={c.href} target={isEmail ? undefined : '_blank'} rel="noreferrer"
                className={`btn ${isEmail ? 'btn-copper-outline' : 'btn-outline'}`}
                onClick={e => e.stopPropagation()}
              >
                <Icon size={12} />
                {isEmail ? 'Email' : c.label}
              </a>
            );
          })}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-border px-6 gap-1" style={{ background: '#0d1220' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-3 text-xs font-semibold transition-all relative"
            style={{
              color: activeTab === tab.id ? partyColor : '#4a5a72',
              borderBottom: activeTab === tab.id ? `2px solid ${partyColor}` : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-6 py-5 space-y-5">
        {/* ── Overview tab ────────────────────────────── */}
        {activeTab === 'overview' && (
          <>
            {official.bio && (
              <div>
                <p className="label-copper mb-2">About</p>
                <p className="text-text2 text-sm leading-relaxed">{official.bio}</p>
              </div>
            )}

            {official.background && official.background.length > 0 && (
              <div>
                <p className="label-copper mb-2">Background</p>
                <ul className="space-y-1.5">
                  {official.background.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text2">
                      <ChevronRight size={13} className="text-copper mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {official.priorities && official.priorities.length > 0 && (
              <div>
                <p className="label-copper mb-2 flex items-center gap-1.5">
                  <Award size={11} />
                  Priority Areas
                </p>
                <div className="flex flex-wrap gap-2">
                  {official.priorities.map((p, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full"
                      style={{ background: `${partyColor}12`, color: partyColor, border: `1px solid ${partyColor}25` }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {official.backers && official.backers.length > 0 && (
              <div>
                <p className="label-copper mb-2 flex items-center gap-1.5">
                  <Users size={11} />
                  Political Backing
                </p>
                <div className="flex flex-wrap gap-2">
                  {official.backers.map((b, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full bg-raised border border-border text-text2">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* External links */}
            <div>
              <p className="label-copper mb-2">Resources</p>
              <div className="flex flex-wrap gap-2">
                {official.congressGovUrl && (
                  <a href={official.congressGovUrl} target="_blank" rel="noreferrer" className="btn btn-outline text-xs">
                    <TrendingUp size={11} /> Voting Records
                  </a>
                )}
                {official.fecUrl && (
                  <a href={official.fecUrl} target="_blank" rel="noreferrer" className="btn btn-outline text-xs">
                    <ExternalLink size={11} /> Campaign Finance
                  </a>
                )}
                {official.ballotpediaUrl && (
                  <a href={official.ballotpediaUrl} target="_blank" rel="noreferrer" className="btn btn-outline text-xs">
                    <ExternalLink size={11} /> Ballotpedia
                  </a>
                )}
                {official.links?.map((l, i) => (
                  <a key={i} href={l.href} target="_blank" rel="noreferrer" className="btn btn-outline text-xs">
                    <ExternalLink size={11} /> {l.label}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Votes tab ───────────────────────────────── */}
        {activeTab === 'votes' && hasVotes && (
          <div className="space-y-2">
            <p className="label-copper mb-3">Recent Votes</p>
            {official.votes!.map((v, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg"
                style={{ background: '#131928', border: '1px solid #1f2d45' }}>
                <span className={`vote-badge vote-${v.vote} mt-0.5`}>
                  {v.vote.toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text1 leading-snug">{v.bill}</p>
                  <p className="text-xs text-text3 mt-0.5">{v.date} — {v.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Legislation tab ─────────────────────────── */}
        {activeTab === 'legislation' && (
          <div>
            <p className="label-copper mb-3 flex items-center gap-1.5">
              <FileText size={11} />
              Sponsored Legislation
            </p>
            {!hasBills && (
              <div className="text-center py-8 text-text3 text-sm">
                {!import.meta.env.VITE_CONGRESS_API_KEY
                  ? 'Add VITE_CONGRESS_API_KEY to see live sponsored legislation'
                  : 'Loading legislation data...'}
              </div>
            )}
            {hasBills && (
              <div className="space-y-2">
                {official.congressData!.sponsoredBills!.map((b, i) => (
                  <div key={i} className="p-3 rounded-lg" style={{ background: '#131928', border: '1px solid #1f2d45' }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text1 leading-snug">{b.title}</p>
                        <p className="text-xs text-text3 mt-1">{b.introducedDate} · {b.number}</p>
                        {b.latestAction && (
                          <p className="text-xs text-text3 mt-0.5 truncate">{b.latestAction}</p>
                        )}
                      </div>
                      {b.url && (
                        <a href={b.url} target="_blank" rel="noreferrer"
                          className="text-text3 hover:text-copper transition-colors flex-shrink-0">
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Contact tab ─────────────────────────────── */}
        {activeTab === 'contact' && (
          <div className="space-y-3">
            <p className="label-copper mb-3">Contact {official.name.split(' ')[0]}</p>
            {official.contacts.map((c, i) => {
              const icons = { email: Mail, phone: Phone, web: Globe, twitter: Twitter, facebook: Facebook };
              const Icon = icons[c.icon as keyof typeof icons] ?? Globe;
              return (
                <a key={i} href={c.href} target={c.icon === 'email' ? undefined : '_blank'} rel="noreferrer"
                  className="flex items-center gap-4 p-3.5 rounded-lg transition-all group"
                  style={{ background: '#131928', border: '1px solid #1f2d45' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#2a3d5a')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#1f2d45')}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${partyColor}15` }}>
                    <Icon size={15} style={{ color: partyColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text3 font-semibold uppercase tracking-wider">{c.label}</p>
                    <p className="text-sm text-text2 truncate group-hover:text-text1 transition-colors">{c.value}</p>
                  </div>
                  <ExternalLink size={13} className="text-text3 group-hover:text-text2 flex-shrink-0 transition-colors" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
