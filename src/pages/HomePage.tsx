import { useState, useRef, useMemo } from 'react';
import { Link } from 'wouter';
import { motion, useInView } from 'framer-motion';
import {
  Building2, MapPin, Landmark, Calendar, Search, DollarSign,
  FileText, MessageSquare, MapPinned, Loader2, X, ChevronDown,
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { fetchElections } from '../lib/api';
import { useUserLocation } from '../context/UserLocationContext';
import { mapOfficials } from '../lib/civicMapper';

function daysUntil(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));
}

/* ── 3D tilt on hover ─────────────────────────────────── */
function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
  };
  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };
  return { ref, onMouseMove: handleMove, onMouseLeave: handleLeave };
}

function TiltCard({ children, className = '', style = {}, ...rest }: React.HTMLAttributes<HTMLDivElement> & { style?: React.CSSProperties }) {
  const tilt = useTilt();
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className={className}
      style={{ transition: 'transform 0.2s ease', ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ── Shimmer skeleton ─────────────────────────────────── */
function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded ${className}`} style={{
      background: 'linear-gradient(90deg, rgba(184,115,51,0.05) 25%, rgba(184,115,51,0.12) 50%, rgba(184,115,51,0.05) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    }} />
  );
}

/* ── Scroll indicator arrow ───────────────────────────── */
function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      animate={{ y: [0, 8, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
    >
      <ChevronDown size={24} style={{ color: 'rgba(184,115,51,0.5)' }} />
    </motion.div>
  );
}

export function HomePage() {
  const [address, setAddress] = useState('');
  const { location, resolveByAddress, resolveByGeolocation, clearLocation, isPersonalized } = useUserLocation();
  const { data: elections } = useApi(() => fetchElections(), []);

  const mapped = useMemo(() => {
    if (!isPersonalized) return null;
    return mapOfficials(location.officials);
  }, [isPersonalized, location.officials]);

  const nextDeadline = elections?.deadlines
    .filter(d => daysUntil(d.date_iso) > 0)
    .sort((a, b) => new Date(a.date_iso).getTime() - new Date(b.date_iso).getTime())[0];

  const isLoading = location.status === 'resolving' || location.status === 'detecting';

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (address.trim()) {
      await resolveByAddress(address.trim());
    }
  }

  async function handleGeolocate() {
    await resolveByGeolocation();
  }

  // Refs for scroll-triggered sections
  const cardsRef = useRef(null);
  const gridRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: '-80px' });
  const gridInView = useInView(gridRef, { once: true, margin: '-60px' });

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
  const fadeUp = { hidden: { opacity: 0, y: 24, scale: 0.97 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } } };

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: '100vh' }}>
        {/* Animated gradient background (replaces canvas) */}
        <div className="absolute inset-0 hero-gradient-fallback" />

        {/* Topographic texture overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30 Q15 20 30 30 Q45 40 60 30' fill='none' stroke='rgba(184,115,51,0.04)' stroke-width='0.5'/%3E%3Cpath d='M0 15 Q15 5 30 15 Q45 25 60 15' fill='none' stroke='rgba(184,115,51,0.03)' stroke-width='0.5'/%3E%3Cpath d='M0 45 Q15 35 30 45 Q45 55 60 45' fill='none' stroke='rgba(184,115,51,0.03)' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
          zIndex: 1,
        }} />

        {/* Dark overlay */}
        <div className="absolute inset-0 hero-overlay" style={{ zIndex: 2 }} />

        {/* Content */}
        <div
          className="relative z-10 max-w-5xl mx-auto px-4 flex flex-col items-center justify-center text-center"
          style={{ minHeight: '100vh' }}
        >
          {/* Staggered entrance */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
          >
            {/* Location-aware tagline */}
            <motion.div
              className="flex items-center justify-center gap-2 mb-5"
              variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            >
              <MapPinned size={12} style={{ color: '#B87333' }} />
              <p className="font-ui font-bold text-xs uppercase tracking-[0.25em]" style={{ color: 'rgba(240,244,248,0.5)' }}>
                {isLoading ? 'Finding your representatives...' : isPersonalized ? `${location.city}, Arizona` : 'Arizona'} · Local · State · Federal
              </p>
            </motion.div>

            {/* Headline with copper gradient on YOU */}
            <motion.h1
              className="font-display font-black leading-none mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw + 1rem, 5rem)', color: '#F0F4F8' }}
              variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              {isPersonalized ? (
                <>YOUR REPS IN<br /><span style={{ background: 'linear-gradient(135deg, #B87333, #D4956B, #E25822)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{location.city?.toUpperCase()}</span></>
              ) : (
                <>WHO REPRESENTS<br /><span style={{ background: 'linear-gradient(135deg, #B87333, #D4956B, #E25822)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>YOU</span>?</>
              )}
            </motion.h1>

            <motion.p
              className="font-body text-lg max-w-xl mx-auto mb-8"
              style={{ color: 'rgba(240,244,248,0.6)' }}
              variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            >
              {isPersonalized
                ? `Showing your representatives, elections, and legislation for ${location.city}, ${location.county || 'Arizona'}.`
                : 'Find your reps, track what they\'re voting on, and know when elections are coming. All in one place.'}
            </motion.p>

            {/* Address search */}
            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
              <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(240,244,248,0.3)' }} />
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder={isPersonalized ? 'Try a different address' : 'Enter your Arizona address'}
                    className="input-az pl-9"
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-copper flex-shrink-0"
                  disabled={isLoading || !address.trim()}
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : 'Find My Reps'}
                </button>
              </form>

              {/* Geolocation + clear buttons */}
              <div className="flex items-center justify-center gap-3 mt-3">
                {!isPersonalized && !isLoading && (
                  <button
                    onClick={handleGeolocate}
                    className="flex items-center gap-1.5 text-xs font-ui font-semibold uppercase tracking-wider transition-colors"
                    style={{ color: 'rgba(240,244,248,0.4)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#B87333')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,244,248,0.4)')}
                  >
                    <MapPinned size={12} /> Use my location
                  </button>
                )}
                {isPersonalized && (
                  <button
                    onClick={clearLocation}
                    className="flex items-center gap-1 text-xs font-ui font-semibold uppercase tracking-wider transition-colors"
                    style={{ color: 'rgba(240,244,248,0.3)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#E25822')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,244,248,0.3)')}
                  >
                    <X size={11} /> Change location
                  </button>
                )}
              </div>

              {/* Error message */}
              {location.status === 'error' && location.error && (
                <p className="text-xs mt-3" style={{ color: '#E25822' }}>{location.error}</p>
              )}
            </motion.div>
          </motion.div>

          <ScrollIndicator />
          <div className="absolute bottom-0 left-0 right-0 copper-line" />
        </div>
      </section>

      {/* ── Quick-Glance Cards ────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 -mt-16 relative z-20 pb-8" ref={cardsRef}>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={cardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          {/* Local */}
          <Link href="/representatives?tab=local">
            <TiltCard className="glass-card p-4 cursor-pointer h-full">
              <p className="font-ui font-bold text-2xs uppercase tracking-wider mb-1" style={{ color: '#B87333' }}>Local Government</p>
              {isLoading ? (
                <><Shimmer className="h-4 w-32 mb-1" /><Shimmer className="h-3 w-20" /></>
              ) : isPersonalized && mapped ? (
                <>
                  <p className="font-display font-bold text-base" style={{ color: '#F0F4F8' }}>{location.city} Officials</p>
                  <p className="text-xs" style={{ color: 'rgba(240,244,248,0.4)' }}>
                    {mapped.local.length} {mapped.local.length === 1 ? 'official' : 'officials'}
                    {mapped.local.length > 0 && ` · ${mapped.local[0].name}`}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-display font-bold text-base" style={{ color: '#F0F4F8' }}>Your City Council</p>
                  <p className="text-xs" style={{ color: 'rgba(240,244,248,0.4)' }}>Enter your address to find them</p>
                </>
              )}
            </TiltCard>
          </Link>

          {/* State */}
          <Link href="/representatives?tab=state">
            <TiltCard className="glass-card p-4 cursor-pointer h-full">
              <p className="font-ui font-bold text-2xs uppercase tracking-wider mb-1" style={{ color: '#2D5A3D' }}>State Government</p>
              {isLoading ? (
                <><Shimmer className="h-4 w-32 mb-1" /><Shimmer className="h-3 w-20" /></>
              ) : isPersonalized && mapped ? (
                <>
                  <p className="font-display font-bold text-base" style={{ color: '#F0F4F8' }}>
                    {location.legislativeDistrict ? `AZ LD ${location.legislativeDistrict}` : 'AZ Legislature'}
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(240,244,248,0.4)' }}>
                    {mapped.state.length} {mapped.state.length === 1 ? 'official' : 'officials'}
                    {mapped.state.length > 0 && ` · ${mapped.state[0].name}`}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-display font-bold text-base" style={{ color: '#F0F4F8' }}>AZ Legislature</p>
                  <p className="text-xs" style={{ color: 'rgba(240,244,248,0.4)' }}>Find your state legislators</p>
                </>
              )}
            </TiltCard>
          </Link>

          {/* Federal */}
          <Link href="/representatives?tab=federal">
            <TiltCard className="glass-card p-4 cursor-pointer h-full">
              <p className="font-ui font-bold text-2xs uppercase tracking-wider mb-1" style={{ color: '#87CEEB' }}>Federal Delegation</p>
              {isLoading ? (
                <><Shimmer className="h-4 w-32 mb-1" /><Shimmer className="h-3 w-20" /></>
              ) : isPersonalized && mapped ? (
                <>
                  <p className="font-display font-bold text-base" style={{ color: '#F0F4F8' }}>
                    {location.congressionalDistrict ? `CD ${location.congressionalDistrict} + Senators` : 'Congress & Senate'}
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(240,244,248,0.4)' }}>
                    {mapped.federal.length} members
                    {mapped.federal.length > 0 && ` · ${mapped.federal[0].name}`}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-display font-bold text-base" style={{ color: '#F0F4F8' }}>Congress & Senate</p>
                  <p className="text-xs" style={{ color: 'rgba(240,244,248,0.4)' }}>Your U.S. representatives</p>
                </>
              )}
            </TiltCard>
          </Link>
        </motion.div>
      </section>

      {/* ── Main Bento Grid ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-16" ref={gridRef}>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-5 rounded-full" style={{ background: '#B87333' }} />
          <p className="font-ui font-bold text-xs uppercase tracking-[0.15em]" style={{ color: 'rgba(240,244,248,0.4)' }}>
            {isPersonalized ? `${location.city} at a Glance` : 'Your Government at a Glance'}
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          style={{ gridAutoRows: '1fr' }}
          variants={stagger}
          initial="hidden"
          animate={gridInView ? 'show' : 'hidden'}
        >
          {/* ── Local Representatives (wide) ─────────────── */}
          <motion.div variants={fadeUp} className="md:col-span-2">
            <Link href="/representatives?tab=local">
              <TiltCard className="glass-card overflow-hidden cursor-pointer h-full" style={{ minHeight: '200px' }}>
                <div className="h-1.5" style={{ background: '#B87333', boxShadow: '0 2px 8px rgba(184,115,51,0.3)' }} />
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 size={16} style={{ color: '#B87333' }} />
                    <span className="zone-badge zone-badge-local">LOCAL</span>
                  </div>
                  <h3 className="font-display font-bold text-xl mb-1" style={{ color: '#F0F4F8' }}>
                    {isPersonalized ? `${location.city} Representatives` : 'Your Local Representatives'}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'rgba(240,244,248,0.5)' }}>
                    The people making decisions about your roads, parks, water, and safety.
                  </p>

                  {isPersonalized && mapped && mapped.local.length > 0 ? (
                    <div className="flex flex-wrap gap-3 mt-auto">
                      {mapped.local.slice(0, 4).map((rep, i) => (
                        <div key={i} className="flex items-center gap-2">
                          {rep.photoUrl ? (
                            <img src={rep.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" style={{ border: '2px solid rgba(184,115,51,0.3)' }} />
                          ) : (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(184,115,51,0.15)', color: '#D4956B' }}>
                              {rep.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-semibold" style={{ color: '#F0F4F8' }}>{rep.name}</p>
                            <p className="text-2xs" style={{ color: 'rgba(240,244,248,0.4)' }}>{rep.title}</p>
                          </div>
                        </div>
                      ))}
                      {mapped.local.length > 4 && (
                        <p className="text-xs self-center" style={{ color: 'rgba(240,244,248,0.4)' }}>+{mapped.local.length - 4} more</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-6 mt-auto">
                      <div className="stat-pill"><span className="stat-pill-label">Officials</span><span className="stat-pill-value">{isPersonalized ? mapped?.local.length ?? 0 : '?'}</span></div>
                    </div>
                  )}
                </div>
              </TiltCard>
            </Link>
          </motion.div>

          {/* ── State ────────────────────────────────────── */}
          <motion.div variants={fadeUp}>
            <Link href="/representatives?tab=state">
              <TiltCard className="glass-card overflow-hidden cursor-pointer h-full" style={{ minHeight: '200px' }}>
                <div className="h-1.5" style={{ background: '#2D5A3D', boxShadow: '0 2px 8px rgba(45,90,61,0.3)' }} />
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} style={{ color: '#2D5A3D' }} />
                    <span className="zone-badge zone-badge-state">STATE</span>
                  </div>
                  <h3 className="font-display font-bold text-lg mb-1" style={{ color: '#F0F4F8' }}>
                    {isPersonalized && location.legislativeDistrict ? `AZ LD ${location.legislativeDistrict}` : 'State of Arizona'}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'rgba(240,244,248,0.5)' }}>
                    Governor, Legislature, and Courts
                  </p>
                  {isPersonalized && mapped && mapped.state.length > 0 ? (
                    <div className="mt-auto space-y-1">
                      {mapped.state.slice(0, 3).map((rep, i) => (
                        <p key={i} className="text-xs" style={{ color: 'rgba(240,244,248,0.6)' }}>
                          <span className="font-semibold" style={{ color: '#F0F4F8' }}>{rep.name}</span> · {rep.title}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-6 mt-auto">
                      <div className="stat-pill"><span className="stat-pill-label">Officials</span><span className="stat-pill-value">{isPersonalized ? mapped?.state.length ?? 0 : '?'}</span></div>
                      <div className="stat-pill"><span className="stat-pill-label">Legislature</span><span className="stat-pill-value">90</span></div>
                    </div>
                  )}
                </div>
              </TiltCard>
            </Link>
          </motion.div>

          {/* ── Federal ──────────────────────────────────── */}
          <motion.div variants={fadeUp}>
            <Link href="/representatives?tab=federal">
              <TiltCard className="glass-card overflow-hidden cursor-pointer h-full" style={{ minHeight: '200px' }}>
                <div className="h-1.5" style={{ background: '#87CEEB', boxShadow: '0 2px 8px rgba(135,206,235,0.3)' }} />
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Landmark size={16} style={{ color: '#87CEEB' }} />
                    <span className="zone-badge zone-badge-federal">FEDERAL</span>
                  </div>
                  <h3 className="font-display font-bold text-lg mb-1" style={{ color: '#F0F4F8' }}>
                    {isPersonalized && location.congressionalDistrict ? `Congressional District ${location.congressionalDistrict}` : 'Federal Delegation'}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'rgba(240,244,248,0.5)' }}>
                    Your U.S. Senators and House Rep
                  </p>
                  {isPersonalized && mapped && mapped.federal.length > 0 ? (
                    <div className="mt-auto space-y-1">
                      {mapped.federal.slice(0, 3).map((rep, i) => (
                        <p key={i} className="text-xs" style={{ color: 'rgba(240,244,248,0.6)' }}>
                          <span className="font-semibold" style={{ color: '#F0F4F8' }}>{rep.name}</span> · {rep.title}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-6 mt-auto">
                      <div className="stat-pill"><span className="stat-pill-label">AZ Members</span><span className="stat-pill-value">{isPersonalized ? mapped?.federal.length ?? 0 : '11'}</span></div>
                      <div className="stat-pill"><span className="stat-pill-label">Senators</span><span className="stat-pill-value">2</span></div>
                    </div>
                  )}
                </div>
              </TiltCard>
            </Link>
          </motion.div>

          {/* ── Elections ────────────────────────────────── */}
          <motion.div variants={fadeUp}>
            <Link href="/elections">
              <TiltCard className="glass-card overflow-hidden cursor-pointer h-full" style={{ minHeight: '180px' }}>
                <div className="h-1.5" style={{ background: '#E25822', boxShadow: '0 2px 8px rgba(226,88,34,0.3)' }} />
                <div className="p-6 flex flex-col h-full">
                  <Calendar size={16} style={{ color: '#E25822' }} className="mb-2" />
                  <h3 className="font-display font-bold text-lg mb-1" style={{ color: '#F0F4F8' }}>2026 Elections</h3>
                  <p className="text-sm" style={{ color: 'rgba(240,244,248,0.5)' }}>
                    {nextDeadline ? `${daysUntil(nextDeadline.date_iso)} days until ${nextDeadline.label}` : 'Election calendar and deadlines'}
                  </p>
                </div>
              </TiltCard>
            </Link>
          </motion.div>

          {/* ── Who Represents You? ──────────────────────── */}
          <motion.div variants={fadeUp}>
            <Link href="/districts">
              <TiltCard className="glass-card overflow-hidden cursor-pointer h-full" style={{ minHeight: '180px', border: '1px solid rgba(184,115,51,0.2)' }}>
                <div className="h-1.5" style={{ background: '#B87333', boxShadow: '0 2px 8px rgba(184,115,51,0.3)' }} />
                <div className="p-6 flex flex-col h-full">
                  <Search size={16} style={{ color: '#B87333' }} className="mb-2" />
                  <h3 className="font-display font-bold text-lg mb-1" style={{ color: '#F0F4F8' }}>Who Represents You?</h3>
                  <p className="text-sm" style={{ color: 'rgba(240,244,248,0.5)' }}>
                    {isPersonalized
                      ? `Showing ${location.officials.length} officials for ${location.city}`
                      : 'Enter your address and find out exactly who makes decisions for you'}
                  </p>
                </div>
              </TiltCard>
            </Link>
          </motion.div>

          {/* ── Bills ────────────────────────────────────── */}
          <motion.div variants={fadeUp} className="md:col-span-2 lg:col-span-1">
            <Link href="/bills">
              <TiltCard className="glass-card overflow-hidden cursor-pointer h-full" style={{ minHeight: '180px' }}>
                <div className="h-1.5" style={{ background: 'rgba(184,115,51,0.5)', boxShadow: '0 2px 8px rgba(184,115,51,0.15)' }} />
                <div className="p-6 flex flex-col h-full">
                  <FileText size={16} style={{ color: '#D4956B' }} className="mb-2" />
                  <h3 className="font-display font-bold text-lg mb-1" style={{ color: '#F0F4F8' }}>Active Legislation</h3>
                  <p className="text-sm mb-3" style={{ color: 'rgba(240,244,248,0.5)' }}>
                    Bills being debated right now that affect you
                  </p>
                  <div className="mt-auto">
                    <div className="stat-pill"><span className="stat-pill-label">Tracking</span><span className="stat-pill-value">3 Bills</span></div>
                  </div>
                </div>
              </TiltCard>
            </Link>
          </motion.div>

          {/* ── Budget ───────────────────────────────────── */}
          <motion.div variants={fadeUp}>
            <Link href="/budget">
              <TiltCard className="glass-card overflow-hidden cursor-pointer h-full" style={{ minHeight: '180px' }}>
                <div className="h-1.5" style={{ background: '#2D5A3D', boxShadow: '0 2px 8px rgba(45,90,61,0.2)' }} />
                <div className="p-6 flex flex-col h-full">
                  <DollarSign size={16} style={{ color: '#2D5A3D' }} className="mb-2" />
                  <h3 className="font-display font-bold text-lg mb-1" style={{ color: '#F0F4F8' }}>
                    {isPersonalized ? `${location.city} Budget` : 'City Budget'}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: 'rgba(240,244,248,0.5)' }}>
                    {isPersonalized && location.city?.toLowerCase() !== 'mesa'
                      ? `${location.city} budget data coming soon`
                      : 'Where your tax dollars go'}
                  </p>
                  <div className="mt-auto">
                    <div className="stat-pill"><span className="stat-pill-label">FY 2025-26</span><span className="stat-pill-value">$2.1B</span></div>
                  </div>
                </div>
              </TiltCard>
            </Link>
          </motion.div>

          {/* ── Take Action ──────────────────────────────── */}
          <motion.div variants={fadeUp}>
            <Link href="/issues">
              <TiltCard className="glass-card overflow-hidden cursor-pointer h-full" style={{ minHeight: '180px' }}>
                <div className="h-1.5" style={{ background: '#87CEEB', boxShadow: '0 2px 8px rgba(135,206,235,0.2)' }} />
                <div className="p-6 flex flex-col h-full">
                  <MessageSquare size={16} style={{ color: '#87CEEB' }} className="mb-2" />
                  <h3 className="font-display font-bold text-lg mb-1" style={{ color: '#F0F4F8' }}>Take Action</h3>
                  <p className="text-sm" style={{ color: 'rgba(240,244,248,0.5)' }}>
                    {isPersonalized
                      ? `Contact your ${location.city} representatives about what matters to you`
                      : 'Contact your reps about the issues you care about'}
                  </p>
                </div>
              </TiltCard>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
