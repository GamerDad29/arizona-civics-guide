import { SectionCard } from '../components/SectionCard';
import { StatusChip } from '../components/StatusChip';
import { bills } from '../data/bills';

const tagColors: Record<string, string> = {
  housing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  education: 'bg-sky-100 text-sky-800 border-sky-200',
  healthcare: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  transportation: 'bg-purple-100 text-purple-800 border-purple-200',
  environment: 'bg-green-100 text-green-800 border-green-200',
  economy: 'bg-amber-100 text-amber-800 border-amber-200',
  'public-safety': 'bg-red-100 text-red-800 border-red-200',
  water: 'bg-blue-100 text-blue-800 border-blue-200',
  immigration: 'bg-indigo-100 text-indigo-800 border-indigo-200',
};

const levelLabels: Record<string, string> = {
  federal: 'Federal',
  state: 'State',
  local: 'Local',
};

export function BillsSection() {
  return (
    <div id="bills">
      <SectionCard
        title="Bill Tracker"
        subtitle="Legislation affecting Mesa and Arizona residents"
      >
        <div className="space-y-4">
          {bills.map(bill => (
            <div key={bill.id} className="bg-sand-100 rounded-lg p-4 border border-sand-200">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-copper bg-copper/10 border border-copper/20 rounded px-2 py-0.5">
                    {bill.number}
                  </span>
                  <span className="level-badge level-{level}" style={{}}>
                    <span className={`level-badge ${bill.level}`}>{levelLabels[bill.level]}</span>
                  </span>
                  <StatusChip status={bill.status} />
                </div>
              </div>
              <h3 className="font-semibold text-navy text-sm leading-snug mb-1">{bill.title}</h3>
              <p className="text-sm text-navy/70 leading-relaxed">{bill.summary}</p>
              {bill.impact && (
                <p className="text-xs text-navy/50 mt-1">{bill.impact}</p>
              )}
              {bill.yourRep && (
                <p className="text-xs text-copper font-medium mt-2">Your reps: {bill.yourRep}</p>
              )}
              {bill.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {bill.tags.map(tag => (
                    <span key={tag} className={`text-xs border rounded px-2 py-0.5 capitalize ${tagColors[tag] || 'bg-sand-200 text-navy/60 border-sand-300'}`}>
                      {tag.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              )}
              {bill.trackerUrl && (
                <div className="mt-3">
                  <a href={bill.trackerUrl} target="_blank" rel="noreferrer"
                    className="contact-btn outline text-xs">Track Bill</a>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <a href="https://www.azleg.gov/" target="_blank" rel="noreferrer"
            className="contact-btn outline text-xs">AZ Legislature Tracker</a>
          <a href="https://www.mesaaz.gov/Government/City-Clerk/Introduced-Ordinances" target="_blank" rel="noreferrer"
            className="contact-btn outline text-xs">Mesa Ordinances</a>
        </div>
      </SectionCard>
    </div>
  );
}
