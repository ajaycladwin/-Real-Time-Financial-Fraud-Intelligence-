import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Overview from './components/Overview';
import FraudRingsView from './components/FraudRingsView';
import TransactionsTable from './components/TransactionsTable';
import AccountsTable from './components/AccountsTable';
import TransactionDetailModal from './components/TransactionDetailModal';
import SimulatorModal from './components/SimulatorModal';
import { fetchFraudAnalysis, fetchDashboardSummary } from './services/api';
import { ShieldAlert, RefreshCw, AlertTriangle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [analysis, setAnalysis] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Modals state
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showSimulator, setShowSimulator] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [analysisData, summaryData] = await Promise.all([
        fetchFraudAnalysis(),
        fetchDashboardSummary().catch(() => null)
      ]);
      setAnalysis(analysisData);
      setSummary(summaryData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching fraud data:', err);
      setError(err.message || 'Failed to connect to backend fraud intelligence API.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTransactionCreated = () => {
    loadData();
    setActiveTab('transactions');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={loadData}
        loading={loading}
        lastUpdated={lastUpdated}
        onOpenSimulator={() => setShowSimulator(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <div>
                <strong className="font-semibold">Backend Connection Alert:</strong>{' '}
                <span>{error}</span>
                <p className="text-xs text-rose-400/80 mt-0.5">
                  Ensure the Express server is running on http://localhost:5000.
                </p>
              </div>
            </div>
            <button
              onClick={loadData}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Spinner Skeleton */}
        {loading && !analysis && (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-slate-800 border-t-rose-500 animate-spin" />
              <ShieldAlert className="w-5 h-5 text-rose-400 absolute inset-0 m-auto" />
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-white tracking-wide">
                Executing Graph ML & Multi-Vector Fraud Engine...
              </div>
              <div className="text-xs text-slate-500 mt-1 font-mono">
                Querying Express REST endpoints at /api/fraud/*
              </div>
            </div>
          </div>
        )}

        {/* Active Tab View */}
        {analysis && (
          <div className="animate-in fade-in duration-300">
            {activeTab === 'overview' && (
              <Overview
                analysis={analysis}
                summary={summary}
                onSelectTab={setActiveTab}
                onSelectTransaction={(txn) => setSelectedTransaction(txn)}
              />
            )}

            {activeTab === 'rings' && (
              <FraudRingsView
                fraudRings={analysis.fraudRings}
                transactions={analysis.transactionResults}
                accounts={analysis.accountResults}
                onSelectAccount={(accId) => {
                  setActiveTab('accounts');
                }}
              />
            )}

            {activeTab === 'transactions' && (
              <TransactionsTable
                transactions={analysis.transactionResults}
                onSelectTransaction={(txn) => setSelectedTransaction(txn)}
              />
            )}

            {activeTab === 'accounts' && (
              <AccountsTable
                accounts={analysis.accountResults}
              />
            )}
          </div>
        )}
      </main>

      {/* Transaction Forensic Modal */}
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}

      {/* Transaction Simulator Modal */}
      {showSimulator && (
        <SimulatorModal
          onClose={() => setShowSimulator(false)}
          onTransactionCreated={handleTransactionCreated}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            HNX26PSI04 Real-Time Financial Fraud Intelligence • Hackathon Edition
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
            <span>Stack: Node.js + Express + MongoDB + React 19</span>
            <span>•</span>
            <span className="text-emerald-400">Status: Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
