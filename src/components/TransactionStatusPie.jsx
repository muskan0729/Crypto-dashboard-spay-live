// TransactionStatusPie.jsx
import React from "react";
import {  PieChart,  Pie,  Cell,  Tooltip,  Legend,  ResponsiveContainer } from "recharts";

// Default color palette, can be extended dynamically
const DEFAULT_COLORS = [
  "#F5C542", // success / gold
  "#eed233ff", // failed / bronze
  "#eab308ff", // pending / light gold
  "#16A34A", // extra
  "#DC2626",
  "#FACC15",
  "#22c55e",
  "#ef4444",
  "#eab308",
];

// // GOLD PALETTE — renamed to avoid collisions
// const COLOR_MAP = {
//   success: "#F5C542", // soft gold
//   failed: "#C0841D",  // darker bronze
//   pending: "#eab308", // light gold
// };

export default function TransactionStatusPie(
  { statusCounts = {}, height = 260 }
) {
  // Convert the object into an array
  const data = Object.entries(statusCounts).map(([key, value], idx) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1), // capitalize
    value: Number(value) || 0,
    key,
    color: DEFAULT_COLORS[idx % DEFAULT_COLORS.length], // cycle colors if many keys
  }));
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-black text-[#CDA434] p-6 rounded-2xl shadow-[0_0_20px_rgba(205,164,52,0.3)]">
      <h3 className="text-lg mb-2 font-semibold">Transactions</h3>
      <p className="text-sm text-[#F0C75E] mb-4">Status overview • Total: {total}</p>

      <div style={{ width: "100%", height }}>
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
              isAnimationActive={true}
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

            <Tooltip
              contentStyle={{
                background: "#000",
                border: "1px solid #CDA434",
                borderRadius: "8px",
                color: "#CDA434",
                boxShadow: "0 4px 18px rgba(205,164,52,0.15)",
                padding: "8px 10px",
              }}
              itemStyle={{ color: "#CDA434" }}
              labelStyle={{ color: "#F0C75E" }}
              formatter={(value, name) => [value, name]}
            />

            <Legend
              formatter={(value, entry) => {
                const color = entry?.color || "#CDA434";
                return <span style={{ color, fontWeight: 600 }}>{value}</span>;
              }}
              payload={data.map((item) => ({
                id: item.name,
                type: "square",
                value: item.name,
                key: item.key,
                color: item.color,
              }))}
              wrapperStyle={{
                paddingTop: "18px",
                borderTop: "1px solid rgba(205,164,52,0.18)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
