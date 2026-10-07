import React from 'react';
import { X, ShieldAlert, Cpu, Store, MapPin, CreditCard, ShoppingBag, Clock, CheckCircle } from 'lucide-react';

export default function TransactionDetailModal({ transaction, onClose }) {
  if (!transaction) return null;

  const getRiskBadge = (level) => {
    switch (level) {
      case 'Critical':
        return 'bg-rose-950/90 text-rose-300 border-rose-500/50';
      case 'High':
        return 'bg-amber-950/90 text-amber-300 border-amber-500/50';
      case 'Medium':
        return 'bg-sky-950/90 text-sky-300 border-sky-500/50';
      default:
        return 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50';
    }
  };

  const getActionBadge = (action) => {
    switch (action) {
      case 'Block':
        return 'bg-rose-500 text-white shadow-lg shadow-rose-950';
      case 'Review':
        return 'bg-amber-500 text-white shadow-lg shadow-amber-950';
      case 'Monitor':
        return 'bg-blue-600 text-white shadow-lg shadow-blue-950';
      default:
        return 'bg-emerald-600 text-white shadow-lg shadow-emerald-950';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 pb-5 border-b border-slate-800">
          <div className="p-3 rounded-2xl bg-slate-800 text-rose-400 border border-slate-700">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-white">
                {transaction.transactionId}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase border ${getRiskBadge(transaction.riskLevel)}`}>
                {transaction.riskLevel} Risk
              </span>
            </div>
            <div className="text-2xl font-black text-white mt-1">
              ₹{transaction.amount?.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{new Date(transaction.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Risk Banner & Action Recommendation */}
        <div className="my-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Calculated Risk Score</div>
            <div className="text-3xl font-black font-mono text-white flex items-baseline gap-1 mt-0.5">
              <span className={transaction.riskScore >= 70 ? 'text-rose-400' : 'text-emerald-400'}>
                {transaction.riskScore}
              </span>
              <span className="text-xs text-slate-500">/ 100</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400 mb-1">Recommended Action</div>
            <span className={`inline-block px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${getActionBadge(transaction.recommendedAction)}`}>
              {transaction.recommendedAction}
            </span>
          </div>
        </div>

        {/* Explainable AI Evidence Breakdown (Requirement 5) */}
        <div className="space-y-2 mb-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Explainable Risk Signals & Reasons:
          </h4>
          <div className="space-y-2">
            {transaction.riskReasons && transaction.riskReasons.length > 0 ? (
              transaction.riskReasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 flex items-start gap-2.5"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400 mt-1 flex-shrink-0" />
                  <span className="font-medium">{reason}</span>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>No anomalous risk vectors detected. Transaction aligns with normal baseline behavior.</span>
              </div>
            )}
          </div>
        </div>

        {/* Forensic Metadata Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Transaction Forensic Metadata:
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-500 mb-1">Account ID</div>
              <div className="font-mono font-semibold text-slate-200">{transaction.accountId}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-500 mb-1">Payment Channel</div>
              <div className="font-semibold text-slate-200">{transaction.paymentChannel || 'UPI'}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-500 mb-1">Device Fingerprint</div>
              <div className="font-mono font-semibold text-purple-300 truncate">{transaction.deviceId || 'N/A'}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-500 mb-1">Merchant Store</div>
              <div className="font-mono font-semibold text-amber-300 truncate">{transaction.merchantId || 'N/A'}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 col-span-2">
              <div className="text-slate-500 mb-1">Location</div>
              <div className="font-semibold text-slate-200">{transaction.location || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Purchased Items List */}
        {transaction.items && transaction.items.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-500 mb-2">Purchased Items / Assets:</div>
            <div className="flex flex-wrap gap-2">
              {transaction.items.map((item, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-slate-300 border border-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
