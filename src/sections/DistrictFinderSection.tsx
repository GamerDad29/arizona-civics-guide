import { useState } from 'react';
import { SectionCard } from '../components/SectionCard';
import { MapPin, Search } from 'lucide-react';

export function DistrictFinderSection() {
  const [address, setAddress] = useState('');

  const handleFind = (e: React.FormEvent) => {
    e.preventDefault();
    const encoded = encodeURIComponent(address + ', Mesa, AZ');
    window.open(`https://gis.mesaaz.gov/AddressSearch/?address=${encoded}`, '_blank');
  };

  return (
    <div id="district-finder">
      <SectionCard
        title="District Finder"
        subtitle="Enter your Mesa address to find your exact representatives"
      >
        <form onSubmit={handleFind} className="space-y-4">
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" />
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="123 Main Street, Mesa, AZ 85201"
              className="w-full pl-9 pr-4 py-3 border border-sand-200 rounded-lg bg-white text-navy placeholder-navy/30
                focus:outline-none focus:ring-2 focus:ring-copper/30 focus:border-copper transition-all text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={!address.trim()}
            className="flex items-center gap-2 bg-navy hover:bg-navy-light disabled:opacity-50 disabled:cursor-not-allowed
              text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            <Search size={15} />
            Find My Districts
          </button>
        </form>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Congressional District', hint: 'Determines your U.S. House rep (CD-04 or CD-05)' },
            { label: 'Legislative District', hint: 'Determines your State Senator and 2 State Reps' },
            { label: 'City Council District', hint: 'Determines your Mesa City Councilmember' },
          ].map((item, i) => (
            <div key={i} className="bg-sand-100 rounded-lg p-4 border border-sand-200">
              <p className="font-semibold text-navy text-sm">{item.label}</p>
              <p className="text-xs text-navy/55 mt-1">{item.hint}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <a href="https://gis.mesaaz.gov/AddressSearch/" target="_blank" rel="noreferrer"
            className="contact-btn outline text-xs">Mesa GIS Address Tool</a>
          <a href="https://www.azleg.gov/find-my-legislator/" target="_blank" rel="noreferrer"
            className="contact-btn outline text-xs">Find My Legislator</a>
          <a href="https://www.house.gov/representatives/find-your-representative" target="_blank" rel="noreferrer"
            className="contact-btn outline text-xs">Find My U.S. Rep</a>
        </div>
      </SectionCard>
    </div>
  );
}
