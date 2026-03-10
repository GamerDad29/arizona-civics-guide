import { useState } from 'react';
import { Mail, MessageSquare } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { fetchIssues } from '../lib/api';
import type { Issue } from '../lib/api';

const ISSUE_COLORS: Record<string, string> = {
  housing: '#C4623A', education: '#2E5EA8', transportation: '#7B6B9E',
  safety: '#B83A3A', environment: '#5A8A90', healthcare: '#5C7A5E',
  economy: '#C4623A', immigration: '#7B6B9E',
};

export function IssuesPage() {
  const { data: issues, loading } = useApi(() => fetchIssues(), []);
  const [selected, setSelected] = useState<Issue | null>(null);

  const active = selected ?? issues?.[0] ?? null;
  const color = active ? (ISSUE_COLORS[active.id] ?? '#C4623A') : '#C4623A';

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-10"><p className="text-ink/40">Loading...</p></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare size={16} className="text-sky-dark" />
          <p className="wpa-label" style={{ color: '#5A8A90' }}>Contact by Issue</p>
        </div>
        <h1 className="font-display font-bold text-ink text-3xl mb-2">Take Action</h1>
        <p className="text-ink/60 text-sm">Select an issue to see exactly who represents you on it — and how to reach them.</p>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <div className="space-y-1">
          {issues?.map(issue => {
            const ic = ISSUE_COLORS[issue.id] ?? '#C4623A';
            const isActive = issue.id === active?.id;
            return (
              <button key={issue.id} onClick={() => setSelected(issue)}
                className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
                style={{
                  background: isActive ? ic + '12' : 'transparent',
                  border: `1px solid ${isActive ? ic + '30' : 'transparent'}`,
                }}>
                <div className="min-w-0">
                  <div className="text-sm font-semibold leading-tight" style={{ color: isActive ? ic : '#1C1A18' }}>
                    {issue.label}
                  </div>
                  <div className="text-2xs text-ink/40 truncate">{issue.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>

        {active && (
          <div>
            <div className="wpa-card p-5 mb-4" style={{ borderColor: color + '30' }}>
              <h2 className="font-display font-bold text-ink text-xl mb-1">{active.label}</h2>
              <p className="text-xs text-ink/40 mb-3">{active.subtitle}</p>
              <p className="text-sm text-ink/70 leading-relaxed">{active.description}</p>
            </div>

            <p className="wpa-label mb-3" style={{ color }}>Who to Contact</p>
            <div className="space-y-3">
              {active.contacts.map((c, i) => (
                <div key={i} className="wpa-card p-4 flex items-start gap-4">
                  <div className="rounded-lg flex items-center justify-center flex-shrink-0 font-display font-bold text-sm"
                    style={{ width: 40, height: 40, background: color + '12', color, border: `1px solid ${color}25` }}>
                    {c.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-ink text-sm">{c.name}</div>
                    <div className="text-xs text-ink/40 mb-1">{c.title}</div>
                    <div className="text-xs text-ink/60 leading-snug mb-3">{c.reason}</div>
                    {c.email_href && (
                      <a href={c.email_href}
                        className="inline-flex items-center gap-1.5 text-xs font-ui font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                        style={{ background: color + '12', color, border: `1px solid ${color}25` }}>
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
    </div>
  );
}
