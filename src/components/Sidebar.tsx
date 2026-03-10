import { Building2, MapPin, Landmark, Calendar, DollarSign, FileText, MessageSquare, ChevronRight } from 'lucide-react';
import type { NavView, CivicOfficial } from '../types';
import type { UseCivicDataReturn } from '../hooks/useCivicData';
import { AddressInput } from './AddressInput';

interface Props {
  currentView: NavView;
  selectedOfficial: CivicOfficial | null;
  onNavChange: (view: NavView) => void;
  onSelectOfficial: (official: CivicOfficial) => void;
  civic: UseCivicDataReturn;
}

const mainNav = [
  { id: 'local'   as NavView, label: 'Mesa & Local',  icon: Building2 },
  { id: 'state'   as NavView, label: 'Arizona State', icon: MapPin    },
  { id: 'federal' as NavView, label: 'Federal',       icon: Landmark  },
];


const PARTY_COLORS: Record<string, string> = {
  D: '#4f7ef5', R: '#f05353', I: '#9b6fe8', NP: '#4a5a72',
};

function OfficialMiniRow({ official, isSelected, onClick }: {
  official: CivicOfficial;
  isSelected: boolean;
  onClick: () => void;
}) {
  const color = PARTY_COLORS[official.party ?? 'NP'];
  const initials = official.name.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 text-left transition-all hover:bg-raised"
      style={{ borderLeft: `2px solid ${isSelected ? color : 'transparent'}`, background: isSelected ? '#1a2236' : 'transparent' }}
    >
      {official.photoUrl ? (
        <img src={official.photoUrl} alt={official.name}
          className="w-6 h-6 rounded-full object-cover object-top flex-shrink-0"
          style={{ border: `1.5px solid ${color}40` }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      ) : (
        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-2xs font-bold"
          style={{ background: `${color}20`, color }}>
          {initials}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate" style={{ color: isSelected ? '#e4eaf6' : '#8896b0' }}>
          {official.name.split(' ').slice(-1)[0]}
        </p>
      </div>
      {isSelected && <ChevronRight size={11} style={{ color, flexShrink: 0 }} />}
    </button>
  );
}

export function Sidebar({ currentView, selectedOfficial, onNavChange, onSelectOfficial, civic }: Props) {
  const localReps = civic.officialsByLevel('local').filter(o =>
    o.id === 'freeman' || o.id === 'somers' || o.isUserDistrict
  ).slice(0, 3);
  const stateReps = civic.officialsByLevel('state').filter(o =>
    o.id === 'hobbs' || o.id === 'skinner'
  ).slice(0, 3);
  const fedReps = civic.officialsByLevel('federal').filter(o =>
    ['gallego', 'kelly', 'stanton', 'biggs'].includes(o.id)
  ).slice(0, 4);

  const activeView = currentView === 'official-profile' ? null : currentView;

  return (
    <aside className="sidebar-shell flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4" style={{ borderBottom: '1px solid #1f2d45' }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #c97b30, #e8a055)' }}>
          <span className="font-display font-bold text-white text-xs">AZ</span>
        </div>
        <div>
          <p className="font-display font-bold text-text1 text-sm leading-tight">Arizona Civics</p>
          <p className="text-2xs text-text3 leading-tight">Mesa Civic Guide</p>
        </div>
      </div>

      {/* Address input */}
      <div className="py-2" style={{ borderBottom: '1px solid #1f2d45' }}>
        <AddressInput
          value={civic.address}
          normalizedAddress={civic.normalizedAddress}
          status={civic.addressStatus}
          error={civic.addressError}
          onSubmit={civic.submitAddress}
          onClear={civic.clearAddress}
          variant="sidebar"
        />
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto py-2">

        {/* MY GOVERNMENT */}
        <p className="sidebar-section-label">My Government</p>
        {mainNav.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button key={item.id} onClick={() => onNavChange(item.id)}
              className={`sidebar-item w-full ${isActive ? 'active' : ''}`}>
              <Icon size={14} className="icon" />
              {item.label}
            </button>
          );
        })}

        {/* Quick-access reps by level */}
        {localReps.length > 0 && (
          <div className="mt-1 mb-1">
            <p className="sidebar-section-label" style={{ paddingTop: '8px' }}>Local</p>
            {localReps.map(o => (
              <OfficialMiniRow key={o.id} official={o}
                isSelected={selectedOfficial?.id === o.id}
                onClick={() => onSelectOfficial(o)} />
            ))}
          </div>
        )}
        {stateReps.length > 0 && (
          <div className="mt-1 mb-1">
            <p className="sidebar-section-label" style={{ paddingTop: '8px' }}>State</p>
            {stateReps.map(o => (
              <OfficialMiniRow key={o.id} official={o}
                isSelected={selectedOfficial?.id === o.id}
                onClick={() => onSelectOfficial(o)} />
            ))}
          </div>
        )}
        {fedReps.length > 0 && (
          <div className="mt-1 mb-1">
            <p className="sidebar-section-label" style={{ paddingTop: '8px' }}>Federal</p>
            {fedReps.map(o => (
              <OfficialMiniRow key={o.id} official={o}
                isSelected={selectedOfficial?.id === o.id}
                onClick={() => onSelectOfficial(o)} />
            ))}
          </div>
        )}

        {/* TOOLS */}
        <div className="mt-2">
          <p className="sidebar-section-label">Tools & Data</p>
          {[
            { id: 'elections' as NavView, label: '2026 Elections', Icon: Calendar },
            { id: 'budget'    as NavView, label: 'Budget',         Icon: DollarSign },
            { id: 'bills'     as NavView, label: 'Bill Tracker',   Icon: FileText },
            { id: 'issues'    as NavView, label: 'Contact by Issue', Icon: MessageSquare },
          ].map(({ id, label, Icon }) => (
            <button key={id} onClick={() => onNavChange(id)}
              className={`sidebar-item w-full ${activeView === id ? 'active' : ''}`}>
              <Icon size={14} className="icon" />
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid #1f2d45' }}>
        <p className="text-2xs text-text3 leading-relaxed">
          Data: Google Civic API · Congress.gov<br />
          Built for Mesa, AZ residents
        </p>
      </div>
    </aside>
  );
}
