import React, { useState } from 'react';
import { Page, AuthPage } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { 
  Zap, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Clock, 
  Search, 
  ArrowLeft, 
  ShieldCheck, 
  UserCheck, 
  ChevronRight 
} from 'lucide-react';

interface EquipmentPageProps {
  onNavigate: (page: Page) => void;
}

interface EquipmentItem {
  id: string;
  name: string;
  type: string;
  capacity: string;
  status: 'Operational' | 'Requires Service' | 'Standby';
  lastService: string;
}

export const EquipmentPage: React.FC<EquipmentPageProps> = ({ onNavigate }) => {
  const [activeTrouble, setActiveTrouble] = useState<string | null>(null);

  // Initial manual equipment inventory state
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([
    {
      id: 'eq-1',
      name: 'Primary Household Generator',
      type: 'Petrol Generator',
      capacity: '3.5 kVA (2.8 kW)',
      status: 'Operational',
      lastService: '14 days ago',
    },
    {
      id: 'eq-2',
      name: 'Solar Hybrid Inverter',
      type: 'Pure Sine Wave Inverter',
      capacity: '2.5 kVA / 24V',
      status: 'Standby',
      lastService: '45 days ago',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newEquip, setNewEquip] = useState({
    name: '',
    type: 'Petrol Generator',
    capacity: '',
    status: 'Operational' as const,
  });

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEquip.name.trim()) return;

    const item: EquipmentItem = {
      id: `eq-${Date.now()}`,
      name: newEquip.name.trim(),
      type: newEquip.type,
      capacity: newEquip.capacity.trim() || 'Unspecified capacity',
      status: newEquip.status,
      lastService: 'Just registered',
    };

    setEquipmentList([...equipmentList, item]);
    setNewEquip({ name: '', type: 'Petrol Generator', capacity: '', status: 'Operational' });
    setShowAddForm(false);
  };

  const troubleScenarios = [
    {
      id: 'gen-wont-start',
      title: 'Generator will not crank or start',
      gear: 'Generators',
      safeSteps: [
        'Turn off the main changeover switch before attempting restarts to avoid back-feeding load.',
        'Check fuel tap level and verify oil level via dipstick (low oil sensor prevents ignition).',
        'Inspect spark plug cap for loose connection or carbon fouling.',
        'If fuel has stayed in the carburetor float bowl over 3 weeks without stabilizer, drain stale fuel safely into an approved container away from heat.',
      ],
      warning: 'Never refuel while the engine or exhaust manifold is hot. Wait at least 15 minutes to cool.',
    },
    {
      id: 'inv-overload',
      title: 'Inverter beeping with continuous overload alarm',
      gear: 'Inverters & UPS',
      safeSteps: [
        'Immediately disconnect high-draw inductive appliances (refrigerators, deep freezers, electric irons, pumping machines).',
        'Check if AC mains voltage is fluctuating violently before the inverter switches to battery mode.',
        'Turn off the inverter reset switch, wait 30 seconds, and restart with zero active load.',
        'Reconnect essential low-draw circuits (lighting, Wi-Fi, fans) one at a time to isolate the surge.',
      ],
      warning: 'Continuous overloads damage MOSFET switches and shorten battery bank capacity permanently.',
    },
    {
      id: 'batt-drain',
      title: 'Battery bank backup duration dropped drastically',
      gear: 'Tubular / Lithium Batteries',
      safeSteps: [
        'Verify battery terminal posts for white sulfate corrosion or loose lug connections.',
        'For tubular/flooded batteries: inspect electrolyte level and top up with distilled de-ionized water only (never raw tap water or battery acid).',
        'Confirm bulk charge voltage setting on the inverter matches manufacturer specs (typically 28.8V for 24V tubular, or 28.4V for LiFePO4).',
        'Record runtime hours after a full 100% absorption charge to diagnose if individual cells have degraded.',
      ],
      warning: 'Deeply discharging lead/tubular batteries below 10.8V per 12V unit creates irrecoverable plate damage.',
    },
  ];

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
              Equipment & Maintenance
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 pl-8">
            Safe next steps when equipment develops faults, equipment registry records, and certified servicing logs.
          </p>
        </div>

        <div className="flex items-center gap-2 pl-8 md:pl-0">
          <StatusBadge status="available" label="Manual Registry Active" />
          <StatusBadge status="in-development" label="Technician Network Planned" />
        </div>
      </div>

      {/* Section 1: Equipment Registry */}
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#16365B] pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#B9E5FF]" />
              <span>Registered Energy Equipment</span>
            </h2>
            <p className="text-xs text-slate-400">
              Maintain an accurate inventory of your backup and generation hardware.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-lg bg-[#B9E5FF] hover:bg-white text-[#071629] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Add Equipment</span>
          </button>
        </div>

        {/* Add Equipment Form Drawer */}
        {showAddForm && (
          <form onSubmit={handleAddEquipment} className="p-4 bg-[#071629] border border-[#16365B] rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white">Record New Equipment Item</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Equipment Name / Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shop Backup Generator"
                  value={newEquip.name}
                  onChange={(e) => setNewEquip({ ...newEquip, name: e.target.value })}
                  className="w-full bg-[#0B1B33] border border-[#16365B] rounded px-3 py-2 text-white focus:outline-none focus:border-[#B9E5FF]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Equipment Category</label>
                <select
                  value={newEquip.type}
                  onChange={(e) => setNewEquip({ ...newEquip, type: e.target.value })}
                  className="w-full bg-[#0B1B33] border border-[#16365B] rounded px-3 py-2 text-white focus:outline-none focus:border-[#B9E5FF]"
                >
                  <option value="Petrol Generator">Petrol Generator</option>
                  <option value="Diesel Generator">Diesel Generator</option>
                  <option value="Pure Sine Wave Inverter">Pure Sine Wave Inverter</option>
                  <option value="Solar PV Array">Solar PV Array</option>
                  <option value="Tubular Battery Bank">Tubular Battery Bank</option>
                  <option value="Lithium (LiFePO4) Battery">Lithium (LiFePO4) Battery</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Capacity / Rating</label>
                <input
                  type="text"
                  placeholder="e.g. 5.5 kVA, 200Ah, 3.2 kW"
                  value={newEquip.capacity}
                  onChange={(e) => setNewEquip({ ...newEquip, capacity: e.target.value })}
                  className="w-full bg-[#0B1B33] border border-[#16365B] rounded px-3 py-2 text-white focus:outline-none focus:border-[#B9E5FF]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded border border-[#16365B] text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-[#B9E5FF] text-[#071629] font-bold text-xs hover:bg-white"
              >
                Save to Registry
              </button>
            </div>
          </form>
        )}

        {/* Equipment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {equipmentList.map((item) => (
            <div 
              key={item.id} 
              className="p-5 bg-[#071629] border border-[#16365B] rounded-xl flex items-start justify-between gap-4 hover:border-[#16365B]/80 transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{item.name}</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{item.type} · <strong className="text-white">{item.capacity}</strong></p>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Last Service Check: {item.lastService}</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-[#16365B]/50 text-[#B9E5FF]">
                <Wrench className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Safe Next Steps Diagnostics */}
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#16365B] pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Fault Diagnostics & Safe Next Steps</h2>
            <StatusBadge status="available" size="sm" label="Advisory Guide" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standard electrical safety protocols before attempting DIY handling or contacting technicians.
          </p>
        </div>

        <div className="space-y-3">
          {troubleScenarios.map((scen) => {
            const isExpanded = activeTrouble === scen.id;
            return (
              <div 
                key={scen.id}
                className="bg-[#071629] border border-[#16365B] rounded-xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveTrouble(isExpanded ? null : scen.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[#16365B]/30 transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-mono text-[#B9E5FF] uppercase tracking-wider block">
                      {scen.gear}
                    </span>
                    <h3 className="font-semibold text-white text-sm">{scen.title}</h3>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-[#16365B]/60 space-y-4 text-xs">
                    <div className="space-y-2 pt-2">
                      <span className="font-semibold text-white block">Recommended Safety & Diagnostic Steps:</span>
                      <ol className="list-decimal pl-4 space-y-1.5 text-slate-300 leading-relaxed">
                        {scen.safeSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/50 flex items-start gap-2.5 text-amber-200 text-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-semibold">Critical Hazard Caution:</strong>
                        <span>{scen.warning}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Certified Technician Referral Status */}
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Technician Referral Network</h3>
            <StatusBadge status="in-development" size="sm" label="Stage 4 Feature" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            We are working to establish vetted partnerships with certified electricians, solar installers, and generator mechanics. 
            Technician dispatch is currently undergoing regional compliance vetting and is not yet operational.
          </p>
        </div>

        <button
          onClick={() => onNavigate('contact')}
          className="px-4 py-2 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-xs font-semibold text-white transition-colors shrink-0"
        >
          Inquire About Partnerships
        </button>
      </div>
    </div>
  );
};
