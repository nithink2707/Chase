import React from "react";
import { 
  Edit3, 
  UserPlus, 
  TrendingUp, 
  Search,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

const players = [
  { name: "Jace 'Apex' Vane", role: "IGL / Flex", kd: "1.42", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtpac4hZ6uNnqbjAPNPx6UcF3tVzJbqpNPqAGYoKPCRbYwyOCwQJexRe9SEImSgtgc5I4nQ46jmIMQohhi_W9sxfCHNX9oAkTF9CW-IL6eCHJm6P7mwRFOKrtGnMaBLYfTXoVScBWYcitEoWYkaLjzPIVdJzHgkuwLvsT767LW80AtfBxdzVCz26lAYL2paezgHUsh1hPOlaP1F0nk-d9Py-wgZr_TdJXM9by8xoNitGkQIPdBmbYAec9rURLrHm4jig72tfSu9NS0" },
  { name: "Marcus 'Rook' Lin", role: "Entry Fragger", kd: "1.65", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDF7ujmgp09gMxIReuJ6nzn6jJm3bNgZRhXSiGmjgU7I-GMC_vPSJOOuRjn6w_o9BZ4NSSQq1nBwDizhmoJfsakFrrWl9pRpxDue_w86riALG9h3p00IKeIRDw8WQWL51pzwymuFMxfP0Hnp4CBW8cl4cWtAIgbkm1x3hcFqJja8G27dTV31Q_756fmLVNoN9syQg0vRovtZ9i2s_5JGdApbr0uDOvzX1EiNAR84Pg5mZYkcfiY2_-mAT3S1aBG5ztl6Hcx5h_U8Tom" },
  { name: "Elena 'Nova' Silva", role: "Support / Anchor", kd: "1.18", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSmy8dvsbgLv_1IP5Ktij1xzeJK5QBVga1PVkz1jvJpzH0b87C8OahNHMVZ1W2Kuuy5gpBggEbQ2UBUWFVaSMxj2hc0KaTvZGd4abeDTyIA06Ane26qZXVjJsxo2bXBtuV1adrrI-z-GT5mD2GFaGS1BCPtSgvDtZLv9i_sWxeh8_NalaO7rCJzuO5onalaqZEQIH33elpj7uW9tDoAvg7wCp87UdDzgcOE9kjECAyLPb5clts49J9HwbE222n1OjwUCiRs1lmMHJP" },
];

export default function TeamManagement() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-24 md:pb-8">
      {/* Page Header */}
      <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-b border-outline-variant/20 pb-8">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-3 block">Team Management</span>
          <h1 className="text-5xl font-black font-display text-white italic">Vanguard Protocol</h1>
        </div>
        <div className="flex gap-4">
          <div className="bg-surface-container-high px-6 py-4 rounded-xl border border-outline-variant/10 shadow-lg text-right">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Global Rank</span>
            <span className="text-3xl font-black font-display text-white italic">#42</span>
          </div>
          <div className="bg-surface-container-high px-6 py-4 rounded-xl border border-outline-variant/10 shadow-lg text-right">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Win Rate</span>
            <span className="text-3xl font-black font-display text-primary italic">68.4%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Core Roster */}
        <div className="lg:col-span-8">
          <div className="bg-surface-container border border-outline-variant/10 rounded-2xl p-8 space-y-8 shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black font-display text-white">Core Roster</h2>
              <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                Edit Lineup <Edit3 size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {players.map((player, idx) => (
                <div key={idx} className="bg-surface-container-low border border-outline-variant/10 hover:border-primary/30 transition-all duration-300 rounded-xl p-4 flex items-center gap-6">
                  <img src={player.img} alt={player.name} className="w-16 h-16 rounded-lg object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold font-display text-white truncate">{player.name}</h3>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-1">{player.role}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-xl font-black font-display text-white">{player.kd}</span>
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">K/D</span>
                  </div>
                </div>
              ))}
              
              <div className="bg-surface-container-low border border-dashed border-outline-variant/30 rounded-xl p-4 flex items-center gap-6 group cursor-pointer hover:border-primary/50 transition-all">
                <div className="w-16 h-16 rounded-lg bg-surface-container-highest border border-dashed border-outline-variant/30 flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-on-surface-variant group-hover:text-white transition-colors">Open Slot</h3>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-wider mt-1">Pending Draft</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Performance & Scouting */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Season Trend */}
          <div className="bg-surface-container border border-outline-variant/10 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold font-display text-white underline decoration-primary decoration-4 underline-offset-8">Season Trend</h2>
              <TrendingUp size={20} className="text-on-surface-variant" />
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-baseline mb-2 px-1">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Match Win/Loss Ratio</span>
                <span className="text-lg font-bold font-display text-white italic">24W - 8L</span>
              </div>
              <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden flex shadow-inner">
                <div className="h-full bg-primary" style={{ width: "75%" }}></div>
                <div className="h-full bg-error" style={{ width: "25%" }}></div>
              </div>
            </div>

            {/* Bars chart mock */}
            <div className="mt-10 h-24 w-full flex items-end gap-1.5 opacity-80">
              {[30, 45, 40, 60, 55, 80, 75, 90].map((h, i) => (
                 <div 
                  key={i}
                  className={cn(
                    "w-full rounded-t-sm transition-all duration-500",
                    i > 4 ? "bg-primary" : "bg-outline-variant hover:bg-white"
                  )}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Scouting */}
          <div className="bg-surface-container border border-outline-variant/10 rounded-2xl p-6 flex-1 shadow-xl">
             <h2 className="text-xl font-bold font-display text-white mb-6">Scouting</h2>
             
             <div className="relative mb-6">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input 
                  type="text" 
                  placeholder="Search verified players..."
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium focus:border-primary transition-all focus:ring-0 outline-none"
                />
             </div>

             <div className="space-y-4">
                {[
                  { name: "Tekno99", tags: "F/A • 1.8 K/D", initials: "T9" },
                  { name: "KrypticLock", tags: "F/A • 1.5 K/D", initials: "KL" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between group p-2 hover:bg-surface-container-high rounded-xl transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-display font-bold text-xs">
                        {p.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-1 font-bold text-sm text-white">
                          {p.name}
                          <CheckCircle2 size={12} className="text-primary" />
                        </div>
                        <p className="text-[10px] text-on-surface-variant uppercase font-bold">{p.tags}</p>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 bg-surface-container-high border border-outline-variant/20 rounded-lg text-white font-display text-xs font-bold hover:bg-primary hover:text-background transition-all uppercase tracking-tight">
                      Invite
                    </button>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
