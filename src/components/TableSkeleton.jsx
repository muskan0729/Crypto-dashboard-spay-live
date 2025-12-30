import React from "react";

export const TableSkeleton = () => {
  return (
    <div
      className="
        relative overflow-hidden
        bg-white/5 backdrop-blur-xl
        border border-white/10
        rounded-2xl shadow-xl
        p-6 animate-pulse
      "
    >
      {/* Soft Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 blur-2xl" />

      {/* Header Skeleton */}
      <div className="relative z-10 h-6 w-40 rounded bg-white/10 mb-6" />

      {/* Table Rows */}
      <div className="relative z-10 space-y-4">
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
  );
};
