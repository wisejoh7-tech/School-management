import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET(request: Request) {
  try {
    seedDatabase();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const className = searchParams.get('class');

    let query = `
      SELECT a.*, s.name as student_name, s.class_name, s.avatar
      FROM students s
      LEFT JOIN attendance a ON s.student_id = a.student_id AND a.date = ?
    `;
    const params: (string | number)[] = [date];

    if (className) {
      query += ' WHERE s.class_name = ?';
      params.push(className);
    }

    const attendanceRecords = db.prepare(query).all(...params);
    return NextResponse.json({ date, records: attendanceRecords });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    seedDatabase();
    const body = await request.json();
    const { student_id, date, status } = body;

    if (!student_id || !date || !status) {
      return NextResponse.json({ error: 'student_id, date, and status are required' }, { status: 400 });
    }

    const stmt = db.prepare(`
      INSERT INTO attendance (student_id, date, status)
      VALUES (?, ?, ?)
      ON CONFLICT(student_id, date) DO UPDATE SET status=excluded.status
    `);

    stmt.run(student_id, date, status);
    return NextResponse.json({ success: true, student_id, date, status });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
