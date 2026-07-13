import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import Layout from "./components/Layout";
import Discovery from "./pages/Discovery";
import TournamentDetails from "./pages/TournamentDetails";
import TeamManagement from "./pages/TeamManagement";
import EightBallLeaderboard from "./pages/EightBallLeaderboard";
import Profile from "./pages/Profile";
import { User as LucideUser, Trophy, ArrowRight, Sparkles, Loader2, Menu, Search, LogOut, Bell, Settings, Instagram} from "lucide-react";
const API_URL = "https://chase-l9no.onrender.com"
const AuthContext = createContext(undefined);
const defaultAuthContext = {
  user: null,
  setUser: () => {},
  loading: false,
  refetchAuth: async () => {},
};

export function AuthProvider({children}) {
  const [user,setUser] = useState(null)
  const [loading,setLoading] = useState(true)

  const refetchAuth = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetchAuth()
  },[])

  return (
  <AuthContext.Provider value={{user,setUser,loading,refetchAuth}}>
    {children}
  </AuthContext.Provider>
)
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context ?? defaultAuthContext;
};

function ProtectedRoute({children}) {
  const {user,loading} = useAuth();
  if (loading) return <p>Loading...</p>
  if (!user) return <Navigate to="/" replace/>

  return children
}

export async function handleLogout() {
  try {
    const response = await fetch(`${API_URL}/api/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) return false;
    return true;
  } catch (err) { return false; }
}

export function Main() {
  return (
    <Layout>
      <Routes>
        <Route path="/tournaments/pro-league" element={<ProtectedRoute><TournamentDetails /></ProtectedRoute>} />
        <Route path="/tournaments" element={<ProtectedRoute><Discovery /></ProtectedRoute>} />
        <Route path="/teams" element={<ProtectedRoute><TeamManagement /></ProtectedRoute>} />
        <Route path="/activity" element={<ProtectedRoute><Discovery /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/leaderboard/8ball" element={<ProtectedRoute><EightBallLeaderboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/tournaments" replace />} />
      </Routes>
    </Layout>
  );
}

export function Intro() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [loginInput, setLoginInput] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [modalTab, setModalTab] = useState<"Login" | "Sign Up">("Login");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupAge, setSignupAge] = useState("");
  const {setUser,refetchAuth} = useAuth()

  async function handleLogin() {
      try {

        const response = await fetch(`${API_URL}/api/login`,{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // needed if you're using cookies/sessions
          body: JSON.stringify({loginInput,loginPassword})
        })

        const data = await response.json().catch(() => null);

        if (!response.ok) {
        return false;
      }
      return true
      }

      catch (err) {return false}
  }


  const handleGoogleLogin = async () => {
  setIsRedirecting(true);
  const isValid = await handleLogin()
  console.log(isValid)
  if (isValid) {
    setUser({email: loginInput})
    refetchAuth()
    await refetchAuth()
    console.log("Refetch done")
    setIsLoggedIn(true);
    setShowLogin(false);
    setIsRedirecting(false);
    navigate("/tournaments", { replace: true });
    console.log("navigated")
  } 
  else {
    setIsRedirecting(false)
  }; 
};

  const handleDashboardClick = () => {
    if (isLoggedIn) {
      navigate("/tournaments", { replace: true });
    } else {
      setShowLogin(true);
    }
  };

  return (
    <div className="bg-background min-h-screen overflow-hidden relative">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 bg-[#1A1A1A] border-b border-outline-variant/20 sticky top-0 z-30">
        <div className="flex items-center gap-4 flex-1">
          <img src="/chasewhite.png" alt="Chase" className="h-7" />
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
          <h1
            className="font-display font-black uppercase leading-[0.85] tracking-tighter text-white w-full px-4"
            style={{ fontSize: "clamp(2rem, 9vw, 7rem)" }}
          >
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
          onClick={handleDashboardClick}
          className="group relative mt-10 inline-flex items-center gap-3 bg-white text-background font-display font-bold px-10 py-4 rounded-full uppercase text-sm tracking-tight overflow-hidden shadow-[0_20px_50px_-10px_rgba(255,255,255,0.25)]"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative z-10">Join the Community</span>
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

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isRedirecting && setShowLogin(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
            >
              <div className="w-full max-w-sm bg-[#1A1A1A] rounded-2xl border border-outline-variant/20 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.9)] p-8 pointer-events-auto relative overflow-hidden">

                <AnimatePresence mode="wait">
                  {isRedirecting ? (
                    /* Redirect Animation */
                    <motion.div
                      key="redirecting"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-8 gap-6"
                    >
                      <div className="relative w-20 h-20">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary"
                        />
                        <motion.div
                          animate={{ rotate: -360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-2 rounded-full border-2 border-transparent border-t-secondary"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Trophy size={24} className="text-primary" />
                        </div>
                      </div>
                      <div className="text-center space-y-1">
                        <motion.p
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="font-display font-black uppercase tracking-widest text-white text-sm"
                        >
                          Entering the Arena
                        </motion.p>
                        <p className="text-on-surface-variant text-xs">Setting up your dashboard...</p>
                      </div>
                      <div className="w-full h-[2px] bg-surface-container rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                          className="h-full bg-gradient-to-r from-primary via-secondary to-primary"
                        />
                      </div>
                    </motion.div>

                  ) : (
                    /* Login / Signup Form */
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                      {/* Close */}
                      <button
                        onClick={() => setShowLogin(false)}
                        className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors"
                      >
                        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>

                      {/* Logo */}
                      <div className="flex justify-center mb-6">
                        <img src="/chasewhite.png" alt="Chase" className="h-6" />
                      </div>

                      {/* Login / Signup Tab */}
                      <div className="flex bg-surface-container rounded-xl p-1 mb-6">
                        {["Login", "Sign Up"].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => {
                              setModalTab(tab as "Login" | "Sign Up");
                              setLoginInput("");
                              setLoginPassword("");
                            }}
                            className={`flex-1 py-2 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all duration-200 ${
                              modalTab === tab
                                ? "bg-white text-background shadow"
                                : "text-on-surface-variant hover:text-white"
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={modalTab}
                          initial={{ opacity: 0, x: modalTab === "Login" ? -10 : 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: modalTab === "Login" ? 10 : -10 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-3 mb-6"
                        >
                          {modalTab === "Login" ? (
                            /* ── LOGIN ── */
                            <>
                              <input
                                type="text"
                                placeholder="Email or Phone number"
                                value={loginInput}
                                onChange={(e) => setLoginInput(e.target.value)}
                                className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary/50 transition-colors font-sans"
                              />
                              <input
                                type="password"
                                placeholder="Password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary/50 transition-colors font-sans"
                              />
                            </>
                          ) : (
                            /* ── SIGN UP ── */
                            <>
                              <input
                                type="text"
                                placeholder="Full Name"
                                value={signupName}
                                onChange={(e) => setSignupName(e.target.value)}
                                className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary/50 transition-colors font-sans"
                              />
                              <input
                                type="email"
                                placeholder="your@email.com"
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
                                className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary/50 transition-colors font-sans"
                              />
                              <input
                                type="tel"
                                placeholder="+91 98765 43210"
                                value={signupPhone}
                                onChange={(e) => setSignupPhone(e.target.value)}
                                className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary/50 transition-colors font-sans"
                              />
                              <input
                                type="number"
                                placeholder="Age"
                                value={signupAge}
                                onChange={(e) => setSignupAge(e.target.value)}
                                className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary/50 transition-colors font-sans"
                              />
                              <input
                                type="password"
                                placeholder="Password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className="w-full bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary/50 transition-colors font-sans"
                              />
                            </>
                          )}
                        </motion.div>
                      </AnimatePresence>

                      <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white text-background font-display font-bold py-4 rounded-xl hover:bg-primary transition-all group cursor-pointer"
                      >
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                        {modalTab === "Login" ? "Continue" : "Create Account"}
                      </button>

                      <p className="text-[10px] text-on-surface-variant/50 text-center mt-5 uppercase tracking-wider">
                        By continuing you agree to our Terms & Privacy Policy
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}

function AppContent() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="*" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}