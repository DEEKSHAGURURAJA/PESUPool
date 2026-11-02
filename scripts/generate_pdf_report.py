from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
from reportlab.lib.units import inch

def generate_pdf():
    pdf_path = r"C:\Users\deeks\.gemini\antigravity\scratch\pesupool\docs\DBMS_Level3_Project_Report_PESUPool.pdf"
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0A2540'),
        alignment=1, # Center
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#2563EB'),
        alignment=1,
        spaceAfter=12
    )

    meta_style = ParagraphStyle(
        'MetaStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#475569'),
        alignment=1,
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#0A2540'),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#1E293B'),
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#1E293B'),
        leftIndent=15,
        spaceAfter=4
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#0F172A')
    )

    table_hdr = ParagraphStyle(
        'TableHdr',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.white
    )

    story = []

    # Title & Header
    story.append(Paragraph("PESUPool: An Intelligent Database-Driven Carpooling Platform", title_style))
    story.append(Paragraph("DBMS Experiential Learning – Level 3 Capstone Project Report", subtitle_style))
    story.append(Paragraph("PES University, Bengaluru | Dept of Computer Science & Engineering | Instructor: Dr. Nagasundari S", meta_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#2563EB'), spaceAfter=12))

    # Team Table
    team_data = [
        [Paragraph("Team Member", table_hdr), Paragraph("SRN", table_hdr), Paragraph("Email", table_hdr), Paragraph("Project Contribution Scope", table_hdr)],
        [
            Paragraph("Team Member 1", table_cell),
            Paragraph("<b>PES1UG24AM121</b>", table_cell),
            Paragraph("pes1ug24am121@pesu.pes.edu", table_cell),
            Paragraph("Relational Schema Design, 3NF Normalization, DDL/DML, ACID Stored Procedures (sp_book_ride), 5 Database Triggers, Indexing", table_cell)
        ],
        [
            Paragraph("Team Member 2", table_cell),
            Paragraph("<b>PES1UG24AM078</b>", table_cell),
            Paragraph("pes1ug24am078@pesu.pes.edu", table_cell),
            Paragraph("Next.js 14 Web Interface, REST Route Handlers, MongoDB Telemetry Stream, Aggregation Pipeline, Analytics, Documentation", table_cell)
        ]
    ]

    t_team = Table(team_data, colWidths=[1.1*inch, 1.4*inch, 2.0*inch, 2.7*inch])
    t_team.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0A2540')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#0A2540')),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#F8FAFC')),
        ('BACKGROUND', (0,2), (-1,2), colors.HexColor('#FFFFFF')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_team)
    story.append(Spacer(1, 14))

    # 1. Problem Statement
    story.append(Paragraph("1. Problem Statement & Motivation", h1_style))
    story.append(Paragraph(
        "Urban transit across Bengaluru is characterized by chronic vehicular congestion, peak-hour bottlenecks, long commute durations, high fuel expenses, and significant carbon emissions. For students and faculty members of PES University, traversing between the Ring Road (RR) Campus, Electronic City (EC) Campus, and major public transport nodes (Banashankari Metro, Silk Board Junction, and Koramangala) represents a daily logistical challenge.<br/><br/>"
        "Commercial ride-hailing services (Uber/Ola) impose aggressive surge pricing during college rush hours and lack campus-level trust verification. Simultaneously, hundreds of private vehicles commute to PES University campuses every day with multiple vacant seats. PESUPool provides a centralized, database-driven carpooling platform tailored specifically to the PES University community, uniting relational ACID guarantees with high-throughput NoSQL telemetry.",
        body_style
    ))

    # 2. Objectives & Scope
    story.append(Paragraph("2. Project Objectives & Scope", h1_style))
    story.append(Paragraph("• <b>ACID Seat Reservation:</b> Implement row-level locking (<code>SELECT ... FOR UPDATE</code>) inside stored procedures to guarantee that concurrent seat reservation attempts never exceed vehicle capacity.", bullet_style))
    story.append(Paragraph("• <b>Campus Identity Verification:</b> Enforce institutional email verification (<code>@pes.edu</code> / <code>@pesu.pes.edu</code>) and valid SRN/PRN strings.", bullet_style))
    story.append(Paragraph("• <b>Multi-Paradigmatic Persistence:</b> Relational storage for financial ledgers and reservations (MySQL 8.4); document store for high-frequency GPS breadcrumbs (MongoDB).", bullet_style))
    story.append(Paragraph("• <b>Cost Splitting & Carbon Offset:</b> Intelligently calculate per-seat travel expenses based on route distance and fuel classification, tracking cumulative carbon emission reductions (~0.171 kg CO2 avoided per passenger-km).", bullet_style))
    story.append(Paragraph("• <b>Deep DBMS Analytics:</b> Provide analytical reports executing multi-table joins, GROUP BY, HAVING, and subqueries.", bullet_style))

    # 3. System Architecture & Database Choice
    story.append(Paragraph("3. System Architecture & Database Paradigm Justification", h1_style))
    story.append(Paragraph(
        "<b>Relational SQL (MySQL 8.4):</b> Core business entities require strict ACID compliance, referential integrity, and row-level concurrency protection. Tables for users, vehicles, routes, rides, bookings, and payments require exact foreign key enforcement (<code>ON DELETE CASCADE</code>) to prevent data anomalies.<br/>"
        "<b>Document NoSQL (MongoDB):</b> Moving carpool vehicles generate frequent GPS breadcrumbs, speed metrics, and in-transit messaging. Writing this high-velocity time-series stream into relational tables would cause excessive lock contention. MongoDB handles schema-free telemetry appends efficiently and powers a MongoDB Aggregation Pipeline (<code>$group</code>, <code>$avg</code>, <code>$sort</code>).",
        body_style
    ))

    # 4. ER Modeling (10 Entities in 3NF)
    story.append(Paragraph("4. Entity-Relationship (ER) Modeling (10 Entities in 3NF)", h1_style))
    story.append(Paragraph(
        "The relational database schema is normalized up to <b>Third Normal Form (3NF)</b> and contains 10 base tables (exceeding the course requirement of 5):<br/>"
        "1. <b>USERS:</b> Core entity storing validated SRN/PRN, @pes.edu email, role, campus, department, phone, and emergency contact.<br/>"
        "2. <b>DRIVERS:</b> 1:1 user specialization tracking license numbers, expiry dates, verified status, and lifetime ratings.<br/>"
        "3. <b>PASSENGERS:</b> 1:1 user specialization tracking default pickup points, lifetime rides, and prepaid PESU Wallet balances.<br/>"
        "4. <b>VEHICLES:</b> 1:N with drivers, storing vehicle make, model, registration plate, fuel type, and seating capacity.<br/>"
        "5. <b>ROUTES:</b> University transit corridors with origin, destination, intermediate pickup points JSON, distance in km, and base fare.<br/>"
        "6. <b>RIDES:</b> Scheduled carpool trips linked to driver, vehicle, and route, tracking date, departure time, and available seats.<br/>"
        "7. <b>BOOKINGS:</b> Confirmed seat reservations with boarding checkpoints and cryptographic QR verification tokens.<br/>"
        "8. <b>PAYMENTS:</b> 1:1 with bookings, tracking payment method (PESU_WALLET, UPI, CASH), amount, and transaction references.<br/>"
        "9. <b>RATINGS:</b> Two-way rating matrix capturing star scores, punctuality, and driving safety feedback.<br/>"
        "10. <b>CANCELLATIONS:</b> Audit ledger tracking cancellations, penalty fees, and automated passenger wallet refunds.",
        body_style
    ))

    # 5. Advanced Database Features
    story.append(Paragraph("5. Advanced Database Concepts Demonstrated (6 Features)", h1_style))
    story.append(Paragraph("• <b>ACID Transactions (sp_book_ride):</b> Uses <code>START TRANSACTION</code>, <code>SELECT ... FOR UPDATE</code>, and <code>ROLLBACK</code> handlers to eliminate double-booking.", bullet_style))
    story.append(Paragraph("• <b>Database Views:</b> <code>vw_available_rides</code>, <code>vw_driver_performance</code>, <code>vw_route_metrics</code>, and <code>vw_user_carbon_savings</code>.", bullet_style))
    story.append(Paragraph("• <b>Database Triggers:</b> 5 active triggers enforcing self-booking prevention, overbooking capacity checks, seat decrements, cancellation refunds, and dynamic rating recalculations.", bullet_style))
    story.append(Paragraph("• <b>Stored Procedures:</b> Modular encapsulated routines: <code>sp_book_ride</code>, <code>sp_cancel_booking</code>, and <code>sp_generate_campus_report</code>.", bullet_style))
    story.append(Paragraph("• <b>Composite B-Tree Indexing:</b> Indexes on <code>(travel_date, status, departure_time)</code> and <code>(origin_campus, destination_campus)</code>.", bullet_style))
    story.append(Paragraph("• <b>NoSQL Aggregation Pipeline:</b> Live MongoDB aggregation calculating segment speed averages and traffic delays.", bullet_style))

    # 6. Important Queries & Reports
    story.append(Paragraph("6. Key Analytical Queries & Demonstration Reports", h1_style))
    story.append(Paragraph(
        "<b>1. Department Mobility & Financial Savings:</b> Multi-table join across users, passengers, bookings, rides, and routes grouped by department. Computes actual expenses vs commercial cabs (₹22/km benchmark) and CO2 avoided (0.171 kg/km).<br/>"
        "<i>Results:</i> ECE saved ₹1,080.40 (10.8 kg CO2); AIML saved ₹898.00 (8.4 kg CO2); Mechanical saved ₹652.20 (6.9 kg CO2).<br/>"
        "<b>2. Route Occupancy & Revenue:</b> Multi-table join with <code>HAVING COUNT(b.booking_id) > 0</code> evaluating route loads.<br/>"
        "<b>3. Peak Commute Departure Hours:</b> SQL date/time extraction <code>HOUR(r.departure_time)</code> showing 08:00-09:00 AM as peak volume window.<br/>"
        "<b>4. Driver Safety Leaderboard:</b> Multi-join filtering drivers with <code>HAVING overall_avg_rating >= 4.50</code>.<br/>"
        "<b>5. Nested Subquery:</b> Filters drivers whose total earnings exceed the campus average earnings using nested aggregate subqueries.",
        body_style
    ))

    # 7. Testing Results & Verification
    story.append(Paragraph("7. Testing Results & Integrity Verification", h1_style))
    test_data = [
        [Paragraph("Test ID", table_hdr), Paragraph("Test Case Scenario", table_hdr), Paragraph("Expected System Behavior", table_hdr), Paragraph("Observed Status", table_hdr)],
        [Paragraph("TC-01", table_cell), Paragraph("Atomic Seat Reservation via sp_book_ride", table_cell), Paragraph("Deduct wallet, lock row, create pass, decrement seats", table_cell), Paragraph("<b>PASS</b>", table_cell)],
        [Paragraph("TC-02", table_cell), Paragraph("Driver Self-Booking Prevention Trigger", table_cell), Paragraph("Abort insertion: Driver cannot book own ride", table_cell), Paragraph("<b>PASS</b>", table_cell)],
        [Paragraph("TC-03", table_cell), Paragraph("Overbooking Prevention Trigger", table_cell), Paragraph("Abort transaction: Insufficient seats remaining", table_cell), Paragraph("<b>PASS</b>", table_cell)],
        [Paragraph("TC-04", table_cell), Paragraph("Cancellation & 90% Wallet Refund", table_cell), Paragraph("Restore seats, deduct 10% fee, refund wallet", table_cell), Paragraph("<b>PASS</b>", table_cell)],
        [Paragraph("TC-05", table_cell), Paragraph("NoSQL Real-Time Telemetry Stream", table_cell), Paragraph("Append GPS coordinates to MongoDB without locks", table_cell), Paragraph("<b>PASS</b>", table_cell)]
    ]
    t_test = Table(test_data, colWidths=[0.8*inch, 2.4*inch, 3.1*inch, 0.9*inch])
    t_test.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0A2540')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#0A2540')),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#F8FAFC')),
        ('BACKGROUND', (0,2), (-1,2), colors.HexColor('#FFFFFF')),
        ('BACKGROUND', (0,3), (-1,3), colors.HexColor('#F8FAFC')),
        ('BACKGROUND', (0,4), (-1,4), colors.HexColor('#FFFFFF')),
        ('BACKGROUND', (0,5), (-1,5), colors.HexColor('#F8FAFC')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_test)
    story.append(Spacer(1, 14))

    # 8. Conclusion
    story.append(Paragraph("8. Conclusion", h1_style))
    story.append(Paragraph(
        "PESUPool successfully applies core database concepts—including relational ER design, 3NF normalization, ACID transaction processing, database triggers, views, and NoSQL telemetry streams—to solve an acute daily commuter problem for PES University. The platform provides a scalable foundation for campus carpooling while demonstrating rigorous database engineering principles.",
        body_style
    ))

    doc.build(story)
    print("PDF generated successfully:", pdf_path)

if __name__ == '__main__':
    generate_pdf()
