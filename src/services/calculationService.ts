import { TimeEntry, WeekOverview, TaskOverview } from '../types';
import { format, startOfWeek, endOfWeek, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';

export const calculationService = {
  getWeekOverview(date: string, entries: TimeEntry[]): WeekOverview {
    const parsedDate = parseISO(date);
    const weekStart = startOfWeek(parsedDate, { locale: nl });
    const weekEnd = endOfWeek(parsedDate, { locale: nl });
    
    const weekEntries = entries.filter(entry => {
      const entryDate = parseISO(entry.date);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });
    
    const totalHours = weekEntries.reduce((sum, entry) => sum + entry.hours, 0);
    
    return {
      weekNumber: parseInt(format(parsedDate, 'w', { locale: nl })),
      year: parsedDate.getFullYear(),
      totalHours,
      entries: weekEntries
    };
  },
  
  getTaskOverview(taskId: string, entries: TimeEntry[]): TaskOverview {
    const taskEntries = entries.filter(entry => entry.taskId === taskId);
    const totalHours = taskEntries.reduce((sum, entry) => sum + entry.hours, 0);
    
    return {
      taskId,
      totalHours,
      entries: taskEntries
    };
  },
  
  getTotalHoursForDate(date: string, entries: TimeEntry[]): number {
    return entries
      .filter(entry => entry.date === date)
      .reduce((sum, entry) => sum + entry.hours, 0);
  },
  
  getTotalHoursForTask(taskId: string, entries: TimeEntry[]): number {
    return entries
      .filter(entry => entry.taskId === taskId)
      .reduce((sum, entry) => sum + entry.hours, 0);
  }
}; 