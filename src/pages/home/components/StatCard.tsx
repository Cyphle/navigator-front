import type { ReactNode } from 'react';

export interface StatCardData {
  title: string;
  value: number;
  subtitle: string;
  icon: ReactNode;
  iconColor: string;
  iconBg: string;
}

export const StatCard = ({ title, value, subtitle, icon, iconColor, iconBg }: StatCardData) => (
  <div
    className="bg-white rounded-[var(--radius-lg)] p-5 relative overflow-hidden"
    style={{ boxShadow: 'var(--shadow-soft)' }}
  >
    <div
      className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center mb-4"
      style={{ background: iconBg, color: iconColor }}
    >
      {icon}
    </div>
    <p className="font-display text-3xl font-bold m-0 leading-none" style={{ color: 'var(--stone)' }}>
      {value}
    </p>
    <p className="text-xs mt-1 m-0" style={{ color: 'var(--mist)' }}>
      {subtitle}
    </p>
    <p className="text-[10px] font-semibold uppercase tracking-wider mt-3 m-0" style={{ color: 'var(--mist)' }}>
      {title}
    </p>
    <div
      className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-[0.08]"
      style={{ background: iconColor }}
      aria-hidden="true"
    />
  </div>
);
