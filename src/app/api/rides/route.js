import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const date = searchParams.get('date');
    const seats = searchParams.get('seats');

    let sql = `SELECT * FROM vw_available_rides WHERE 1=1`;
    const params = [];

    if (origin) {
      sql += ` AND origin_campus LIKE ?`;
      params.push(`%${origin}%`);
    }
    if (destination) {
      sql += ` AND destination_campus LIKE ?`;
      params.push(`%${destination}%`);
    }
    if (date) {
      sql += ` AND travel_date = ?`;
      params.push(date);
    }
    if (seats) {
      sql += ` AND available_seats >= ?`;
      params.push(Number(seats));
    }

    sql += ` ORDER BY travel_date ASC, departure_time ASC`;

    const rides = await query(sql, params);
    return NextResponse.json({ success: true, data: rides });
  } catch (error) {
    console.error('Error in GET /api/rides:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      driver_id,
      vehicle_id,
      route_id,
      travel_date,
      departure_time,
      total_seats,
      price_per_seat,
      luggage_allowed = true,
      gender_preference = 'ANY',
      notes = ''
    } = body;

    if (!driver_id || !vehicle_id || !route_id || !travel_date || !departure_time || !total_seats || !price_per_seat) {
      return NextResponse.json({ success: false, error: 'Missing required ride parameters.' }, { status: 400 });
    }

    const sql = `
      INSERT INTO rides 
        (driver_id, vehicle_id, route_id, travel_date, departure_time, total_seats, available_seats, price_per_seat, luggage_allowed, gender_preference, status, notes)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SCHEDULED', ?)
    `;

    const result = await query(sql, [
      driver_id,
      vehicle_id,
      route_id,
      travel_date,
      departure_time,
      total_seats,
      total_seats, // initially available = total
      price_per_seat,
      luggage_allowed,
      gender_preference,
      notes
    ]);

    return NextResponse.json({
      success: true,
      message: 'Ride successfully offered and scheduled.',
      ride_id: result.insertId
    });
  } catch (error) {
    console.error('Error in POST /api/rides:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
