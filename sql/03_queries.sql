-- ============================================================================
-- PESUPool: Analytical & Operational Queries (DBMS Level 3 Demonstration)
-- Demonstrates: JOINs (INNER, LEFT), GROUP BY, HAVING, ORDER BY, Aggregates,
-- Subqueries, Correlated Subqueries, Window Functions, and Date/Time arithmetic.
-- ============================================================================

USE pesupool;

-- ============================================================================
-- Query 1: Route Occupancy and Revenue Analysis
-- Demonstrates: Multi-table JOIN (routes, rides, bookings), GROUP BY, HAVING,
-- Aggregate functions (COUNT, SUM, AVG), and conditional expressions.
-- Identifies popular high-demand routes with average passenger load >= 1.5.
-- ============================================================================
SELECT 
    ro.route_id,
    ro.route_name,
    ro.origin_campus,
    ro.destination_campus,
    ro.distance_km,
    COUNT(DISTINCT r.ride_id) AS total_rides_conducted,
    COUNT(b.booking_id) AS total_passenger_bookings,
    COALESCE(SUM(b.seats_booked), 0) AS total_seats_reserved,
    ROUND(COALESCE(AVG(b.seats_booked), 0), 2) AS avg_seats_per_booking,
    COALESCE(SUM(b.total_fare), 0.00) AS total_revenue_inr
FROM routes ro
JOIN rides r ON ro.route_id = r.route_id
LEFT JOIN bookings b ON r.ride_id = b.ride_id AND b.status IN ('CONFIRMED', 'COMPLETED')
GROUP BY 
    ro.route_id, ro.route_name, ro.origin_campus, ro.destination_campus, ro.distance_km
HAVING 
    COUNT(b.booking_id) > 0
ORDER BY 
    total_revenue_inr DESC;

-- ============================================================================
-- Query 2: Peak Commuter Departure Hours Analysis
-- Demonstrates: Date/Time function EXTRACT(HOUR ...), aggregate COUNT and SUM,
-- GROUP BY hour, ORDER BY commuter volume descending.
-- Helps campus traffic committee identify peak shuttle and carpool departure windows.
-- ============================================================================
SELECT 
    HOUR(r.departure_time) AS departure_hour,
    CONCAT(LPAD(HOUR(r.departure_time), 2, '0'), ':00 - ', LPAD(HOUR(r.departure_time) + 1, 2, '0'), ':00') AS time_window,
    COUNT(DISTINCT r.ride_id) AS total_scheduled_rides,
    COUNT(b.booking_id) AS total_seat_bookings,
    COALESCE(SUM(b.seats_booked), 0) AS total_students_faculty_commuters,
    ROUND(AVG(r.price_per_seat), 2) AS avg_price_per_seat
FROM rides r
LEFT JOIN bookings b ON r.ride_id = b.ride_id AND b.status IN ('CONFIRMED', 'COMPLETED')
GROUP BY HOUR(r.departure_time), time_window
ORDER BY total_students_faculty_commuters DESC, departure_hour ASC;

-- ============================================================================
-- Query 3: Driver Safety & Performance Leaderboard
-- Demonstrates: INNER JOINs across 4 entities (drivers, users, vehicles, ratings),
-- aggregate functions, HAVING clause filtering drivers with rating >= 4.5.
-- ============================================================================
SELECT 
    d.driver_id,
    u.full_name AS driver_name,
    u.srn_prn,
    u.department,
    v.plate_number,
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
GROUP BY 
    d.driver_id, u.full_name, u.srn_prn, u.department, v.plate_number, v.make, v.model, v.vehicle_type
HAVING 
    overall_avg_rating >= 4.50
ORDER BY 
    overall_avg_rating DESC, rides_hosted DESC;

-- ============================================================================
-- Query 4: Department-wise Mobility Cost & Savings Comparison
-- Demonstrates: JOINs with users, passengers, bookings, routes; GROUP BY department;
-- Aggregate comparison against market cab rates (~Rs 22/km vs PESUPool actuals).
-- ============================================================================
SELECT 
    u.department,
    u.campus,
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
ORDER BY total_department_savings_inr DESC;

-- ============================================================================
-- Query 5: Subquery Demonstration - Drivers with Earnings Higher Than Campus Average
-- Demonstrates: Non-correlated subquery with AVG() in WHERE clause, nested aggregation.
-- ============================================================================
SELECT 
    d.driver_id,
    u.full_name AS driver_name,
    u.pes_email,
    u.department,
    COALESCE(SUM(p.amount), 0.00) AS driver_total_earnings
FROM drivers d
JOIN users u ON d.driver_id = u.user_id
JOIN rides r ON d.driver_id = r.driver_id
JOIN bookings b ON r.ride_id = b.ride_id AND b.status = 'COMPLETED'
JOIN payments p ON b.booking_id = p.booking_id AND p.payment_status = 'SUCCESS'
GROUP BY d.driver_id, u.full_name, u.pes_email, u.department
HAVING driver_total_earnings > (
    -- Subquery calculating the average earnings across all drivers who completed rides
    SELECT AVG(driver_earnings)
    FROM (
        SELECT SUM(p2.amount) AS driver_earnings
        FROM rides r2
        JOIN bookings b2 ON r2.ride_id = b2.ride_id AND b2.status = 'COMPLETED'
        JOIN payments p2 ON b2.booking_id = p2.booking_id AND p2.payment_status = 'SUCCESS'
        GROUP BY r2.driver_id
    ) AS avg_tbl
)
ORDER BY driver_total_earnings DESC;

-- ============================================================================
-- Query 6: Cancellation Rate and Refund Impact by Cancellation Reason
-- Demonstrates: LEFT JOIN, GROUP BY reason, aggregate percentages, SUM.
-- ============================================================================
SELECT 
    c.reason AS cancellation_reason,
    c.cancelled_by,
    COUNT(c.cancellation_id) AS incident_count,
    ROUND(COUNT(c.cancellation_id) / (SELECT COUNT(*) FROM bookings) * 100, 2) AS percentage_of_all_bookings,
    SUM(c.refund_amount) AS total_refunded_inr,
    SUM(c.cancellation_fee) AS total_penalty_fees_inr
FROM cancellations c
JOIN bookings b ON c.booking_id = b.booking_id
GROUP BY c.reason, c.cancelled_by
ORDER BY incident_count DESC;
