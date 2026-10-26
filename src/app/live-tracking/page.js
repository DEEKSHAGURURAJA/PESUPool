'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/lib/UserContext';
import { 
  Radio, 
  MapPin, 
  Navigation, 
  Send, 
  Zap, 
  Clock, 
  RefreshCw, 
  Activity, 
  MessageSquare, 
  AlertCircle, 
  Database,
  ArrowRight,
  Gauge
} from 'lucide-react';

export default function LiveTrackingPage() {
  const { currentUser } = useUser();
  const [selectedRideId, setSelectedRideId] = useState(1);
  const [telemetry, setTelemetry] = useState([]);
  const [chats, setChats] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  const waypoints = [
    { name: "RR Campus Gate 1", lat: 12.9352, lng: 77.5348 },
    { name: "Banashankari Metro", lat: 12.9176, lng: 77.5736 },
    { name: "Silk Board Flyover", lat: 12.9174, lng: 77.6229 },
    { name: "HSR Layout Sector 2", lat: 12.9116, lng: 77.6389 },
    { name: "Electronic City Tech Gate", lat: 12.8452, lng: 77.6602 }
  ];

  async function loadData() {
    setLoading(true);
    try {
      const [tRes, cRes] = await Promise.all([
        fetch(`/api/nosql/telemetry?ride_id=${selectedRideId}`),
        fetch(`/api/nosql/chat?ride_id=${selectedRideId}`)
      ]);
      const [tJson, cJson] = await Promise.all([tRes.json(), cRes.json()]);

      if (tJson.success) setTelemetry(tJson.data);
      if (cJson.success) setChats(cJson.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // 10s polling
    return () => clearInterval(interval);
  }, [selectedRideId]);

  async function handleSendChat(e) {
    e.preventDefault();
    if (!chatInput.trim()) return;

    try {
      const res = await fetch('/api/nosql/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ride_id: selectedRideId,
          sender_id: currentUser.user_id,
          sender_name: currentUser.name,
          sender_role: currentUser.role === 'STUDENT' ? 'PASSENGER' : 'DRIVER',
          message: chatInput,
          message_type: 'TEXT'
        })
      });
      const json = await res.json();
      if (json.success) {
        setChats(prev => [...prev, json.data]);
        setChatInput('');
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSimulatePing() {
    setSimulating(true);
    const randomWaypoint = waypoints[Math.floor(Math.random() * waypoints.length)];
    const randomSpeed = Math.floor(Math.random() * 30) + 35; // 35 - 65 km/h
    const randomDelay = Math.floor(Math.random() * 5); // 0 - 5 mins

    try {
      const res = await fetch('/api/nosql/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ride_id: selectedRideId,
          driver_id: 1,
          location: { type: "Point", coordinates: [randomWaypoint.lng, randomWaypoint.lat] },
          speed_kmph: randomSpeed,
          heading: 140,
          current_segment: randomWaypoint.name,
          next_stop: "PES EC Campus Tech Gate",
          estimated_delay_mins: randomDelay,
          battery_fuel_level_pct: 78
        })
      });
      const json = await res.json();
      if (json.success) {
        setTelemetry(prev => [json.data, ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  }

  const latestPing = telemetry[0] || {
    current_segment: "Silk Board Elevated Corridor",
    speed_kmph: 48.0,
    estimated_delay_mins: 2,
    battery_fuel_level_pct: 82,
    location: { coordinates: [77.6229, 12.9174] },
    timestamp: new Date().toISOString()
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>NoSQL Event Stream Showcase (MongoDB)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Live Fleet Telemetry & Chat</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time GPS coordinate telemetry, speed vectors, ETA monitoring, and passenger-driver communications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedRideId}
            onChange={(e) => setSelectedRideId(Number(e.target.value))}
            className="bg-[#101e38] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
          >
            <option value="1">Ride #1: RR Campus ⇄ EC Campus Express</option>
            <option value="2">Ride #2: Banashankari Metro Shuttle</option>
            <option value="3">Ride #3: Koramangala Hub Commute</option>
          </select>

          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Refresh stream"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Main Grid: Telemetry & Map + Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Telemetry Gauges & Waypoint Tracker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Real-time Status Card */}
          <div className="bg-gradient-to-br from-[#10223d] to-[#0c1628] border border-blue-900/60 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Navigation className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{latestPing.current_segment}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                      LIVE STREAM
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">Heading towards EC Campus Tech Gate</p>
                </div>
              </div>

              <button
                onClick={handleSimulatePing}
                disabled={simulating}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{simulating ? 'Broadcasting...' : 'Simulate GPS Ping'}</span>
              </button>
            </div>

            {/* Gauges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#0b1424] p-3.5 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Speed</span>
                <span className="text-2xl font-black text-white mt-1 block">
                  {latestPing.speed_kmph} <span className="text-xs font-normal text-slate-400">km/h</span>
                </span>
                <span className="text-[10px] text-emerald-400">Optimal ORR Flow</span>
              </div>

              <div className="bg-[#0b1424] p-3.5 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Traffic Delay</span>
                <span className="text-2xl font-black text-amber-400 mt-1 block">
                  +{latestPing.estimated_delay_mins} <span className="text-xs font-normal text-slate-400">mins</span>
                </span>
                <span className="text-[10px] text-slate-400">Silk Board Junction</span>
              </div>

              <div className="bg-[#0b1424] p-3.5 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Energy / Fuel</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">
                  {latestPing.battery_fuel_level_pct}%
                </span>
                <span className="text-[10px] text-emerald-300">EV Battery Nominal</span>
              </div>

              <div className="bg-[#0b1424] p-3.5 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">GPS Coordinates</span>
                <span className="text-xs font-mono font-bold text-blue-300 mt-2 block truncate">
                  {latestPing.location?.coordinates ? `${latestPing.location.coordinates[1].toFixed(4)}°, ${latestPing.location.coordinates[0].toFixed(4)}°` : '12.9352, 77.5348'}
                </span>
                <span className="text-[10px] text-slate-400">WGS84 Datum</span>
              </div>
            </div>

            {/* Corridor Progression Tracker */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-300 block">Corridor Checkpoint Progression:</span>
              <div className="relative flex items-center justify-between pt-2">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0"></div>
                {waypoints.map((wp, idx) => {
                  const isPassed = idx <= 2;
                  const isCurrent = idx === 2;
                  return (
                    <div key={idx} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition border-2 ${
                          isCurrent
                            ? 'bg-amber-400 text-slate-900 border-white shadow-lg shadow-amber-400/50 scale-125 animate-bounce'
                            : isPassed
                            ? 'bg-emerald-500 text-white border-emerald-400'
                            : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-2 text-center max-w-[80px] truncate font-medium">
                        {wp.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Telemetry Document Log */}
          <div className="bg-[#101e38] border border-blue-900/40 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                <span>Raw MongoDB Document Stream (ride_telemetry collection)</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">{telemetry.length} documents</span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 font-mono text-[11px]">
              {telemetry.map((t, idx) => (
                <div key={idx} className="bg-[#0b1424] p-2.5 rounded-xl border border-slate-800/80 text-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">[{new Date(t.timestamp).toLocaleTimeString()}]</span>
                    <span className="text-white font-semibold">{t.current_segment}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-[10px]">
                    <span>Speed: {t.speed_kmph} km/h</span>
                    <span>Delay: +{t.estimated_delay_mins}m</span>
                    <span className="text-amber-400">Lng: {t.location?.coordinates?.[0]?.toFixed(3)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: In-Ride Passenger-Driver Live Chat */}
        <div className="bg-[#101e38] border border-blue-900/40 rounded-3xl p-5 shadow-xl flex flex-col h-[560px]">
          {/* Chat Header */}
          <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Ride #{selectedRideId} Chat</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
              ride_chat_logs
            </span>
          </div>

          {/* Messages container */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
            {chats.length === 0 ? (
              <div className="text-center text-slate-500 py-12">
                No chat messages recorded for this ride yet. Send a pickup note!
              </div>
            ) : (
              chats.map((c, idx) => {
                const isMe = c.sender_id === currentUser.user_id;
                const isDriver = c.sender_role === 'DRIVER';

                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px]">
                      <span className="font-bold text-slate-300">{c.sender_name}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          isDriver
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {c.sender_role}
                      </span>
                      <span className="text-slate-500">
                        {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div
                      className={`max-w-[85%] p-3 rounded-2xl ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-[#0b1424] border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      <p>{c.message}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Chat input */}
          <form onSubmit={handleSendChat} className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
            <input
              type="text"
              placeholder={`Message as ${currentUser.name}...`}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-[#0b1424] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shrink-0 shadow-md shadow-blue-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
