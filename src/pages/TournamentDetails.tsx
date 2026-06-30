import React from "react";
import { 
  Trophy, 
  Calendar, 
  Info, 
  CheckCircle,
  Clock,
  LayoutGrid,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

export default function TournamentDetails() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-24 md:pb-8">
      {/* Hero Banner */}
      <div className="relative w-full h-80 md:h-[450px] rounded-2xl overflow-hidden border border-outline-variant/20 shadow-2xl">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJGF10eXVvfg06Dnay4RjmquJiVvSaW3Xx4AY22a3f80U6sIeVy65_JdzA7tnIR3xrBZzoWk_rgOIGI0cbzFJo7TiprCnIUx-2s1IGZ3eCxvGhXfzaFzo3qoF-RM1dlm-peo_mJ7Bl2GTBeuMTsKHPjkRHXVOAOjYNmnJ1f5GB5yFSs-JDg4-fij6j3amPynRp4OCZ-WLwcJjCkavqU9rw8U6s5A7L2akClwW5vxaRqSS2i_CH0DmpUU6ERWTJWTHTapbrQHGLvVgs" 
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-4">
            <div className="flex gap-2">
              <span className="bg-surface-container-highest/80 backdrop-blur border border-outline-variant/30 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Pro Tier</span>
              <span className="bg-primary text-background px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Live</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-display text-white italic">Global Apex Invitational</h1>
            <div className="flex items-center gap-4 text-on-surface-variant font-medium">
              <span className="flex items-center gap-2">
                <Calendar size={18} className="text-primary" /> Oct 15 - Nov 20, 2024
              </span>
            </div>
          </div>

          <div className="w-full md:w-auto text-right space-y-6">
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-1">Prize Pool</p>
              <p className="text-4xl md:text-5xl font-black font-display text-primary">$2,500,000</p>
            </div>
            <button className="w-full md:w-auto bg-primary text-background font-display font-bold px-10 py-4 rounded-lg hover:bg-white transition-all uppercase text-sm tracking-tight shadow-xl">
              Register Team
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-8">
          {/* Format Card */}
          <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Info size={22} className="text-primary" />
              <h3 className="text-xl font-bold font-display text-white">Format</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "Game Mode", value: "5v5 Tactical" },
                { label: "Match Type", value: "Best of 3 (BO3)" },
                { label: "Finals", value: "Best of 5 (BO5)" },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-outline-variant/10 pb-3 last:border-0 last:pb-0">
                  <span className="text-on-surface-variant text-sm font-medium">{item.label}</span>
                  <span className="text-white font-bold font-display text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility Card */}
          <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10 shadow-lg">
             <div className="flex items-center gap-3 mb-6">
              <CheckCircle size={22} className="text-primary" />
              <h3 className="text-xl font-bold font-display text-white">Eligibility</h3>
            </div>
            <ul className="space-y-4">
              {[
                "Minimum rank: Diamond I+",
                "Mandatory Anti-Cheat Client",
                "5 Roster + 2 Substitutes"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-on-surface-variant text-sm font-medium">
                  <CheckCircle size={16} className="text-primary mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column - Stages */}
        <div className="lg:col-span-8 flex flex-col h-full bg-surface-container rounded-xl border border-outline-variant/10 p-8 shadow-lg">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-bold font-display text-white flex items-center gap-3">
              <LayoutGrid size={24} className="text-primary" /> Tournament Stages
            </h3>
            <button className="text-xs font-bold text-on-surface-variant uppercase tracking-widest hover:text-white transition-colors">
              Full Bracket
            </button>
          </div>

          <div className="relative border-l-2 border-outline-variant/20 ml-4 pl-10 space-y-12">
            {[
              { 
                title: "Group Stage", 
                date: "Oct 15 - Oct 25", 
                status: "Completed", 
                desc: "Round Robin format. Top 2 teams from each group advance.", 
                progress: 100, 
                color: "bg-primary" 
              },
              { 
                title: "Playoffs", 
                date: "Nov 1 - Nov 10", 
                status: "In Progress", 
                desc: "Double Elimination Bracket. 8 Teams competing for finals.", 
                progress: 60, 
                color: "bg-secondary" 
              },
              { 
                title: "Grand Finals", 
                date: "Nov 20", 
                status: "Upcoming", 
                desc: "Best of 5 Championship match. Live at the Apex Arena.", 
                progress: 0, 
                color: "bg-surface-container-highest" 
              },
            ].map((stage, idx) => (
              <div key={idx} className="relative group">
                <div className={cn(
                  "absolute -left-[51px] top-1 h-5 w-5 rounded-full border-4 border-surface-container transition-all duration-300",
                  stage.status === "Completed" ? "bg-primary" : 
                  stage.status === "In Progress" ? "bg-secondary ring-4 ring-secondary/20" : "bg-outline-variant"
                )}></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className={cn("text-xl font-bold font-display", stage.status === "Upcoming" ? "text-on-surface-variant" : "text-white")}>
                      {stage.title}
                    </h4>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">{stage.date}</p>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                    stage.status === "Completed" ? "bg-surface-container-highest text-on-surface border-outline-variant/30" :
                    stage.status === "In Progress" ? "bg-secondary/10 text-secondary border-secondary/30" : "bg-transparent text-on-surface-variant border-outline-variant/20"
                  )}>
                    {stage.status}
                  </span>
                </div>
                
                <div className={cn(
                  "bg-surface-container-highest/30 p-6 rounded-xl border border-outline-variant/10 transition-all duration-500",
                  stage.status === "Upcoming" ? "opacity-40" : "opacity-100 group-hover:border-outline-variant/30"
                )}>
                  <p className="text-on-surface-variant mb-6 text-sm font-medium italic">{stage.desc}</p>
                  <div className="h-1 w-full bg-outline-variant/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.progress}%` }}
                      transition={{ duration: 1, delay: idx * 0.2 }}
                      className={cn("h-full", stage.color)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
