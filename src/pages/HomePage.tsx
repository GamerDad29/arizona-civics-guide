import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Building2, MapPin, Landmark, Calendar, Search, DollarSign, FileText, MessageSquare } from 'lucide-react';
import { BentoTile } from '../components/BentoTile';
import { useApi } from '../hooks/useApi';
import { fetchRepresentatives, fetchElections } from '../lib/api';

function daysUntil(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));
}

export function HomePage() {
  const [, navigate] = useLocation();
  const [address, setAddress] = useState('');
  const { data: reps } = useApi(() => fetchRepresentatives(), []);
  const { data: elections } = useApi(() => fetchElections(), []);

  const localCount = reps?.filter(r => r.level === 'local').length ?? 0;
  const stateCount = reps?.filter(r => r.level === 'state').length ?? 0;
  const fedCount = reps?.filter(r => r.level === 'federal').length ?? 0;

  const nextDeadline = elections?.deadlines
    .filter(d => daysUntil(d.date_iso) > 0)
    .sort((a, b) => new Date(a.date_iso).getTime() - new Date(b.date_iso).getTime())[0];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (address.trim()) navigate('/districts');
  }

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <>
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: '70vh' }}>
        {/* Gradient background */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(160deg, #7B1D3A 0%, #5C1129 25%, #3E5A40 50%, #5C7A5E 75%, #A8C4C8 100%)',
        }} />

        {/* Paper texture overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }} />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col items-center justify-center text-center" style={{ minHeight: '70vh' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="font-ui font-bold text-xs uppercase tracking-[0.25em] text-cream/60 mb-4">
              Mesa, Arizona &mdash; Local &bull; State &bull; Federal
            </p>
            <h1 className="font-display font-black text-cream leading-none mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw + 1rem, 5rem)' }}>
              KNOW YOUR<br />GOVERNMENT
            </h1>
            <p className="font-body text-cream/70 text-lg max-w-xl mx-auto mb-8">
              Track your representatives, stay informed on elections, and take action — all in one place.
            </p>

            {/* Address search */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Enter your address or ZIP code"
                  className="input-wpa pl-9"
                />
              </div>
              <button type="submit" className="btn btn-primary flex-shrink-0">Find Reps</button>
            </form>
          </motion.div>

          {/* Decorative border line */}
          <div className="absolute bottom-0 left-0 right-0 h-2"
            style={{ background: 'linear-gradient(90deg, #7B1D3A, #C4623A, #5C7A5E, #A8C4C8)' }} />
        </div>
      </section>

      {/* ── Bento Grid ────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-20 pb-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-bento gap-4"
          variants={stagger} initial="hidden" animate="show"
        >
          {/* Your Local Reps — 2x2 */}
          <motion.div variants={fadeUp} className="tile-2x2 md:tile-2x2">
            <BentoTile
              title="Your Local Representatives"
              subtitle="Mesa City Council, Mayor, School Board"
              zone="local"
              size="2x2"
              href="/representatives?level=local"
              icon={<Building2 size={20} />}
              stats={[
                { label: 'Officials', value: String(localCount) },
                { label: 'Your District', value: '6' },
                { label: 'Next Election', value: 'Nov 2026' },
              ]}
            />
          </motion.div>

          {/* State Government — 1x2 */}
          <motion.div variants={fadeUp} className="tile-1x2 md:tile-1x2">
            <BentoTile
              title="State of Arizona"
              subtitle="Governor, Legislature, Courts"
              zone="state"
              size="1x2"
              href="/representatives?level=state"
              icon={<MapPin size={20} />}
              stats={[
                { label: 'Officials', value: String(stateCount) },
                { label: 'Legislature', value: '90 Seats' },
              ]}
            />
          </motion.div>

          {/* Federal Delegation — 2x1 */}
          <motion.div variants={fadeUp} className="tile-2x1">
            <BentoTile
              title="Federal Delegation"
              subtitle="U.S. Senators and House Representatives"
              zone="federal"
              size="2x1"
              href="/representatives?level=federal"
              icon={<Landmark size={20} />}
              stats={[
                { label: 'AZ Members', value: String(fedCount) },
                { label: 'Senators', value: '2' },
              ]}
            />
          </motion.div>

          {/* 2026 Elections — 1x1 */}
          <motion.div variants={fadeUp}>
            <BentoTile
              title="2026 Elections"
              subtitle={nextDeadline ? `${daysUntil(nextDeadline.date_iso)} days to ${nextDeadline.label}` : 'Election calendar'}
              zone="neutral"
              size="1x1"
              href="/elections"
              icon={<Calendar size={20} />}
            />
          </motion.div>

          {/* Find Your District — 1x1 */}
          <motion.div variants={fadeUp}>
            <BentoTile
              title="Find Your District"
              subtitle="Enter your address to find your reps"
              zone="neutral"
              size="1x1"
              href="/districts"
              icon={<Search size={20} />}
            />
          </motion.div>

          {/* Active Legislation — 2x1 */}
          <motion.div variants={fadeUp} className="tile-2x1">
            <BentoTile
              title="Active Legislation"
              subtitle="Track bills affecting Mesa and Arizona"
              zone="neutral"
              size="2x1"
              href="/bills"
              icon={<FileText size={20} />}
              stats={[
                { label: 'Tracking', value: '3 Bills' },
              ]}
            />
          </motion.div>

          {/* Budget — 1x1 */}
          <motion.div variants={fadeUp}>
            <BentoTile
              title="City Budget"
              subtitle="Where your tax dollars go"
              zone="local"
              size="1x1"
              href="/budget"
              icon={<DollarSign size={20} />}
              stats={[{ label: 'FY 2025-26', value: '$2.1B' }]}
            />
          </motion.div>

          {/* Contact by Issue — 1x1 */}
          <motion.div variants={fadeUp}>
            <BentoTile
              title="Take Action"
              subtitle="Contact your reps about issues you care about"
              zone="neutral"
              size="1x1"
              href="/issues"
              icon={<MessageSquare size={20} />}
            />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
