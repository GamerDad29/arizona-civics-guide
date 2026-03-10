import type { ReactNode } from 'react';
import { Navbar } from './Navbar';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-sand-dark mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-display font-bold text-ink text-sm">Arizona Civics Guide</p>
              <p className="text-xs text-ink/50 mt-1">Mesa, AZ — Not affiliated with any government entity</p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-ink/40">
              <a href="https://azsos.gov/elections" target="_blank" rel="noreferrer" className="hover:text-terracotta transition-colors">AZ Elections</a>
              <a href="https://www.azleg.gov/" target="_blank" rel="noreferrer" className="hover:text-terracotta transition-colors">AZ Legislature</a>
              <a href="https://www.congress.gov/" target="_blank" rel="noreferrer" className="hover:text-terracotta transition-colors">Congress.gov</a>
              <a href="https://www.mesaaz.gov/" target="_blank" rel="noreferrer" className="hover:text-terracotta transition-colors">City of Mesa</a>
            </div>
          </div>
          <p className="text-2xs text-ink/30 mt-4">Data sourced from Google Civic Information API, Congress.gov, and public records. Verify at official government websites.</p>
        </div>
      </footer>
    </div>
  );
}
