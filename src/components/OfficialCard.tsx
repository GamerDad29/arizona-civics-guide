import { useState } from 'react';
import { Mail, Phone, Twitter, Facebook, Globe, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import type { Official } from '../data/officials';
import { PartyBadge } from './PartyBadge';
import { VoteBadge } from './VoteBadge';

interface Props {
  official: Official;
  highlight?: boolean;
}

const iconMap = {
  phone: Phone,
  email: Mail,
  twitter: Twitter,
  facebook: Facebook,
  web: Globe,
};

export function OfficialCard({ official, highlight }: Props) {
  const [expanded, setExpanded] = useState(false);

  const nextElectionClass = official.nextElectionSafe
    ? 'text-turq font-semibold'
    : 'text-copper font-semibold';

  return (
    <div className={`official-card ${highlight ? 'ring-2 ring-turq/60' : ''}`}>
      <div className="card-header-bar" />
      <div className="p-5">
        {/* Name row */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <div>
            <h3 className="font-display font-bold text-navy text-lg leading-tight">
              {official.name}
              {official.isUserDistrict && (
                <span className="ml-2 text-xs bg-turq/10 text-turq border border-turq/30 rounded px-2 py-0.5 align-middle">
                  YOUR REP
                </span>
              )}
            </h3>
            <p className="text-navy/60 text-sm mt-0.5">{official.title}</p>
          </div>
          {official.party && <PartyBadge party={official.party} size="sm" />}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy/50 mt-2 mb-3">
          {official.termStart && official.termEnd && (
            <span>Term: {official.termStart}–{official.termEnd}</span>
          )}
          {official.elected && <span>Elected: {official.elected}</span>}
          {official.nextElection && (
            <span className={nextElectionClass}>
              Next election: {official.nextElection}
            </span>
          )}
        </div>

        {/* Bio */}
        {official.bio && (
          <p className="text-navy/70 text-sm leading-relaxed mb-3">{official.bio}</p>
        )}

        {/* Contact buttons */}
        <div className="flex flex-wrap gap-2 mb-3">
          {official.contacts.map((c, i) => {
            const Icon = iconMap[c.icon];
            if (c.icon === 'email') {
              return (
                <a key={i} href={c.href} className="contact-btn email" onClick={e => e.stopPropagation()}>
                  <Icon size={13} />
                  Email
                </a>
              );
            }
            return (
              <a key={i} href={c.href} target="_blank" rel="noreferrer" className="contact-btn outline" onClick={e => e.stopPropagation()}>
                <Icon size={13} />
                {c.label}
              </a>
            );
          })}
        </div>

        {/* Election date badge */}
        {official.nextElection && official.ballotpediaUrl && (
          <a
            href={official.ballotpediaUrl}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded border transition-colors ${
              official.nextElectionSafe
                ? 'bg-turq/10 border-turq/40 text-turq hover:bg-turq/20'
                : 'bg-copper/10 border-copper/40 text-copper hover:bg-copper/20'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <ExternalLink size={11} />
            Next Election: {official.nextElection}
          </a>
        )}

        {/* Expandable detail */}
        {(official.background?.length || official.priorities?.length || official.votes?.length || official.links?.length) ? (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 mt-3 text-xs text-copper hover:text-copper-dark font-medium transition-colors"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {expanded ? 'Show less' : 'Full details'}
            </button>

            {expanded && (
              <div className="mt-4 space-y-4 border-t border-sand-200 pt-4">
                {official.background && official.background.length > 0 && (
                  <div>
                    <p className="section-label mb-2">Background</p>
                    <ul className="space-y-1">
                      {official.background.map((item, i) => (
                        <li key={i} className="text-sm text-navy/70 flex gap-2">
                          <span className="text-copper mt-0.5 shrink-0">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {official.priorities && official.priorities.length > 0 && (
                  <div>
                    <p className="section-label mb-2">Priority Areas</p>
                    <ul className="space-y-1">
                      {official.priorities.map((item, i) => (
                        <li key={i} className="text-sm text-navy/70 flex gap-2">
                          <span className="text-copper mt-0.5 shrink-0">—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {official.votes && official.votes.length > 0 && (
                  <div>
                    <p className="section-label mb-2">Recent Votes</p>
                    <div className="space-y-2">
                      {official.votes.map((v, i) => (
                        <div key={i} className="flex items-start gap-3 bg-sand-100 rounded p-2.5">
                          <VoteBadge vote={v.vote} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-navy leading-tight">{v.bill}</p>
                            <p className="text-xs text-navy/50 mt-0.5">{v.date} — {v.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {official.links && official.links.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {official.links.map((l, i) => (
                      <a key={i} href={l.href} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-navy/60 hover:text-turq border border-sand-200 rounded px-2.5 py-1 transition-colors"
                      >
                        <ExternalLink size={11} />
                        {l.label}
                      </a>
                    ))}
                    {official.congressGovUrl && (
                      <a href={official.congressGovUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-navy/60 hover:text-turq border border-sand-200 rounded px-2.5 py-1 transition-colors"
                      >
                        <ExternalLink size={11} />
                        Voting Records
                      </a>
                    )}
                    {official.fecUrl && (
                      <a href={official.fecUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-navy/60 hover:text-turq border border-sand-200 rounded px-2.5 py-1 transition-colors"
                      >
                        <ExternalLink size={11} />
                        Campaign Finance
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
