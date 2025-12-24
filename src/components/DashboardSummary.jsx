import React from "react";
import TransactionStatusPie from "../components/TransactionStatusPie";

export default function DashboardSummary({
  today,
  setToday,
  showPassword, // seems like a prop controlling the toggle knob
  donutChart,
  normalCards,
  chartRef1,
  chartRef2,
}) {
  return (
    <div className="w-full mb-8">
      {/* Flex container for toggle + grid */}
      <div className="flex justify-end mb-6">
        {/* Toggle Button */}
        <div
          className={`relative w-20 h-8 rounded-full cursor-pointer transition-colors ${
            today ? "bg-yellow-400" : "bg-gray-400"
          }`}
          onClick={() => setToday(!today)}
        >
          {/* Labels */}
          <span
            className={`absolute left-2 top-1 text-xs font-semibold transition-opacity ${
              today ? "opacity-50" : "opacity-100"
            } text-black`}
          >
            Total
          </span>
          <span
            className={`absolute right-2 top-1 text-xs font-semibold transition-opacity ${
              today ? "opacity-100" : "opacity-50"
            } text-black`}
          >
            Today
          </span>

          {/* Moving Knob */}
          <div
            className={`absolute top-1 left-1 w-8 h-6 bg-white rounded-full shadow-md flex items-center justify-center font-semibold text-xs text-black transform transition-transform duration-300 ${
              today ? "translate-x-12" : "translate-x-0"
            }`}
          ></div>
        </div>
      </div>

      {/* Cards + Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {(
          <>
            {/* Pie Chart */}
            <div className="flex justify-center items-start">
              <div className="w-full max-w-[380px] p-6 rounded-xl backdrop-blur-xl shadow-lg bg-black/70">
                <TransactionStatusPie statusCounts={donutChart} />
              </div>
            </div>

            {/* Pay-IN / Pay-OUT Cards */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Pay-IN */}
              <div className="bg-black/80 rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4 border-b border-[#433200] pb-2">
                  <h5 className="text-lg font-semibold text-[#D4AF37]">
                    Pay-IN Collection
                  </h5>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h6 className="text-2xl font-bold text-[#D4AF37]">
                      ₹ {today ? normalCards.totalPayIn : normalCards.todayPayIn}
                    </h6>
                  </div>
                  {/* <div ref={chartRef1} className="w-[200px] h-[80px]"></div> */}
                </div>
              </div>

              {/* Pay-OUT */}
              <div className="bg-black/80 rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4 border-b border-[#433200] pb-2">
                  <h5 className="text-lg font-semibold text-[#D4AF37]">
                    Pay-OUT Collection
                  </h5>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h6 className="text-2xl font-bold text-[#D4AF37]">
                      ₹ {today ? normalCards.totalPayOut : normalCards.todayPayOut}
                    </h6>
                  </div>
                  {/* <div ref={chartRef2} className="w-[200px] h-[80px]"></div> */}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
