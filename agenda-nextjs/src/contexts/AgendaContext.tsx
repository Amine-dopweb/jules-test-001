"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AgendaItem, ParsedAgendaInfo } from '@/types';
import { LOCAL_STORAGE_KEY } from '@/constants';
import { parseNaturalLanguageForAgenda, isGeminiAvailable as checkGeminiServiceAvailability } from '@/services/geminiService';

// Simple UUID generator (can be moved to a utils file later)
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface AgendaContextType {
  agendaItems: AgendaItem[];
  isLoading: boolean;
  error: string | null;
  isModalOpen: boolean;
  editingItem: AgendaItem | null;
  initialModalData: Partial<ParsedAgendaInfo> | null;
  isGeminiAvailable: boolean;
  fetchItems: () => void; // To explicitly trigger fetch if needed
  addAgendaItem: (itemData: Omit<AgendaItem, 'id' | 'isCompleted' | 'createdAt'>) => void;
  toggleCompleteItem: (id: string) => void;
  deleteItem: (id: string) => void;
  editItem: (item: AgendaItem) => void;
  clearCompletedItems: () => void;
  handleSmartAdd: (text: string) => Promise<void>;
  openModalWithItem: (item?: AgendaItem | null, initialData?: Partial<ParsedAgendaInfo> | null) => void;
  closeModal: () => void;
  saveItem: (itemData: Omit<AgendaItem, 'id' | 'isCompleted' | 'createdAt'>) => void;
  sortedItems: AgendaItem[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  goToNextDay: () => void;
  goToPreviousDay: () => void;
  goToNextWeek: () => void;
  goToPreviousWeek: () => void;
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
}

const AgendaContext = createContext<AgendaContextType | undefined>(undefined);

export const useAgenda = (): AgendaContextType => {
  const context = useContext(AgendaContext);
  if (!context) {
    throw new Error('useAgenda must be used within an AgendaProvider');
  }
  return context;
};

interface AgendaProviderProps {
  children: ReactNode;
}

export const AgendaProvider: React.FC<AgendaProviderProps> = ({ children }) => {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);
  const [initialModalData, setInitialModalData] = useState<Partial<ParsedAgendaInfo> | null>(null);
  const [isGeminiAvailable, setIsGeminiAvailable] = useState<boolean>(false);
  const [selectedDate, setSelectedDateState] = useState<Date>(new Date());

  const fetchItems = useCallback(() => {
    // console.log("Attempting to load from localStorage");
    try {
      const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedItems) {
        // console.log("Stored items found:", storedItems);
        setAgendaItems(JSON.parse(storedItems));
      } else {
        // console.log("No items found in localStorage.");
      }
    } catch (e) {
      console.error("Failed to load items from localStorage", e);
      setError("Could not load saved agenda items.");
    }
  }, []);

  useEffect(() => {
    setIsGeminiAvailable(checkGeminiServiceAvailability());
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    // console.log("Attempting to save to localStorage:", agendaItems);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(agendaItems));
      // console.log("Items saved to localStorage.");
    } catch (e) {
      console.error("Failed to save items to localStorage", e);
      setError("Could not save agenda items.");
    }
  }, [agendaItems]);

  const sortAgendaItems = (items: AgendaItem[]): AgendaItem[] => {
    return [...items].sort((a, b) => {
      const aIsCompleted = a.isCompleted ? 1 : 0;
      const bIsCompleted = b.isCompleted ? 1 : 0;
      if (aIsCompleted !== bIsCompleted) return aIsCompleted - bIsCompleted;
      if (!a.date && b.date) return 1;
      if (a.date && !b.date) return -1;
      const dateComparison = (a.date || "").localeCompare(b.date || "");
      if (dateComparison !== 0) return dateComparison;
      if (!a.time && b.time) return 1;
      if (a.time && !b.time) return -1;
      const timeComparison = (a.time || "").localeCompare(b.time || "");
      if (timeComparison !== 0) return timeComparison;
      return (a.createdAt || 0) - (b.createdAt || 0);
    });
  };

  const sortedItems = sortAgendaItems(agendaItems);

  const handleSmartAdd = async (text: string) => {
    if (!isGeminiAvailable) {
      setError("Gemini AI features are unavailable. Configure API key.");
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
        setEditingItem(null);
        setIsModalOpen(true);
      } else {
        setError("AI couldn't understand. Add manually or rephrase.");
        setInitialModalData({});
        setEditingItem(null);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Smart add error:", err);
      setError(err instanceof Error ? err.message : "Failed to parse input with AI.");
      setInitialModalData({});
      setEditingItem(null);
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const saveItem = (itemData: Omit<AgendaItem, 'id' | 'isCompleted' | 'createdAt'>) => {
    if (editingItem) {
      setAgendaItems(prevItems =>
        prevItems.map(item => item.id === editingItem.id ? { ...editingItem, ...itemData, createdAt: editingItem.createdAt } : item)
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

  // Exposing this as addAgendaItem for clarity, maps to saveItem when not editing
  const addAgendaItem = (itemData: Omit<AgendaItem, 'id' | 'isCompleted' | 'createdAt'>) => {
    setEditingItem(null); // Ensure we are in "add" mode
    saveItem(itemData);
  };

  const toggleCompleteItem = useCallback((id: string) => {
    setAgendaItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setAgendaItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  const editItem = useCallback((item: AgendaItem) => {
    setEditingItem(item);
    setInitialModalData(null); // Clear smart add data
    setIsModalOpen(true);
  }, []);

  const clearCompletedItems = () => {
    setAgendaItems(prevItems => prevItems.filter(item => !item.isCompleted));
  };

  const openModalWithItem = (item: AgendaItem | null = null, initialData: Partial<ParsedAgendaInfo> | null = null) => {
    setEditingItem(item);
    setInitialModalData(initialData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setInitialModalData(null);
    setError(null); // Clear errors when modal closes
  };

  const setSelectedDate = (date: Date) => {
    setSelectedDateState(new Date(date.getFullYear(), date.getMonth(), date.getDate())); // Normalize to remove time part
  };

  const goToNextDay = () => {
    setSelectedDateState(currentDate => {
      const nextDay = new Date(currentDate);
      nextDay.setDate(currentDate.getDate() + 1);
      return nextDay;
    });
  };

  const goToNextWeek = () => {
    setSelectedDateState(currentDate => {
      const nextWeekDate = new Date(currentDate);
      nextWeekDate.setDate(currentDate.getDate() + 7);
      return nextWeekDate;
    });
  };

  const goToPreviousWeek = () => {
    setSelectedDateState(currentDate => {
      const prevWeekDate = new Date(currentDate);
      prevWeekDate.setDate(currentDate.getDate() - 7);
      return prevWeekDate;
    });
  };

  const goToPreviousDay = () => {
    setSelectedDateState(currentDate => {
      const prevDay = new Date(currentDate);
      prevDay.setDate(currentDate.getDate() - 1);
      return prevDay;
    });
  };

  const goToNextMonth = () => {
    setSelectedDateState(currentDate => {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      return newDate;
    });
  };

  const goToPreviousMonth = () => {
    setSelectedDateState(currentDate => {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      return newDate;
    });
  };

  return (
    <AgendaContext.Provider value={{
      agendaItems, isLoading, error, isModalOpen, editingItem, initialModalData, isGeminiAvailable,
      fetchItems, addAgendaItem, toggleCompleteItem, deleteItem, editItem, clearCompletedItems,
      handleSmartAdd, openModalWithItem, closeModal, saveItem, sortedItems,
      selectedDate, setSelectedDate, goToNextDay, goToPreviousDay, goToNextWeek, goToPreviousWeek,
      goToNextMonth, goToPreviousMonth
    }}>
      {children}
    </AgendaContext.Provider>
  );
};
