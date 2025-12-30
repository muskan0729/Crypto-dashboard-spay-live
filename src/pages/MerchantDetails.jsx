import React from 'react'
import { usePost } from '../hooks/usePost'
import { useParams } from 'react-router-dom'
import { useGet } from '../hooks/useGet'
import useAutoFetch from '../hooks/useAutoFetch'

import Chart from "react-apexcharts";
import MyBarChart from '../components/MyBarChart';

const MerchantDetails = () => {
  const { id } = useParams();
  const { data: record } = useGet(`/Merchant-Collection?merchant_id=${id}`);
  const { data: getMerchant } = useGet(`/show-merchant/${id}`);

  const chartCount = record?.transactionStatusCounts || {};
  const chartSeries = chartCount
    ? [chartCount.pending ?? 0, chartCount.success ?? 0, chartCount.initiated ?? 0]
    : [0, 0, 0];
  const chartLabels = ["Pending", "Success", "Initiated"];

  const pieOptions = {
    chart: {
      type: 'donut',
      background: 'transparent',
      dropShadow: { enabled: true, top: 5, left: 0, blur: 8, opacity: 0.2 },
    },
    labels: chartLabels,
    colors: ['#FFD700', '#32CD32', '#FF6347'],
    legend: { position: "bottom", labels: { colors: '#FFD700' } },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          size: '65%',
          background: 'transparent',
          labels: {
            show: true,
            name: { show: true, color: '#FFD700' },
            value: { show: true, color: '#FFD700' },
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#FFBF00', '#228B22', '#FFA07A'],
        inverseColors: false,
        stops: [0, 100],
      },
    },
    tooltip: { theme: 'dark' },
    responsive: [
      { breakpoint: 480, options: { chart: { width: 300 }, legend: { position: "bottom" } } },
    ],
  };

  return (
    <div className="min-h-screen bg-black p-6">
      {/* HEADER */}
      <h1 className="text-2xl font-bold text-[#ffd700] mb-6">Merchant Details</h1>

      {/* CARDS */}
      {record && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-5 flex flex-col">
            <h3 className="text-[#ffd700]/70 text-sm font-medium">Payin Wallet</h3>
            <p className="text-2xl font-bold mt-2">₹ {record.today_payin}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-5 flex flex-col">
            <h3 className="text-[#ffd700]/70 text-sm font-medium">Payout Wallet</h3>
            <p className="text-2xl font-bold mt-2">₹ {record.today_payout}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-5 flex flex-col">
            <h3 className="text-[#ffd700]/70 text-sm font-medium">Total Charges</h3>
            <p className="text-2xl font-bold mt-2">₹ {record.total_payin_amount}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-5 flex flex-col">
            <h3 className="text-[#ffd700]/70 text-sm font-medium">Rolling Amount</h3>
            <p className="text-2xl font-bold mt-2">₹ {record.total_payout_amount}</p>
          </div>
        </div>
      )}

      {/* CHARTS */}
      {record && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6 flex flex-col lg:flex-row gap-6">
          {/* Pie Chart */}
          <div className="flex-1">
            <h3 className="text-[#ffd700] text-lg font-semibold mb-4">Transaction Status Distribution</h3>
            {chartSeries.some(val => val > 0) ? (
              <Chart options={pieOptions} series={chartSeries} type="pie" height={350} />
            ) : (
              <div className="text-center text-gray-400">No transaction data available yet</div>
            )}
          </div>

          {/* Bar Chart */}
          <div className="flex-1">
            <h3 className="text-[#ffd700] text-lg font-semibold mb-4">Transactions Over Time</h3>
            <MyBarChart record={record} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantDetails;
