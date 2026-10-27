import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const notices = db.prepare('SELECT * FROM notices ORDER BY id DESC').all();
    return NextResponse.json({ notices });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, content, date } = body;

    if (!title || !category || !content) {
      return NextResponse.json({ error: 'Title, category, and content are required.' }, { status: 400 });
    }

    const noticeDate = date || new Date().toISOString().split('T')[0];

    const stmt = db.prepare(`
      INSERT INTO notices (title, category, date, content)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(title, category, noticeDate, content);

    return NextResponse.json({
      success: true,
      notice: {
        id: result.lastInsertRowid,
        title,
        category,
        date: noticeDate,
        content,
      },
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
