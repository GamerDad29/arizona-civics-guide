import { motion } from 'framer-motion';
import { Building2, Landmark, Globe, BookOpen, Database } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      {/* Hero */}
      <div className="text-center mb-12">
        <motion.div {...fadeUp} transition={{ delay: 0.1, duration: 0.4 }}>
          <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg, #7B1D3A, #C4623A)' }}>
            <BookOpen size={24} className="text-cream" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mb-3">
            Know Your Government
          </h1>
          <p className="font-body text-ink/60 max-w-xl mx-auto leading-relaxed">
            Government works best when people understand how it works. This guide breaks down the
            three levels of government that affect your daily life -- local, state, and federal.
          </p>
        </motion.div>
      </div>

      {/* Local Government */}
      <motion.section
        {...fadeUp}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="wpa-card overflow-hidden mb-6"
      >
        <div className="h-1" style={{ background: '#7B1D3A' }} />
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-burgundy/10 flex items-center justify-center flex-shrink-0">
              <Building2 size={20} className="text-burgundy" />
            </div>
            <h2 className="font-display text-xl font-bold text-ink">How Local Government Works</h2>
          </div>

          <div className="space-y-3 font-body text-sm text-ink/70 leading-relaxed">
            <p>
              Local government is the closest to you. It takes care of your neighborhood. Your city
              fixes the roads you drive on, runs the parks you visit, and keeps the water running in
              your home.
            </p>
            <p>
              In Mesa, the city council makes big decisions. There are six council members, each
              representing a different part of the city. The mayor is elected by everyone in Mesa
              and leads the council.
            </p>
            <p>
              Council members serve four-year terms. Elections happen every two years, with half the
              seats up each time. This means the city always has experienced members on the council.
            </p>

            <div className="wpa-divider my-4" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="stat-pill">
                <span className="stat-pill-label">Who is elected</span>
                <span className="stat-pill-value">Mayor + 6 council members</span>
              </div>
              <div className="stat-pill">
                <span className="stat-pill-label">Term length</span>
                <span className="stat-pill-value">4 years</span>
              </div>
              <div className="stat-pill">
                <span className="stat-pill-label">Elections</span>
                <span className="stat-pill-value">Every 2 years</span>
              </div>
              <div className="stat-pill">
                <span className="stat-pill-label">Why it matters</span>
                <span className="stat-pill-value">Roads, parks, water, safety</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* State Government */}
      <motion.section
        {...fadeUp}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="wpa-card overflow-hidden mb-6"
      >
        <div className="h-1" style={{ background: '#5C7A5E' }} />
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-sage/10 flex items-center justify-center flex-shrink-0">
              <Landmark size={20} className="text-sage" />
            </div>
            <h2 className="font-display text-xl font-bold text-ink">How State Government Works</h2>
          </div>

          <div className="space-y-3 font-body text-sm text-ink/70 leading-relaxed">
            <p>
              State government handles the big things that affect all of Arizona. It runs the public
              schools, builds the highways, manages state parks, and decides how much money goes to
              hospitals and colleges.
            </p>
            <p>
              Arizona has a legislature with two parts. The Senate has 30 members -- one from each
              district. The House of Representatives has 60 members -- two from each district. Together,
              they write and vote on state laws.
            </p>
            <p>
              The governor is the leader of the state. They sign bills into law or veto them. Legislators
              serve two-year terms, and the governor serves four years. You can vote for all of them.
            </p>

            <div className="wpa-divider my-4" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="stat-pill">
                <span className="stat-pill-label">Who is elected</span>
                <span className="stat-pill-value">Governor, 30 senators, 60 reps</span>
              </div>
              <div className="stat-pill">
                <span className="stat-pill-label">Term length</span>
                <span className="stat-pill-value">2 years (legislators), 4 years (governor)</span>
              </div>
              <div className="stat-pill">
                <span className="stat-pill-label">Districts</span>
                <span className="stat-pill-value">30 legislative districts</span>
              </div>
              <div className="stat-pill">
                <span className="stat-pill-label">Why it matters</span>
                <span className="stat-pill-value">Schools, highways, healthcare</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Federal Government */}
      <motion.section
        {...fadeUp}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="wpa-card overflow-hidden mb-10"
      >
        <div className="h-1" style={{ background: '#A8C4C8' }} />
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-sky/10 flex items-center justify-center flex-shrink-0">
              <Globe size={20} className="text-sky-dark" />
            </div>
            <h2 className="font-display text-xl font-bold text-ink">How Federal Government Works</h2>
          </div>

          <div className="space-y-3 font-body text-sm text-ink/70 leading-relaxed">
            <p>
              The federal government is in Washington, D.C. It handles things that affect the whole
              country -- like the military, Social Security, immigration, and trade with other nations.
            </p>
            <p>
              Congress makes the laws. It has two parts: the Senate (100 members, 2 per state) and the
              House of Representatives (435 members, based on population). Arizona has 9 House members
              and 2 Senators.
            </p>
            <p>
              House members serve two-year terms. Senators serve six-year terms. The President leads
              the executive branch and serves four years. Every election matters because it shapes
              policies on taxes, healthcare, and national security.
            </p>

            <div className="wpa-divider my-4" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="stat-pill">
                <span className="stat-pill-label">AZ in Congress</span>
                <span className="stat-pill-value">2 senators, 9 representatives</span>
              </div>
              <div className="stat-pill">
                <span className="stat-pill-label">Term lengths</span>
                <span className="stat-pill-value">2 yrs (House), 6 yrs (Senate)</span>
              </div>
              <div className="stat-pill">
                <span className="stat-pill-label">Districts</span>
                <span className="stat-pill-value">9 congressional districts</span>
              </div>
              <div className="stat-pill">
                <span className="stat-pill-label">Why it matters</span>
                <span className="stat-pill-value">Taxes, defense, immigration</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Data Sources */}
      <motion.section
        {...fadeUp}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="wpa-divider mb-6" />

        <div className="flex items-center gap-2 mb-4">
          <Database size={18} className="text-ink/40" />
          <h2 className="font-display text-lg font-bold text-ink">Data Sources</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="wpa-card p-4">
            <p className="font-ui font-semibold text-xs uppercase tracking-wider text-terracotta mb-1">Google Civic Information API</p>
            <p className="font-body text-xs text-ink/50">Representative and election data sourced from Google's civic database</p>
          </div>
          <div className="wpa-card p-4">
            <p className="font-ui font-semibold text-xs uppercase tracking-wider text-terracotta mb-1">Congress.gov</p>
            <p className="font-body text-xs text-ink/50">Federal legislative data, bill tracking, and voting records</p>
          </div>
          <div className="wpa-card p-4">
            <p className="font-ui font-semibold text-xs uppercase tracking-wider text-terracotta mb-1">AZ Secretary of State</p>
            <p className="font-body text-xs text-ink/50">Election deadlines, voter registration, and official Arizona election data</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="wpa-alert wpa-alert-info">
          <p className="font-body text-xs text-ink/60 leading-relaxed">
            <strong className="text-ink/80">Disclaimer:</strong> Arizona Civics Guide is an independent educational
            project and is not affiliated with any government agency, political party, or campaign. All information
            is sourced from public records and official APIs. While we strive for accuracy, always verify important
            details at official government websites. This tool is meant to help citizens understand and engage with
            their government -- not to advocate for any political position.
          </p>
        </div>
      </motion.section>
    </motion.div>
  );
}
