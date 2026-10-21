import React, { useState } from 'react';
import { Page } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { 
  Cpu, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  QrCode, 
  Key, 
  Radio, 
  ShieldCheck, 
  Layers, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface ConnectDevicePageProps {
  onNavigate: (page: Page) => void;
}

export const ConnectDevicePage: React.FC<ConnectDevicePageProps> = ({ onNavigate }) => {
  const [deviceUuid, setDeviceUuid] = useState('');
  const [pairingCode, setPairingCode] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);

  const handlePairingAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setTestResult(
      'Device pairing is currently operating in simulation mode. Physical EnerGuru Connector hardware units are in electrical R&D and not yet distributed. No real device was paired.'
    );
  };

  const pairingSteps = [
    {
      num: '1',
      title: 'Physical Installation & DIN-Rail Mounting',
      desc: 'Mounted inside or alongside your main distribution box by a licensed electrician. Sensors clip non-invasively onto live mains and generator lines.',
    },
    {
      num: '2',
      title: 'Cellular Carrier Signal Handshake',
      desc: 'The onboard eSIM or micro-SIM searches for local 4G/2G mobile network towers. The status LED illuminates solid blue when cellular handshake completes.',
    },
    {
      num: '3',
      title: 'Locate Your Device Pairing QR / Serial',
      desc: 'Inspect the engraved QR code or printed serial label on the connector chassis to locate your 12-character Device ID and 6-digit pairing key.',
    },
    {
      num: '4',
      title: 'Cloud Cryptographic Registration',
      desc: 'Submit the credentials below. EnerGuru verifies the hardware certificate and links the device securely to your authenticated account.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#16365B] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('connector')}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Back to connector overview"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Connect Your Device
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 pl-8">
            Registration protocol and pairing workflow for the planned EnerGuru physical connector.
          </p>
        </div>

        <div className="flex items-center gap-2 pl-8 md:pl-0">
          <StatusBadge status="hardware-required" label="Pairing System in R&D" />
        </div>
      </div>

      {/* Honest Prototype Notice */}
      <div className="bg-[#0B1B33] border-l-4 border-amber-400 border-y border-r border-[#16365B] rounded-r-xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Hardware Simulation Preview</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          This screen illustrates the intended device pairing sequence for when physical EnerGuru hardware is produced and distributed. 
          The platform does not simulate fake telemetry or claim a device has successfully paired.
        </p>
      </div>

      {/* 4-Step Registration Protocol */}
      <div className="bg-[#0B1B33] border border-[#16365B] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#16365B] pb-3">
          <h2 className="text-lg font-bold text-white">Intended Device Provisioning Steps</h2>
          <p className="text-xs text-slate-400">
            How hardware connects from electrical panel installation to live cloud streaming.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {pairingSteps.map((s) => (
            <div key={s.num} className="p-4 bg-[#071629] border border-[#16365B] rounded-xl space-y-2">
              <span className="w-7 h-7 rounded-full bg-[#16365B] text-[#B9E5FF] font-bold text-xs flex items-center justify-center font-mono">
                {s.num}
              </span>
              <h3 className="font-bold text-white text-xs">{s.title}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Registration Form / Demonstration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-[#0B1B33] border border-[#16365B] rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2 border-b border-[#16365B] pb-3">
            <Key className="w-5 h-5 text-[#B9E5FF]" />
            <h2 className="text-base font-bold text-white">Device Pairing Form</h2>
          </div>

          {testResult ? (
            <div className="p-4 bg-[#071629] border border-amber-800/60 rounded-xl space-y-3 text-xs text-amber-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{testResult}</p>
              </div>
              <button
                onClick={() => {
                  setTestResult(null);
                  setDeviceUuid('');
                  setPairingCode('');
                }}
                className="text-xs text-[#B9E5FF] underline font-medium"
              >
                Reset form
              </button>
            </div>
          ) : (
            <form onSubmit={handlePairingAttempt} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Device Hardware Serial / UUID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. EG-CONN-7749-X"
                    value={deviceUuid}
                    onChange={(e) => setDeviceUuid(e.target.value)}
                    className="w-full bg-[#071629] border border-[#16365B] rounded px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-[#B9E5FF]"
                  />
                  <QrCode className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
                <span className="text-[10px] text-slate-400">Found on the QR sticker attached to your device</span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  6-Digit Pairing Authorization PIN
                </label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  placeholder="••••••"
                  value={pairingCode}
                  onChange={(e) => setPairingCode(e.target.value)}
                  className="w-full bg-[#071629] border border-[#16365B] rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-[#B9E5FF]"
                />
                <span className="text-[10px] text-slate-400">Printed inside your packaging quickstart card</span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#B9E5FF] hover:bg-white text-[#071629] font-bold text-xs transition-colors cursor-pointer"
                >
                  Verify & Register Connector
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar Help */}
        <div className="space-y-4">
          <div className="p-5 bg-[#0B1B33] border border-[#16365B] rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Do Not Have a Device?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Connector units are currently in manufacturing prototyping. Submit your facility requirements for our initial pilot batch.
            </p>
            <button
              onClick={() => onNavigate('get-quote')}
              className="text-xs text-[#B9E5FF] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Request quotation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5 bg-[#0B1B33] border border-[#16365B] rounded-xl space-y-2 text-xs text-slate-400">
            <span className="font-semibold text-white block">Installation Notice</span>
            <p className="text-[11px] leading-relaxed">
              Always turn off main isolation breakers before exposing terminal blocks. Never attempt hot-wire installation without professional PPE.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
