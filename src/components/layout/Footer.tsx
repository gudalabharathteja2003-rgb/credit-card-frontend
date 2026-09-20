import React, { useState } from 'react';
import { ShieldCheck, Mail, Phone, Lock, ExternalLink } from 'lucide-react';
import { Modal } from '../ui/Modal';

export const Footer: React.FC = () => {
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 text-slate-400 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Overview */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-blue-500" />
              <span>Credit Card Fraud Detection Portal</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Enterprise financial threat intelligence and real-time transaction scoring platform. Powered by high-dimensional 30-feature PCA model inference and Cloud Firestore ledger auditing.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                FastAPI Gateway Active
              </span>
              <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800">
                <Lock className="w-3 h-3 text-blue-400" />
                ABAC Firestore Isolation
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Security Operations
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <a href="mailto:security@fraudguard-portal.com" className="hover:text-blue-400 transition">
                  security@fraudguard-portal.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>+1 (888) 492-FRAUD</span>
              </li>
              <li className="text-slate-500 pt-1">
                24/7 Threat Response Center · Level 4 SLA
              </li>
            </ul>
          </div>

          {/* Compliance & Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Compliance & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => setPrivacyModalOpen(true)}
                  className="hover:text-blue-400 transition text-left underline decoration-slate-700 underline-offset-4"
                >
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <a
                  href="https://credit-card-fraud-detection-xags.onrender.com/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-400 transition flex items-center gap-1"
                >
                  FastAPI OpenAPI Specs <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li className="text-slate-500">
                ISO 27001 & SOC 2 Audited Architecture
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Credit Card Fraud Detection Portal. All rights reserved.</p>
          <p className="font-mono text-[11px]">
            FastAPI Backend: <span className="text-slate-400">credit-card-fraud-detection-xags.onrender.com</span>
          </p>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      <Modal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        title="Privacy Policy & PCA Feature Protection"
        description="Last updated September 2026 · Enterprise Security & Compliance"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div>
            <h5 className="font-semibold text-white text-sm mb-1">1. Anonymization via PCA Transformation</h5>
            <p>
              To protect consumer privacy and eliminate Personally Identifiable Information (PII), original financial attributes (such as cardholder names, PAN numbers, merchant names, and geographic coordinates) have been transformed using Principal Component Analysis (PCA) into 28 orthogonal vectors (V1 through V28).
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-white text-sm mb-1">2. Zero-Retention Transaction Ingestion</h5>
            <p>
              Inference requests sent to our FastAPI endpoint are evaluated in-memory without unencrypted disk writes. Only authenticated users may persist prediction audits to their dedicated Firestore sub-collection.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-white text-sm mb-1">3. Attribute-Based Access Control (ABAC)</h5>
            <p>
              Under our cloud Firestore rules, access to prediction records is strictly scoped to the originating user UID (<code className="text-blue-300">request.auth.uid == resource.data.userId</code>). No other portal member can inspect your historical queries.
            </p>
          </div>
        </div>
      </Modal>
    </footer>
  );
};
