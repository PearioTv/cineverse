import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { X, SkipForward, StepForward, Clock3 } from "lucide-react";
import type { MediaType } from "../lib/types";
import { getDetails, pickTrailer } from "../lib/tmdb";
import { upsertProgress } from "../lib/storage";

type PlayerEvent = {
  type: "PLAYER_EVENT";
  data: {
    event: "timeupdate" | "play" | "pause" | "ended" | "seeked";
    currentTime: number;
    duration: number;
    progress: number;
    id: string;
    mediaType: MediaType;
    season?: number;
    episode?: number;
    timestamp?: number;
  };
};

function safeJsonParse(s: any): any {
  try { return typeof s === "string" ? JSON.parse(s) : s; } catch { return null; }
}

export default function PlayerPage() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  const mediaType = (sp.get("mediaType") as MediaType) || "movie";
  const id = Number(sp.get("id") || "0");
  const season = Number(sp.get("season") || "0") || undefined;
  const episode = Number(sp.get("episode") || "0") || undefined;

  const embedUrl = sp.get("embedUrl"); // OPTIONAL (legal embed you own)
  const [title, setTitle] = React.useState<string>("");
  const [ytKey, setYtKey] = React.useState<string | null>(null);
  const [remaining, setRemaining] = React.useState<string>("");

  React.useEffect(() => {
    (async () => {
      const d = await getDetails(mediaType, id);
      const t = mediaType === "movie" ? d.title : d.name;
      setTitle(mediaType === "tv" && season && episode ? `${t} — S${season}E${episode}` : t);
      const trailer = pickTrailer(d.videos);
      setYtKey(trailer?.key ?? null);
    })().catch(console.error);
  }, [mediaType, id, season, episode]);

  React.useEffect(() => {
    function onMsg(event: MessageEvent) {
      const payload = safeJsonParse(event.data) as PlayerEvent | null;
      if (!payload || payload.type !== "PLAYER_EVENT") return;

      const d = payload.data;
      if (!d || !d.duration) return;

      const left = Math.max(0, d.duration - d.currentTime);
      const mm = Math.floor(left / 60);
      const ss = Math.floor(left % 60);
      setRemaining(`${mm}:${String(ss).padStart(2,"0")}`);

      upsertProgress({
        mediaType: d.mediaType,
        id: Number(d.id),
        season: d.season,
        episode: d.episode,
        currentTime: d.currentTime,
        duration: d.duration,
        progress: d.progress,
        updatedAt: Date.now(),
      });

      if (d.event === "ended" && d.mediaType === "tv" && season && episode) {
        const nextEp = episode + 1;
        navigate(`/player?mediaType=tv&id=${id}&season=${season}&episode=${nextEp}`, { replace: true });
      }
    }

    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [navigate, id, season, episode]);

  const finalEmbed =
    embedUrl ? decodeURIComponent(embedUrl)
    : (ytKey ? `https://www.youtube.com/embed/${ytKey}?autoplay=1&rel=0&modestbranding=1` : null);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3">
        <div className="glass px-4 py-2 rounded-2xl border border-white/10 max-w-[70%]">
          <div className="text-xs text-muted">Cinema Mode</div>
          <div className="font-semibold truncate">{title || "—"}</div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 glass px-3 py-2 rounded-2xl border border-white/10 text-sm text-muted">
            <Clock3 size={16} /> المتبقي: <span className="text-text font-semibold">{remaining || "—"}</span>
          </div>

          <button
            onClick={() => alert("زر Skip Intro (واجهة فقط). اربطه بمنطقك إذا كان لديك بيانات توقيت المقدمة.")}
            className="glass px-4 py-2 rounded-2xl border border-white/10 text-sm font-semibold hover:bg-white/10 flex items-center gap-2"
          >
            <SkipForward size={18} /> Skip Intro
          </button>

          {mediaType === "tv" ? (
            <button
              onClick={() => {
                const nextEp = (episode ?? 0) + 1;
                navigate(`/player?mediaType=tv&id=${id}&season=${season ?? 1}&episode=${nextEp}`);
              }}
              className="glass px-4 py-2 rounded-2xl border border-white/10 text-sm font-semibold hover:bg-white/10 flex items-center gap-2"
            >
              <StepForward size={18} /> الحلقة التالية
            </button>
          ) : null}

          <button
            onClick={() => navigate(-1)}
            className="h-11 w-11 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center"
            aria-label="Close"
          >
            <X />
          </button>
        </div>
      </div>

      <div className="absolute inset-0 pt-20 pb-6 px-4 sm:px-8">
        <div className="h-full rounded-2xl overflow-hidden border border-white/10 shadow-glow bg-black">
          {finalEmbed ? (
            <iframe
              src={finalEmbed}
              title="Player"
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="h-full flex items-center justify-center text-muted">
              لا يوجد Trailer متاح. يمكنك تمرير embedUrl قانوني في الرابط.
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 text-center text-xs text-muted">
        دعم تتبع التقدم عبر <code className="px-2 py-1 rounded bg-white/5 border border-white/10">postMessage</code> (اختياري)
      </div>
    </div>
  );
}
