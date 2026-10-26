'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/lib/UserContext';
import { 
  Car, 
  MapPin, 
  Calendar, 
  PlusCircle, 
  Ticket, 
  BarChart3, 
  Database, 
  Radio, 
  Wallet, 
  UserCheck, 
  ChevronDown,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, setCurrentUser, USERS } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [reloading, setReloading] = useState(false);

  const navItems = [
    { name: 'Find Rides', href: '/rides', icon: Car },
    { name: 'Offer Ride', href: '/offer-ride', icon: PlusCircle },
    { name: 'My Bookings', href: '/bookings', icon: Ticket },
    { name: 'Live Tracking (NoSQL)', href: '/live-tracking', icon: Radio },
    { name: 'Reports (DBMS Level 3)', href: '/reports', icon: BarChart3 },
    { name: 'DB Explorer & ER', href: '/database-explorer', icon: Database },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0a1526]/90 backdrop-blur-md border-b border-blue-900/40">
      {/* University Campus Notice Strip */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-4 py-1 text-xs text-blue-200 border-b border-blue-800/30 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-amber-300">PES UNIVERSITY</span>
          <span className="text-blue-300">| Smart Campus Carpool Network (RR Campus ⇄ EC Campus ⇄ Metro Hubs)</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs">
          <span className="text-emerald-400 font-medium">🍃 Zero-Carbon Initiative</span>
          <span className="text-slate-300 font-mono">DBMS Experiential Learning - Level 3</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition">
              <div className="w-full h-full bg-[#0d1b2a] rounded-[10px] flex items-center justify-center">
                <Car className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">PESU<span className="text-amber-400">Pool</span></span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">L3 DBMS</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium -mt-1">Relational + NoSQL Engine</p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-600/20 text-amber-300 border border-amber-400/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Persona Switcher & Wallet */}
          <div className="flex items-center gap-3">
            {/* Wallet pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-medium">Wallet:</span>
              <span className="font-bold text-white">₹{currentUser.wallet_balance.toFixed(2)}</span>
            </div>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 px-3 py-1.5 rounded-xl transition text-left"
              >
                <span className="text-lg">{currentUser.avatar}</span>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-white leading-tight flex items-center gap-1">
                    {currentUser.name}
                    <span className="text-[10px] font-normal text-amber-300">({currentUser.role})</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{currentUser.srn}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#121f36] border border-blue-900/60 rounded-xl shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-700/50 mb-2">
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Switch Persona / Role</p>
                    <p className="text-[11px] text-slate-400">Simulate different user actions & RBAC permissions</p>
                  </div>
                  <div className="space-y-1">
                    {USERS.map((u) => (
                      <button
                        key={u.user_id}
                        onClick={() => {
                          setCurrentUser(u);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition ${
                          currentUser.user_id === u.user_id
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-base">{u.avatar}</span>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-semibold">{u.name}</p>
                          <p className="text-[10px] opacity-80">{u.persona} • {u.srn}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
