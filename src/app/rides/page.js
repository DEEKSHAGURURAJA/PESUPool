'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@/lib/UserContext';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  QrCode, 
  Zap, 
  ArrowRight, 
  Wallet 
} from 'lucide-react';

function RidesContent() {
  const searchParams = useSearchParams();
  const preselectRideId = searchParams.get('reserve');
  const { currentUser } = useUser();

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    date: '',
    seats: ''
  });

  // Booking modal state
  const [selectedRide, setSelectedRide] = useState(null);
  const [bookingSeats, setBookingSeats] = useState(1);
  const [pickupStop, setPickupStop] = useState('');
  const [dropStop, setDropStop] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PESU_WALLET');
  const [bookingStatus, setBookingStatus] = useState({ loading: false, success: null, error: null, result: null });

  async function fetchRides() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.origin) params.set('origin', filters.origin);
      if (filters.destination) params.set('destination', filters.destination);
      if (filters.date) params.set('date', filters.date);
      if (filters.seats) params.set('seats', filters.seats);

      const res = await fetch(`/api/rides?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setRides(json.data);
        if (preselectRideId) {
          const match = json.data.find(r => r.ride_id === Number(preselectRideId));
          if (match) openBookingModal(match);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRides();
  }, [filters]);

  function openBookingModal(ride) {
    setSelectedRide(ride);
    setBookingSeats(1);
    setPaymentMethod('PESU_WALLET');
    setBookingStatus({ loading: false, success: null, error: null, result: null });

    // Parse stops from JSON
    let stops = [];
    try {
      stops = typeof ride.pickup_points_json === 'string' 
        ? JSON.parse(ride.pickup_points_json) 
        : ride.pickup_points_json;
    } catch (e) {
      stops = [ride.origin_campus, ride.destination_campus];
    }
    setPickupStop(stops[0] || ride.origin_campus);
    setDropStop(stops[stops.length - 1] || ride.destination_campus);
  }

  async function handleBookRide(e) {
    e.preventDefault();
    if (!selectedRide) return;

    setBookingStatus({ loading: true, success: null, error: null, result: null });

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ride_id: selectedRide.ride_id,
          passenger_id: currentUser.user_id,
          seats_booked: bookingSeats,
          pickup_stop: pickupStop,
          drop_stop: dropStop,
          payment_method: paymentMethod
        })
      });

      const json = await res.json();
      if (json.success) {
        setBookingStatus({
          loading: false,
          success: true,
          error: null,
          result: json
        });
        // Refresh rides to update remaining seats
        fetchRides();
      } else {
        setBookingStatus({
          loading: false,
          success: false,
          error: json.error || 'Booking transaction failed.',
          result: null
        });
      }
    } catch (err) {
      setBookingStatus({
        loading: false,
        success: false,
        error: err.message,
        result: null
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Car className="w-7 h-7 text-blue-400" />
            <span>Discover Campus Rides</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search scheduled rides connecting PES University RR Campus, Electronic City Campus, and city metro corridors.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl">
          <span className="text-slate-400">Booking as:</span>
          <span className="font-bold text-amber-300">{currentUser.name}</span>
          <span className="text-slate-400">({currentUser.srn})</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#101e38] border border-blue-900/40 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Origin Point / Campus</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="e.g. RR Campus, Banashankari"
                value={filters.origin}
                onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
                className="w-full bg-[#0a1424] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Destination Campus / Hub</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="e.g. EC Campus, Silk Board"
                value={filters.destination}
                onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                className="w-full bg-[#0a1424] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Travel Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="w-full bg-[#0a1424] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Min Seats Available</label>
            <div className="relative">
              <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={filters.seats}
                onChange={(e) => setFilters({ ...filters, seats: e.target.value })}
                className="w-full bg-[#0a1424] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Any Capacity</option>
                <option value="1">1 Seat</option>
                <option value="2">2+ Seats</option>
                <option value="3">3+ Seats</option>
              </select>
            </div>
          </div>
        </div>

        {(filters.origin || filters.destination || filters.date || filters.seats) && (
          <div className="flex justify-end pt-1">
            <button
              onClick={() => setFilters({ origin: '', destination: '', date: '', seats: '' })}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Ride Results */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Querying available rides from database...</div>
      ) : rides.length === 0 ? (
        <div className="bg-[#101e38] border border-blue-900/40 rounded-2xl p-12 text-center space-y-3">
          <Car className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Matching Campus Rides Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search filters or be the first to schedule a carpool along this route!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rides.map((ride) => (
            <div
              key={ride.ride_id}
              className="bg-[#111f38] border border-blue-900/40 rounded-2xl p-5 hover:border-blue-600/60 transition shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {ride.route_name}
                    </span>
                    <h3 className="text-base font-bold text-white mt-2 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{ride.origin_campus}</span>
                      <span className="text-slate-500">→</span>
                      <span>{ride.destination_campus}</span>
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-400">₹{Number(ride.price_per_seat).toFixed(0)}</span>
                    <span className="text-[10px] text-slate-400 block">per seat</span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-[#0c1527] p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>{ride.travel_date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>{ride.departure_time?.slice(0, 5)} (Est. {ride.estimated_duration_mins}m)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>{ride.make} {ride.model} ({ride.plate_number})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-bold text-emerald-400">
                      {ride.available_seats} of {ride.total_seats} seats left
                    </span>
                  </div>
                </div>

                {/* Driver information */}
                <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-bold text-blue-300">
                      {ride.driver_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white leading-tight">{ride.driver_name}</p>
                      <p className="text-[10px] text-slate-400">{ride.driver_department} • ⭐ {ride.driver_rating}</p>
                    </div>
                  </div>

                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {ride.gender_preference === 'ANY' ? 'All Genders' : ride.gender_preference}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Distance: {ride.distance_km} km
                </span>
                <button
                  onClick={() => openBookingModal(ride)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition flex items-center gap-1.5"
                >
                  <span>Book Seat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#101e38] border border-blue-800/60 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedRide(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Car className="w-4 h-4" />
                <span>Seat Reservation Transaction</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">Book Ride #{selectedRide.ride_id}</h2>
              <p className="text-xs text-slate-400">{selectedRide.route_name}</p>
            </div>

            {/* Status alerts */}
            {bookingStatus.error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Transaction Rollback</p>
                  <p className="mt-0.5">{bookingStatus.error}</p>
                </div>
              </div>
            )}

            {bookingStatus.success && bookingStatus.result && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <p className="font-bold text-sm">Seat Reserved Successfully!</p>
                </div>
                <p>{bookingStatus.result.message}</p>
                <div className="bg-[#0b1424] p-3 rounded-lg border border-emerald-500/20 text-[11px] font-mono text-slate-300">
                  <p>Booking ID: #{bookingStatus.result.booking_id}</p>
                  <p>ACID Lock: Verified & Committed</p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setSelectedRide(null)}
                    className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                  >
                    Done & View Bookings
                  </button>
                </div>
              </div>
            )}

            {!bookingStatus.success && (
              <form onSubmit={handleBookRide} className="space-y-4">
                {/* Pick up & Drop Stops */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Select Pickup Point</label>
                    <select
                      value={pickupStop}
                      onChange={(e) => setPickupStop(e.target.value)}
                      className="w-full bg-[#0c1628] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      required
                    >
                      {(() => {
                        let stops = [];
                        try {
                          stops = typeof selectedRide.pickup_points_json === 'string'
                            ? JSON.parse(selectedRide.pickup_points_json)
                            : selectedRide.pickup_points_json;
                        } catch (e) {
                          stops = [selectedRide.origin_campus, selectedRide.destination_campus];
                        }
                        return stops.map((s, idx) => (
                          <option key={idx} value={s}>{s}</option>
                        ));
                      })()}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Select Drop-off Destination</label>
                    <select
                      value={dropStop}
                      onChange={(e) => setDropStop(e.target.value)}
                      className="w-full bg-[#0c1628] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      required
                    >
                      {(() => {
                        let stops = [];
                        try {
                          stops = typeof selectedRide.pickup_points_json === 'string'
                            ? JSON.parse(selectedRide.pickup_points_json)
                            : selectedRide.pickup_points_json;
                        } catch (e) {
                          stops = [selectedRide.origin_campus, selectedRide.destination_campus];
                        }
                        return [...stops].reverse().map((s, idx) => (
                          <option key={idx} value={s}>{s}</option>
                        ));
                      })()}
                    </select>
                  </div>
                </div>

                {/* Seat Count & Fare */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Seats to Book</label>
                    <select
                      value={bookingSeats}
                      onChange={(e) => setBookingSeats(Number(e.target.value))}
                      className="w-full bg-[#0c1628] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      {Array.from({ length: Math.min(selectedRide.available_seats, 4) }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n} Seat{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-[#0c1628] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="PESU_WALLET">PESU Wallet (₹{currentUser.wallet_balance.toFixed(2)})</option>
                      <option value="UPI">UPI QR / Intent</option>
                      <option value="CASH">Cash on Boarding</option>
                      <option value="CARD">Debit / Credit Card</option>
                    </select>
                  </div>
                </div>

                {/* Total Summary */}
                <div className="bg-[#0b1424] p-3.5 rounded-xl border border-blue-900/40 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Total Commute Fare:</span>
                    <p className="text-[11px] text-slate-500">₹{selectedRide.price_per_seat} × {bookingSeats} seat(s)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-amber-400">
                      ₹{(Number(selectedRide.price_per_seat) * bookingSeats).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Submit Transaction Button */}
                <button
                  type="submit"
                  disabled={bookingStatus.loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
                >
                  {bookingStatus.loading ? (
                    <span>Executing sp_book_ride ACID Transaction...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Confirm & Reserve with Stored Procedure</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RidesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading campus carpools...</div>}>
      <RidesContent />
    </Suspense>
  );
}
