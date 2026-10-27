import db from './db';

export function seedDatabase() {
  const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
  if (userCount > 0) {
    return; // Already seeded
  }

  // Seed Users
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?)
  `);
  insertUser.run('Priscilla Lily', 'admin@iaacademy.com', 'admin123', 'admin', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150');
  insertUser.run('Sarah Jenkins', 's.jenkins@iaacademy.com', 'teacher123', 'teacher', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150');
  insertUser.run('Evalyn Harper', 'evalyn@student.com', 'student123', 'student', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');

  // Seed Students (including Star Students from UI screenshot)
  const insertStudent = db.prepare(`
    INSERT INTO students (student_id, name, gender, class_name, section, parent_name, phone, email, marks, percent, year, star_student, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const students = [
    { id: 'PRE43178', name: 'Evalyn Harper', gender: 'Female', class: 'Class 10', parent: 'Robert Harper', phone: '+1 234-567-8901', email: 'evalyn@student.com', marks: 1185, percent: 98, year: 2014, star: 1, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { id: 'PRE43174', name: 'Diana Plenty', gender: 'Female', class: 'Class 10', parent: 'George Plenty', phone: '+1 234-567-8902', email: 'diana@student.com', marks: 1165, percent: 91, year: 2014, star: 1, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
    { id: 'PRE43187', name: 'John Millar', gender: 'Male', class: 'Class 10', parent: 'Arthur Millar', phone: '+1 234-567-8903', email: 'john@student.com', marks: 1175, percent: 92, year: 2014, star: 1, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
    { id: 'PRE2209', name: 'Aadesh Gupta', gender: 'Male', class: 'Class 9', parent: 'Sanjay Gupta', phone: '+1 234-567-8904', email: 'aadesh@student.com', marks: 1050, percent: 84, year: 2024, star: 0, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { id: 'PRE2211', name: 'Sofia Rodriguez', gender: 'Female', class: 'Class 11', parent: 'Carlos Rodriguez', phone: '+1 234-567-8905', email: 'sofia@student.com', marks: 1120, percent: 89, year: 2024, star: 0, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { id: 'PRE2215', name: 'Liam Chen', gender: 'Male', class: 'Class 12', parent: 'Wei Chen', phone: '+1 234-567-8906', email: 'liam@student.com', marks: 1140, percent: 90, year: 2024, star: 0, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  ];

  students.forEach(s => {
    insertStudent.run(s.id, s.name, s.gender, s.class, 'A', s.parent, s.phone, s.email, s.marks, s.percent, s.year, s.star, s.avatar);
  });

  // Seed Teachers
  const insertTeacher = db.prepare(`
    INSERT INTO teachers (teacher_id, name, gender, subject, email, phone, avatar, joining_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const teachers = [
    { id: 'TCH101', name: 'Sarah Jenkins', gender: 'Female', subject: 'Mathematics', email: 's.jenkins@iaacademy.com', phone: '+1 555-0101', joining_date: '2020-08-15' },
    { id: 'TCH102', name: 'Michael Vance', gender: 'Male', subject: 'Physics', email: 'm.vance@iaacademy.com', phone: '+1 555-0102', joining_date: '2019-03-10' },
    { id: 'TCH103', name: 'Elena Rostova', gender: 'Female', subject: 'English', email: 'e.rostova@iaacademy.com', phone: '+1 555-0103', joining_date: '2021-01-20' },
  ];

  teachers.forEach(t => {
    insertTeacher.run(t.id, t.name, t.gender, t.subject, t.email, t.phone, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', t.joining_date);
  });

  // Seed Exam Results
  const insertExam = db.prepare(`
    INSERT INTO exam_results (student_id, subject, marks, max_marks, grade, term, year)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertExam.run('PRE43178', 'Mathematics', 98, 100, 'A+', 'Mid-Term', 2024);
  insertExam.run('PRE43178', 'Science', 96, 100, 'A+', 'Mid-Term', 2024);
  insertExam.run('PRE43174', 'Mathematics', 90, 100, 'A', 'Mid-Term', 2024);
  insertExam.run('PRE43187', 'Mathematics', 92, 100, 'A', 'Mid-Term', 2024);

  // Seed Attendance
  const insertAttendance = db.prepare(`
    INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)
  `);
  const today = new Date().toISOString().split('T')[0];
  insertAttendance.run('PRE43178', today, 'Present');
  insertAttendance.run('PRE43174', today, 'Present');
  insertAttendance.run('PRE43187', today, 'Present');
  insertAttendance.run('PRE2209', today, 'Absent');

  // Seed Notices
  const insertNotice = db.prepare(`
    INSERT INTO notices (title, category, date, content) VALUES (?, ?, ?, ?)
  `);
  insertNotice.run('New Teacher Announcement', 'Notice', 'Just now', 'It is a long established readable content for faculty orientation.');
  insertNotice.run('Fees Structure Released', 'Fee', 'Today', 'Annual fee schedules and term dates updated for 2024.');
  insertNotice.run('New Course Syllabus', 'Academic', '24 Sep 2023', 'Computer Science and AI foundational course syllabus updated.');
}

seedDatabase();
