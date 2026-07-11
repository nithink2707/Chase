import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Trophy, 
  ChevronRight, 
  ArrowRight,
  Shield,
  Goal,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

const sports = ["Football", "Cricket", "Badminton"];

export default function Discovery() {
  const [activeSport, setActiveSport] = useState("Football");

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-20 md:pb-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-outline-variant/20">
        <div>
          <h2 className="text-4xl font-bold font-display text-white mb-2">Tournaments</h2>
          <p className="text-on-surface-variant max-w-xl text-lg">
            Explore active leagues, analyze elite team metrics, and track high-performance tournaments globally.
          </p>
        </div>

        {/* Sport Switcher */}
        <div className="flex p-1 bg-surface-container rounded-lg border border-outline-variant/10 overflow-x-auto w-full md:w-auto font-display">
          {sports.map((sport) => (
            <button
              key={sport}
              onClick={() => setActiveSport(sport)}
              className={cn(
                "px-6 py-2 text-sm font-semibold rounded-md transition-all duration-300 whitespace-nowrap",
                activeSport === sport 
                  ? "bg-surface-container-highest text-white shadow-lg border border-outline-variant/30" 
                  : "text-on-surface-variant hover:text-white"
              )}
            >
              {sport}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSport}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Featured Banner */}
          <div className="relative w-full rounded-2xl overflow-hidden border border-outline-variant/20 h-80 md:h-[400px] group">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCle93tre6hc7PoYQGYcpOGi49YCsbkM46--4JM4zburzI8FUgWuqKCkwZV26yvDEBYMIzJu_8NGPXYT5lSJ3dddH3Gb-XE0S0MnK8Gly2zwZPWw3I86vV3yw2nRzzmVEewEdQvfm_-NJi5uY3ISMS14UUE8XohUQXnbX7jTugdTGW5RknM0ufxgZjpqZaRwq0sCW5V0nUBFHrwDJW9ixTx_9Hj3L8VI-05b3phtb-s6Pm_9qhq4xzn1eHBt4Zvs7Z1KfbNYzqqe7zq" 
              alt="Stadium"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
              <span className="inline-block px-4 py-1.5 bg-surface-container-highest/80 backdrop-blur-md border border-outline-variant/30 text-primary font-display text-[10px] font-bold uppercase tracking-widest rounded-full mb-6">
                {activeSport === "Football" ? "Chase Exclusive" : "Coming Soon"}
              </span>
              <h3 className="text-3xl md:text-5xl font-bold font-display text-white mb-4 line-height-[1.1]">
                {activeSport === "Football" ? "Chumma Football League 2026" : `${activeSport} Elite`}
              </h3>
              <p className="text-on-surface-variant text-lg mb-8 line-clamp-2 md:line-clamp-none font-medium italic">
                {activeSport === "Football" 
                  ? "The most prestigious amateur football championship powered by Chase. Experience elite statistics and real-time tracking."
                  : "We are currently preparing the elite tournament structures for this sport. Stay tuned for the unveiling."}
              </p>
              {activeSport === "Football" ? (
                <Link 
                  to="/tournaments/pro-league"
                  className="inline-flex items-center gap-2 bg-white text-background font-display font-bold px-8 py-3.5 rounded-lg hover:bg-primary transition-colors uppercase text-sm tracking-tight"
                >
                  View tournament details
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <div className="text-primary font-display font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                  Coming soon <TrendingUp size={18} />
                </div>
              )}
            </div>
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
