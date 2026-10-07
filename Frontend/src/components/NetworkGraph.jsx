import React, { useState, useMemo } from 'react';
import { ShieldAlert, Cpu, Store, MapPin, User, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function NetworkGraph({ fraudRings = [], transactions = [], accounts = [] }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterRingOnly, setFilterRingOnly] = useState(true);

  // Compute graph nodes and links based on fraud ring and transaction evidence
  const graphData = useMemo(() => {
    const nodes = new Map();
    const links = [];

    // Identify all accounts in fraud rings
    const ringAccountSet = new Set();
    fraudRings.forEach(ring => {
      ring.accountIds.forEach(id => ringAccountSet.add(id));
    });

    // 1. Add account nodes
    accounts.forEach(acc => {
      const isRingMember = ringAccountSet.has(acc.accountId);
      if (filterRingOnly && !isRingMember) return;

      nodes.set(acc.accountId, {
        id: acc.accountId,
        label: acc.name || acc.accountId,
        type: 'account',
        riskLevel: acc.riskLevel,
        riskScore: acc.riskScore,
        isRingMember
      });
    });

    // 2. Add device, merchant, location nodes and links from transactions
    transactions.forEach(txn => {
      const isRingAccount = ringAccountSet.has(txn.accountId);
      if (filterRingOnly && !isRingAccount) return;

      // Ensure account node exists
      if (!nodes.has(txn.accountId)) {
        nodes.set(txn.accountId, {
          id: txn.accountId,
          label: txn.accountId,
          type: 'account',
          riskLevel: txn.riskLevel,
          riskScore: txn.riskScore,
          isRingMember: isRingAccount
        });
      }

      // Device Node
      if (txn.deviceId) {
        if (!nodes.has(txn.deviceId)) {
          nodes.set(txn.deviceId, {
            id: txn.deviceId,
            label: txn.deviceId,
            type: 'device',
            isShared: true
          });
        }
        links.push({
          source: txn.accountId,
          target: txn.deviceId,
          type: 'uses_device',
          amount: txn.amount,
          riskScore: txn.riskScore
        });
      }

      // Merchant Node
      if (txn.merchantId) {
        if (!nodes.has(txn.merchantId)) {
          nodes.set(txn.merchantId, {
            id: txn.merchantId,
            label: txn.merchantId,
            type: 'merchant'
          });
        }
        links.push({
          source: txn.accountId,
          target: txn.merchantId,
          type: 'transacts_at',
          amount: txn.amount,
          riskScore: txn.riskScore
        });
      }
    });

    // Deduplicate links
    const uniqueLinks = [];
    const linkSet = new Set();
    links.forEach(l => {
      const key = `${l.source}->${l.target}`;
      if (!linkSet.has(key)) {
        linkSet.add(key);
        uniqueLinks.push(l);
      }
    });

    // Calculate layout positions using a radial/bipartite ring layout
    const nodeList = Array.from(nodes.values());
    const width = 840;
    const height = 480;
    const centerX = width / 2;
    const centerY = height / 2;

    const accountNodes = nodeList.filter(n => n.type === 'account');
    const deviceNodes = nodeList.filter(n => n.type === 'device');
    const merchantNodes = nodeList.filter(n => n.type === 'merchant');

    accountNodes.forEach((node, i) => {
      const angle = (i / Math.max(accountNodes.length, 1)) * 2 * Math.PI - Math.PI / 2;
      node.x = centerX + Math.cos(angle) * 250;
      node.y = centerY + Math.sin(angle) * 170;
    });

    deviceNodes.forEach((node, i) => {
      const angle = (i / Math.max(deviceNodes.length, 1)) * 2 * Math.PI;
      node.x = centerX + Math.cos(angle) * 90 - 40;
      node.y = centerY + Math.sin(angle) * 70;
    });

    merchantNodes.forEach((node, i) => {
      const angle = (i / Math.max(merchantNodes.length, 1)) * 2 * Math.PI + Math.PI / 3;
      node.x = centerX + Math.cos(angle) * 110 + 40;
      node.y = centerY + Math.sin(angle) * 80;
    });

    return { nodes: nodeList, links: uniqueLinks, nodeMap: nodes };
  }, [fraudRings, transactions, accounts, filterRingOnly]);

  const getNodeColor = (node) => {
    if (node.type === 'account') {
      return node.isRingMember ? '#ef4444' : '#10b981';
    }
    if (node.type === 'device') return '#8b5cf6';
    if (node.type === 'merchant') return '#f59e0b';
    return '#3b82f6';
  };

  const selectedNodeDetails = useMemo(() => {
    if (!selectedNode) return null;
    const node = graphData.nodeMap.get(selectedNode);
    if (!node) return null;

    // Find connected links
    const connections = graphData.links.filter(
      l => l.source === selectedNode || l.target === selectedNode
    );

    return { node, connections };
  }, [selectedNode, graphData]);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Graph-Based Coordinated Fraud Ring Visualization
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Revealing covert multi-account syndicates connected through shared hardware, high-liquidity merchants, and synchronized transaction vectors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterRingOnly(!filterRingOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              filterRingOnly
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30 shadow-lg shadow-rose-950/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {filterRingOnly ? 'Showing: Ring Entities Only' : 'Showing: All Graph Nodes'}
          </button>
          {selectedNode && (
            <button
              onClick={() => setSelectedNode(null)}
              className="text-xs px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"
            >
              Reset Selection
            </button>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-5 text-xs text-slate-400 mb-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
        <span className="font-semibold text-slate-300">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-500/20" />
          <span>Fraud Ring Account (Critical)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
          <span>Normal Account</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-purple-500 ring-2 ring-purple-500/20" />
          <span>Shared Hardware Device</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-500 ring-2 ring-amber-500/20" />
          <span>Target Merchant / Store</span>
        </div>
      </div>

      {/* Graph Area */}
      <div className="relative bg-slate-950/80 rounded-xl border border-slate-800/60 overflow-hidden flex justify-center items-center">
        <svg
          viewBox="0 0 840 480"
          className="w-full h-[480px] select-none"
        >
          {/* Background grid dots */}
          <defs>
            <pattern id="grid-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#334155" opacity="0.3" />
            </pattern>
            <linearGradient id="link-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <rect width="840" height="480" fill="url(#grid-dots)" />

          {/* Render Links */}
          {graphData.links.map((link, idx) => {
            const sourceNode = graphData.nodeMap.get(link.source);
            const targetNode = graphData.nodeMap.get(link.target);
            if (!sourceNode || !targetNode) return null;

            const isHighlighted =
              selectedNode === link.source || selectedNode === link.target;

            return (
              <g key={`link-${idx}`}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={isHighlighted ? '#f43f5e' : link.type === 'uses_device' ? '#8b5cf6' : '#d97706'}
                  strokeWidth={isHighlighted ? 2.5 : 1.2}
                  strokeDasharray={link.type === 'uses_device' ? 'none' : '4 3'}
                  strokeOpacity={isHighlighted ? 0.9 : 0.4}
                />
              </g>
            );
          })}

          {/* Render Nodes */}
          {graphData.nodes.map(node => {
            const isSelected = selectedNode === node.id;
            const color = getNodeColor(node);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedNode(node.id)}
                className="cursor-pointer group"
              >
                {/* Glow ring on hover/selected */}
                <circle
                  r={isSelected ? 26 : 18}
                  fill={color}
                  fillOpacity={isSelected ? 0.25 : 0.12}
                  stroke={color}
                  strokeWidth={isSelected ? 2 : 1}
                  className="transition-all duration-300 group-hover:scale-125"
                />

                {/* Core Node Circle */}
                <circle
                  r={node.type === 'account' ? 14 : 11}
                  fill={color}
                  stroke="#0f172a"
                  strokeWidth={2}
                  className="transition-transform group-hover:scale-110"
                />

                {/* Node Icon indicator */}
                <text
                  textAnchor="middle"
                  dy=".3em"
                  fontSize={node.type === 'account' ? '9' : '8'}
                  fontWeight="bold"
                  fill="#ffffff"
                  className="pointer-events-none select-none"
                >
                  {node.type === 'account' ? 'A' : node.type === 'device' ? 'D' : 'M'}
                </text>

                {/* Node Label */}
                <text
                  y={node.type === 'account' ? 26 : 22}
                  textAnchor="middle"
                  fontSize="10"
                  fill={isSelected ? '#ffffff' : '#94a3b8'}
                  fontWeight={isSelected ? '600' : '400'}
                  className="pointer-events-none select-none transition-colors"
                >
                  {node.label.length > 18 ? `${node.label.substring(0, 16)}...` : node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Floating Overlay */}
        {selectedNodeDetails && (
          <div className="absolute bottom-4 right-4 max-w-sm w-full bg-slate-900/95 border border-slate-700/80 rounded-xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {selectedNodeDetails.node.type === 'account' ? (
                  <User className="w-4 h-4 text-rose-400" />
                ) : selectedNodeDetails.node.type === 'device' ? (
                  <Cpu className="w-4 h-4 text-purple-400" />
                ) : (
                  <Store className="w-4 h-4 text-amber-400" />
                )}
                <span className="font-semibold text-white text-sm">
                  {selectedNodeDetails.node.label}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  selectedNodeDetails.node.isRingMember
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {selectedNodeDetails.node.type}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              {selectedNodeDetails.node.riskScore !== undefined && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Score:</span>
                  <span className={`font-bold ${selectedNodeDetails.node.riskScore >= 70 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {selectedNodeDetails.node.riskScore}/100 ({selectedNodeDetails.node.riskLevel})
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Graph Connections:</span>
                <span className="font-mono text-slate-200">{selectedNodeDetails.connections.length} edges</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/80">
              <div className="text-[11px] font-medium text-slate-400 mb-1">Active Edges:</div>
              <div className="max-h-24 overflow-y-auto space-y-1">
                {selectedNodeDetails.connections.map((c, i) => (
                  <div key={i} className="text-[11px] font-mono text-slate-400 bg-slate-950/60 p-1 rounded flex justify-between">
                    <span>{c.type === 'uses_device' ? 'Device link' : 'Merchant txn'}</span>
                    <span className="text-slate-200 truncate max-w-[120px]">
                      {c.source === selectedNode ? c.target : c.source}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
