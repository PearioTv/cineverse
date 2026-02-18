import React from "react";
import { Link } from "react-router-dom";
import { Play, Star } from "lucide-react";
import { imgUrl } from "../lib/tmdb";
import { cn, formatVote } from "../lib/utils";
import type { MediaType } from "../lib/types";

export function PosterCard({
  item,
  mediaType,
  title,
  subtitle,
  progress,
  className,
}:{
  item: any;
  mediaType: MediaType;
  title: string;
  subtitle?: string;
  progress?: number;
  className?: string;
}) {
  const poster = imgUrl(item.poster_path ?? null, "w342");
  const to = `/${mediaType}/${item.id}`;
  return (
    <Link to={to} className={cn("group relative w-[140px] sm:w-[170px] lg:w-[190px] shrink-0", className)}>
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-glow">
        <div className="aspect-[2/3] w-full">
          {poster ? (
            <img src={poster} alt={title} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
          ) : (
            <div className="h-full w-full animate-pulse bg-white/10" />
          )}
        </div>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{title}</div>
              {subtitle ? <div className="truncate text-xs text-muted">{subtitle}</div> : null}
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-xl bg-black/40 border border-white/10 px-2 py-1 text-xs">
                <Star size={14} /> {formatVote(item.vote_average)}
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15 border border-white/10">
                <Play size={16} />
              </span>
            </div>
          </div>
        </div>

        {typeof progress === "number" ? (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div className="h-full bg-[var(--accent)]" style={{width: `${Math.max(0, Math.min(100, progress))}%`}} />
          </div>
        ) : null}
      </div>
    </Link>
  );
}
