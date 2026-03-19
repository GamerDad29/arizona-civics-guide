import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { fetchBudget } from '../lib/api';

export function BudgetPage() {
  const { data: budget, loading } = useApi(() => fetchBudget(), []);

  if (loading || !budget) return <div className="max-w-3xl mx-auto px-4 py-10"><p style={{ color: 'rgba(240,244,248,0.3)' }}>Loading...</p></div>;

  const chartData = budget.segments.map(s => ({ name: s.label, value: s.percent, description: s.description }));

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={16} style={{ color: '#2D5A3D' }} />
          <p className="az-label" style={{ color: '#2D5A3D' }}>Budget & Transparency</p>
        </div>
        <h1 className="font-display font-bold text-3xl mb-2" style={{ color: '#F0F4F8' }}>Mesa City Budget</h1>
        <p className="text-sm" style={{ color: 'rgba(240,244,248,0.5)' }}>FY {budget.fiscalYear} · {budget.total} Total · Where your tax dollars go</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 items-start mb-8">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={96} paddingAngle={2} dataKey="value">
                {budget.segments.map((seg, i) => <Cell key={i} fill={seg.color} />)}
              </Pie>
              <Tooltip
                formatter={(val) => [`${val}%`]}
                contentStyle={{ background: 'rgba(26,35,50,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: '#F0F4F8' }}
              />
              <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', color: 'rgba(240,244,248,0.6)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {budget.segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-semibold" style={{ color: '#F0F4F8' }}>{seg.label}</span>
                  <span className="text-sm font-bold flex-shrink-0" style={{ color: '#B87333' }}>{seg.percent}%</span>
                </div>
                <div className="w-full rounded-full overflow-hidden" style={{ height: '4px', background: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-full rounded-full" style={{ width: `${seg.percent}%`, background: seg.color }} />
                </div>
                {seg.description && <p className="text-2xs mt-0.5" style={{ color: 'rgba(240,244,248,0.3)' }}>{seg.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <a href="https://www.mesaaz.gov/business/budget" target="_blank" rel="noreferrer" className="btn btn-outline text-xs">Full Budget</a>
        <a href="https://www.mesaaz.gov/Government/City-Council-Meetings" target="_blank" rel="noreferrer" className="btn btn-outline text-xs">Budget Hearings</a>
      </div>
    </motion.div>
  );
}
