import { Rocket, Satellite, Brain, BarChart3 } from 'lucide-react';
import type { Section } from '../types';

const iconMap = {
  rocket: Rocket,
  satellite: Satellite,
  brain: Brain,
  chart: BarChart3,
};

interface SectionHeaderProps {
  section: Section;
  count: number;
}

export function SectionHeader({ section, count }: SectionHeaderProps) {
  const Icon = iconMap[section.icon as keyof typeof iconMap] ?? Rocket;

  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="p-2.5 rounded-xl"
        style={{ backgroundColor: `${section.color}15` }}
      >
        <Icon className="h-5 w-5" style={{ color: section.color }} />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-100">{section.name}</h2>
        <p className="text-xs text-slate-500">
          {section.description} · {count} milestone
        </p>
      </div>
    </div>
  );
}