import React from 'react';
import { Logo } from './Logo';
import { Page, InfoModalType } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
  onOpenModal: (type: InfoModalType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenModal }) => {
  return (
    <footer className="bg-[#0B1B33] border-t border-[#16365B] mt-auto text-slate-300 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-[#16365B]/60">
          {/* Brand & Entity info */}
          <div className="md:col-span-2 space-y-3">
            <Logo size="md" />
            <p className="text-white font-medium text-xs tracking-wide">
              Company: Tekm EnerGuru Technologies and Solutions
            </p>
            <p className="text-xs text-[#B9E5FF] italic font-medium">
              “Smarter Energy. Stay Aware. Stay Prepared.”
            </p>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              EnerGuru is a developing energy-intelligence and readiness platform designed to help 
              households, students, businesses, and institutions navigate energy uncertainty, maintain equipment, 
              and make informed decisions.
            </p>
            <div className="pt-2">
              <span className="inline-block text-[11px] text-cyan-300 bg-blue-950/80 border border-blue-900 px-2.5 py-1 rounded">
                Stage 3 Feature Centre & Commercial Foundation
              </span>
            </div>
          </div>

          {/* Navigation Column 1: Platform & Features */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
                >
                  About EnerGuru
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('equipment')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Equipment Registry
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('energy-costs')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Tariff & Fuel Modeling
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('outage-prep')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Outage Checklists
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Commercial & R&D */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Solutions & Hardware
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('plans')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Plans & Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('get-quote')}
                  className="text-slate-300 hover:text-[#B9E5FF] font-medium transition-colors cursor-pointer text-left"
                >
                  Request a Quote
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('connector')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Hardware Connector
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('community-funding')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Community Energy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Contact & Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Disclosures */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Legal & Disclosures
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenModal('legal')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Legal Information
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('privacy')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('terms')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('disclaimer')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  General Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('feedback')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Corrections & Feedback
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('search')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Site Directory & Search
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Tekm EnerGuru Technologies and Solutions. All rights reserved.
          </div>
          <div className="text-[11px] text-slate-400 text-center sm:text-right">
            Independent energy intelligence initiative. Features described are subject to ongoing research and development.
          </div>
        </div>
      </div>
    </footer>
  );
};
