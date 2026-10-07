import React, { useState, useMemo } from 'react';
import { Users, Search, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AccountsTable({ accounts = [] }) {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');

  const filteredAccounts = useMemo(() => {
    let result = [...accounts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.accountId?.toLowerCase().includes(q) ||
          a.name?.toLowerCase().includes(q) ||
          a.email?.toLowerCase().includes(q) ||
          a.phone?.toLowerCase().includes(q)
      );
    }

    if (levelFilter !== 'ALL') {
      result = result.filter((a) => a.riskLevel?.toUpperCase() === levelFilter);
    }

    // Default: Sort by Risk Score descending
    result.sort((a, b) => b.riskScore - a.riskScore);

    return result;
  }, [accounts, search, levelFilter]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Account Risk Profiling & Intelligence
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Accounts evaluated through collective transaction history, shared device syndicates, and behavioral synchronization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search account..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
              <th className="py-3 px-4 font-semibold">Account ID</th>
              <th className="py-3 px-4 font-semibold">Account Holder</th>
              <th className="py-3 px-4 font-semibold">Risk Score</th>
              <th className="py-3 px-4 font-semibold">Risk Level</th>
              <th className="py-3 px-4 font-semibold">Recommended Action</th>
              <th className="py-3 px-4 font-semibold">AI Explanations & Network Evidence</th>
              <th className="py-3 px-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {filteredAccounts.map((acc) => (
              <tr
                key={acc.accountId}
                className="hover:bg-slate-900/80 transition-colors"
              >
                <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                  {acc.accountId}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-white">{acc.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{acc.email}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-white">
                      {acc.riskScore}
                    </span>
                    <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full ${
                          acc.riskScore >= 70
                            ? 'bg-rose-500'
                            : acc.riskScore >= 40
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${acc.riskScore}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded text-[11px] font-bold border ${getRiskBadge(acc.riskLevel)}`}>
                    {acc.riskLevel}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded text-[10px] uppercase tracking-wider border ${getActionBadge(acc.recommendedAction || 'Allow')}`}>
                    {acc.recommendedAction || 'Allow'}
                  </span>
                </td>
                <td className="py-3.5 px-4 max-w-sm">
                  {acc.riskReasons && acc.riskReasons.length > 0 ? (
                    <ul className="space-y-1">
                      {acc.riskReasons.map((r, i) => (
                        <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-slate-500 text-[11px]">Normal behavioral profile</span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {acc.status || 'Active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
