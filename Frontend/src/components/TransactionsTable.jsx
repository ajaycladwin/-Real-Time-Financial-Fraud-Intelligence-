import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ShieldAlert,
  ArrowUpDown,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function TransactionsTable({
  transactions = [],
  onSelectTransaction
}) {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('riskDesc'); // 'riskDesc', 'riskAsc', 'amountDesc', 'dateDesc'

  // Filter & sort
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.transactionId?.toLowerCase().includes(q) ||
          t.accountId?.toLowerCase().includes(q) ||
          t.merchantId?.toLowerCase().includes(q) ||
          t.deviceId?.toLowerCase().includes(q) ||
          t.location?.toLowerCase().includes(q) ||
          (Array.isArray(t.items) && t.items.some((i) => i.toLowerCase().includes(q)))
      );
    }

    // Risk level filter
    if (levelFilter !== 'ALL') {
      result = result.filter((t) => t.riskLevel?.toUpperCase() === levelFilter);
    }

    // Action filter
    if (actionFilter !== 'ALL') {
      result = result.filter((t) => t.recommendedAction?.toUpperCase() === actionFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'riskDesc') return b.riskScore - a.riskScore;
      if (sortBy === 'riskAsc') return a.riskScore - b.riskScore;
      if (sortBy === 'amountDesc') return b.amount - a.amount;
      if (sortBy === 'dateDesc') return new Date(b.timestamp) - new Date(a.timestamp);
      return 0;
    });

    return result;
  }, [transactions, search, levelFilter, actionFilter, sortBy]);

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

  const getActionBadge = (action) => {
    switch (action) {
      case 'Block':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40 font-bold';
      case 'Review':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold';
      case 'Monitor':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40 font-medium';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-medium';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Transaction-Level Risk Intelligence
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ranked multi-vector anomaly detection with full explainable risk reasons & action recommendations.
          </p>
        </div>

        {/* Controls Container */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search TXN, Account, Device..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical (80-100)</option>
            <option value="HIGH">High (60-79)</option>
            <option value="MEDIUM">Medium (30-59)</option>
            <option value="LOW">Low (0-29)</option>
          </select>

          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Actions</option>
            <option value="BLOCK">Block</option>
            <option value="REVIEW">Review</option>
            <option value="MONITOR">Monitor</option>
            <option value="ALLOW">Allow</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="riskDesc">Highest Risk First</option>
            <option value="riskAsc">Lowest Risk First</option>
            <option value="amountDesc">Highest Amount First</option>
            <option value="dateDesc">Newest First</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
              <th className="py-3 px-4 font-semibold">Transaction ID</th>
              <th className="py-3 px-4 font-semibold">Account</th>
              <th className="py-3 px-4 font-semibold">Amount</th>
              <th className="py-3 px-4 font-semibold">Risk Score</th>
              <th className="py-3 px-4 font-semibold">Risk Level</th>
              <th className="py-3 px-4 font-semibold">Action</th>
              <th className="py-3 px-4 font-semibold">Explainable Reasons</th>
              <th className="py-3 px-4 font-semibold text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-slate-400">
                  No transactions match the selected criteria.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr
                  key={t.transactionId}
                  onClick={() => onSelectTransaction(t)}
                  className="hover:bg-slate-900/80 cursor-pointer transition-colors group"
                >
                  {/* Transaction ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-200 group-hover:text-rose-400 transition-colors">
                    {t.transactionId}
                  </td>

                  {/* Account */}
                  <td className="py-3.5 px-4 font-mono text-slate-300 font-medium">
                    {t.accountId}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 font-semibold text-white">
                    ₹{t.amount?.toLocaleString('en-IN')}
                  </td>

                  {/* Risk Score */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-white">
                        {t.riskScore}
                      </span>
                      <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full ${
                            t.riskScore >= 80
                              ? 'bg-rose-500 shadow-sm shadow-rose-500'
                              : t.riskScore >= 60
                              ? 'bg-amber-500'
                              : t.riskScore >= 30
                              ? 'bg-sky-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${t.riskScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Risk Level Badge */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded text-[11px] font-bold border ${getRiskBadge(t.riskLevel)}`}>
                      {t.riskLevel}
                    </span>
                  </td>

                  {/* Action Badge */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] uppercase tracking-wider border ${getActionBadge(t.recommendedAction)}`}>
                      {t.recommendedAction}
                    </span>
                  </td>

                  {/* Explainable Reasons */}
                  <td className="py-3.5 px-4 max-w-xs">
                    {t.riskReasons && t.riskReasons.length > 0 ? (
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-200 font-medium truncate">
                          {t.riskReasons[0]}
                        </div>
                        {t.riskReasons.length > 1 && (
                          <div className="text-[10px] text-rose-400 font-semibold">
                            +{t.riskReasons.length - 1} more risk signal(s)
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Normal consumer baseline</span>
                    )}
                  </td>

                  {/* Inspect Details Button */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTransaction(t);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Inspect full explainable AI evidence"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
        <div>
          Showing <span className="font-semibold text-white">{filteredTransactions.length}</span> of{' '}
          <span className="font-semibold text-white">{transactions.length}</span> transactions
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Critical/High ({filteredTransactions.filter(t => t.riskScore >= 60).length})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Normal/Low ({filteredTransactions.filter(t => t.riskScore < 30).length})
          </span>
        </div>
      </div>
    </div>
  );
}
