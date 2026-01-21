import React from "react";

export const TableSkeleton = () => {
  return (
    <div
      className="
        relative overflow-hidden
        bg-white/5 backdrop-blur-xl
        border border-white/10
        rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.2)]
        p-6 animate-pulse
      "
    >
      {/* Soft Neon Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-400/10 to-indigo-400/10 blur-3xl pointer-events-none rounded-2xl" />

      {/* Header Skeleton */}
      <div className="relative z-10 h-6 w-40 rounded bg-white/10 mb-6 shadow-[0_0_10px_rgba(0,255,255,0.1)]" />

      {/* Table Rows */}
      <div className="relative z-10 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="
              flex justify-between items-center border-b border-white/10 pb-3
              hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]
              transition-shadow duration-300
            "
          >
            {[...Array(5)].map((__, j) => (
              <div
                key={j}
                className="
                  h-4 w-24 rounded bg-white/10
                  shadow-[0_0_5px_rgba(0,255,255,0.05)]
                "
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
