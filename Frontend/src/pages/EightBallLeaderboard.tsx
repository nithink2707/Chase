import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, RefreshCw, Search, ChevronDown, ChevronUp, Minus, X, GitCompare, Calendar, Infinity } from "lucide-react";

// ── CHASE LOGO SVG COMPONENT ──
function ChaseLogo({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 12l10 10 10-10L12 2zm0 3.83L18.17 12 12 18.17 5.83 12 12 5.83z" />
    </svg>
  );
}

export interface Player {
  id: string;
  rank: number;
  prev_rank: number;
  name: string;
  elo: number; // Added Elo field
  matches: number;
  wins: number;
  losses: number;
  win_rate: number;
  Points: number;
}

// ── PROPS FOR DYNAMIC DATABASE DATA ──
interface LeaderboardProps {
  players?: Player[];
  isLoading?: boolean;
  onRefresh?: () => Promise<void> | void;
  onFilterChange?: (filter: "tournament" | "yearly" | "alltime") => void;
}

async function fetchMockLeaderboard(filter: "tournament" | "yearly" | "alltime"): Promise<Player[]> {
  await new Promise((r) => setTimeout(r, 600));

  const tournament: Player[] = [
    { id: "1",  rank: 1,  prev_rank: 1,  name: "Arjun Mehta",    elo: 1850, matches: 38, wins: 31, losses: 7,  win_rate: 81.6, Points: 162 },
    { id: "2",  rank: 2,  prev_rank: 4,  name: "Nithin R.",       elo: 1790, matches: 35, wins: 28, losses: 7,  win_rate: 80.0, Points: 160 },
    { id: "3",  rank: 3,  prev_rank: 2,  name: "Karan Verma",     elo: 1740, matches: 40, wins: 31, losses: 9,  win_rate: 77.5, Points: 155 },
    { id: "4",  rank: 4,  prev_rank: 3,  name: "Priya Nair",      elo: 1680, matches: 33, wins: 25, losses: 8,  win_rate: 75.8, Points: 152 },
    { id: "5",  rank: 5,  prev_rank: 5,  name: "Dev Rathore",     elo: 1620, matches: 29, wins: 21, losses: 8,  win_rate: 72.4, Points: 148 },
    { id: "6",  rank: 6,  prev_rank: 7,  name: "Rohan Gupta",     elo: 1580, matches: 28, wins: 20, losses: 8,  win_rate: 71.4, Points: 140 },
    { id: "7",  rank: 7,  prev_rank: 6,  name: "Sneha Kapoor",    elo: 1530, matches: 31, wins: 21, losses: 10, win_rate: 67.7, Points: 135 },
    { id: "8",  rank: 8,  prev_rank: 9,  name: "Vikram Shah",     elo: 1490, matches: 27, wins: 18, losses: 9,  win_rate: 66.6, Points: 130 },
    { id: "9",  rank: 9,  prev_rank: 8,  name: "Ananya Roy",      elo: 1450, matches: 25, wins: 16, losses: 9,  win_rate: 64.0, Points: 125 },
    { id: "10", rank: 10, prev_rank: 10, name: "Kabir Sharma",    elo: 1410, matches: 24, wins: 15, losses: 9,  win_rate: 62.5, Points: 120 },
    { id: "11", rank: 11, prev_rank: 12, name: "Siddharth Rao",   elo: 1380, matches: 22, wins: 13, losses: 9,  win_rate: 59.0, Points: 115 },
    { id: "12", rank: 12, prev_rank: 11, name: "Tanya Sen",       elo: 1320, matches: 20, wins: 11, losses: 9,  win_rate: 55.0, Points: 110 }
  ];

  const yearly: Player[] = [
    { id: "3",  rank: 1,  prev_rank: 2,  name: "Karan Verma",     elo: 2100, matches: 98, wins: 74, losses: 24, win_rate: 75.5, Points: 370 },
    { id: "1",  rank: 2,  prev_rank: 1,  name: "Arjun Mehta",     elo: 2050, matches: 90, wins: 67, losses: 23, win_rate: 74.4, Points: 362 },
  ];

  const alltime: Player[] = [
    { id: "1",  rank: 1,  prev_rank: 1,  name: "Arjun Mehta",     elo: 2400, matches: 320, wins: 255, losses: 65,  win_rate: 79.7, Points: 1280 },
    { id: "3",  rank: 2,  prev_rank: 3,  name: "Karan Verma",     elo: 2350, matches: 310, wins: 238, losses: 72,  win_rate: 76.8, Points: 1190 },
  ];

  return filter === "yearly" ? yearly : filter === "alltime" ? alltime : tournament;
}

const medals: Record<number, string> = { 1: "text-yellow-400", 2: "text-slate-300", 3: "text-amber-500" };

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

function Trend({ curr, prev }: { curr: number; prev: number }) {
  if (curr < prev) return <div className="flex items-center gap-0.5 text-emerald-400 text-[10px] font-bold"><ChevronUp size={12} />{prev - curr}</div>;
  if (curr > prev) return <div className="flex items-center gap-0.5 text-red-400 text-[10px] font-bold"><ChevronDown size={12} />{curr - prev}</div>;
  return <Minus size={12} className="text-on-surface-variant" />;
}

const INITIAL_VISIBLE = 10;
const PAGE_SIZE = 10;

const filterOptions = [
  { value: "tournament" as const, label: "Season 1", sublabel: "Current", icon: Trophy },
  { value: "yearly"    as const, label: "2026",      sublabel: "This Year", icon: Calendar },
  { value: "alltime"   as const, label: "All Time",  sublabel: "History",   icon: Infinity },
];

export default function EightBallLeaderboard({
  players: externalPlayers,
  isLoading: externalLoading,
  onRefresh,
  onFilterChange
}: LeaderboardProps) {
  const [internalPlayers, setInternalPlayers] = useState<Player[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [refreshing, setRefreshing]           = useState(false);
  const [visibleCount, setVisibleCount]       = useState(INITIAL_VISIBLE);
  const [search, setSearch]                   = useState("");
  const [compareIds, setCompareIds]           = useState<string[]>([]);
  const [lastUpdated, setLastUpdated]         = useState<Date | null>(null);
  const [timeFilter, setTimeFilter]           = useState<"tournament" | "yearly" | "alltime">("tournament");
  const [filterOpen, setFilterOpen]           = useState(false);

  const activePlayers = externalPlayers ?? internalPlayers;
  const activeLoading = externalLoading ?? loading;

  const loadInternal = useCallback(async (isRefresh = false) => {
    if (externalPlayers) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await fetchMockLeaderboard(timeFilter);
      setInternalPlayers(data);
      setLastUpdated(new Date());
      setVisibleCount(INITIAL_VISIBLE);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeFilter, externalPlayers]);

  useEffect(() => { loadInternal(); }, [timeFilter, loadInternal]);

  useEffect(() => {
    if (externalPlayers) setLastUpdated(new Date());
  }, [externalPlayers]);

  const handleFilterSelect = (val: "tournament" | "yearly" | "alltime") => {
    setTimeFilter(val);
    setFilterOpen(false);
    if (onFilterChange) onFilterChange(val);
  };

  const handleRefreshClick = async () => {
    setRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    } else {
      await loadInternal(true);
    }
    setRefreshing(false);
  };

  const filtered = activePlayers.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const visible = search ? filtered : filtered.slice(0, visibleCount);
  const hasMore = !search && visibleCount < filtered.length;

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 2
        ? [...prev, id]
        : prev
    );
  };
  const compareData = activePlayers.filter((p) => compareIds.includes(p.id));
  const activeFilter = filterOptions.find(f => f.value === timeFilter)!;

  if (activeLoading) {
    return (
      <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-4xl mx-auto space-y-3">
        <div className="h-8 w-48 bg-surface-container rounded-lg animate-pulse" />
        <div className="h-4 w-32 bg-surface-container rounded animate-pulse" />
        <div className="mt-6 rounded-xl border border-outline-variant/20 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-outline-variant/10">
              <div className="w-6 h-4 bg-surface-container rounded animate-pulse" />
              <div className="w-8 h-8 bg-surface-container rounded-full animate-pulse" />
              <div className="flex-1 h-4 bg-surface-container rounded animate-pulse" />
              <div className="w-10 h-4 bg-surface-container rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-4xl mx-auto">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-display font-black uppercase tracking-[0.3em] text-on-surface-variant">
            Know the best, beat the rest
          </span>

          <div className="flex items-center shrink-0">
            <ChaseLogo className="h-6 w-auto text-primary shrink-0" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tighter text-white">
            8-Ball Pool
            <span className="block text-base sm:text-lg italic text-primary font-bold tracking-tight normal-case">
              LEADERBOARD
            </span>
          </h1>

          {/* Time Filter Dropdown */}
          <div className="relative self-start sm:self-auto">
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className="group flex items-center gap-2.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-surface-container border border-outline-variant/20 hover:border-primary/40 hover:bg-surface-container-high transition-all duration-200"
            >
              <activeFilter.icon size={13} className="text-primary" />
              <div className="text-left">
                <p className="text-white font-display font-black text-xs uppercase tracking-wider leading-none">{activeFilter.label}</p>
                <p className="text-on-surface-variant text-[9px] font-display uppercase tracking-wider leading-none mt-0.5">{activeFilter.sublabel}</p>
              </div>
              <ChevronDown
                size={12}
                className={`text-on-surface-variant transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-44 bg-[#1A1A1A] border border-outline-variant/20 rounded-xl overflow-hidden shadow-[0_16px_40px_-8px_rgba(0,0,0,0.8)] z-20"
                >
                  <div className="px-3 pt-3 pb-1">
                    <p className="text-[9px] font-display font-black uppercase tracking-[0.2em] text-on-surface-variant/50">Time Period</p>
                  </div>
                  {filterOptions.map(({ value, label, sublabel, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => handleFilterSelect(value)}
                      className={`w-full flex items-center gap-3 px-3 py-3 transition-all duration-150 ${
                        timeFilter === value
                          ? "bg-primary/10 text-white"
                          : "text-on-surface-variant hover:text-white hover:bg-surface-container"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        timeFilter === value ? "bg-primary/20" : "bg-surface-container"
                      }`}>
                        <Icon size={13} className={timeFilter === value ? "text-primary" : "text-on-surface-variant"} />
                      </div>
                      <div className="text-left">
                        <p className="font-display font-black text-xs uppercase tracking-wider leading-none">{label}</p>
                        <p className="text-[9px] font-display uppercase tracking-wider leading-none mt-0.5 opacity-60">{sublabel}</p>
                      </div>
                      {timeFilter === value && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </button>
                  ))}
                  <div className="h-1" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {lastUpdated && (
          <span className="block mt-2 text-[10px] text-on-surface-variant/50 font-display uppercase tracking-wider">
            Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </motion.div>

      {/* Search Bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4">
        <div className="flex items-center gap-3 bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-3 focus-within:border-primary/40 transition-colors">
          <Search size={16} className="text-on-surface-variant shrink-0" />
          <input
            type="text"
            placeholder="Search player name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-on-surface w-full placeholder:text-on-surface-variant/40 font-sans"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-on-surface-variant hover:text-white transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
        {search && (
          <p className="text-[10px] text-on-surface-variant mt-2 font-display uppercase tracking-wider">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"
          </p>
        )}
      </motion.div>

      {/* Compare Hint */}
      {compareIds.length === 0 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-[10px] text-on-surface-variant/40 font-display uppercase tracking-wider mb-3 flex items-center gap-1">
          <GitCompare size={10} /> Tap any two players to compare
        </motion.p>
      )}

      {/* Player Comparison Card */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mb-4 rounded-2xl border border-outline-variant/20 overflow-hidden bg-surface-container-low"
          >
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-outline-variant/20 bg-surface-container">
              <div className="flex items-center gap-2">
                <GitCompare size={14} className="text-primary" />
                <span className="font-display font-black uppercase tracking-widest text-white text-xs">Player Comparison</span>
              </div>
              <button onClick={() => setCompareIds([])} className="text-on-surface-variant hover:text-white transition-colors">
                <X size={15} />
              </button>
            </div>

            {compareIds.length === 1 ? (
              <div className="px-5 py-5 text-center text-on-surface-variant text-xs sm:text-sm font-display">
                Select one more player from the list to compare.
              </div>
            ) : (
              <div className="p-4 sm:p-5">
                <div className="grid grid-cols-[1fr_2.5rem_1fr] sm:grid-cols-[1fr_3rem_1fr] gap-2 sm:gap-3 items-center mb-6">
                  {compareData.map((p, idx) => (
                    <div key={p.id} className={`flex flex-col items-center gap-2 ${idx === 1 ? "order-3" : "order-1"}`}>
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-display font-black text-white text-xs sm:text-base ring-2 ${
                        idx === 0 ? "bg-secondary/20 ring-secondary/50" : "bg-primary/20 ring-primary/50"
                      }`}>
                        {initials(p.name)}
                      </div>
                      <div className="text-center min-w-0 w-full">
                        <p className="font-display font-black text-white text-xs sm:text-sm truncate">{p.name}</p>
                        <p className={`text-[9px] sm:text-[10px] font-display uppercase tracking-wider ${medals[p.rank] ?? "text-on-surface-variant"}`}>
                          Rank #{p.rank}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="order-2 flex items-center justify-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center">
                      <span className="font-display font-black text-[9px] sm:text-[10px] text-on-surface-variant uppercase tracking-wider">VS</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Elo Rating",     key: "elo",      suffix: "",  higher: true,  colorA: "bg-amber-400",  colorB: "bg-amber-400"  },
                    { label: "Matches Played", key: "matches",  suffix: "",  higher: true,  colorA: "bg-secondary",  colorB: "bg-primary"    },
                    { label: "Wins",           key: "wins",     suffix: "",  higher: true,  colorA: "bg-emerald-400", colorB: "bg-emerald-400" },
                    { label: "Losses",         key: "losses",   suffix: "",  higher: false, colorA: "bg-red-400",    colorB: "bg-red-400"    },
                    { label: "Win Rate",       key: "win_rate", suffix: "%", higher: true,  colorA: "bg-secondary",  colorB: "bg-primary"    },
                    { label: "Points",         key: "Points",   suffix: "",  higher: true,  colorA: "bg-secondary",  colorB: "bg-primary"    },
                  ].map(({ label, key, suffix, higher, colorA, colorB }) => {
                    const a = compareData[0][key as keyof Player] as number;
                    const b = compareData[1][key as keyof Player] as number;
                    const max = Math.max(a, b) || 1;
                    const aWins = higher ? a >= b : a <= b;
                    const bWins = higher ? b >= a : b <= a;
                    return (
                      <div key={key}>
                        <p className="text-[10px] font-display font-black uppercase tracking-widest text-on-surface-variant text-center mb-2">{label}</p>
                        <div className="grid grid-cols-[1fr_2rem_1fr] sm:grid-cols-[1fr_5rem_1fr] gap-2 items-center">
                          <div className="flex items-center gap-1.5 sm:gap-2 justify-end">
                            <span className={`font-display font-black text-sm sm:text-base ${aWins ? "text-white" : "text-on-surface-variant/50"}`}>{a}{suffix}</span>
                            <div className="w-14 sm:w-24 h-2 bg-surface-container-highest rounded-full overflow-hidden flex justify-end">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(a / max) * 100}%` }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                                className={`h-full rounded-full ${aWins ? colorA : "opacity-20 bg-outline"}`}
                              />
                            </div>
                          </div>
                          <div className="flex justify-center">
                            {a === b ? (
                              <span className="text-[8px] sm:text-[9px] font-display uppercase tracking-wider text-on-surface-variant/40 px-1.5 py-0.5 rounded-full border border-outline-variant/20">tie</span>
                            ) : (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center ${aWins ? colorA : colorB}`}
                              >
                                <ChevronUp size={10} className="text-background" style={{ transform: aWins ? "rotate(-90deg)" : "rotate(90deg)" }} />
                              </motion.div>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 justify-start">
                            <div className="w-14 sm:w-24 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(b / max) * 100}%` }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                                className={`h-full rounded-full ${bWins ? colorB : "opacity-20 bg-outline"}`}
                              />
                            </div>
                            <span className={`font-display font-black text-sm sm:text-base ${bWins ? "text-white" : "text-on-surface-variant/50"}`}>{b}{suffix}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-4">
        {visible.length === 0 ? (
          <div className="py-12 text-center text-on-surface-variant font-display text-sm bg-surface-container rounded-xl border border-outline-variant/20">
            No players found.
          </div>
        ) : (
          <>
            {/* 📱 MOBILE CARD VIEW (< md) */}
            <div className="md:hidden space-y-2.5">
              <AnimatePresence>
                {visible.map((p, i) => {
                  const isSelected = compareIds.includes(p.id);
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.03 }}
                      onClick={() => toggleCompare(p.id)}
                      className={`p-3.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? "bg-primary/10 border-primary"
                          : "bg-surface-container-low border-outline-variant/20 hover:border-outline-variant/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`font-display font-black text-base w-5 text-center shrink-0 ${medals[p.rank] ?? "text-on-surface-variant"}`}>
                          {p.rank}
                        </span>

                        <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-display font-black text-white text-xs ${
                          p.rank === 1 ? "bg-yellow-400/20 ring-1 ring-yellow-400/50" :
                          p.rank === 2 ? "bg-slate-300/20 ring-1 ring-slate-300/30" :
                          p.rank === 3 ? "bg-amber-500/20 ring-1 ring-amber-500/30" :
                          "bg-surface-container-highest"
                        }`}>
                          {initials(p.name)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-display font-bold text-sm text-white truncate">{p.name}</p>
                            <Trend curr={p.rank} prev={p.prev_rank} />
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-display font-bold text-amber-400 uppercase tracking-wider">{p.elo} ELO</span>
                            {p.rank <= 3 && (
                              <span className={`text-[9px] font-display uppercase tracking-wider ${medals[p.rank]}`}>
                                {p.rank === 1 ? "🥇 Gold" : p.rank === 2 ? "🥈 Silver" : "🥉 Bronze"}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-display font-black text-sm text-secondary">{p.Points} <span className="text-[10px] font-normal text-on-surface-variant">PTS</span></p>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-outline-variant/10 flex items-center justify-between text-xs font-display">
                        <div className="flex items-center gap-3">
                          <span className="text-on-surface-variant"><strong className="text-white font-bold">{p.matches}</strong> M</span>
                          <span className="text-emerald-400"><strong className="font-bold">{p.wins}</strong> W</span>
                          <span className="text-red-400"><strong className="font-bold">{p.losses}</strong> L</span>
                        </div>

                        <div className="flex items-center gap-2 w-28">
                          <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${p.win_rate}%` }}
                              transition={{ duration: 0.7, delay: 0.1 + i * 0.03, ease: "easeOut" }}
                              className={`h-full rounded-full ${
                                p.rank === 1 ? "bg-yellow-400" :
                                p.rank === 2 ? "bg-slate-300" :
                                p.rank === 3 ? "bg-amber-500" :
                                "bg-primary"
                              }`}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-on-surface-variant w-8 text-right shrink-0">{p.win_rate}%</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* 🖥️ DESKTOP TABLE VIEW (≥ md) */}
            <div className="hidden md:block rounded-xl border border-outline-variant/20 overflow-hidden">
              <div className="grid grid-cols-[2rem_1fr_4rem_4rem_3rem_3rem_5rem_3rem_2.5rem] gap-2 px-4 py-3 bg-surface-container-high border-b border-outline-variant/20">
                {["#", "Player", "Elo", "Played", "W", "L", "Win %", "Pts", "±"].map((h) => (
                  <span key={h} className={`text-[10px] font-display font-black uppercase tracking-[0.15em] ${h === "Elo" ? "text-amber-400 text-center" : "text-on-surface-variant"}`}>{h}</span>
                ))}
              </div>

              <AnimatePresence>
                {visible.map((p, i) => {
                  const isSelected = compareIds.includes(p.id);
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.03 }}
                      onClick={() => toggleCompare(p.id)}
                      className={`grid grid-cols-[2rem_1fr_4rem_4rem_3rem_3rem_5rem_3rem_2.5rem] gap-2 px-4 py-3.5 items-center border-b border-outline-variant/10 last:border-0 cursor-pointer transition-all duration-150 ${
                        isSelected ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-surface-container"
                      }`}
                    >
                      <span className={`font-display font-black text-sm ${medals[p.rank] ?? "text-on-surface-variant"}`}>{p.rank}</span>

                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-display font-black text-white text-xs ${
                          p.rank === 1 ? "bg-yellow-400/20 ring-1 ring-yellow-400/50" :
                          p.rank === 2 ? "bg-slate-300/20 ring-1 ring-slate-300/30" :
                          p.rank === 3 ? "bg-amber-500/20 ring-1 ring-amber-500/30" :
                          "bg-surface-container-highest"
                        }`}>
                          {initials(p.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-display font-bold text-sm text-white truncate">{p.name}</p>
                          {p.rank <= 3 && (
                            <p className={`text-[9px] font-display uppercase tracking-wider ${medals[p.rank]}`}>
                              {p.rank === 1 ? "🥇 Gold" : p.rank === 2 ? "🥈 Silver" : "🥉 Bronze"}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Elo Column */}
                      <span className="font-display font-bold text-sm text-amber-400 text-center">{p.elo}</span>

                      <span className="font-display font-bold text-sm text-on-surface-variant text-center">{p.matches}</span>
                      <span className="font-display font-bold text-sm text-emerald-400 text-center">{p.wins}</span>
                      <span className="font-display font-bold text-sm text-red-400 text-center">{p.losses}</span>

                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${p.win_rate}%` }}
                            transition={{ duration: 0.7, delay: 0.1 + i * 0.03, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              p.rank === 1 ? "bg-yellow-400" :
                              p.rank === 2 ? "bg-slate-300" :
                              p.rank === 3 ? "bg-amber-500" :
                              "bg-primary"
                            }`}
                          />
                        </div>
                        <span className="text-[10px] font-display font-bold text-on-surface-variant w-7 shrink-0 text-right">{p.win_rate}%</span>
                      </div>

                      <span className="font-display font-bold text-sm text-secondary text-center">{p.Points}</span>

                      <div className="flex justify-center">
                        <Trend curr={p.rank} prev={p.prev_rank} />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </>
        )}
      </motion.div>

      {/* Show More */}
      {hasMore && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mb-4">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="group flex items-center gap-2 px-6 py-2.5 rounded-full border border-outline-variant/30 text-on-surface-variant hover:text-white hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 font-display font-bold text-xs uppercase tracking-wider"
          >
            <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform duration-200" />
            Show More
            <span className="text-on-surface-variant/50 font-normal">({filtered.length - visibleCount} remaining)</span>
          </button>
        </motion.div>
      )}

      {/* Refresh */}
      <div className="flex justify-center mb-8">
        <button
          onClick={handleRefreshClick}
          disabled={refreshing}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-surface-container border border-outline-variant/20 text-on-surface-variant hover:text-white transition-colors font-display font-bold text-xs uppercase tracking-wider disabled:opacity-50"
        >
          <motion.div
            animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
            transition={refreshing ? { duration: 0.8, repeat: Infinity, ease: "linear" } : {}}
          >
            <RefreshCw size={13} />
          </motion.div>
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

    </div>
  );
}