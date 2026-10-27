'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Award, Plus, FileSpreadsheet } from 'lucide-react';

interface ExamResult {
  id: number;
  student_id: string;
  student_name: string;
  subject: string;
  marks: number;
  max_marks: number;
  grade: string;
  term: string;
  year: number;
  avatar: string;
}

interface Student {
  student_id: string;
  name: string;
  class_name: string;
}

export default function ExamsPage() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [formData, setFormData] = useState({
    student_id: '',
    subject: 'Mathematics',
    marks: 85,
    max_marks: 100,
    term: 'Mid-Term',
    year: 2024,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resExams, resStudents] = await Promise.all([
        fetch('/api/exams'),
        fetch('/api/students'),
      ]);
      const examsData = await resExams.json();
      const studentsData = await resStudents.json();

      setResults(examsData.results || []);
      setStudents(studentsData.students || []);

      if (studentsData.students?.length > 0) {
        setFormData((prev) => ({
          ...prev,
          student_id: prev.student_id || studentsData.students[0].student_id,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddResult = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Examination & Marks</h1>
          <p className="text-xs text-gray-500 mt-0.5">Record and review student exam results</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Record New Score Form */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-gray-800">Record New Grade</h2>
          </div>

          <form onSubmit={handleAddResult} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Select Student *</label>
              <select
                value={formData.student_id}
                onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500/20"
              >
                {students.map((s) => (
                  <option key={s.student_id} value={s.student_id}>
                    {s.name} ({s.student_id}) - {s.class_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Subject *</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Physics">Physics</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Marks Obtained</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.marks}
                  onChange={(e) => setFormData({ ...formData, marks: Number(e.target.value) })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Max Marks</label>
                <input
                  type="number"
                  value={formData.max_marks}
                  onChange={(e) => setFormData({ ...formData, max_marks: Number(e.target.value) })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Examination Term</label>
              <select
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50"
              >
                <option value="Mid-Term">Mid-Term</option>
                <option value="Final-Term">Final-Term</option>
                <option value="Quarterly">Quarterly</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Save Score
            </button>
          </form>
        </div>

        {/* Existing Results Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileSpreadsheet className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-gray-800">Recent Exam Results</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-purple-600 font-medium">Loading examination records...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Student</th>
                    <th className="py-3 px-3">Subject</th>
                    <th className="py-3 px-3">Score</th>
                    <th className="py-3 px-3">Grade</th>
                    <th className="py-3 px-3">Term / Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {results.map((res) => (
                    <tr key={res.id} className="hover:bg-purple-50/20 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-7 h-7 rounded-full overflow-hidden bg-purple-100">
                            <Image src={res.avatar} alt={res.student_name} fill className="object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{res.student_name}</div>
                            <div className="text-[10px] text-gray-400">{res.student_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-gray-700">{res.subject}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-gray-900">{res.marks}</span> / {res.max_marks}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                          {res.grade}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-500">
                        {res.term} ({res.year})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
