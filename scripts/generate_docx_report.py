import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
import os

def create_element(name):
    return OxmlElement(name)

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = create_element('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def generate_report():
    doc = Document()

    # Page Margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Styles
    navy = RGBColor(10, 37, 64)
    blue = RGBColor(37, 99, 235)
    gold = RGBColor(180, 130, 20)

    # Title
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_title = title.add_run("PESUPool: An Intelligent Database-Driven Carpooling & Shared Mobility Platform\n")
    run_title.font.name = "Calibri"
    run_title.font.size = Pt(22)
    run_title.font.bold = True
    run_title.font.color.rgb = navy

    sub = doc.add_paragraph()
    sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_sub = sub.add_run("DBMS Experiential Learning – Level 3 Capstone Project Report\nPES University, Bengaluru\n")
    run_sub.font.name = "Calibri"
    run_sub.font.size = Pt(13)
    run_sub.font.bold = True
    run_sub.font.color.rgb = blue

    # Metadata Box
    p_meta = doc.add_paragraph()
    p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_meta = p_meta.add_run("Course Instructor: Dr. Nagasundari S | Department of Computer Science & Engineering\n")
    r_meta.font.size = Pt(11)
    r_meta.font.italic = True

    # Team Table
    table = doc.add_table(rows=1, cols=4)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = table.rows[0].cells
    headers = ["Team Member", "SRN", "Institutional Email", "Primary Responsibilities"]
    for i, h in enumerate(headers):
        hdr[i].text = h
        hdr[i].paragraphs[0].runs[0].font.bold = True
        hdr[i].paragraphs[0].runs[0].font.size = Pt(9.5)
        set_cell_background(hdr[i], "0A2540")
        hdr[i].paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)

    data = [
        ("Team Member 1", "PES1UG24AM121", "pes1ug24am121@pesu.pes.edu", "Relational Schema, 3NF Normalization, DDL/DML, ACID Stored Procedures, Triggers, Indexes"),
        ("Team Member 2", "PES1UG24AM078", "pes1ug24am078@pesu.pes.edu", "Next.js 14 Web Application, REST APIs, MongoDB Telemetry Pipeline, Analytics, Documentation")
    ]
    for row in data:
        r = table.add_row().cells
        for i, val in enumerate(row):
            r[i].text = val
            r[i].paragraphs[0].runs[0].font.size = Pt(9)
            set_cell_background(r[i], "F0F4F8" if data.index(row)%2==0 else "FFFFFF")

    doc.add_paragraph("\n")

    # Content Sections
    sections_text = [
        ("1. Problem Statement & Motivation", 
         "Urban transit across Bengaluru is characterized by chronic vehicular congestion, peak-hour bottlenecks, long commute durations, high fuel expenses, and significant carbon emissions. For students and faculty members of PES University, traversing between the Ring Road (RR) Campus, Electronic City (EC) Campus, and major public transport nodes (Banashankari Metro, Silk Board Junction, and Koramangala) represents a daily logistical challenge.\nCommercial ride-hailing services (Uber/Ola) impose aggressive surge pricing during college rush hours and lack campus-level trust verification. Simultaneously, hundreds of private vehicles commute to PES University campuses every day with multiple vacant seats. PESUPool provides a centralized, database-driven carpooling platform tailored specifically to the PES University community, uniting relational ACID guarantees with high-throughput NoSQL telemetry."),

        ("2. Project Objectives & Scope",
         "1. ACID Seat Reservation: Implement row-level locking (SELECT ... FOR UPDATE) inside stored procedures to guarantee that concurrent seat reservation attempts never exceed vehicle capacity.\n2. Campus Identity Verification: Enforce institutional email verification (@pes.edu / @pesu.pes.edu) and valid SRN/PRN strings.\n3. Multi-Paradigmatic Persistence: Relational storage for financial ledgers and reservations (MySQL 8.4); document store for high-frequency GPS breadcrumbs (MongoDB).\n4. Cost Splitting & Carbon Offset: Intelligently calculate per-seat travel expenses based on route distance and fuel classification, tracking cumulative carbon emission reductions (~0.171 kg CO2 avoided per passenger-km).\n5. Deep DBMS Analytics: Provide analytical reports executing multi-table joins, GROUP BY, HAVING, and subqueries."),

        ("3. System Architecture & Database Justification",
         "PESUPool adopts a polyglot persistence architecture:\n- Relational DBMS (MySQL 8.4): Manages core entities: USERS, DRIVERS, PASSENGERS, VEHICLES, ROUTES, RIDES, BOOKINGS, PAYMENTS, RATINGS, CANCELLATIONS. Guarantees ACID transactional compliance, referential integrity with ON DELETE CASCADE, row-level locking, and relational analytical queries.\n- Document NoSQL (MongoDB): Manages unstructured, high-velocity streaming collections: 'ride_telemetry' (real-time vehicle coordinates, speeds, and traffic delay vectors) and 'ride_chat_logs' (in-transit driver-passenger pickup messages). Accommodates high write throughput without table locking or schema rigidity and powers a MongoDB Aggregation Pipeline ($group, $avg, $sort)."),

        ("4. Entity-Relationship (ER) Modeling (10 Entities in 3NF)",
         "The database consists of 10 normalized entities with strict constraints, exceeding the rubric requirement of 5 tables:\n"
         "1. USERS (user_id [PK], srn_prn [UK], pes_email [UK], full_name, phone [UK], role, campus, department, gender, emergency_contact)\n"
         "2. DRIVERS (driver_id [PK, FK->users], license_number [UK], license_expiry, total_trips, avg_rating, verification_status)\n"
         "3. PASSENGERS (passenger_id [PK, FK->users], default_pickup_point, total_rides_taken, avg_rating, wallet_balance)\n"
         "4. VEHICLES (vehicle_id [PK], driver_id [FK->drivers], make, model, plate_number [UK], vehicle_type, fuel_type, seating_capacity, color)\n"
         "5. ROUTES (route_id [PK], route_name, origin_campus, destination_campus, pickup_points_json, distance_km, estimated_duration_mins, base_fare, toll_amount)\n"
         "6. RIDES (ride_id [PK], driver_id [FK], vehicle_id [FK], route_id [FK], travel_date, departure_time, total_seats, available_seats, price_per_seat, status)\n"
         "7. BOOKINGS (booking_id [PK], ride_id [FK], passenger_id [FK], seats_booked, pickup_stop, drop_stop, total_fare, status, qr_code_token [UK])\n"
         "8. PAYMENTS (payment_id [PK], booking_id [FK, UK], amount, payment_method, transaction_reference [UK], payment_status, paid_at)\n"
         "9. RATINGS (rating_id [PK], booking_id [FK], rater_user_id [FK], ratee_user_id [FK], role_rated, rating_score, punctuality_score, safety_score, review_text)\n"
         "10. CANCELLATIONS (cancellation_id [PK], booking_id [FK, UK], cancelled_by, reason, cancellation_fee, refund_amount, cancelled_at)"),

        ("5. Advanced Database Concepts Demonstrated (6 Features)",
         "1. ACID Transactions (sp_book_ride & sp_cancel_booking): Employs START TRANSACTION, SELECT ... FOR UPDATE, and DECLARE EXIT HANDLER FOR SQLEXCEPTION to guarantee atomic seat reservations.\n"
         "2. Database Views: vw_available_rides, vw_driver_performance, vw_route_metrics, and vw_user_carbon_savings.\n"
         "3. Database Triggers (5 triggers): trg_prevent_driver_self_booking, trg_check_available_seats, trg_after_booking_confirmed, trg_after_cancellation_restore_seats, trg_after_rating_submitted.\n"
         "4. Stored Procedures: Encapsulates end-to-end business logic in MySQL Server.\n"
         "5. Composite Indexing: idx_rides_date_status, idx_routes_endpoints, idx_bookings_user.\n"
         "6. NoSQL Aggregation Pipeline: Real-time corridor speed calculations over GPS telemetry in MongoDB."),

        ("6. Important Analytical Queries & Reports",
         "- Report 1: Department Mobility & Financial Savings (Joins users, passengers, bookings, rides, routes; groups by department; computes savings vs ₹22/km cabs and CO2 avoided).\n"
         "- Report 2: Route Occupancy & Gross Revenue (Multi-table join with GROUP BY and HAVING COUNT(b.booking_id) > 0).\n"
         "- Report 3: Peak Commuter Departure Hours (Temporal HOUR(r.departure_time) extraction identifying 8:00-9:00 AM rush).\n"
         "- Report 4: Driver Performance Leaderboard (Multi-join with HAVING avg_rating >= 4.50).\n"
         "- Report 5: Nested Subquery for Above-Campus-Average Earners.\n"
         "- Report 6: Cancellation Breakdown & Revenue Loss.\n"
         "- Report 7: MongoDB NoSQL Segment Velocity Aggregation Pipeline."),

        ("7. Testing Results & Verification",
         "Comprehensive test cases verified the integrity of the platform:\n"
         "- TC-01 (Atomic Reservation): Confirmed seat booking atomically reduced available seats and created payment record (PASS).\n"
         "- TC-02 (Anti-Self-Booking Trigger): Prevented driver from booking on own ride with custom error message (PASS).\n"
         "- TC-03 (Overbooking Prevention): Rejected reservation when requested seats exceeded capacity (PASS).\n"
         "- TC-04 (Cancellation & Refund): Restored seat capacity and credited 90% refund to passenger wallet (PASS).\n"
         "- TC-05 (Telemetry Ingestion): Stored real-time GeoJSON coordinates without blocking database locks (PASS)."),

        ("8. Individual Contributions Summary",
         "- PES1UG24AM121 (Team Member 1): Designed relational schema, verified 3NF normalization, authored 01_schema.sql DDL, implemented stored procedures sp_book_ride and sp_cancel_booking, programmed database triggers, established indexing strategies.\n"
         "- PES1UG24AM078 (Team Member 2): Developed Next.js 14 web interface, implemented connection pooling, engineered MongoDB telemetry pipeline and chat streaming, developed analytical queries backend, created interactive dashboard and documentation.")
    ]

    for title_text, body_text in sections_text:
        h = doc.add_heading(level=1)
        r_h = h.add_run(title_text)
        r_h.font.name = "Calibri"
        r_h.font.size = Pt(14)
        r_h.font.bold = True
        r_h.font.color.rgb = navy

        p = doc.add_paragraph()
        r_p = p.add_run(body_text)
        r_p.font.name = "Calibri"
        r_p.font.size = Pt(10.5)
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(8)

    out_path = r"C:\Users\deeks\.gemini\antigravity\scratch\pesupool\docs\DBMS_Level3_Project_Report_PESUPool.docx"
    doc.save(out_path)
    print("Report saved successfully to:", out_path)

if __name__ == "__main__":
    generate_report()
