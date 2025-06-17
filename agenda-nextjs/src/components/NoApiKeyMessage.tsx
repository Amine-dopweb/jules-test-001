
import React from 'react';
import { AlertTriangleIcon } from './Icons';

export const NoApiKeyMessage: React.FC = () => {
  return (
    <div className="bg-yellow-700/30 border border-yellow-600 text-yellow-300 px-4 py-3 rounded-lg relative mb-6 flex items-start shadow-lg" role="alert">
      <AlertTriangleIcon className="w-6 h-6 mr-3 mt-0.5 text-yellow-400 flex-shrink-0" />
      <div>
        <strong className="font-bold block text-yellow-200">Gemini AI Features Disabled</strong>
        <span className="block sm:inline text-yellow-300">
          The Gemini API key is not configured in this environment. 
          Smart Add and other AI-powered features are unavailable. You can still add agenda items manually.
        </span>
      </div>
    </div>
  );
};
    