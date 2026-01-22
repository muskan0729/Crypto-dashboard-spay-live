import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse p-8 bg-[#0f172a] min-h-screen text-cyan-400 font-sans">
      {/* Container with horizontal layout */}
      <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto">

        {/* Left: Donut chart container */}
        <div className="lg:w-1/2 bg-[#1e293b]/80 border border-cyan-600 rounded-2xl p-6 shadow-lg relative">
          <h3 className="text-cyan-400 font-semibold mb-3 select-none">TRANSACTION STATUS</h3>
          <div className="flex justify-center items-center relative">
            {/* Donut chart skeleton */}
            <div className="relative w-72 h-72 rounded-full bg-cyan-900/30">
              {/* Outer glow */}
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/50 shadow-[0_0_20px_cyan]"></div>
              {/* Inner circles representing segments */}
              <div className="absolute top-10 left-10 w-52 h-52 rounded-full border-8 border-yellow-400/70"></div>
              <div className="absolute top-20 left-20 w-32 h-32 rounded-full border-8 border-green-500/70"></div>
              <div className="absolute top-28 left-28 w-16 h-16 rounded-full border-8 border-gray-400/50"></div>
            </div>
          </div>
          {/* Legend */}
          <div className="flex justify-center space-x-8 mt-4 text-xs select-none">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-sm" />
              <span className="text-yellow-400">Initiated</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-400 rounded-sm" />
              <span className="text-gray-400">Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-sm" />
              <span className="text-green-500">Success</span>
            </div>
          </div>
        </div>

        {/* Right: Four cards in grid */}
        <div className="lg:w-1/2 grid grid-cols-2 gap-6">
          {[
            { title: "TOTAL PAY-IN", value: "₹ ---" },
            { title: "TODAY PAY-IN", value: "₹ -" },
            { title: "TOTAL PAY-OUT", value: "₹ -" },
            { title: "TODAY PAY-OUT", value: "₹ -" },
          ].map(({ title, value }, i) => (
            <div
              key={i}
              className="bg-[#1e293b]/80 border border-cyan-600 rounded-2xl p-6 shadow-lg flex flex-col justify-center select-none"
            >
              <h4 className="text-cyan-400 font-semibold mb-2">{title}</h4>
              <p className="text-white text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
