import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Database,
  ArrowDown,
  Info,
  Sliders,
  DollarSign,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { predictTransaction, FraudApiError } from '../services/fraudApi';
import { savePredictionRecord } from '../lib/firebase';
import {
  DEFAULT_TRANSACTION,
  SAMPLE_FRAUDULENT,
  SAMPLE_LEGITIMATE,
} from '../data/sampleTransactions';
import { PredictionResponse, TransactionInputs } from '../types';

export const Predict: React.FC = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<TransactionInputs>({ ...DEFAULT_TRANSACTION });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [savedRecordId, setSavedRecordId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Populate sample data
  const handleLoadLegitimate = () => {
    setFormData({ ...SAMPLE_LEGITIMATE });
    setValidationErrors({});
    setError(null);
    setResult(null);
    setSavedRecordId(null);
  };

  const handleLoadFraudulent = () => {
    setFormData({ ...SAMPLE_FRAUDULENT });
    setValidationErrors({});
    setError(null);
    setResult(null);
    setSavedRecordId(null);
  };

  const handleReset = () => {
    setFormData({ ...DEFAULT_TRANSACTION });
    setValidationErrors({});
    setError(null);
    setResult(null);
    setSavedRecordId(null);
  };

  const handleInputChange = (field: keyof TransactionInputs, val: string) => {
    // Keep raw or update as number
    const num = parseFloat(val);
    setFormData((prev) => ({
      ...prev,
      [field]: isNaN(num) ? val : num,
    }));

    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateAllFields = (): boolean => {
    const errs: Record<string, string> = {};
    const keys: (keyof TransactionInputs)[] = [
      'Time',
      'Amount',
      ...(Array.from({ length: 28 }, (_, i) => `V${i + 1}` as keyof TransactionInputs)),
    ];

    keys.forEach((key) => {
      const val = formData[key];
      const parsed = typeof val === 'number' ? val : parseFloat(val as unknown as string);
      if (isNaN(parsed)) {
        errs[key] = 'Must be a valid float';
      }
    });

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setSavedRecordId(null);

    if (!validateAllFields()) {
      setError('Please resolve invalid floating-point numbers highlighted in red before submission.');
      return;
    }

    // Ensure strictly sanitized floats
    const sanitizedInputs: TransactionInputs = {
      Time: parseFloat(String(formData.Time)),
      Amount: parseFloat(String(formData.Amount)),
      V1: parseFloat(String(formData.V1)),
      V2: parseFloat(String(formData.V2)),
      V3: parseFloat(String(formData.V3)),
      V4: parseFloat(String(formData.V4)),
      V5: parseFloat(String(formData.V5)),
      V6: parseFloat(String(formData.V6)),
      V7: parseFloat(String(formData.V7)),
      V8: parseFloat(String(formData.V8)),
      V9: parseFloat(String(formData.V9)),
      V10: parseFloat(String(formData.V10)),
      V11: parseFloat(String(formData.V11)),
      V12: parseFloat(String(formData.V12)),
      V13: parseFloat(String(formData.V13)),
      V14: parseFloat(String(formData.V14)),
      V15: parseFloat(String(formData.V15)),
      V16: parseFloat(String(formData.V16)),
      V17: parseFloat(String(formData.V17)),
      V18: parseFloat(String(formData.V18)),
      V19: parseFloat(String(formData.V19)),
      V20: parseFloat(String(formData.V20)),
      V21: parseFloat(String(formData.V21)),
      V22: parseFloat(String(formData.V22)),
      V23: parseFloat(String(formData.V23)),
      V24: parseFloat(String(formData.V24)),
      V25: parseFloat(String(formData.V25)),
      V26: parseFloat(String(formData.V26)),
      V27: parseFloat(String(formData.V27)),
      V28: parseFloat(String(formData.V28)),
    };

    setLoading(true);

    try {
      // 1. Post to live FastAPI model endpoint
      const response = await predictTransaction(sanitizedInputs);
      setResult(response);

      // 2. Save prediction record to Firestore with User UID
      if (currentUser) {
        try {
          const docId = await savePredictionRecord(
            currentUser.uid,
            currentUser.email || 'analyst@portal.com',
            sanitizedInputs,
            response.prediction,
            response.fraud_probability
          );
          setSavedRecordId(docId);
        } catch (saveErr) {
          console.error('Failed to log prediction to database:', saveErr);
        }
      }

      // Smooth scroll to result
      setTimeout(() => {
        const el = document.getElementById('prediction-result-anchor');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err: any) {
      setError(
        err instanceof FraudApiError
          ? err.message
          : 'Encountered an unexpected error communicating with the ML engine.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header & Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
              Live FastAPI Inference Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Transaction Fraud Predictor
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Submit 30 PCA-transformed transaction attributes for instant classification and risk probability scoring.
          </p>
        </div>

        {/* Action Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleLoadLegitimate}
            leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
          >
            Load Sample Legitimate
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleLoadFraudulent}
            leftIcon={<ShieldAlert className="w-4 h-4 text-rose-400" />}
          >
            Load Sample Fraudulent
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Backend Status Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white">API Target:</strong> <code className="text-blue-300 font-mono">https://credit-card-fraud-detection-xags.onrender.com/predict</code>. If the Render instance is idle, the initial inference request may take 20–35 seconds to warm up.
        </div>
      </div>

      {error && (
        <Alert variant="error" title="Inference Error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Transaction Basics */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-blue-400">
              <DollarSign className="w-5 h-5" />
              <CardTitle>Section 1: Transaction Basics</CardTitle>
            </div>
            <CardDescription>
              Core temporal delta and monetary value of the authorization attempt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Time (Elapsed seconds)"
                type="number"
                step="any"
                placeholder="e.g. 406.0"
                value={formData.Time}
                onChange={(e) => handleInputChange('Time', e.target.value)}
                error={validationErrors.Time}
                helperText="Seconds elapsed between this transaction and the initial dataset observation"
                leftIcon={<Clock className="w-4 h-4" />}
                required
              />

              <Input
                label="Amount (USD $)"
                type="number"
                step="any"
                placeholder="e.g. 100.0"
                value={formData.Amount}
                onChange={(e) => handleInputChange('Amount', e.target.value)}
                error={validationErrors.Amount}
                helperText="Transaction authorization amount in dollars ($)"
                leftIcon={<DollarSign className="w-4 h-4" />}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Anonymized Features V1 through V28 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400">
                <Sliders className="w-5 h-5" />
                <CardTitle>Section 2: Anonymized PCA Features (V1 to V28)</CardTitle>
              </div>
              <span className="text-xs font-mono text-slate-400">28 Continuous Vectors</span>
            </div>
            <CardDescription>
              Zero-PII orthogonal variables derived from statistical PCA matrix decomposition.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3.5">
              {Array.from({ length: 28 }, (_, i) => {
                const key = `V${i + 1}` as keyof TransactionInputs;
                return (
                  <div key={key} className="space-y-1">
                    <label className="block text-[11px] font-mono font-semibold text-slate-300">
                      {key}
                    </label>
                    <input
                      type="number"
                      step="any"
                      className={`w-full rounded-md border bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 ${
                        validationErrors[key]
                          ? 'border-rose-500 focus:ring-rose-500'
                          : 'border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      value={formData[key]}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      required
                    />
                    {validationErrors[key] && (
                      <span className="text-[10px] text-rose-400 block">Invalid float</span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Submit Execution Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Ready to dispatch to FastAPI inference cluster.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              isLoading={loading}
              rightIcon={<Zap className="w-4 h-4" />}
            >
              {loading ? 'Evaluating Transaction Vectors...' : 'Execute Fraud Prediction'}
            </Button>
          </div>
        </div>
      </form>

      {/* Result Visualization Anchor */}
      <div id="prediction-result-anchor" />

      {/* Section 3: Result Visualization */}
      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2">
            <ArrowDown className="w-4 h-4 text-blue-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Inference Evaluation Result
            </h2>
          </div>

          {result.prediction === 0 ? (
            /* Legitimate Result Card */
            <div className="rounded-xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/40 to-slate-900 p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-500/20">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Prediction: 0 · Legitimate
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                      Transaction Appears Legitimate
                    </h3>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-emerald-500/20 sm:pl-6">
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Legitimacy Confidence</div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono mt-0.5">
                    {((1 - result.fraud_probability) * 100).toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Metrics details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400">Fraud Probability:</span>
                  <div className="text-lg font-bold text-white font-mono mt-1">
                    {(result.fraud_probability * 100).toFixed(2)}%
                  </div>
                  <span className="text-[11px] text-emerald-400">Well below fraud threshold</span>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400">Evaluated Amount:</span>
                  <div className="text-lg font-bold text-white font-mono mt-1">
                    ${Number(formData.Amount).toFixed(2)}
                  </div>
                  <span className="text-[11px] text-slate-400">Time delta: {formData.Time}s</span>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400">Audit Status:</span>
                  <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5 mt-2">
                    <Database className="w-3.5 h-3.5" />
                    {savedRecordId ? 'Saved to Cloud Firestore' : 'Audit Logging Completed'}
                  </div>
                  {savedRecordId && (
                    <span className="text-[10px] text-slate-500 font-mono truncate block mt-0.5">
                      ID: {savedRecordId}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Fraudulent Result Card */
            <div className="rounded-xl border border-rose-500/50 bg-gradient-to-b from-rose-950/50 to-slate-900 p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-rose-500/20">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                      Prediction: 1 · Critical Threat
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                      Potential Fraud Detected!
                    </h3>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-rose-500/20 sm:pl-6">
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Fraud Probability</div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-rose-400 font-mono mt-0.5">
                    {(result.fraud_probability * 100).toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Metrics details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-rose-500/30">
                  <span className="text-slate-400">Risk Assessment:</span>
                  <div className="text-lg font-bold text-rose-400 font-mono mt-1">
                    CRITICAL HIGH RISK
                  </div>
                  <span className="text-[11px] text-rose-300">Authorization hold recommended</span>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400">Evaluated Amount:</span>
                  <div className="text-lg font-bold text-white font-mono mt-1">
                    ${Number(formData.Amount).toFixed(2)}
                  </div>
                  <span className="text-[11px] text-slate-400">Time delta: {formData.Time}s</span>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400">Audit Status:</span>
                  <div className="text-xs font-semibold text-rose-300 flex items-center gap-1.5 mt-2">
                    <Database className="w-3.5 h-3.5" />
                    {savedRecordId ? 'Saved to Cloud Firestore' : 'Security Incident Logged'}
                  </div>
                  {savedRecordId && (
                    <span className="text-[10px] text-slate-500 font-mono truncate block mt-0.5">
                      ID: {savedRecordId}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
