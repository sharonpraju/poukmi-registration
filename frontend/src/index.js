import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import './index.css';
import App from './App';

const theme=createTheme({
  palette: {
    primary: {
      main: '#023E8A',
      darker: '#023E8A'
    },
    secondary: {
      main: '#EEEEEE',
      darker: '#EEEEEE'
    },
    danger: {
      main: '#E63946',
      darker: '#E63946'
    }
  },
});



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
);
