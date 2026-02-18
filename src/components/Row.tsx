import React from "react";
import { ChevronLeft } from "lucide-react";

export default function Row({ title, children, rightAction }:{
  title: string; children: React.ReactNode; rightAction?: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  function scrollBy(dx: number) { ref.current?.scrollBy({ left: dx, behavior: "smooth" }); }

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          {rightAction}
          <button onClick={() => scrollBy(500)} className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10">
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>
      <div ref={ref} className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {children}
      </div>
    </section>
  );
}
