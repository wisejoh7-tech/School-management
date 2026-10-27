'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  GraduationCap,
  Users,
  UserCheck,
  DollarSign,
  MoreVertical,
  UserPlus,
  FileText,
  BookOpen,
  CheckSquare,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({ PRE43174: true });

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-purple-600 font-medium">
        Loading Admin Dashboard...
      </div>
    );
  }

  const { metrics, examResultsTrend, starStudents, notices } = data;

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const pieColors = ['#6B21A8', '#F97316']; // Male (Purple), Female (Orange)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Students */}
        <div className="bg-purple-50/60 p-5 rounded-2xl border border-purple-100/80 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Students</span>
            <div className="text-2xl font-bold text-gray-900 mt-1">{metrics.students}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-200/60 flex items-center justify-center text-purple-700">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Teachers */}
        <div className="bg-sky-50/60 p-5 rounded-2xl border border-sky-100/80 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Teachers</span>
            <div className="text-2xl font-bold text-gray-900 mt-1">{metrics.teachers}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-200/60 flex items-center justify-center text-sky-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Parents */}
        <div className="bg-orange-50/60 p-5 rounded-2xl border border-orange-100/80 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Parents</span>
            <div className="text-2xl font-bold text-gray-900 mt-1">{metrics.parents}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-200/60 flex items-center justify-center text-orange-600">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Earnings */}
        <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-100/80 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Earnings</span>
            <div className="text-2xl font-bold text-gray-900 mt-1">{metrics.earnings}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-200/60 flex items-center justify-center text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Middle Section: All Exam Result & Students Gender Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-800">All Exam Result</h2>
              <p className="text-xs text-gray-400">Students & Teacher</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-700"></span> Teacher
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Student
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={examResultsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <Tooltip />
                <Bar dataKey="Teacher" fill="#7C3AED" radius={[4, 4, 0, 0]} barSize={8} />
                <Bar dataKey="Student" fill="#F97316" radius={[4, 4, 0, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800">Students</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div className="relative h-48 my-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.genderDistribution}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {metrics.genderDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-gray-400 font-medium">Total</span>
              <span className="text-xl font-extrabold text-gray-900">15000</span>
            </div>
          </div>

          <div className="flex justify-center items-center gap-6 text-xs font-semibold text-gray-600">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-900"></span> Male
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-400"></span> Female
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Star Students & All Exam Results / Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Star Students Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800">Star Students</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-semibold">
                  <th className="py-3 px-2 w-8"></th>
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">ID</th>
                  <th className="py-3 px-2">Marks</th>
                  <th className="py-3 px-2">Percent</th>
                  <th className="py-3 px-2">Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {starStudents.map((student: any) => {
                  const isChecked = !!selectedRows[student.student_id];
                  return (
                    <tr key={student.student_id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-3 px-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleRow(student.student_id)}
                          className="rounded text-purple-600 focus:ring-purple-500 w-3.5 h-3.5 border-gray-300"
                        />
                      </td>
                      <td className="py-3 px-2 font-medium text-gray-800">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-7 h-7 rounded-full overflow-hidden bg-purple-100">
                            <Image src={student.avatar} alt={student.name} fill className="object-cover" />
                          </div>
                          <span>{student.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-gray-500 font-mono">{student.student_id}</td>
                      <td className="py-3 px-2 font-medium text-gray-700">{student.marks}</td>
                      <td className="py-3 px-2 font-semibold text-purple-700">{student.percent}%</td>
                      <td className="py-3 px-2 text-gray-500">{student.year}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notices & Activity Feed */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800">All Exam Results</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {notices.map((notice: any, idx: number) => {
                const icons = [UserPlus, FileText, BookOpen];
                const Icon = icons[idx % icons.length];
                const bgColors = ['bg-sky-50 text-sky-600', 'bg-rose-50 text-rose-500', 'bg-emerald-50 text-emerald-600'];

                return (
                  <div key={notice.id} className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl ${bgColors[idx % bgColors.length]} mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-800">{notice.title}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{notice.date}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{notice.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
