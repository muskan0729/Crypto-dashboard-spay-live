import React, { useState } from "react";
import Chart from "react-apexcharts";

const TransactionsChart = ({ chartData }) => {
  const [toggle, setToggle] = useState("Total");

  if (!chartData) return null; // prevent rendering before data loads

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
    { length: Math.max(payInAmount.length, payOutAmount.length, payInCount.length, payOutCount.length, 1) },
    (_, i) => `Point ${i + 1}`
  );

  const options = {
    chart: { height: 350, type: "area", stacked: false, background: "#111", foreColor: "#FFD700" },
    colors: ["#FFD700", "#FFB600", "#FFD54F", "#FFC107"],
    stroke: { width: [2, 2, 3, 3], curve: "smooth", dashArray: [0, 0, 4, 4] },
    fill: { type: "gradient", gradient: { shade: "dark", gradientToColors: ["#FFEA00", "#FF9800"], opacityFrom: 0.6, opacityTo: 0.1 } },
    markers: { size: 6, strokeWidth: 2, strokeColors: "#111", hover: { size: 8, sizeOffset: 3 } },
    xaxis: { type: "category", categories, axisBorder: { color: "#FFD700" }, axisTicks: { color: "#FFD700" }, labels: { style: { colors: "#FFD700" } } },
    yaxis: [
      { title: { text: "Amount", style: { color: "#FFD700" } }, min: 0, labels: { style: { colors: "#FFD700" } } },
      { opposite: true, title: { text: "Count", style: { color: "#FFD700" } }, min: 0, labels: { style: { colors: "#FFD700" } } },
    ],
    grid: { borderColor: "#333", strokeDashArray: 4 },
    tooltip: { theme: "dark" },
    legend: { position: "top", labels: { colors: "#FFD700" }, onItemClick: { toggleDataSeries: true } },
  };

  return (
    <div className="p-4 bg-[#111] rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#FFD700]">Transactions</h2>
        <div>
          <button
            className={`px-3 py-1 rounded-l ${toggle === "Total" ? "bg-[#FFD700] text-black shadow-md" : "bg-gray-800 text-[#FFD700]"}`}
            onClick={() => setToggle("Total")}
          >
            Total
          </button>
          <button
            className={`px-3 py-1 rounded-r ${toggle === "Today" ? "bg-[#FFD700] text-black shadow-md" : "bg-gray-800 text-[#FFD700]"}`}
            onClick={() => setToggle("Today")}
          >
            Today
          </button>
        </div>
      </div>
      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default TransactionsChart;
