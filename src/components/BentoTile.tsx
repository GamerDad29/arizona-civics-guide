import { Link } from 'wouter';
import type { ReactNode } from 'react';

type Zone = 'local' | 'state' | 'federal' | 'neutral';
type Size = '1x1' | '2x1' | '1x2' | '2x2';

const ZONE_GRADIENTS: Record<Zone, string> = {
  local:   'linear-gradient(135deg, #7B1D3A 0%, #9B3355 50%, #C4623A 100%)',
  state:   'linear-gradient(135deg, #3E5A40 0%, #5C7A5E 50%, #7A9A7C 100%)',
  federal: 'linear-gradient(135deg, #5A8A90 0%, #A8C4C8 50%, #C4DDE0 100%)',
  neutral: 'linear-gradient(135deg, #C4623A 0%, #D8845E 50%, #EDE8D8 100%)',
};

const ZONE_LABELS: Record<Zone, string> = {
  local: 'LOCAL', state: 'STATE', federal: 'FEDERAL', neutral: '',
};

const SIZE_CLASS: Record<Size, string> = {
  '1x1': '',
  '2x1': 'tile-2x1',
  '1x2': 'tile-1x2',
  '2x2': 'tile-2x2',
};

const MIN_HEIGHT: Record<Size, string> = {
  '1x1': '220px',
  '2x1': '200px',
  '1x2': '440px',
  '2x2': '440px',
};

interface Props {
  title: string;
  subtitle?: string;
  zone: Zone;
  size: Size;
  href: string;
  illustration?: string;
  icon?: ReactNode;
  stats?: { label: string; value: string }[];
  children?: ReactNode;
}

export function BentoTile({ title, subtitle, zone, size, href, illustration, icon, stats, children }: Props) {
  return (
    <Link href={href} className={`wpa-tile ${SIZE_CLASS[size]} zone-${zone}`}
      style={{ minHeight: MIN_HEIGHT[size] }}>

      {/* Illustration or gradient placeholder */}
      <div className="wpa-tile-illustration"
        style={{
          background: illustration ? `url(${illustration})` : ZONE_GRADIENTS[zone],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Zone badge */}
      {zone !== 'neutral' && (
        <div className="absolute top-3 left-3 z-10">
          <span className={`zone-badge zone-badge-${zone}`}>{ZONE_LABELS[zone]}</span>
        </div>
      )}

      {/* Content */}
      <div className="wpa-tile-content">
        {icon && <div className="mb-2 text-ink/60">{icon}</div>}
        <h3 className="font-display font-bold text-ink text-lg leading-tight">{title}</h3>
        {subtitle && <p className="text-sm text-ink/60 mt-1">{subtitle}</p>}

        {/* Hover reveal */}
        <div className="wpa-tile-hover-content mt-3">
          {stats && stats.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-3">
              {stats.map((s, i) => (
                <div key={i} className="stat-pill">
                  <span className="stat-pill-label">{s.label}</span>
                  <span className="stat-pill-value">{s.value}</span>
                </div>
              ))}
            </div>
          )}
          {children}
          <span className="font-ui font-semibold text-xs uppercase tracking-wider text-terracotta">
            Explore &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
