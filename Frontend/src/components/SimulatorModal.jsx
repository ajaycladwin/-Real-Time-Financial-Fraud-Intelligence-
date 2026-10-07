import React, { useState } from 'react';
import { X, Play, RefreshCw, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { createTransaction } from '../services/api';

export default function SimulatorModal({ onClose, onTransactionCreated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  const [formData, setFormData] = useState({
    transactionId: `TXN${Math.floor(1000 + Math.random() * 9000)}`,
    accountId: 'ACC002',
    amount: '48800',
    merchantId: 'MER_DIGITAL_GOLD_88',
    deviceId: 'DEV_SHARED_KORAMANGALA_09',
    location: 'Bangalore - Koramangala',
    paymentChannel: 'UPI',
    items: 'Digital Gold Asset 5g, Express Processing Voucher'
  });

  const loadPreset = (type) => {
    if (type === 'syndicate') {
      setFormData({
        transactionId: `TXN${Math.floor(1000 + Math.random() * 9000)}`,
        accountId: 'ACC005',
        amount: '49300',
        merchantId: 'MER_DIGITAL_GOLD_88',
        deviceId: 'DEV_SHARED_KORAMANGALA_09',
        location: 'Bangalore - Koramangala',
        paymentChannel: 'UPI',
        items: 'Digital Gold Asset 5g, Rapid Transfer Token'
      });
    } else {
      setFormData({
        transactionId: `TXN${Math.floor(1000 + Math.random() * 9000)}`,
        accountId: 'ACC001',
        amount: '420',
        merchantId: 'MER_COFFEE_HOUSE',
        deviceId: 'DEV_ARUN_MOBILE',
        location: 'Coimbatore',
        paymentChannel: 'UPI',
        items: 'Cappuccino, Blueberry Muffin'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        items: formData.items
          .split(',')
          .map((i) => i.trim())
          .filter(Boolean)
      };

      const result = await createTransaction(payload);
      setSuccessResult(result);
      if (onTransactionCreated) {
        onTransactionCreated(result);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Live Transaction Simulation Studio
            </h3>
            <p className="text-xs text-slate-400">
              Submit raw incoming transactions and observe real-time AI fraud classification.
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="my-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Quick Test Presets:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => loadPreset('normal')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
            >
              Normal (₹420)
            </button>
            <button
              type="button"
              onClick={() => loadPreset('syndicate')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
            >
              Syndicate Attack (₹49k)
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successResult && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>
                Transaction <strong className="font-mono">{successResult.transactionId}</strong> submitted and analyzed!
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-xs font-bold underline hover:text-white"
            >
              View in Feed
            </button>
          </div>
        )}

        {/* Simulation Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Transaction ID
              </label>
              <input
                type="text"
                required
                value={formData.transactionId}
                onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Account ID
              </label>
              <select
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              >
                <option value="ACC001">ACC001 - Arun Kumar (Normal)</option>
                <option value="ACC002">ACC002 - Rahul Kumar (Ring)</option>
                <option value="ACC003">ACC003 - Karthik Raj (Normal)</option>
                <option value="ACC004">ACC004 - Daniel Joseph (Ring)</option>
                <option value="ACC005">ACC005 - Sanjay Kumar (Ring)</option>
                <option value="ACC006">ACC006 - Priya Thomas (Normal)</option>
                <option value="ACC007">ACC007 - Maria Joseph (Ring)</option>
                <option value="ACC008">ACC008 - Kevin Raj (Normal)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Payment Channel
              </label>
              <select
                value={formData.paymentChannel}
                onChange={(e) => setFormData({ ...formData, paymentChannel: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="UPI">UPI</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Device Fingerprint ID
              </label>
              <input
                type="text"
                required
                value={formData.deviceId}
                onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Merchant / Store ID
              </label>
              <input
                type="text"
                required
                value={formData.merchantId}
                onChange={(e) => setFormData({ ...formData, merchantId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Geographic Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Purchased Items (comma separated)
            </label>
            <input
              type="text"
              value={formData.items}
              onChange={(e) => setFormData({ ...formData, items: e.target.value })}
              placeholder="e.g. Digital Gold Asset 5g, Gift Voucher"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-950 transition-all hover:scale-105 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              {loading ? 'Submitting & Evaluating...' : 'Dispatch & Analyze'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
