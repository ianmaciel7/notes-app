import type { ObjectIconTone } from "../../../lib/space-object-types";

export interface ToneStyle {
  bg: string;
  text: string;
  border: string;
  hoverBg: string;
  divider: string;
}

export const toneStyles: Record<ObjectIconTone, ToneStyle> = {
  amber: {
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    hoverBg: "hover:bg-amber-500/20 dark:hover:bg-amber-500/30",
    divider: "border-amber-300/80 dark:border-amber-700/80",
  },
  blue: {
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    hoverBg: "hover:bg-blue-500/20 dark:hover:bg-blue-500/30",
    divider: "border-blue-300/80 dark:border-blue-700/80",
  },
  cyan: {
    bg: "bg-cyan-500/10 dark:bg-cyan-500/20",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-200 dark:border-cyan-800",
    hoverBg: "hover:bg-cyan-500/20 dark:hover:bg-cyan-500/30",
    divider: "border-cyan-300/80 dark:border-cyan-700/80",
  },
  emerald: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    hoverBg: "hover:bg-emerald-500/20 dark:hover:bg-emerald-500/30",
    divider: "border-emerald-300/80 dark:border-emerald-700/80",
  },
  fuchsia: {
    bg: "bg-fuchsia-500/10 dark:bg-fuchsia-500/20",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    border: "border-fuchsia-200 dark:border-fuchsia-800",
    hoverBg: "hover:bg-fuchsia-500/20 dark:hover:bg-fuchsia-500/30",
    divider: "border-fuchsia-300/80 dark:border-fuchsia-700/80",
  },
  gray: {
    bg: "bg-slate-500/10 dark:bg-slate-500/20",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-800",
    hoverBg: "hover:bg-slate-500/20 dark:hover:bg-slate-500/30",
    divider: "border-slate-300/80 dark:border-slate-700/80",
  },
  green: {
    bg: "bg-green-500/10 dark:bg-green-500/20",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
    hoverBg: "hover:bg-green-500/20 dark:hover:bg-green-500/30",
    divider: "border-green-300/80 dark:border-green-700/80",
  },
  indigo: {
    bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800",
    hoverBg: "hover:bg-indigo-500/20 dark:hover:bg-indigo-500/30",
    divider: "border-indigo-300/80 dark:border-indigo-700/80",
  },
  lime: {
    bg: "bg-lime-500/10 dark:bg-lime-500/20",
    text: "text-lime-600 dark:text-lime-400",
    border: "border-lime-200 dark:border-lime-800",
    hoverBg: "hover:bg-lime-500/20 dark:hover:bg-lime-500/30",
    divider: "border-lime-300/80 dark:border-lime-700/80",
  },
  neutral: {
    bg: "bg-muted/80",
    text: "text-foreground",
    border: "border-border",
    hoverBg: "hover:bg-muted",
    divider: "border-border",
  },
  orange: {
    bg: "bg-orange-500/10 dark:bg-orange-500/20",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
    hoverBg: "hover:bg-orange-500/20 dark:hover:bg-orange-500/30",
    divider: "border-orange-300/80 dark:border-orange-700/80",
  },
  pink: {
    bg: "bg-pink-500/10 dark:bg-pink-500/20",
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-200 dark:border-pink-800",
    hoverBg: "hover:bg-pink-500/20 dark:hover:bg-pink-500/30",
    divider: "border-pink-300/80 dark:border-pink-700/80",
  },
  purple: {
    bg: "bg-purple-500/10 dark:bg-purple-500/20",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    hoverBg: "hover:bg-purple-500/20 dark:hover:bg-purple-500/30",
    divider: "border-purple-300/80 dark:border-purple-700/80",
  },
  red: {
    bg: "bg-red-500/10 dark:bg-red-500/20",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    hoverBg: "hover:bg-red-500/20 dark:hover:bg-red-500/30",
    divider: "border-red-300/80 dark:border-red-700/80",
  },
  rose: {
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
    hoverBg: "hover:bg-rose-500/20 dark:hover:bg-rose-500/30",
    divider: "border-rose-300/80 dark:border-rose-700/80",
  },
  sky: {
    bg: "bg-sky-500/10 dark:bg-sky-500/20",
    text: "text-sky-600 dark:text-sky-400",
    border: "border-sky-200 dark:border-sky-800",
    hoverBg: "hover:bg-sky-500/20 dark:hover:bg-sky-500/30",
    divider: "border-sky-300/80 dark:border-sky-700/80",
  },
  teal: {
    bg: "bg-teal-500/10 dark:bg-teal-500/20",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-200 dark:border-teal-800",
    hoverBg: "hover:bg-teal-500/20 dark:hover:bg-teal-500/30",
    divider: "border-teal-300/80 dark:border-teal-700/80",
  },
  violet: {
    bg: "bg-violet-500/10 dark:bg-violet-500/20",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-200 dark:border-violet-800",
    hoverBg: "hover:bg-violet-500/20 dark:hover:bg-violet-500/30",
    divider: "border-violet-300/80 dark:border-violet-700/80",
  },
  yellow: {
    bg: "bg-yellow-500/10 dark:bg-yellow-500/20",
    text: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-200 dark:border-yellow-800",
    hoverBg: "hover:bg-yellow-500/20 dark:hover:bg-yellow-500/30",
    divider: "border-yellow-300/80 dark:border-yellow-700/80",
  },
};
