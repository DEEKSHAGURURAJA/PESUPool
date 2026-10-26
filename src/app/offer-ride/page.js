'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/UserContext';
import { 
  PlusCircle, 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Calculator,
  ShieldCheck,
  Fuel,
  Info
} from 'lucide-react';

export default function OfferRidePage() {
  const router = useRouter();
  const { currentUser } = useUser();

  const [metadata, setMetadata] = useState({ routes: [], vehicles: [] });
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    vehicle_id: '',
    route_id: '',
    travel_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    departure_time: '08:00',
    total_seats: 3,
    price_per_seat: 80,
    luggage_allowed: true,
    gender_preference: 'ANY',
    notes: 'Campus lecture commute. Punctual departure.'
  });

  const [submission, setSubmission] = useState({ loading: false, success: null, error: null });

  useEffect(() => {
    async function loadMeta() {
      try {
        const res = await fetch('/api/metadata');
        const json = await res.json();
        if (json.success) {
          setMetadata(json.data);
          if (json.data.vehicles.length > 0) {
            setFormData(prev => ({ 
              ...prev, 
              vehicle_id: json.data.vehicles[0].vehicle_id,
              route_id: json.data.routes[0]?.route_id || '' 
            }));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMeta();
  }, []);

  const selectedRoute = metadata.routes.find(r => r.route_id === Number(formData.route_id));
  const selectedVehicle = metadata.vehicles.find(v => v.vehicle_id === Number(formData.vehicle_id));

  // Intelligent Fare Calculator based on distance and fuel type
  useEffect(() => {
    if (selectedRoute) {
      const base = Number(selectedRoute.base_fare);
      let multiplier = 1.0;
      if (selectedVehicle?.fuel_type === 'ELECTRIC') multiplier = 0.85; // EV discount
      if (selectedVehicle?.vehicle_type === 'TWO_WHEELER') multiplier = 0.45;
      const suggested = Math.round(base * multiplier);
      setFormData(prev => ({ ...prev, price_per_seat: suggested }));
    }
  }, [formData.route_id, formData.vehicle_id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmission({ loading: true, success: null, error: null });

    try {
      const res = await fetch('/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driver_id: currentUser.user_id,
          vehicle_id: Number(formData.vehicle_id),
          route_id: Number(formData.route_id),
          travel_date: formData.travel_date,
          departure_time: formData.departure_time + ':00',
          total_seats: Number(formData.total_seats),
          price_per_seat: Number(formData.price_per_seat),
          luggage_allowed: formData.luggage_allowed,
          gender_preference: formData.gender_preference,
          notes: formData.notes
        })
      });

      const json = await res.json();
      if (json.success) {
        setSubmission({ loading: false, success: true, error: null });
        setTimeout(() => {
          router.push('/rides');
        }, 1500);
      } else {
        setSubmission({ loading: false, success: false, error: json.error });
      }
    } catch (err) {
      setSubmission({ loading: false, success: false, error: err.message });
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <PlusCircle className="w-4 h-4" />
          <span>Driver Mobility Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Offer a Campus Ride</h1>
        <p className="text-xs text-slate-400 mt-1">
          Post an empty seat on your regular PES University commute. Share fuel costs and earn verified driver ratings.
        </p>
      </div>

      {submission.error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{submission.error}</span>
        </div>
      )}

      {submission.success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold text-sm">Ride Successfully Scheduled!</p>
            <p className="text-[11px] text-slate-300">Redirecting to active rides explorer...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#101e38] border border-blue-900/40 rounded-3xl p-6 shadow-xl space-y-5">
        {/* Driver identity indicator */}
        <div className="bg-[#0b1424] p-3.5 rounded-2xl border border-blue-900/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-bold text-blue-300">
              {currentUser.avatar}
            </div>
            <div>
              <p className="font-bold text-white">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400">{currentUser.department} • {currentUser.srn}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Verified Driver Account
          </span>
        </div>

        {/* Route Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Select Campus Corridor / Route</label>
          <select
            value={formData.route_id}
            onChange={(e) => setFormData({ ...formData, route_id: e.target.value })}
            className="w-full bg-[#0c1628] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            required
          >
            {metadata.routes.map((r) => (
              <option key={r.route_id} value={r.route_id}>
                {r.route_name} ({r.distance_km} km • ~{r.estimated_duration_mins} mins)
              </option>
            ))}
          </select>
          {selectedRoute && (
            <p className="text-[11px] text-blue-300 mt-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{selectedRoute.origin_campus} → {selectedRoute.destination_campus}</span>
            </p>
          )}
        </div>

        {/* Vehicle Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Select Registered Vehicle</label>
          <select
            value={formData.vehicle_id}
            onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
            className="w-full bg-[#0c1628] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            required
          >
            {metadata.vehicles.map((v) => (
              <option key={v.vehicle_id} value={v.vehicle_id}>
                {v.make} {v.model} - {v.plate_number} ({v.vehicle_type}, {v.fuel_type})
              </option>
            ))}
          </select>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Departure Date</label>
            <input
              type="date"
              value={formData.travel_date}
              onChange={(e) => setFormData({ ...formData, travel_date: e.target.value })}
              className="w-full bg-[#0c1628] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Departure Time</label>
            <input
              type="time"
              value={formData.departure_time}
              onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
              className="w-full bg-[#0c1628] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Seats and Fare with Calculator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Available Seats</label>
            <input
              type="number"
              min="1"
              max="6"
              value={formData.total_seats}
              onChange={(e) => setFormData({ ...formData, total_seats: Number(e.target.value) })}
              className="w-full bg-[#0c1628] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center justify-between">
              <span>Price Per Seat (₹)</span>
              <span className="text-[10px] text-amber-400 font-normal">Intelligent algorithm suggested</span>
            </label>
            <input
              type="number"
              min="10"
              max="500"
              value={formData.price_per_seat}
              onChange={(e) => setFormData({ ...formData, price_per_seat: Number(e.target.value) })}
              className="w-full bg-[#0c1628] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-bold text-amber-300"
              required
            />
          </div>
        </div>

        {/* Gender Preference & Luggage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Gender Preference</label>
            <select
              value={formData.gender_preference}
              onChange={(e) => setFormData({ ...formData, gender_preference: e.target.value })}
              className="w-full bg-[#0c1628] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ANY">Any (All PESU Commuters)</option>
              <option value="FEMALE_ONLY">Female Only</option>
              <option value="MALE_ONLY">Male Only</option>
            </select>
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={formData.luggage_allowed}
                onChange={(e) => setFormData({ ...formData, luggage_allowed: e.target.checked })}
                className="rounded bg-[#0c1628] border-slate-700 text-blue-600 focus:ring-0"
              />
              <span>Backpacks & College Bags Allowed</span>
            </label>
          </div>
        </div>

        {/* Driver Notes */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Trip Notes & Landmarks</label>
          <input
            type="text"
            placeholder="e.g. Waiting near Gate 2 ATM, leaving right on time"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full bg-[#0c1628] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submission.loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
        >
          {submission.loading ? (
            <span>Inserting Ride into MySQL...</span>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              <span>Publish Ride on PESUPool</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
