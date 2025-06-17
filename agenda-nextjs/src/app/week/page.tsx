"use client";
import React from 'react';
import { useAgenda } from '@/contexts/AgendaContext';
import { AgendaList } from '@/components/AgendaList';
import { AgendaItem } from '@/types';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/Icons';

// Helper to format date as YYYY-MM-DD
const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to get the start of the week (Sunday)
const getWeekStartDate = (date: Date): Date => {
  const newDate = new Date(date);
  const day = newDate.getDay(); // 0 (Sunday) - 6 (Saturday)
  const diff = newDate.getDate() - day;
  return new Date(newDate.setDate(diff));
};

// Helper to get the end of the week (Saturday)
const getWeekEndDate = (date: Date): Date => {
  const newDate = new Date(date);
  const day = newDate.getDay(); // 0 (Sunday) - 6 (Saturday)
  const diff = newDate.getDate() - day + 6;
  return new Date(newDate.setDate(diff));
};

// Helper to format a date range string
const formatWeekRange = (startDate: Date, endDate: Date): string => {
    const startMonth = startDate.toLocaleDateString(undefined, { month: 'long' });
    const endMonth = endDate.toLocaleDateString(undefined, { month: 'long' });
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const year = startDate.getFullYear(); // Assuming week is within the same year

    if (startMonth === endMonth) {
        return `${startMonth} ${startDay} - ${endDay}, ${year}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
};


export default function WeekViewPage() {
  const {
    sortedItems, // All items, presorted
    selectedDate,
    goToNextWeek,
    goToPreviousWeek,
    toggleCompleteItem,
    deleteItem,
    editItem
  } = useAgenda();

  const weekStartDate = getWeekStartDate(selectedDate);
  const weekEndDate = getWeekEndDate(selectedDate);

  const weekItems = sortedItems.filter(item => {
    if (!item.date) return false;
    // Item dates are YYYY-MM-DD strings. Convert to Date objects for comparison.
    // Normalize itemDate to UTC to avoid timezone issues with string parsing.
    const itemDateParts = item.date.split('-').map(Number);
    // Create date as local, then get UTC equivalent of that local date's components
    const itemLocalDate = new Date(itemDateParts[0], itemDateParts[1] - 1, itemDateParts[2]);
    const itemDate = new Date(Date.UTC(itemLocalDate.getFullYear(), itemLocalDate.getMonth(), itemLocalDate.getDate()));


    // Normalize week boundaries to UTC start of day for comparison
    const utcWeekStart = new Date(Date.UTC(weekStartDate.getFullYear(), weekStartDate.getMonth(), weekStartDate.getDate()));
    const utcWeekEnd = new Date(Date.UTC(weekEndDate.getFullYear(), weekEndDate.getMonth(), weekEndDate.getDate()));

    return itemDate >= utcWeekStart && itemDate <= utcWeekEnd;
  });

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700">
        <button
          onClick={goToPreviousWeek}
          className="p-2 rounded-md hover:bg-slate-700 transition-colors"
          aria-label="Previous Week"
        >
          <ChevronLeftIcon className="w-6 h-6 text-sky-400" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-center text-sky-400">
          {formatWeekRange(weekStartDate, weekEndDate)}
        </h1>
        <button
          onClick={goToNextWeek}
          className="p-2 rounded-md hover:bg-slate-700 transition-colors"
          aria-label="Next Week"
        >
          <ChevronRightIcon className="w-6 h-6 text-sky-400" />
        </button>
      </div>

      {weekItems.length > 0 ? (
        <AgendaList
          items={weekItems}
          onToggleComplete={toggleCompleteItem}
          onDeleteItem={deleteItem}
          onEditItem={editItem}
        />
      ) : (
        <p className="text-center text-slate-400 mt-10 text-lg">No agenda items for this week.</p>
      )}
    </div>
  );
}
