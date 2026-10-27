import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ia Academy - School Management System',
  description: 'Comprehensive Student, Staff, Attendance & Exam Management Portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-purple-50/30 text-gray-800 antialiased min-h-screen flex`}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
