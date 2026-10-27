'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  GraduationCap,
  Users,
  BookOpen,
  UserCheck,
  School,
  BookMarked,
  Calendar,
  ClipboardCheck,
  FileSpreadsheet,
  Bell,
  Bus,
  Building,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  {
    name: 'Home',
    icon: Home,
    path: '/',
    subItems: [
      { name: 'Admin', path: '/' },
      { name: 'Students', path: '/students' },
      { name: 'Teachers', path: '/teachers' },
    ],
  },
  { name: 'Students', icon: GraduationCap, path: '/students' },
  { name: 'Teachers', icon: Users, path: '/teachers' },
  { name: 'Library', icon: BookOpen, path: '#' },
  { name: 'Account', icon: UserCheck, path: '#' },
  { name: 'Class', icon: School, path: '/classes' },
  { name: 'Subject', icon: BookMarked, path: '/classes' },
  { name: 'Routine', icon: Calendar, path: '#' },
  { name: 'Attendance', icon: ClipboardCheck, path: '/attendance' },
  { name: 'Exam', icon: FileSpreadsheet, path: '/exams' },
  { name: 'Notice', icon: Bell, path: '/notice' },
  { name: 'Transport', icon: Bus, path: '#' },
  { name: 'Hostel', icon: Building, path: '#' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [homeOpen, setHomeOpen] = useState(true);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col font-sans">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-purple-200">
          ia
        </div>
        <span className="text-xl font-bold text-purple-900 tracking-tight">ia Academy</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1 text-sm font-medium text-gray-600">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          if (item.subItems) {
            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => setHomeOpen(!homeOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                    isActive ? 'bg-purple-50 text-purple-700' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">{item.name}</span>
                  </div>
                  {homeOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {homeOpen && (
                  <div className="pl-9 space-y-1">
                    {item.subItems.map((sub) => {
                      const isSubActive = pathname === sub.path;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.path}
                          className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                            isSubActive
                              ? 'bg-purple-100 text-purple-800 font-bold'
                              : 'text-gray-500 hover:text-purple-700 hover:bg-gray-50'
                          }`}
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-purple-600 text-white font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-purple-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
