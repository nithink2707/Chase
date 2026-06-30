import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate,useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import Layout from "./components/Layout";
import Discovery from "./pages/Discovery";
import TournamentDetails from "./pages/TournamentDetails";
import TeamManagement from "./pages/TeamManagement";
import Profile from "./pages/Profile";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { User as LucideUser, Trophy, ArrowRight, Sparkles, Loader2,Menu,Search,Bell,Settings } from "lucide-react";

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
    <div>
    <header className="h-16 flex items-center justify-between px-6 bg-[#1A1A1A] border-b border-outline-variant/20 sticky top-0 z-30">
              <div className="flex items-center gap-4 flex-1">
                <button className="md:hidden text-on-surface">
                  <Menu size={24} />
                </button>
                
                <h1 className="text-lg font-black tracking-tighter text-white uppercase font-display">
                   Chase
                </h1>
              </div>
    
            </header>
        <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
          <h1 className="text-lg font-black tracking-tighter text-white uppercase font-display">Universalizing Athleticism</h1>
       <button onClick={()=>navigate("/tournaments",{replace:true})} 
       className="inline-flex items-center gap-2 bg-white text-background font-display font-bold px-8 py-3.5 rounded-lg hover:bg-primary transition-colors uppercase text-sm tracking-tight">
        Go To Dashboard
        </button>
     </div></div>);
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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}


function AppContent() {
  const { user: firebaseUser, loading } = useAuth();
  const [onboardingData, setOnboardingData] = useState<{ name: string; age: string } | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="text-primary animate-spin" size={48} />
      </div>
    );
  }

  // if (!firebaseUser || !onboardingData) {
  //   return <Onboarding onComplete={(data) => setOnboardingData(data)} />;
  // }

  return (
    <BrowserRouter>
  <Routes>
    <Route path="/" element={<Intro />} />
    <Route path="/*" element={<Main />} />
  </Routes>
</BrowserRouter>
  )
}


