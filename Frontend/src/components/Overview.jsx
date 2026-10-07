import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  Users,
  Network,
  CheckCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function Overview({
  analysis,
  summary,
  onSelectTab,
  onSelectTransaction
}) {
  const transactions = analysis?.transactionResults || [];
  const accounts = analysis?.accountResults || [];
  const rings = analysis?.fraudRings || [];

  // Derived metrics
  const totalVolume = summary?.totalTransactionAmount || transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const criticalTxns = transactions.filter(t => t.riskScore >= 80);
  const highRiskTxns = transactions.filter(t => t.riskScore >= 60 && t.riskScore < 80);
  const mediumRiskTxns = transactions.filter(t => t.riskScore >= 30 && t.riskScore < 60);
  const lowRiskTxns = transactions.filter(t => t.riskScore < 30);

  // Top risk transactions sorted descending
  const topRiskTransactions = [...transactions].sort((a, b) => b.riskScore - a.riskScore).slice(0, 6);

  // Top risk accounts
  const topRiskAccounts = [...accounts].sort((a, b) => b.riskScore - a.riskScore).slice(0, 4);

  const getActionBadge = (action) => {
    switch (action) {
      case 'Block':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'Review':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Monitor':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  const getRiskBadge = (level) => {
    switch (level) {
      case 'Critical':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/40 ring-1 ring-rose-500/30';
      case 'High':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/30';
      case 'Medium':
        return 'bg-sky-950/80 text-sky-300 border-sky-500/40';
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Volume */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Volume Monitored
            </span>
            <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white">
              ₹{totalVolume.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="font-mono text-slate-200 font-semibold">{transactions.length}</span> live transactions evaluated
            </div>
          </div>
        </div>

        {/* Card 2: Fraud Rings Detected */}
        <div className="glass-panel-glow rounded-2xl p-5 border border-rose-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
              Coordinated Fraud Rings
            </span>
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Network className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-rose-400 flex items-center gap-2">
              {rings.length}
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                CRITICAL
              </span>
            </div>
            <div className="text-xs text-rose-300/80 mt-1">
              {rings.length > 0 ? `${rings[0].accountIds.length} accounts coordinating covertly` : 'No syndicates detected'}
            </div>
          </div>
        </div>

        {/* Card 3: High & Critical Alerts */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              High / Critical Threats
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white">
              {criticalTxns.length + highRiskTxns.length}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span className="text-rose-400 font-semibold">{criticalTxns.length} Critical</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">{highRiskTxns.length} High</span>
            </div>
          </div>
        </div>

        {/* Card 4: Accounts Monitored */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Monitored Accounts
            </span>
            <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white">
              {accounts.length}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="text-rose-400 font-semibold">
                {accounts.filter(a => a.riskScore >= 60).length} flagged
              </span>
              <span>for review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fraud Ring Alert Spotlight (Requirement 11: Start with detecting at least one clear fraud ring) */}
      {rings.length > 0 && (
        <div className="rounded-2xl p-6 bg-gradient-to-r from-rose-950/60 via-slate-900/90 to-slate-900/90 border border-rose-500/40 shadow-xl shadow-rose-950/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-rose-500/20">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 mt-0.5">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500 text-white">
                    {rings[0].ringId}
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {rings[0].name}
                  </h3>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {rings[0].pattern}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-400">Ring Risk Score</div>
                <div className="text-xl font-black text-rose-400">
                  {rings[0].riskScore} / 100
                </div>
              </div>
              <button
                onClick={() => onSelectTab('rings')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-900/40 transition-all hover:scale-105"
              >
                Inspect Ring Graph
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-1">
            {/* Accounts Involved */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
                <span>Involved Accounts ({rings[0].accountIds.length})</span>
                <span className="text-[10px] text-rose-400 font-mono">Syndicate</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {rings[0].accountIds.map((accId) => (
                  <span
                    key={accId}
                    className="px-2 py-1 rounded-md text-xs font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30"
                  >
                    {accId}
                  </span>
                ))}
              </div>
            </div>

            {/* Shared Infrastructure */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="text-xs font-semibold text-slate-400 mb-2">
                Shared Hardware & Merchants
              </div>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="truncate">
                  <span className="text-slate-500">Devices:</span>{' '}
                  <span className="font-mono text-purple-300 font-semibold">{rings[0].sharedDevices.join(', ')}</span>
                </div>
                <div className="truncate">
                  <span className="text-slate-500">Merchants:</span>{' '}
                  <span className="font-mono text-amber-300 font-semibold">{rings[0].sharedMerchants.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Key Evidence */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="text-xs font-semibold text-slate-400 mb-2">
                Explainable Evidence
              </div>
              <ul className="text-xs text-slate-300 space-y-1">
                {rings[0].evidence.map((ev, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout: Top Risk Transactions & Top Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Ranked Transactions */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                Ranked High-Risk Transactions
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Prioritized by multi-factor risk scores with AI explainability explanations
              </p>
            </div>
            <button
              onClick={() => onSelectTab('transactions')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              View All ({transactions.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">Transaction</th>
                  <th className="pb-3 font-semibold">Account</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Risk Score</th>
                  <th className="pb-3 font-semibold">Action</th>
                  <th className="pb-3 font-semibold">Top Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {topRiskTransactions.map((t) => (
                  <tr
                    key={t.transactionId}
                    onClick={() => onSelectTransaction(t)}
                    className="hover:bg-slate-900/60 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 font-mono font-medium text-slate-200 group-hover:text-rose-400">
                      {t.transactionId}
                    </td>
                    <td className="py-3 font-mono text-slate-300">
                      {t.accountId}
                    </td>
                    <td className="py-3 font-semibold text-white">
                      ₹{t.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getRiskBadge(t.riskLevel)}`}>
                          {t.riskScore}
                        </span>
                        <div className="w-12 h-1.5 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
                          <div
                            className={`h-full ${t.riskScore >= 70 ? 'bg-rose-500' : t.riskScore >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${t.riskScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getActionBadge(t.recommendedAction)}`}>
                        {t.recommendedAction}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 truncate max-w-[180px]">
                      {t.riskReasons && t.riskReasons.length > 0
                        ? t.riskReasons[0]
                        : 'Normal transaction baseline'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Highest Risk Accounts */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Ranked Suspicious Accounts
              </h3>
              <button
                onClick={() => onSelectTab('accounts')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {topRiskAccounts.map((acc) => (
                <div
                  key={acc.accountId}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono font-bold text-slate-200">
                        {acc.accountId}
                      </div>
                      <div className="text-xs text-white font-semibold mt-0.5">
                        {acc.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getRiskBadge(acc.riskLevel)}`}>
                        {acc.riskScore}
                      </span>
                      <div className="text-[10px] font-semibold text-slate-400 mt-1 uppercase">
                        {acc.recommendedAction || (acc.riskScore >= 70 ? 'Block' : 'Monitor')}
                      </div>
                    </div>
                  </div>

                  {acc.riskReasons && acc.riskReasons.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 line-clamp-1">
                      {acc.riskReasons[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 text-center">
            <button
              onClick={() => onSelectTab('rings')}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              Analyze Fraud Ring Connections &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
