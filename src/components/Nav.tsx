import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Federal', href: '#federal' },
  { label: 'State', href: '#state' },
  { label: 'Mesa', href: '#local' },
  { label: 'Education', href: '#education' },
  { label: 'Budget', href: '#budget' },
  { label: 'Bills', href: '#bills' },
  { label: 'Voting Records', href: '#voting-records' },
  { label: '2026 Elections', href: '#elections' },
  { label: 'Contact by Issue', href: '#issues' },
  { label: 'District Finder', href: '#district-finder' },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-navy shadow-lg shadow-navy/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded bg-copper flex items-center justify-center">
              <span className="text-white font-display font-bold text-xs">AZ</span>
            </div>
            <span className="font-display font-bold text-white text-sm tracking-wide hidden sm:block">
              Arizona Civics Guide
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5 overflow-x-auto">
            {navItems.map(item => (
              <a key={item.href} href={item.href} className="nav-link whitespace-nowrap">
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white/70 hover:text-white p-2 rounded transition-colors"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-navy-dark border-t border-white/10 px-4 pb-4">
          <div className="grid grid-cols-2 gap-1 pt-3">
            {navItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="nav-link text-center"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
