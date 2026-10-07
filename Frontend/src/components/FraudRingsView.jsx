import React from 'react';
import { Network, ShieldAlert, Cpu, Store, MapPin, CheckCircle, AlertOctagon } from 'lucide-react';
import NetworkGraph from './NetworkGraph';

export default function FraudRingsView({
  fraudRings = [],
  transactions = [],
  accounts = [],
  onSelectAccount
}) {
  return (
    <div className="space-y-6">
      {/* Visual Network Graph */}
      <NetworkGraph
        fraudRings={fraudRings}
        transactions={transactions}
        accounts={accounts}
      />

      {/* Fraud Rings Detail Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-rose-500" />
            Detected Fraud Ring Profiles ({fraudRings.length})
          </h3>
          <span className="text-xs text-slate-400">
            Graph ML & Pattern Analytics Output
          </span>
        </div>

        {fraudRings.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-slate-400 border border-slate-800">
            No coordinated fraud rings detected in current dataset.
          </div>
        ) : (
          fraudRings.map((ring) => (
            <div
              key={ring.ringId}
              className="glass-panel-glow rounded-2xl p-6 border border-rose-500/30 space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    <AlertOctagon className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-500 text-white">
                        {ring.ringId}
                      </span>
                      <h4 className="text-lg font-bold text-white">
                        {ring.name}
                      </h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wide">
                        {ring.riskLevel} Risk
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                      <strong className="text-slate-100">Pattern:</strong> {ring.pattern}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800">
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">Risk Confidence</div>
                    <div className="text-xl font-black text-rose-400 font-mono">
                      {ring.riskScore}/100
                    </div>
                  </div>
                  <div className="h-8 w-px bg-slate-800" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">Mandated Action</div>
                    <span className="inline-block mt-0.5 text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-rose-500 text-white shadow-md shadow-rose-950">
                      {ring.recommendedAction}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid of Attributes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Accounts */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
                    <span>Involved Accounts</span>
                    <span className="text-rose-400 font-mono text-[10px]">{ring.accountIds.length} Nodes</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ring.accountIds.map((accId) => (
                      <button
                        key={accId}
                        onClick={() => onSelectAccount && onSelectAccount(accId)}
                        className="px-2 py-1 rounded text-xs font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors"
                      >
                        {accId}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shared Devices */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    <span>Shared Hardware</span>
                  </div>
                  <div className="space-y-1">
                    {ring.sharedDevices.map((d, i) => (
                      <div key={i} className="text-xs font-mono text-purple-300 bg-purple-950/30 px-2 py-1 rounded border border-purple-900/30 truncate">
                        {d}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target Merchants */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-amber-400" />
                    <span>Target Merchants</span>
                  </div>
                  <div className="space-y-1">
                    {ring.sharedMerchants.map((m, i) => (
                      <div key={i} className="text-xs font-mono text-amber-300 bg-amber-950/30 px-2 py-1 rounded border border-amber-900/30 truncate">
                        {m}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shared Locations */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>Geographic Hubs</span>
                  </div>
                  <div className="space-y-1">
                    {ring.locations.map((loc, i) => (
                      <div key={i} className="text-xs text-blue-300 bg-blue-950/30 px-2 py-1 rounded border border-blue-900/30 truncate">
                        {loc}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Forensic Evidence & Explanations */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-semibold text-slate-300 mb-2">
                  Forensic Evidence & Graph Corroboration:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {ring.evidence.map((ev, i) => (
                    <div
                      key={i}
                      className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
