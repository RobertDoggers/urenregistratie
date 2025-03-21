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
import { TaskOverview as TaskOverviewType, Task } from '../types';

interface TaskOverviewProps {
  taskOverview: TaskOverviewType;
  task: Task;
}

export const TaskOverview: React.FC<TaskOverviewProps> = ({ taskOverview, task }) => {
  // Sorteer entries op datum
  const sortedEntries = [...taskOverview.entries].sort((a, b) => 
    a.date.localeCompare(b.date)
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {task.name}
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">
          Totaal uren: {taskOverview.totalHours}
        </Typography>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Datum</TableCell>
              <TableCell>Uren</TableCell>
              <TableCell>Notities</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEntries.map(entry => (
              <TableRow key={entry.id}>
                <TableCell>
                  {format(parseISO(entry.date), 'EEEE d MMMM', { locale: nl })}
                </TableCell>
                <TableCell>{entry.hours}</TableCell>
                <TableCell>{entry.notes || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}; 