
import React, { useState, useEffect, useCallback } from 'react';
import { AgendaItem, ParsedAgendaInfo } from './types';
import { LOCAL_STORAGE_KEY } from './constants';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SmartAddInput } from './components/SmartAddInput';
import { AgendaList } from './components/AgendaList';
import { AgendaFormModal } from './components/AgendaFormModal';
import { NoApiKeyMessage } from './components/NoApiKeyMessage'; // Ensured relative path
import { LoadingSpinner_ } from './components/LoadingSpinner';
import { parseNaturalLanguageForAgenda, isGeminiAvailable as checkGeminiServiceAvailability } from './services/geminiService';
import { AddIcon, BroomIcon } from './components/Icons';

// Simple UUID generator
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const App: React.FC = () => {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);
  const [initialModalData, setInitialModalData] = useState<Partial<ParsedAgendaInfo> | null>(null);
  const [isGeminiAvailable, setIsGeminiAvailable] = useState<boolean>(false);

  useEffect(() => {
    setIsGeminiAvailable(checkGeminiServiceAvailability());
    try {
      const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedItems) {
        setAgendaItems(JSON.parse(storedItems));
      }
    } catch (e) {
      console.error("Failed to load items from localStorage", e);
      setError("Could not load saved agenda items.");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(agendaItems));
    } catch (e) {
      console.error("Failed to save items to localStorage", e);
      setError("Could not save agenda items.");
    }
  }, [agendaItems]);

  const sortAgendaItems = (items: AgendaItem[]): AgendaItem[] => {
    return [...items].sort((a, b) => {
      const aIsCompleted = a.isCompleted ? 1 : 0;
      const bIsCompleted = b.isCompleted ? 1 : 0;
      if (aIsCompleted !== bIsCompleted) {
        return aIsCompleted - bIsCompleted;
      }

      if (!a.date && b.date) return 1;
      if (a.date && !b.date) return -1;
      
      const dateComparison = (a.date || "").localeCompare(b.date || "");
      if (dateComparison !== 0) return dateComparison;

      if (!a.time && b.time) return 1;
      if (a.time && !b.time) return -1;

      const timeComparison = (a.time || "").localeCompare(b.time || "");
      if (timeComparison !== 0) return timeComparison;
      
      return a.createdAt - b.createdAt;
    });
  };
  

  const handleSmartAdd = async (text: string) => {
    if (!isGeminiAvailable) {
      setError("Gemini AI features are unavailable. Please configure the API key.");
      // Open modal with empty form as fallback
      setEditingItem(null);
      setInitialModalData({});
      setIsModalOpen(true);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const parsedInfo = await parseNaturalLanguageForAgenda(text);
      if (parsedInfo) {
        setInitialModalData(parsedInfo);
        setEditingItem(null); // Ensure it's for a new item
        setIsModalOpen(true);
      } else {
        setError("AI could not understand the input. Please try rephrasing or add manually.");
        // Open modal with empty form as fallback if AI fails to parse
        setInitialModalData({});
        setEditingItem(null);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Smart add error:", err);
      setError(err instanceof Error ? err.message : "Failed to parse input with AI. Add manually?");
      // Open modal with empty form as fallback on error
      setInitialModalData({});
      setEditingItem(null);
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveItem = (itemData: Omit<AgendaItem, 'id' | 'isCompleted' | 'createdAt'>) => {
    if (editingItem) {
      setAgendaItems(prevItems => 
        prevItems.map(item => item.id === editingItem.id ? { ...editingItem, ...itemData } : item)
      );
    } else {
      const newItem: AgendaItem = {
        ...itemData,
        id: generateUUID(),
        isCompleted: false,
        createdAt: Date.now(),
      };
      setAgendaItems(prevItems => [newItem, ...prevItems]);
    }
    closeModal();
  };

  const handleToggleComplete = useCallback((id: string) => {
    setAgendaItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  }, []);

  const handleDeleteItem = useCallback((id: string) => {
    setAgendaItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  const handleEditItem = useCallback((item: AgendaItem) => {
    setEditingItem(item);
    setInitialModalData(null); // Clear initial data if editing
    setIsModalOpen(true);
  }, []);
  
  const handleClearCompleted = () => {
    setAgendaItems(prevItems => prevItems.filter(item => !item.isCompleted));
  };

  const openAddModal = () => {
    setEditingItem(null);
    setInitialModalData(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setInitialModalData(null);
  };

  const sortedItems = sortAgendaItems(agendaItems);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 selection:bg-sky-500 selection:text-white bg-slate-900 text-slate-100">
      <Header />
      <main className="container mx-auto max-w-3xl w-full mt-8 flex-grow">
        {!isGeminiAvailable && <NoApiKeyMessage />}
        
        {isGeminiAvailable && (
          <SmartAddInput onSmartAdd={handleSmartAdd} isLoading={isLoading} />
        )}

        {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md my-4 text-sm">{error}</p>}
        {isLoading && !isModalOpen && (
            <div className="flex justify-center my-4 items-center">
                <LoadingSpinner_ /> <span className="ml-2 text-slate-300">AI is thinking...</span>
            </div>
        )}

        <div className="my-6 flex justify-between items-center">
          <button
            onClick={openAddModal}
            className="flex items-center bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
          >
            <AddIcon className="w-5 h-5 mr-2" />
            Add Manually
          </button>
          {agendaItems.some(item => item.isCompleted) && (
             <button
                onClick={handleClearCompleted}
                className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            >
                <BroomIcon className="w-5 h-5 mr-2" />
                Clear Completed
            </button>
          )}
        </div>

        <AgendaList
          items={sortedItems}
          onToggleComplete={handleToggleComplete}
          onDeleteItem={handleDeleteItem}
          onEditItem={handleEditItem}
        />
        {sortedItems.length === 0 && !isLoading && (
            <p className="text-center text-slate-400 mt-10 text-lg">Your agenda is empty. Add some items!</p>
        )}
      </main>
      <Footer />
      <AgendaFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSaveItem}
        initialData={editingItem || initialModalData}
        isEditing={!!editingItem}
      />
    </div>
  );
};

export default App;
