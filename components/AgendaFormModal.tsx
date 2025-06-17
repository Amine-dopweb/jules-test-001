
import React, { useState, useEffect } from 'react';
import { AgendaItem, ParsedAgendaInfo } from '../types';
import { CheckIcon, XMarkIcon } from './Icons';

interface AgendaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (itemData: Omit<AgendaItem, 'id' | 'isCompleted' | 'createdAt'>) => void;
  initialData?: Partial<AgendaItem> | Partial<ParsedAgendaInfo> | null;
  isEditing: boolean;
}

export const AgendaFormModal: React.FC<AgendaFormModalProps> = ({ isOpen, onClose, onSubmit, initialData, isEditing }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setDate(initialData.date || '');
      setTime(initialData.time || '');
    } else {
      // Reset form if no initial data (e.g., opening for new manual entry)
      setTitle('');
      setDescription('');
      setDate('');
      setTime('');
    }
    setFormError(null); // Clear errors when modal opens or data changes
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Title is required.');
      return;
    }
    onSubmit({ title, description, date, time });
    setFormError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg border border-slate-700 transform transition-all duration-300 ease-in-out scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-sky-400">{isEditing ? 'Edit Item' : 'Add New Item'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Title <span className="text-red-400">*</span></label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors text-slate-100 placeholder-slate-400"
              placeholder="e.g., Team Meeting"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors text-slate-100 placeholder-slate-400"
              placeholder="e.g., Discuss quarterly goals"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-300 mb-1">Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors text-slate-100"
                // Tailwind doesn't style date picker icon by default, this is browser specific.
                // Adding 'text-slate-100' might help if browser respects color scheme.
                style={{ colorScheme: 'dark' }} // Hint for browser styling of date picker
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-slate-300 mb-1">Time</label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors text-slate-100"
                style={{ colorScheme: 'dark' }} // Hint for browser styling of time picker
              />
            </div>
          </div>
          {formError && <p className="text-sm text-red-400 bg-red-900/50 p-2 rounded-md">{formError}</p>}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
            >
              <CheckIcon className="w-5 h-5 mr-2" />
              {isEditing ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
    