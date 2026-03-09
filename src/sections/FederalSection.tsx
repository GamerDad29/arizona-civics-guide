import { SectionCard } from '../components/SectionCard';
import { OfficialCard } from '../components/OfficialCard';
import { senators, houseReps } from '../data/officials';
import { AlertTriangle } from 'lucide-react';

export function FederalSection() {
  return (
    <div id="federal">
      <SectionCard
        title="U.S. Senators"
        subtitle="Both senators represent all Arizonans statewide"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {senators.map(s => <OfficialCard key={s.id} official={s} />)}
        </div>
      </SectionCard>

      <SectionCard
        title="U.S. House Representative"
        subtitle="Your district depends on your Mesa address"
        alert={
          <div className="flex gap-2 items-start bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
            <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-500" />
            <span>
              <strong>Congressional District Unknown.</strong> Highland Ridge is likely in CD-04 (Greg Stanton) or CD-05 (Andy Biggs).
              Use the District Finder at the bottom to confirm.
            </span>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {houseReps.map(r => <OfficialCard key={r.id} official={r} />)}
        </div>
      </SectionCard>
    </div>
  );
}
