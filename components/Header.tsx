
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center my-8">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-500">
        AI Powered Agenda
      </h1>
      <p className="text-slate-400 mt-2 text-lg">Organize your day, the smart way.</p>
    </header>
  );
};
    