import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  id?: string;
  alert?: ReactNode;
}

export function SectionCard({ title, subtitle, children, id, alert }: Props) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="section-card mb-8"
    >
      <div className="card-header-bar" />
      <div className="px-6 py-5 border-b border-sand-200">
        <h2 className="font-display font-bold text-navy text-2xl leading-tight">{title}</h2>
        {subtitle && <p className="text-navy/55 text-sm mt-1">{subtitle}</p>}
      </div>
      {alert && (
        <div className="px-6 pt-4">
          {alert}
        </div>
      )}
      <div className="p-6">{children}</div>
    </motion.section>
  );
}
