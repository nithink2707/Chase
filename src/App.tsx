import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate,useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import Layout from "./components/Layout";
import Discovery from "./pages/Discovery";
import TournamentDetails from "./pages/TournamentDetails";
import TeamManagement from "./pages/TeamManagement";
import Profile from "./pages/Profile";
import { User as LucideUser, Trophy, ArrowRight, Sparkles, Loader2, Menu, Search, Bell, Settings, Instagram} from "lucide-react";

function DiscordIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.099.246.197.372.291a.077.077 0 0 1-.006.128 12.3 12.3 0 0 1-1.873.892.076.076 0 0 0-.04.106c.36.698.772 1.362 1.225 1.994a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.057c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
    </svg>
  );
}


export function Main() {
  return (
    <Layout>
        <Routes>
          <Route path="/tournaments/pro-league" element={<TournamentDetails />} />
          <Route path="/teams" element={<TeamManagement />} />
          <Route path="/activity" element={<Discovery />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/tournaments" element={<Discovery />} />
      </Routes>
      </Layout>
  )

}
export function Intro() {
  const navigate = useNavigate();
  return (
    <div className="bg-background min-h-screen overflow-hidden relative">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 bg-[#1A1A1A] border-b border-outline-variant/20 sticky top-0 z-30">
        <div className="flex items-center gap-4 flex-1">
          <button className="md:hidden text-on-surface">
            <Menu size={24} />
          </button>
          <img src="/chasewhite.png" alt="Chase" className="h-7 block mx-auto" />
        </div>
      </header>

      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-primary rounded-full blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1.3, 1, 1.3], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] bg-secondary rounded-full blur-[140px]"
        />
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-primary/60 to-transparent rotate-12"
        />
      </div>

      {/* Marquee strip */}
      <div className="relative z-10 border-y border-outline-variant/20 overflow-hidden py-2 bg-surface-container/50 backdrop-blur-sm">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex w-max gap-8 whitespace-nowrap font-display font-bold text-xs uppercase tracking-[0.3em] text-on-surface-variant/60"
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-8 shrink-0">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="flex items-center gap-8">
                  Train Hard <Trophy size={12} className="text-primary" /> Compete Harder <Sparkles size={12} className="text-secondary" /> Win More <Trophy size={12} className="text-primary" /> BE HAWTT <Sparkles size={12} className="text-secondary" />
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Hero */}
      <div className="min-h-[calc(100vh-104px)] flex flex-col items-center justify-center p-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-3"
        >
          <span className="inline-block font-display text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">
            Welcome to the arena
          </span>

          <h1 className="font-display font-black uppercase leading-[0.85] tracking-tighter text-white text-[14vw] md:text-[8vw]">
            <motion.span
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="block"
            >
              Universalizing
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="block italic bg-gradient-to-r from-primary via-white to-secondary bg-clip-text text-transparent"
            >
              Athleticism.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-on-surface-variant font-medium max-w-md mx-auto pt-4"
          >
            One platform. Every league. No limits.
          </motion.p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/tournaments", { replace: true })}
          className="group relative mt-10 inline-flex items-center gap-3 bg-white text-background font-display font-bold px-10 py-4 rounded-full uppercase text-sm tracking-tight overflow-hidden shadow-[0_20px_50px_-10px_rgba(255,255,255,0.25)]"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative z-10">Go To Dashboard</span>
          <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex items-center gap-4 mt-8"
        >
          {[
            { Icon: Instagram, href: "https://instagram.com/yourhandle", label: "Instagram" },
          ].map(({ Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.92 }}
              aria-label={label}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-surface-container border border-white/10 text-on-surface-variant hover:text-white hover:border-primary/40 hover:bg-surface-container-high transition-colors"
            >
              <Icon size={18} />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// Mock Onboarding Component
// function Onboarding({ onComplete }: { onComplete: (data: { name: string; age: string }) => void }) {
//   const { loginWithGoogle, user: firebaseUser } = useAuth();
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({ name: "" , age: "" });

//   useEffect(() => {
//     if (firebaseUser) {
//       setStep(2);
//       if (firebaseUser.displayName) {
//         setFormData(prev => ({ ...prev, name: firebaseUser.displayName || "" }));
//       }
//     }
//   }, [firebaseUser]);

//   const handleNext = () => {
//     if (step === 1) {
//       loginWithGoogle().catch(console.error);
//     } else {
//       onComplete(formData);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
//       {/* Background Decorative Elements */}
//       <div className="absolute inset-0 pointer-events-none">
//         <motion.div 
//           animate={{ 
//             scale: [1, 1.2, 1],
//             opacity: [0.05, 0.1, 0.05],
//           }}
//           transition={{ duration: 10, repeat: Infinity }}
//           className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px]"
//         />
//         <motion.div 
//           animate={{ 
//             scale: [1.2, 1, 1.2],
//             opacity: [0.05, 0.1, 0.05],
//           }}
//           transition={{ duration: 12, repeat: Infinity, delay: 2 }}
//           className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary rounded-full blur-[120px]"
//         />
//       </div>

//       <motion.div 
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         className="w-full max-w-[1440px] bg-surface-container rounded-3xl overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[800px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] border border-outline-variant/10 relative z-10"
//       >
//         {/* Left Side: Brand Imagery */}
//         <div className="hidden lg:flex w-1/2 relative bg-surface-container-high border-r border-outline-variant/10 overflow-hidden group">
//           <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90"></div>
          
//           {/* Scanning Line Effect */}
//           <motion.div 
//             animate={{ top: ['0%', '100%'] }}
//             transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
//             className="absolute left-0 right-0 h-px bg-primary/30 z-20"
//           />

//           {/* Floating UI Hints */}
//           <motion.div 
//             animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
//             transition={{ duration: 5, repeat: Infinity }}
//             className="absolute top-20 right-20 bg-surface-container-highest/40 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-2xl z-30"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
//                 <Trophy size={16} className="text-primary" />
//               </div>
//               <div className="space-y-1">
//                 <div className="h-2 w-16 bg-white/20 rounded"></div>
//                 <div className="h-1.5 w-10 bg-white/10 rounded"></div>
//               </div>
//             </div>
//           </motion.div>

//           <div className="absolute bottom-0 left-0 p-12 w-full z-30">
//             <motion.div 
//               initial={{ x: -20, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.5 }}
//               className="flex items-center gap-4 mb-8"
//             >
//               <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
//                 <Trophy className="text-primary" size={32} />
//               </div>
//               <h1 className="text-4xl font-black font-display text-white tracking-tighter uppercase">Chase</h1>
//             </motion.div>
//             <motion.h2 
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.7 }}
//               className="text-6xl font-black font-display text-white italic uppercase mb-4 leading-none"
//             >
//               DOMINATE<br/>THE ARENA
//             </motion.h2>
//           </div>
//         </div>

//         {/* Right Side: Form Content */}
//         <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 lg:px-24 bg-[#1A1A1A] relative overflow-hidden">
//           {/* Subtle Dashboard Background Hints */}
//           <div className="absolute inset-0 pointer-events-none opacity-5">
//              <div className="absolute top-[10%] right-[10%] w-64 h-64 border border-primary rounded-full"></div>
//              <div className="absolute bottom-[20%] left-[10%] w-48 h-48 border border-secondary rounded-full"></div>
//              {/* Floating Stats Hint */}
//              <motion.div 
//               animate={{ y: [0, -20, 0] }}
//               transition={{ duration: 10, repeat: Infinity }}
//               className="absolute top-[30%] left-[20%] p-4 bg-surface-container rounded-lg border border-white/10 w-40"
//              >
//                 <div className="h-2 w-1/2 bg-white/20 mb-2 rounded"></div>
//                 <div className="h-4 w-full bg-white/10 rounded"></div>
//              </motion.div>
//           </div>

//           <div className="max-w-md mx-auto w-full space-y-12 relative z-10">
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={step}
//                 initial={{ x: 20, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 exit={{ x: -20, opacity: 0 }}
//                 transition={{ duration: 0.4 }}
//               >
//                 <div className="mb-12">
//                   <h2 className="text-4xl font-black font-display text-white mb-2 italic">
//                     {step === 1 ? "Join the Club" : "The Final Step"}
//                   </h2>
//                   <p className="text-on-surface-variant font-medium">
//                     {step === 1 ? "Your elite journey begins here." : "Help us personalize your dashboard experience."}
//                   </p>
//                 </div>

//                 {step === 1 ? (
//                   <div className="space-y-6">
//                     <button 
//                       onClick={handleNext}
//                       className="w-full flex items-center justify-center gap-3 bg-white text-background font-display font-bold py-5 rounded-2xl hover:bg-primary transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] group border-none cursor-pointer transform hover:-translate-y-1 active:scale-[0.98]"
//                     >
//                       <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
//                         <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
//                         <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
//                         <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
//                         <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
//                       </svg>
//                       Login/Signup with Google
//                       <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
//                     </button>
                    
                    
//                   </div>
//                 ) : (
//                   <div className="space-y-8">
//                     <div className="space-y-6">
//                       <div className="space-y-2">
//                         <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest italic ml-1">Full Name</label>
//                         <input 
//                           type="text" 
//                           autoFocus
//                           placeholder="e.g. John Doe"
//                           value={formData.name}
//                           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                           className="w-full bg-surface border border-outline-variant/20 rounded-xl p-5 font-medium focus:border-primary transition-all outline-none text-on-surface text-lg shadow-inner"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest italic ml-1">Age</label>
//                         <input 
//                           type="number" 
//                           placeholder="Enter your age"
//                           value={formData.age}
//                           onChange={(e) => setFormData({ ...formData, age: e.target.value })}
//                           className="w-full bg-surface border border-outline-variant/20 rounded-xl p-5 font-medium focus:border-primary transition-all outline-none text-on-surface text-lg shadow-inner"
//                         />
//                       </div>
//                     </div>

//                     <button 
//                       onClick={handleNext}
//                       disabled={!formData.name || !formData.age}
//                       className="w-full bg-primary text-background font-display font-bold py-5 rounded-2xl hover:bg-white transition-all uppercase text-sm tracking-widest shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed group flex items-center justify-center gap-3 transform hover:-translate-y-1"
//                     >
//                       <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
//                       Access Dashboard
//                       <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
//                     </button>
                    
//                     <button 
//                       onClick={() => setStep(1)}
//                       className="w-full text-xs font-bold text-on-surface-variant uppercase tracking-[0.3em] hover:text-white transition-colors"
//                     >
//                       Back to login
//                     </button>
//                   </div>
//                 )}
//               </motion.div>
//             </AnimatePresence>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

export default function App() {
  return (
      <AppContent />
    
  );
}


function AppContent() {
  const [onboardingData, setOnboardingData] = useState<{ name: string; age: string } | null>(null);


  return (
    <BrowserRouter>
  <Routes>
    <Route path="/" element={<Intro />} />
    <Route path="/*" element={<Main />} />
  </Routes>
</BrowserRouter>
  )
}


