'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { UserPlus, Mail, Phone, Calendar, X } from 'lucide-react';

interface Teacher {
  id: number;
  teacher_id: string;
  name: string;
  subject: string;
  email: string;
  phone: string;
  joining_date: string;
  avatar: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    gender: 'Female',
    subject: 'Mathematics',
    email: '',
    phone: '',
    joining_date: new Date().toISOString().split('T')[0],
  });

  const fetchTeachers = () => {
    setLoading(true);
    fetch('/api/teachers')
      .then((res) => res.json())
      .then((data) => {
        setTeachers(data.teachers || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          name: '',
          gender: 'Female',
          subject: 'Mathematics',
          email: '',
          phone: '',
          joining_date: new Date().toISOString().split('T')[0],
        });
        fetchTeachers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Teachers & Staff</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage academic faculty and administrator profiles</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Teacher</span>
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-purple-600 font-medium bg-white rounded-2xl border border-gray-100">
          Loading faculty list...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-purple-100 ring-4 ring-purple-50 mb-3">
                <Image src={teacher.avatar} alt={teacher.name} fill className="object-cover" />
              </div>

              <h3 className="font-bold text-gray-900 text-base">{teacher.name}</h3>
              <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-bold text-[11px] mt-1">
                {teacher.subject}
              </span>

              <div className="w-full mt-5 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="truncate">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{teacher.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>Joined: {teacher.joining_date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in duration-200">
            <div className="p-5 bg-purple-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Add New Teacher Profile</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTeacher} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl"
                    placeholder="e.g. Dr. Sarah Jenkins"
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
                  <label className="block font-semibold text-gray-700 mb-1">Subject Specialization *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl"
                    placeholder="e.g. Mathematics"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl"
                    placeholder="teacher@iaacademy.com"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl"
                    placeholder="+1 555-0101"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={formData.joining_date}
                    onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl"
                  />
                </div>
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
                  Save Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
