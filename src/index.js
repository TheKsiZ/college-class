import React, { Suspense, createContext } from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import { getAuth } from 'firebase/auth';
import "./18n";
import { ThemeProvider, CircularProgress } from "@mui/material";
import Theme from "./muiComponents/MUIBlackTheme";
import "./styles/rooms.css"
import Provider from './components/Provider';

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(    
    <Provider>
        <App />
    </Provider>
);