"use client";
import React from 'react';
import { useAgenda } from '@/contexts/AgendaContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SmartAddInput } from '@/components/SmartAddInput';
import { AgendaList } from '@/components/AgendaList';
import { AgendaFormModal } from '@/components/AgendaFormModal';
import { NoApiKeyMessage } from '@/components/NoApiKeyMessage';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AddIcon, BroomIcon } from '@/components/Icons';

export default function HomePage() {
  const {
    sortedItems,
    isLoading,
    error,
    isModalOpen,
    editingItem,
    initialModalData,
    isGeminiAvailable,
    toggleCompleteItem,
    deleteItem,
    editItem,
    clearCompletedItems,
    handleSmartAdd,
    openModalWithItem,
    closeModal,
    saveItem
  } = useAgenda();

  return (
    <div className="flex flex-col w-full flex-grow items-center p-4 selection:bg-sky-500 selection:text-white">
      {/* Header and Footer are now in RootLayout as per subtask description.
          The div className "min-h-screen flex flex-col items-center p-4 selection:bg-sky-500 selection:text-white"
          was mostly moved to RootLayout. Retaining "flex flex-col w-full flex-grow items-center p-4 selection:bg-sky-500 selection:text-white"
          for page-specific centering and padding if needed, though "items-center" might be redundant if RootLayout's main content area handles it.
      */}
      <main className="container mx-auto max-w-3xl w-full mt-8 flex-grow">
        {!isGeminiAvailable && <NoApiKeyMessage />}

        {isGeminiAvailable && (
          <SmartAddInput onSmartAdd={handleSmartAdd} isLoading={isLoading && !isModalOpen} />
        )}

        {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md my-4 text-sm">{error}</p>}
        {isLoading && !isModalOpen && (
            <div className="flex justify-center my-4 items-center">
                <LoadingSpinner /> <span className="ml-2 text-slate-300">AI is thinking...</span>
            </div>
        )}

        <div className="my-6 flex justify-between items-center">
          <button
            onClick={() => openModalWithItem()}
            className="flex items-center bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
          >
            <AddIcon className="w-5 h-5 mr-2" />
            Add Manually
          </button>
          {sortedItems.some(item => item.isCompleted) && (
             <button
                onClick={clearCompletedItems}
                className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            >
                <BroomIcon className="w-5 h-5 mr-2" />
                Clear Completed
            </button>
          )}
        </div>

        <AgendaList
          items={sortedItems}
          onToggleComplete={toggleCompleteItem}
          onDeleteItem={deleteItem}
          onEditItem={editItem}
        />
        {sortedItems.length === 0 && !isLoading && (
            <p className="text-center text-slate-400 mt-10 text-lg">Your agenda is empty. Add some items!</p>
        )}
      </main>
      <AgendaFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={saveItem}
        initialData={editingItem || initialModalData}
        isEditing={!!editingItem}
      />
    </div>
  );
}
