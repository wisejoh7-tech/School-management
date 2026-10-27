'use client';

import { useEffect, useState, useCallback } from 'react';
import { School, BookMarked, Plus, X, Users, DoorOpen, User } from 'lucide-react';

interface ClassItem {
  id: number;
  class_name: string;
  section: string;
  teacher_name: string;
  room_number: string;
  student_count: number;
}

interface SubjectItem {
  id: number;
  subject_code: string;
  name: string;
  class_name: string;
  teacher_name: string;
}

interface Teacher {
  name: string;
  subject: string;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  // Form States
  const [classForm, setClassForm] = useState({
    class_name: 'Class 9',
    section: 'A',
    teacher_name: '',
    room_number: 'Room 101',
  });

  const [subjectForm, setSubjectForm] = useState({
    subject_code: '',
    name: '',
    class_name: 'Class 10',
    teacher_name: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/classes');
      const data = await res.json();
      setClasses(data.classes || []);
      setSubjects(data.subjects || []);
      setTeachers(data.teachers || []);

      if (data.teachers?.length > 0) {
        setClassForm((prev) => ({ ...prev, teacher_name: data.teachers[0].name }));
        setSubjectForm((prev) => ({ ...prev, teacher_name: data.teachers[0].name }));
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

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'class', ...classForm }),
      });
      if (res.ok) {
        setIsClassModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'subject', ...subjectForm }),
      });
      if (res.ok) {
        setIsSubjectModalOpen(false);
        setSubjectForm((prev) => ({ ...prev, name: '', subject_code: '' }));
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Class & Subject Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage academic sections, room allocations, and course subjects</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsClassModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class</span>
          </button>
          <button
            onClick={() => setIsSubjectModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-purple-600 font-medium bg-white rounded-2xl border border-gray-100">
          Loading academic structures...
        </div>
      ) : (
        <>
          {/* Classes Grid */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <School className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-bold text-gray-800">Classes & Sections</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-purple-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-purple-900">{cls.class_name}</span>
                      <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">
                        Section {cls.section}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-gray-600 mt-4">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>Teacher: <strong className="text-gray-800">{cls.teacher_name || 'Unassigned'}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DoorOpen className="w-3.5 h-3.5 text-gray-400" />
                        <span>Room: <strong className="text-gray-800">{cls.room_number || 'N/A'}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span>Capacity: <strong className="text-gray-800">{cls.student_count} Students</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subjects Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookMarked className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-bold text-gray-800">Subjects Directory</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Subject Code</th>
                    <th className="py-3 px-4">Subject Name</th>
                    <th className="py-3 px-4">Assigned Class</th>
                    <th className="py-3 px-4">Assigned Teacher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {subjects.map((sub) => (
                    <tr key={sub.id} className="hover:bg-purple-50/20 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-purple-700">{sub.subject_code}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">{sub.name}</td>
                      <td className="py-3.5 px-4 font-medium text-gray-700">{sub.class_name}</td>
                      <td className="py-3.5 px-4 text-gray-600">{sub.teacher_name || 'Unassigned'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Add Class Modal */}
      {isClassModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in duration-200">
            <div className="p-5 bg-purple-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Add New Class Section</h3>
              <button onClick={() => setIsClassModalOpen(false)} className="hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClass} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Class Name *</label>
                <input
                  type="text"
                  required
                  value={classForm.class_name}
                  onChange={(e) => setClassForm({ ...classForm, class_name: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl"
                  placeholder="e.g. Class 10"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Section</label>
                <input
                  type="text"
                  value={classForm.section}
                  onChange={(e) => setClassForm({ ...classForm, section: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl"
                  placeholder="e.g. A"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Assigned Teacher</label>
                <select
                  value={classForm.teacher_name}
                  onChange={(e) => setClassForm({ ...classForm, teacher_name: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name} ({t.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Room Number</label>
                <input
                  type="text"
                  value={classForm.room_number}
                  onChange={(e) => setClassForm({ ...classForm, room_number: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl"
                  placeholder="e.g. Room 102"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-sm"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in duration-200">
            <div className="p-5 bg-sky-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Add New Subject</h3>
              <button onClick={() => setIsSubjectModalOpen(false)} className="hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubject} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl"
                  placeholder="e.g. Computer Science"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Subject Code (Optional)</label>
                <input
                  type="text"
                  value={subjectForm.subject_code}
                  onChange={(e) => setSubjectForm({ ...subjectForm, subject_code: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl"
                  placeholder="e.g. CS101 (Auto-generated if blank)"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Assigned Class *</label>
                <select
                  value={subjectForm.class_name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, class_name: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50"
                >
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Assigned Teacher</label>
                <select
                  value={subjectForm.teacher_name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, teacher_name: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name} ({t.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-sm"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
