"use client";
import React from 'react';
import { useAgenda } from '@/contexts/AgendaContext';
import { AgendaList } from '@/components/AgendaList';
import { AgendaItem } from '@/types';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/Icons';

// Helper to format date as YYYY-MM string for month comparison
const formatDateToYYYYMM = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
};

// Helper to format month and year string for display
const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
};

export default function MonthViewPage() {
  const {
    sortedItems, // All items, presorted
    selectedDate,
    goToNextMonth,
    goToPreviousMonth,
    toggleCompleteItem,
    deleteItem,
    editItem
  } = useAgenda();

  const yyyymmSelectedMonth = formatDateToYYYYMM(selectedDate);

  const monthItems = sortedItems.filter(item => {
    if (!item.date) return false;
    // Item dates are YYYY-MM-DD strings. Check if item.date starts with yyyymmSelectedMonth
    return item.date.startsWith(yyyymmSelectedMonth);
  });

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-md hover:bg-slate-700 transition-colors"
          aria-label="Previous Month"
        >
          <ChevronLeftIcon className="w-6 h-6 text-sky-400" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-sky-400">
          {formatMonthYear(selectedDate)}
        </h1>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-md hover:bg-slate-700 transition-colors"
          aria-label="Next Month"
        >
          <ChevronRightIcon className="w-6 h-6 text-sky-400" />
        </button>
      </div>

      {monthItems.length > 0 ? (
        <AgendaList
          items={monthItems} // These are already sorted by date/time by sortedItems
          onToggleComplete={toggleCompleteItem}
          onDeleteItem={deleteItem}
          onEditItem={editItem}
        />
      ) : (
        <p className="text-center text-slate-400 mt-10 text-lg">No agenda items for this month.</p>
      )}
    </div>
  );
}
