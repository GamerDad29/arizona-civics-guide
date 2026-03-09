import type { Party } from '../data/officials';

interface Props {
  party: Party;
  size?: 'sm' | 'md';
}

const labels: Record<Party, string> = { D: 'Democrat', R: 'Republican', I: 'Independent' };
const classes: Record<Party, string> = {
  D: 'party-badge dem',
  R: 'party-badge rep',
  I: 'party-badge ind',
};

export function PartyBadge({ party, size = 'md' }: Props) {
  return (
    <span className={`${classes[party]}${size === 'sm' ? ' text-xs px-2 py-0.5' : ''}`}>
      {labels[party]}
    </span>
  );
}
