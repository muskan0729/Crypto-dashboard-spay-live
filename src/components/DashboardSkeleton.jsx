import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse p-6 space-y-10 bg-black">
      {/* ========== TOP SECTION (4 CARDS + DONUT CHART) ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left cards section */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="
                relative overflow-hidden
                bg-white/5 backdrop-blur-xl
                border border-white/10
                rounded-2xl shadow-xl
              "
            >
              {/* Gradient Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 blur-2xl" />

              {/* Card Header */}
              <div className="relative z-10 flex justify-between items-center p-6">
                <div className="h-10 w-10 rounded-full bg-white/10" />
                <div className="h-5 w-40 rounded bg-white/10" />
              </div>

              {/* Decorative Shape */}
              <svg
                className="absolute bottom-0 w-full opacity-30"
                viewBox="0 0 500 50"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,0 C250,50 250,50 500,0 L500,50 L0,50 Z"
                  className="fill-white/10"
                />
              </svg>

              {/* Card Footer */}
              <div className="relative z-10 flex justify-between items-center p-6">
                <div className="h-6 w-24 rounded bg-white/10" />
                <div className="h-4 w-12 rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>

        {/* Donut Chart Skeleton */}
        <div
          className="
            flex justify-center items-center
            bg-white/5 backdrop-blur-xl
            border border-white/10
            rounded-2xl shadow-xl
          "
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-red-500/20 blur-2xl rounded-full" />
            <div className="relative w-72 h-72 rounded-full bg-white/10" />
          </div>
        </div>
      </div>

      {/* ========== SECOND SECTION (LINE CHART + LARGE TRANSACTIONS) ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Line Chart */}
        <div
          className="
            lg:col-span-7 p-6
            bg-white/5 backdrop-blur-xl
            border border-white/10
            rounded-2xl shadow-xl
          "
        >
          <div className="h-72 rounded-xl bg-white/10" />
        </div>

        {/* Large Transactions */}
        <div
          className="
            lg:col-span-3 p-6
            bg-white/5 backdrop-blur-xl
            border border-white/10
            rounded-2xl shadow-xl
          "
        >
          <div className="flex justify-between mb-6">
            <div className="h-5 w-40 rounded bg-white/10" />
            <div className="h-4 w-12 rounded bg-white/10" />
          </div>

          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 w-32 rounded bg-white/10" />
                <div className="h-4 w-16 rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== TABLE SECTION ========== */}
      <div
        className="
          p-6
          bg-white/5 backdrop-blur-xl
          border border-white/10
          rounded-2xl shadow-xl
        "
      >
        <div className="h-6 w-40 rounded bg-white/10 mb-6" />

        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b border-white/10 pb-3"
            >
              {[...Array(5)].map((__, j) => (
                <div
                  key={j}
                  className="h-4 w-24 rounded bg-white/10"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
