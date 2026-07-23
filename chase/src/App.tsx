import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, RotateCcw, CheckCircle, XCircle, Minus, Plus, AlertTriangle } from "lucide-react";

const API_URL = "https://chase-l9no.onrender.com";

// ─── Scoring constants ───────────────────────────────────────────────
const ACTIONS = [
  { label: "Potted Own Ball",      delta: +3, color: "bg-emerald-500 hover:bg-emerald-400", icon: "🎱" },
  { label: "Potted Opponent Ball", delta: -1, color: "bg-red-500 hover:bg-red-400",         icon: "😬" },
  { label: "Foul",                 delta: -1, color: "bg-orange-500 hover:bg-orange-400",   icon: "⚠️" },
];
const WIN_DELTA  = +10;
const LOSS_DELTA = -5;
const K          = 32; // Elo K-factor

// ─── Elo helpers ─────────────────────────────────────────────────────
function expectedScore(ratingA: number, ratingB: number) {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

function calcNewRatings(
  ratingA: number, ratingB: number,
  pointsA: number, pointsB: number,
  winnerIdx: 0 | 1
) {
  const totalPoints = pointsA + pointsB || 1;
  const perfA = pointsA / totalPoints;
  const perfB = pointsB / totalPoints;

  // Blended actual: 70% match result + 30% performance
  const actualA = winnerIdx === 0 ? 0.7 + 0.3 * perfA : 0.3 * perfA;
  const actualB = winnerIdx === 1 ? 0.7 + 0.3 * perfB : 0.3 * perfB;

  const expA = expectedScore(ratingA, ratingB);
  const expB = expectedScore(ratingB, ratingA);

  return {
    newRatingA: Math.round(ratingA + K * (actualA - expA)),
    newRatingB: Math.round(ratingB + K * (actualB - expB)),
  };
}

// ─── Types ───────────────────────────────────────────────────────────
interface Player {
  id: number;
  name: string;
  rating: number;
  matches_played: number;
}

interface LogEntry {
  player: string;
  action: string;
  delta: number;
}

// ─── Sub-components ──────────────────────────────────────────────────
function ScorePanel({
  player,
  score,
  onAction,
  disabled,
}: {
  player: Player;
  score: number;
  onAction: (delta: number, label: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex-1 bg-surface-container rounded-2xl border border-outline-variant/20 p-6 flex flex-col gap-5">
      {/* Player name + rating */}
      <div className="text-center">
        <p className="text-[10px] font-display font-black uppercase tracking-[0.3em] text-on-surface-variant mb-1">
          Player
        </p>
        <h2 className="text-2xl font-display font-black text-white truncate">{player.name}</h2>
        <p className="text-xs text-on-surface-variant mt-1 font-display">
          Rating: <span className="text-secondary font-black">{player.rating}</span>
        </p>
      </div>

      {/* Live score */}
      <div className="flex items-center justify-center">
        <motion.div
          key={score}
          initial={{ scale: 1.3, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-6xl font-display font-black ${score >= 0 ? "text-white" : "text-red-400"}`}
        >
          {score > 0 ? `+${score}` : score}
        </motion.div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2">
        {ACTIONS.map((a) => (
          <button
            key={a.label}
            disabled={disabled}
            onClick={() => onAction(a.delta, a.label)}
            className={`${a.color} disabled:opacity-40 disabled:cursor-not-allowed text-white font-display font-bold text-sm py-3 px-4 rounded-xl transition-all duration-150 flex items-center justify-between`}
          >
            <span>{a.icon} {a.label}</span>
            <span className={`font-black text-base ${a.delta > 0 ? "" : "text-red-200"}`}>
              {a.delta > 0 ? `+${a.delta}` : a.delta}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────
export default function MatchScorer() {
  const [players, setPlayers]       = useState<Player[]>([]);
  const [loading, setLoading]       = useState(true);
  const [p1, setP1]                 = useState<Player | null>(null);
  const [p2, setP2]                 = useState<Player | null>(null);
  const [scores, setScores]         = useState([0, 0]);
  const [log, setLog]               = useState<LogEntry[]>([]);
  const [matchDone, setMatchDone]   = useState(false);
  const [result, setResult]         = useState<null | { winner: string; newRatings: [number, number]; ratingDeltas: [number, number] }>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");
  const [step, setStep]             = useState<"select" | "playing" | "done">("select");

  // Fetch players from DB
  useEffect(() => {
    fetch(`${API_URL}/api/players`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { setPlayers(data); setLoading(false); })
      .catch(() => { setError("Failed to load players."); setLoading(false); });
  }, []);

  const handleAction = (playerIdx: 0 | 1, delta: number, label: string) => {
    setScores((prev) => {
      const next = [...prev];
      next[playerIdx] += delta;
      return next;
    });
    const playerName = playerIdx === 0 ? p1!.name : p2!.name;
    setLog((prev) => [{ player: playerName, action: label, delta }, ...prev.slice(0, 19)]);
  };

  const handleMatchEnd = async (winnerIdx: 0 | 1) => {
    if (!p1 || !p2) return;
    setSubmitting(true);
    setError("");

    const winner = winnerIdx === 0 ? p1 : p2;
    const loser  = winnerIdx === 0 ? p2 : p1;

    // Apply win/loss deltas to scores
    const finalScores: [number, number] = [
      scores[0] + (winnerIdx === 0 ? WIN_DELTA : LOSS_DELTA),
      scores[1] + (winnerIdx === 1 ? WIN_DELTA : LOSS_DELTA),
    ];

    const { newRatingA, newRatingB } = calcNewRatings(
      p1.rating, p2.rating,
      finalScores[0], finalScores[1],
      winnerIdx
    );

    try {
      const res = await fetch(`${API_URL}/api/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          player1_id:   p1.id,
          player2_id:   p2.id,
          p1_points:    finalScores[0],
          p2_points:    finalScores[1],
          winner_id:    winner.id,
          new_rating_p1: newRatingA,
          new_rating_p2: newRatingB,
          p1phone: p1.phone,
          p2phone: p2.phone
        }),
      });

      if (!res.ok) throw new Error("Server error");

      setResult({
        winner: winner.name,
        newRatings: [newRatingA, newRatingB],
        ratingDeltas: [newRatingA - p1.rating, newRatingB - p2.rating],
      });
      setStep("done");
    } catch {
      setError("Failed to save match. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setP1(null); setP2(null);
    setScores([0, 0]); setLog([]);
    setMatchDone(false); setResult(null);
    setStep("select"); setError("");
  };

  // ── Step 1: Select players ──
if (step === "select") {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-xl mx-auto pb-28 md:pb-12">
        {/* Header Section */}
        <header className="mb-8 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
              8-Ball Pool
            </p>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
            Match Scorer
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Select two players to initiate the live scoreboard.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-sm font-medium animate-pulse">
              Fetching player roster...
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {[
              { label: "Player 1", current: p1, other: p2, set: setP1 },
              { label: "Player 2", current: p2, other: p1, set: setP2 },
            ].map(({ label, current, other, set }) => (
              <section key={label} className="space-y-3">
                {/* Slot Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {label}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {current ? (
                      <span className="text-emerald-400 font-semibold">
                        {current.name}
                      </span>
                    ) : (
                      "Not selected"
                    )}
                  </span>
                </div>

                {/* Player Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {players?.map((player) => {
                    const isSelected =
                      current?.id != null &&
                      String(current.id) === String(player.id);
                    const isDisabled =
                      other?.id != null &&
                      String(other.id) === String(player.id);

                    return (
                      <button
                        key={`${label}-${player.id}`}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => set(isSelected ? null : player)}
                        className={`group relative p-3.5 rounded-2xl border text-left transition-all duration-200 outline-none ${
                          isSelected
                            ? "bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-950/50 ring-2 ring-emerald-500/40"
                            : isDisabled
                            ? "bg-slate-900/30 border-slate-900 text-slate-600 opacity-40 cursor-not-allowed"
                            : "bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80 active:scale-[0.98]"
                        }`}
                      >
                        {/* Name */}
                        <p className="font-bold text-sm truncate tracking-wide">
                          {player.name}
                        </p>

                        {/* Rating Badge */}
                        <div className="flex items-center justify-between mt-1.5">
                          <span
                            className={`text-[11px] font-mono ${
                              isSelected
                                ? "text-emerald-300"
                                : "text-slate-400 group-hover:text-slate-300"
                            }`}
                          >
                            Rating: {player.rating}
                          </span>

                          {/* Selected Check Indicator */}
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}

            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/50 text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/80 backdrop-blur-md border-t border-slate-800/80 md:relative md:bg-transparent md:border-0 md:p-0">
              <button
                type="button"
                disabled={!p1 || !p2}
                onClick={() => setStep("playing")}
                className="w-full max-w-xl mx-auto py-4 px-6 rounded-2xl font-black uppercase tracking-wider text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-950/50 active:scale-[0.99]"
              >
                <span>Start Match</span>
                <span className="text-lg">→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

 // ── Step 2: Live scoring ──
  if (step === "playing") {
    return (
      <div className="p-4 max-w-4xl mx-auto pb-24 md:pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-[10px] font-display font-black uppercase tracking-[0.3em] text-amber-400">Live Match</p>
            </div>
            <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight mt-0.5">
              {p1!.name} <span className="text-slate-500 text-base font-normal lowercase mx-1">vs</span> {p2!.name}
            </h1>
          </div>
          <button 
            onClick={reset} 
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-slate-700/50"
            title="Reset Match"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Score panels */}
        <div className="flex gap-4 mb-6">
          <ScorePanel player={p1!} score={scores[0]} onAction={(d, l) => handleAction(0, d, l)} disabled={submitting} />

          <div className="flex flex-col items-center justify-center gap-2 px-1">
            <div className="w-px flex-1 bg-gradient-to-b from-transparent via-slate-700 to-transparent" />
            <span className="font-display font-black text-slate-500 text-xs uppercase tracking-widest bg-slate-900 px-2 py-1 rounded border border-slate-800">VS</span>
            <div className="w-px flex-1 bg-gradient-to-b from-transparent via-slate-700 to-transparent" />
          </div>

          <ScorePanel player={p2!} score={scores[1]} onAction={(d, l) => handleAction(1, d, l)} disabled={submitting} />
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 text-red-400 text-sm font-display bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20 backdrop-blur-sm">
            <AlertTriangle size={16} className="shrink-0" /> {error}
          </div>
        )}

        {/* End match buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            disabled={submitting}
            onClick={() => handleMatchEnd(0)}
            className="flex items-center justify-center gap-2 py-4 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-display font-black uppercase tracking-wider text-sm shadow-lg shadow-emerald-950/40 transition-all disabled:opacity-50 active:scale-[0.99]"
          >
            <Trophy size={16} className="text-amber-300" /> {p1!.name} Wins
          </button>
          <button
            disabled={submitting}
            onClick={() => handleMatchEnd(1)}
            className="flex items-center justify-center gap-2 py-4 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-display font-black uppercase tracking-wider text-sm shadow-lg shadow-emerald-950/40 transition-all disabled:opacity-50 active:scale-[0.99]"
          >
            <Trophy size={16} className="text-amber-300" /> {p2!.name} Wins
          </button>
        </div>

        {/* Action log */}
        {log.length > 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md overflow-hidden shadow-xl">
            <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
              <p className="text-[10px] font-display font-black uppercase tracking-widest text-slate-400">Action Log</p>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700/50">{log.length} Events</span>
            </div>
            <div className="max-h-48 overflow-y-auto divide-y divide-slate-800/60 custom-scrollbar">
              {log.map((entry, i) => (
                <motion.div
                  key={`${entry.player}-${entry.action}-${entry.delta}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between px-4 py-3 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white font-display font-bold text-xs">{entry.player}</span>
                    <span className="text-slate-400 text-xs">— {entry.action}</span>
                  </div>
                  <span className={`font-display font-black text-sm px-2 py-0.5 rounded ${entry.delta > 0 ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-red-400 bg-red-500/10 border border-red-500/20"}`}>
                    {entry.delta > 0 ? `+${entry.delta}` : entry.delta}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Step 3: Result ──
  return (
    <div className="p-6 max-w-lg mx-auto pb-24 md:pb-6 flex flex-col items-center text-center gap-6 pt-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="relative"
      >
        <div className="absolute -inset-4 bg-amber-500/20 rounded-full blur-xl animate-pulse" />
        <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-amber-400/80 flex items-center justify-center relative shadow-2xl shadow-amber-500/20">
          <Trophy size={44} className="text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.4)]" />
        </div>
      </motion.div>

      <div>
        <p className="text-amber-400 text-xs font-display font-bold uppercase tracking-[0.2em] mb-1">Match Complete</p>
        <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight">{result?.winner} Wins!</h2>
      </div>

      {/* Rating changes */}
      <div className="w-full grid grid-cols-2 gap-3">
        {[p1!, p2!].map((player, i) => {
          const delta = result?.ratingDeltas[i] ?? 0;
          return (
            <div key={player.id} className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 shadow-xl backdrop-blur-md">
              <p className="text-[10px] font-display font-black text-slate-400 uppercase tracking-wider mb-1 truncate">{player.name}</p>
              <p className="text-3xl font-display font-black text-white">{result?.newRatings[i]}</p>
              <div className="mt-1">
                <span className={`inline-block text-xs font-display font-bold px-2 py-0.5 rounded-full ${delta >= 0 ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-red-400 bg-red-500/10 border border-red-500/20"}`}>
                  {delta >= 0 ? `+${delta}` : delta} rating
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Score summary */}
      <div className="w-full bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md">
        <p className="text-[10px] font-display font-black uppercase tracking-widest text-slate-400 mb-4">Final Score</p>
        <div className="flex items-center justify-around">
          <div className="space-y-1">
            <p className="text-slate-300 font-display font-bold text-xs truncate max-w-[100px]">{p1!.name}</p>
            <p className="text-4xl font-display font-black text-white">{scores[0]}</p>
          </div>
          <p className="text-slate-600 font-display font-black text-xl">—</p>
          <div className="space-y-1">
            <p className="text-slate-300 font-display font-bold text-xs truncate max-w-[100px]">{p2!.name}</p>
            <p className="text-4xl font-display font-black text-white">{scores[1]}</p>
          </div>
        </div>
      </div>

      <button
        onClick={reset}
        className="w-full py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-black uppercase tracking-wider text-sm transition-all shadow-lg shadow-amber-400/10 active:scale-[0.99]"
      >
        New Match
      </button>
    </div>
  );
}
