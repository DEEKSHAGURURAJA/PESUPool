-- ============================================================================
-- PESUPool: Comprehensive Seed Data (PES University Context)
-- DBMS Experiential Learning - Level 3 Project
-- File: 02_seed.sql
-- ============================================================================

USE pesupool;

-- Disable foreign key checks for clean truncation and population
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE cancellations;
TRUNCATE TABLE ratings;
TRUNCATE TABLE payments;
TRUNCATE TABLE bookings;
TRUNCATE TABLE rides;
TRUNCATE TABLE vehicles;
TRUNCATE TABLE routes;
TRUNCATE TABLE passengers;
TRUNCATE TABLE drivers;
TRUNCATE TABLE users;
TRUNCATE TABLE audit_logs;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 1. SEED USERS (Students, Faculty, Staff across PESU Departments & Campuses)
-- ============================================================================
INSERT INTO users (user_id, srn_prn, pes_email, full_name, phone, role, campus, department, gender, emergency_contact) VALUES
(1, 'PES1UG22CS101', 'aarav.sharma@pes.edu', 'Aarav Sharma', '+919876543201', 'STUDENT', 'RR_CAMPUS', 'Computer Science', 'MALE', '+919811122331'),
(2, 'PES1UG22EC204', 'ananya.iyer@pes.edu', 'Ananya Iyer', '+919876543202', 'STUDENT', 'RR_CAMPUS', 'Electronics & Comm', 'FEMALE', '+919811122332'),
(3, 'PES2UG21CS305', 'rohan.kulkarni@pes.edu', 'Rohan Kulkarni', '+919876543203', 'STUDENT', 'EC_CAMPUS', 'Computer Science', 'MALE', '+919811122333'),
(4, 'PES2UG23ME402', 'priya.nair@pes.edu', 'Priya Nair', '+919876543204', 'STUDENT', 'EC_CAMPUS', 'Mechanical Engg', 'FEMALE', '+919811122334'),
(5, 'PES1FAC00188', 'dr.venkatesh@pes.edu', 'Dr. Venkatesh R', '+919876543205', 'FACULTY', 'RR_CAMPUS', 'Computer Science', 'MALE', '+919811122335'),
(6, 'PES1FAC00214', 'prof.sunita.rao@pes.edu', 'Prof. Sunita Rao', '+919876543206', 'FACULTY', 'RR_CAMPUS', 'Biotechnology', 'FEMALE', '+919811122336'),
(7, 'PES2FAC00095', 'dr.karthik.b@pes.edu', 'Dr. Karthik Bhat', '+919876543207', 'FACULTY', 'EC_CAMPUS', 'Management Studies', 'MALE', '+919811122337'),
(8, 'PES1UG23AI012', 'tanvi.deshmukh@pes.edu', 'Tanvi Deshmukh', '+919876543208', 'STUDENT', 'RR_CAMPUS', 'AI & Machine Learning', 'FEMALE', '+919811122338'),
(9, 'PES1UG22BT045', 'vikram.hegde@pes.edu', 'Vikram Hegde', '+919876543209', 'STUDENT', 'RR_CAMPUS', 'Biotechnology', 'MALE', '+919811122339'),
(10, 'PES1ADM00010', 'admin.pesupool@pes.edu', 'Campus Mobility Admin', '+919876543210', 'ADMIN', 'RR_CAMPUS', 'Campus Infrastructure', 'OTHER', '+919811122340'),
(11, 'PES2UG22EE110', 'rahul.menon@pes.edu', 'Rahul Menon', '+919876543211', 'STUDENT', 'EC_CAMPUS', 'Electrical Engg', 'MALE', '+919811122341'),
(12, 'PES1UG23CS550', 'sneha.patil@pes.edu', 'Sneha Patil', '+919876543212', 'STUDENT', 'RR_CAMPUS', 'Computer Science', 'FEMALE', '+919811122342');

-- ============================================================================
-- 2. SEED DRIVERS (Verified Campus Drivers)
-- ============================================================================
INSERT INTO drivers (driver_id, license_number, license_expiry, total_trips, avg_rating, verification_status) VALUES
(1, 'KA05-2022-0045129', '2032-05-15', 28, 4.90, 'VERIFIED'),
(3, 'KA51-2021-0089201', '2031-08-20', 19, 4.75, 'VERIFIED'),
(5, 'KA04-2015-0012390', '2035-12-10', 42, 4.95, 'VERIFIED'),
(7, 'KA53-2018-0098741', '2033-03-25', 15, 4.80, 'VERIFIED'),
(9, 'KA01-2023-0056123', '2033-09-14', 11, 4.60, 'VERIFIED'),
(11, 'KA51-2022-0033221', '2032-11-30', 8, 4.85, 'VERIFIED');

-- ============================================================================
-- 3. SEED PASSENGERS (Registered Student & Faculty Riders)
-- ============================================================================
INSERT INTO passengers (passenger_id, default_pickup_point, total_rides_taken, avg_rating, wallet_balance) VALUES
(1, 'RR Campus Gate 2', 4, 4.90, 850.00),
(2, 'Banashankari Metro Station', 18, 4.95, 620.00),
(3, 'Silk Board Flyover', 6, 4.80, 450.00),
(4, 'Electronic City Phase 1 Toll', 22, 5.00, 940.00),
(6, 'Jayanagar 4th Block Complex', 14, 4.85, 1200.00),
(8, 'Koramangala Sony World Signal', 17, 4.90, 510.00),
(9, 'Indiranagar 100ft Road', 5, 4.70, 300.00),
(11, 'HSR Layout BDA Complex', 7, 4.80, 780.00),
(12, 'PES RR Campus Main Gate', 12, 4.92, 650.00);

-- ============================================================================
-- 4. SEED VEHICLES
-- ============================================================================
INSERT INTO vehicles (vehicle_id, driver_id, make, model, plate_number, vehicle_type, fuel_type, seating_capacity, color, is_active) VALUES
(1, 1, 'Hyundai', 'i20 Asta', 'KA-05-MQ-4192', 'HATCHBACK', 'PETROL', 4, 'Polar White', TRUE),
(2, 3, 'Tata', 'Nexon EV', 'KA-51-EZ-7710', 'EV', 'ELECTRIC', 4, 'Teal Blue', TRUE),
(3, 5, 'Honda', 'City ZX', 'KA-04-MH-9901', 'SEDAN', 'HYBRID', 4, 'Lunar Silver', TRUE),
(4, 7, 'Maruti Suzuki', 'Brezza ZXi', 'KA-53-NF-3321', 'SUV', 'CNG', 4, 'Magma Grey', TRUE),
(5, 9, 'Royal Enfield', 'Hunter 350', 'KA-01-EQ-5544', 'TWO_WHEELER', 'PETROL', 1, 'Dapper Ash', TRUE),
(6, 11, 'Mahindra', 'XUV400 EV', 'KA-51-AB-1209', 'EV', 'ELECTRIC', 4, 'Infinity Blue', TRUE);

-- ============================================================================
-- 5. SEED ROUTES (Crucial PES University Commuter Corridors)
-- ============================================================================
INSERT INTO routes (route_id, route_name, origin_campus, destination_campus, pickup_points_json, distance_km, estimated_duration_mins, base_fare, toll_amount) VALUES
(1, 'RR Campus <-> Electronic City Campus Express', 'PES RR Campus (Ring Road)', 'PES Electronic City Campus', 
    '["RR Campus Gate 1", "Banashankari Metro", "JP Nagar 6th Phase", "Silk Board", "HSR Layout", "Electronic City Toll", "EC Campus Tech Gate"]',
    24.50, 48, 90.00, 35.00),

(2, 'Banashankari Metro <-> RR Campus Shuttle Corridor', 'Banashankari Metro Station', 'PES RR Campus (Ring Road)',
    '["Banashankari Metro", "PESIT Outer Ring Road", "Kathriguppe Cross", "RR Campus Gate 2"]',
    4.80, 15, 30.00, 0.00),

(3, 'Koramangala Hub <-> RR Campus', 'Koramangala Sony World Signal', 'PES RR Campus (Ring Road)',
    '["Sony World Junction", "Koramangala 4th Block", "Dairy Circle", "South End Circle", "PES RR Campus"]',
    14.20, 35, 65.00, 0.00),

(4, 'HSR Layout <-> EC Campus Shuttle', 'HSR Layout Sector 2 BDA Complex', 'PES Electronic City Campus',
    '["HSR BDA Complex", "Agara Lake Junction", "Bommanahalli", "Electronic City Phase 1", "PES EC Campus"]',
    15.60, 32, 70.00, 0.00),

(5, 'Whitefield Tech Corridor <-> EC Campus', 'Whitefield ITPL Main Gate', 'PES Electronic City Campus',
    '["ITPL Gate 3", "Kundalahalli Gate", "Marathahalli Bridge", "Bellandur Outer Ring Road", "PES EC Campus"]',
    28.00, 60, 110.00, 0.00),

(6, 'Jayanagar / JP Nagar <-> RR Campus', 'Jayanagar 4th Block BDA Complex', 'PES RR Campus (Ring Road)',
    '["Jayanagar 4th Block", "Ragigudda Temple", "JP Nagar Metro", "PES RR Campus"]',
    8.50, 22, 45.00, 0.00);

-- ============================================================================
-- 6. SEED RIDES
-- ============================================================================
INSERT INTO rides (ride_id, driver_id, vehicle_id, route_id, travel_date, departure_time, total_seats, available_seats, price_per_seat, luggage_allowed, gender_preference, status, notes) VALUES
-- Upcoming scheduled rides open for booking (available_seats initially equals total_seats; trigger decrements upon bookings)
(1, 1, 1, 1, '2026-10-27', '07:45:00', 3, 3, 90.00, TRUE, 'ANY', 'SCHEDULED', 'Morning lecture commute. AC on, quiet ride.'),
(2, 3, 2, 1, '2026-10-27', '08:15:00', 3, 3, 85.00, TRUE, 'ANY', 'SCHEDULED', 'Eco-friendly EV ride! Leaving promptly at 8:15 AM from Silk Board.'),
(3, 5, 3, 2, '2026-10-27', '08:30:00', 3, 3, 30.00, TRUE, 'ANY', 'SCHEDULED', 'Faculty carpool to RR Campus mechanical lab.'),
(4, 7, 4, 4, '2026-10-27', '08:00:00', 4, 4, 70.00, TRUE, 'ANY', 'SCHEDULED', 'HSR Layout to EC Campus. Space for backpacks.'),
(5, 1, 1, 3, '2026-10-28', '17:15:00', 3, 3, 65.00, TRUE, 'ANY', 'SCHEDULED', 'Return commute from RR Campus to Koramangala.'),
(6, 11, 6, 1, '2026-10-28', '08:00:00', 3, 3, 90.00, TRUE, 'ANY', 'SCHEDULED', 'PESU Inter-campus EV shuttle commute.'),
-- Past completed rides for analytical reports & statistics
(7, 1, 1, 1, '2026-10-20', '07:45:00', 3, 3, 90.00, TRUE, 'ANY', 'SCHEDULED', 'Smooth ride via Silk Board flyover.'),
(8, 3, 2, 4, '2026-10-21', '08:30:00', 3, 3, 70.00, TRUE, 'ANY', 'SCHEDULED', 'On time drop at EC Campus Gate 2.'),
(9, 5, 3, 1, '2026-10-22', '08:00:00', 3, 3, 90.00, TRUE, 'ANY', 'SCHEDULED', 'Full occupancy inter-campus seminar ride.'),
(10, 7, 4, 3, '2026-10-23', '08:45:00', 4, 4, 65.00, TRUE, 'ANY', 'SCHEDULED', 'Regular Friday morning carpool.'),
(11, 9, 5, 2, '2026-10-24', '09:00:00', 1, 1, 30.00, FALSE, 'ANY', 'SCHEDULED', 'Quick two-wheeler shuttle from Metro.'),
(12, 1, 1, 1, '2026-10-25', '16:45:00', 3, 3, 90.00, TRUE, 'ANY', 'SCHEDULED', 'Cancelled due to severe rain and waterlogging on ORR.');

-- ============================================================================
-- 7. SEED BOOKINGS
-- ============================================================================
INSERT INTO bookings (booking_id, ride_id, passenger_id, seats_booked, pickup_stop, drop_stop, total_fare, booking_time, status, qr_code_token) VALUES
-- Active bookings on scheduled rides
(1, 1, 2, 1, 'Banashankari Metro', 'PES EC Campus Tech Gate', 90.00, '2026-10-26 10:15:00', 'CONFIRMED', 'QR-PESU-1001-BNSH-EC'),
(2, 2, 4, 1, 'Silk Board', 'PES EC Campus Tech Gate', 85.00, '2026-10-26 11:20:00', 'CONFIRMED', 'QR-PESU-1002-SLKB-EC'),
(3, 2, 8, 1, 'HSR Layout', 'PES EC Campus Tech Gate', 85.00, '2026-10-26 12:05:00', 'CONFIRMED', 'QR-PESU-1003-HSR-EC'),
(4, 4, 11, 1, 'HSR BDA Complex', 'PES EC Campus', 70.00, '2026-10-26 13:00:00', 'CONFIRMED', 'QR-PESU-1004-HSR-EC'),
(5, 5, 2, 1, 'PES RR Campus', 'Sony World Junction', 65.00, '2026-10-26 13:10:00', 'CONFIRMED', 'QR-PESU-1005-RR-KOR'),

-- Completed bookings for historical reports & analytics
(6, 7, 2, 1, 'Banashankari Metro', 'PES EC Campus', 90.00, '2026-10-19 18:30:00', 'COMPLETED', 'QR-PESU-HIST-701'),
(7, 7, 4, 1, 'Silk Board', 'PES EC Campus', 90.00, '2026-10-19 19:15:00', 'COMPLETED', 'QR-PESU-HIST-702'),
(8, 7, 8, 1, 'HSR Layout', 'PES EC Campus', 90.00, '2026-10-19 20:00:00', 'COMPLETED', 'QR-PESU-HIST-703'),
(9, 8, 4, 2, 'HSR BDA Complex', 'PES EC Campus', 140.00, '2026-10-20 21:00:00', 'COMPLETED', 'QR-PESU-HIST-801'),
(10, 8, 11, 1, 'Bommanahalli', 'PES EC Campus', 70.00, '2026-10-21 07:10:00', 'COMPLETED', 'QR-PESU-HIST-802'),
(11, 9, 6, 1, 'RR Campus Gate 1', 'PES EC Campus', 90.00, '2026-10-21 16:00:00', 'COMPLETED', 'QR-PESU-HIST-901'),
(12, 9, 2, 1, 'Banashankari Metro', 'PES EC Campus', 90.00, '2026-10-21 17:30:00', 'COMPLETED', 'QR-PESU-HIST-902'),
(13, 9, 8, 1, 'Silk Board', 'PES EC Campus', 90.00, '2026-10-21 18:00:00', 'COMPLETED', 'QR-PESU-HIST-903'),
(14, 10, 2, 2, 'Koramangala 4th Block', 'PES RR Campus', 130.00, '2026-10-22 19:00:00', 'COMPLETED', 'QR-PESU-HIST-1001'),
(15, 10, 12, 1, 'South End Circle', 'PES RR Campus', 65.00, '2026-10-22 20:15:00', 'COMPLETED', 'QR-PESU-HIST-1002'),
(16, 11, 12, 1, 'Banashankari Metro', 'RR Campus Gate 2', 30.00, '2026-10-23 21:00:00', 'COMPLETED', 'QR-PESU-HIST-1101'),

-- Cancelled booking example
(17, 12, 4, 1, 'Banashankari Metro', 'PES EC Campus', 90.00, '2026-10-24 14:00:00', 'CANCELLED', 'QR-PESU-HIST-1201');

-- ============================================================================
-- 8. SEED PAYMENTS
-- ============================================================================
INSERT INTO payments (payment_id, booking_id, amount, payment_method, transaction_reference, payment_status, paid_at) VALUES
(1, 1, 90.00, 'PESU_WALLET', 'TXN-PESU-WALLET-0001', 'SUCCESS', '2026-10-26 10:15:00'),
(2, 2, 85.00, 'UPI', 'UPI/2610260012/aarav@oksbi', 'SUCCESS', '2026-10-26 11:20:00'),
(3, 3, 85.00, 'PESU_WALLET', 'TXN-PESU-WALLET-0003', 'SUCCESS', '2026-10-26 12:05:00'),
(4, 4, 70.00, 'UPI', 'UPI/2610260045/rahul@okaxis', 'SUCCESS', '2026-10-26 13:00:00'),
(5, 5, 65.00, 'PESU_WALLET', 'TXN-PESU-WALLET-0005', 'SUCCESS', '2026-10-26 13:10:00'),
(6, 6, 90.00, 'PESU_WALLET', 'TXN-HIST-0006', 'SUCCESS', '2026-10-19 18:30:00'),
(7, 7, 90.00, 'UPI', 'TXN-HIST-0007', 'SUCCESS', '2026-10-19 19:15:00'),
(8, 8, 90.00, 'CARD', 'TXN-HIST-0008', 'SUCCESS', '2026-10-19 20:00:00'),
(9, 9, 140.00, 'PESU_WALLET', 'TXN-HIST-0009', 'SUCCESS', '2026-10-20 21:00:00'),
(10, 10, 70.00, 'UPI', 'TXN-HIST-0010', 'SUCCESS', '2026-10-21 07:10:00'),
(11, 11, 90.00, 'PESU_WALLET', 'TXN-HIST-0011', 'SUCCESS', '2026-10-21 16:00:00'),
(12, 12, 90.00, 'UPI', 'TXN-HIST-0012', 'SUCCESS', '2026-10-21 17:30:00'),
(13, 13, 90.00, 'PESU_WALLET', 'TXN-HIST-0013', 'SUCCESS', '2026-10-21 18:00:00'),
(14, 14, 130.00, 'CARD', 'TXN-HIST-0014', 'SUCCESS', '2026-10-22 19:00:00'),
(15, 15, 65.00, 'PESU_WALLET', 'TXN-HIST-0015', 'SUCCESS', '2026-10-22 20:15:00'),
(16, 16, 30.00, 'PESU_WALLET', 'TXN-HIST-0016', 'SUCCESS', '2026-10-23 21:00:00'),
(17, 17, 90.00, 'UPI', 'TXN-HIST-0017', 'REFUNDED', '2026-10-24 14:00:00');

-- ============================================================================
-- 9. SEED RATINGS
-- ============================================================================
INSERT INTO ratings (rating_id, booking_id, rater_user_id, ratee_user_id, role_rated, rating_score, punctuality_score, safety_score, review_text) VALUES
(1, 6, 2, 1, 'DRIVER', 5, 5, 5, 'Great driving, punctual and reached RR Campus ahead of time!'),
(2, 6, 1, 2, 'PASSENGER', 5, 5, 5, 'Pleasant passenger, waiting at the pickup spot exactly on time.'),
(3, 7, 4, 1, 'DRIVER', 5, 5, 5, 'Clean car, smooth drive through ORR traffic.'),
(4, 8, 8, 1, 'DRIVER', 5, 4, 5, 'Very courteous driver. Highly recommend for PESU carpool!'),
(5, 9, 4, 3, 'DRIVER', 5, 5, 5, 'Silent, comfortable EV ride. Zero carbon emissions!'),
(6, 10, 11, 3, 'DRIVER', 4, 4, 5, 'Good trip, slight delay at Agara junction but overall great.'),
(7, 11, 6, 5, 'DRIVER', 5, 5, 5, 'Honored to ride with Dr. Venkatesh. Great technical discussion on the way.'),
(8, 12, 2, 5, 'DRIVER', 5, 5, 5, 'Punctual departure, comfortable sedan.'),
(9, 13, 8, 5, 'DRIVER', 5, 5, 5, 'Smooth and safe ride. Great initiative for PESU!'),
(10, 14, 2, 7, 'DRIVER', 5, 5, 5, 'Clean Brezza and on-time pickup at Sony World.'),
(11, 15, 12, 7, 'DRIVER', 4, 4, 4, 'Comfortable commute, saved me over Rs 250 compared to Ola.'),
(12, 16, 12, 9, 'DRIVER', 5, 5, 5, 'Quick motorcycle drop at RR Gate. Very handy when running late for class!');

-- ============================================================================
-- 10. SEED CANCELLATIONS
-- ============================================================================
INSERT INTO cancellations (cancellation_id, booking_id, cancelled_by, reason, cancellation_fee, refund_amount, cancelled_at) VALUES
(1, 17, 'DRIVER', 'Heavy waterlogging on Outer Ring Road Silk Board corridor.', 0.00, 90.00, '2026-10-25 15:30:00');

-- Update ride status for past rides after bookings have inserted and decremented seats
UPDATE rides SET status = 'COMPLETED' WHERE ride_id IN (7, 8, 9, 10, 11);
UPDATE rides SET status = 'CANCELLED' WHERE ride_id = 12;

-- ============================================================================
-- 11. AUDIT TRAIL LOGS
-- ============================================================================
INSERT INTO audit_logs (entity_name, entity_id, action_type, performed_by, details) VALUES
('DATABASE', 1, 'INSERT', 'PESU_ADMIN', 'PESUPool enterprise database initialized with university route maps and user directories.'),
('RIDE', 1, 'INSERT', 'DRIVER_1', 'Driver Aarav Sharma scheduled ride #1 on RR-EC Express corridor.'),
('BOOKING', 1, 'INSERT', 'PASSENGER_2', 'Ananya Iyer reserved 1 seat on Ride #1 from Banashankari Metro.'),
('CANCELLATION', 1, 'INSERT', 'DRIVER_1', 'Automated 100% refund of Rs 90.00 dispatched for cancelled Ride #12.');
