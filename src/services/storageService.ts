import { ExcelImportData, Task, TimeEntry } from '../types';

const STORAGE_KEYS = {
  TASKS: 'urenregistratie_tasks',
  TIME_ENTRIES: 'urenregistratie_time_entries'
};

export const storageService = {
  saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },
  
  getTasks(): Task[] {
    const tasksJson = localStorage.getItem(STORAGE_KEYS.TASKS);
    return tasksJson ? JSON.parse(tasksJson) : [];
  },
  
  saveTimeEntries(entries: TimeEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(entries));
  },
  
  getTimeEntries(): TimeEntry[] {
    const entriesJson = localStorage.getItem(STORAGE_KEYS.TIME_ENTRIES);
    return entriesJson ? JSON.parse(entriesJson) : [];
  },
  
  saveAllData(data: ExcelImportData): void {
    this.saveTasks(data.tasks);
    this.saveTimeEntries(data.timeEntries);
  },
  
  getAllData(): ExcelImportData {
    return {
      tasks: this.getTasks(),
      timeEntries: this.getTimeEntries()
    };
  },
  
  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.TIME_ENTRIES);
  }
}; 