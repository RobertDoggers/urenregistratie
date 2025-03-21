import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import TimeRegistration from './components/TimeRegistrationComponent';


const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TimeRegistration />
    </ThemeProvider>
  );
}

export default App; 