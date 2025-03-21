import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { WeekOverview as WeekOverviewType, Task } from '../types';

interface WeekOverviewProps {
  weekOverview: WeekOverviewType;
  tasks: Task[];
}

export const WeekOverview: React.FC<WeekOverviewProps> = ({ weekOverview, tasks }) => {
  // Groepeer entries per datum
  const entriesByDate = weekOverview.entries.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = {};
    }
    acc[entry.date][entry.taskId] = entry.hours;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  // Sorteer datums
  const sortedDates = Object.keys(entriesByDate).sort();

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Week {weekOverview.weekNumber} ({weekOverview.year})
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">
          Totaal uren deze week: {weekOverview.totalHours}
        </Typography>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Datum</TableCell>
              {tasks.map(task => (
                <TableCell key={task.id}>{task.name}</TableCell>
              ))}
              <TableCell>Totaal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedDates.map(date => {
              const dayTotal = tasks.reduce((sum, task) => 
                sum + (entriesByDate[date][task.id] || 0), 0
              );
              
              return (
                <TableRow key={date}>
                  <TableCell>
                    {format(parseISO(date), 'EEEE d MMMM', { locale: nl })}
                  </TableCell>
                  {tasks.map(task => (
                    <TableCell key={task.id}>
                      {entriesByDate[date][task.id] || 0}
                    </TableCell>
                  ))}
                  <TableCell>{dayTotal}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}; 