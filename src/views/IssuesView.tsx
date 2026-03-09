import { useState } from 'react';
import { Mail, Home, BookOpen, Car, Shield, Trees, Heart, Briefcase, Globe, MessageSquare } from 'lucide-react';
import { issues } from '../data/issues';
import type { Issue } from '../data/issues';

type LucideIcon = React.ComponentType<{ size?: number; className?: string }>;
const ICON_MAP: Record<string, LucideIcon> = {
  Home, BookOpen, Car, Shield, Trees, Heart, Briefcase, Globe,
};

const ISSUE_COLORS: Record<string, string> = {
  housing:     '#f0a030',
  education:   '#4f7ef5',
  transportation: '#9b6fe8',
  safety:      '#f05353',
  environment: '#1cb0be',
  healthcare:  '#2fd770',
  economy:     '#e8a055',
  immigration: '#9b6fe8',
};

export function IssuesView() {
  const [selected, setSelected] = useState<Issue>(issues[0]);
  const color = ISSUE_COLORS[selected.id] ?? '#c97b30';
  const IconComp = ICON_MAP[selected.icon] ?? MessageSquare;

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare size={16} className="text-turq" />
          <span className="label-xs" style={{ color: '#1cb0be' }}>Contact by Issue</span>
        </div>
        <h1 className="font-display font-bold text-text1 text-3xl mb-1">Take Action</h1>
        <p className="text-text2 text-sm">Select an issue to see exactly who represents you on it — and how to reach them.</p>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-5">
        {/* Issue selector */}
        <div className="space-y-1">
          {issues.map(issue => {
            const ic = ISSUE_COLORS[issue.id] ?? '#c97b30';
            const Ic = ICON_MAP[issue.icon] ?? MessageSquare;
            const active = issue.id === selected.id;
            return (
              <button
                key={issue.id}
                onClick={() => setSelected(issue)}
                className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
                style={{
                  background: active ? `${ic}15` : 'transparent',
                  border: `1px solid ${active ? ic + '40' : 'transparent'}`,
                  color: active ? ic : '#8896b0',
                }}
              >
                <Ic size={14} />
                <div className="min-w-0">
                  <div className="text-sm font-semibold leading-tight" style={{ color: active ? ic : '#e4eaf6' }}>{issue.label}</div>
                  <div className="text-2xs text-text3 truncate">{issue.subtitle}</div>
                </div>
                {active && <div className="ml-auto w-1 h-1 rounded-full flex-shrink-0" style={{ background: ic }} />}
              </button>
            );
          })}
        </div>

        {/* Issue detail */}
        <div key={selected.id}>
          <div className="rounded-xl p-5 mb-4" style={{ background: '#0f1520', border: `1px solid ${color}30` }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ width: 40, height: 40, background: `${color}15`, border: `1px solid ${color}30`, color }}>
                <IconComp size={18} />
              </div>
              <div>
                <h2 className="font-display font-bold text-text1 text-xl leading-tight">{selected.label}</h2>
                <p className="text-xs text-text3">{selected.subtitle}</p>
              </div>
            </div>
            <p className="text-sm text-text2 leading-relaxed">{selected.description}</p>
          </div>

          <p className="label-copper mb-3">Who to Contact</p>
          <div className="space-y-3">
            {selected.contacts.map((c, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg"
                style={{ background: '#131928', border: '1px solid #1f2d45' }}>
                <div className="rounded-lg flex items-center justify-center flex-shrink-0 font-display font-bold text-sm"
                  style={{ width: 40, height: 40, background: `${color}12`, color, border: `1px solid ${color}25` }}>
                  {c.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-text1 text-sm">{c.name}</div>
                  <div className="text-xs text-text3 mb-1">{c.title}</div>
                  <div className="text-xs text-text2 leading-snug mb-3">{c.reason}</div>
                  <a href={c.emailHref}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-90"
                    style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                    <Mail size={11} /> Email {c.name.split(' ')[0]}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg text-xs text-text3" style={{ background: '#0f1520', border: '1px solid #1a2236' }}>
            <strong className="text-text2">Tip:</strong> Be specific in your message. Mention your address (city + district), the exact bill or policy you care about, and what you want them to do.
          </div>
        </div>
      </div>
    </div>
  );
}
