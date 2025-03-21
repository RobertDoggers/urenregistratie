import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { Task, TimeEntry } from '../types';
import { storageService } from '../services/storageService';
import { excelService } from '../services/excelService';
import { calculationService } from '../services/calculationService';
import { notificationService } from '../services/notificationService';
import { WeekOverview } from './WeekOverview';
import { TaskOverview } from './TaskOverview';

const defaultTasks: Task[] = [
  { id: 'task-1', name: 'Les geven' },
  { id: 'task-2', name: 'Lessen voorbereiden' },
  { id: 'task-3', name: 'Nakijken' },
  { id: 'task-4', name: 'Toets / SE maken' },
  { id: 'task-5', name: 'Vergadering' },
  { id: 'task-6', name: 'Opendag / open avond' },
  { id: 'task-7', name: 'Ouderavond / kindgesprekken' },
  { id: 'task-8', name: 'Beoordelings / evaluatiegesprek' },
  { id: 'task-9', name: 'Mondelingen' },
  { id: 'task-10', name: 'Mentorzorg leerlingen' },
  { id: 'task-11', name: '(Telefonisch) overleg collega\'s' },
  { id: 'task-12', name: 'Uitwisselingsproject' },
  { id: 'task-13', name: 'Taaldorp' },
  { id: 'task-14', name: 'Wolkenland' },
  { id: 'task-15', name: 'Buitenlandreis' },
  { id: 'task-16', name: 'Surveilleren' },
  { id: 'task-17', name: 'Overig / administratie' },
];

const TimeRegistration: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [reminderTime, setReminderTime] = useState<string>('17:00');

  useEffect(() => {
    const data = storageService.getAllData();
    if (data.tasks && data.tasks.length > 0) {
      setTasks(data.tasks);
    }
    setTimeEntries(data.timeEntries || []);
  }, []);

  const handleAddEntry = () => {
    if (!selectedTask || !hours) return;
    const newEntry: TimeEntry = {
      id: `entry-${Date.now()}`,
      taskId: selectedTask,
      date: selectedDate,
      hours: parseFloat(hours),
      notes,
    };
    const updatedEntries = [...timeEntries, newEntry];
    setTimeEntries(updatedEntries);
    storageService.saveTimeEntries(updatedEntries);
    setSelectedTask('');
    setHours('');
    setNotes('');
  };

  const handleReminderChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = event.target.value;
    setReminderTime(newTime);
    await notificationService.cancelReminders();
    await notificationService.scheduleReminder(newTime);
  };

  const weekOverview = calculationService.getWeekOverview(selectedDate, timeEntries);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Urenregistratie
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="date"
                  label="Datum"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Taak</InputLabel>
                  <Select
                    value={selectedTask}
                    onChange={(e) => setSelectedTask(e.target.value)}
                    label="Taak"
                  >
                    {tasks.map((task) => (
                      <MenuItem key={task.id} value={task.id}>
                        {task.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Uren"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  inputProps={{ min: 0, step: 0.5 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notities"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddEntry}
              disabled={!selectedTask || !hours}
            >
              Voeg uren toe
            </Button>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <NotificationsIcon sx={{ mr: 1 }} />
              <TextField
                type="time"
                label="Herinnering"
                value={reminderTime}
                onChange={handleReminderChange}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Weekoverzicht
            </Typography>
            <WeekOverview weekOverview={weekOverview} tasks={tasks} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TimeRegistration;
