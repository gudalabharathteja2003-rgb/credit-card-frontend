import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Cpu,
  Lock,
  ArrowRight,
  Database,
  BarChart3,
  Server,
  FileCheck,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export const Home: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-850">
        {/* Subtle grid background glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              Real-time Sub-second Transaction Scoring
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Enterprise <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500">Credit Card Fraud</span> Detection
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Inspect suspicious financial events instantly with our 30-feature PCA Machine Learning model powered by a live FastAPI backend and secured with Cloud Firestore audit logs.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to={currentUser ? '/predict' : '/signin'}>
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  {currentUser ? 'Launch Model Prediction' : 'Sign In to Run Model'}
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline">
                  Explore PCA Dataset
                </Button>
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-slate-850 mt-10">
              <div className="p-3 text-center">
                <div className="text-2xl font-bold text-white font-mono">99.9%</div>
                <div className="text-xs text-slate-400 mt-1">AUC-ROC Precision</div>
              </div>
              <div className="p-3 text-center">
                <div className="text-2xl font-bold text-emerald-400 font-mono">&lt; 150ms</div>
                <div className="text-xs text-slate-400 mt-1">Inference Latency</div>
              </div>
              <div className="p-3 text-center">
                <div className="text-2xl font-bold text-blue-400 font-mono">30 PCA</div>
                <div className="text-xs text-slate-400 mt-1">Anonymized Features</div>
              </div>
              <div className="p-3 text-center">
                <div className="text-2xl font-bold text-indigo-400 font-mono">Zero PII</div>
                <div className="text-xs text-slate-400 mt-1">Data Anonymity</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            High-Speed Threat Mitigation Architecture
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Built for enterprise fintech requirements with uncompromising security, strict mathematical rigor, and transparent audit trails.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card className="hover:border-slate-700 transition-colors">
            <CardContent className="space-y-4 pt-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">Live FastAPI ML Backend</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Connects directly to our deployed FastAPI model endpoint (<code className="text-xs text-blue-300">/predict</code>). Processes 30 continuous float attributes including transaction time delta and monetary magnitude.
              </p>
              <div className="pt-2 text-xs font-mono text-slate-500 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-blue-400" />
                Hosted on Render Cloud
              </div>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="hover:border-slate-700 transition-colors">
            <CardContent className="space-y-4 pt-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">Zero-PII PCA Features</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Features V1 through V28 are derived from statistical Principal Component Analysis, ensuring complete customer confidentiality while preserving high-dimensional predictive fraud signals.
              </p>
              <div className="pt-2 text-xs font-mono text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                PCI-DSS Compliance Compatible
              </div>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="hover:border-slate-700 transition-colors">
            <CardContent className="space-y-4 pt-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">Cloud Firestore Audit Ledger</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Authenticated transactions are automatically recorded to Cloud Firestore under strict Attribute-Based Access Control (ABAC), providing a tamper-evident audit history for compliance review.
              </p>
              <div className="pt-2 text-xs font-mono text-slate-500 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-purple-400" />
                Rules-Enforced UID Isolation
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Model Workflow Graphic */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 sm:p-10">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">End-to-End Execution Flow</span>
            <h2 className="text-2xl font-bold text-white mt-1">How Fraud Decisions Are Made</h2>
            <p className="text-sm text-slate-400 mt-1">
              Every financial submission follows a multi-tiered validation and probabilistic scoring pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-blue-400 font-bold">STEP 01</span>
              <h4 className="text-sm font-semibold text-white">Vector Ingestion</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All 30 dimensions are validated client-side for valid floating-point bounds before being serialized.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-blue-400 font-bold">STEP 02</span>
              <h4 className="text-sm font-semibold text-white">FastAPI Inference</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dispatched over TLS to the machine learning container for sub-second classification evaluation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-blue-400 font-bold">STEP 03</span>
              <h4 className="text-sm font-semibold text-white">Probability Calibration</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates calibrated fraud likelihood and legitimate confidence metrics with strict risk thresholds.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-blue-400 font-bold">STEP 04</span>
              <h4 className="text-sm font-semibold text-white">Firestore Persistence</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                User UID and full input vector are written with server timestamp into isolated historical collection.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-slate-300">
                Ready to evaluate live transactions? Test with pre-set sample vectors.
              </span>
            </div>
            <Link to={currentUser ? '/predict' : '/signin'}>
              <Button size="sm" variant="primary">
                Open Model Predictor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
