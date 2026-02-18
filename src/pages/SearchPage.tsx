import React from "react";
import { useSearchParams } from "react-router-dom";
import { PosterCard } from "../components/PosterCard";
import { SkeletonPoster } from "../components/Skeletons";
import type { MediaType, TMDBGenre } from "../lib/types";
import { discover, getGenres, searchMulti } from "../lib/tmdb";

function titleOf(item: any) { return item.title ?? item.name ?? ""; }

export default function SearchPage() {
  const [sp, setSp] = useSearchParams();
  const q = sp.get("q") ?? "";
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<any[]>([]);
  const [genresMovie, setGenresMovie] = React.useState<TMDBGenre[]>([]);
  const [genresTV, setGenresTV] = React.useState<TMDBGenre[]>([]);

  const [type, setType] = React.useState<"all"|MediaType>("all");
  const [genre, setGenre] = React.useState<string>("");
  const [year, setYear] = React.useState<string>("");
  const [rating, setRating] = React.useState<string>("");

  React.useEffect(() => {
    (async () => {
      const [gm, gt] = await Promise.all([getGenres("movie"), getGenres("tv")]);
      setGenresMovie(gm.genres);
      setGenresTV(gt.genres);
    })().catch(console.error);
  }, []);

  async function run() {
    setLoading(true);
    try {
      if (q && type === "all") {
        const res = await searchMulti(q, 1);
        setItems(res.results.filter((x) => ["movie","tv"].includes(x.media_type)));
      } else {
        const mt: MediaType = type === "all" ? "movie" : type;
        const params: any = { sort_by: "popularity.desc" };
        if (genre) params.with_genres = genre;
        if (rating) params["vote_average.gte"] = rating;
        if (year) {
          if (mt === "movie") params.primary_release_year = year;
          else params.first_air_date_year = year;
        }
        const res = await discover(mt, params);
        setItems(res.results.map((x) => ({ ...x, media_type: mt })));
      }
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { run().catch(console.error); /* eslint-disable-next-line */ }, [q]);

  function onApply() { run().catch(console.error); }

  const genreOptions = type === "tv" ? genresTV : genresMovie;

  return (
    <div className="pb-10">
      <h1 className="mt-6 text-2xl font-extrabold">البحث</h1>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 glass rounded-2xl p-4 border border-white/10">
          <div className="text-sm font-semibold">فلاتر</div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="text-xs text-muted">
              النوع (Movie/TV)
              <select value={type} onChange={(e) => setType(e.target.value as any)}
                className="mt-1 w-full rounded-2xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none">
                <option value="all">الكل</option>
                <option value="movie">فيلم</option>
                <option value="tv">مسلسل</option>
              </select>
            </label>

            <label className="text-xs text-muted">
              السنة
              <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024"
                className="mt-1 w-full rounded-2xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none" />
            </label>

            <label className="text-xs text-muted col-span-2">
              Genre
              <select value={genre} onChange={(e) => setGenre(e.target.value)}
                className="mt-1 w-full rounded-2xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none">
                <option value="">الكل</option>
                {genreOptions.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </label>

            <label className="text-xs text-muted col-span-2">
              Rating (>=)
              <input value={rating} onChange={(e) => setRating(e.target.value)} placeholder="7"
                className="mt-1 w-full rounded-2xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none" />
            </label>
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={onApply}
              className="flex-1 rounded-2xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white">
              تطبيق
            </button>
            <button onClick={() => { setType("all"); setGenre(""); setYear(""); setRating(""); }}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10">
              مسح
            </button>
          </div>

          <div className="mt-4 text-xs text-muted">تلميح: استخدم مربع البحث بالأعلى للبحث الفوري.</div>
        </div>

        <div className="lg:col-span-8">
          <div className="mt-2 flex items-center justify-between">
            <div className="text-sm text-muted">{loading ? "جارٍ التحميل..." : `${items.length} نتيجة`}</div>
            {q ? (
              <button onClick={() => { sp.delete("q"); setSp(sp); }}
                className="text-xs rounded-2xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10">
                إلغاء البحث النصي
              </button>
            ) : null}
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {loading ? Array.from({length: 12}).map((_, i) => <SkeletonPoster key={i} />) : null}
            {!loading ? items.map((item) => {
              const mt: MediaType = item.media_type === "tv" ? "tv" : "movie";
              return <PosterCard key={`${mt}-${item.id}`} item={item} mediaType={mt} title={titleOf(item)} subtitle={mt==="movie"?"فيلم":"مسلسل"} />;
            }) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
