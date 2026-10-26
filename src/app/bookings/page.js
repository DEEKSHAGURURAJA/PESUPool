'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/lib/UserContext';
import { 
  Ticket, 
  MapPin, 
  Calendar, 
  Clock, 
  Car, 
  Phone, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Wallet,
  ShieldCheck,
  X
} from 'lucide-react';

export default function BookingsPage() {
  const { currentUser } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cancellation modal
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('Change in academic timetable');
  const [cancelStatus, setCancelStatus] = useState({ loading: false, success: null, error: null, result: null });

  async function loadBookings() {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings?passenger_id=${currentUser.user_id}`);
      const json = await res.json();
      if (json.success) {
        setBookings(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, [currentUser]);

  async function handleConfirmCancel(e) {
    e.preventDefault();
    if (!cancellingBooking) return;

    setCancelStatus({ loading: true, success: null, error: null, result: null });
    try {
      const res = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: cancellingBooking.booking_id,
          reason: cancelReason,
          cancelled_by: 'PASSENGER'
        })
      });

      const json = await res.json();
      if (json.success) {
        setCancelStatus({ loading: false, success: true, error: null, result: json });
        loadBookings();
      } else {
        setCancelStatus({ loading: false, success: false, error: json.error, result: null });
      }
    } catch (err) {
      setCancelStatus({ loading: false, success: false, error: err.message, result: null });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Ticket className="w-4 h-4" />
            <span>Campus Boarding Passes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">My Ride Reservations</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your booked carpool seats, view live digital QR boarding passes, and process ACID cancellations.
          </p>
        </div>

        <button
          onClick={loadBookings}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
          <span>Refresh Bookings</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading your reservations from database...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-[#101e38] border border-blue-900/40 rounded-3xl p-12 text-center space-y-3">
          <Ticket className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Bookings Found for {currentUser.name}</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You currently have no ride reservations. Browse active campus routes to reserve a seat!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {bookings.map((b) => {
            const isConfirmed = b.booking_status === 'CONFIRMED';
            const isCancelled = b.booking_status === 'CANCELLED';
            const isCompleted = b.booking_status === 'COMPLETED';

            return (
              <div
                key={b.booking_id}
                className="bg-[#111f38] border border-blue-900/40 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between"
              >
                {/* Status bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">PASS #{b.booking_id}</span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-xs font-bold text-blue-300">{b.route_name}</span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      isConfirmed
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : isCancelled
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    {b.booking_status}
                  </span>
                </div>

                {/* Journey route details */}
                <div className="py-4 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"></span>
                      <span className="font-semibold text-white">Pickup:</span>
                      <span>{b.pickup_stop}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300 pl-0.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0"></span>
                      <span className="font-semibold text-white">Drop:</span>
                      <span>{b.drop_stop}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-[#0c1527] p-3 rounded-xl border border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>{b.travel_date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>{b.departure_time?.slice(0, 5)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-amber-400" />
                      <span>{b.make} {b.model} ({b.plate_number})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Driver: {b.driver_name}</span>
                    </div>
                  </div>
                </div>

                {/* QR Code and Actions */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                      <QrCode className="w-3.5 h-3.5 text-amber-400" />
                      <span className="truncate max-w-[150px]">{b.qr_code_token}</span>
                    </div>
                    <div className="text-xs text-slate-300 font-semibold mt-1">
                      Fare: <span className="font-bold text-amber-400">₹{Number(b.total_fare).toFixed(2)}</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">({b.payment_method})</span>
                    </div>
                  </div>

                  {isConfirmed && (
                    <button
                      onClick={() => {
                        setCancellingBooking(b);
                        setCancelStatus({ loading: false, success: null, error: null, result: null });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition"
                    >
                      Cancel Seat
                    </button>
                  )}

                  {isCancelled && b.refund_amount && (
                    <span className="text-[11px] text-emerald-400 font-medium">
                      Refunded: ₹{Number(b.refund_amount).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Modal */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#101e38] border border-blue-800/60 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
            <button
              onClick={() => setCancellingBooking(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>ACID Stored Procedure Cancellation</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">Cancel Booking #{cancellingBooking.booking_id}</h2>
              <p className="text-xs text-slate-400">Trigger will automatically restore seats to Ride #{cancellingBooking.ride_id}</p>
            </div>

            {cancelStatus.error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                {cancelStatus.error}
              </div>
            )}

            {cancelStatus.success && cancelStatus.result && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
                <p className="font-bold text-sm">Booking Cancelled & Refunded!</p>
                <p>{cancelStatus.result.message}</p>
                <div className="pt-2">
                  <button
                    onClick={() => setCancellingBooking(null)}
                    className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {!cancelStatus.success && (
              <form onSubmit={handleConfirmCancel} className="space-y-4">
                <div className="bg-[#0b1424] p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Original Fare Paid:</span>
                    <span className="font-bold text-white">₹{Number(cancellingBooking.total_fare).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Cancellation Fee (10%):</span>
                    <span className="text-rose-400">-₹{(Number(cancellingBooking.total_fare) * 0.10).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-2">
                    <span>Net Refund into PESU Wallet:</span>
                    <span>₹{(Number(cancellingBooking.total_fare) * 0.90).toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Reason for Cancellation</label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full bg-[#0c1628] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="Change in academic timetable">Change in academic timetable / exam</option>
                    <option value="Opted for PES University campus bus">Opted for PES University campus bus</option>
                    <option value="Personal emergency">Personal emergency</option>
                    <option value="Weather / heavy rain warning">Weather / heavy rain warning</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCancellingBooking(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                  >
                    Keep Booking
                  </button>
                  <button
                    type="submit"
                    disabled={cancelStatus.loading}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-lg shadow-rose-600/30"
                  >
                    {cancelStatus.loading ? 'Processing...' : 'Confirm Cancellation'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
