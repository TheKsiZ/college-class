import React, { useState, useRef } from 'react';

import AlertModal from "../../components/AlertModal";
import { useTranslation } from "react-i18next";
//Mui
import { Box, Backdrop, CircularProgress, ThemeProvider, TextField, Button, Alert, Collapse, Typography } from "@mui/material";
import Theme from "../../muiComponents/MUIBlackTheme";
import NaviagtionRoom from "../../components/NavigationRoom";
import "../../styles/settings.css";
//Firebase
import { IsCodeActive, UpdateRoom, DeleteRoom, RemoveTestCode } from '../../Data/db';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    IsCodeActive();
    RemoveTestCode();

    const { t } = useTranslation();

    const navigate = useNavigate();

    const [backdropOpen, setBackdropOpen] = useState(false);
    const handleBackdrop = (state) => setBackdropOpen(state);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const titleRef = useRef();
    const descriptionRef = useRef();

    const [errorTitle, setErrorTitle] = useState(false);
    const [errorTitleText, setErrorTitleText] = useState('');

    const [errorDesc, setErrorDesc] = useState(false);
    const [errorDescText, setErrorDescText] = useState('');

    const validateFields = () => {
        if(title.length > 18){
            setErrorTitle(true);
            setErrorTitleText(t("error_title_length"));
            return true;
        }        
        setErrorTitle(false);
        setErrorTitleText('');

        if(description.length > 26){
            setErrorDesc(true);
            setErrorDescText(t("error_desc_length"));
            return true;
        }

        if(title === "" && description === "") return true;

        setErrorDesc(false);
        setErrorDescText('');
        return false;
    }

    const [openModalAlert, setOpenModalAlert] = useState(false);
    const handleOpenModalAlert = () => setOpenModalAlert(true);
    const handleCloseModalAlert = () => setOpenModalAlert(false);

    const [isOpenSuccessAlert, setOpenSuccessAlert] = useState(false); 
    const handleClick = async () => {        
        if(validateFields()) return;

        handleBackdrop(true);
        await UpdateRoom(title, description);

        handleBackdrop(false);
        setOpenSuccessAlert(true);
    }

    const handleAlert = () => {
        setOpenModalAlert(true);
    }
    const handleClickModalAlert = async () => {
        await DeleteRoom();
        navigate("/rooms");
    }
    return(
        <>
            <ThemeProvider theme={Theme}>
                <NaviagtionRoom/>

                <div className='settings-div'>
                    <div className="settings-form">                      
                            <Typography fontSize={28}>
                                {t("room_settings")}
                            </Typography>                                
                            <TextField style={{width: "100%"}}
                                id="title" label={t("title")} variant="standard"  
                                ref={titleRef}                      
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}                        
                                margin="normal"     
                                error={errorTitle}
                                helperText={errorTitleText}                                                                          
                            />            
                            <br/>             
                            <TextField style={{width: "100%"}}
                                id="description" label={t("description")} variant="standard"
                                ref={descriptionRef}                            
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                margin="normal"
                                maxRows={4}
                                multiline                  
                                error={errorDesc}
                                helperText={errorDescText}              
                            />  
                            <br/><br/>                       
                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                <Button sx={{marginRight: 1}} variant="contained" color="primary" onClick={handleClick} fullWidth={true}>{t("save")}</Button>
                                <Button variant="contained" color="error" onClick={handleAlert} fullWidth={true}>{t("delete")}</Button>
                            </div>                                       
                    </div>
                </div>           

                <AlertModal 
                    handleClose={handleCloseModalAlert} 
                    isOpen={openModalAlert} 
                    handleClick={handleClickModalAlert} 
                    description={t("alert_room_delete")}
                />
                
                <Backdrop                    
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
                    open={backdropOpen}                    
                >
                    <Box sx={{m: "auto"}}>
                        <CircularProgress  />
                    </Box>
                </Backdrop> 
            </ThemeProvider>

            { isOpenSuccessAlert ? (         
                <span className="footer">
                    <Collapse in={isOpenSuccessAlert}>
                        <Alert onClose={() => {setOpenSuccessAlert(!isOpenSuccessAlert)}} severity="success">{t("room_saved")}</Alert>
                    </Collapse>
                </span>
            ) : <></>}  
        </>
    );
}

export default Settings;