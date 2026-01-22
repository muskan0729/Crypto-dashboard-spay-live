import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Customized,
} from "recharts";

// Neon cyberpunk-inspired palette
const STATUS_COLORS = {
  success:   "#00ff9d",     // neon green / mint
  pending:   "#ffd700",     // neon gold / yellow
  initiated: "#00d4ff",     // bright cyan
  failed:    "#ff3366",     // neon pink / red
  cancelled: "#bb86fc",     // neon purple
  // fallback / unknown
  default:   "#00eaff",     // electric cyan
};

export default function TransactionStatusPie({
  statusCounts = {},
  height = 280,
}) {
  const [flipped, setFlipped] = useState(false);

  const data = useMemo(() => {
    return Object.entries(statusCounts).map(([key, value]) => {
      const lowerKey = key.toLowerCase();

      // Choose color based on status name
      let color = STATUS_COLORS.default;
      if (lowerKey.includes("success"))   color = STATUS_COLORS.success;
      else if (lowerKey.includes("pending")) color = STATUS_COLORS.pending;
      else if (lowerKey.includes("initi"))   color = STATUS_COLORS.initiated;
      else if (lowerKey.includes("fail") || lowerKey.includes("error")) 
        color = STATUS_COLORS.failed;
      else if (lowerKey.includes("cancel")) color = STATUS_COLORS.cancelled;

      return {
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: Number(value) || 0,
        key,
        color,
      };
    });
  }, [statusCounts]);

  const total = useMemo(
    () => data.reduce((sum, d) => sum + d.value, 0),
    [data]
  );

  const handleFlipClick = () => setFlipped(!flipped);
  const handlePieClick = () => setFlipped(true);

  if (data.length === 0) {
    return (
      <div
        className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl p-4 flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <p className="text-sm text-white/60">No transaction data available</p>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // Totals / List view
  // ──────────────────────────────────────────────
  if (flipped) {
    return (
      <div
        className="relative rounded-2xl bg-black/60 backdrop-blur-xl border border-cyan-900/40 shadow-2xl p-4 overflow-y-auto"
        style={{ height: `${height}px` }}
      >
        <div className="flex items-center justify-between rounded-2 p-4 sticky top-0 bg-[#0c1014] py-2 z-10 border-b border-cyan-900/30">
          <h3 className="text-sm font-semibold text-cyan-300 tracking-wide">
            Transaction Status
          </h3>
          <button
            onClick={handleFlipClick}
            className="text-xs px-3 py-1.5 rounded bg-cyan-900/40 border border-cyan-700/50 text-cyan-300 hover:bg-cyan-800/60 transition-colors"
          >
            ← Back
          </button>
        </div>

        <p className="text-xs text-cyan-400/80 mb-4">
          Total transactions: <span className="text-white font-medium">{total}</span>
        </p>

        <div className="space-y-3">
          {data.map((entry) => (
            <div
              key={entry.key}
              className="flex items-center justify-between px-4 py-3 bg-black/40 rounded-lg border border-gray-800/60"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full shadow-md shadow-black/60"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium text-white capitalize">
                  {entry.name}
                </span>
              </div>
              <span className="text-sm font-bold text-cyan-200">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // Pie chart view
  // ──────────────────────────────────────────────
  return (
    <div
      className="relative rounded-2xl bg-black/50 backdrop-blur-xl border border-cyan-950/50 shadow-2xl p-4 flex flex-col"
      style={{ height: `${height}px` }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-xs text-cyan-400/80">
          Total: <span className="text-white font-medium">{total}</span>
        </p>
        <button
          onClick={handleFlipClick}
          className="px-3.5 py-1.5 text-xs font-medium rounded bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 hover:bg-cyan-900/60 transition-colors"
        >
          View Details
        </button>
      </div>

      {/* Chart area */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="52%"
              outerRadius="92%"
              paddingAngle={2}
              isAnimationActive
            >
              {data.map((entry, idx) => (
                <Cell
                  key={`cell-${entry.key}-${idx}`}
                  fill={entry.color}
                  stroke="rgba(0,0,0,0.6)"
                  strokeWidth={0.8}
                  onClick={handlePieClick}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </Pie>

            {/* Center circle with neon glow */}
            <Customized
              component={({ width, height }) => {
                const cx = width / 2;
                const cy = height / 2;
                const r = Math.min(width, height) * 0.24;

                return (
                  <g>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill="rgba(0, 212, 255, 0.12)"
                      stroke="#00d4ff"
                      strokeWidth={1.2}
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r * 0.65}
                      fill="rgba(0, 0, 0, 0.4)"
                    />
                  </g>
                );
              }}
            />

            <Tooltip
              contentStyle={{
                background: "rgba(0,0,0,0.92)",
                border: "1px solid #00d4ff30",
                borderRadius: "8px",
                color: "#e0f7ff",
                boxShadow: "0 4px 20px rgba(0,212,255,0.18)",
                padding: "8px 12px",
                fontSize: "13px",
              }}
              itemStyle={{ color: "#00ff9d" }}
              labelStyle={{ color: "#00eaff", fontWeight: 600 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}