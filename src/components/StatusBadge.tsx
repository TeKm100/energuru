import React from 'react';
import { CheckCircle2, Clock, Cpu, Sparkles, AlertCircle } from 'lucide-react';

export type FeatureStatus = 
  | 'available' 
  | 'in-development' 
  | 'coming-soon' 
  | 'hardware-required' 
  | 'planned';

interface StatusBadgeProps {
  status: FeatureStatus;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  className = '',
}) => {
  const configs = {
    'available': {
      defaultLabel: 'Available',
      icon: CheckCircle2,
      styles: 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50',
    },
    'in-development': {
      defaultLabel: 'In Development',
      icon: Clock,
      styles: 'bg-cyan-950/60 text-[#B9E5FF] border-cyan-700/50',
    },
    'coming-soon': {
      defaultLabel: 'Coming Soon',
      icon: Sparkles,
      styles: 'bg-amber-950/60 text-amber-300 border-amber-700/50',
    },
    'hardware-required': {
      defaultLabel: 'Requires Compatible Hardware',
      icon: Cpu,
      styles: 'bg-purple-950/60 text-purple-300 border-purple-700/50',
    },
    'planned': {
      defaultLabel: 'Planned Stage',
      icon: AlertCircle,
      styles: 'bg-slate-800/80 text-slate-300 border-slate-700',
    },
  };

  const config = configs[status] || configs.planned;
  const Icon = config.icon;
  const text = label || config.defaultLabel;

  const sizeClasses = size === 'sm' 
    ? 'text-[10px] px-2 py-0.5 gap-1' 
    : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium font-mono rounded-md border ${config.styles} ${sizeClasses} ${className}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3 shrink-0' : 'w-3.5 h-3.5 shrink-0'} />
      <span>{text}</span>
    </span>
  );
};
