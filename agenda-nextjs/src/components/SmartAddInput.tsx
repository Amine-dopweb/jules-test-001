
import React, { useState } from 'react';
import { SparklesIcon } from './Icons'; // Assuming SparklesIcon is similar to an AI icon

interface SmartAddInputProps {
  onSmartAdd: (text: string) => void;
  isLoading: boolean;
}

export const SmartAddInput: React.FC<SmartAddInputProps> = ({ onSmartAdd, isLoading }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSmartAdd(inputText.trim());
      setInputText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-800 rounded-lg shadow-xl">
      <label htmlFor="smart-add" className="block text-sm font-medium text-sky-300 mb-1">
        Smart Add (e.g., "Meeting with team tomorrow 10am about project alpha")
      </label>
      <div className="flex items-center space-x-2">
        <input
          id="smart-add"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Describe your event or task..."
          className="flex-grow p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors text-slate-100 placeholder-slate-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="flex items-center bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-4 rounded-md shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          <SparklesIcon className="w-5 h-5 mr-2"/>
          {isLoading ? 'Parsing...' : 'Add with AI'}
        </button>
      </div>
    </form>
  );
};
    