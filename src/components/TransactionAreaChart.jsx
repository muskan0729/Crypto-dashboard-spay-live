import React, { useState } from "react";
import Chart from "react-apexcharts";

const TransactionsChart = ({ chartData }) => {
  const [toggle, setToggle] = useState("Total");

  if (!chartData) return null;

  // Helper to convert numeric array to {x, y} objects
  const toPoints = (arr) =>
    (arr || []).map((y, i) => ({ x: i + 1, y }));

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
    {
      length: Math.max(
        payInAmount.length,
        payOutAmount.length,
        payInCount.length,
        payOutCount.length,
        1
      ),
    },
    (_, i) => `Point ${i + 1}`
  );

  const options = {
    chart: {
      height: 350,
      type: "area",
      stacked: false,
      background: "#0b0b0b",
      foreColor: "#FFD700",
      toolbar: { show: false },
    },
    colors: ["#facc15", "#f97316", "#22c55e", "#38bdf8"],
    stroke: {
      width: [2, 2, 3, 3],
      curve: "smooth",
      dashArray: [0, 0, 4, 4],
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: ["#fde047", "#fb923c"],
        opacityFrom: 0.5,
        opacityTo: 0.08,
      },
    },
    markers: {
      size: 5,
      strokeWidth: 2,
      strokeColors: "#0b0b0b",
      hover: { size: 7 },
    },
    xaxis: {
      type: "category",
      categories,
      axisBorder: { color: "#FFD700" },
      axisTicks: { color: "#FFD700" },
      labels: { style: { colors: "#FFD700" } },
    },
    yaxis: [
      {
        title: { text: "Amount", style: { color: "#FFD700" } },
        min: 0,
        labels: { style: { colors: "#FFD700" } },
      },
      {
        opposite: true,
        title: { text: "Count", style: { color: "#FFD700" } },
        min: 0,
        labels: { style: { colors: "#FFD700" } },
      },
    ],
    grid: {
      borderColor: "#2a2a2a",
      strokeDashArray: 4,
    },
    tooltip: { theme: "dark" },
    legend: {
      position: "top",
      labels: { colors: "#FFD700" },
      onItemClick: { toggleDataSeries: true },
    },
  };

  return (
    <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl p-6 overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-red-500/20 to-transparent blur-3xl" />

      <div className="relative space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-sm font-medium text-[#ffd700]">
            Transactions Overview
          </h2>

          {/* Toggle */}
          <div className="flex rounded-lg overflow-hidden border border-white/10 bg-black/40">
            <button
              onClick={() => setToggle("Total")}
              className={`px-4 py-1.5 text-xs font-medium transition
                ${
                  toggle === "Total"
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black"
                    : "text-[#ffd700] hover:bg-white/10"
                }`}
            >
              Total
            </button>
            <button
              onClick={() => setToggle("Today")}
              className={`px-4 py-1.5 text-xs font-medium transition
                ${
                  toggle === "Today"
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black"
                    : "text-[#ffd700] hover:bg-white/10"
                }`}
            >
              Today
            </button>
          </div>
        </div>

        {/* Chart */}
        <Chart options={options} series={series} type="line" height={350} />
      </div>
    </div>
  );
};

export default TransactionsChart;
