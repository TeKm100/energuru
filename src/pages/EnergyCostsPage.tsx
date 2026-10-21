import React, { useState, useMemo } from 'react';
import { Page } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { 
  LineChart, 
  DollarSign, 
  Fuel, 
  Zap, 
  ArrowLeft, 
  Calculator, 
  Plus, 
  Clock, 
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';

interface EnergyCostsPageProps {
  onNavigate: (page: Page) => void;
}

interface ExpenseEntry {
  id: string;
  date: string;
  type: 'Generator Fuel' | 'Grid Utility Token' | 'Solar Maintenance';
  amount: number;
  quantity?: string;
  notes: string;
}

export const EnergyCostsPage: React.FC<EnergyCostsPageProps> = ({ onNavigate }) => {
  // Calculator inputs
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState<number>(1050); // e.g. ₦1,050/L
  const [litersPerHour, setLitersPerHour] = useState<number>(1.2); // 1.2 L/h
  const [generatorLoadKw, setGeneratorLoadKw] = useState<number>(2.0); // 2.0 kW load
  const [gridTariffPerKwh, setGridTariffPerKwh] = useState<number>(225); // e.g. Band A ₦225/kWh

  // Expense logs
  const [expenseList, setExpenseList] = useState<ExpenseEntry[]>([
    {
      id: 'exp-1',
      date: '2026-10-18',
      type: 'Generator Fuel',
      amount: 15750,
      quantity: '15 Litres',
      notes: 'Weekend power outage supply',
    },
    {
      id: 'exp-2',
      date: '2026-10-12',
      type: 'Grid Utility Token',
      amount: 25000,
      quantity: '111.1 kWh',
      notes: 'Monthly postpaid/prepaid meter top-up',
    },
  ]);

  const [showLogForm, setShowLogForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    type: 'Generator Fuel' as const,
    amount: '',
    quantity: '',
    notes: '',
  });

  // Calculate real cost metrics
  const costCalculation = useMemo(() => {
    // Hourly generator cost = fuelPrice * litersPerHour
    const generatorHourlyCost = fuelPricePerLiter * litersPerHour;
    // Generator cost per kWh = generatorHourlyCost / generatorLoadKw
    const generatorCostPerKwh = generatorLoadKw > 0 ? generatorHourlyCost / generatorLoadKw : 0;
    
    // Difference per kWh
    const differencePerKwh = generatorCostPerKwh - gridTariffPerKwh;
    const ratio = gridTariffPerKwh > 0 ? (generatorCostPerKwh / gridTariffPerKwh).toFixed(1) : '—';

    return {
      generatorHourlyCost,
      generatorCostPerKwh,
      differencePerKwh,
      ratio,
    };
  }, [fuelPricePerLiter, litersPerHour, generatorLoadKw, gridTariffPerKwh]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(newExpense.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const entry: ExpenseEntry = {
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: newExpense.type,
      amount: parsedAmount,
      quantity: newExpense.quantity.trim() || undefined,
      notes: newExpense.notes.trim() || 'Direct manual entry',
    };

    setExpenseList([entry, ...expenseList]);
    setNewExpense({ type: 'Generator Fuel', amount: '', quantity: '', notes: '' });
    setShowLogForm(false);
  };

  const totalSpent = useMemo(() => {
    return expenseList.reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenseList]);

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
              Energy & Costs
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 pl-8">
            Track fuel expenses, compare self-generation vs. utility grid tariffs, and evaluate energy investments.
          </p>
        </div>

        <div className="flex items-center gap-2 pl-8 md:pl-0">
          <StatusBadge status="available" label="Calculator Active" />
          <StatusBadge status="in-development" label="Smart Telemetry In Dev" />
        </div>
      </div>

      {/* Section 1: Interactive Generator vs. Grid Tariff Comparison Calculator */}
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#16365B] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#B9E5FF]" />
              <span>Comparative Cost-per-kWh Calculator</span>
            </h2>
            <p className="text-xs text-slate-400">
              Calculate the true unit price of running your generator compared to public utility supply.
            </p>
          </div>
          <StatusBadge status="available" size="sm" label="Live Calculation" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Column */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Fuel Price (Per Litre)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={fuelPricePerLiter}
                  onChange={(e) => setFuelPricePerLiter(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#071629] border border-[#16365B] focus:border-[#B9E5FF] rounded px-3 py-2 text-white font-mono"
                />
                <span className="absolute right-3 top-2 text-slate-400">₦/L</span>
              </div>
              <span className="text-[10px] text-slate-400">Prevailing petrol or diesel rate</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Fuel Consumption (Litres/Hour)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={litersPerHour}
                  onChange={(e) => setLitersPerHour(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#071629] border border-[#16365B] focus:border-[#B9E5FF] rounded px-3 py-2 text-white font-mono"
                />
                <span className="absolute right-3 top-2 text-slate-400">L/h</span>
              </div>
              <span className="text-[10px] text-slate-400">Typical: 0.8L–1.5L for 2–5 kVA sets</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Average Active Load (kW)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={generatorLoadKw}
                  onChange={(e) => setGeneratorLoadKw(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#071629] border border-[#16365B] focus:border-[#B9E5FF] rounded px-3 py-2 text-white font-mono"
                />
                <span className="absolute right-3 top-2 text-slate-400">kW</span>
              </div>
              <span className="text-[10px] text-slate-400">Average power consumed while running</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Grid Tariff (Per kWh)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={gridTariffPerKwh}
                  onChange={(e) => setGridTariffPerKwh(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#071629] border border-[#16365B] focus:border-[#B9E5FF] rounded px-3 py-2 text-white font-mono"
                />
                <span className="absolute right-3 top-2 text-slate-400">₦/kWh</span>
              </div>
              <span className="text-[10px] text-slate-400">e.g. Band A rate or local meter tariff</span>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 bg-[#071629] border border-[#16365B] rounded-xl p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs uppercase font-mono tracking-wider text-[#B9E5FF] font-semibold">
                Cost Comparison Result
              </span>

              <div className="space-y-2 border-b border-[#16365B]/60 pb-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Generator Hourly Burn:</span>
                  <span className="font-mono font-bold text-white">₦{costCalculation.generatorHourlyCost.toLocaleString()}/hour</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Generator Effective Unit Cost:</span>
                  <span className="font-mono font-bold text-amber-300 text-sm">
                    ₦{Math.round(costCalculation.generatorCostPerKwh).toLocaleString()} / kWh
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Grid Utility Unit Cost:</span>
                  <span className="font-mono font-bold text-[#B9E5FF]">
                    ₦{gridTariffPerKwh.toLocaleString()} / kWh
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#0B1B33] rounded-lg border border-[#16365B] space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-white font-semibold">
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                  <span>Cost Multiplier: {costCalculation.ratio}x</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Running this generator is approximately <strong className="text-white">{costCalculation.ratio} times</strong> more expensive per unit of energy than grid power.
                </p>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic">
              Excludes engine oil and mechanical depreciation costs. Real-world generator costs are typically 10–15% higher.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Expense Log Registry */}
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#16365B] pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#B9E5FF]" />
              <span>Energy Expense Records</span>
            </h2>
            <p className="text-xs text-slate-400">
              Total Recorded Spending: <strong className="text-white font-mono">₦{totalSpent.toLocaleString()}</strong>
            </p>
          </div>

          <button
            onClick={() => setShowLogForm(!showLogForm)}
            className="px-4 py-2 rounded-lg bg-[#B9E5FF] hover:bg-white text-[#071629] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Log Expense</span>
          </button>
        </div>

        {/* Expense Entry Form */}
        {showLogForm && (
          <form onSubmit={handleAddExpense} className="p-4 bg-[#071629] border border-[#16365B] rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white">Record Fuel or Utility Purchase</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Expense Category</label>
                <select
                  value={newExpense.type}
                  onChange={(e) => setNewExpense({ ...newExpense, type: e.target.value as any })}
                  className="w-full bg-[#0B1B33] border border-[#16365B] rounded px-3 py-2 text-white focus:outline-none focus:border-[#B9E5FF]"
                >
                  <option value="Generator Fuel">Generator Fuel</option>
                  <option value="Grid Utility Token">Grid Utility Token</option>
                  <option value="Solar Maintenance">Solar Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Amount Spent (₦)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 15000"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full bg-[#0B1B33] border border-[#16365B] rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-[#B9E5FF]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Quantity / Units (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 15 Litres or 85 kWh"
                  value={newExpense.quantity}
                  onChange={(e) => setNewExpense({ ...newExpense, quantity: e.target.value })}
                  className="w-full bg-[#0B1B33] border border-[#16365B] rounded px-3 py-2 text-white focus:outline-none focus:border-[#B9E5FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium text-xs">Notes / Context (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Filling station receipt #4829, purchased for week"
                value={newExpense.notes}
                onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                className="w-full bg-[#0B1B33] border border-[#16365B] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B9E5FF]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogForm(false)}
                className="px-3 py-1.5 rounded border border-[#16365B] text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-[#B9E5FF] text-[#071629] font-bold text-xs hover:bg-white"
              >
                Record Expense
              </button>
            </div>
          </form>
        )}

        {/* Expenses List */}
        <div className="space-y-3">
          {expenseList.map((exp) => (
            <div 
              key={exp.id}
              className="p-4 bg-[#071629] border border-[#16365B] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{exp.type}</span>
                  {exp.quantity && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#16365B] text-[#B9E5FF]">
                      {exp.quantity}
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-[11px]">{exp.notes} · Logged on {exp.date}</p>
              </div>

              <div className="text-right sm:text-right">
                <span className="font-mono text-base font-bold text-white block">
                  ₦{exp.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Smart Insights Notice */}
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Automated Energy Billing Telemetry</h3>
            <StatusBadge status="hardware-required" size="sm" label="Connector Required" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Real-time hourly spend graphs and automated meter readings will be unlocked when the physical 
            EnerGuru cellular connector is deployed to monitor line voltages and energy flow.
          </p>
        </div>

        <button
          onClick={() => onNavigate('connector')}
          className="px-4 py-2 rounded-lg bg-[#16365B] hover:bg-[#B9E5FF] hover:text-[#071629] text-xs font-semibold text-white transition-colors shrink-0"
        >
          Explore Connector Roadmap →
        </button>
      </div>
    </div>
  );
};
