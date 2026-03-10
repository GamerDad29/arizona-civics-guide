import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Mail, Phone, Globe, ExternalLink,
  MapPin, FileText, User,
} from 'lucide-react';
import { fetchRepresentativeById } from '../lib/api';
import type { Representative } from '../lib/api';
import { useApi } from '../hooks/useApi';

type Zone = 'local' | 'state' | 'federal';

const ZONE_COLORS: Record<Zone, { from: string; to: string; bar: string; badge: string }> = {
  local:   { from: '#7B1D3A', to: '#5C1129', bar: '#7B1D3A', badge: 'zone-badge-local' },
  state:   { from: '#5C7A5E', to: '#3E5A40', bar: '#5C7A5E', badge: 'zone-badge-state' },
  federal: { from: '#5A8A90', to: '#3D6569', bar: '#A8C4C8', badge: 'zone-badge-federal' },
};

const TABS = ['Overview', 'Votes', 'Contact'] as const;
type Tab = (typeof TABS)[number];

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
  return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function termProgress(start: number | null, end: number | null): number {
  if (!start || !end) return 0;
  const now = new Date().getFullYear();
  if (now >= end) return 100;
  if (now <= start) return 0;
  return Math.round(((now - start) / (end - start)) * 100);
}

function contactIcon(icon: string) {
  switch (icon.toLowerCase()) {
    case 'mail': case 'email': return <Mail size={16} />;
    case 'phone': return <Phone size={16} />;
    case 'globe': case 'web': case 'website': return <Globe size={16} />;
    case 'mappin': case 'map': case 'office': return <MapPin size={16} />;
    default: return <Globe size={16} />;
  }
}

export function RepDetailPage() {
  const [, params] = useRoute('/representatives/:id');
  const id = params?.id ?? '';
  const [tab, setTab] = useState<Tab>('Overview');

  const { data: rep, loading, error } = useApi<Representative>(
    () => fetchRepresentativeById(id),
    [id]
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-6 h-6 border-2 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
        <p className="text-sm text-ink/50 mt-3 font-body">Loading profile...</p>
      </div>
    );
  }

  if (error || !rep) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="wpa-alert wpa-alert-warn mb-4">
          <p className="font-body text-sm">{error ?? 'Representative not found.'}</p>
        </div>
        <Link href="/representatives" className="btn btn-outline">
          <ArrowLeft size={14} /> Back to Representatives
        </Link>
      </div>
    );
  }

  const zone = (rep.level ?? 'local') as Zone;
  const zc = ZONE_COLORS[zone] ?? ZONE_COLORS.local;
  const progress = termProgress(rep.term_start, rep.term_end);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${zc.from}, ${zc.to})` }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)',
          }}
        />
        <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
          <Link href="/representatives" className="inline-flex items-center gap-1.5 text-cream/70 hover:text-cream font-ui font-semibold text-xs uppercase tracking-wider mb-6 transition-colors">
            <ArrowLeft size={14} /> All Representatives
          </Link>

          <div className="flex items-start gap-5">
            {rep.photo_url ? (
              <img
                src={rep.photo_url}
                alt={rep.name}
                className="w-24 h-24 rounded-xl object-cover border-2 border-white/20 flex-shrink-0"
              />
            ) : (
              <div className="w-24 h-24 rounded-xl flex items-center justify-center font-display font-bold text-3xl text-white/90 bg-white/10 flex-shrink-0 border-2 border-white/20">
                {initials(rep.name)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h1 className="font-display text-3xl font-bold text-cream leading-tight">{rep.name}</h1>
              <p className="font-body text-cream/70 text-sm mt-1">{rep.title}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={partyClass(rep.party)} style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.25)', color: '#FAF8F2' }}>
                  {partyLabel(rep.party)}
                </span>
                <span className={zc.badge}>{rep.level}</span>
                {rep.district && <span className="wpa-label text-cream/60">{rep.district}</span>}
              </div>
            </div>
          </div>

          {/* Term progress */}
          {(rep.term_start || rep.term_end) && (
            <div className="mt-6">
              <div className="flex justify-between text-xs font-ui text-cream/50 mb-1.5 uppercase tracking-wider">
                <span>{rep.term_start ?? '?'}</span>
                <span>{rep.term_end ?? '?'}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: '#EDE8D830' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${progress}%`, background: '#C4623A' }}
                />
              </div>
              <p className="text-2xs text-cream/40 mt-1 font-body">
                {progress}% of current term
                {rep.next_election && <span> &middot; Next election {rep.next_election}</span>}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex gap-6 border-b border-sand-dark mt-1">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="relative py-3 font-ui font-semibold text-xs uppercase tracking-wider transition-colors"
              style={{ color: tab === t ? '#C4623A' : '#1C1A1860' }}
            >
              {t}
              {tab === t && (
                <motion.div
                  layoutId="rep-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: '#C4623A' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="py-6"
        >
          {tab === 'Overview' && <OverviewTab rep={rep} />}
          {tab === 'Votes' && <VotesTab rep={rep} />}
          {tab === 'Contact' && <ContactTab rep={rep} />}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ── Overview Tab ──────────────────────────────────── */
function OverviewTab({ rep }: { rep: Representative }) {
  return (
    <div className="space-y-6">
      {rep.bio && (
        <div>
          <h3 className="font-display font-bold text-ink text-lg mb-2">About</h3>
          <p className="font-body text-ink/80 text-sm leading-relaxed">{rep.bio}</p>
        </div>
      )}

      {rep.background && rep.background.length > 0 && (
        <div>
          <h3 className="font-display font-bold text-ink text-lg mb-2">Background</h3>
          <ul className="space-y-1.5">
            {rep.background.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm font-body text-ink/70">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {rep.priorities && rep.priorities.length > 0 && (
        <div>
          <h3 className="font-display font-bold text-ink text-lg mb-2">Priorities</h3>
          <div className="flex flex-wrap gap-2">
            {rep.priorities.map((p, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs font-ui font-semibold uppercase tracking-wider bg-terracotta/10 text-terracotta border border-terracotta/20">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {rep.backers && rep.backers.length > 0 && (
        <div>
          <h3 className="font-display font-bold text-ink text-lg mb-2">Notable Backers</h3>
          <ul className="space-y-1.5">
            {rep.backers.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm font-body text-ink/70">
                <User size={14} className="mt-0.5 text-ink/30 flex-shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!rep.bio && !rep.background?.length && !rep.priorities?.length && (
        <div className="wpa-alert wpa-alert-info">
          <p className="text-sm font-body">No detailed information available for this representative yet.</p>
        </div>
      )}
    </div>
  );
}

/* ── Votes Tab ─────────────────────────────────────── */
function VotesTab({ rep }: { rep: Representative }) {
  if (!rep.votes || rep.votes.length === 0) {
    return (
      <div className="wpa-alert wpa-alert-info">
        <p className="text-sm font-body">No voting records available for this representative.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rep.votes.map((v, i) => (
        <div key={i} className="wpa-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-ink text-sm">{v.bill}</p>
              <p className="font-body text-xs text-ink/60 mt-0.5">{v.description}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                className="px-2 py-0.5 rounded text-xs font-ui font-bold uppercase tracking-wider"
                style={{
                  background: v.vote.toLowerCase() === 'yea' ? '#5C7A5E15' : v.vote.toLowerCase() === 'nay' ? '#7B1D3A15' : '#C4623A15',
                  color: v.vote.toLowerCase() === 'yea' ? '#5C7A5E' : v.vote.toLowerCase() === 'nay' ? '#7B1D3A' : '#C4623A',
                }}
              >
                {v.vote}
              </span>
              <span className="text-2xs text-ink/40 font-body">{v.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Contact Tab ───────────────────────────────────── */
function ContactTab({ rep }: { rep: Representative }) {
  const hasContacts = rep.contacts && rep.contacts.length > 0;
  const hasLinks = rep.ballotpedia_url || rep.congress_gov_url || rep.fec_url || (rep.links && rep.links.length > 0);

  if (!hasContacts && !hasLinks) {
    return (
      <div className="wpa-alert wpa-alert-info">
        <p className="text-sm font-body">No contact information available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {hasContacts && (
        <div>
          <h3 className="font-display font-bold text-ink text-lg mb-3">Contact Methods</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rep.contacts.map((c, i) => (
              <a
                key={i}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className="wpa-card p-3 flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-lg bg-terracotta/10 flex items-center justify-center text-terracotta flex-shrink-0">
                  {contactIcon(c.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="wpa-label text-2xs">{c.label}</p>
                  <p className="font-body text-sm text-ink truncate group-hover:text-terracotta transition-colors">
                    {c.value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {hasLinks && (
        <div>
          <h3 className="font-display font-bold text-ink text-lg mb-3">External Links</h3>
          <div className="space-y-2">
            {rep.ballotpedia_url && (
              <ExternalLinkRow href={rep.ballotpedia_url} label="Ballotpedia Profile" icon={<FileText size={14} />} />
            )}
            {rep.congress_gov_url && (
              <ExternalLinkRow href={rep.congress_gov_url} label="Congress.gov" icon={<Globe size={14} />} />
            )}
            {rep.fec_url && (
              <ExternalLinkRow href={rep.fec_url} label="FEC Filings" icon={<FileText size={14} />} />
            )}
            {rep.links?.map((lnk, i) => (
              <ExternalLinkRow key={i} href={lnk.href} label={lnk.label} icon={<ExternalLink size={14} />} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ExternalLinkRow({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sand-dark/50 transition-colors group"
    >
      <span className="text-ink/40 group-hover:text-terracotta transition-colors">{icon}</span>
      <span className="font-body text-sm text-ink/70 group-hover:text-terracotta transition-colors flex-1">{label}</span>
      <ExternalLink size={12} className="text-ink/30" />
    </a>
  );
}
