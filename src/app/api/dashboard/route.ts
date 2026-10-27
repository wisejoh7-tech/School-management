import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    seedDatabase();

    const starStudents = db.prepare('SELECT * FROM students WHERE star_student = 1 ORDER BY percent DESC LIMIT 5').all();
    const notices = db.prepare('SELECT * FROM notices ORDER BY id DESC LIMIT 5').all();

    // Stats calculations
    const studentCount = db.prepare('SELECT COUNT(*) as count FROM students').get() as { count: number };
    const teacherCount = db.prepare('SELECT COUNT(*) as count FROM teachers').get() as { count: number };
    const maleCount = db.prepare("SELECT COUNT(*) as count FROM students WHERE gender = 'Male'").get() as { count: number };
    const femaleCount = db.prepare("SELECT COUNT(*) as count FROM students WHERE gender = 'Female'").get() as { count: number };

    const examResultsTrend = [
      { month: 'Jan', Teacher: 40, Student: 60 },
      { month: 'Feb', Teacher: 30, Student: 40 },
      { month: 'Mar', Teacher: 45, Student: 55 },
      { month: 'Apr', Teacher: 60, Student: 80 },
      { month: 'May', Teacher: 85, Student: 110 },
      { month: 'Jun', Teacher: 40, Student: 50 },
      { month: 'Jul', Teacher: 30, Student: 45 },
      { month: 'Aug', Teacher: 50, Student: 70 },
      { month: 'Sep', Teacher: 75, Student: 95 },
      { month: 'Oct', Teacher: 60, Student: 75 },
      { month: 'Nov', Teacher: 80, Student: 100 },
      { month: 'Dec', Teacher: 50, Student: 65 },
    ];

    return NextResponse.json({
      metrics: {
        students: '15.00K',
        teachers: '2.00K',
        parents: '5.6K',
        earnings: '$19.3K',
        rawStudentCount: studentCount.count,
        rawTeacherCount: teacherCount.count,
        genderDistribution: [
          { name: 'Male', value: maleCount.count || 8500 },
          { name: 'Female', value: femaleCount.count || 6500 },
        ],
      },
      examResultsTrend,
      starStudents,
      notices,
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
