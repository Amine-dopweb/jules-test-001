
import React from 'react';
import { AgendaItem } from '../types';
import { CalendarIcon, ClockIcon, TrashIcon, PencilIcon, CheckCircleIcon, CircleIcon } from './Icons';

interface AgendaItemCardProps {
  item: AgendaItem;
  onToggleComplete: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (item: AgendaItem) => void;
}

export const AgendaItemCard: React.FC<AgendaItemCardProps> = ({ item, onToggleComplete, onDeleteItem, onEditItem }) => {
  const cardClasses = `bg-slate-800 p-5 rounded-lg shadow-lg border border-slate-700 transition-all duration-300 ease-in-out hover:shadow-sky-500/30 ${item.isCompleted ? 'opacity-60' : 'opacity-100'}`;
  
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'No date';
    // Ensure dateString is treated as local timezone, not UTC for Date constructor
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (timeString: string): string => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className={cardClasses}>
      <div className="flex justify-between items-start">
        <h3 className={`text-2xl font-semibold mb-2 ${item.isCompleted ? 'line-through text-slate-500' : 'text-sky-400'}`}>
          {item.title}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onToggleComplete(item.id)}
            title={item.isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
            className="p-1.5 text-slate-400 hover:text-sky-400 transition-colors"
          >
            {item.isCompleted ? <CheckCircleIcon className="w-6 h-6 text-green-500" /> : <CircleIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {item.description && (
        <p className={`text-slate-300 mb-3 ${item.isCompleted ? 'line-through' : ''}`}>
          {item.description}
        </p>
      )}

      {(item.date || item.time) && (
        <div className="flex flex-wrap items-center text-sm text-slate-400 mb-4 space-x-4">
          {item.date && (
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1.5 text-sky-500" />
              <span>{formatDate(item.date)}</span>
            </div>
          )}
          {item.time && (
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1.5 text-sky-500" />
              <span>{formatTime(item.time)}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="border-t border-slate-700 pt-3 mt-3 flex justify-end space-x-3">
        <button
            onClick={() => onEditItem(item)}
            className="flex items-center text-sm text-yellow-400 hover:text-yellow-300 font-medium py-1 px-3 rounded transition-colors"
            title="Edit Item"
          >
            <PencilIcon className="w-4 h-4 mr-1" /> Edit
          </button>
        <button
            onClick={() => onDeleteItem(item.id)}
            className="flex items-center text-sm text-red-400 hover:text-red-300 font-medium py-1 px-3 rounded transition-colors"
            title="Delete Item"
          >
            <TrashIcon className="w-4 h-4 mr-1" /> Delete
          </button>
      </div>
    </div>
  );
};
    