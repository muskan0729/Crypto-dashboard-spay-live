import React, { useState } from "react";
import Chart from "react-apexcharts";

const TransactionsChart = ({ chartData }) => {
  const [toggle, setToggle] = useState("Total");

  if (!chartData) return null;

  const toPoints = (arr) => (arr || []).map((y, i) => ({ x: i + 1, y }));

  const payInAmount = toPoints(chartData?.[toggle]?.PayIn?.amount);
  const payOutAmount = toPoints(chartData?.[toggle]?.PayOut?.amount);
  const payInCount = toPoints(chartData?.[toggle]?.PayIn?.count);
  const payOutCount = toPoints(chartData?.[toggle]?.PayOut?.count);

  const series = [
    { name: "PayIn Amount", type: "area", data: payInAmount },
    { name: "PayOut Amount", type: "area", data: payOutAmount },
    { name: "PayIn Count", type: "line", data: payInCount, yAxisIndex: 1 },
    { name: "PayOut Count", type: "line", data: payOutCount, yAxisIndex: 1 },
  ];

  const categories = Array.from(
    { length: Math.max(payInAmount.length, payOutAmount.length, payInCount.length, payOutCount.length, 1) },
    (_, i) => `Point ${i + 1}`
  );

  const options = {
    chart: {
      height: 350,
      type: "area",
      stacked: false,
      background: "transparent", // Transparent to show glassmorphism behind
      foreColor: "#00FFFF", // Neon cyan for labels
      toolbar: { show: false },
    },
    colors: ["#22c55e", "#38bdf8", "#0ff", "#06b6d4"],
    stroke: { width: [2, 2, 3, 3], curve: "smooth", dashArray: [0, 0, 4, 4] },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: ["#06b6d4", "#38bdf8"],
        opacityFrom: 0.4,
        opacityTo: 0.05,
      },
    },
    markers: { size: 5, strokeWidth: 2, strokeColors: "#0b0b0b", hover: { size: 7 } },
    xaxis: {
      type: "category",
      categories,
      axisBorder: { color: "#0ff" },
      axisTicks: { color: "#0ff" },
      labels: { style: { colors: "#0ff" } },
    },
    yaxis: [
      { title: { text: "Amount", style: { color: "#0ff" } }, min: 0, labels: { style: { colors: "#0ff" } } },
      { opposite: true, title: { text: "Count", style: { color: "#0ff" } }, min: 0, labels: { style: { colors: "#0ff" } } },
    ],
    grid: { borderColor: "#111", strokeDashArray: 4 },
    tooltip: { theme: "dark" },
    legend: { position: "top", labels: { colors: "#0ff" }, onItemClick: { toggleDataSeries: true } },
  };

  return (
    <div className="relative rounded-2xl bg-white/5 backdrop-blur-2xl border border-cyan-400/20 shadow-[0_0_80px_rgba(56,189,248,0.15)] p-6 overflow-hidden transition-transform duration-300 hover:scale-[1.01] hover:shadow-[0_0_120px_rgba(56,189,248,0.3)]">
      
      {/* Neon ambient glow */}
      
      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-sm font-semibold text-cyan-300 tracking-wider uppercase">
            Transactions Overview
          </h2>

          {/* Toggle */}
          <div className="flex rounded-lg overflow-hidden border border-white/10 bg-black/40">
            {["Total", "Today"].map((type) => (
              <button
                key={type}
                onClick={() => setToggle(type)}
                className={`px-4 py-1.5 text-xs font-medium transition-all duration-300
                  ${toggle === type
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                    : "text-cyan-300 hover:bg-white/10 hover:shadow-[0_0_10px_rgba(0,255,255,0.2)]"} rounded-lg`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <Chart options={options} series={series} type="line" height={350} />
      </div>
    </div>
  );
};

export default TransactionsChart;
