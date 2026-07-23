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
      <div className="p-6 max-w-2xl mx-auto pb-24 md:pb-6">
        <div className="mb-8">
          <p className="text-[10px] font-display font-black uppercase tracking-[0.3em] text-on-surface-variant mb-1">8-Ball Pool</p>
          <h1 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Match Scorer</h1>
          <p className="text-on-surface-variant text-sm mt-1">Select two players to start scoring a live match.</p>
        </div>

        {loading ? (
          <p className="text-on-surface-variant animate-pulse font-display">Loading players...</p>
        ) : (
          <div className="space-y-6">
            {[{ label: "Player 1", val: p1, set: setP1 }, { label: "Player 2", val: p2, set: setP2 }].map(({ label, val, set }) => (
              <div key={label}>
                <p className="text-xs font-display font-black uppercase tracking-widest text-on-surface-variant mb-2">{label}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {players.map((player) => {
                    const otherSelected = label === "Player 1" ? p2?.id : p1?.id;
                    const selectedId = label === "Player 1" ? p1?.id : p2?.id;
                    const isSelected = selectedId === player.id;
                    const isDisabled = Boolean(otherSelected) && player.id === otherSelected && !isSelected;
                    return (
                      <button
                        key={player.id}
                        disabled={isDisabled}
                        onClick={() => {
                          if (!isDisabled) {set(player)}}}
                        className={`px-4 py-3 rounded-xl border text-sm font-display font-bold transition-all duration-150 text-left ${
                          isSelected
                            ? "bg-primary/20 border-primary text-white"
                            : isDisabled
                            ? "opacity-30 cursor-not-allowed border-outline-variant/10 text-on-surface-variant"
                            : "border-outline-variant/20 text-on-surface-variant hover:text-white hover:border-primary/40 hover:bg-surface-container-high"
                        }`}
                      >
                        <p className="truncate">{player.name}</p>
                        <p className="text-[10px] opacity-60 font-normal mt-0.5">Rating: {player.rating}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {error && <p className="text-error text-sm font-display">{error}</p>}

            <button
              disabled={!p1 || !p2}
              onClick={() => setStep("playing")}
              className="w-full py-4 rounded-xl bg-white text-background font-display font-black uppercase tracking-wider text-sm hover:bg-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Start Match →
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Step 2: Live scoring ──
  if (step === "playing") {
    return (
      <div className="p-4 max-w-4xl mx-auto pb-24 md:pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-display font-black uppercase tracking-[0.3em] text-on-surface-variant">Live Match</p>
            <h1 className="text-2xl font-display font-black text-white uppercase tracking-tighter">
              {p1!.name} <span className="text-on-surface-variant text-lg">vs</span> {p2!.name}
            </h1>
          </div>
          <button onClick={reset} className="text-on-surface-variant hover:text-white transition-colors">
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Score panels */}
        <div className="flex gap-4 mb-6">
          <ScorePanel player={p1!} score={scores[0]} onAction={(d, l) => handleAction(0, d, l)} disabled={submitting} />

          <div className="flex flex-col items-center justify-center gap-2 px-2">
            <div className="w-px flex-1 bg-outline-variant/20" />
            <span className="font-display font-black text-on-surface-variant text-xs uppercase tracking-widest">vs</span>
            <div className="w-px flex-1 bg-outline-variant/20" />
          </div>

          <ScorePanel player={p2!} score={scores[1]} onAction={(d, l) => handleAction(1, d, l)} disabled={submitting} />
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 text-error text-sm font-display bg-error/10 px-4 py-3 rounded-xl border border-error/20">
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        {/* End match buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            disabled={submitting}
            onClick={() => handleMatchEnd(0)}
            className="flex items-center justify-center gap-2 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-display font-black uppercase tracking-wider text-sm transition-all disabled:opacity-50"
          >
            <Trophy size={16} /> {p1!.name} Wins
          </button>
          <button
            disabled={submitting}
            onClick={() => handleMatchEnd(1)}
            className="flex items-center justify-center gap-2 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-display font-black uppercase tracking-wider text-sm transition-all disabled:opacity-50"
          >
            <Trophy size={16} /> {p2!.name} Wins
          </button>
        </div>

        {/* Action log */}
        {log.length > 0 && (
          <div className="rounded-xl border border-outline-variant/20 overflow-hidden">
            <div className="px-4 py-3 bg-surface-container-high border-b border-outline-variant/20">
              <p className="text-[10px] font-display font-black uppercase tracking-widest text-on-surface-variant">Action Log</p>
            </div>
            <div className="max-h-48 overflow-y-auto divide-y divide-outline-variant/10">
              {log.map((entry, i) => (
                <motion.div
                  key={`${entry.player}-${entry.action}-${entry.delta}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between px-4 py-2.5"
                >
                  <div>
                    <span className="text-white font-display font-bold text-xs">{entry.player}</span>
                    <span className="text-on-surface-variant text-xs ml-2">{entry.action}</span>
                  </div>
                  <span className={`font-display font-black text-sm ${entry.delta > 0 ? "text-emerald-400" : "text-red-400"}`}>
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
    <div className="p-6 max-w-lg mx-auto pb-24 md:pb-6 flex flex-col items-center text-center gap-6 pt-16">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center"
      >
        <Trophy size={40} className="text-emerald-400" />
      </motion.div>

      <div>
        <p className="text-on-surface-variant text-xs font-display uppercase tracking-widest mb-1">Match Complete</p>
        <h2 className="text-3xl font-display font-black text-white">{result?.winner} Wins!</h2>
      </div>

      {/* Rating changes */}
      <div className="w-full grid grid-cols-2 gap-3">
        {[p1!, p2!].map((player, i) => {
          const delta = result?.ratingDeltas[i] ?? 0;
          return (
            <div key={player.id} className="bg-surface-container rounded-xl border border-outline-variant/20 p-4">
              <p className="text-xs font-display font-black text-on-surface-variant uppercase tracking-wider mb-1 truncate">{player.name}</p>
              <p className="text-2xl font-display font-black text-white">{result?.newRatings[i]}</p>
              <p className={`text-sm font-display font-bold ${delta >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {delta >= 0 ? `+${delta}` : delta} rating
              </p>
            </div>
          );
        })}
      </div>

      {/* Score summary */}
      <div className="w-full bg-surface-container rounded-xl border border-outline-variant/20 p-4">
        <p className="text-[10px] font-display uppercase tracking-widest text-on-surface-variant mb-3">Final Score</p>
        <div className="flex items-center justify-around">
          <div>
            <p className="text-white font-display font-bold text-sm">{p1!.name}</p>
            <p className="text-3xl font-display font-black text-white">{scores[0]}</p>
          </div>
          <p className="text-on-surface-variant font-display font-black text-lg">—</p>
          <div>
            <p className="text-white font-display font-bold text-sm">{p2!.name}</p>
            <p className="text-3xl font-display font-black text-white">{scores[1]}</p>
          </div>
        </div>
      </div>

      <button
        onClick={reset}
        className="w-full py-4 rounded-xl bg-white text-background font-display font-black uppercase tracking-wider text-sm hover:bg-primary transition-all"
      >
        New Match
      </button>
    </div>
  );
}
