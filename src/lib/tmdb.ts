import type { MediaType, TMDBGenre, TMDBVideo } from "./types";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

export const imgUrl = (path: string | null, size: "w342"|"w500"|"w780"|"original" = "w500") =>
  path ? `${IMG_BASE}/${size}${path}` : "";

function getKey(): string {
  const k = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
  if (!k) throw new Error("Missing TMDB key. Put VITE_TMDB_API_KEY in .env");
  return k;
}

async function tmdb<T>(path: string, params: Record<string, any> = {}): Promise<T> {
  const url = new URL(TMDB_BASE + path);
  url.searchParams.set("api_key", getKey());
  url.searchParams.set("language", "ar-SA");
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  return res.json();
}

export async function getTrending() { return tmdb<{results:any[]}>("/trending/all/week"); }
export async function getTopRatedMovies() { return tmdb<{results:any[]}>("/movie/top_rated"); }
export async function getTopRatedTV() { return tmdb<{results:any[]}>("/tv/top_rated"); }
export async function getRecentlyAddedMovies() { return tmdb<{results:any[]}>("/movie/now_playing"); }
export async function getRecentlyAddedTV() { return tmdb<{results:any[]}>("/tv/on_the_air"); }
export async function getGenres(mediaType: MediaType) { return tmdb<{genres: TMDBGenre[]}>(`/genre/${mediaType}/list`); }
export async function discover(mediaType: MediaType, params: Record<string, any>) {
  return tmdb<{results:any[], total_pages:number}>(`/discover/${mediaType}`, params);
}
export async function searchMulti(query: string, page = 1) {
  return tmdb<{results:any[], total_pages:number}>(`/search/multi`, { query, page, include_adult: "false" });
}
export async function getDetails(mediaType: MediaType, id: number) {
  return tmdb<any>(`/${mediaType}/${id}`, { append_to_response: "videos,credits,content_ratings,release_dates" });
}
export async function getSeason(tvId: number, season: number) {
  return tmdb<any>(`/tv/${tvId}/season/${season}`);
}

export function pickTrailer(videos?: { results?: TMDBVideo[] }): TMDBVideo | null {
  const list = videos?.results ?? [];
  const yt = list.filter(v => v.site === "YouTube");
  const trailer = yt.find(v => /trailer/i.test(v.type)) ?? yt.find(v => /teaser/i.test(v.type)) ?? yt[0];
  return trailer ?? null;
}
