import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Film } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [q, setQ] = React.useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-white/10 bg-bg/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 border border-white/10">
            <Film size={18} />
          </span>
          <span className="tracking-wide">{import.meta.env.VITE_APP_NAME ?? "CineVerse"}</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-4 text-sm text-muted mr-auto">
          <NavLink to="/" className={({isActive}) => isActive ? "text-text" : "hover:text-text"}>الرئيسية</NavLink>
          <NavLink to="/search" className={({isActive}) => isActive ? "text-text" : "hover:text-text"}>البحث</NavLink>
        </nav>

        <form onSubmit={onSubmit} className="mr-auto sm:mr-0 w-full sm:w-[360px]">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن فيلم أو مسلسل..."
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-10 py-2 text-sm outline-none focus:border-white/20"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
