import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign } from 'lucide-react';
import { mesaBudget } from '../data/budget';

export function BudgetView() {
  const data = mesaBudget.segments.map(s => ({ name: s.label, value: s.percent, description: s.description }));

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <DollarSign size={16} className="text-success" />
          <span className="label-xs" style={{ color: '#2fd770' }}>Budget & Transparency</span>
        </div>
        <h1 className="font-display font-bold text-text1 text-3xl mb-1">Mesa City Budget</h1>
        <p className="text-text2 text-sm">FY {mesaBudget.fiscalYear} · {mesaBudget.total} Total — where your tax dollars go</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 items-start mb-7">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={96} paddingAngle={2} dataKey="value">
                {mesaBudget.segments.map((seg, i) => <Cell key={i} fill={seg.color} />)}
              </Pie>
              <Tooltip
                formatter={(val) => [`${val}%`]}
                contentStyle={{ background: '#131928', border: '1px solid #1f2d45', borderRadius: '6px', fontSize: '12px', color: '#e4eaf6' }}
                labelStyle={{ color: '#8896b0' }}
              />
              <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#8896b0' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2.5">
          {mesaBudget.segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-medium text-text1">{seg.label}</span>
                  <span className="text-sm font-bold text-copper flex-shrink-0">{seg.percent}%</span>
                </div>
                <div className="w-full rounded-full overflow-hidden" style={{ height: '4px', background: '#1f2d45' }}>
                  <div className="h-full rounded-full" style={{ width: `${seg.percent}%`, background: seg.color }} />
                </div>
                {seg.description && <p className="text-2xs text-text3 mt-0.5">{seg.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <a href="https://www.mesaaz.gov/business/budget" target="_blank" rel="noreferrer" className="btn btn-outline text-xs">Full Budget Document</a>
        <a href="https://www.mesaaz.gov/Government/City-Council-Meetings" target="_blank" rel="noreferrer" className="btn btn-outline text-xs">Budget Hearings</a>
      </div>
    </div>
  );
}
