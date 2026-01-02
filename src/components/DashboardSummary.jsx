import React from "react";
import TransactionStatusPie from "../components/TransactionStatusPie";
import CryptoAmount from "../components/CryptoAmounts";

export default function DashboardSummary({
  today,
  setToday,
  showPassword,
  role,
  donutChart,
  normalCards,
  chartRef1,
  chartRef2,
}) {
  return (
    <div className="w-full flex flex-col gap-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Dashboard Summary</h3>
      </div>

      {/* SUMMARY GRID */}
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* PIE CHART */}
  <div className="flex justify-center items-start">
    <div className="w-full max-w-[320px] rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-yellow-400/20 to-transparent blur-3xl" />
      <div className="relative">
        <h4 className="mb-4 text-sm font-medium text-[#ffd700]">
          Transaction Status
        </h4>
        <TransactionStatusPie statusCounts={donutChart} />
      </div>
    </div>
  </div>

 {/* PAY-IN / PAY-OUT */}
<div className="lg:col-span-2 relative flex flex-col gap-6 justify-center">
  {/* TOGGLE (top-right) */}
  <div className="absolute top-0 right-0">
    <div
      onClick={() => setToday(!today)}
      className={`relative w-20 h-6 rounded-full cursor-pointer transition-all duration-300 shadow-inner
        ${today ? "bg-gradient-to-r from-yellow-400 to-red-500" : "bg-gray-300"}`}
    >
      {/* Total */}
      <span
        className={`absolute right-2 inset-y-0 flex items-center text-[11px] font-medium transition-opacity
          ${today ? "opacity-0" : "opacity-100"} text-black`}
      >
        Total
      </span>

      {/* Today */}
      <span
        className={`absolute left-2 inset-y-0 flex items-center text-[11px] font-medium transition-opacity
          ${today ? "opacity-100" : "opacity-0"} text-black`}
      >
        Today
      </span>

      {/* Knob */}
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-lg
          transition-transform duration-300 ease-in-out
          ${today ? "translate-x-14" : "translate-x-0"}`}
      />
    </div>
  </div>

  {/* PAY-IN */}
  <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl p-6 overflow-hidden h-36">
    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-red-500/20 blur-3xl" />
    <div className="relative h-full flex flex-col justify-center">
      <h5 className="mb-2 text-sm font-medium text-[#ffd700]">
        Pay-IN Collection
      </h5>
      <h6 className="text-3xl font-bold text-white">
        <CryptoAmount 
          amount={today ? normalCards.totalPayIn : normalCards.todayPayIn} 
          symbol="₹" 
        />
      </h6>
    </div>
  </div>

  {/* PAY-OUT */}
  <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl p-6 overflow-hidden h-36">
    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-yellow-400/20 blur-3xl" />
    <div className="relative h-full flex flex-col justify-center">
      <h5 className="mb-2 text-sm font-medium text-[#ffd700]">
        Pay-OUT Collection
      </h5>
      <h6 className="text-3xl font-bold text-white">
        <CryptoAmount 
          amount={today ? normalCards.totalPayOut : normalCards.todayPayOut} 
          symbol="₹" 
        />
      </h6>
    </div>
  </div>
</div>

</div>

    </div>
  );
}
