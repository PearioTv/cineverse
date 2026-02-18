import type { EpisodeProgress, MediaType, WatchlistItem } from "./types";

const KEY_PROGRESS = "cineverse.progress.v1";
const KEY_WATCHLIST = "cineverse.watchlist.v1";

function safeParse<T>(v: string | null, fallback: T): T {
  try { return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}

export function getAllProgress(): EpisodeProgress[] {
  return safeParse(localStorage.getItem(KEY_PROGRESS), []);
}

export function setAllProgress(items: EpisodeProgress[]) {
  localStorage.setItem(KEY_PROGRESS, JSON.stringify(items.slice(0, 200)));
}

export function upsertProgress(entry: EpisodeProgress) {
  const all = getAllProgress();
  const idx = all.findIndex(x =>
    x.mediaType === entry.mediaType &&
    x.id === entry.id &&
    (entry.mediaType === "movie" ? true : (x.season === entry.season && x.episode === entry.episode))
  );
  if (idx >= 0) all[idx] = entry; else all.unshift(entry);
  all.sort((a,b) => b.updatedAt - a.updatedAt);
  setAllProgress(all);
}

export function getContinueWatching(limit = 20): EpisodeProgress[] {
  return getAllProgress().filter(p => p.progress > 1 && p.progress < 97).slice(0, limit);
}

export function getWatchlist(): WatchlistItem[] {
  return safeParse(localStorage.getItem(KEY_WATCHLIST), []);
}

export function toggleWatchlist(item: WatchlistItem) {
  const all = getWatchlist();
  const idx = all.findIndex(x => x.mediaType === item.mediaType && x.id === item.id);
  if (idx >= 0) all.splice(idx, 1);
  else all.unshift(item);
  localStorage.setItem(KEY_WATCHLIST, JSON.stringify(all.slice(0, 500)));
  return all;
}

export function inWatchlist(mediaType: MediaType, id: number) {
  return getWatchlist().some(x => x.mediaType === mediaType && x.id === id);
}
