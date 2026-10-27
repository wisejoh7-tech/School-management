import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET(request: Request) {
  try {
    seedDatabase();
    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get('student_id');
    const subject = searchParams.get('subject');

    let query = `
      SELECT e.*, s.name as student_name, s.class_name, s.avatar
      FROM exam_results e
      JOIN students s ON e.student_id = s.student_id
      WHERE 1=1
    `;
    const params: string[] = [];

    if (student_id) {
      query += ' AND e.student_id = ?';
      params.push(student_id);
    }
    if (subject) {
      query += ' AND e.subject = ?';
      params.push(subject);
    }

    query += ' ORDER BY e.id DESC';

    const results = db.prepare(query).all(...params);
    return NextResponse.json({ results });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    seedDatabase();
    const body = await request.json();
    const { student_id, subject, marks, max_marks = 100, term = 'Mid-Term', year = 2024 } = body;

    if (!student_id || !subject || marks === undefined) {
      return NextResponse.json({ error: 'student_id, subject, and marks are required' }, { status: 400 });
    }

    let grade = 'F';
    const percent = (marks / max_marks) * 100;
    if (percent >= 90) grade = 'A+';
    else if (percent >= 80) grade = 'A';
    else if (percent >= 70) grade = 'B';
    else if (percent >= 60) grade = 'C';
    else if (percent >= 50) grade = 'D';

    const stmt = db.prepare(`
      INSERT INTO exam_results (student_id, subject, marks, max_marks, grade, term, year)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(student_id, subject, marks, max_marks, grade, term, year);

    // Update overall marks and percent on student
    const avgStats = db.prepare(`
      SELECT AVG(marks * 100.0 / max_marks) as avg_percent, SUM(marks) as total_marks
      FROM exam_results
      WHERE student_id = ?
    `).get(student_id) as { avg_percent: number; total_marks: number } | undefined;

    if (avgStats) {
      db.prepare(`
        UPDATE students
        SET marks = ?, percent = ?
        WHERE student_id = ?
      `).run(Math.round(avgStats.total_marks), Math.round(avgStats.avg_percent), student_id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
