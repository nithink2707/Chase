import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { 
  Trophy, 
  Target, 
  Bell, 
  Settings, 
  Search, 
  Menu, 
  X, 
  User, 
  LogOut 
} from "lucide-react";
import { cn } from "../lib/utils";
import {handleLogout,useAuth} from "../App"

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: Trophy,  label: "Tournaments", path: "/tournaments" },
  { icon: Target,  label: "Leaderboard", path: "/leaderboard/8ball" }
  // { icon: Users,   label: "Teams",       path: "/teams" },
  // { icon: Activity,label: "Activity",    path: "/activity" },
];


export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const {setUser} = useAuth()
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const onLogout = async () => {
    await handleLogout();
    setUser(null);
    navigate("/", { replace: true });
  };


  return (
    <div className="flex min-h-screen bg-background font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1A1A1A] border-r border-outline-variant/20 sticky top-0 h-screen z-40">
        <div className="p-6 mb-2  ">
          <div className="flex justify-center">
            <img src="/chasewhite.png" alt="Chase" className="h-7"/>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-display text-sm font-medium",
                  isActive 
                    ? "bg-surface-container-highest text-white border-r-2 border-primary" 
                    : "text-on-surface-variant hover:text-white hover:bg-surface-container-high"
                )}
              >
                <Icon size={20} className={cn(isActive ? "text-primary" : "text-on-surface-variant")} />
                {item.label}
              </Link>
            );
          })}
          
          <div className="mt-8 pt-6 border-t border-outline-variant/10">
            {/* <Link
              to="/profile"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-display text-sm font-medium",
                location.pathname === "/profile"
                    ? "bg-surface-container-highest text-white border-r-2 border-primary" 
                    : "text-on-surface-variant hover:text-white hover:bg-surface-container-high"
              )}
            >
              <User size={20} />
              Profile
            </Link> */}
            <button
              onClick={async ()=>{
                await handleLogout()
                setUser(null)
                navigate("/",{replace:true})
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-display text-sm font-medium text-on-surface-variant hover:text-error hover:bg-error/10 mt-1 cursor-pointer"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </nav>

        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl border border-outline-variant/30">
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate font-display">Elite User</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Pro Tier</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Slide-out Drawer Overlay */}
      {mobileDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Mobile Slide-out Drawer Panel */}
      <aside className={cn(
        "fixed top-0 left-0 bottom-0 w-72 bg-[#1A1A1A] border-r border-outline-variant/20 z-50 flex flex-col transition-transform duration-300 ease-in-out md:hidden",
        mobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-5 flex items-center justify-between border-b border-outline-variant/10">
          <img src="/chasewhite.png" alt="Chase" className="h-6" />
          <button 
            onClick={() => setMobileDrawerOpen(false)}
            className="p-1 text-on-surface-variant hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl border border-outline-variant/30">
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate font-display">Elite User</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Pro Tier</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileDrawerOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-display text-sm font-medium",
                  isActive 
                    ? "bg-surface-container-highest text-white border-l-4 border-primary" 
                    : "text-on-surface-variant hover:text-white"
                )}
              >
                <Icon size={20} className={cn(isActive ? "text-primary" : "text-on-surface-variant")} />
                {item.label}
              </Link>
            );
          })}

          {/* <Link
            to="/profile"
            onClick={() => setMobileDrawerOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-display text-sm font-medium",
              location.pathname === "/profile"
                ? "bg-surface-container-highest text-white border-l-4 border-primary" 
                : "text-on-surface-variant hover:text-white"
            )}
          >
            <User size={20} className={location.pathname === "/profile" ? "text-primary" : "text-on-surface-variant"} />
            Profile
          </Link> */}
        </nav>

        <div className="p-4 border-t border-outline-variant/10">
          <button
            onClick={() => {
              setMobileDrawerOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-display text-sm font-medium text-error hover:bg-error/10 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>



      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-[#1A1A1A] border-b border-outline-variant/20 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden text-on-surface p-1 hover:text-primary transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden md:flex items-center gap-3 bg-surface-container px-4 py-2 rounded-full border border-outline-variant/20 max-w-md w-full">
              <Search size={18} className="text-on-surface-variant" />
              <input 
                type="text" 
                placeholder="Search tournaments, teams, players..."
                className="bg-transparent border-none outline-none text-sm text-on-surface w-full placeholder:text-on-surface-variant/50"
              />
            </div>
            
            <h1 className="md:hidden text-lg font-black tracking-tighter text-white uppercase font-display">
               Chase
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-on-surface-variant hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-[#1A1A1A]"></span>
            </button>
            <button className="p-2 text-on-surface-variant hover:text-white transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>

{/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-outline-variant/20 px-4 z-40">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-1 py-3 px-3 relative"
              >
                {isActive && (
                  <span className="absolute top-2 inset-x-1 h-[2px] rounded-full bg-primary" />
                )}
                <Icon size={22} className={isActive ? "text-primary" : "text-on-surface-variant"} />
                <span className={`text-[10px] font-display font-bold uppercase tracking-wider ${isActive ? "text-white" : "text-on-surface-variant"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          <Link to="/profile" className="flex flex-col items-center gap-1 py-3 px-3 relative">
            {location.pathname === "/profile" && (
              <span className="absolute top-2 inset-x-1 h-[2px] rounded-full bg-primary" />
            )}
            <User size={22} className={location.pathname === "/profile" ? "text-primary" : "text-on-surface-variant"} />
            <span className={`text-[10px] font-display font-bold uppercase tracking-wider ${location.pathname === "/profile" ? "text-white" : "text-on-surface-variant"}`}>
              Profile
            </span>
          </Link>
        </div>
      </nav>

    </div>  
  );
}