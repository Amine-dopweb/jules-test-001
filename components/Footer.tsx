
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="text-center py-8 mt-12 text-slate-500">
      <p>&copy; {new Date().getFullYear()} AI Powered Agenda. All rights reserved.</p>
      <p className="text-sm">Powered by Gemini & React</p>
    </footer>
  );
};
    