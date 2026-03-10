import { useLocation, Link } from 'wouter';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/representatives', label: 'Representatives' },
  { href: '/elections', label: 'Elections' },
  { href: '/districts', label: 'Districts' },
  { href: '/about', label: 'About' },
];

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40" style={{ background: '#EDE8D8ee', backdropFilter: 'blur(12px)', borderBottom: '1px solid #D5D0C2' }}>
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7B1D3A, #C4623A)' }}>
            <span className="font-display font-bold text-cream text-xs">AZ</span>
          </div>
          <div>
            <span className="font-display font-bold text-ink text-sm leading-none">Arizona Civics</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => {
            const active = link.href === '/' ? location === '/' : location.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href}
                className="px-3 py-1.5 rounded-md font-ui font-semibold text-xs uppercase tracking-wider transition-colors"
                style={{
                  color: active ? '#C4623A' : '#1C1A1880',
                  background: active ? '#C4623A10' : 'transparent',
                }}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button className="md:hidden p-1.5" onClick={() => setOpen(!open)}>
          {open ? <X size={20} className="text-ink" /> : <Menu size={20} className="text-ink" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-sand-dark px-4 pb-4 pt-2 space-y-1" style={{ background: '#EDE8D8' }}>
          {NAV_LINKS.map(link => {
            const active = link.href === '/' ? location === '/' : location.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-md font-ui font-semibold text-sm uppercase tracking-wider"
                style={{ color: active ? '#C4623A' : '#1C1A18', background: active ? '#C4623A10' : 'transparent' }}>
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
