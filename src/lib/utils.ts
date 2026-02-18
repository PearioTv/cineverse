import { clsx } from "clsx";

export function cn(...args: any[]) { return clsx(args); }

export function yearFromDate(d?: string) { return d ? d.slice(0,4) : ""; }

export function formatRuntime(mins?: number) {
  if (!mins || mins <= 0) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}س ${m}د` : `${m}د`;
}

export function formatVote(v?: number) {
  if (v === undefined || v === null) return "—";
  return (Math.round(v * 10) / 10).toFixed(1);
}
