// StockPriceChart.jsx
import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

export default function StockPriceChart({ dates = [], height = 350 }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || chartInstance.current) return;

    const options = {
      series: [
        {
          name: "XYZ MOTORS",
          data: dates,
        },
      ],
      chart: {
        type: "area",
        stacked: false,
        height: height,
        zoom: {
          enabled: false,
        },
        toolbar: { show: true },
        background: "#000",
        foreColor: "#CDA434",
      },
      dataLabels: { enabled: false },
      markers: { size: 0 },
      title: {
        text: "Transactions Trends",
        align: "left",
        style: { color: "#CDA434" },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.7,
          opacityTo: 0,
          stops: [0, 90, 100],
          colorStops: [
            { offset: 0, color: "#CDA434", opacity: 0.7 },
            { offset: 100, color: "#CDA434", opacity: 0 },
          ],
        },
      },
      yaxis: {
        labels: {
          formatter: (val) => (val / 1000000).toFixed(0),
        },
        title: { text: "Count", style: { color: "#CDA434" } },
      },
      xaxis: { type: "datetime", labels: { style: { colors: "#CDA434" } } },
      tooltip: {
        shared: false,
        theme: "dark",
        y: { formatter: (val) => (val / 1000000).toFixed(0) },
      },
    };

    chartInstance.current = new ApexCharts(chartRef.current, options);
    chartInstance.current.render();

    return () => {
      chartInstance.current.destroy();
      chartInstance.current = null;
    };
  }, [height]);

  // If dates update dynamically, use this effect to update series safely
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.updateSeries([{ data: dates }]);
    }
  }, [dates]);

  return <div ref={chartRef}></div>;
}
