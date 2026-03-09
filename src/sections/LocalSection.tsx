import { SectionCard } from '../components/SectionCard';
import { OfficialCard } from '../components/OfficialCard';
import { mayor, cityCouncil } from '../data/officials';

export function LocalSection() {
  const userCouncil = cityCouncil.find(c => c.isUserDistrict);
  const otherCouncil = cityCouncil.filter(c => !c.isUserDistrict);

  return (
    <div id="local">
      <SectionCard title="Mayor of Mesa" subtitle="41st Mayor of Mesa, Arizona">
        <OfficialCard official={mayor} />
      </SectionCard>

      <SectionCard
        title="Mesa City Council"
        subtitle="6 district councilmembers + Mayor"
        alert={
          userCouncil ? (
            <div className="bg-turq/10 border border-turq/30 rounded-lg p-3 text-sm text-turq-dark font-medium">
              You are in District 6. Your councilmember is Vice Mayor Scott Somers — seat up for election Nov 2026.
            </div>
          ) : undefined
        }
      >
        <div className="mb-6">
          <p className="section-label mb-3">Your Representative</p>
          {userCouncil && <OfficialCard official={userCouncil} highlight />}
        </div>
        <div>
          <p className="section-label mb-3">All Council Members</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherCouncil.map(c => (
              <OfficialCard key={c.id} official={c} />
            ))}
          </div>
        </div>
        <div className="copper-divider" />
        <div className="flex flex-wrap gap-2 mt-4">
          <a href="https://www.mesaaz.gov/Government/Mayor-City-Council" target="_blank" rel="noreferrer"
            className="contact-btn outline text-xs">Council Info</a>
          <a href="https://gis.mesaaz.gov/AddressSearch/" target="_blank" rel="noreferrer"
            className="contact-btn outline text-xs">District Map</a>
          <a href="https://www.mesaaz.gov/Government/City-Council-Meetings" target="_blank" rel="noreferrer"
            className="contact-btn outline text-xs">Meetings</a>
        </div>
      </SectionCard>
    </div>
  );
}
