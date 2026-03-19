import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Building2, MapPin, Landmark, Calendar, Search, DollarSign, FileText, MessageSquare, Navigation } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { fetchRepresentatives, fetchElections } from '../lib/api';

function daysUntil(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));
}

export function HomePage() {
  const [, navigate] = useLocation();
  const [address, setAddress] = useState('');
  const [userCity, setUserCity] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const { data: reps } = useApi(() => fetchRepresentatives(), []);
  const { data: elections } = useApi(() => fetchElections(), []);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const localCount = reps?.filter(r => r.level === 'local').length ?? 0;
  const stateCount = reps?.filter(r => r.level === 'state').length ?? 0;
  const fedCount = reps?.filter(r => r.level === 'federal').length ?? 0;

  const nextDeadline = elections?.deadlines
    .filter(d => daysUntil(d.date_iso) > 0)
    .sort((a, b) => new Date(a.date_iso).getTime() - new Date(b.date_iso).getTime())[0];

  // Geolocation: detect user's city
  useEffect(() => {
    // Try cached city first
    const cached = sessionStorage.getItem('az-civics-city');
    if (cached) { setUserCity(cached); return; }

    if ('geolocation' in navigator) {
      setGeoLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const resp = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&addressdetails=1`,
              { headers: { 'Accept-Language': 'en' } }
            );
            const data = await resp.json();
            const city = data?.address?.city || data?.address?.town || data?.address?.village || null;
            if (city) {
              setUserCity(city);
              sessionStorage.setItem('az-civics-city', city);
            }
          } catch { /* silently fail */ }
          setGeoLoading(false);
        },
        () => setGeoLoading(false),
        { timeout: 5000 }
      );
    }
  }, []);

  // WebGL-style animated canvas background (AZ copper particles + desert gradient)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    const logicalW = canvas.offsetWidth;
    const logicalH = canvas.offsetHeight;

    // Particles: copper/gold dust floating
    const particles: { x: number; y: number; r: number; vx: number; vy: number; alpha: number; color: string }[] = [];
    const colors = ['#B87333', '#D4956B', '#E25822', '#87CEEB', '#2D5A3D'];
    const count = prefersReducedMotion ? 0 : Math.min(60, Math.floor(logicalW * logicalH / 8000));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * logicalW,
        y: Math.random() * logicalH,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.15 - 0.1,
        alpha: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let time = 0;
    function draw() {
      if (!ctx) return;
      time += 0.005;

      // Gradient background (animated hue shift)
      const grad = ctx.createLinearGradient(0, 0, logicalW, logicalH);
      const shift = Math.sin(time) * 10;
      grad.addColorStop(0, '#0F1923');
      grad.addColorStop(0.3, `hsl(${25 + shift}, 45%, 18%)`);
      grad.addColorStop(0.6, `hsl(${15 + shift}, 55%, 22%)`);
      grad.addColorStop(1, '#0F1923');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, logicalW, logicalH);

      // Draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = logicalW + 10;
        if (p.x > logicalW + 10) p.x = -10;
        if (p.y < -10) p.y = logicalH + 10;
        if (p.y > logicalH + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.7 + 0.3 * Math.sin(time * 2 + p.x * 0.01));
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Subtle copper glow in center
      const glowX = logicalW * 0.5 + Math.sin(time * 0.7) * logicalW * 0.1;
      const glowY = logicalH * 0.4 + Math.cos(time * 0.5) * logicalH * 0.05;
      const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, logicalW * 0.4);
      glow.addColorStop(0, 'rgba(184,115,51,0.08)');
      glow.addColorStop(1, 'rgba(184,115,51,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, logicalW, logicalH);

      animFrameRef.current = requestAnimationFrame(draw);
    }

    if (!prefersReducedMotion) {
      draw();
    } else {
      // Static gradient for reduced motion
      const grad = ctx.createLinearGradient(0, 0, logicalW, logicalH);
      grad.addColorStop(0, '#0F1923');
      grad.addColorStop(0.4, '#3D2516');
      grad.addColorStop(0.7, '#4A2A15');
      grad.addColorStop(1, '#0F1923');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, logicalW, logicalH);
    }

    const handleResize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (address.trim()) navigate('/districts');
  }

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <>
      {/* Hero with Canvas WebGL-style background */}
      <section className="relative overflow-hidden" style={{ minHeight: '100vh' }}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 0 }}
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(15,25,35,0.3) 0%, rgba(15,25,35,0.6) 100%)', zIndex: 1 }} />

        {/* Content */}
        <div
          className="relative z-10 max-w-5xl mx-auto px-4 flex flex-col items-center justify-center text-center"
          style={{ minHeight: '100vh' }}
        >
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Location aware tagline */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Navigation size={12} style={{ color: '#B87333' }} />
              <p className="font-ui font-bold text-xs uppercase tracking-[0.25em]" style={{ color: 'rgba(240,244,248,0.5)' }}>
                {geoLoading ? 'Detecting your location...' : userCity ? `${userCity}, Arizona` : 'Arizona'} · Local · State · Federal
              </p>
            </div>

            <h1
              className="font-display font-black leading-none mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw + 1rem, 5rem)', color: '#F0F4F8' }}
            >
              WHO REPRESENTS<br />YOU?
            </h1>
            <p className="font-body text-lg max-w-xl mx-auto mb-8" style={{ color: 'rgba(240,244,248,0.6)' }}>
              Find your reps, track what they're voting on, and know when elections are coming. All in one place.
            </p>

            {/* Address search */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(240,244,248,0.3)' }} />
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Enter your address or ZIP code"
                  className="input-az pl-9"
                />
              </div>
              <button type="submit" className="btn btn-copper flex-shrink-0">Find My Reps</button>
            </form>
          </motion.div>

          {/* Copper accent line */}
          <div className="absolute bottom-0 left-0 right-0 copper-line" />
        </div>
      </section>

      {/* Quick-glance cards right below hero */}
      <section className="max-w-6xl mx-auto px-4 -mt-16 relative z-20 pb-8">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link href="/representatives?tab=local">
            <div className="glass-card p-4 group cursor-pointer hover:scale-[1.02] transition-transform">
              <p className="font-ui font-bold text-2xs uppercase tracking-wider mb-1" style={{ color: '#B87333' }}>Local Government</p>
              <p className="font-display font-bold text-base" style={{ color: '#F0F4F8' }}>{userCity || 'Mesa'} City Council</p>
              <p className="text-xs" style={{ color: 'rgba(240,244,248,0.4)' }}>{localCount} Officials</p>
            </div>
          </Link>
          <Link href="/representatives?tab=state">
            <div className="glass-card p-4 group cursor-pointer hover:scale-[1.02] transition-transform">
              <p className="font-ui font-bold text-2xs uppercase tracking-wider mb-1" style={{ color: '#2D5A3D' }}>State Government</p>
              <p className="font-display font-bold text-base" style={{ color: '#F0F4F8' }}>AZ Legislature</p>
              <p className="text-xs" style={{ color: 'rgba(240,244,248,0.4)' }}>{stateCount} Officials</p>
            </div>
          </Link>
          <Link href="/representatives?tab=federal">
            <div className="glass-card p-4 group cursor-pointer hover:scale-[1.02] transition-transform">
              <p className="font-ui font-bold text-2xs uppercase tracking-wider mb-1" style={{ color: '#87CEEB' }}>Federal Delegation</p>
              <p className="font-display font-bold text-base" style={{ color: '#F0F4F8' }}>Congress & Senate</p>
              <p className="text-xs" style={{ color: 'rgba(240,244,248,0.4)' }}>{fedCount} Members</p>
            </div>
          </Link>
        </motion.div>
      </section>

      {/* Main content grid */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-5 rounded-full" style={{ background: '#B87333' }} />
          <p className="font-ui font-bold text-xs uppercase tracking-[0.15em]" style={{ color: 'rgba(240,244,248,0.4)' }}>
            Your Government at a Glance
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={stagger} initial="hidden" animate="show"
        >
          {/* Who represents you locally */}
          <motion.div variants={fadeUp} className="md:col-span-2">
            <Link href="/representatives?tab=local">
              <div className="glass-card overflow-hidden group cursor-pointer h-full" style={{ minHeight: '200px' }}>
                <div className="h-1" style={{ background: '#B87333' }} />
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 size={16} style={{ color: '#B87333' }} />
                    <span className="zone-badge zone-badge-local">LOCAL</span>
                  </div>
                  <h3 className="font-display font-bold text-xl mb-1" style={{ color: '#F0F4F8' }}>Your Local Representatives</h3>
                  <p className="text-sm mb-4" style={{ color: 'rgba(240,244,248,0.5)' }}>
                    These are the people making decisions about your roads, parks, water, and safety.
                  </p>
                  <div className="flex gap-6 mt-auto">
                    <div className="stat-pill"><span className="stat-pill-label">Officials</span><span className="stat-pill-value">{localCount}</span></div>
                    <div className="stat-pill"><span className="stat-pill-label">Your District</span><span className="stat-pill-value">6</span></div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* State */}
          <motion.div variants={fadeUp}>
            <Link href="/representatives?tab=state">
              <div className="glass-card overflow-hidden group cursor-pointer h-full" style={{ minHeight: '200px' }}>
                <div className="h-1" style={{ background: '#2D5A3D' }} />
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} style={{ color: '#2D5A3D' }} />
                    <span className="zone-badge zone-badge-state">STATE</span>
                  </div>
                  <h3 className="font-display font-bold text-lg mb-1" style={{ color: '#F0F4F8' }}>State of Arizona</h3>
                  <p className="text-sm mb-4" style={{ color: 'rgba(240,244,248,0.5)' }}>
                    Governor, Legislature, and Courts
                  </p>
                  <div className="flex gap-6 mt-auto">
                    <div className="stat-pill"><span className="stat-pill-label">Officials</span><span className="stat-pill-value">{stateCount}</span></div>
                    <div className="stat-pill"><span className="stat-pill-label">Legislature</span><span className="stat-pill-value">90</span></div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Federal */}
          <motion.div variants={fadeUp}>
            <Link href="/representatives?tab=federal">
              <div className="glass-card overflow-hidden group cursor-pointer h-full" style={{ minHeight: '200px' }}>
                <div className="h-1" style={{ background: '#87CEEB' }} />
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Landmark size={16} style={{ color: '#87CEEB' }} />
                    <span className="zone-badge zone-badge-federal">FEDERAL</span>
                  </div>
                  <h3 className="font-display font-bold text-lg mb-1" style={{ color: '#F0F4F8' }}>Federal Delegation</h3>
                  <p className="text-sm mb-4" style={{ color: 'rgba(240,244,248,0.5)' }}>
                    Your U.S. Senators and House Reps
                  </p>
                  <div className="flex gap-6 mt-auto">
                    <div className="stat-pill"><span className="stat-pill-label">AZ Members</span><span className="stat-pill-value">{fedCount}</span></div>
                    <div className="stat-pill"><span className="stat-pill-label">Senators</span><span className="stat-pill-value">2</span></div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Elections */}
          <motion.div variants={fadeUp}>
            <Link href="/elections">
              <div className="glass-card overflow-hidden group cursor-pointer h-full" style={{ minHeight: '180px' }}>
                <div className="h-1" style={{ background: '#E25822' }} />
                <div className="p-6 flex flex-col h-full">
                  <Calendar size={16} style={{ color: '#E25822' }} className="mb-2" />
                  <h3 className="font-display font-bold text-lg mb-1" style={{ color: '#F0F4F8' }}>2026 Elections</h3>
                  <p className="text-sm" style={{ color: 'rgba(240,244,248,0.5)' }}>
                    {nextDeadline ? `${daysUntil(nextDeadline.date_iso)} days until ${nextDeadline.label}` : 'Election calendar and deadlines'}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Who Represents You? (formerly Find Your District) */}
          <motion.div variants={fadeUp}>
            <Link href="/districts">
              <div className="glass-card overflow-hidden group cursor-pointer h-full" style={{ minHeight: '180px', border: '1px solid rgba(184,115,51,0.2)' }}>
                <div className="h-1" style={{ background: '#B87333' }} />
                <div className="p-6 flex flex-col h-full">
                  <Search size={16} style={{ color: '#B87333' }} className="mb-2" />
                  <h3 className="font-display font-bold text-lg mb-1" style={{ color: '#F0F4F8' }}>Who Represents You?</h3>
                  <p className="text-sm" style={{ color: 'rgba(240,244,248,0.5)' }}>
                    Enter your address and find out exactly who's making decisions for you
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Bills */}
          <motion.div variants={fadeUp} className="md:col-span-2 lg:col-span-1">
            <Link href="/bills">
              <div className="glass-card overflow-hidden group cursor-pointer h-full" style={{ minHeight: '180px' }}>
                <div className="h-1" style={{ background: 'rgba(184,115,51,0.5)' }} />
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
              </div>
            </Link>
          </motion.div>

          {/* Budget */}
          <motion.div variants={fadeUp}>
            <Link href="/budget">
              <div className="glass-card overflow-hidden group cursor-pointer h-full" style={{ minHeight: '180px' }}>
                <div className="h-1" style={{ background: '#2D5A3D' }} />
                <div className="p-6 flex flex-col h-full">
                  <DollarSign size={16} style={{ color: '#2D5A3D' }} className="mb-2" />
                  <h3 className="font-display font-bold text-lg mb-1" style={{ color: '#F0F4F8' }}>City Budget</h3>
                  <p className="text-sm mb-3" style={{ color: 'rgba(240,244,248,0.5)' }}>
                    Where your tax dollars go
                  </p>
                  <div className="mt-auto">
                    <div className="stat-pill"><span className="stat-pill-label">FY 2025-26</span><span className="stat-pill-value">$2.1B</span></div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Take Action */}
          <motion.div variants={fadeUp}>
            <Link href="/issues">
              <div className="glass-card overflow-hidden group cursor-pointer h-full" style={{ minHeight: '180px' }}>
                <div className="h-1" style={{ background: '#87CEEB' }} />
                <div className="p-6 flex flex-col h-full">
                  <MessageSquare size={16} style={{ color: '#87CEEB' }} className="mb-2" />
                  <h3 className="font-display font-bold text-lg mb-1" style={{ color: '#F0F4F8' }}>Take Action</h3>
                  <p className="text-sm" style={{ color: 'rgba(240,244,248,0.5)' }}>
                    Contact your reps about the issues you care about
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
