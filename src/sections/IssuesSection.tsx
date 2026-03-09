import { useState } from 'react';
import { SectionCard } from '../components/SectionCard';
import { issues } from '../data/issues';
import { Home, BookOpen, Car, Shield, Trees, Heart, Briefcase, Globe, Mail, ChevronRight } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Home, BookOpen, Car, Shield, Trees, Heart, Briefcase, Globe,
};

export function IssuesSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = issues.find(i => i.id === selected);

  return (
    <div id="issues">
      <SectionCard
        title="Contact by Issue"
        subtitle="Find the right representative for your concern"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {issues.map(issue => {
            const Icon = iconMap[issue.icon] || Home;
            const isActive = selected === issue.id;
            return (
              <button
                key={issue.id}
                onClick={() => setSelected(isActive ? null : issue.id)}
                className={`rounded-lg p-4 text-left border transition-all ${
                  isActive
                    ? 'bg-copper text-white border-copper shadow-md'
                    : 'bg-sand-100 border-sand-200 text-navy hover:border-copper/50 hover:bg-copper/5'
                }`}
              >
                <Icon size={22} className={isActive ? 'text-white mb-2' : 'text-copper mb-2'} />
                <p className="font-semibold text-sm leading-tight">{issue.label}</p>
                <p className={`text-xs mt-0.5 leading-tight ${isActive ? 'text-white/70' : 'text-navy/50'}`}>
                  {issue.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {active && (
          <div className="bg-sand-100 rounded-xl p-5 border border-sand-200">
            <h3 className="font-display font-bold text-navy text-lg mb-1">{active.label}</h3>
            <p className="text-sm text-navy/70 mb-4">{active.description}</p>
            <p className="section-label mb-3">Who to Contact</p>
            <div className="space-y-3">
              {active.contacts.map((c, i) => (
                <div key={i} className="flex items-start justify-between gap-4 bg-white rounded-lg p-3 border border-sand-200">
                  <div className="min-w-0">
                    <p className="font-semibold text-navy text-sm">{c.name}</p>
                    <p className="text-xs text-navy/50">{c.title}</p>
                    <p className="text-xs text-copper mt-1 flex items-center gap-1">
                      <ChevronRight size={11} />
                      {c.reason}
                    </p>
                  </div>
                  <a href={c.emailHref} className="contact-btn email text-xs shrink-0" onClick={e => e.stopPropagation()}>
                    <Mail size={12} />
                    Email
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
