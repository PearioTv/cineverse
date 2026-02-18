export type MediaType = "movie" | "tv";

export interface TMDBGenre { id: number; name: string; }

export interface TMDBVideo {
  key: string;
  site: string;
  type: string;
  name: string;
  official?: boolean;
}

export interface EpisodeProgress {
  mediaType: MediaType;
  id: number;
  season?: number;
  episode?: number;
  currentTime: number;
  duration: number;
  progress: number; // %
  updatedAt: number; // epoch ms
}

export interface WatchlistItem {
  mediaType: MediaType;
  id: number;
  addedAt: number;
}
