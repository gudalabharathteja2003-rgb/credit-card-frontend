import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  History,
  Zap,
  ExternalLink,
  ArrowRight,
  Clock,
  DollarSign,
  Lock,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { fetchUserPredictions } from '../lib/firebase';
import { PredictionRecord } from '../types';

export const Dashboard: React.FC = () => {
  const { currentUser, logout, isFirebaseConfigured } = useAuth();
  const [recentPredictions, setRecentPredictions] = useState<PredictionRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchUserPredictions(currentUser.uid)
        .then((records) => {
          setRecentPredictions(records.slice(0, 5));
        })
        .finally(() => setLoadingHistory(false));
    }
  }, [currentUser]);

  const totalScans = recentPredictions.length;
  const fraudCount = recentPredictions.filter((p) => p.prediction === 1).length;
  const legitCount = recentPredictions.filter((p) => p.prediction === 0).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Analyst Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Operations Center · Analyst Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Analyst'}
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Authenticated UID: <span className="text-blue-400">{currentUser?.uid}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/predict">
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Run New Prediction
            </Button>
          </Link>
          <Link to="/history">
            <Button variant="outline" size="md" leftIcon={<History className="w-4 h-4" />}>
              Audit Ledger
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Recent Predictions</span>
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono mt-2">
              {loadingHistory ? '...' : totalScans}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Stored in user Firestore ledger</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Legitimate Cleared</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-2">
              {loadingHistory ? '...' : legitCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Zero fraud flags triggered</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Fraud Detected</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-rose-400 font-mono mt-2">
              {loadingHistory ? '...' : fraudCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Exceeded risk probability limits</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">FastAPI Engine</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-base font-bold text-emerald-400 font-mono mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              ONLINE 200 OK
            </div>
            <div className="text-[11px] text-slate-500 mt-1 truncate">
              credit-card-fraud-detection-xags
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-blue-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/30 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Live 30-Feature Inference Testing</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Input or sample transaction parameters including elapsed time, monetary amount, and V1–V28 PCA vectors to query the FastAPI endpoint in real time.
            </p>
          </div>
          <Link to="/predict">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open Model Predictor
            </Button>
          </Link>
        </div>

        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Firestore Audit History</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Review, filter, and inspect past model predictions with user-level ABAC data isolation. View full 30-vector payloads and re-test suspicious events.
            </p>
          </div>
          <Link to="/history">
            <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View Prediction Ledger
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Predictions Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Predictions Preview</CardTitle>
            <span className="text-xs text-slate-400">Most recent transactions evaluated under your account</span>
          </div>
          <Link to="/history" className="text-xs text-blue-400 hover:underline">
            View All History →
          </Link>
        </CardHeader>
        <CardContent>
          {loadingHistory ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading recent ledger records...</div>
          ) : recentPredictions.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-xs text-slate-400">
                No predictions recorded yet. Run your first fraud evaluation in the predictor.
              </p>
              <Link to="/predict">
                <Button variant="primary" size="sm">
                  Run Sample Prediction
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3 font-medium">Timestamp</th>
                    <th className="p-3 font-medium">Amount</th>
                    <th className="p-3 font-medium">Classification</th>
                    <th className="p-3 font-medium">Fraud Probability</th>
                    <th className="p-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentPredictions.map((r, i) => (
                    <tr key={r.id || i} className="hover:bg-slate-800/30 transition">
                      <td className="p-3 text-slate-300 font-mono">
                        {r.createdAt ? new Date(r.createdAt).toLocaleString() : 'Just now'}
                      </td>
                      <td className="p-3 font-mono font-semibold text-white">
                        ${Number(r.inputData.Amount || 0).toFixed(2)}
                      </td>
                      <td className="p-3">
                        {r.prediction === 1 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Potential Fraud
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Legitimate
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-slate-300">
                        {(r.fraudProbability * 100).toFixed(2)}%
                      </td>
                      <td className="p-3 text-right">
                        <Link to="/history" className="text-blue-400 hover:underline text-xs">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
