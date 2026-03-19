import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { fetchIssues } from '../lib/api';
import type { Issue } from '../lib/api';

const ISSUE_COLORS: Record<string, string> = {
  housing: '#B87333', education: '#5B8FD8', transportation: '#9B8BBE',
  safety: '#D86B6B', environment: '#87CEEB', healthcare: '#3D7A53',
  economy: '#D4956B', immigration: '#9B8BBE',
};

export function IssuesPage() {
  const { data: issues, loading } = useApi(() => fetchIssues(), []);
  const [selected, setSelected] = useState<Issue | null>(null);

  const active = selected ?? issues?.[0] ?? null;
  const color = active ? (ISSUE_COLORS[active.id] ?? '#B87333') : '#B87333';

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-10"><p style={{ color: 'rgba(240,244,248,0.3)' }}>Loading...</p></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare size={16} style={{ color: '#87CEEB' }} />
          <p className="az-label" style={{ color: '#87CEEB' }}>Contact by Issue</p>
        </div>
        <h1 className="font-display font-bold text-3xl mb-2" style={{ color: '#F0F4F8' }}>Take Action</h1>
        <p className="text-sm" style={{ color: 'rgba(240,244,248,0.5)' }}>Pick an issue below. We'll show you exactly who to talk to and how to reach them.</p>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <div className="space-y-1">
          {issues?.map(issue => {
            const ic = ISSUE_COLORS[issue.id] ?? '#B87333';
            const isActive = issue.id === active?.id;
            return (
              <button key={issue.id} onClick={() => setSelected(issue)}
                className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
                style={{
                  background: isActive ? `rgba(${hexToRgb(ic)},0.1)` : 'transparent',
                  border: `1px solid ${isActive ? `rgba(${hexToRgb(ic)},0.2)` : 'transparent'}`,
                }}>
                <div className="min-w-0">
                  <div className="text-sm font-semibold leading-tight" style={{ color: isActive ? ic : '#F0F4F8' }}>
                    {issue.label}
                  </div>
                  <div className="text-2xs truncate" style={{ color: 'rgba(240,244,248,0.3)' }}>{issue.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>

        {active && (
          <div>
            <div className="glass-card p-5 mb-4" style={{ borderColor: `rgba(${hexToRgb(color)},0.2)` }}>
              <h2 className="font-display font-bold text-xl mb-1" style={{ color: '#F0F4F8' }}>{active.label}</h2>
              <p className="text-xs mb-3" style={{ color: 'rgba(240,244,248,0.3)' }}>{active.subtitle}</p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,248,0.6)' }}>{active.description}</p>
            </div>

            <p className="az-label mb-3" style={{ color }}>Who to Contact</p>
            <div className="space-y-3">
              {active.contacts.map((c, i) => (
                <div key={i} className="glass-card p-4 flex items-start gap-4">
                  <div className="rounded-lg flex items-center justify-center flex-shrink-0 font-display font-bold text-sm"
                    style={{ width: 40, height: 40, background: `rgba(${hexToRgb(color)},0.1)`, color, border: `1px solid rgba(${hexToRgb(color)},0.2)` }}>
                    {c.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm" style={{ color: '#F0F4F8' }}>{c.name}</div>
                    <div className="text-xs mb-1" style={{ color: 'rgba(240,244,248,0.3)' }}>{c.title}</div>
                    <div className="text-xs leading-snug mb-3" style={{ color: 'rgba(240,244,248,0.5)' }}>{c.reason}</div>
                    {c.email_href && (
                      <a href={c.email_href}
                        className="inline-flex items-center gap-1.5 text-xs font-ui font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                        style={{ background: `rgba(${hexToRgb(color)},0.1)`, color, border: `1px solid rgba(${hexToRgb(color)},0.2)` }}>
                        <Mail size={11} /> Email {c.name.split(' ')[0]}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
