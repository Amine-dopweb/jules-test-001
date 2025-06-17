
import React from 'react';
import { AgendaItem } from '../types';
import { AgendaItemCard } from './AgendaItemCard';

interface AgendaListProps {
  items: AgendaItem[];
  onToggleComplete: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (item: AgendaItem) => void;
}

export const AgendaList: React.FC<AgendaListProps> = ({ items, onToggleComplete, onDeleteItem, onEditItem }) => {
  if (items.length === 0) {
    return null; // Message handled in App.tsx
  }

  return (
    <div className="space-y-4">
      {items.map(item => (
        <AgendaItemCard
          key={item.id}
          item={item}
          onToggleComplete={onToggleComplete}
          onDeleteItem={onDeleteItem}
          onEditItem={onEditItem}
        />
      ))}
    </div>
  );
};
    