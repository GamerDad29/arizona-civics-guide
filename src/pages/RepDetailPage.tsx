import { useState } from 'react';
import { useRoute, Link, useSearch } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Mail, Phone, Globe, ExternalLink,
  MapPin, FileText, User, Calendar, ChevronDown,
  Award, Target, Users, Briefcase,
} from 'lucide-react';
import { fetchRepresentativeById } from '../lib/api';
import type { Representative } from '../lib/api';
import { useApi } from '../hooks/useApi';

type Zone = 'local' | 'state' | 'federal';

const ZONE_COLORS: Record<Zone, { from: string; to: string; badge: string }> = {
  local:   { from: '#B87333', to: '#8B5A2B', badge: 'zone-badge-local' },
  state:   { from: '#2D5A3D', to: '#1D3A27', badge: 'zone-badge-state' },
  federal: { from: '#87CEEB', to: '#4A90B0', badge: 'zone-badge-federal' },
};

const ZONE_LABELS: Record<Zone, string> = {
  local: 'Local', state: 'State', federal: 'Federal',
};

function partyLabel(party: string | null) {
  if (!party) return 'Nonpartisan';
  const p = party.toLowerCase();
  if (p.startsWith('d')) return 'Democrat';
  if (p.startsWith('r')) return 'Republican';
  if (p === 'nonpartisan') return 'Nonpartisan';
  return party;
}

function partyClass(party: string | null) {
  if (!party) return 'party-badge party-i';
  const p = party.toLowerCase();
  if (p.startsWith('d')) return 'party-badge party-d';
  if (p.startsWith('r')) return 'party-badge party-r';
  return 'party-badge party-i';
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function termProgress(start: number | null, end: number | null): number {
  if (!start || !end) return 0;
  const now = new Date().getFullYear() + (new Date().getMonth() / 12);
  if (now >= end) return 100;
  if (now <= start) return 0;
  return Math.round(((now - start) / (end - start)) * 100);
}

function daysUntilElection(year: number | null): number | null {
  if (!year) return null;
  // First Tuesday after the first Monday in November
  const nov1 = new Date(year, 10, 1);
  const dayOfWeek = nov1.getDay(); // 0=Sun, 1=Mon, ...
  // First Monday: if Nov 1 is Mon (1), it's day 1. Otherwise advance.
  const firstMonday = dayOfWeek <= 1 ? 1 + (1 - dayOfWeek) : 1 + (8 - dayOfWeek);
  const electionDay = new Date(year, 10, firstMonday + 1); // Tuesday after first Monday
  const now = new Date();
  const diff = Math.ceil((electionDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : null;
}

function contactIcon(icon: string) {
  switch (icon.toLowerCase()) {
    case 'mail': case 'email': return <Mail size={16} />;
    case 'phone': return <Phone size={16} />;
    case 'globe': case 'web': case 'website': return <Globe size={16} />;
    case 'mappin': case 'map': case 'office': return <MapPin size={16} />;
    case 'facebook': return <FbIcon />;
    case 'twitter': case 'x': return <XIcon />;
    case 'instagram': return <IgIcon />;
    case 'linkedin': return <LiIcon />;
    default: return <Globe size={16} />;
  }
}

function FbIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>; }
function XIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>; }
function IgIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>; }
function LiIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>; }

/* ══════════════════════════════════════════════════════════ */

export function RepDetailPage() {
  const [, params] = useRoute('/representatives/:id');
  const search = useSearch();
  const fromZone = new URLSearchParams(search).get('from');
  const backHref = fromZone ? `/representatives?tab=${fromZone}` : '/representatives';
  const id = params?.id ?? '';

  const { data: rep, loading, error } = useApi<Representative>(
    () => fetchRepresentativeById(id),
    [id]
  );

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(184,115,51,0.3)', borderTopColor: '#B87333' }} />
        <p className="text-sm mt-3 font-body" style={{ color: 'rgba(240,244,248,0.5)' }}>Loading profile...</p>
      </div>
    );
  }

  if (error || !rep) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="az-alert az-alert-warn mb-4">
          <p className="font-body text-sm">{error ?? 'Representative not found.'}</p>
        </div>
        <Link href={backHref} className="btn btn-outline">
          <ArrowLeft size={14} /> Back to Representatives
        </Link>
      </div>
    );
  }

  const zone = (rep.level ?? 'local') as Zone;
  const zc = ZONE_COLORS[zone] ?? ZONE_COLORS.local;
  const progress = termProgress(rep.term_start, rep.term_end);
  const daysLeft = daysUntilElection(rep.next_election);
  const isUpForElection = daysLeft !== null && daysLeft <= 730;

  const socialIcons = ['facebook', 'twitter', 'x', 'instagram', 'linkedin'];
  const socialContacts = rep.contacts?.filter(c => socialIcons.includes(c.icon?.toLowerCase())) ?? [];
  const directContacts = rep.contacts?.filter(c => !socialIcons.includes(c.icon?.toLowerCase())) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back nav */}
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-2">
        <Link href={backHref} className="inline-flex items-center gap-1.5 font-ui font-semibold text-xs uppercase tracking-wider transition-colors hover:text-white/80" style={{ color: 'rgba(240,244,248,0.5)' }}>
          <ArrowLeft size={14} /> All Representatives
        </Link>
      </div>

      {/* Main layout: Photo left, content right */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ─── Left column: Photo + quick info (sticky) ─── */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-20">
              {/* Photo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl overflow-hidden mb-4"
                style={{ background: `linear-gradient(135deg, ${zc.from}, ${zc.to})` }}
              >
                {rep.photo_url ? (
                  <img
                    src={rep.photo_url}
                    alt={rep.name}
                    className="w-full aspect-[3/4] object-cover object-top"
                  />
                ) : (
                  <div className="w-full aspect-[3/4] flex items-center justify-center">
                    <span className="font-display font-bold text-6xl text-white/30">{initials(rep.name)}</span>
                  </div>
                )}
              </motion.div>

              {/* Name + badges */}
              <h1 className="font-display text-2xl font-bold leading-tight" style={{ color: '#F0F4F8' }}>{rep.name}</h1>
              <p className="font-body text-sm mt-1" style={{ color: 'rgba(240,244,248,0.6)' }}>{rep.title}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={partyClass(rep.party)} style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(240,244,248,0.8)' }}>
                  {partyLabel(rep.party)}
                </span>
                <span className={zc.badge}>{ZONE_LABELS[zone]}</span>
                {rep.district && <span className="text-xs font-ui" style={{ color: 'rgba(240,244,248,0.5)' }}>{rep.district}</span>}
              </div>

              {/* Term bar */}
              {(rep.term_start && rep.term_end) && (
                <div className="mt-4">
                  <div className="flex justify-between text-2xs font-ui uppercase tracking-wider" style={{ color: 'rgba(240,244,248,0.4)' }}>
                    <span>{rep.term_start}</span>
                    <span>{rep.term_end}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden mt-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${progress}%`, background: '#B87333' }} />
                  </div>
                  <p className="text-2xs mt-1 font-body" style={{ color: 'rgba(240,244,248,0.35)' }}>
                    {progress}% through term
                  </p>
                </div>
              )}

              {/* Social links */}
              {socialContacts.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {socialContacts.map((c, i) => (
                    <a key={i} href={c.href} target="_blank" rel="noreferrer"
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(240,244,248,0.5)' }}
                      title={c.label}
                    >
                      {contactIcon(c.icon)}
                    </a>
                  ))}
                </div>
              )}

              {/* Direct contacts */}
              {directContacts.length > 0 && (
                <div className="mt-4 space-y-1.5">
                  {directContacts.slice(0, 4).map((c, i) => (
                    <a key={i} href={c.href} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-xs font-body transition-colors hover:text-white/80"
                      style={{ color: 'rgba(240,244,248,0.5)' }}
                    >
                      <span style={{ color: '#B87333' }}>{contactIcon(c.icon)}</span>
                      <span className="truncate">{c.value}</span>
                    </a>
                  ))}
                </div>
              )}

              {/* External links */}
              <div className="mt-4 space-y-1">
                {rep.ballotpedia_url && (
                  <a href={rep.ballotpedia_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-body transition-colors hover:text-white/80" style={{ color: 'rgba(240,244,248,0.4)' }}>
                    <FileText size={12} style={{ color: '#B87333' }} /> Ballotpedia
                  </a>
                )}
                {rep.congress_gov_url && (
                  <a href={rep.congress_gov_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-body transition-colors hover:text-white/80" style={{ color: 'rgba(240,244,248,0.4)' }}>
                    <Globe size={12} style={{ color: '#B87333' }} /> Congress.gov
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* ─── Right column: Content ─── */}
          <div className="flex-1 min-w-0 space-y-8">

            {/* Election alert */}
            {isUpForElection && daysLeft && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-lg px-4 py-3 flex items-center gap-3"
                style={{ background: 'rgba(226,88,34,0.1)', border: '1px solid rgba(226,88,34,0.2)' }}
              >
                <Calendar size={18} style={{ color: '#E25822', flexShrink: 0 }} />
                <div>
                  <p className="font-ui font-semibold text-xs uppercase tracking-wider" style={{ color: '#E25822' }}>
                    Election coming up
                  </p>
                  <p className="font-body text-sm" style={{ color: 'rgba(240,244,248,0.6)' }}>
                    This seat is on the ballot in {rep.next_election}.{' '}
                    {daysLeft <= 365 ? `About ${daysLeft} days away.` : `About ${Math.round(daysLeft / 30)} months away.`}
                  </p>
                </div>
              </motion.div>
            )}

            {/* What they focus on */}
            {rep.priorities && rep.priorities.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <SectionHead icon={<Target size={18} />} title="What they focus on" />
                <div className="flex flex-wrap gap-2">
                  {rep.priorities.map((p, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full text-xs font-ui font-semibold"
                      style={{ background: 'rgba(184,115,51,0.1)', color: '#B87333', border: '1px solid rgba(184,115,51,0.2)' }}>
                      {p}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* About */}
            {rep.bio && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <SectionHead icon={<User size={18} />} title="About" />
                <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(240,244,248,0.7)' }}>{rep.bio}</p>
              </motion.div>
            )}

            {/* Sponsored Bills / Recent Activity */}
            {rep.votes && rep.votes.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <SectionHead icon={<FileText size={18} />} title="Recently sponsored bills" />
                <div className="space-y-2">
                  {rep.votes.map((v, i) => (
                    <BillCard key={i} bill={v} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* No bills fallback for local reps */}
            {(!rep.votes || rep.votes.length === 0) && zone === 'local' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <SectionHead icon={<FileText size={18} />} title="Council activity" />
                <div className="glass-card p-5 text-center">
                  <p className="font-body text-sm" style={{ color: 'rgba(240,244,248,0.5)' }}>
                    City council members vote on ordinances during council meetings. You can watch live or review minutes on the city website.
                  </p>
                  <a href="https://www.mesaaz.gov/government/city-council-meetings" target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 font-ui font-semibold text-xs uppercase tracking-wider"
                    style={{ color: '#B87333' }}>
                    Watch council meetings <ExternalLink size={12} />
                  </a>
                </div>
              </motion.div>
            )}

            {/* Endorsements */}
            {rep.backers && rep.backers.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <SectionHead icon={<Users size={18} />} title="Notable endorsements" />
                <div className="flex flex-wrap gap-2">
                  {rep.backers.map((b, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-body"
                      style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(240,244,248,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      {b}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Background */}
            {rep.background && rep.background.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <SectionHead icon={<Briefcase size={18} />} title="Background" />
                <ul className="space-y-2">
                  {rep.background.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm font-body" style={{ color: 'rgba(240,244,248,0.6)' }}>
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#B87333' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Quick stats */}
            {(rep.elected || rep.next_election) && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <SectionHead icon={<Award size={18} />} title="At a glance" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {rep.elected && (
                    <div className="glass-card p-3 text-center">
                      <p className="az-label text-2xs mb-0.5">First elected</p>
                      <p className="font-display font-bold text-lg" style={{ color: '#F0F4F8' }}>{rep.elected}</p>
                    </div>
                  )}
                  {rep.term_end && (
                    <div className="glass-card p-3 text-center">
                      <p className="az-label text-2xs mb-0.5">Term ends</p>
                      <p className="font-display font-bold text-lg" style={{ color: '#F0F4F8' }}>{rep.term_end}</p>
                    </div>
                  )}
                  {rep.next_election && (
                    <div className="glass-card p-3 text-center">
                      <p className="az-label text-2xs mb-0.5">Next election</p>
                      <p className="font-display font-bold text-lg" style={{ color: '#E25822' }}>{rep.next_election}</p>
                    </div>
                  )}
                  {rep.district && (
                    <div className="glass-card p-3 text-center">
                      <p className="az-label text-2xs mb-0.5">{zone === 'local' ? 'Represents' : 'District'}</p>
                      <p className="font-display font-bold text-sm" style={{ color: '#F0F4F8' }}>{rep.district}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Section header ─── */
function SectionHead({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span style={{ color: '#B87333' }}>{icon}</span>
      <h2 className="font-display font-bold text-lg" style={{ color: '#F0F4F8' }}>{title}</h2>
    </div>
  );
}

/* ── Bill summary helper ─── */
function getBillSummary(billTitle: string): string {
  const title = billTitle.toLowerCase();
  // Extract the descriptive part after the bill number
  const parts = billTitle.split(' - ');
  const name = parts.length > 1 ? parts.slice(1).join(' - ') : billTitle;

  // Generate a plain-language summary based on the bill name
  if (title.includes('water')) return `This bill addresses water resource management in Arizona. It aims to protect water access and improve conservation infrastructure for communities across the state.`;
  if (title.includes('veteran') || title.includes('va ')) return `This bill focuses on improving services and support for military veterans. It proposes changes to how veteran healthcare, benefits, or facilities are managed.`;
  if (title.includes('border') || title.includes('immigration') || title.includes('cbp')) return `This bill deals with border security or immigration policy. It proposes changes to enforcement, processing, or resource allocation at the border.`;
  if (title.includes('tax') || title.includes('irs')) return `This bill proposes changes to tax policy that could affect how much Arizonans pay or how tax revenue is used. It targets specific tax rules or rates.`;
  if (title.includes('education') || title.includes('school') || title.includes('student')) return `This bill focuses on education policy. It proposes changes that could affect schools, students, or educators in Arizona and beyond.`;
  if (title.includes('health') || title.includes('medicare') || title.includes('medicaid') || title.includes('drug')) return `This bill addresses healthcare access or costs. It proposes changes that could affect insurance, prescriptions, or medical services.`;
  if (title.includes('infrastructure') || title.includes('highway') || title.includes('transit') || title.includes('transportation')) return `This bill targets infrastructure and transportation. It could affect roads, bridges, public transit, or broadband access in Arizona.`;
  if (title.includes('energy') || title.includes('climate') || title.includes('environment') || title.includes('forest') || title.includes('restoration')) return `This bill addresses environmental or energy policy. It proposes changes to conservation, clean energy, or natural resource management.`;
  if (title.includes('military') || title.includes('defense') || title.includes('armed') || title.includes('national guard')) return `This bill relates to military or national defense policy. It proposes changes to how the armed forces operate, are funded, or support service members.`;
  if (title.includes('housing') || title.includes('rent') || title.includes('mortgage')) return `This bill addresses housing affordability or availability. It proposes changes that could affect home buyers, renters, or housing development.`;
  if (title.includes('wage') || title.includes('pay') || title.includes('worker') || title.includes('labor') || title.includes('holiday')) return `This bill focuses on workers' rights or compensation. It proposes changes to wages, benefits, or workplace protections.`;
  if (title.includes('gun') || title.includes('firearm') || title.includes('safety')) return `This bill addresses public safety policy. It proposes changes to regulations, enforcement, or community safety programs.`;
  if (title.includes('semiconductor') || title.includes('chip') || title.includes('tech') || title.includes('ai')) return `This bill relates to technology and manufacturing. It could affect Arizona's growing tech sector, including semiconductor production.`;
  if (title.includes('disclosure') || title.includes('transparency') || title.includes('accountability')) return `This bill aims to increase government or financial transparency. It proposes new reporting requirements or disclosure rules.`;
  // Default
  return `${name}. This legislation was introduced to address this issue at the federal level. Click below to read the full text and track its progress.`;
}

/* ── Expandable bill card ─── */
function BillCard({ bill }: { bill: { bill: string; vote: string; date: string; description: string } }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="glass-card overflow-hidden cursor-pointer transition-colors hover:border-white/10"
      onClick={() => setOpen(!open)}
    >
      <div className="p-4 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-sm leading-snug" style={{ color: '#F0F4F8' }}>{bill.bill}</p>
          <p className="font-body text-xs mt-1" style={{ color: 'rgba(240,244,248,0.45)' }}>
            {bill.date}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="px-2 py-0.5 rounded text-2xs font-ui font-bold uppercase tracking-wider"
            style={{ background: 'rgba(184,115,51,0.1)', color: '#B87333' }}>
            {bill.vote}
          </span>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} style={{ color: 'rgba(240,244,248,0.3)' }} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="pt-3 space-y-3">
                <div>
                  <p className="az-label text-2xs mb-0.5">What is this bill?</p>
                  <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(240,244,248,0.6)' }}>
                    {getBillSummary(bill.bill)}
                  </p>
                </div>
                <div>
                  <p className="az-label text-2xs mb-0.5">Current status</p>
                  <p className="font-body text-sm" style={{ color: 'rgba(240,244,248,0.45)' }}>{bill.description}</p>
                </div>
                <a
                  href={`https://www.congress.gov/search?q=${encodeURIComponent(bill.bill.split(' - ')[0])}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 mt-1 font-ui font-semibold text-xs uppercase tracking-wider transition-colors"
                  style={{ color: '#B87333' }}
                >
                  Read full bill on Congress.gov <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
