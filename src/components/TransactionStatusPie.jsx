import React, { useMemo } from "react";
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
  "#E5C3A6",
  "#22C55E",
  "#FACC15",
  "#16A34A",
  "#EF4444",
  "#D1D5DB",
  "#4ADE80",
  "#DC2626",
  "#9CA3AF",
];

export default function TransactionStatusPie({
  statusCounts = {},
  height = 360,
}) {
  const data = useMemo(
    () =>
      Object.entries(statusCounts).map(([key, value], idx) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: Number(value) || 0,
        key,
        color: DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
      })),
    [statusCounts]
  );

  const total = useMemo(
    () => data.reduce((sum, d) => sum + d.value, 0),
    [data]
  );

  return (
    <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl p-4 sm:p-6">
      {/* Header */}
      <h3 className="text-xs sm:text-sm font-medium text-[#ffd700] mb-1">
        Transactions
      </h3>
      <p className="text-[11px] sm:text-xs text-white/70 mb-4">
        Status overview • Total:{" "}
        <span className="font-semibold text-white">{total}</span>
      </p>

      {/* Chart wrapper MUST have height */}
      <div
        className="w-full"
        style={{ height: `${height}px` }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              innerRadius="60%"
              outerRadius="90%"
              paddingAngle={4}
              isAnimationActive
            >
              {data.map((entry, idx) => (
                <Cell
                  key={`cell-${entry.key}-${idx}`}
                  fill={entry.color}
                  stroke="#000"
                  strokeWidth={0.5}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                background: "#000",
                border: "1px solid rgba(255,215,0,0.4)",
                borderRadius: "8px",
                color: "#ffd700",
                boxShadow: "0 4px 18px rgba(255,215,0,0.15)",
                padding: "6px 8px",
                fontSize: "12px",
              }}
              itemStyle={{ color: "#ffd700" }}
              labelStyle={{ color: "#facc15" }}
            />

            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="square"
              wrapperStyle={{
                fontSize: "12px",
                paddingTop: 12,
                lineHeight: "18px",
                borderTop: "1px solid rgba(255,215,0,0.2)",
              }}
              formatter={(value, entry) => (
                <span
                  className="font-medium"
                  style={{ color: entry?.color }}
                >
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
