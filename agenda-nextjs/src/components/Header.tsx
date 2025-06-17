
import React from 'react';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <header className="text-center my-8">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-500">
        AI Powered Agenda
      </h1>
      <p className="text-slate-400 mt-2 text-lg">Organize your day, the smart way.</p>
      <nav className="mt-4">
        <ul className="flex justify-center space-x-4 sm:space-x-6">
          <li><Link href="/" className="text-sky-500 hover:text-sky-300 transition-colors">All Tasks</Link></li>
          <li><Link href="/day" className="text-sky-500 hover:text-sky-300 transition-colors">Day View</Link></li>
          <li><Link href="/week" className="text-sky-500 hover:text-sky-300 transition-colors">Week View</Link></li>
          <li><Link href="/month" className="text-sky-500 hover:text-sky-300 transition-colors">Month View</Link></li>
        </ul>
      </nav>
    </header>
  );
};