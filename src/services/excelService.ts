import * as XLSX from 'xlsx';
import { ExcelImportData, Task, TimeEntry } from '../types';

export const excelService = {
  async importExcel(file: File): Promise<ExcelImportData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          
          // Converteer Excel data naar JSON
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          
          // Log de eerste paar rijen om de structuur te zien
          console.log('Excel data structuur:', jsonData.slice(0, 5));
          
          // Verwerk de data
          const tasks: Task[] = [];
          const timeEntries: TimeEntry[] = [];
          
          // Eerste rij bevat de taken
          const taskRow: string[] = jsonData[0] as string[];
          taskRow.forEach((taskName: string, index: number) => {
            if (taskName && index > 0) { // Skip de eerste kolom (datums)
              tasks.push({
                id: `task-${index}`,
                name: taskName
              });
            }
          });
          
          // Verwerk de uren per dag
          for (let i = 1; i < jsonData.length; i++) {
            const row: any[] = jsonData[i] as any[];
            const date = row[0];
            
            if (date) {
              row.forEach((hours: number, index: number) => {
                if (index > 0 && hours) {
                  timeEntries.push({
                    id: `entry-${i}-${index}`,
                    taskId: `task-${index}`,
                    date: date.toString(),
                    hours: hours
                  });
                }
              });
            }
          }
          
          // Log de verwerkte data
          console.log('Verwerkte taken:', tasks);
          console.log('Verwerkte uren:', timeEntries.slice(0, 5));
          
          resolve({ tasks, timeEntries });
        } catch (error) {
          console.error('Error bij het verwerken van Excel:', error);
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  },
  
  async exportToExcel(data: ExcelImportData): Promise<Blob> {
    const workbook = XLSX.utils.book_new();
    
    // Maak een 2D array voor de data
    const rows: any[][] = [];
    
    // Header rij met taken
    const headerRow = ['Datum', ...data.tasks.map(task => task.name)];
    rows.push(headerRow);
    
    // Groepeer entries per datum
    const entriesByDate = data.timeEntries.reduce((acc, entry) => {
      if (!acc[entry.date]) {
        acc[entry.date] = {};
      }
      acc[entry.date][entry.taskId] = entry.hours;
      return acc;
    }, {} as Record<string, Record<string, number>>);
    
    // Voeg rijen toe voor elke datum
    Object.entries(entriesByDate).forEach(([date, taskHours]) => {
      const row: (string | number)[] = [date];
      data.tasks.forEach(task => {
        row.push(taskHours[task.id.toString()] || 0);
      });
      rows.push(row);
    });
    
    // Maak worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Urenregistratie');
    
    // Converteer naar blob
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
}; 