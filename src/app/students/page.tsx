'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Search, UserPlus, Filter, Trash2, X } from 'lucide-react';

interface Student {
  id: number;
  student_id: string;
  name: string;
  gender: string;
  class_name: string;
  section: string;
  parent_name: string;
  phone: string;
  email: string;
  marks: number;
  percent: number;
  avatar: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Female',
    class_name: 'Class 10',
    section: 'A',
    parent_name: '',
    phone: '',
    email: '',
    address: '',
    marks: 1000,
    percent: 85,
    star_student: false,
  });

  const fetchStudents = useCallback(() => {
    setLoading(true);
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (selectedClass) query.append('class', selectedClass);

    fetch(`/api/students?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students || []);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [search, selectedClass]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          name: '',
          gender: 'Female',
          class_name: 'Class 10',
          section: 'A',
          parent_name: '',
          phone: '',
          email: '',
          address: '',
          marks: 1000,
          percent: 85,
          star_student: false,
        });
        fetchStudents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this student record?')) return;
    try {
      const res = await fetch(`/api/students?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Students Directory</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage and view registered student records</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, or email..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Filter className="w-4 h-4" />
            <span>Class Filter:</span>
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            <option value="">All Classes</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
            <option value="Class 11">Class 11</option>
            <option value="Class 12">Class 12</option>
          </select>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-purple-600 font-medium">Loading records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Class</th>
                  <th className="py-3.5 px-4">Gender</th>
                  <th className="py-3.5 px-4">Parent / Contact</th>
                  <th className="py-3.5 px-4">Marks & %</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-purple-100">
                          <Image src={student.avatar} alt={student.name} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{student.name}</div>
                          <div className="text-[11px] text-gray-400">{student.email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-purple-700">{student.student_id}</td>
                    <td className="py-3.5 px-4 font-medium text-gray-700">
                      {student.class_name} ({student.section})
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{student.gender}</td>
                    <td className="py-3.5 px-4 text-gray-600">
                      <div>{student.parent_name || 'N/A'}</div>
                      <div className="text-[10px] text-gray-400">{student.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-800">{student.marks}</span>{' '}
                      <span className="text-purple-600 font-semibold">({student.percent}%)</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in duration-200">
            <div className="p-5 bg-purple-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Register New Student</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20"
                    placeholder="e.g. Evalyn Harper"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Class *</label>
                  <select
                    value={formData.class_name}
                    onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl"
                  >
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    value={formData.parent_name}
                    onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl"
                    placeholder="e.g. Robert Harper"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl"
                    placeholder="+1 234-567-8901"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Student Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl"
                    placeholder="student@domain.com"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="star"
                  checked={formData.star_student}
                  onChange={(e) => setFormData({ ...formData, star_student: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <label htmlFor="star" className="font-semibold text-gray-700 cursor-pointer">
                  Mark as Star Student
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-sm"
                >
                  Save Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
