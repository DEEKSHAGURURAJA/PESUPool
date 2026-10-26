'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Car, 
  MapPin, 
  ShieldCheck, 
  Leaf, 
  TrendingUp, 
  ArrowRight, 
  Users, 
  Clock, 
  Zap, 
  Sparkles,
  ChevronRight,
  Database,
  Layers,
  Award,
  Radio
} from 'lucide-react';

export default function HomePage() {
  const [stats, setStats] = useState({
    activeRides: 6,
    totalCommuters: 12,
    co2SavedKg: 42.15,
    rupeesSaved: 3672.00
  });

  const [featuredRides, setFeaturedRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/rides');
        const json = await res.json();
        if (json.success) {
          setFeaturedRides(json.data.slice(0, 4));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c1a32] via-[#102447] to-[#0d1627] border border-blue-900/50 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>PES University Campus Mobility Network</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Smart Carpooling for the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">
              PESU Community
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Connect with verified students, faculty, and campus staff traveling along the same routes. 
            Reduce commute costs, traffic bottlenecks along Outer Ring Road & Hosur Road, and fuel consumption with 
            guaranteed seat reservations backed by an ACID relational database and real-time NoSQL fleet telemetry.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/rides"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition hover:scale-105"
            >
              <Car className="w-4 h-4" />
              <span>Discover Active Rides</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/offer-ride"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-bold text-sm transition"
            >
              <span>Offer a Ride</span>
            </Link>

            <Link
              href="/reports"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-xs transition"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>View Level 3 Demo Reports</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111e36] border border-blue-900/40 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scheduled Rides</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{stats.activeRides}</span>
            <span className="text-xs text-emerald-400 font-semibold">● Live Now</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Inter-campus & metro shuttles</p>
        </div>

        <div className="bg-[#111e36] border border-blue-900/40 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verified Commuters</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{stats.totalCommuters}</span>
            <span className="text-xs text-blue-300 font-semibold">SRN/PRN Verified</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Students, Faculty & Staff</p>
        </div>

        <div className="bg-[#111e36] border border-blue-900/40 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Carbon Offset</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{stats.co2SavedKg}</span>
            <span className="text-xs text-emerald-400 font-semibold">kg CO₂</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Based on shared distance</p>
        </div>

        <div className="bg-[#111e36] border border-blue-900/40 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Student Savings</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">₹{stats.rupeesSaved.toLocaleString()}</span>
            <span className="text-xs text-amber-400 font-semibold">vs Cabs</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Compared to Ola/Uber fares</p>
        </div>
      </div>

      {/* Featured Scheduled Rides */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-400" />
              <span>Upcoming Scheduled Campus Rides</span>
            </h2>
            <p className="text-xs text-slate-400">Verified rides departing soon with open seating capacity</p>
          </div>
          <Link href="/rides" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading campus rides from MySQL...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredRides.map((ride) => (
              <div 
                key={ride.ride_id}
                className="bg-[#111f38] border border-blue-900/40 rounded-2xl p-5 hover:border-blue-700/60 transition group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {ride.route_name}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{ride.origin_campus}</span>
                        <span className="text-slate-500">→</span>
                        <span>{ride.destination_campus}</span>
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-amber-400">₹{Number(ride.price_per_seat).toFixed(0)}</span>
                      <span className="text-[10px] text-slate-400 block">per seat</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1 border-t border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>{ride.travel_date} at {ride.departure_time?.slice(0, 5)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>{ride.make} {ride.model} ({ride.fuel_type})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-semibold text-emerald-400">{ride.available_seats} of {ride.total_seats} seats left</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>Driver: {ride.driver_name} (⭐ {ride.driver_rating})</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                    {ride.notes || 'AC carpool, quiet study commute'}
                  </span>
                  <Link
                    href={`/rides?reserve=${ride.ride_id}`}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1"
                  >
                    <span>Reserve Seat</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dual Database Architecture Showcase */}
      <div className="bg-[#0e1a2f] border border-blue-900/50 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>DBMS Architecture & Technology Stack Justification</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Multi-Modal Paradigm: SQL + NoSQL</h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Carefully partitioned database architecture designed for strict financial/booking consistency and high-frequency real-time event streaming.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#12213d] border border-blue-800/50 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-base text-blue-300 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span>RDBMS (MySQL 8.4)</span>
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                ACID Transactions
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Maintains strongly consistent relational entities: <b>USERS</b>, <b>DRIVERS</b>, <b>PASSENGERS</b>, <b>VEHICLES</b>, <b>ROUTES</b>, <b>RIDES</b>, <b>BOOKINGS</b>, <b>PAYMENTS</b>, <b>RATINGS</b>, and <b>CANCELLATIONS</b>.
            </p>
            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>Atomic seat reservations with row-level locking (<code className="text-amber-300">FOR UPDATE</code>)</li>
              <li>Stored Procedure <code className="text-blue-300">sp_book_ride</code> prevents concurrent double-booking</li>
              <li>Triggers prevent driver self-booking & restore seats on cancellation</li>
              <li>Complex aggregation queries with <code className="text-blue-300">GROUP BY</code>, <code className="text-blue-300">HAVING</code>, and nested subqueries</li>
            </ul>
          </div>

          <div className="bg-[#12213d] border border-emerald-800/50 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-base text-emerald-300 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>NoSQL (MongoDB)</span>
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Telemetry & Chat
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Handles unstructured, schema-free, high-velocity streaming data: <b>ride_telemetry</b> (GPS breadcrumbs, speeds, ETAs) and <b>ride_chat_logs</b> (in-transit driver-passenger pickup coordination).
            </p>
            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>High write throughput without table locking or schema rigidity</li>
              <li>MongoDB Aggregation Pipeline calculates segment speeds & traffic delays</li>
              <li>Geospatial Point indexing for campus checkpoint proximity</li>
              <li>Resilient dual-mode connector: Live MongoDB driver with automatic fallback</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
