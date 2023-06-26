import React, { Suspense, createContext } from 'react';
import {BrowserRouter} from 'react-router-dom';
import { getAuth } from 'firebase/auth';

import { ThemeProvider, CircularProgress } from "@mui/material";
import Theme from "../muiComponents/MUIBlackTheme";
import { useTranslation } from "react-i18next";
import {Context} from "../index";
import { useState } from 'react';
import { useEffect } from 'react';
const auth = getAuth();
const Provider = ({children}) => {
    const [translation, setTranslation] = useState(localStorage.getItem('locale') || "ru");
    const { t, i18n } = useTranslation();
    
    useEffect(()=> {        
        i18n.changeLanguage(translation);    
        localStorage.setItem('locale', translation);    
    },[translation])

    return(
        <Context.Provider value={{auth, translation, setTranslation}}>
            <Suspense fallback={<ThemeProvider theme={Theme}><CircularProgress className="rooms-div" /></ThemeProvider>}>
                <BrowserRouter>
                    {children}
                </BrowserRouter>    
            </Suspense>
        </Context.Provider>
        
    )
}

export default Provider;
