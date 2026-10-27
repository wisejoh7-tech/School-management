'use client';

import { useEffect, useState, useCallback } from 'react';
import { Bell, Plus, X, Calendar, Tag } from 'lucide-react';

interface Notice {
  id: number;
  title: string;
  category: string;
  date: string;
  content: string;
}

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Notice',
    content: '',
    date: new Date().toISOString().split('T')[0],
  });

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notices');
      const data = await res.json();
      setNotices(data.notices || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          title: '',
          category: 'Notice',
          content: '',
          date: new Date().toISOString().split('T')[0],
        });
        fetchNotices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'fee':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'academic':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'exam':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notice Board & Announcements</h1>
          <p className="text-xs text-gray-500 mt-0.5">Publish and review official school notices and alerts</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Notice</span>
        </button>
      </div>

      {/* Notices Feed */}
      {loading ? (
        <div className="p-8 text-center text-xs text-purple-600 font-medium bg-white rounded-2xl border border-gray-100">
          Loading notices...
        </div>
      ) : notices.length === 0 ? (
        <div className="p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
          <Bell className="w-10 h-10 mx-auto text-gray-300 mb-3" />
          <p className="text-sm font-semibold">No notices posted yet</p>
          <p className="text-xs text-gray-400 mt-1">Click above to post your first announcement.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryColor(notice.category)}`}>
                    {notice.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{notice.date}</span>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 text-sm mb-2">{notice.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{notice.content}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-purple-500" /> School Admin
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in duration-200">
            <div className="p-5 bg-purple-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Post New Notice</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:opacity-80">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20"
                  placeholder="e.g. Annual Sports Day Announcement"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50"
                  >
                    <option value="Notice">Notice</option>
                    <option value="Academic">Academic</option>
                    <option value="Fee">Fee</option>
                    <option value="Exam">Exam</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notice Content *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Write the full details of the notice..."
                />
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
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
