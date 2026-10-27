import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET(request: Request) {
  try {
    seedDatabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const className = searchParams.get('class') || '';

    let query = 'SELECT * FROM students WHERE 1=1';
    const params: string[] = [];

    if (search) {
      query += ' AND (name LIKE ? OR student_id LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (className) {
      query += ' AND class_name = ?';
      params.push(className);
    }

    query += ' ORDER BY id DESC';

    const students = db.prepare(query).all(...params);
    return NextResponse.json({ students });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    seedDatabase();
    const body = await request.json();
    const {
      name,
      gender,
      class_name,
      section = 'A',
      dob,
      parent_name,
      phone,
      email,
      address,
      marks = 0,
      percent = 0,
      year = 2024,
      star_student = 0,
    } = body;

    if (!name || !gender || !class_name) {
      return NextResponse.json({ error: 'Name, gender, and class are required' }, { status: 400 });
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const student_id = `PRE${randomNum}`;
    const avatar = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`;

    const stmt = db.prepare(`
      INSERT INTO students (student_id, name, gender, class_name, section, dob, parent_name, phone, email, address, avatar, marks, percent, year, star_student)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      student_id,
      name,
      gender,
      class_name,
      section,
      dob || null,
      parent_name || null,
      phone || null,
      email || null,
      address || null,
      avatar,
      marks,
      percent,
      year,
      star_student ? 1 : 0
    );

    const newStudent = db.prepare('SELECT * FROM students WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json({ student: newStudent }, { status: 201 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Student ID or primary key is required' }, { status: 400 });
    }

    db.prepare('DELETE FROM students WHERE id = ? OR student_id = ?').run(id, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
