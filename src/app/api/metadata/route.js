import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET() {
  try {
    const routes = await query(`SELECT * FROM routes WHERE is_active = TRUE;`);
    const vehicles = await query(`
      SELECT v.*, u.full_name AS driver_name 
      FROM vehicles v
      JOIN drivers d ON v.driver_id = d.driver_id
      JOIN users u ON d.driver_id = u.user_id
      WHERE v.is_active = TRUE;
    `);
    const users = await query(`SELECT * FROM users ORDER BY user_id ASC;`);

    return NextResponse.json({
      success: true,
      data: {
        routes,
        vehicles,
        users
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
