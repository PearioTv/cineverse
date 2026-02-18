import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Play, Plus, Check, Film, Tv, Clapperboard } from "lucide-react";
import type { MediaType } from "../lib/types";
import { getDetails, getSeason, imgUrl, pickTrailer } from "../lib/tmdb";
import { formatRuntime, formatVote, yearFromDate } from "../lib/utils";
import { inWatchlist, toggleWatchlist, getAllProgress } from "../lib/storage";

export default function DetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const mediaType = (params.mediaType as MediaType) ?? "movie";
  const id = Number(params.id);

  const [data, setData] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [season, setSeason] = React.useState<number>(1);
  const [seasonData, setSeasonData] = React.useState<any | null>(null);
  const [watchlisted, setWatchlisted] = React.useState(false);

  React.useEffect(() => { setWatchlisted(inWatchlist(mediaType, id)); }, [mediaType, id]);

  React.useEffect(() => {
    setLoading(true);
    (async () => {
      const d = await getDetails(mediaType, id);
      setData(d);
      setLoading(false);
      if (mediaType === "tv") setSeason(1);
    })().catch((e) => { console.error(e); setData(null); setLoading(false); });
  }, [mediaType, id]);

  React.useEffect(() => {
    if (mediaType !== "tv") return;
    (async () => setSeasonData(await getSeason(id, season)))().catch((e) => { console.error(e); setSeasonData(null); });
  }, [mediaType, id, season]);

  if (loading) return <div className="mt-8 h-[560px] rounded-2xl bg-white/10 animate-pulse border border-white/10" />;
  if (!data) return <div className="mt-10 text-muted">تعذر تحميل البيانات.</div>;

  const title = mediaType === "movie" ? data.title : data.name;
  const year = yearFromDate(mediaType === "movie" ? data.release_date : data.first_air_date);
  const runtime = mediaType === "movie" ? formatRuntime(data.runtime) : formatRuntime(data.episode_run_time?.[0]);
  const bg = imgUrl(data.backdrop_path, "original");
  const poster = imgUrl(data.poster_path, "w500");
  const trailer = pickTrailer(data.videos);

  function onToggleWatchlist() {
    toggleWatchlist({ mediaType, id, addedAt: Date.now() });
    setWatchlisted(inWatchlist(mediaType, id));
  }

  const progressAll = getAllProgress();

  return (
    <div className="pb-10">
      <section className="relative overflow-hidden rounded-2xl border border-white/10 shadow-glow">
        <div className="absolute inset-0">
          {bg ? <img src={bg} alt={title} className="h-full w-full object-cover scale-[1.03]" /> : <div className="h-full w-full bg-white/10" />}
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
        </div>

        <div className="relative p-5 sm:p-8 flex flex-col sm:flex-row gap-6">
          <div className="w-[170px] sm:w-[240px] shrink-0">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {poster ? <img src={poster} alt={title} className="w-full object-cover" /> : <div className="aspect-[2/3] bg-white/10" />}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-3 py-1 text-xs text-muted">
              {mediaType === "movie" ? <Film size={14} /> : <Tv size={14} />}
              <span>⭐ {formatVote(data.vote_average)}</span>
              {year ? <span>• {year}</span> : null}
              {runtime ? <span>• {runtime}</span> : null}
            </div>

            <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold">{title}</h1>

            <div className="mt-3 flex flex-wrap gap-2">
              {(data.genres ?? []).slice(0, 8).map((g: any) => (
                <span key={g.id} className="text-xs rounded-2xl border border-white/10 bg-white/5 px-3 py-1 text-muted">{g.name}</span>
              ))}
            </div>

            <p className="mt-4 text-sm sm:text-base text-muted leading-relaxed">{data.overview || "لا يوجد وصف."}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={`/player?mediaType=${mediaType}&id=${id}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-2 font-semibold text-sm text-white hover:opacity-95">
                <Play size={18} /> Watch Now (Trailer)
              </Link>

              {trailer ? (
                <button onClick={() => navigate(`/player?mediaType=${mediaType}&id=${id}&mode=trailer`)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 font-semibold text-sm hover:bg-white/10">
                  <Clapperboard size={18} /> Trailer
                </button>
              ) : null}

              <button onClick={onToggleWatchlist}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 font-semibold text-sm hover:bg-white/10">
                {watchlisted ? <Check size={18} /> : <Plus size={18} />}
                {watchlisted ? "في قائمتي" : "Add to List"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {mediaType === "tv" ? (
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">المواسم والحلقات</h2>
            <div className="text-sm text-muted">{data.number_of_seasons} موسم • {data.number_of_episodes} حلقة</div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({length: Math.min(20, data.number_of_seasons ?? 1)}).map((_, i) => {
              const n = i + 1;
              const active = n === season;
              return (
                <button key={n} onClick={() => setSeason(n)}
                  className={active
                    ? "px-4 py-2 rounded-2xl bg-[var(--accent)] text-white text-sm font-semibold"
                    : "px-4 py-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-semibold"}>
                  الموسم {n}
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(seasonData?.episodes ?? []).map((ep: any) => {
              const p = progressAll.find(x => x.mediaType==="tv" && x.id===id && x.season===season && x.episode===ep.episode_number);
              return (
                <Link key={ep.id}
                  to={`/player?mediaType=tv&id=${id}&season=${season}&episode=${ep.episode_number}`}
                  className="group glass rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition">
                  <div className="aspect-video bg-white/10">
                    {ep.still_path ? (
                      <img src={imgUrl(ep.still_path, "w780")} alt={ep.name} className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform" loading="lazy" />
                    ) : null}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold truncate">E{ep.episode_number} — {ep.name}</div>
                      <div className="text-xs text-muted shrink-0">{ep.runtime ? `${ep.runtime}د` : ""}</div>
                    </div>
                    <div className="mt-2 text-xs text-muted line-clamp-2">{ep.overview || "—"}</div>
                    <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--accent)]" style={{width: `${p ? p.progress : 0}%`}} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
