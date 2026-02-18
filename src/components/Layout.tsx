import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Outlet key={pathname} />
        </div>
      </main>
      <footer className="py-10 text-center text-sm text-muted">
        <div>© {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME ?? "CineVerse"} — TMDB catalog</div>
      </footer>
    </div>
  );
}
