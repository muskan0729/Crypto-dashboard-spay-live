// TransactionStatusPie.jsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Default color palette
const DEFAULT_COLORS = [
  "#E5C3A6", // soft warm beige
  "#22C55E", // emerald green
  "#FACC15", // rich yellow
  "#16A34A", // deep green
  "#EF4444", // strong red
  "#D1D5DB", // neutral gray
  "#4ADE80", // light green
  "#DC2626", // deep red
  "#9CA3AF", // darker neutral gray
];


export default function TransactionStatusPie({
  statusCounts = {},
  height = 260,
}) {
  const data = Object.entries(statusCounts).map(([key, value], idx) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: Number(value) || 0,
    key,
    color: DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
  }));

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl p-6 overflow-hidden">
      {/* Ambient Glow */}
      <div  />

      <div className="relative">
        {/* Header */}
        <h3 className="text-sm font-medium text-[#ffd700] mb-1">
          Transactions
        </h3>
        <p className="text-xs text-white/70 mb-4">
          Status overview • Total:{" "}
          <span className="font-semibold text-white">{total}</span>
        </p>

        {/* Chart */}
        <div className="w-full" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                isAnimationActive
              >
                {data.map((entry, idx) => (
                  <Cell
                    key={`cell-${entry.key}-${idx}`}
                    fill={entry.color}
                    stroke="#000"
                    strokeWidth={1}
                  />
                ))}
              </Pie>

              {/* Tooltip (library requires inline styles) */}
              <Tooltip
                contentStyle={{
                  background: "#000",
                  border: "1px solid rgba(255,215,0,0.4)",
                  borderRadius: "8px",
                  color: "#ffd700",
                  boxShadow: "0 4px 18px rgba(255,215,0,0.15)",
                  padding: "8px 10px",
                }}
                itemStyle={{ color: "#ffd700" }}
                labelStyle={{ color: "#facc15" }}
                formatter={(value, name) => [value, name]}
              />

              {/* Legend */}
              <Legend
                formatter={(value, entry) => (
                  <span
                    className="font-medium"
                    style={{ color: entry?.color || "#ffd700" }}
                  >
                    {value}
                  </span>
                )}
                payload={data.map((item) => ({
                  id: item.name,
                  type: "square",
                  value: item.name,
                  key: item.key,
                  color: item.color,
                }))}
                wrapperStyle={{
                  paddingTop: "16px",
                  borderTop: "1px solid rgba(255,215,0,0.2)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
