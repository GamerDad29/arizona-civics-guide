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
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(45,90,61,0.1)' }}>
          <MapPin size={20} style={{ color: '#2D5A3D' }} />
        </div>
        <h1 className="font-display text-2xl font-bold" style={{ color: '#F0F4F8' }}>Who Represents You?</h1>
      </div>
      <p className="font-body text-sm mb-8 ml-[52px]" style={{ color: 'rgba(240,244,248,0.5)' }}>
        Pop in your address and we'll tell you exactly who's making decisions on your behalf,
        from city hall all the way to Congress.
      </p>

      {/* Search Form */}
      <div className="glass-card p-6 mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(240,244,248,0.3)' }} />
            <input
              type="text"
              value={address}
              onChange={e => { setAddress(e.target.value); setSubmitted(false); }}
              placeholder="Enter your street address, city, state..."
              className="input-az pl-9"
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
            <div className="az-alert az-alert-info">
              <p className="font-body text-sm mb-2">
                We'll open the official Arizona Legislature lookup tool with your address ready to go.
              </p>
              <a
                href={`https://www.azleg.gov/find-my-legislator/?addr=${encodeURIComponent(address)}`}
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
      <h2 className="font-display text-lg font-bold mb-4" style={{ color: '#F0F4F8' }}>Understanding Your Districts</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10" style={{ gridAutoRows: '1fr' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="h-full"
        >
          <div className="glass-card overflow-hidden h-full flex flex-col">
            <div className="h-1" style={{ background: '#B87333' }} />
            <div className="p-5 flex flex-col flex-1">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(184,115,51,0.1)' }}>
                <Building2 size={20} style={{ color: '#B87333' }} />
              </div>
              <h3 className="font-display font-bold text-base mb-2" style={{ color: '#F0F4F8' }}>Local Districts</h3>
              <p className="font-body text-sm leading-relaxed line-clamp-4 flex-1" style={{ color: 'rgba(240,244,248,0.5)' }}>
                Your city council district determines who represents your neighborhood on local issues like
                roads, parks, zoning, and city services. Mesa has six council districts plus a mayor elected citywide.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="h-full"
        >
          <div className="glass-card overflow-hidden h-full flex flex-col">
            <div className="h-1" style={{ background: '#2D5A3D' }} />
            <div className="p-5 flex flex-col flex-1">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(45,90,61,0.1)' }}>
                <Landmark size={20} style={{ color: '#2D5A3D' }} />
              </div>
              <h3 className="font-display font-bold text-base mb-2" style={{ color: '#F0F4F8' }}>State Districts</h3>
              <p className="font-body text-sm leading-relaxed line-clamp-4 flex-1" style={{ color: 'rgba(240,244,248,0.5)' }}>
                Arizona has 30 legislative districts, each electing one state senator and two state representatives.
                These officials write state laws, set the state budget, and shape education and healthcare policy.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="h-full"
        >
          <div className="glass-card overflow-hidden h-full flex flex-col">
            <div className="h-1" style={{ background: '#87CEEB' }} />
            <div className="p-5 flex flex-col flex-1">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(135,206,235,0.1)' }}>
                <Globe size={20} style={{ color: '#87CEEB' }} />
              </div>
              <h3 className="font-display font-bold text-base mb-2" style={{ color: '#F0F4F8' }}>Federal Districts</h3>
              <p className="font-body text-sm leading-relaxed line-clamp-4 flex-1" style={{ color: 'rgba(240,244,248,0.5)' }}>
                Arizona has 9 Congressional districts, each electing one U.S. Representative. You also have two
                U.S. Senators who represent the entire state. They work on federal laws, taxes, and national defense.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* External Tools */}
      <div className="az-divider mb-6" />
      <h2 className="font-display text-lg font-bold mb-4" style={{ color: '#F0F4F8' }}>District Lookup Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href="https://www.azleg.gov/find-my-legislator/"
          target="_blank"
          rel="noreferrer"
          className="glass-card p-4 group"
        >
          <div className="flex items-center gap-2 mb-1">
            <ExternalLink size={14} style={{ color: '#2D5A3D' }} />
            <span className="font-ui font-semibold text-xs uppercase tracking-wider transition-colors" style={{ color: '#2D5A3D' }}>
              AZ Legislature - Find My Legislator
            </span>
          </div>
          <p className="font-body text-xs" style={{ color: 'rgba(240,244,248,0.4)' }}>Look up your state senator and representatives by address</p>
        </a>

        <a
          href="https://www.house.gov/representatives/find-your-representative"
          target="_blank"
          rel="noreferrer"
          className="glass-card p-4 group"
        >
          <div className="flex items-center gap-2 mb-1">
            <ExternalLink size={14} style={{ color: '#87CEEB' }} />
            <span className="font-ui font-semibold text-xs uppercase tracking-wider transition-colors" style={{ color: '#87CEEB' }}>
              U.S. House - Find Your Representative
            </span>
          </div>
          <p className="font-body text-xs" style={{ color: 'rgba(240,244,248,0.4)' }}>Find your U.S. Congressional representative by ZIP code</p>
        </a>

        <a
          href="https://www.mesaaz.gov/government/council-districts"
          target="_blank"
          rel="noreferrer"
          className="glass-card p-4 group"
        >
          <div className="flex items-center gap-2 mb-1">
            <ExternalLink size={14} style={{ color: '#B87333' }} />
            <span className="font-ui font-semibold text-xs uppercase tracking-wider transition-colors" style={{ color: '#B87333' }}>
              Mesa Council Districts
            </span>
          </div>
          <p className="font-body text-xs" style={{ color: 'rgba(240,244,248,0.4)' }}>View Mesa city council district boundaries and representatives</p>
        </a>

        <a
          href="https://azredistricting.org/districtlocator/"
          target="_blank"
          rel="noreferrer"
          className="glass-card p-4 group"
        >
          <div className="flex items-center gap-2 mb-1">
            <ExternalLink size={14} style={{ color: '#B87333' }} />
            <span className="font-ui font-semibold text-xs uppercase tracking-wider transition-colors" style={{ color: '#B87333' }}>
              AZ Redistricting Commission
            </span>
          </div>
          <p className="font-body text-xs" style={{ color: 'rgba(240,244,248,0.4)' }}>Interactive district maps for both legislative and congressional districts</p>
        </a>
      </div>
    </motion.div>
  );
}
