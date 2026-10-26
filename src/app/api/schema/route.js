import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET() {
  try {
    // 1. Tables and row counts
    const tables = await query(`
      SELECT 
        TABLE_NAME, 
        TABLE_ROWS, 
        CREATE_TIME,
        TABLE_COMMENT
      FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = 'pesupool' AND TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME ASC;
    `);

    // 2. Views
    const views = await query(`
      SELECT TABLE_NAME, VIEW_DEFINITION
      FROM information_schema.VIEWS
      WHERE TABLE_SCHEMA = 'pesupool';
    `);

    // 3. Triggers
    const triggers = await query(`
      SELECT 
        TRIGGER_NAME, 
        EVENT_MANIPULATION, 
        EVENT_OBJECT_TABLE, 
        ACTION_TIMING, 
        ACTION_STATEMENT
      FROM information_schema.TRIGGERS
      WHERE TRIGGER_SCHEMA = 'pesupool';
    `);

    // 4. Stored Procedures & Functions
    const routines = await query(`
      SELECT 
        ROUTINE_NAME, 
        ROUTINE_TYPE, 
        DATA_TYPE, 
        ROUTINE_DEFINITION
      FROM information_schema.ROUTINES
      WHERE ROUTINE_SCHEMA = 'pesupool';
    `);

    // 5. Constraints & Foreign Keys
    const constraints = await query(`
      SELECT 
        CONSTRAINT_NAME, 
        TABLE_NAME, 
        COLUMN_NAME, 
        REFERENCED_TABLE_NAME, 
        REFERENCED_COLUMN_NAME
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = 'pesupool' AND REFERENCED_TABLE_NAME IS NOT NULL;
    `);

    return NextResponse.json({
      success: true,
      data: {
        tables,
        views,
        triggers,
        routines,
        constraints
      }
    });
  } catch (error) {
    console.error('Error in GET /api/schema:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
