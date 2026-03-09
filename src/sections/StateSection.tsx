import { SectionCard } from '../components/SectionCard';
import { OfficialCard } from '../components/OfficialCard';
import { governor, statewideOfficials, sheriff } from '../data/officials';
import { AlertTriangle } from 'lucide-react';

export function StateSection() {
  return (
    <div id="state">
      <SectionCard title="Arizona Governor" subtitle="State of Arizona executive">
        <OfficialCard official={governor} />
      </SectionCard>

      <SectionCard title="Other Statewide Officials" subtitle="All up for election in 2026">
        <div className="grid gap-4 sm:grid-cols-2">
          {statewideOfficials.map(o => <OfficialCard key={o.id} official={o} />)}
        </div>
      </SectionCard>

      <SectionCard
        title="Arizona State Legislature"
        subtitle="1 State Senator + 2 State Representatives per district"
        alert={
          <div className="flex gap-2 items-start bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
            <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-500" />
            <span>
              <strong>Legislative District Unknown.</strong> Use the District Finder to determine your LD-12, LD-13, or other district.
            </span>
          </div>
        }
      >
        <div className="space-y-4 text-sm text-navy/70">
          <div className="bg-sand-100 rounded-lg p-4 space-y-1">
            <p className="font-semibold text-navy">Structure</p>
            <p>Arizona has 30 Legislative Districts. Each elects 1 State Senator and 2 State Representatives (2-year terms).</p>
          </div>
          <div className="bg-sand-100 rounded-lg p-4 space-y-1">
            <p className="font-semibold text-navy">Current Composition (2025–2026)</p>
            <p>State Senate: <span className="text-rep font-medium">16 Republicans</span>, <span className="text-dem font-medium">14 Democrats</span></p>
            <p>State House: <span className="text-rep font-medium">33 Republicans</span>, <span className="text-dem font-medium">27 Democrats</span></p>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <a href="https://www.azleg.gov/" target="_blank" rel="noreferrer"
              className="contact-btn outline text-xs">AZ Legislature</a>
            <a href="https://www.azleg.gov/votes/" target="_blank" rel="noreferrer"
              className="contact-btn outline text-xs">Voting Records</a>
            <a href="https://apps.azsos.gov/election/cfs/" target="_blank" rel="noreferrer"
              className="contact-btn outline text-xs">Campaign Finance</a>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Maricopa County Sheriff" subtitle="County-level law enforcement">
        <OfficialCard official={sheriff} />
      </SectionCard>
    </div>
  );
}
