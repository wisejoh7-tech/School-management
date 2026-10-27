import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    seedDatabase();
    const classes = db.prepare('SELECT * FROM classes ORDER BY class_name ASC').all();
    const subjects = db.prepare('SELECT * FROM subjects ORDER BY id DESC').all();
    const teachers = db.prepare('SELECT name, subject FROM teachers').all();

    return NextResponse.json({ classes, subjects, teachers });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, class_name, section, teacher_name, room_number, subject_code, name } = body;

    if (type === 'class') {
      if (!class_name) {
        return NextResponse.json({ error: 'Class name is required.' }, { status: 400 });
      }
      const stmt = db.prepare(`
        INSERT INTO classes (class_name, section, teacher_name, room_number, student_count)
        VALUES (?, ?, ?, ?, ?)
      `);
      stmt.run(class_name, section || 'A', teacher_name || '', room_number || '', 0);
      return NextResponse.json({ success: true, type: 'class' });
    }

    if (type === 'subject') {
      if (!name || !class_name) {
        return NextResponse.json({ error: 'Subject name and class name are required.' }, { status: 400 });
      }
      const code = subject_code || `${name.substring(0, 4).toUpperCase()}${Math.floor(10 + Math.random() * 90)}`;
      const stmt = db.prepare(`
        INSERT INTO subjects (subject_code, name, class_name, teacher_name)
        VALUES (?, ?, ?, ?)
      `);
      stmt.run(code, name, class_name, teacher_name || '');
      return NextResponse.json({ success: true, type: 'subject' });
    }

    return NextResponse.json({ error: 'Invalid type provided.' }, { status: 400 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
