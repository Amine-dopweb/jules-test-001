
export interface AgendaItem {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  isCompleted: boolean;
  createdAt: number; // Timestamp for sorting
}

export interface ParsedAgendaInfo {
  title?: string;
  description?: string;
  date?: string; // YYYY-MM-DD
  time?: string; // HH:MM
}
    