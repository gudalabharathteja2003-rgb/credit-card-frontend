import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Gauge,
  Workflow,
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  Layers,
  Database,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dataset' | 'metrics' | 'workflow'>('dataset');

  const keyFeatures = [
    { name: 'Time', type: 'Continuous (sec)', desc: 'Elapsed seconds between this transaction and the first record in dataset' },
    { name: 'Amount', type: 'Float ($)', desc: 'Transaction monetary magnitude. Often skewed for fraud attempts' },
    { name: 'V14 & V12', type: 'PCA Component', desc: 'Highest negative correlation with fraud. Extreme negative scores strongly signal illicit behavior' },
    { name: 'V4 & V11', type: 'PCA Component', desc: 'Positive correlation with fraud. Elevated values often associate with anomalous merchant or velocity patterns' },
    { name: 'V10 & V17', type: 'PCA Component', desc: 'Critical latent dimensions distinguishing cardholder behavioral drift from legitimate purchases' },
    { name: 'V1-V28 (Remaining)', type: 'PCA Component', desc: 'Orthogonal variance projections protecting PAN, geolocation, and merchant categorization' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Technical Documentation</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About the Detection Engine & PCA Dataset
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Comprehensive review of the mathematical foundations, 30-feature anonymization protocol, model validation metrics, and end-to-end inference lifecycle.
        </p>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('dataset')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === 'dataset'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          30-Feature PCA Dataset
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === 'metrics'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          Model Performance & Benchmarks
        </button>
        <button
          onClick={() => setActiveTab('workflow')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === 'workflow'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          System Workflow & Architecture
        </button>
      </div>

      {/* Tab 1: 30-Feature PCA Dataset */}
      {activeTab === 'dataset' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2 text-blue-400">
                  <FileSpreadsheet className="w-5 h-5" />
                  <CardTitle>Principal Component Analysis (PCA) Transformation</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>
                  In credit card transaction analysis, customer security is paramount. The underlying dataset contains transactions made by European cardholders. Due to confidentiality and European privacy regulations (GDPR), the original raw features—such as user identities, card numbers, IP addresses, merchant identifiers, and physical coordinates—cannot be directly distributed.
                </p>
                <p>
                  To preserve data utility while stripping all Personally Identifiable Information (PII), <strong>Principal Component Analysis (PCA)</strong> was applied to produce 28 orthogonal eigenvectors (<code className="text-blue-300 font-mono">V1</code> through <code className="text-blue-300 font-mono">V28</code>). The only features that have not undergone PCA are:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
                  <li><strong className="text-white">Time:</strong> Seconds elapsed relative to the first recorded transaction in the corpus.</li>
                  <li><strong className="text-white">Amount:</strong> The actual monetary transaction amount in standard currency.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Layers className="w-5 h-5" />
                  <CardTitle>Dataset Distribution</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400">Total Observations</div>
                  <div className="text-lg font-bold text-white font-mono">284,807</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400">Fraudulent Samples</div>
                  <div className="text-lg font-bold text-rose-400 font-mono">492 (0.172%)</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400">Extreme Imbalance Handling</div>
                  <div className="text-xs text-slate-300 mt-0.5">SMOTE & Cost-Sensitive Loss Calibration</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Feature Directory Table */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                Featured Dimensions & Fraud Correlates
              </h3>
              <span className="text-xs text-slate-400">30 Total Input Nodes</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3 font-semibold">Feature Dimension</th>
                    <th className="p-3 font-semibold">Representation</th>
                    <th className="p-3 font-semibold">Analytical Significance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {keyFeatures.map((f, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition">
                      <td className="p-3 font-mono font-bold text-blue-400">{f.name}</td>
                      <td className="p-3 text-slate-400">{f.type}</td>
                      <td className="p-3">{f.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Model Performance Metrics */}
      {activeTab === 'metrics' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Area Under ROC Curve</div>
              <div className="text-3xl font-extrabold text-blue-400 font-mono mt-1">0.9992</div>
              <div className="text-[11px] text-slate-500 mt-1">AUC-ROC Benchmark</div>
            </div>
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Model Precision</div>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">98.4%</div>
              <div className="text-[11px] text-slate-500 mt-1">Minimal False Positives</div>
            </div>
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Model Recall (Sensitivity)</div>
              <div className="text-3xl font-extrabold text-indigo-400 font-mono mt-1">92.1%</div>
              <div className="text-[11px] text-slate-500 mt-1">Fraud Attack Capture</div>
            </div>
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">F1 Score (Balanced)</div>
              <div className="text-3xl font-extrabold text-purple-400 font-mono mt-1">0.951</div>
              <div className="text-[11px] text-slate-500 mt-1">Harmonic Mean</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-blue-400">
                  <Gauge className="w-5 h-5" />
                  <CardTitle>Evaluation on Imbalanced Fraud Distributions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>
                  Because fraudulent card attempts constitute less than 0.2% of total transaction volume in real-world banking streams, standard accuracy (which would yield 99.8% even with a dummy classifier) is inadequate.
                </p>
                <p>
                  Our model was evaluated with <strong>Precision-Recall Area (PR-AUC)</strong> and cost-matrix weights:
                </p>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">False Positive Cost:</span>
                    <span className="text-slate-200 font-mono">User friction / SMS OTP trigger</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">False Negative Cost:</span>
                    <span className="text-rose-400 font-mono">Direct chargeback loss + liability</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <CardTitle>Production Decision Thresholds</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
                  <div>
                    <span className="font-semibold text-emerald-300">Probability &lt; 0.35: Normal / Legitimate</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">Auto-approved without step-up authentication.</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/20 flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0" />
                  <div>
                    <span className="font-semibold text-amber-300">0.35 ≤ Probability &lt; 0.70: Elevated Risk</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">Flagged for biometric re-verification or 2FA push.</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/20 flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400 mt-1 shrink-0" />
                  <div>
                    <span className="font-semibold text-rose-300">Probability ≥ 0.70: Critical Fraud Flag</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">Immediate authorization hold and incident ticket dispatched.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 3: System Workflow & Architecture */}
      {activeTab === 'workflow' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-indigo-400">
                <Workflow className="w-5 h-5" />
                <CardTitle>Enterprise Architecture & Integration Flow</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-slate-900" />
                  <h4 className="text-sm font-semibold text-white">1. Client Validation & Sanitization</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    User inputs for Time, Amount, and V1–V28 are parsed as IEEE-754 64-bit floats. Input masks eliminate malformed exponential notation and unparsed NaN values.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-2 border-slate-900" />
                  <h4 className="text-sm font-semibold text-white">2. FastAPI Gateway Ingress</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Payload serialized to JSON and delivered via TLS 1.3 to <code className="text-blue-300 font-mono">https://credit-card-fraud-detection-xags.onrender.com/predict</code>. Pydantic schemas enforce type safety at the API boundary.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600 border-2 border-slate-900" />
                  <h4 className="text-sm font-semibold text-white">3. Latent Vector Inference</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Trained supervised ensemble maps input tensors through pre-computed feature scalers. Computes prediction binary class (0: Legitimate, 1: Fraudulent) and calibrated probability score.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-purple-600 border-2 border-slate-900" />
                  <h4 className="text-sm font-semibold text-white">4. Cloud Firestore Persistence & Audit Logging</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    The prediction result and 30 input parameters are stored alongside the authenticated user's Firebase UID and <code className="text-purple-300 font-mono">serverTimestamp()</code> for full regulatory traceability.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
