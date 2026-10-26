'use client';
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Award, 
  DollarSign, 
  AlertTriangle, 
  Database, 
  Code2, 
  Download, 
  RefreshCw,
  Layers,
  CheckCircle2,
  Leaf,
  Users,
  Compass
} from 'lucide-react';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('dept-savings');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSql, setShowSql] = useState(true);

  async function loadReports() {
    setLoading(true);
    try {
      const res = await fetch('/api/reports');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  function exportCSV(tableData, filename) {
    if (!tableData || !tableData.length) return;
    const headers = Object.keys(tableData[0]).join(',');
    const rows = tableData.map(row => 
      Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + headers + '\n' + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>DBMS Experiential Learning Level 3 Demonstration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Analytical & Operational Reports</h1>
          <p className="text-xs text-slate-400 mt-1">
            Demonstrating multi-table JOINs, GROUP BY, HAVING, subqueries, aggregate metrics, and NoSQL aggregation pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSql(!showSql)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              showSql
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{showSql ? 'Hide SQL Code' : 'View SQL Code'}</span>
          </button>

          <button
            onClick={loadReports}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'dept-savings', label: '1. Department Savings (Prompt Demo)', icon: DollarSign },
          { id: 'route-occupancy', label: '2. Route Occupancy & Revenue (HAVING)', icon: TrendingUp },
          { id: 'peak-hours', label: '3. Peak Commute Hours (EXTRACT/GROUP)', icon: Clock },
          { id: 'driver-leaderboard', label: '4. Driver Leaderboard (Multi-Join)', icon: Award },
          { id: 'subquery', label: '5. Above-Average Earners (Subquery)', icon: Database },
          { id: 'cancellations', label: '6. Cancellation Analysis', icon: AlertTriangle },
          { id: 'nosql-agg', label: '7. MongoDB NoSQL Aggregation', icon: Layers },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-[#101e38] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {loading || !data ? (
        <div className="p-16 text-center text-slate-400">Executing complex DBMS queries across MySQL and MongoDB...</div>
      ) : (
        <div className="space-y-6">
          {/* ========================================================================= */}
          {/* TAB 1: Department Mobility & Financial Savings */}
          {/* ========================================================================= */}
          {activeTab === 'dept-savings' && (
            <div className="space-y-6">
              <div className="bg-[#101e38] border border-blue-900/40 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-amber-400" />
                      <span>Department Mobility, Financial Savings & Carbon Offset Report</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Evaluates average travel cost per department and total savings vs commercial cabs (~₹22/km benchmark).
                    </p>
                  </div>
                  <button
                    onClick={() => exportCSV(data.departmentSavings, 'department_savings_report')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>

                {/* Visual Comparative Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-[#0b1424] p-4 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Top Saving Department</span>
                    <span className="text-xl font-black text-amber-400 mt-1 block">
                      {data.departmentSavings[0]?.department}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">
                      ₹{Number(data.departmentSavings[0]?.total_department_savings_inr).toLocaleString()} saved
                    </span>
                  </div>

                  <div className="bg-[#0b1424] p-4 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Carbon Offset</span>
                    <span className="text-xl font-black text-emerald-400 mt-1 block">
                      {data.departmentSavings.reduce((acc, d) => acc + Number(d.total_kg_co2_offset), 0).toFixed(1)} kg CO₂
                    </span>
                    <span className="text-xs text-slate-400">Across all 6 PESU branches</span>
                  </div>

                  <div className="bg-[#0b1424] p-4 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Campus Savings</span>
                    <span className="text-xl font-black text-white mt-1 block">
                      ₹{data.departmentSavings.reduce((acc, d) => acc + Number(d.total_department_savings_inr), 0).toFixed(2)}
                    </span>
                    <span className="text-xs text-blue-300">Net student/faculty benefit</span>
                  </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#0b1424] text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4">Campus</th>
                        <th className="py-3 px-4 text-center">Commuters</th>
                        <th className="py-3 px-4 text-center">Rides Taken</th>
                        <th className="py-3 px-4 text-right">Distance (km)</th>
                        <th className="py-3 px-4 text-right">Actual Spent (₹)</th>
                        <th className="py-3 px-4 text-right">Cab Cost (₹)</th>
                        <th className="py-3 px-4 text-right text-amber-400">Net Savings (₹)</th>
                        <th className="py-3 px-4 text-right text-emerald-400">CO₂ Avoided</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {data.departmentSavings.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30 transition">
                          <td className="py-3 px-4 font-bold text-white font-sans">{row.department}</td>
                          <td className="py-3 px-4 font-sans text-slate-400">{row.campus}</td>
                          <td className="py-3 px-4 text-center">{row.active_members}</td>
                          <td className="py-3 px-4 text-center">{row.rides_shared}</td>
                          <td className="py-3 px-4 text-right">{Number(row.total_passenger_km_travelled).toFixed(1)} km</td>
                          <td className="py-3 px-4 text-right">₹{Number(row.actual_pool_expenditure_inr).toFixed(2)}</td>
                          <td className="py-3 px-4 text-right text-slate-400">₹{Number(row.equivalent_commercial_cab_cost_inr).toFixed(2)}</td>
                          <td className="py-3 px-4 text-right font-bold text-amber-400">₹{Number(row.total_department_savings_inr).toFixed(2)}</td>
                          <td className="py-3 px-4 text-right font-bold text-emerald-400">{row.total_kg_co2_offset} kg</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* SQL Explanation Drawer */}
                {showSql && (
                  <div className="bg-[#0b1424] p-4 rounded-2xl border border-blue-900/40 text-xs space-y-2 mt-4">
                    <div className="flex items-center justify-between text-blue-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Code2 className="w-4 h-4 text-amber-400" />
                        <span>Executed Query: Department Aggregation with Arithmetic Expressions</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Multi-table JOIN, GROUP BY u.department</span>
                    </div>
                    <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-3 bg-[#080e1a] rounded-xl border border-slate-800">
{`SELECT 
    u.department, u.campus,
    COUNT(DISTINCT u.user_id) AS active_members,
    COUNT(b.booking_id) AS rides_shared,
    ROUND(SUM(ro.distance_km), 1) AS total_passenger_km_travelled,
    ROUND(SUM(b.total_fare), 2) AS actual_pool_expenditure_inr,
    ROUND(SUM(ro.distance_km * 22.0), 2) AS equivalent_commercial_cab_cost_inr,
    ROUND(SUM(ro.distance_km * 22.0) - SUM(b.total_fare), 2) AS total_department_savings_inr,
    ROUND(SUM(ro.distance_km * 0.171), 2) AS total_kg_co2_offset
FROM users u
JOIN passengers p ON u.user_id = p.passenger_id
JOIN bookings b ON p.passenger_id = b.passenger_id AND b.status = 'COMPLETED'
JOIN rides r ON b.ride_id = r.ride_id
JOIN routes ro ON r.route_id = ro.route_id
GROUP BY u.department, u.campus
ORDER BY total_department_savings_inr DESC;`}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: Route Occupancy and Revenue Analysis */}
          {/* ========================================================================= */}
          {activeTab === 'route-occupancy' && (
            <div className="bg-[#101e38] border border-blue-900/40 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span>Route Occupancy & Revenue Analysis</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Demonstrating multi-table JOINs, GROUP BY, and a HAVING clause filtering routes with bookings.
                  </p>
                </div>
                <button
                  onClick={() => exportCSV(data.routeOccupancy, 'route_occupancy_report')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#0b1424] text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Route Name</th>
                      <th className="py-3 px-4">Endpoints</th>
                      <th className="py-3 px-4 text-right">Distance</th>
                      <th className="py-3 px-4 text-center">Rides Hosted</th>
                      <th className="py-3 px-4 text-center">Bookings</th>
                      <th className="py-3 px-4 text-center">Seats Reserved</th>
                      <th className="py-3 px-4 text-right text-amber-400">Total Revenue (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {data.routeOccupancy.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4 font-bold text-white font-sans">{row.route_name}</td>
                        <td className="py-3 px-4 font-sans text-slate-400">{row.origin_campus} → {row.destination_campus}</td>
                        <td className="py-3 px-4 text-right">{row.distance_km} km</td>
                        <td className="py-3 px-4 text-center">{row.total_rides_conducted}</td>
                        <td className="py-3 px-4 text-center">{row.total_passenger_bookings}</td>
                        <td className="py-3 px-4 text-center">{row.total_seats_reserved}</td>
                        <td className="py-3 px-4 text-right font-bold text-amber-400">₹{Number(row.total_revenue_inr).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showSql && (
                <div className="bg-[#0b1424] p-4 rounded-2xl border border-blue-900/40 text-xs space-y-2 mt-4">
                  <div className="flex items-center justify-between text-blue-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-amber-400" />
                      <span>Executed Query: Multi-table JOIN with HAVING Clause</span>
                    </span>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-3 bg-[#080e1a] rounded-xl border border-slate-800">
{`SELECT 
    ro.route_id, ro.route_name, ro.origin_campus, ro.destination_campus, ro.distance_km,
    COUNT(DISTINCT r.ride_id) AS total_rides_conducted,
    COUNT(b.booking_id) AS total_passenger_bookings,
    COALESCE(SUM(b.seats_booked), 0) AS total_seats_reserved,
    COALESCE(SUM(b.total_fare), 0.00) AS total_revenue_inr
FROM routes ro
JOIN rides r ON ro.route_id = r.route_id
LEFT JOIN bookings b ON r.ride_id = b.ride_id AND b.status IN ('CONFIRMED', 'COMPLETED')
GROUP BY ro.route_id, ro.route_name, ro.origin_campus, ro.destination_campus, ro.distance_km
HAVING COUNT(b.booking_id) > 0
ORDER BY total_revenue_inr DESC;`}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: Peak Travel Hours Analysis */}
          {/* ========================================================================= */}
          {activeTab === 'peak-hours' && (
            <div className="bg-[#101e38] border border-blue-900/40 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <span>Peak Commute Hours Mobility Analysis</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Demonstrating SQL date/time functions (HOUR extraction), GROUP BY, and volume ranking.
                  </p>
                </div>
                <button
                  onClick={() => exportCSV(data.peakHours, 'peak_hours_report')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#0b1424] text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Departure Time Window</th>
                      <th className="py-3 px-4 text-center">Scheduled Rides</th>
                      <th className="py-3 px-4 text-center">Total Bookings</th>
                      <th className="py-3 px-4 text-center text-amber-400">Commuters Carpooled</th>
                      <th className="py-3 px-4 text-right">Avg Seat Fare (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {data.peakHours.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4 font-bold text-white font-sans flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-blue-400" />
                          <span>{row.time_window}</span>
                        </td>
                        <td className="py-3 px-4 text-center">{row.total_scheduled_rides}</td>
                        <td className="py-3 px-4 text-center">{row.total_seat_bookings}</td>
                        <td className="py-3 px-4 text-center font-bold text-amber-400">{row.total_students_faculty_commuters}</td>
                        <td className="py-3 px-4 text-right">₹{Number(row.avg_price_per_seat).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showSql && (
                <div className="bg-[#0b1424] p-4 rounded-2xl border border-blue-900/40 text-xs space-y-2 mt-4">
                  <div className="flex items-center justify-between text-blue-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-amber-400" />
                      <span>Executed Query: Temporal Aggregation by Departure Hour</span>
                    </span>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-3 bg-[#080e1a] rounded-xl border border-slate-800">
{`SELECT 
    HOUR(r.departure_time) AS departure_hour,
    CONCAT(LPAD(HOUR(r.departure_time), 2, '0'), ':00 - ', LPAD(HOUR(r.departure_time) + 1, 2, '0'), ':00') AS time_window,
    COUNT(DISTINCT r.ride_id) AS total_scheduled_rides,
    COUNT(b.booking_id) AS total_seat_bookings,
    COALESCE(SUM(b.seats_booked), 0) AS total_students_faculty_commuters,
    ROUND(AVG(r.price_per_seat), 2) AS avg_price_per_seat
FROM rides r
LEFT JOIN bookings b ON r.ride_id = b.ride_id AND b.status IN ('CONFIRMED', 'COMPLETED')
GROUP BY HOUR(r.departure_time), time_window
ORDER BY total_students_faculty_commuters DESC, departure_hour ASC;`}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: Driver Performance & Safety Leaderboard */}
          {/* ========================================================================= */}
          {activeTab === 'driver-leaderboard' && (
            <div className="bg-[#101e38] border border-blue-900/40 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>Driver Performance, Safety & Punctuality Leaderboard</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Demonstrating multi-join across 4 entities with HAVING clause filtering drivers with rating ≥ 4.50.
                  </p>
                </div>
                <button
                  onClick={() => exportCSV(data.driverLeaderboard, 'driver_leaderboard_report')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#0b1424] text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Rank / Driver</th>
                      <th className="py-3 px-4">SRN / PRN</th>
                      <th className="py-3 px-4">Vehicle Model</th>
                      <th className="py-3 px-4 text-center">Completed Rides</th>
                      <th className="py-3 px-4 text-center">Reviews</th>
                      <th className="py-3 px-4 text-center text-amber-400">Overall Rating</th>
                      <th className="py-3 px-4 text-center text-blue-300">Punctuality</th>
                      <th className="py-3 px-4 text-center text-emerald-400">Safety</th>
                      <th className="py-3 px-4 text-right">Total Earnings (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {data.driverLeaderboard.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4 font-bold text-white font-sans flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold">
                            #{idx + 1}
                          </span>
                          <span>{row.driver_name}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{row.srn_prn}</td>
                        <td className="py-3 px-4 font-sans text-slate-300">{row.vehicle_info}</td>
                        <td className="py-3 px-4 text-center">{row.rides_hosted}</td>
                        <td className="py-3 px-4 text-center">{row.reviews_count}</td>
                        <td className="py-3 px-4 text-center font-bold text-amber-400">⭐ {row.overall_avg_rating}</td>
                        <td className="py-3 px-4 text-center text-blue-300">{row.avg_punctuality} / 5</td>
                        <td className="py-3 px-4 text-center text-emerald-400">{row.avg_safety} / 5</td>
                        <td className="py-3 px-4 text-right font-bold text-white">₹{Number(row.total_earnings_inr).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showSql && (
                <div className="bg-[#0b1424] p-4 rounded-2xl border border-blue-900/40 text-xs space-y-2 mt-4">
                  <div className="flex items-center justify-between text-blue-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-amber-400" />
                      <span>Executed Query: Driver Leaderboard Multi-Join</span>
                    </span>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-3 bg-[#080e1a] rounded-xl border border-slate-800">
{`SELECT 
    d.driver_id, u.full_name AS driver_name, u.srn_prn, u.department,
    CONCAT(v.make, ' ', v.model, ' (', v.vehicle_type, ')') AS vehicle_info,
    COUNT(DISTINCT r.ride_id) AS rides_hosted,
    COUNT(rt.rating_id) AS reviews_count,
    ROUND(AVG(rt.rating_score), 2) AS overall_avg_rating,
    ROUND(AVG(rt.punctuality_score), 2) AS avg_punctuality,
    ROUND(AVG(rt.safety_score), 2) AS avg_safety,
    COALESCE(SUM(p.amount), 0.00) AS total_earnings_inr
FROM drivers d
JOIN users u ON d.driver_id = u.user_id
JOIN vehicles v ON d.driver_id = v.driver_id AND v.is_active = TRUE
LEFT JOIN rides r ON d.driver_id = r.driver_id AND r.status = 'COMPLETED'
LEFT JOIN bookings b ON r.ride_id = b.ride_id AND b.status = 'COMPLETED'
LEFT JOIN payments p ON b.booking_id = p.booking_id AND p.payment_status = 'SUCCESS'
LEFT JOIN ratings rt ON b.booking_id = rt.booking_id AND rt.role_rated = 'DRIVER'
GROUP BY d.driver_id, u.full_name, u.srn_prn, u.department, v.plate_number, v.make, v.model, v.vehicle_type
HAVING overall_avg_rating >= 4.50
ORDER BY overall_avg_rating DESC, rides_hosted DESC;`}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: Nested Subquery Demonstration */}
          {/* ========================================================================= */}
          {activeTab === 'subquery' && (
            <div className="bg-[#101e38] border border-blue-900/40 rounded-3xl p-6 shadow-xl space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-400" />
                  <span>Nested Subquery: Drivers Earning Above Average Campus Ride Earnings</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Demonstrates a nested subquery with an aggregate function in the HAVING clause.
                </p>
              </div>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#0b1424] text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Driver Name</th>
                      <th className="py-3 px-4">PES Email</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4 text-right text-amber-400">Total Driver Earnings (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {data.topEarners.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4 font-bold text-white font-sans">{row.driver_name}</td>
                        <td className="py-3 px-4 text-slate-400">{row.pes_email}</td>
                        <td className="py-3 px-4 font-sans text-slate-300">{row.department}</td>
                        <td className="py-3 px-4 text-right font-bold text-amber-400">₹{Number(row.driver_total_earnings).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showSql && (
                <div className="bg-[#0b1424] p-4 rounded-2xl border border-blue-900/40 text-xs space-y-2 mt-4">
                  <div className="flex items-center justify-between text-blue-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-amber-400" />
                      <span>Executed Query: Nested Aggregate Subquery</span>
                    </span>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-3 bg-[#080e1a] rounded-xl border border-slate-800">
{`SELECT 
    d.driver_id, u.full_name AS driver_name, u.pes_email, u.department,
    COALESCE(SUM(p.amount), 0.00) AS driver_total_earnings
FROM drivers d
JOIN users u ON d.driver_id = u.user_id
JOIN rides r ON d.driver_id = r.driver_id
JOIN bookings b ON r.ride_id = b.ride_id AND b.status = 'COMPLETED'
JOIN payments p ON b.booking_id = p.booking_id AND p.payment_status = 'SUCCESS'
GROUP BY d.driver_id, u.full_name, u.pes_email, u.department
HAVING driver_total_earnings > (
    -- Subquery calculating average earnings across all active drivers
    SELECT AVG(driver_earnings)
    FROM (
        SELECT SUM(p2.amount) AS driver_earnings
        FROM rides r2
        JOIN bookings b2 ON r2.ride_id = b2.ride_id AND b2.status = 'COMPLETED'
        JOIN payments p2 ON b2.booking_id = p2.booking_id AND p2.payment_status = 'SUCCESS'
        GROUP BY r2.driver_id
    ) AS avg_tbl
)
ORDER BY driver_total_earnings DESC;`}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: Cancellation Breakdown & Revenue Loss */}
          {/* ========================================================================= */}
          {activeTab === 'cancellations' && (
            <div className="bg-[#101e38] border border-blue-900/40 rounded-3xl p-6 shadow-xl space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <span>Cancellation Frequency & Financial Impact Analysis</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Tracks automated refunds, cancellation fee penalties, and reasons for trip disruptions.
                </p>
              </div>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#0b1424] text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Cancellation Reason</th>
                      <th className="py-3 px-4">Cancelled By</th>
                      <th className="py-3 px-4 text-center">Incidents</th>
                      <th className="py-3 px-4 text-center">% of All Bookings</th>
                      <th className="py-3 px-4 text-right text-emerald-400">Total Refunded (₹)</th>
                      <th className="py-3 px-4 text-right text-rose-400">Penalties (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {data.cancellations.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4 font-bold text-white font-sans">{row.cancellation_reason}</td>
                        <td className="py-3 px-4 font-sans text-slate-400">{row.cancelled_by}</td>
                        <td className="py-3 px-4 text-center">{row.incident_count}</td>
                        <td className="py-3 px-4 text-center">{row.percentage_of_all_bookings}%</td>
                        <td className="py-3 px-4 text-right text-emerald-400">₹{Number(row.total_refunded_inr).toFixed(2)}</td>
                        <td className="py-3 px-4 text-right text-rose-400">₹{Number(row.total_penalty_fees_inr).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: MongoDB NoSQL Aggregation Pipeline */}
          {/* ========================================================================= */}
          {activeTab === 'nosql-agg' && (
            <div className="bg-[#101e38] border border-blue-900/40 rounded-3xl p-6 shadow-xl space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  <span>MongoDB NoSQL Aggregation Pipeline: Route Segment Traffic & Velocity</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Executes MongoDB <code className="text-amber-300">$group</code>, <code className="text-blue-300">$avg</code>, and <code className="text-emerald-300">$sort</code> pipelines over the <code className="text-white">ride_telemetry</code> collection.
                </p>
              </div>

              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#0b1424] text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Corridor Segment (_id)</th>
                      <th className="py-3 px-4 text-center">Telemetry Pings ($sum)</th>
                      <th className="py-3 px-4 text-center text-blue-300">Avg Velocity ($avg speed_kmph)</th>
                      <th className="py-3 px-4 text-center text-amber-400">Avg Delay ($avg delay_mins)</th>
                      <th className="py-3 px-4 text-right">Latest Sensor Ping ($max timestamp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {data.nosqlTelemetryAgg?.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4 font-bold text-white font-sans flex items-center gap-2">
                          <Compass className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{row._id}</span>
                        </td>
                        <td className="py-3 px-4 text-center">{row.ping_count}</td>
                        <td className="py-3 px-4 text-center font-bold text-blue-300">{row.avg_speed_kmph} km/h</td>
                        <td className="py-3 px-4 text-center text-amber-400">+{row.avg_delay_mins} mins</td>
                        <td className="py-3 px-4 text-right text-slate-400">{new Date(row.last_reported).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showSql && (
                <div className="bg-[#0b1424] p-4 rounded-2xl border border-emerald-900/40 text-xs space-y-2 mt-4">
                  <div className="flex items-center justify-between text-emerald-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <span>MongoDB Aggregation Pipeline Definition</span>
                    </span>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-3 bg-[#080e1a] rounded-xl border border-slate-800">
{`db.ride_telemetry.aggregate([
  {
    $group: {
      _id: "$current_segment",
      avg_speed_kmph: { $avg: "$speed_kmph" },
      ping_count: { $sum: 1 },
      last_reported: { $max: "$timestamp" },
      avg_delay_mins: { $avg: "$estimated_delay_mins" }
    }
  },
  { 
    $sort: { ping_count: -1 } 
  }
])`}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
