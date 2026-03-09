import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { OfficialProfile } from './components/OfficialProfile';
import { LocalView } from './views/LocalView';
import { StateView } from './views/StateView';
import { FederalView } from './views/FederalView';
import { ElectionsView } from './views/ElectionsView';
import { BudgetView } from './views/BudgetView';
import { BillsView } from './views/BillsView';
import { IssuesView } from './views/IssuesView';
import { useCivicData } from './hooks/useCivicData';
import type { CivicOfficial } from './types';
import type { NavView } from './types';

const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22 } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.14 } },
};

export default function App() {
  const [view, setView] = useState<NavView>('local');
  const [selectedOfficial, setSelectedOfficial] = useState<CivicOfficial | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const civic = useCivicData();

  function handleSelectOfficial(o: CivicOfficial) {
    setSelectedOfficial(o);
    setView('official-profile');
    setMobileOpen(false);
  }

  function handleNav(v: NavView) {
    setView(v);
    if (v !== 'official-profile') setSelectedOfficial(null);
    setMobileOpen(false);
  }

  const mainKey = view === 'official-profile' ? `profile-${selectedOfficial?.id}` : view;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#080c14' }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative z-30 h-full transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar
          currentView={view}
          selectedOfficial={selectedOfficial}
          onNavChange={handleNav}
          onSelectOfficial={handleSelectOfficial}
          civic={civic}
          sidebarOpen={mobileOpen}
        />
      </div>

      {/* Main panel */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 lg:hidden"
          style={{ background: '#0d1220', borderBottom: '1px solid #1f2d45' }}>
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-md text-text2 hover:text-text1 transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <span className="font-display font-bold text-text1 text-sm">Arizona Civics Guide</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mainKey}
            variants={PAGE_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {view === 'official-profile' && selectedOfficial ? (
              <OfficialProfile
                official={selectedOfficial}
                onBack={() => handleNav('local')}
                enrichOfficial={civic.enrichOfficial}
              />
            ) : view === 'local' ? (
              <LocalView civic={civic} onSelectOfficial={handleSelectOfficial} />
            ) : view === 'state' ? (
              <StateView civic={civic} onSelectOfficial={handleSelectOfficial} />
            ) : view === 'federal' ? (
              <FederalView civic={civic} onSelectOfficial={handleSelectOfficial} />
            ) : view === 'elections' ? (
              <ElectionsView />
            ) : view === 'budget' ? (
              <BudgetView />
            ) : view === 'bills' ? (
              <BillsView />
            ) : view === 'issues' ? (
              <IssuesView />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
