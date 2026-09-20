import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  History as HistoryIcon,
  Search,
  Filter,
  Download,
  Eye,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Database,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { fetchUserPredictions } from '../lib/firebase';
import { PredictionRecord, TransactionInputs } from '../types';

export const History: React.FC = () => {
  const { currentUser } = useAuth();
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'legitimate' | 'fraud'>('all');
  const [selectedRecord, setSelectedRecord] = useState<PredictionRecord | null>(null);
  const navigate = useNavigate();

  const loadData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const records = await fetchUserPredictions(currentUser.uid);
      setPredictions(records);
    } catch (err) {
      console.error('Failed to load predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  // Filter & Search Logic
  const filteredPredictions = predictions.filter((record) => {
    // Classification filter
    if (filterType === 'legitimate' && record.prediction !== 0) return false;
    if (filterType === 'fraud' && record.prediction !== 1) return false;

    // Search term
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const amountStr = String(record.inputData?.Amount || '');
    const idStr = record.id?.toLowerCase() || '';
    const dateStr = record.createdAt ? new Date(record.createdAt).toLocaleString().toLowerCase() : '';

    return amountStr.includes(term) || idStr.includes(term) || dateStr.includes(term);
  });

  const handleExportCSV = () => {
    if (filteredPredictions.length === 0) return;
    const headers = ['RecordID', 'Timestamp', 'Amount', 'Classification', 'FraudProbability'];
    const rows = filteredPredictions.map((r) => [
      r.id || '',
      r.createdAt ? new Date(r.createdAt).toISOString() : '',
      r.inputData?.Amount || 0,
      r.prediction === 1 ? 'Fraudulent' : 'Legitimate',
      r.fraudProbability,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fraud_predictions_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
              Firestore Audit Ledger
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Prediction History
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Immutable log of transactions classified by the model, isolated to your user UID.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            isLoading={loading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Ledger
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            disabled={filteredPredictions.length === 0}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search by amount, record ID, or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        {/* Classification Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${
              filterType === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({predictions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('legitimate')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${
              filterType === 'legitimate'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Legitimate
          </button>
          <button
            type="button"
            onClick={() => setFilterType('fraud')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${
              filterType === 'fraud'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Fraud
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
              <p>Fetching prediction records from Cloud Firestore...</p>
            </div>
          ) : filteredPredictions.length === 0 ? (
            <div className="py-16 text-center space-y-4 px-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                <HistoryIcon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">No Predictions Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {searchTerm || filterType !== 'all'
                    ? 'No historical evaluations match your current filter parameters.'
                    : 'You have not evaluated any transactions yet. Use the model page to scan transactions.'}
                </p>
              </div>
              <Link to="/predict">
                <Button variant="primary" size="sm">
                  Run New Transaction Check
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4 font-medium">Timestamp</th>
                    <th className="p-4 font-medium">Amount ($)</th>
                    <th className="p-4 font-medium">Classification</th>
                    <th className="p-4 font-medium">Probability Score</th>
                    <th className="p-4 font-medium">Time (s)</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredPredictions.map((r, idx) => {
                    const isFraud = r.prediction === 1;
                    const dateFormatted = r.createdAt
                      ? new Date(r.createdAt).toLocaleString()
                      : 'Recent';

                    return (
                      <tr key={r.id || idx} className="hover:bg-slate-850/40 transition">
                        <td className="p-4 font-mono text-slate-300">
                          {dateFormatted}
                        </td>
                        <td className="p-4 font-mono font-bold text-white text-sm">
                          ${Number(r.inputData?.Amount || 0).toFixed(2)}
                        </td>
                        <td className="p-4">
                          {isFraud ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              Potential Fraud
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Legitimate
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-mono text-slate-200">
                          <div className="flex items-center gap-2">
                            <span>{(r.fraudProbability * 100).toFixed(2)}%</span>
                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                              <div
                                className={`h-full ${isFraud ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                style={{ width: `${Math.min(100, r.fraudProbability * 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-slate-400">
                          {r.inputData?.Time ?? 0}s
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedRecord(r)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-blue-400 hover:text-white hover:bg-slate-800 transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View 30 Features</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal to view all 30 PCA features of a record */}
      <Modal
        isOpen={selectedRecord !== null}
        onClose={() => setSelectedRecord(null)}
        title="Transaction Feature Vector Details"
        description={`Audit record evaluated with model "${selectedRecord?.modelName || 'Credit Card Fraud Detection'}"`}
        maxWidth="2xl"
      >
        {selectedRecord && (
          <div className="space-y-6 text-xs text-slate-300">
            {/* Classification Summary Box */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                selectedRecord.prediction === 1
                  ? 'bg-rose-950/40 border-rose-500/30 text-rose-200'
                  : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {selectedRecord.prediction === 1 ? (
                  <ShieldAlert className="w-6 h-6 text-rose-400" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                )}
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {selectedRecord.prediction === 1
                      ? 'Fraudulent Transaction'
                      : 'Legitimate Transaction'}
                  </h4>
                  <p className="text-[11px] opacity-80">
                    Timestamp: {new Date(selectedRecord.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] uppercase tracking-wider block opacity-70">
                  Fraud Probability
                </span>
                <span className="text-xl font-bold font-mono">
                  {(selectedRecord.fraudProbability * 100).toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Basic fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Transaction Time:</span>
                <div className="text-base font-bold text-white font-mono mt-0.5">
                  {selectedRecord.inputData?.Time} seconds
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Monetary Amount:</span>
                <div className="text-base font-bold text-white font-mono mt-0.5">
                  ${Number(selectedRecord.inputData?.Amount || 0).toFixed(2)}
                </div>
              </div>
            </div>

            {/* PCA Features V1 - V28 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-white">
                <Sliders className="w-4 h-4 text-blue-400" />
                <span>All 28 PCA Vectors (V1 – V28)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto p-3 rounded-xl bg-slate-950 border border-slate-800">
                {Array.from({ length: 28 }, (_, i) => {
                  const key = `V${i + 1}` as keyof TransactionInputs;
                  const val = selectedRecord.inputData?.[key];
                  return (
                    <div key={key} className="p-2 rounded bg-slate-900 border border-slate-850">
                      <span className="text-[10px] text-slate-400 font-mono block">{key}</span>
                      <span className="text-xs text-slate-100 font-mono font-medium">
                        {typeof val === 'number' ? val.toFixed(4) : val}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 font-mono">
              Cloud Firestore Document ID: {selectedRecord.id || 'N/A'}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
