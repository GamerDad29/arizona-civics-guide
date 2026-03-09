import { Nav } from './components/Nav';
import { FederalSection } from './sections/FederalSection';
import { StateSection } from './sections/StateSection';
import { LocalSection } from './sections/LocalSection';
import { EducationSection } from './sections/EducationSection';
import { BudgetSection } from './sections/BudgetSection';
import { BillsSection } from './sections/BillsSection';
import { VotingRecordsSection } from './sections/VotingRecordsSection';
import { ElectionsSection } from './sections/ElectionsSection';
import { IssuesSection } from './sections/IssuesSection';
import { DistrictFinderSection } from './sections/DistrictFinderSection';

export default function App() {
  return (
    <div className="min-h-screen bg-sand">
      <Nav />

      {/* Hero header */}
      <header className="bg-gradient-to-br from-navy-dark via-navy to-navy-light py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-copper text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-8 h-px bg-copper/50" />
            Mesa, Arizona
            <span className="w-8 h-px bg-copper/50" />
          </div>
          <h1 className="font-display font-bold text-white text-4xl sm:text-5xl leading-tight mb-3">
            Arizona Civics Guide
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Track your representatives · Stay informed · Take action
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="#federal" className="bg-copper/10 hover:bg-copper/20 border border-copper/30 text-copper text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Federal
            </a>
            <a href="#state" className="bg-white/5 hover:bg-white/10 border border-white/15 text-white/70 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              State
            </a>
            <a href="#local" className="bg-white/5 hover:bg-white/10 border border-white/15 text-white/70 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Mesa
            </a>
            <a href="#elections" className="bg-white/5 hover:bg-white/10 border border-white/15 text-white/70 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              2026 Elections
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-2">

        {/* Section group label */}
        <SectionGroupLabel label="Federal Representatives" icon="🏛️" />
        <FederalSection />

        <SectionGroupLabel label="State of Arizona" icon="🌵" />
        <StateSection />

        <SectionGroupLabel label="City of Mesa" icon="🌞" />
        <LocalSection />

        <SectionGroupLabel label="Education Governance" icon="📚" />
        <EducationSection />

        <SectionGroupLabel label="Budget & Transparency" icon="💰" />
        <BudgetSection />
        <BillsSection />
        <VotingRecordsSection />

        <SectionGroupLabel label="Elections & Civic Tools" icon="🗳️" />
        <ElectionsSection />
        <IssuesSection />
        <DistrictFinderSection />
      </main>

      <footer className="bg-navy py-8 mt-16 text-center text-white/40 text-xs">
        <p className="mb-1">Arizona Civics Guide — Mesa, AZ · Not affiliated with any government entity</p>
        <p>Data sourced from public records. Verify at official government websites.</p>
      </footer>
    </div>
  );
}

function SectionGroupLabel({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="flex items-center gap-3 pt-6 pb-1">
      <span className="text-lg">{icon}</span>
      <h2 className="font-display font-bold text-navy text-xl">{label}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-copper/30 to-transparent" />
    </div>
  );
}
