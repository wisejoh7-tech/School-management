'use client';

import { Search, Bell, MessageSquare, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10 font-sans">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="What do you want to find?"
          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 bg-purple-600 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white"></span>
        </button>

        <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors">
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
          <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-purple-100">
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
              alt="Priscilla Lily"
              fill
              className="object-cover"
            />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-semibold text-gray-800 leading-tight">Priscilla Lily</div>
            <div className="text-xs text-gray-400 font-medium">Admin</div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 cursor-pointer" />
        </div>
      </div>
    </header>
  );
}
