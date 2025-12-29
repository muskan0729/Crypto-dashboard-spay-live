import React, { useEffect, useRef } from "react";

export const DonutChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const pending = Number(data?.pending) || 0;
  const success = Number(data?.success) || 0;
  const failed = Number(data?.failed) || 0;
  const total = pending + success + failed;

  useEffect(() => {
    if (!chartRef.current || typeof ApexCharts === "undefined") return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    const seriesData = total > 0 ? [pending, success, failed] : [0, 0, 0];

    const options = {
      series: seriesData,
      colors: ["#FBBF24", "#6366F1", "#EF4444"], // yellow, indigo, red
      chart: {
        height: 320,
        type: "donut",
        background: "transparent",
        animations: { enabled: false },
        toolbar: { show: false },
      },
      stroke: { colors: ["transparent"] },
      plotOptions: {
        pie: {
          donut: {
            size: "80%",
            labels: {
              show: true,
              name: {
                show: true,
                offsetY: 18,
                color: "#CBD5E1",
              },
              value: {
                show: true,
                offsetY: -12,
                color: "#FFFFFF",
                fontSize: "20px",
                fontWeight: 600,
              },
              total: {
                showAlways: true,
                show: true,
                label: "Transactions",
                color: "#94A3B8",
                formatter: () => total,
              },
            },
          },
        },
      },
      labels: ["Pending", "Success", "Failed"],
      dataLabels: { enabled: false },
      legend: {
        position: "bottom",
        labels: {
          colors: "#CBD5E1",
        },
      },
      tooltip: {
        theme: "dark",
      },
    };

    // eslint-disable-next-line no-undef
    chartInstance.current = new ApexCharts(chartRef.current, options);
    chartInstance.current.render();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [pending, success, failed, total]);

  return (
    <div
      className="
        max-w-sm w-full rounded-2xl p-5
        bg-black
        bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20
        backdrop-blur-2xl
        border border-white/10
        shadow-xl shadow-blue-500/10
      "
    >
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-lg font-semibold text-white">
          Transactions
        </h5>
      </div>

      <div ref={chartRef} className="py-4" />
    </div>
  );
};
