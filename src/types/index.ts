export interface Task {
  id: string;
  name: string;
  description?: string;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  date: string;
  hours: number;
  notes?: string;
}

export interface WeekOverview {
  weekNumber: number;
  year: number;
  totalHours: number;
  entries: TimeEntry[];
}

export interface TaskOverview {
  taskId: string;
  totalHours: number;
  entries: TimeEntry[];
}

export interface ExcelImportData {
  tasks: Task[];
  timeEntries: TimeEntry[];
} 