// src/components/ProfileSkeleton.jsx
export default function ProfileSkeleton() {
  return (
    <div className="md:flex w-full animate-pulse space-y-6 md:space-y-0 md:space-x-6">
      {/* Right Content Skeleton */}
      <div className="flex-1 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl relative overflow-hidden">
        {/* Optional Glow Effect */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-gradient-radial from-[#ffd700]/40 via-[#ff6b00]/20 to-[#ff0000]/0 blur-3xl rounded-full pointer-events-none"></div>

        {/* Heading Skeleton */}
        <div className="h-6 w-32 bg-white/20 rounded mb-6 relative z-10"></div>

        {/* Grid Form Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-full space-y-2">
              <div className="h-4 w-24 bg-white/20 rounded"></div>
              <div className="h-10 bg-white/10 rounded-lg"></div>
            </div>
          ))}
        </div>

        {/* Button Skeleton */}
        <div className="mt-6 w-32 h-10 bg-gradient-to-r from-[#ffd700]/30 via-[#ffb347]/20 to-[#ff6b00]/10 rounded-2xl relative z-10"></div>
      </div>
    </div>
  );
}
