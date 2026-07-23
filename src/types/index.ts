export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskCategory = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  tags: string[];
  estimatedMinutes: number;
  loggedMinutes: number;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  updatedAt: string;
}

export interface FocusSession {
  id: string;
  durationMinutes: number;
  mode: 'work' | 'break';
  completedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isPending?: boolean;
}

export type ActiveTab = 'tasks' | 'notes' | 'timer' | 'analytics' | 'assistant';
