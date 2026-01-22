import React from "react";
import { useParams } from "react-router-dom";
import { useGet } from "../hooks/useGet";

import Chart from "react-apexcharts";
import MyBarChart from "../components/MyBarChart";

const MerchantDetails = () => {
  const { id } = useParams();
  const { data: record } = useGet(`/Merchant-Collection?merchant_id=${id}`);
  const { data: getMerchant } = useGet(`/show-merchant/${id}`);

  const chartCount = record?.transactionStatusCounts || {};
  const chartSeries = chartCount
    ? [
        chartCount.pending ?? 0,
        chartCount.success ?? 0,
        chartCount.initiated ?? 0,
      ]
    : [0, 0, 0];

  const chartLabels = ["Pending", "Success", "Initiated"];

  const pieOptions = {
    chart: {
      type: "donut",
      background: "transparent",
      dropShadow: { enabled: true, blur: 10, opacity: 0.25 },
    },
    labels: chartLabels,
    colors: ["#22d3ee", "#3b82f6", "#0ea5e9"],
    legend: {
      position: "bottom",
      labels: { colors: "#a5f3fc" },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: { color: "#67e8f9" },
            value: { color: "#67e8f9" },
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        gradientToColors: ["#0ea5e9", "#3b82f6", "#22d3ee"],
        stops: [0, 100],
      },
    },
    tooltip: { theme: "dark" },
    responsive: [
      {
        breakpoint: 480,
        options: { chart: { width: 300 }, legend: { position: "bottom" } },
      },
    ],
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#020617] via-[#020B2A] to-[#020617] p-6 text-cyan-100">
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 blur-[140px] rounded-full -z-10" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-widest text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]">
          Merchant Details
        </h1>
      </div>

      {/* Metric Cards */}
      {record && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Payin Wallet", value: record.today_payin },
            { label: "Payout Wallet", value: record.today_payout },
            { label: "Total Charges", value: record.total_payin_amount },
            { label: "Rolling Amount", value: record.total_payout_amount },
          ].map((item, idx) => (
            <div
              key={idx}
              className="
                relative
                bg-white/5 backdrop-blur-2xl
                border border-cyan-400/20
                rounded-2xl
                p-5
                shadow-[0_0_40px_-12px_rgba(34,211,238,0.35)]
                transition-all duration-300
                hover:scale-[1.02]
                hover:shadow-[0_0_60px_-10px_rgba(34,211,238,0.6)]
              "
            >
              <h3 className="text-sm text-cyan-200/70 tracking-widest uppercase">
                {item.label}
              </h3>
              <p className="mt-3 text-2xl font-bold text-cyan-300 tracking-wide">
                ₹ {item.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      {record && (
        <div
          className="
            relative
            bg-white/5 backdrop-blur-2xl
            border border-cyan-400/20
            rounded-2xl
            shadow-[0_0_60px_-15px_rgba(34,211,238,0.35)]
            p-6
            flex flex-col lg:flex-row
            gap-6
          "
        >
          {/* Pie Chart */}
          <div className="flex-1">
            <h3 className="mb-4 text-lg font-semibold tracking-widest text-cyan-300">
              Transaction Status Distribution
            </h3>

            {chartSeries.some((val) => val > 0) ? (
              <Chart
                options={pieOptions}
                series={chartSeries}
                type="pie"
                height={350}
              />
            ) : (
              <div className="flex items-center justify-center h-[300px] text-cyan-200/50 tracking-wide">
                No transaction data available yet
              </div>
            )}
          </div>

          {/* Bar Chart */}
          <div className="flex-1">
            <h3 className="mb-4 text-lg font-semibold tracking-widest text-cyan-300">
              Transactions Over Time
            </h3>
            <MyBarChart record={record} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantDetails;
