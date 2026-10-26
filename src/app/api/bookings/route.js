import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const passengerId = searchParams.get('passenger_id');

    let sql = `
      SELECT 
        b.booking_id,
        b.ride_id,
        b.passenger_id,
        b.seats_booked,
        b.pickup_stop,
        b.drop_stop,
        b.total_fare,
        b.booking_time,
        b.status AS booking_status,
        b.qr_code_token,
        r.travel_date,
        r.departure_time,
        ro.route_name,
        ro.origin_campus,
        ro.destination_campus,
        ro.distance_km,
        u_drv.full_name AS driver_name,
        u_drv.phone AS driver_phone,
        v.make,
        v.model,
        v.plate_number,
        p.payment_status,
        p.payment_method,
        p.transaction_reference,
        c.reason AS cancellation_reason,
        c.refund_amount
      FROM bookings b
      JOIN rides r ON b.ride_id = r.ride_id
      JOIN routes ro ON r.route_id = ro.route_id
      JOIN drivers d ON r.driver_id = d.driver_id
      JOIN users u_drv ON d.driver_id = u_drv.user_id
      JOIN vehicles v ON r.vehicle_id = v.vehicle_id
      LEFT JOIN payments p ON b.booking_id = p.booking_id
      LEFT JOIN cancellations c ON b.booking_id = c.booking_id
    `;
    const params = [];

    if (passengerId) {
      sql += ` WHERE b.passenger_id = ?`;
      params.push(Number(passengerId));
    }

    sql += ` ORDER BY b.booking_time DESC`;

    const bookings = await query(sql, params);
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error in GET /api/bookings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      ride_id,
      passenger_id,
      seats_booked = 1,
      pickup_stop,
      drop_stop,
      payment_method = 'PESU_WALLET'
    } = body;

    if (!ride_id || !passenger_id || !pickup_stop || !drop_stop) {
      return NextResponse.json({ success: false, error: 'Missing required booking parameters.' }, { status: 400 });
    }

    // Call Stored Procedure sp_book_ride
    const callSql = `
      CALL sp_book_ride(?, ?, ?, ?, ?, ?, @b_id, @msg);
    `;
    await query(callSql, [
      Number(ride_id),
      Number(passenger_id),
      Number(seats_booked),
      pickup_stop,
      drop_stop,
      payment_method
    ]);

    const result = await query(`SELECT @b_id AS booking_id, @msg AS message;`);
    const { booking_id, message } = result[0];

    if (!booking_id || booking_id === 0) {
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      booking_id,
      message
    });
  } catch (error) {
    console.error('Error in POST /api/bookings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
