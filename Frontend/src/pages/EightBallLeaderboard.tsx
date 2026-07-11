import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, RefreshCw, Search, ChevronDown, ChevronUp, Minus, X, GitCompare } from "lucide-react";

interface Player {
  id: string;
  rank: number;
  prev_rank: number;
  name: string;
  matches: number;
  wins: number;
  losses: number;
  win_rate: number;
  Points: number;
}

async function fetchLeaderboard(filter: "tournament" | "yearly" | "alltime"): Promise<Player[]> {
  await new Promise((r) => setTimeout(r, 900));

  const tournament = [
    { id: "1",  rank: 1,  prev_rank: 1,  name: "Arjun Mehta",    matches: 38, wins: 31, losses: 7,  win_rate: 81.6, Points: 162 },
    { id: "2",  rank: 2,  prev_rank: 4,  name: "Nithin R.",       matches: 35, wins: 28, losses: 7,  win_rate: 80.0, Points: 160 },
    { id: "3",  rank: 3,  prev_rank: 2,  name: "Karan Verma",     matches: 40, wins: 31, losses: 9,  win_rate: 77.5, Points: 155 },
    { id: "4",  rank: 4,  prev_rank: 3,  name: "Priya Nair",      matches: 33, wins: 25, losses: 8,  win_rate: 75.8, Points: 152 },
    { id: "5",  rank: 5,  prev_rank: 5,  name: "Dev Rathore",     matches: 29, wins: 21, losses: 8,  win_rate: 72.4, Points: 148 },
    { id: "6",  rank: 6,  prev_rank: 8,  name: "Ananya Shah",     matches: 27, wins: 19, losses: 8,  win_rate: 70.4, Points: 140 },
    { id: "7",  rank: 7,  prev_rank: 6,  name: "Rohan Das",       matches: 31, wins: 21, losses: 10, win_rate: 67.7, Points: 135 },
    { id: "8",  rank: 8,  prev_rank: 7,  name: "Vikram Rao",      matches: 25, wins: 16, losses: 9,  win_rate: 64.0, Points: 128 },
    { id: "9",  rank: 9,  prev_rank: 11, name: "Meera Pillai",    matches: 22, wins: 14, losses: 8,  win_rate: 63.6, Points: 127 },
    { id: "10", rank: 10, prev_rank: 9,  name: "Aditya Bose",     matches: 24, wins: 15, losses: 9,  win_rate: 62.5, Points: 125 },
  ];

  const yearly = [
    { id: "3",  rank: 1,  prev_rank: 2,  name: "Karan Verma",     matches: 98, wins: 74, losses: 24, win_rate: 75.5, Points: 370 },
    { id: "1",  rank: 2,  prev_rank: 1,  name: "Arjun Mehta",     matches: 90, wins: 67, losses: 23, win_rate: 74.4, Points: 362 },
    { id: "4",  rank: 3,  prev_rank: 4,  name: "Priya Nair",      matches: 85, wins: 61, losses: 24, win_rate: 71.8, Points: 340 },
    { id: "2",  rank: 4,  prev_rank: 3,  name: "Nithin R.",       matches: 80, wins: 56, losses: 24, win_rate: 70.0, Points: 328 },
    { id: "6",  rank: 5,  prev_rank: 7,  name: "Ananya Shah",     matches: 75, wins: 51, losses: 24, win_rate: 68.0, Points: 306 },
    { id: "5",  rank: 6,  prev_rank: 5,  name: "Dev Rathore",     matches: 72, wins: 48, losses: 24, win_rate: 66.7, Points: 290 },
    { id: "7",  rank: 7,  prev_rank: 6,  name: "Rohan Das",       matches: 70, wins: 45, losses: 25, win_rate: 64.3, Points: 275 },
    { id: "8",  rank: 8,  prev_rank: 8,  name: "Vikram Rao",      matches: 65, wins: 40, losses: 25, win_rate: 61.5, Points: 258 },
    { id: "9",  rank: 9,  prev_rank: 10, name: "Meera Pillai",    matches: 60, wins: 36, losses: 24, win_rate: 60.0, Points: 242 },
    { id: "10", rank: 10, prev_rank: 9,  name: "Aditya Bose",     matches: 58, wins: 34, losses: 24, win_rate: 58.6, Points: 230 },
  ];

  const alltime = [
    { id: "1",  rank: 1,  prev_rank: 1,  name: "Arjun Mehta",     matches: 320, wins: 255, losses: 65,  win_rate: 79.7, Points: 1280 },
    { id: "3",  rank: 2,  prev_rank: 3,  name: "Karan Verma",     matches: 310, wins: 238, losses: 72,  win_rate: 76.8, Points: 1190 },
    { id: "4",  rank: 3,  prev_rank: 2,  name: "Priya Nair",      matches: 290, wins: 215, losses: 75,  win_rate: 74.1, Points: 1105 },
    { id: "2",  rank: 4,  prev_rank: 4,  name: "Nithin R.",       matches: 280, wins: 203, losses: 77,  win_rate: 72.5, Points: 1050 },
    { id: "5",  rank: 5,  prev_rank: 5,  name: "Dev Rathore",     matches: 260, wins: 182, losses: 78,  win_rate: 70.0, Points:  980 },
    { id: "7",  rank: 6,  prev_rank: 7,  name: "Rohan Das",       matches: 255, wins: 175, losses: 80,  win_rate: 68.6, Points:  940 },
    { id: "6",  rank: 7,  prev_rank: 6,  name: "Ananya Shah",     matches: 240, wins: 161, losses: 79,  win_rate: 67.1, Points:  890 },
    { id: "8",  rank: 8,  prev_rank: 8,  name: "Vikram Rao",      matches: 220, wins: 143, losses: 77,  win_rate: 65.0, Points:  830 },
    { id: "9",  rank: 9,  prev_rank: 9,  name: "Meera Pillai",    matches: 200, wins: 126, losses: 74,  win_rate: 63.0, Points:  770 },
    { id: "10", rank: 10, prev_rank: 10, name: "Aditya Bose",     matches: 195, wins: 119, losses: 76,  win_rate: 61.0, Points:  730 },
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

const INITIAL_VISIBLE = 15;

export default function EightBallLeaderboard() {
  const [allPlayers, setAllPlayers]     = useState<Player[]>([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [search, setSearch]             = useState("");
  const [compareIds, setCompareIds]     = useState<string[]>([]);
  const [lastUpdated, setLastUpdated]   = useState<Date | null>(null);
  const [timeFilter, setTimeFilter] = useState<"tournament" | "yearly" | "alltime">("tournament");
  const [filterOpen, setFilterOpen] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await fetchLeaderboard(timeFilter);
      setAllPlayers(data);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [timeFilter]);

  const filtered = allPlayers.filter((p) =>
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
  const compareData = allPlayers.filter((p) => compareIds.includes(p.id));

  if (loading) {
    return (
      <div className="p-6 pb-24 md:pb-6 max-w-4xl mx-auto space-y-3">
        <div className="h-8 w-48 bg-surface-container rounded-lg animate-pulse" />
        <div className="h-4 w-32 bg-surface-container rounded animate-pulse" />
        <div className="mt-6 rounded-xl border border-outline-variant/20 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-outline-variant/10">
              <div className="w-6 h-4 bg-surface-container rounded animate-pulse" />
              <div className="w-8 h-8 bg-surface-container rounded-full animate-pulse" />
              <div className="flex-1 h-4 bg-surface-container rounded animate-pulse" />
              <div className="w-10 h-4 bg-surface-container rounded animate-pulse" />
              <div className="w-10 h-4 bg-surface-container rounded animate-pulse" />
              <div className="w-20 h-2 bg-surface-container rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 md:pb-6 max-w-4xl mx-auto">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
  <div className="flex items-center gap-3 mb-1">
    <span className="text-[10px] font-display font-black uppercase tracking-[0.3em] text-on-surface-variant">
      Know the best, beat the rest
    </span>
  </div>
  <div className="flex items-end justify-between">
    <h1 className="text-3xl font-black font-display uppercase tracking-tighter text-white">
      8-Ball Pool
      <span className="block text-lg italic text-primary font-bold tracking-tight normal-case">
        LEADERBOARD
      </span>
    </h1>

    {/* Filter dropdown */}
    <div className="relative mb-1">
      <button
        onClick={() => setFilterOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface-variant hover:text-white hover:border-white/20 transition-colors font-display font-bold text-xs uppercase tracking-wider"
      >
        {{ season: "Season 1", yearly: "2026", alltime: "All Time" }[timeFilter]}
        <ChevronDown size={12} className={`transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {filterOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-36 bg-surface-container-highest border border-outline-variant/20 rounded-xl overflow-hidden shadow-xl z-20"
          >
            {([ 
              { value: "season",  label: "Season 1" },
              { value: "yearly",  label: "2026"     },
              { value: "alltime", label: "All Time"  },
            ] as const).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => { setTimeFilter(value); setFilterOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 text-xs font-display font-bold uppercase tracking-wider transition-colors ${
                  timeFilter === value
                    ? "text-white bg-primary/10"
                    : "text-on-surface-variant hover:text-white hover:bg-surface-container"
                }`}
              >
                {label}
                {timeFilter === value && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>

  {lastUpdated && (
    <span className="text-[10px] text-on-surface-variant/50 font-display uppercase tracking-wider">
      Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </span>
  )}
</motion.div>

      {/* Search bar */}
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

      {/* Compare hint */}
      {compareIds.length === 0 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-[10px] text-on-surface-variant/40 font-display uppercase tracking-wider mb-3 flex items-center gap-1">
          <GitCompare size={10} /> Tap any two rows below to compare players
        </motion.p>
      )}

      {/* Comparison Section */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mb-4 rounded-2xl border border-outline-variant/20 overflow-hidden bg-surface-container-low"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant/20 bg-surface-container">
              <div className="flex items-center gap-2">
                <GitCompare size={14} className="text-primary" />
                <span className="font-display font-black uppercase tracking-widest text-white text-xs">Player Comparison</span>
              </div>
              <button onClick={() => setCompareIds([])} className="text-on-surface-variant hover:text-white transition-colors">
                <X size={15} />
              </button>
            </div>

            {compareIds.length === 1 ? (
              <div className="px-5 py-5 text-center text-on-surface-variant text-sm font-display">
                Select one more player from the table below to compare.
              </div>
            ) : (
              <div className="p-5">
                <div className="grid grid-cols-[1fr_3rem_1fr] gap-3 items-center mb-6">
                  {compareData.map((p, idx) => (
                    <div key={p.id} className={`flex flex-col items-center gap-2 ${idx === 1 ? "order-3" : "order-1"}`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-black text-white text-base ring-2 ${
                        idx === 0 ? "bg-secondary/20 ring-secondary/50" : "bg-primary/20 ring-primary/50"
                      }`}>
                        {initials(p.name)}
                      </div>
                      <div className="text-center">
                        <p className="font-display font-black text-white text-sm">{p.name}</p>
                        <p className={`text-[10px] font-display uppercase tracking-wider ${medals[p.rank] ?? "text-on-surface-variant"}`}>
                          Rank #{p.rank}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="order-2 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center">
                      <span className="font-display font-black text-[10px] text-on-surface-variant uppercase tracking-wider">VS</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
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
                        <div className="grid grid-cols-[1fr_5rem_1fr] gap-2 items-center">
                          <div className="flex items-center gap-2 justify-end">
                            <span className={`font-display font-black text-base ${aWins ? "text-white" : "text-on-surface-variant/50"}`}>{a}{suffix}</span>
                            <div className="w-24 h-2 bg-surface-container-highest rounded-full overflow-hidden flex justify-end">
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
                              <span className="text-[9px] font-display uppercase tracking-wider text-on-surface-variant/40 px-2 py-1 rounded-full border border-outline-variant/20">tie</span>
                            ) : (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                                className={`w-5 h-5 rounded-full flex items-center justify-center ${aWins ? colorA : colorB}`}
                              >
                                <ChevronUp size={10} className="text-background" style={{ transform: aWins ? "rotate(-90deg)" : "rotate(90deg)" }} />
                              </motion.div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 justify-start">
                            <div className="w-24 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(b / max) * 100}%` }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                                className={`h-full rounded-full ${bWins ? colorB : "opacity-20 bg-outline"}`}
                              />
                            </div>
                            <span className={`font-display font-black text-base ${bWins ? "text-white" : "text-on-surface-variant/50"}`}>{b}{suffix}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {(() => {
                  const scores = [0, 0];
                  [
                    { key: "wins",     higher: true  },
                    { key: "win_rate", higher: true  },
                    { key: "Points",   higher: true  },
                    { key: "losses",   higher: false },
                  ].forEach(({ key, higher }) => {
                    const a = compareData[0][key as keyof Player] as number;
                    const b = compareData[1][key as keyof Player] as number;
                    if (higher ? a > b : a < b) scores[0]++;
                    else if (higher ? b > a : b < a) scores[1]++;
                  });
                  const winnerIdx = scores[0] > scores[1] ? 0 : scores[1] > scores[0] ? 1 : -1;
                  if (winnerIdx === -1) return null;
                  const winner = compareData[winnerIdx];
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-5 flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-container border border-outline-variant/20"
                    >
                      <Trophy size={14} className="text-yellow-400" />
                      <span className="font-display font-black text-white text-xs uppercase tracking-wider">
                        {winner.name.split(" ")[0]} leads overall
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-display">
                        ({scores[winnerIdx]}–{scores[1 - winnerIdx]} stats)
                      </span>
                    </motion.div>
                  );
                })()}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-xl border border-outline-variant/20 overflow-hidden mb-4">

        {/* Header row — added Pts column */}
        <div className="grid grid-cols-[2rem_1fr_4rem_3rem_3rem_5rem_3rem_2.5rem] gap-2 px-4 py-3 bg-surface-container-high border-b border-outline-variant/20">
          {["#", "Player", "Played", "W", "L", "Win %", "Pts", "±"].map((h) => (
            <span key={h} className="text-[10px] font-display font-black uppercase tracking-[0.15em] text-on-surface-variant">{h}</span>
          ))}
        </div>

        <AnimatePresence>
          {visible.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant font-display text-sm">No players found.</div>
          ) : (
            visible.map((p, i) => {
              const isSelected = compareIds.includes(p.id);
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  onClick={() => toggleCompare(p.id)}
                  className={`grid grid-cols-[2rem_1fr_4rem_3rem_3rem_5rem_3rem_2.5rem] gap-2 px-4 py-3.5 items-center border-b border-outline-variant/10 last:border-0 cursor-pointer transition-all duration-150 ${
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

                  {/* Points — now its own column */}
                  <span className="font-display font-bold text-sm text-secondary text-center">{p.Points}</span>

                  <div className="flex justify-center">
                    <Trend curr={p.rank} prev={p.prev_rank} />
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>

      {hasMore && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mb-4">
          <button
            onClick={() => setVisibleCount((c) => c + 10)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-outline-variant/30 text-on-surface-variant hover:text-white hover:border-white/20 transition-colors font-display font-bold text-xs uppercase tracking-wider"
          >
            <ChevronDown size={14} />
            Show More ({filtered.length - visibleCount} remaining)
          </button>
        </motion.div>
      )}

      <div className="flex justify-center mb-8">
        <button
          onClick={() => load(true)}
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