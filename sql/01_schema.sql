-- ============================================================================
-- PESUPool: Intelligent Database-Driven Carpooling & Shared Mobility Platform
-- DBMS Experiential Learning - Level 3 Project (PES University)
-- File: 01_schema.sql (Complete DDL Schema, Constraints, Views, Triggers, SPs)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS pesupool;
USE pesupool;

-- Clean up any existing objects (demonstrates DROP)
DROP VIEW IF EXISTS vw_user_carbon_savings;
DROP VIEW IF EXISTS vw_route_metrics;
DROP VIEW IF EXISTS vw_driver_performance;
DROP VIEW IF EXISTS vw_available_rides;

DROP PROCEDURE IF EXISTS sp_generate_campus_report;
DROP PROCEDURE IF EXISTS sp_cancel_booking;
DROP PROCEDURE IF EXISTS sp_book_ride;

DROP TABLE IF EXISTS cancellations;
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS rides;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS routes;
DROP TABLE IF EXISTS passengers;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS users;

-- ============================================================================
-- 1. ENTITY: USERS
-- ============================================================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    srn_prn VARCHAR(30) NOT NULL UNIQUE,
    pes_email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    role ENUM('STUDENT', 'FACULTY', 'STAFF', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    campus ENUM('RR_CAMPUS', 'EC_CAMPUS', 'HN_CAMPUS') NOT NULL DEFAULT 'RR_CAMPUS',
    department VARCHAR(50) NOT NULL,
    gender ENUM('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY') NOT NULL,
    emergency_contact VARCHAR(15) NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_email_pes CHECK (pes_email LIKE '%@pes.edu' OR pes_email LIKE '%@pesu.pes.edu'),
    CONSTRAINT chk_srn_format CHECK (LENGTH(srn_prn) >= 5)
) ENGINE=InnoDB;

-- ============================================================================
-- 2. ENTITY: DRIVERS
-- ============================================================================
CREATE TABLE drivers (
    driver_id INT PRIMARY KEY,
    license_number VARCHAR(30) NOT NULL UNIQUE,
    license_expiry DATE NOT NULL,
    total_trips INT DEFAULT 0 CHECK (total_trips >= 0),
    avg_rating DECIMAL(3, 2) DEFAULT 5.00 CHECK (avg_rating BETWEEN 1.00 AND 5.00),
    verification_status ENUM('VERIFIED', 'PENDING', 'SUSPENDED') DEFAULT 'VERIFIED',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- 3. ENTITY: PASSENGERS
-- ============================================================================
CREATE TABLE passengers (
    passenger_id INT PRIMARY KEY,
    default_pickup_point VARCHAR(100) NOT NULL,
    total_rides_taken INT DEFAULT 0 CHECK (total_rides_taken >= 0),
    avg_rating DECIMAL(3, 2) DEFAULT 5.00 CHECK (avg_rating BETWEEN 1.00 AND 5.00),
    wallet_balance DECIMAL(10, 2) DEFAULT 500.00 CHECK (wallet_balance >= 0.00),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (passenger_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- 4. ENTITY: VEHICLES
-- ============================================================================
CREATE TABLE vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    plate_number VARCHAR(20) NOT NULL UNIQUE,
    vehicle_type ENUM('SEDAN', 'HATCHBACK', 'SUV', 'EV', 'TWO_WHEELER') NOT NULL,
    fuel_type ENUM('PETROL', 'DIESEL', 'ELECTRIC', 'CNG', 'HYBRID') NOT NULL,
    seating_capacity INT NOT NULL CHECK (seating_capacity BETWEEN 1 AND 7),
    color VARCHAR(30) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- 5. ENTITY: ROUTES
-- ============================================================================
CREATE TABLE routes (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    route_name VARCHAR(120) NOT NULL,
    origin_campus VARCHAR(100) NOT NULL,
    destination_campus VARCHAR(100) NOT NULL,
    pickup_points_json JSON NOT NULL,
    distance_km DECIMAL(6, 2) NOT NULL CHECK (distance_km > 0.00),
    estimated_duration_mins INT NOT NULL CHECK (estimated_duration_mins > 0),
    base_fare DECIMAL(8, 2) NOT NULL CHECK (base_fare > 0.00),
    toll_amount DECIMAL(8, 2) DEFAULT 0.00 CHECK (toll_amount >= 0.00),
    is_active BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

-- ============================================================================
-- 6. ENTITY: RIDES
-- ============================================================================
CREATE TABLE rides (
    ride_id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    route_id INT NOT NULL,
    travel_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    total_seats INT NOT NULL CHECK (total_seats > 0),
    available_seats INT NOT NULL CHECK (available_seats >= 0),
    price_per_seat DECIMAL(8, 2) NOT NULL CHECK (price_per_seat > 0.00),
    luggage_allowed BOOLEAN DEFAULT TRUE,
    gender_preference ENUM('ANY', 'FEMALE_ONLY', 'MALE_ONLY') DEFAULT 'ANY',
    status ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'SCHEDULED',
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES routes(route_id) ON DELETE CASCADE,
    CONSTRAINT chk_seats_valid CHECK (available_seats <= total_seats)
) ENGINE=InnoDB;

-- ============================================================================
-- 7. ENTITY: BOOKINGS
-- ============================================================================
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    ride_id INT NOT NULL,
    passenger_id INT NOT NULL,
    seats_booked INT NOT NULL CHECK (seats_booked > 0),
    pickup_stop VARCHAR(100) NOT NULL,
    drop_stop VARCHAR(100) NOT NULL,
    total_fare DECIMAL(8, 2) NOT NULL CHECK (total_fare >= 0.00),
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'CONFIRMED',
    qr_code_token VARCHAR(64) NOT NULL UNIQUE,
    FOREIGN KEY (ride_id) REFERENCES rides(ride_id) ON DELETE CASCADE,
    FOREIGN KEY (passenger_id) REFERENCES passengers(passenger_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- 8. ENTITY: PAYMENTS
-- ============================================================================
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL UNIQUE,
    amount DECIMAL(8, 2) NOT NULL CHECK (amount >= 0.00),
    payment_method ENUM('UPI', 'PESU_WALLET', 'CASH', 'CARD') DEFAULT 'PESU_WALLET',
    transaction_reference VARCHAR(64) NOT NULL UNIQUE,
    payment_status ENUM('PENDING', 'SUCCESS', 'REFUNDED', 'FAILED') DEFAULT 'SUCCESS',
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- 9. ENTITY: RATINGS
-- ============================================================================
CREATE TABLE ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    rater_user_id INT NOT NULL,
    ratee_user_id INT NOT NULL,
    role_rated ENUM('DRIVER', 'PASSENGER') NOT NULL,
    rating_score INT NOT NULL CHECK (rating_score BETWEEN 1 AND 5),
    punctuality_score INT DEFAULT 5 CHECK (punctuality_score BETWEEN 1 AND 5),
    safety_score INT DEFAULT 5 CHECK (safety_score BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (rater_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (ratee_user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- 10. ENTITY: CANCELLATIONS
-- ============================================================================
CREATE TABLE cancellations (
    cancellation_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL UNIQUE,
    cancelled_by ENUM('PASSENGER', 'DRIVER', 'ADMIN') NOT NULL,
    reason VARCHAR(255) NOT NULL,
    cancellation_fee DECIMAL(8, 2) DEFAULT 0.00 CHECK (cancellation_fee >= 0.00),
    refund_amount DECIMAL(8, 2) NOT NULL DEFAULT 0.00 CHECK (refund_amount >= 0.00),
    cancelled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- 11. AUDIT LOGS TABLE
-- ============================================================================
CREATE TABLE audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    entity_name VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,
    action_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    performed_by VARCHAR(100) DEFAULT 'SYSTEM',
    details TEXT,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================================
CREATE INDEX idx_rides_date_status ON rides (travel_date, status, departure_time);
CREATE INDEX idx_rides_driver ON rides (driver_id, status);
CREATE INDEX idx_routes_endpoints ON routes (origin_campus, destination_campus);
CREATE INDEX idx_bookings_user ON bookings (passenger_id, status);
CREATE INDEX idx_payments_status ON payments (payment_status, paid_at);
CREATE INDEX idx_ratings_ratee ON ratings (ratee_user_id, rating_score);

-- ============================================================================
-- DATABASE VIEWS
-- ============================================================================

-- View 1: Available active rides with driver reputation and route info
CREATE VIEW vw_available_rides AS
SELECT 
    r.ride_id,
    r.travel_date,
    r.departure_time,
    r.total_seats,
    r.available_seats,
    r.price_per_seat,
    r.gender_preference,
    r.luggage_allowed,
    r.status AS ride_status,
    ro.route_id,
    ro.route_name,
    ro.origin_campus,
    ro.destination_campus,
    ro.distance_km,
    ro.estimated_duration_mins,
    ro.pickup_points_json,
    u.user_id AS driver_user_id,
    u.full_name AS driver_name,
    u.pes_email AS driver_email,
    u.phone AS driver_phone,
    u.department AS driver_department,
    d.avg_rating AS driver_rating,
    d.total_trips AS driver_completed_trips,
    v.vehicle_id,
    v.make,
    v.model,
    v.plate_number,
    v.vehicle_type,
    v.fuel_type,
    v.color
FROM rides r
JOIN routes ro ON r.route_id = ro.route_id
JOIN drivers d ON r.driver_id = d.driver_id
JOIN users u ON d.driver_id = u.user_id
JOIN vehicles v ON r.vehicle_id = v.vehicle_id
WHERE r.status = 'SCHEDULED' AND r.available_seats > 0;

-- View 2: Driver Performance Leaderboard and Operational Metrics
CREATE VIEW vw_driver_performance AS
SELECT 
    d.driver_id,
    u.full_name AS driver_name,
    u.department,
    u.campus,
    v.make,
    v.model,
    v.plate_number,
    COUNT(DISTINCT r.ride_id) AS total_rides_scheduled,
    SUM(CASE WHEN r.status = 'COMPLETED' THEN 1 ELSE 0 END) AS total_rides_completed,
    SUM(CASE WHEN r.status = 'CANCELLED' THEN 1 ELSE 0 END) AS total_rides_cancelled,
    COALESCE(ROUND(AVG(rt.rating_score), 2), 5.00) AS calculated_rating,
    COUNT(rt.rating_id) AS total_reviews_received,
    COALESCE(SUM(p.amount), 0.00) AS total_revenue_generated
FROM drivers d
JOIN users u ON d.driver_id = u.user_id
LEFT JOIN vehicles v ON d.driver_id = v.driver_id AND v.is_active = TRUE
LEFT JOIN rides r ON d.driver_id = r.driver_id
LEFT JOIN bookings b ON r.ride_id = b.ride_id AND b.status = 'COMPLETED'
LEFT JOIN payments p ON b.booking_id = p.booking_id AND p.payment_status = 'SUCCESS'
LEFT JOIN ratings rt ON b.booking_id = rt.booking_id AND rt.role_rated = 'DRIVER'
GROUP BY d.driver_id, u.full_name, u.department, u.campus, v.make, v.model, v.plate_number;

-- View 3: Route Utilization and Average Occupancy Metrics
CREATE VIEW vw_route_metrics AS
SELECT 
    ro.route_id,
    ro.route_name,
    ro.origin_campus,
    ro.destination_campus,
    ro.distance_km,
    ro.base_fare,
    COUNT(DISTINCT r.ride_id) AS total_rides_hosted,
    COUNT(DISTINCT b.booking_id) AS total_bookings_made,
    COALESCE(SUM(b.seats_booked), 0) AS total_passengers_transported,
    ROUND(
        COALESCE(SUM(b.seats_booked) / NULLIF(SUM(r.total_seats), 0) * 100, 0),
        1
    ) AS avg_occupancy_percentage,
    COALESCE(SUM(b.total_fare), 0.00) AS total_route_revenue
FROM routes ro
LEFT JOIN rides r ON ro.route_id = r.route_id
LEFT JOIN bookings b ON r.ride_id = b.ride_id AND b.status = 'COMPLETED'
GROUP BY ro.route_id, ro.route_name, ro.origin_campus, ro.destination_campus, ro.distance_km, ro.base_fare;

-- View 4: Eco-Impact & Carbon Savings Tracker (Novelty Feature)
CREATE VIEW vw_user_carbon_savings AS
SELECT 
    u.user_id,
    u.full_name,
    u.pes_email,
    u.role,
    u.department,
    COUNT(b.booking_id) AS rides_shared,
    COALESCE(SUM(ro.distance_km), 0.0) AS total_km_shared,
    -- Factor: ~0.171 kg CO2 avoided per carpool passenger-km compared to single-occupant driving
    ROUND(COALESCE(SUM(ro.distance_km * 0.171), 0.0), 2) AS kg_co2_avoided,
    -- Commercial cab average cost ~Rs 22/km vs PESUPool base fare
    ROUND(COALESCE(SUM(ro.distance_km * 22.0 - b.total_fare), 0.0), 2) AS estimated_rupees_saved
FROM users u
JOIN passengers p ON u.user_id = p.passenger_id
JOIN bookings b ON p.passenger_id = b.passenger_id AND b.status = 'COMPLETED'
JOIN rides r ON b.ride_id = r.ride_id
JOIN routes ro ON r.route_id = ro.route_id
GROUP BY u.user_id, u.full_name, u.pes_email, u.role, u.department;

-- ============================================================================
-- DATABASE TRIGGERS
-- ============================================================================

DELIMITER $$

-- Trigger 1: Prevent Driver Self-Booking
CREATE TRIGGER trg_prevent_driver_self_booking
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    DECLARE v_driver_id INT;
    SELECT driver_id INTO v_driver_id FROM rides WHERE ride_id = NEW.ride_id;
    IF v_driver_id = NEW.passenger_id THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Integrity Violation: Driver cannot book seats in their own ride!';
    END IF;
END$$

-- Trigger 2: Check Seat Availability Before Reservation
CREATE TRIGGER trg_check_available_seats
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    DECLARE v_available INT;
    DECLARE v_ride_status VARCHAR(20);
    
    SELECT available_seats, status INTO v_available, v_ride_status 
    FROM rides WHERE ride_id = NEW.ride_id;
    
    IF v_ride_status <> 'SCHEDULED' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Booking Failed: This ride is no longer accepting bookings.';
    END IF;
    
    IF v_available < NEW.seats_booked THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Overbooking Error: Insufficient seats remaining for this ride!';
    END IF;
END$$

-- Trigger 3: After Booking Confirmation, Decrement Seats and Update Passenger Stats
CREATE TRIGGER trg_after_booking_confirmed
AFTER INSERT ON bookings
FOR EACH ROW
BEGIN
    -- Decrement available seats in the ride
    UPDATE rides 
    SET available_seats = available_seats - NEW.seats_booked
    WHERE ride_id = NEW.ride_id;
    
    -- Increment total rides count for the passenger
    UPDATE passengers
    SET total_rides_taken = total_rides_taken + 1
    WHERE passenger_id = NEW.passenger_id;

    -- Audit trail log
    INSERT INTO audit_logs (entity_name, entity_id, action_type, performed_by, details)
    VALUES ('BOOKING', NEW.booking_id, 'INSERT', CONCAT('PASSENGER_', NEW.passenger_id),
            CONCAT('Reserved ', NEW.seats_booked, ' seats on Ride #', NEW.ride_id, ' for Rs ', NEW.total_fare));
END$$

-- Trigger 4: Restore Available Seats on Cancellation
CREATE TRIGGER trg_after_cancellation_restore_seats
AFTER INSERT ON cancellations
FOR EACH ROW
BEGIN
    DECLARE v_ride_id INT;
    DECLARE v_seats INT;
    DECLARE v_passenger_id INT;
    
    SELECT ride_id, seats_booked, passenger_id 
    INTO v_ride_id, v_seats, v_passenger_id
    FROM bookings WHERE booking_id = NEW.booking_id;
    
    -- Mark booking status as CANCELLED
    UPDATE bookings 
    SET status = 'CANCELLED' 
    WHERE booking_id = NEW.booking_id;
    
    -- Restore seats to the ride
    UPDATE rides 
    SET available_seats = available_seats + v_seats
    WHERE ride_id = v_ride_id;

    -- Refund amount back into passenger PESU Wallet
    IF NEW.refund_amount > 0 THEN
        UPDATE passengers
        SET wallet_balance = wallet_balance + NEW.refund_amount
        WHERE passenger_id = v_passenger_id;
    END IF;
    
    -- Audit trail log
    INSERT INTO audit_logs (entity_name, entity_id, action_type, performed_by, details)
    VALUES ('CANCELLATION', NEW.cancellation_id, 'INSERT', NEW.cancelled_by,
            CONCAT('Cancelled Booking #', NEW.booking_id, ', restored ', v_seats, ' seats, refunded Rs ', NEW.refund_amount));
END$$

-- Trigger 5: Dynamic Average Rating Recalculation
CREATE TRIGGER trg_after_rating_submitted
AFTER INSERT ON ratings
FOR EACH ROW
BEGIN
    IF NEW.role_rated = 'DRIVER' THEN
        UPDATE drivers
        SET avg_rating = (
            SELECT ROUND(AVG(rating_score), 2)
            FROM ratings
            WHERE ratee_user_id = NEW.ratee_user_id AND role_rated = 'DRIVER'
        )
        WHERE driver_id = NEW.ratee_user_id;
    ELSE
        UPDATE passengers
        SET avg_rating = (
            SELECT ROUND(AVG(rating_score), 2)
            FROM ratings
            WHERE ratee_user_id = NEW.ratee_user_id AND role_rated = 'PASSENGER'
        )
        WHERE passenger_id = NEW.ratee_user_id;
    END IF;
END$$

-- ============================================================================
-- STORED PROCEDURES (ACID TRANSACTIONS)
-- ============================================================================

-- Stored Procedure 1: sp_book_ride (ACID Transactional Seat Reservation)
CREATE PROCEDURE sp_book_ride(
    IN p_ride_id INT,
    IN p_passenger_id INT,
    IN p_seats INT,
    IN p_pickup VARCHAR(100),
    IN p_drop VARCHAR(100),
    IN p_payment_method VARCHAR(20),
    OUT p_booking_id INT,
    OUT p_status_msg VARCHAR(255)
)
proc: BEGIN
    DECLARE v_available_seats INT;
    DECLARE v_price_per_seat DECIMAL(8, 2);
    DECLARE v_total_fare DECIMAL(8, 2);
    DECLARE v_wallet_balance DECIMAL(10, 2);
    DECLARE v_ride_status VARCHAR(20);
    DECLARE v_driver_id INT;
    DECLARE v_token VARCHAR(64);
    DECLARE v_tx_ref VARCHAR(64);

    -- Error handler for automatic rollback
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_booking_id = 0;
        SET p_status_msg = 'Transaction Aborted: SQL Exception occurred during booking.';
    END;

    START TRANSACTION;

    -- 1. Check passenger wallet & existence
    SELECT wallet_balance INTO v_wallet_balance 
    FROM passengers WHERE passenger_id = p_passenger_id;

    IF v_wallet_balance IS NULL THEN
        ROLLBACK;
        SET p_booking_id = 0;
        SET p_status_msg = 'Error: Passenger account not found.';
        LEAVE proc;
    END IF;

    -- 2. Lock the target ride row for update to prevent concurrent double-booking
    SELECT driver_id, available_seats, price_per_seat, status
    INTO v_driver_id, v_available_seats, v_price_per_seat, v_ride_status
    FROM rides WHERE ride_id = p_ride_id FOR UPDATE;

    -- 3. Business rule validations
    IF v_driver_id = p_passenger_id THEN
        ROLLBACK;
        SET p_booking_id = 0;
        SET p_status_msg = 'Error: You cannot book seats on your own ride.';
        LEAVE proc;
    END IF;

    IF v_ride_status <> 'SCHEDULED' THEN
        ROLLBACK;
        SET p_booking_id = 0;
        SET p_status_msg = 'Error: Ride is no longer scheduled.';
        LEAVE proc;
    END IF;

    IF v_available_seats < p_seats THEN
        ROLLBACK;
        SET p_booking_id = 0;
        SET p_status_msg = CONCAT('Error: Only ', v_available_seats, ' seats available.');
        LEAVE proc;
    END IF;

    SET v_total_fare = v_price_per_seat * p_seats;

    -- 4. Check wallet balance if payment method is PESU_WALLET
    IF p_payment_method = 'PESU_WALLET' AND v_wallet_balance < v_total_fare THEN
        ROLLBACK;
        SET p_booking_id = 0;
        SET p_status_msg = CONCAT('Error: Insufficient wallet balance. Required: Rs ', v_total_fare, ', Available: Rs ', v_wallet_balance);
        LEAVE proc;
    END IF;

    -- 5. Deduct from wallet if using wallet
    IF p_payment_method = 'PESU_WALLET' THEN
        UPDATE passengers
        SET wallet_balance = wallet_balance - v_total_fare
        WHERE passenger_id = p_passenger_id;
    END IF;

    -- 6. Generate QR token and transaction ref
    SET v_token = CONCAT('QR-', UUID_SHORT());
    SET v_tx_ref = CONCAT('TXN-', UUID_SHORT());

    -- 7. Insert Booking (Trigger will automatically decrement ride available_seats!)
    INSERT INTO bookings (ride_id, passenger_id, seats_booked, pickup_stop, drop_stop, total_fare, status, qr_code_token)
    VALUES (p_ride_id, p_passenger_id, p_seats, p_pickup, p_drop, v_total_fare, 'CONFIRMED', v_token);

    SET p_booking_id = LAST_INSERT_ID();

    -- 8. Insert Payment record
    INSERT INTO payments (booking_id, amount, payment_method, transaction_reference, payment_status)
    VALUES (p_booking_id, v_total_fare, p_payment_method, v_tx_ref, 'SUCCESS');

    COMMIT;
    SET p_status_msg = 'SUCCESS: Booking confirmed and seat reserved.';
END$$

-- Stored Procedure 2: sp_cancel_booking (ACID Cancellation & Auto Refund)
CREATE PROCEDURE sp_cancel_booking(
    IN p_booking_id INT,
    IN p_reason VARCHAR(255),
    IN p_cancelled_by VARCHAR(20),
    OUT p_refund_amount DECIMAL(8, 2),
    OUT p_status_msg VARCHAR(255)
)
proc: BEGIN
    DECLARE v_current_status VARCHAR(20);
    DECLARE v_fare DECIMAL(8, 2);
    DECLARE v_fee DECIMAL(8, 2) DEFAULT 0.00;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_refund_amount = 0.00;
        SET p_status_msg = 'Transaction Failed: SQLEXCEPTION during cancellation.';
    END;

    START TRANSACTION;

    SELECT status, total_fare INTO v_current_status, v_fare
    FROM bookings WHERE booking_id = p_booking_id FOR UPDATE;

    IF v_current_status IS NULL THEN
        ROLLBACK;
        SET p_refund_amount = 0.00;
        SET p_status_msg = 'Error: Booking not found.';
        LEAVE proc;
    END IF;

    IF v_current_status <> 'CONFIRMED' THEN
        ROLLBACK;
        SET p_refund_amount = 0.00;
        SET p_status_msg = CONCAT('Error: Cannot cancel booking with status ', v_current_status);
        LEAVE proc;
    END IF;

    -- If cancelled by passenger, 10% cancellation charge, 90% refund; If cancelled by driver/admin, 100% refund
    IF p_cancelled_by = 'PASSENGER' THEN
        SET v_fee = ROUND(v_fare * 0.10, 2);
        SET p_refund_amount = v_fare - v_fee;
    ELSE
        SET v_fee = 0.00;
        SET p_refund_amount = v_fare;
    END IF;

    -- Insert into cancellations (Trigger will restore seats and credit passenger wallet)
    INSERT INTO cancellations (booking_id, cancelled_by, reason, cancellation_fee, refund_amount)
    VALUES (p_booking_id, p_cancelled_by, p_reason, v_fee, p_refund_amount);

    -- Update payment status to REFUNDED
    UPDATE payments 
    SET payment_status = 'REFUNDED'
    WHERE booking_id = p_booking_id;

    COMMIT;
    SET p_status_msg = CONCAT('SUCCESS: Booking cancelled. Refund of Rs ', p_refund_amount, ' credited.');
END$$

-- Stored Procedure 3: sp_generate_campus_report
CREATE PROCEDURE sp_generate_campus_report()
BEGIN
    SELECT 
        u.department,
        u.campus,
        COUNT(DISTINCT u.user_id) AS registered_users,
        COUNT(DISTINCT CASE WHEN d.driver_id IS NOT NULL THEN d.driver_id END) AS registered_drivers,
        COUNT(DISTINCT b.booking_id) AS total_trips_taken,
        COALESCE(SUM(b.total_fare), 0.00) AS total_amount_spent,
        ROUND(COALESCE(AVG(b.total_fare), 0.00), 2) AS avg_fare_per_booking
    FROM users u
    LEFT JOIN drivers d ON u.user_id = d.driver_id
    LEFT JOIN passengers p ON u.user_id = p.passenger_id
    LEFT JOIN bookings b ON p.passenger_id = b.passenger_id AND b.status = 'COMPLETED'
    GROUP BY u.department, u.campus
    ORDER BY total_trips_taken DESC;
END$$

DELIMITER ;
