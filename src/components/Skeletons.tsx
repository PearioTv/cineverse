import React from "react";

export function SkeletonPoster() {
  return (
    <div className="w-[140px] sm:w-[170px] lg:w-[190px] shrink-0">
      <div className="aspect-[2/3] rounded-2xl bg-white/10 animate-pulse border border-white/10" />
    </div>
  );
}
