import React,{useState} from "react";
import { Link, useLocation } from "react-router-dom";
import { BrowserRouter, Routes, Route, Navigate,useNavigate } from "react-router-dom";
import { 
  Compass, 
  Trophy, 
  Users, 
  Activity, 
  Bell, 
  Settings, 
  Search,
  Menu,
  User,
  LogOut
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import {Intro} from "../App.tsx";

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: Trophy, label: "Tournaments", path: "/tournaments" },
  { icon: Users, label: "Teams", path: "/teams" },
  { icon: Activity, label: "Activity", path: "/activity" },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  return (
    <div className="flex min-h-screen bg-background font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1A1A1A] border-r border-outline-variant/20 sticky top-0 h-screen z-40">
        <div className="p-6 mb-8">
          <Link to="/" className="text-xl font-black tracking-tighter text-white uppercase font-display">
            Chase
          </Link>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em] mt-1 font-medium italic">
            Elite Performance
          </p>
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
            <Link
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
            </Link>
            <button
              onClick={()=>navigate("/",{replace:true})}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-display text-sm font-medium text-on-surface-variant hover:text-error hover:bg-error/10 mt-1 cursor-pointer"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </nav>

        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl border border-outline-variant/30">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-variant border border-outline-variant/50 shrink-0">
               {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || "User"}
                  className="w-full h-full object-cover"
                />
               ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary uppercase font-bold">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                </div>
               )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate font-display">{user?.displayName || "Elite User"}</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Pro Tier</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-[#1A1A1A] border-b border-outline-variant/20 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button className="md:hidden text-on-surface">
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
            <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30 md:hidden">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary uppercase font-bold text-[10px]">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#1A1A1A] border-t border-outline-variant/20 px-6 flex items-center justify-between z-40">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} className={cn("p-2", isActive ? "text-primary" : "text-on-surface-variant")}>
              <Icon size={24} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
