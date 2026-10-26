import { NextResponse } from 'next/server';
import { getRideTelemetry, insertTelemetry } from '@/lib/nosql';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rideId = searchParams.get('ride_id') || 1;
    const telemetry = await getRideTelemetry(rideId);
    return NextResponse.json({ success: true, data: telemetry });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const doc = {
      telemetry_id: `TLM-${Date.now()}`,
      ride_id: Number(body.ride_id) || 1,
      driver_id: Number(body.driver_id) || 1,
      timestamp: new Date().toISOString(),
      location: body.location || { type: "Point", coordinates: [77.5348, 12.9352] },
      speed_kmph: Number(body.speed_kmph) || 40,
      heading: Number(body.heading) || 120,
      current_segment: body.current_segment || 'Campus Link Road',
      next_stop: body.next_stop || 'Main Gate',
      estimated_delay_mins: Number(body.estimated_delay_mins) || 0,
      battery_fuel_level_pct: Number(body.battery_fuel_level_pct) || 80
    };
    const saved = await insertTelemetry(doc);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
