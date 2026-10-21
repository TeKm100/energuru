import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { 
  ShieldAlert, 
  CheckSquare, 
  Square, 
  ArrowLeft, 
  BatteryCharging, 
  Droplet, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw,
  ZapOff,
  Flame
} from 'lucide-react';

interface OutagePrepPageProps {
  onNavigate: (page: Page) => void;
}

interface ChecklistItem {
  id: string;
  category: 'Immediate (Pre-Outage)' | 'Active Outage' | 'Grid Restoration';
  text: string;
  detail: string;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    id: 'prep-water',
    category: 'Immediate (Pre-Outage)',
    text: 'Pump overhead water tank while power is active',
    detail: 'Municipal or borehole pumps require substantial surge power; run pumps during available grid hours.',
  },
  {
    id: 'prep-devices',
    category: 'Immediate (Pre-Outage)',
    text: 'Recharge secondary power banks and work laptops to 100%',
    detail: 'Avoid drawing from your inverter or generator just to power 5V USB accessories.',
  },
  {
    id: 'prep-fuel',
    category: 'Immediate (Pre-Outage)',
    text: 'Verify safe storage of filtered fuel (minimum 10–20 Litres)',
    detail: 'Store fuel in approved metal or HDPE safety jerrycans away from direct sunlight or living quarters.',
  },
  {
    id: 'active-load',
    category: 'Active Outage',
    text: 'Switch off all heavy motor/compressor loads prior to starting backup',
    detail: 'Prevents stalling the generator alternator or triggering immediate inverter overload trips.',
  },
  {
    id: 'active-fridge',
    category: 'Active Outage',
    text: 'Enforce refrigerator and deep freezer door seal discipline',
    detail: 'A closed modern domestic freezer maintains food preservation temperatures for 24–48 hours without power.',
  },
  {
    id: 'active-fumes',
    category: 'Active Outage',
    text: 'Position generator outdoors at least 6 metres (20 ft) away from windows',
    detail: 'Carbon monoxide (CO) is odorless and lethal. Never run a generator in a corridor, garage, or veranda.',
  },
  {
    id: 'post-surge',
    category: 'Grid Restoration',
    text: 'Wait 3–5 minutes after grid returns before transferring changeover switch',
    detail: 'Post-blackout grid restoration is frequently accompanied by severe voltage spikes (up to 300V) or brownouts.',
  },
  {
    id: 'post-compressor',
    category: 'Grid Restoration',
    text: 'Allow air conditioners and refrigerators 3 minutes delay before restart',
    detail: 'Refrigerant pressure must equalize across expansion valves to avoid burning out starter windings.',
  },
];

export const OutagePrepPage: React.FC<OutagePrepPageProps> = ({ onNavigate }) => {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('energuru_outage_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleItem = (id: string) => {
    const updated = { ...completedItems, [id]: !completedItems[id] };
    setCompletedItems(updated);
    try {
      localStorage.setItem('energuru_outage_checklist', JSON.stringify(updated));
    } catch {
      // ignore localstorage failure
    }
  };

  const handleResetChecklist = () => {
    setCompletedItems({});
    try {
      localStorage.removeItem('energuru_outage_checklist');
    } catch {
      // ignore
    }
  };

  const totalItems = DEFAULT_CHECKLIST.length;
  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const percentage = Math.round((completedCount / totalItems) * 100);

  const categories = ['Immediate (Pre-Outage)', 'Active Outage', 'Grid Restoration'] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#16365B] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Outage Preparedness & Runbooks
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 pl-8">
            Systematic emergency checklists, critical load shedding rules, and grid restoration safety procedures.
          </p>
        </div>

        <div className="flex items-center gap-2 pl-8 md:pl-0">
          <StatusBadge status="available" label="Checklists Operational" />
          <StatusBadge status="in-development" label="SMS Broadcasts In Dev" />
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
            <span className="font-semibold text-white">Your Preparedness Readiness Score:</span>
            <span className="font-mono font-bold text-[#B9E5FF] text-sm">{completedCount} of {totalItems} completed ({percentage}%)</span>
          </div>

          <div className="w-full bg-[#071629] rounded-full h-2.5 overflow-hidden border border-[#16365B]">
            <div 
              className="bg-gradient-to-r from-[#B9E5FF] to-cyan-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400">
            {percentage === 100 
              ? 'Excellent! You have reviewed and verified all standard outage preparedness protocols.' 
              : 'Complete all checklist items to ensure your home or business can handle unexpected disruptions safely.'}
          </p>
        </div>

        <button
          onClick={handleResetChecklist}
          className="px-3.5 py-2 rounded-lg border border-[#16365B] hover:bg-[#16365B] text-slate-400 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Checklists</span>
        </button>
      </div>

      {/* Checklist Sections */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const catItems = DEFAULT_CHECKLIST.filter((i) => i.category === cat);
          return (
            <div key={cat} className="bg-[#0B1B33] border border-[#16365B] rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-[#16365B] pb-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  {cat === 'Immediate (Pre-Outage)' && <BatteryCharging className="w-5 h-5 text-[#B9E5FF]" />}
                  {cat === 'Active Outage' && <ZapOff className="w-5 h-5 text-amber-400" />}
                  {cat === 'Grid Restoration' && <ShieldAlert className="w-5 h-5 text-emerald-400" />}
                  <span>{cat}</span>
                </h2>
                <span className="text-[11px] text-slate-400 font-mono">
                  {catItems.filter((i) => completedItems[i.id]).length} / {catItems.length} checked
                </span>
              </div>

              <div className="space-y-3">
                {catItems.map((item) => {
                  const isDone = !!completedItems[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isDone 
                          ? 'bg-[#071629]/90 border-emerald-800/40 opacity-90' 
                          : 'bg-[#071629] border-[#16365B] hover:border-[#B9E5FF]/40'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-slate-400 hover:text-white transition-colors"
                        aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {isDone ? (
                          <CheckSquare className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-500" />
                        )}
                      </button>

                      <div className="space-y-1 select-none flex-1">
                        <span className={`text-sm font-semibold block transition-colors ${
                          isDone ? 'line-through text-slate-400' : 'text-white'
                        }`}>
                          {item.text}
                        </span>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Notice Callout */}
      <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-800/40 flex items-start gap-3 text-xs text-rose-200">
        <Flame className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-white font-semibold block">Life Safety & Carbon Monoxide Warning</strong>
          <p className="leading-relaxed text-slate-300">
            Portable internal combustion engines produce deadly colorless, odorless carbon monoxide gas. 
            Never operate generators indoors, under stairwells, or near intake vents even with fans running. 
            Always install battery-powered CO alarms near bedroom corridors.
          </p>
        </div>
      </div>
    </div>
  );
};
