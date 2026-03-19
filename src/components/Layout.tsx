import type { ReactNode } from 'react';
import { Navbar } from './Navbar';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0F1923' }}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-display font-bold text-sm" style={{ color: '#F0F4F8' }}>Arizona Civics Guide</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(240,244,248,0.4)' }}>Mesa, AZ · Not affiliated with any government entity</p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs" style={{ color: 'rgba(240,244,248,0.3)' }}>
              <a href="https://azsos.gov/elections" target="_blank" rel="noreferrer" className="transition-colors" style={{ color: 'inherit' }} onMouseEnter={e => (e.currentTarget.style.color = '#B87333')} onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}>AZ Elections</a>
              <a href="https://www.azleg.gov/" target="_blank" rel="noreferrer" className="transition-colors" style={{ color: 'inherit' }} onMouseEnter={e => (e.currentTarget.style.color = '#B87333')} onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}>AZ Legislature</a>
              <a href="https://www.congress.gov/" target="_blank" rel="noreferrer" className="transition-colors" style={{ color: 'inherit' }} onMouseEnter={e => (e.currentTarget.style.color = '#B87333')} onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}>Congress.gov</a>
              <a href="https://www.mesaaz.gov/" target="_blank" rel="noreferrer" className="transition-colors" style={{ color: 'inherit' }} onMouseEnter={e => (e.currentTarget.style.color = '#B87333')} onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}>City of Mesa</a>
            </div>
          </div>
          <div className="copper-line mt-6 mb-3 opacity-30" />
          <p className="text-2xs" style={{ color: 'rgba(240,244,248,0.2)' }}>
            Data sourced from Google Civic Information API, Congress.gov, and public records. Verify at official government websites.
          </p>
        </div>
      </footer>
    </div>
  );
}
