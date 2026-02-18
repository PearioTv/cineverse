import React from "react";
import Hero from "../components/Hero";
import Row from "../components/Row";
import { PosterCard } from "../components/PosterCard";
import { SkeletonPoster } from "../components/Skeletons";
import { getContinueWatching } from "../lib/storage";
import { discover, getGenres, getRecentlyAddedMovies, getRecentlyAddedTV, getTopRatedMovies, getTopRatedTV, getTrending } from "../lib/tmdb";
import type { MediaType, TMDBGenre } from "../lib/types";

function pickTitle(item: any) { return item.title ?? item.name ?? ""; }

export default function HomePage() {
  const [trending, setTrending] = React.useState<any[] | null>(null);
  const [topMovies, setTopMovies] = React.useState<any[] | null>(null);
  const [topTV, setTopTV] = React.useState<any[] | null>(null);
  const [recentMovies, setRecentMovies] = React.useState<any[] | null>(null);
  const [recentTV, setRecentTV] = React.useState<any[] | null>(null);
  const [genreRows, setGenreRows] = React.useState<{mediaType: MediaType, genre: TMDBGenre, items: any[]}[]>([]);
  const continueWatching = React.useMemo(() => getContinueWatching(20), []);

  React.useEffect(() => {
    (async () => {
      const [t, m, tv, rm, rtv, gm] = await Promise.all([
        getTrending(),
        getTopRatedMovies(),
        getTopRatedTV(),
        getRecentlyAddedMovies(),
        getRecentlyAddedTV(),
        getGenres("movie"),
      ]);
      setTrending(t.results);
      setTopMovies(m.results);
      setTopTV(tv.results);
      setRecentMovies(rm.results);
      setRecentTV(rtv.results);

      const pick = gm.genres.slice(0, 5);
      const rows = await Promise.all(
        pick.map(async (g) => {
          const res = await discover("movie", { with_genres: g.id, sort_by: "popularity.desc" });
          return { mediaType: "movie" as const, genre: g, items: res.results };
        })
      );
      setGenreRows(rows);
    })().catch((e) => {
      console.error(e);
      setTrending([]);
      setTopMovies([]);
      setTopTV([]);
      setRecentMovies([]);
      setRecentTV([]);
    });
  }, []);

  const heroItem = trending?.[0];

  return (
    <div className="pb-6">
      {heroItem ? <Hero item={heroItem} /> : <div className="h-[320px] rounded-2xl bg-white/10 animate-pulse border border-white/10" />}

      <Row title="🔥 الرائج الآن">
        {(trending ?? Array.from({length: 10})).map((item: any, idx) => {
          if (!item?.id) return <SkeletonPoster key={idx} />;
          const mt = item.media_type === "tv" ? "tv" : "movie";
          return <PosterCard key={item.id} item={item} mediaType={mt} title={pickTitle(item)} subtitle={mt === "movie" ? "فيلم" : "مسلسل"} />;
        })}
      </Row>

      <Row title="⭐ أفضل الأفلام تقييمًا">
        {(topMovies ?? Array.from({length: 10})).map((item: any, idx) => {
          if (!item?.id) return <SkeletonPoster key={idx} />;
          return <PosterCard key={item.id} item={item} mediaType="movie" title={pickTitle(item)} subtitle="فيلم" />;
        })}
      </Row>

      <Row title="⭐ أفضل المسلسلات تقييمًا">
        {(topTV ?? Array.from({length: 10})).map((item: any, idx) => {
          if (!item?.id) return <SkeletonPoster key={idx} />;
          return <PosterCard key={item.id} item={item} mediaType="tv" title={pickTitle(item)} subtitle="مسلسل" />;
        })}
      </Row>

      <Row title="🆕 مضاف حديثًا (أفلام)">
        {(recentMovies ?? Array.from({length: 10})).map((item: any, idx) => {
          if (!item?.id) return <SkeletonPoster key={idx} />;
          return <PosterCard key={item.id} item={item} mediaType="movie" title={pickTitle(item)} subtitle="فيلم" />;
        })}
      </Row>

      <Row title="🆕 مضاف حديثًا (مسلسلات)">
        {(recentTV ?? Array.from({length: 10})).map((item: any, idx) => {
          if (!item?.id) return <SkeletonPoster key={idx} />;
          return <PosterCard key={item.id} item={item} mediaType="tv" title={pickTitle(item)} subtitle="مسلسل" />;
        })}
      </Row>

      {continueWatching.length ? (
        <Row title="⏯️ أكمل المشاهدة">
          {continueWatching.map((p) => (
            <PosterCard
              key={`${p.mediaType}-${p.id}-${p.season ?? ""}-${p.episode ?? ""}`}
              item={{ id: p.id, poster_path: null, vote_average: 0 }}
              mediaType={p.mediaType}
              title={p.mediaType === "movie" ? `فيلم #${p.id}` : `مسلسل #${p.id}`}
              subtitle={p.mediaType === "tv" ? `S${p.season} • E${p.episode}` : "متابعة"}
              progress={p.progress}
            />
          ))}
        </Row>
      ) : null}

      {genreRows.map((row) => (
        <Row key={row.genre.id} title={`🎭 ${row.genre.name}`}>
          {row.items.slice(0, 14).map((item: any) => (
            <PosterCard key={item.id} item={item} mediaType={row.mediaType} title={pickTitle(item)} subtitle="فيلم" />
          ))}
        </Row>
      ))}

      <div className="mt-10 glass rounded-2xl p-5 text-sm text-muted">
        <div className="font-semibold text-text">ملاحظة قانونية</div>
        <p className="mt-2">
          هذا الموقع مخصص لاكتشاف الأفلام والمسلسلات عبر TMDB وتشغيل <b>العروض الدعائية (Trailers)</b>.
          لا يحتوي على بث محمي بحقوق النشر.
        </p>
      </div>
    </div>
  );
}
