import { NextResponse } from 'next/server';
import { getRideChatLogs, insertChatMessage } from '@/lib/nosql';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rideId = searchParams.get('ride_id') || 1;
    const chats = await getRideChatLogs(rideId);
    return NextResponse.json({ success: true, data: chats });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const doc = {
      chat_id: `MSG-${Date.now()}`,
      ride_id: Number(body.ride_id) || 1,
      sender_id: Number(body.sender_id) || 2,
      sender_name: body.sender_name || 'Campus Commuter',
      sender_role: body.sender_role || 'PASSENGER',
      message: body.message || '',
      message_type: body.message_type || 'TEXT',
      timestamp: new Date().toISOString()
    };
    const saved = await insertChatMessage(doc);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
