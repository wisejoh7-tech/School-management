import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function POST(request: Request) {
  try {
    seedDatabase();
    const { email, password } = await request.json();

    const user = db.prepare('SELECT id, name, email, role, avatar FROM users WHERE email = ? AND password = ?').get(email, password);

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    seedDatabase();
    const users = db.prepare('SELECT id, name, email, role, avatar FROM users').all();
    return NextResponse.json({ users });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
