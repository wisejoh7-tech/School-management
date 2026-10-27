import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    seedDatabase();
    const teachers = db.prepare('SELECT * FROM teachers ORDER BY id DESC').all();
    return NextResponse.json({ teachers });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    seedDatabase();
    const body = await request.json();
    const { name, gender, subject, email, phone, joining_date } = body;

    if (!name || !subject || !email) {
      return NextResponse.json({ error: 'Name, subject, and email are required' }, { status: 400 });
    }

    const teacher_id = `TCH${Math.floor(100 + Math.random() * 900)}`;
    const avatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150';

    const stmt = db.prepare(`
      INSERT INTO teachers (teacher_id, name, gender, subject, email, phone, avatar, joining_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(teacher_id, name, gender || 'Female', subject, email, phone || null, avatar, joining_date || new Date().toISOString().split('T')[0]);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
