import { useLocation, Link } from 'wouter';
import { useState } from 'react';
import { Menu, X, MapPin } from 'lucide-react';
import { useUserLocation } from '../context/UserLocationContext';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/representatives', label: 'Representatives' },
  { href: '/elections', label: 'Elections' },
  { href: '/districts', label: 'Districts' },
  { href: '/bills', label: 'Bills' },
  { href: '/budget', label: 'Budget' },
  { href: '/issues', label: 'Issues' },
  { href: '/about', label: 'About' },
];

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { location: userLoc, isPersonalized, clearLocation } = useUserLocation();

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: 'rgba(15,25,35,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #B87333, #E25822)' }}
          >
            <span className="font-display font-bold text-xs" style={{ color: '#0F1923' }}>AZ</span>
          </div>
          <span className="font-display font-bold text-sm leading-none" style={{ color: '#F0F4F8' }}>
            Arizona Civics
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => {
            const active = link.href === '/' ? location === '/' : location.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-md font-ui font-semibold text-xs uppercase tracking-wider transition-colors"
                style={{
                  color: active ? '#B87333' : 'rgba(240,244,248,0.5)',
                  background: active ? 'rgba(184,115,51,0.1)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Location indicator */}
          {isPersonalized && (
            <div className="ml-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(184,115,51,0.1)', border: '1px solid rgba(184,115,51,0.2)' }}>
              <MapPin size={11} style={{ color: '#B87333' }} />
              <span className="font-ui font-semibold text-2xs uppercase tracking-wider" style={{ color: '#D4956B' }}>
                {userLoc.city}
              </span>
              <button
                onClick={(e) => { e.preventDefault(); clearLocation(); }}
                className="ml-0.5 transition-colors"
                style={{ color: 'rgba(240,244,248,0.3)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#E25822')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,244,248,0.3)')}
                aria-label="Clear location"
              >
                <X size={10} />
              </button>
            </div>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button className="md:hidden p-1.5" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open
            ? <X size={20} style={{ color: '#F0F4F8' }} />
            : <Menu size={20} style={{ color: '#F0F4F8' }} />
          }
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          className="md:hidden px-4 pb-4 pt-2 space-y-1"
          style={{
            background: 'rgba(15,25,35,0.95)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {isPersonalized && (
            <div className="flex items-center gap-1.5 px-3 py-2 mb-2 rounded-md" style={{ background: 'rgba(184,115,51,0.08)' }}>
              <MapPin size={12} style={{ color: '#B87333' }} />
              <span className="font-ui font-semibold text-xs uppercase tracking-wider" style={{ color: '#D4956B' }}>
                {userLoc.city}, AZ
              </span>
              <button
                onClick={() => { clearLocation(); setOpen(false); }}
                className="ml-auto text-xs font-ui uppercase tracking-wider"
                style={{ color: 'rgba(240,244,248,0.3)' }}
              >
                Change
              </button>
            </div>
          )}
          {NAV_LINKS.map(link => {
            const active = link.href === '/' ? location === '/' : location.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-md font-ui font-semibold text-sm uppercase tracking-wider"
                style={{
                  color: active ? '#B87333' : '#F0F4F8',
                  background: active ? 'rgba(184,115,51,0.1)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
