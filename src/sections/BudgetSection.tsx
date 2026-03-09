import { SectionCard } from '../components/SectionCard';
import { mesaBudget } from '../data/budget';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function BudgetSection() {
  const data = mesaBudget.segments.map(s => ({ name: s.label, value: s.percent, description: s.description }));

  return (
    <div id="budget">
      <SectionCard
        title="Mesa City Budget"
        subtitle={`FY ${mesaBudget.fiscalYear} — ${mesaBudget.total} Total`}
      >
        <div className="grid gap-6 lg:grid-cols-2 items-start">
          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {mesaBudget.segments.map((seg, i) => (
                    <Cell key={i} fill={seg.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val}%`]}
                  contentStyle={{ background: '#faf7f2', border: '1px solid #e8d4b0', borderRadius: '6px', fontSize: '12px' }}
                />
                <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown table */}
          <div className="space-y-2">
            {mesaBudget.segments.map((seg, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: seg.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-navy">{seg.label}</span>
                    <span className="text-sm font-bold text-copper shrink-0">{seg.percent}%</span>
                  </div>
                  <div className="w-full bg-sand-200 rounded-full h-1.5 mt-1">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${seg.percent}%`, background: seg.color }}
                    />
                  </div>
                  {seg.description && (
                    <p className="text-xs text-navy/50 mt-0.5">{seg.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="copper-divider" />
        <div className="flex flex-wrap gap-2 mt-4">
          <a href="https://www.mesaaz.gov/business/budget" target="_blank" rel="noreferrer"
            className="contact-btn outline text-xs">Full Budget Document</a>
          <a href="https://www.mesaaz.gov/Government/City-Council-Meetings" target="_blank" rel="noreferrer"
            className="contact-btn outline text-xs">Budget Hearings</a>
        </div>
      </SectionCard>
    </div>
  );
}
