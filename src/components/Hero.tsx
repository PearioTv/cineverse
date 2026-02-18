import React from "react";
import { Link } from "react-router-dom";
import { Info, Play } from "lucide-react";
import { imgUrl } from "../lib/tmdb";
import { formatVote, yearFromDate } from "../lib/utils";

export default function Hero({ item }:{ item: any }) {
  const mediaType = item.media_type === "tv" ? "tv" : "movie";
  const title = item.title ?? item.name ?? "";
  const year = yearFromDate(item.release_date ?? item.first_air_date);
  const bg = imgUrl(item.backdrop_path, "original");

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 shadow-glow">
      <div className="absolute inset-0">
        {bg ? <img src={bg} alt={title} className="h-full w-full object-cover scale-[1.03]" /> : <div className="h-full w-full bg-white/10" />}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
      </div>

      <div className="relative p-6 sm:p-10 min-h-[320px] flex items-end">
        <div className="max-w-2xl text-shadow">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-3 py-1 text-xs text-muted">
            <span>⭐ {formatVote(item.vote_average)}</span>
            {year ? <span>• {year}</span> : null}
          </div>

          <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold leading-tight">{title}</h1>

          <p className="mt-3 text-sm sm:text-base text-muted line-clamp-3">{item.overview || "وصف غير متوفر."}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={`/player?mediaType=${mediaType}&id=${item.id}`}
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-2 font-semibold text-sm text-white hover:opacity-95">
              <Play size={18} /> مشاهدة (Trailer)
            </Link>
            <Link to={`/${mediaType}/${item.id}`}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 font-semibold text-sm hover:bg-white/10">
              <Info size={18} /> المزيد من التفاصيل
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
