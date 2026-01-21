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
}) {
  return (
    <div className="w-full flex flex-col gap-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-cyan-300 tracking-wide">
          Dashboard Summary
        </h3>
      </div>

      {/* MAIN GRID: Pie Chart Left, 2x2 Boxes Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Pie Chart */}
        <div className="col-span-1">
          <div className="relative rounded-2xl bg-white/5 backdrop-blur-2xl border border-cyan-400/20 shadow-[0_0_60px_rgba(56,189,248,0.15)] p-6 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_90px_rgba(56,189,248,0.3)] h-full">
            <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(56,189,248,0.1),_transparent_70%)] blur-3xl" />
            <h4 className="mb-4 text-sm font-medium text-cyan-300 tracking-wide uppercase">
              Transaction Status
            </h4>
            <TransactionStatusPie statusCounts={donutChart} />
          </div>
        </div>

        {/* RIGHT COLUMN: 2x2 Boxes */}
        <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-6">
          {/* BOX 1: Total Pay-IN */}
          <div className="relative rounded-2xl bg-white/5 backdrop-blur-2xl border border-cyan-400/20 shadow-[0_0_60px_rgba(56,189,248,0.15)] p-6 flex flex-col justify-center transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_90px_rgba(56,189,248,0.3)] h-60">
            <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(56,189,248,0.08),_transparent_70%)] blur-3xl" />
            <h5 className="mb-2 text-sm font-medium text-cyan-300 tracking-wide uppercase">
              Total Pay-IN
            </h5>
            <h6 className="text-3xl font-bold text-white">
              <CryptoAmount amount={normalCards.totalPayIn} symbol="₹" />
            </h6>
          </div>

          {/* BOX 2: Today Pay-IN */}
          <div className="relative rounded-2xl bg-white/5 backdrop-blur-2xl border border-cyan-400/20 shadow-[0_0_60px_rgba(56,189,248,0.15)] p-6 flex flex-col justify-center transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_90px_rgba(56,189,248,0.3)] h-60">
            <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(56,189,248,0.08),_transparent_70%)] blur-3xl" />
            <h5 className="mb-2 text-sm font-medium text-cyan-300 tracking-wide uppercase">
              Today Pay-IN
            </h5>
            <h6 className="text-3xl font-bold text-white">
              <CryptoAmount amount={normalCards.todayPayIn} symbol="₹" />
            </h6>
          </div>

          {/* BOX 3: Total Pay-OUT */}
          <div className="relative rounded-2xl bg-white/5 backdrop-blur-2xl border border-cyan-400/20 shadow-[0_0_60px_rgba(56,189,248,0.15)] p-6 flex flex-col justify-center transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_90px_rgba(56,189,248,0.3)] h-60">
            <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(56,189,248,0.08),_transparent_70%)] blur-3xl" />
            <h5 className="mb-2 text-sm font-medium text-cyan-300 tracking-wide uppercase">
              Total Pay-OUT
            </h5>
            <h6 className="text-3xl font-bold text-white">
              <CryptoAmount amount={normalCards.totalPayOut} symbol="₹" />
            </h6>
          </div>

          {/* BOX 4: Today Pay-OUT */}
          <div className="relative rounded-2xl bg-white/5 backdrop-blur-2xl border border-cyan-400/20 shadow-[0_0_60px_rgba(56,189,248,0.15)] p-6 flex flex-col justify-center transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_90px_rgba(56,189,248,0.3)] h-60">
            <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(56,189,248,0.08),_transparent_70%)] blur-3xl" />
            <h5 className="mb-2 text-sm font-medium text-cyan-300 tracking-wide uppercase">
              Today Pay-OUT
            </h5>
            <h6 className="text-3xl font-bold text-white">
              <CryptoAmount amount={normalCards.todayPayOut} symbol="₹" />
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
}
