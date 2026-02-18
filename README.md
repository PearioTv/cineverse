# CineVerse (TMDB Browser) — Modern Streaming-like UI (Legal)

> **Important:** This project is a **catalog / discovery** UI using TMDB.  
> It **does not** provide copyrighted streams. The built-in player is for **trailers** (YouTube) or any **legal** embed URL you own/are allowed to use.

## ✨ Features
- Home: hero + horizontal rows (Trending / Top Rated / Recently Added / Continue Watching / Genres)
- Details: movie & TV, seasons/episodes grid, progress bars
- Search: query + filters (type, genre, year, rating)
- Player: fullscreen cinema mode, close button, next episode (TV), skip intro UI, remaining time UI
- Watch progress tracking via `postMessage` (generic) + localStorage
- Skeleton loading + lazy image loading + smooth transitions
- Responsive (mobile/tablet/desktop)

## 🧩 Tech
- Vite + React + TypeScript
- TailwindCSS
- React Router
- TMDB API (v3 key)

## ✅ Setup
1) Install deps
```bash
npm install
```

2) Create `.env` from example
```bash
cp .env.example .env
```

3) Put your TMDB key in `.env`
- `VITE_TMDB_API_KEY=YOUR_KEY`

4) Run
```bash
npm run dev
```

## 📦 Build
```bash
npm run build
npm run preview
```

## ⚠️ About embeds / players
The app contains a **trailer player** based on TMDB video results (YouTube).  
If you want to embed another player, you can pass a **legal** `embedUrl` in the Player page querystring.

Example (legal embed URL you control):
`/player?embedUrl=https%3A%2F%2Fexample.com%2Fmy-legal-player`

The app listens for generic progress events via `window.postMessage`:
```js
window.postMessage(JSON.stringify({
  type: "PLAYER_EVENT",
  data: { event:"timeupdate", currentTime: 120, duration: 7200, progress: 1.6, id:"299534", mediaType:"movie" }
}), "*")
```
