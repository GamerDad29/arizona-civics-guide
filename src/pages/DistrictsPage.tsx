import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Building2, Landmark, Globe, ExternalLink } from 'lucide-react';

export function DistrictsPage() {
  const [address, setAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (address.trim()) setSubmitted(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-sage/10">
          <MapPin size={20} className="text-sage" />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">Find Your District</h1>
      </div>
      <p className="font-body text-ink/60 text-sm mb-8 ml-[52px]">
        Enter your address to discover which local, state, and federal districts you belong to
        and who represents you at every level.
      </p>

      {/* Search Form */}
      <div className="wpa-card p-6 mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
            <input
              type="text"
              value={address}
              onChange={e => { setAddress(e.target.value); setSubmitted(false); }}
              placeholder="Enter your street address, city, state..."
              className="input-wpa pl-9"
            />
          </div>
          <button type="submit" className="btn btn-primary flex-shrink-0">
            <MapPin size={14} /> Look Up
          </button>
        </form>

        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <div className="wpa-alert wpa-alert-info">
              <p className="font-body text-sm mb-2">
                For the most accurate district information, use the official Arizona Legislature lookup tool.
              </p>
              <a
                href="https://www.azleg.gov/find-my-legislator/"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline text-xs inline-flex"
              >
                <ExternalLink size={12} /> Find My Legislator on azleg.gov
              </a>
            </div>
          </motion.div>
        )}
      </div>

      {/* District Info Cards */}
      <h2 className="font-display text-lg font-bold text-ink mb-4">Understanding Your Districts</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="wpa-card overflow-hidden"
        >
          <div className="h-1" style={{ background: '#7B1D3A' }} />
          <div className="p-5">
            <div className="w-10 h-10 rounded-lg bg-burgundy/10 flex items-center justify-center mb-3">
              <Building2 size={20} className="text-burgundy" />
            </div>
            <h3 className="font-display font-bold text-ink text-base mb-2">Local Districts</h3>
            <p className="font-body text-sm text-ink/60 leading-relaxed">
              Your city council district determines who represents your neighborhood on local issues like
              roads, parks, zoning, and city services. Mesa has six council districts plus a mayor elected citywide.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="wpa-card overflow-hidden"
        >
          <div className="h-1" style={{ background: '#5C7A5E' }} />
          <div className="p-5">
            <div className="w-10 h-10 rounded-lg bg-sage/10 flex items-center justify-center mb-3">
              <Landmark size={20} className="text-sage" />
            </div>
            <h3 className="font-display font-bold text-ink text-base mb-2">State Districts</h3>
            <p className="font-body text-sm text-ink/60 leading-relaxed">
              Arizona has 30 legislative districts, each electing one state senator and two state representatives.
              These officials write state laws, set the state budget, and shape education and healthcare policy.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="wpa-card overflow-hidden"
        >
          <div className="h-1" style={{ background: '#A8C4C8' }} />
          <div className="p-5">
            <div className="w-10 h-10 rounded-lg bg-sky/10 flex items-center justify-center mb-3">
              <Globe size={20} className="text-sky-dark" />
            </div>
            <h3 className="font-display font-bold text-ink text-base mb-2">Federal Districts</h3>
            <p className="font-body text-sm text-ink/60 leading-relaxed">
              Arizona has 9 Congressional districts, each electing one U.S. Representative. You also have two
              U.S. Senators who represent the entire state. They work on federal laws, taxes, and national defense.
            </p>
          </div>
        </motion.div>
      </div>

      {/* External Tools */}
      <div className="wpa-divider mb-6" />
      <h2 className="font-display text-lg font-bold text-ink mb-4">District Lookup Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href="https://www.azleg.gov/find-my-legislator/"
          target="_blank"
          rel="noreferrer"
          className="wpa-card p-4 group"
        >
          <div className="flex items-center gap-2 mb-1">
            <ExternalLink size={14} className="text-sage" />
            <span className="font-ui font-semibold text-xs uppercase tracking-wider text-sage group-hover:text-sage-dark transition-colors">
              AZ Legislature - Find My Legislator
            </span>
          </div>
          <p className="font-body text-xs text-ink/50">Look up your state senator and representatives by address</p>
        </a>

        <a
          href="https://www.house.gov/representatives/find-your-representative"
          target="_blank"
          rel="noreferrer"
          className="wpa-card p-4 group"
        >
          <div className="flex items-center gap-2 mb-1">
            <ExternalLink size={14} className="text-sky-dark" />
            <span className="font-ui font-semibold text-xs uppercase tracking-wider text-sky-dark group-hover:text-ink transition-colors">
              U.S. House - Find Your Representative
            </span>
          </div>
          <p className="font-body text-xs text-ink/50">Find your U.S. Congressional representative by ZIP code</p>
        </a>

        <a
          href="https://www.mesaaz.gov/government/council-districts"
          target="_blank"
          rel="noreferrer"
          className="wpa-card p-4 group"
        >
          <div className="flex items-center gap-2 mb-1">
            <ExternalLink size={14} className="text-burgundy" />
            <span className="font-ui font-semibold text-xs uppercase tracking-wider text-burgundy group-hover:text-burgundy-dark transition-colors">
              Mesa Council Districts
            </span>
          </div>
          <p className="font-body text-xs text-ink/50">View Mesa city council district boundaries and representatives</p>
        </a>

        <a
          href="https://azredistricting.org/districtlocator/"
          target="_blank"
          rel="noreferrer"
          className="wpa-card p-4 group"
        >
          <div className="flex items-center gap-2 mb-1">
            <ExternalLink size={14} className="text-terracotta" />
            <span className="font-ui font-semibold text-xs uppercase tracking-wider text-terracotta group-hover:text-terracotta-dark transition-colors">
              AZ Redistricting Commission
            </span>
          </div>
          <p className="font-body text-xs text-ink/50">Interactive district maps for both legislative and congressional districts</p>
        </a>
      </div>
    </motion.div>
  );
}
