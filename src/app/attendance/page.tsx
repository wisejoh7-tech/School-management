'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Calendar, Check, X, Clock } from 'lucide-react';

interface AttendanceRecord {
  student_id: string;
  student_name: string;
  class_name: string;
  avatar: string;
  status: string;
}

export default function AttendancePage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = useCallback(() => {
    setLoading(true);
    fetch(`/api/attendance?date=${date}`)
      .then((res) => res.json())
      .then((data) => {
        setRecords(data.records || []);
        setLoading(false);
      });
  }, [date]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const updateStatus = async (student_id: string, status: string) => {
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id, date, status }),
      });
      if (res.ok) {
        setRecords((prev) =>
          prev.map((r) => (r.student_id === student_id ? { ...r, status } : r))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Attendance Tracking</h1>
          <p className="text-xs text-gray-500 mt-0.5">Mark and monitor daily student attendance</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
          <Calendar className="w-4 h-4 text-purple-600" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-xs font-semibold text-gray-700 bg-transparent focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-purple-600 font-medium">Loading attendance data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Class</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Mark Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {records.map((record) => {
                  const currentStatus = record.status || 'Not Marked';
                  return (
                    <tr key={record.student_id} className="hover:bg-purple-50/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-purple-100">
                            <Image src={record.avatar} alt={record.student_name} fill className="object-cover" />
                          </div>
                          <span className="font-bold text-gray-900">{record.student_name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-purple-700 font-medium">{record.student_id}</td>
                      <td className="py-3.5 px-4 font-medium text-gray-700">{record.class_name}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            currentStatus === 'Present'
                              ? 'bg-emerald-100 text-emerald-800'
                              : currentStatus === 'Absent'
                              ? 'bg-rose-100 text-rose-800'
                              : currentStatus === 'Late'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {currentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => updateStatus(record.student_id, 'Present')}
                            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 font-semibold transition-all ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" /> Present
                          </button>
                          <button
                            onClick={() => updateStatus(record.student_id, 'Late')}
                            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 font-semibold transition-all ${
                              currentStatus === 'Late'
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-700'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" /> Late
                          </button>
                          <button
                            onClick={() => updateStatus(record.student_id, 'Absent')}
                            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 font-semibold transition-all ${
                              currentStatus === 'Absent'
                                ? 'bg-rose-600 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-700'
                            }`}
                          >
                            <X className="w-3.5 h-3.5" /> Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
