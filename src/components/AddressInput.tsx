import { useState } from 'react';
import { MapPin, Search, Loader2, CheckCircle, X } from 'lucide-react';
import type { AddressStatus } from '../hooks/useCivicData';

interface Props {
  value: string;
  normalizedAddress: string;
  status: AddressStatus;
  error: string | null;
  onSubmit: (addr: string) => void;
  onClear: () => void;
  variant: 'sidebar' | 'hero';
}

export function AddressInput({ value, normalizedAddress, status, error, onSubmit, onClear, variant }: Props) {
  const [draft, setDraft] = useState(value || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.trim()) onSubmit(draft.trim());
  };

  if (variant === 'sidebar') {
    if (status === 'success') {
      return (
        <div className="px-3 py-2 mx-2 mb-1 rounded-lg bg-raised border border-border" style={{ fontSize: '0.72rem' }}>
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <div className="flex items-center gap-1.5 text-success" style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              <CheckCircle size={10} />
              Address Set
            </div>
            <button onClick={onClear} className="text-text3 hover:text-text2 transition-colors">
              <X size={12} />
            </button>
          </div>
          <p className="text-text2 truncate leading-tight" title={normalizedAddress || value}>{normalizedAddress || value}</p>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="px-2 pb-2">
        <div className="relative">
          <MapPin size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text3" />
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Your Mesa address..."
            className="input-dark pl-7 pr-8 py-2 text-xs"
            style={{ fontSize: '0.72rem', padding: '7px 30px 7px 26px' }}
          />
          <button
            type="submit"
            disabled={!draft.trim() || status === 'loading'}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-text3 hover:text-copper transition-colors disabled:opacity-30"
          >
            {status === 'loading' ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
          </button>
        </div>
        {error && <p className="text-danger text-xs mt-1 px-1">{error}</p>}
      </form>
    );
  }

  // ── Hero variant ─────────────────────────────────────────
  return (
    <div className="flex flex-col items-center text-center max-w-lg mx-auto py-12 px-4">
      <div className="w-12 h-12 rounded-xl bg-copper/10 border border-copper/20 flex items-center justify-center mb-5">
        <MapPin size={22} className="text-copper" />
      </div>
      <h2 className="font-display font-bold text-text1 text-2xl mb-2">Find Your Representatives</h2>
      <p className="text-text2 text-sm mb-8 leading-relaxed">
        Enter your Mesa address and we'll show you the exact officials who represent you — local, state, and federal.
      </p>

      <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text3" />
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="123 Main St, Mesa, AZ 85201"
            className="input-dark pl-10 py-3"
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={!draft.trim() || status === 'loading'}
          className="btn btn-primary px-6 py-3 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
          {status === 'loading' ? 'Looking up...' : 'Find My Reps'}
        </button>
      </form>

      {error && (
        <div className="alert alert-danger mt-4 w-full text-left">
          {error}. Showing Mesa, AZ default officials instead.
        </div>
      )}

      <p className="text-text3 text-xs mt-6">
        Or <button className="text-copper hover:text-copper-light underline" onClick={() => onSubmit('Mesa, AZ')}>browse Mesa defaults</button> without an address
      </p>
    </div>
  );
}
