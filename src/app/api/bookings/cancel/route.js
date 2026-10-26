import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function POST(request) {
  try {
    const body = await request.json();
    const { booking_id, reason = 'Change of travel plans', cancelled_by = 'PASSENGER' } = body;

    if (!booking_id) {
      return NextResponse.json({ success: false, error: 'Booking ID is required.' }, { status: 400 });
    }

    const callSql = `
      CALL sp_cancel_booking(?, ?, ?, @refund, @msg);
    `;
    await query(callSql, [Number(booking_id), reason, cancelled_by]);

    const result = await query(`SELECT @refund AS refund_amount, @msg AS message;`);
    const { refund_amount, message } = result[0];

    if (!message.startsWith('SUCCESS')) {
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      refund_amount,
      message
    });
  } catch (error) {
    console.error('Error in POST /api/bookings/cancel:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
