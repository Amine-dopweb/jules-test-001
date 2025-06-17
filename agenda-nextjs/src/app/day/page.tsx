"use client";
import React from 'react';
import { useAgenda } from '@/contexts/AgendaContext';
import { AgendaList } from '@/components/AgendaList';
import { AgendaItem } from '@/types';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/Icons'; // Assuming these exist

// Helper to format date as YYYY-MM-DD
const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function DayViewPage() {
  const {
    sortedItems, // All items, presorted
    selectedDate,
    goToNextDay,
    goToPreviousDay,
    // CRUD functions for AgendaList if it needs them directly
    toggleCompleteItem,
    deleteItem,
    editItem
  } = useAgenda();

  const yyyymmddSelectedDate = formatDateToYYYYMMDD(selectedDate);

  const dayItems = sortedItems.filter(item => item.date === yyyymmddSelectedDate);

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700">
        <button
          onClick={goToPreviousDay}
          className="p-2 rounded-md hover:bg-slate-700 transition-colors"
          aria-label="Previous Day"
        >
          <ChevronLeftIcon className="w-6 h-6 text-sky-400" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-sky-400">
          {selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </h1>
        <button
          onClick={goToNextDay}
          className="p-2 rounded-md hover:bg-slate-700 transition-colors"
          aria-label="Next Day"
        >
          <ChevronRightIcon className="w-6 h-6 text-sky-400" />
        </button>
      </div>

      {dayItems.length > 0 ? (
        <AgendaList
          items={dayItems}
          onToggleComplete={toggleCompleteItem}
          onDeleteItem={deleteItem}
          onEditItem={editItem}
        />
      ) : (
        <p className="text-center text-slate-400 mt-10 text-lg">No agenda items for this day.</p>
      )}
    </div>
  );
}
