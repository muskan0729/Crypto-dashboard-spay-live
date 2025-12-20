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

// GOLD PALETTE — renamed to avoid collisions
const COLOR_MAP = {
  success: "#F5C542", // soft gold
  failed: "#C0841D",  // darker bronze
  pending: "#E5E7EB", // light gold
};

// const COLOR_MAP = {
//   success: "#16A34A", // green (tailwind green-600 style)
//   failed: "#DC2626",  // red (tailwind red-600)
//   pending: "#FACC15", // yellow (tailwind yellow-400)
// };

// const COLOR_MAP = {
//   success: "#22c55e", // bright green
//   failed: "#ef4444",  // bright red
//   pending: "#eab308", // bright yellow
// };

export default function TransactionStatusPie({
  success ,
  failed ,
  pending,
  height = 260,
}) {
  const data = [
    { name: "Success", value: success, key: "success" },
    { name: "Failed", value: failed, key: "failed" },
    { name: "Pending", value: pending, key: "pending" },
  ];

  const total = data.reduce((s, d) => s + (Number(d.value) || 0), 0);

  return (
    <div className="bg-black text-[#CDA434] p-6 rounded-2xl shadow-[0_0_20px_rgba(205,164,52,0.3)]">
      <h3 className="text-lg mb-2 font-semibold">Transactions</h3>
      <p className="text-sm text-[#F0C75E] mb-4">Status overview • Total: {total}</p>

      <div style={{ width: "100%", height }}>
        {/* ResponsiveContainer width/height set to fill parent */}
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
              {data.map((entry, idx) => {
                const color = COLOR_MAP[entry.key] || "#777";
                return (
                  <Cell
                    key={`cell-${entry.key}-${idx}`}
                    fill={color}
                    stroke="#000"   // subtle stroke for luxury look
                    strokeWidth={1}
                  />
                );
              })}
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
              // defensive formatter: entry.payload might be undefined in some recharts versions
              formatter={(value, entry) => {
                const key = entry && entry.payload && entry.payload.key;
                const color = (key && COLOR_MAP[key]) || entry?.color || "#CDA434";
                return (
                  <span style={{ color, fontWeight: 600 }}>
                    {value}
                  </span>
                );
              }}
              payload={data.map((item) => ({
                id: item.name,
                type: "square",
                value: item.name,
                key: item.key,
                color: COLOR_MAP[item.key] || "#CDA434",
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
