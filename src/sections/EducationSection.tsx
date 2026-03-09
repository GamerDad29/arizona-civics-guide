import { SectionCard } from '../components/SectionCard';
import { OfficialCard } from '../components/OfficialCard';
import { schoolBoard } from '../data/officials';

export function EducationSection() {
  return (
    <div id="education">
      <SectionCard
        title="Mesa Public Schools Governing Board"
        subtitle="7 elected members — at-large, all Mesa residents vote for all seats"
        alert={
          <div className="bg-sand-100 border border-sand-200 rounded-lg p-3 text-sm text-navy/70">
            <strong className="text-navy">At-Large Elections:</strong> All Mesa residents vote for all board seats.
            Controls ~$1.2B annual budget, 60,000 students, 85+ schools.
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
          {schoolBoard.map(m => <OfficialCard key={m.id} official={m} />)}
        </div>
        <div className="bg-sand-100 rounded-lg p-4 text-sm text-navy/70 space-y-1">
          <p><strong className="text-navy">Budget:</strong> ~$1.2 Billion annually</p>
          <p><strong className="text-navy">Students:</strong> ~60,000</p>
          <p><strong className="text-navy">Schools:</strong> 85+</p>
          <p><strong className="text-navy">Meetings:</strong> Typically 2nd &amp; 4th Tuesdays, 7pm</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <a href="mailto:board@mpsaz.org" className="contact-btn email text-xs">Email Board</a>
          <a href="https://www.mpsaz.org/governing-board" target="_blank" rel="noreferrer"
            className="contact-btn outline text-xs">Board Info</a>
          <a href="https://www.mpsaz.org/budget" target="_blank" rel="noreferrer"
            className="contact-btn outline text-xs">MPS Budget</a>
        </div>
      </SectionCard>
    </div>
  );
}
