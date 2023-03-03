import React, { useState, useRef } from 'react';

import AlertModal from "../../components/AlertModal";
//Mui
import { ThemeProvider, TextField, Button, Alert, Collapse } from "@mui/material";
import Theme from "../../muiComponents/MUIBlackTheme";
import NaviagtionRoom from "../../components/NavigationRoom";
import "../../styles/settings.css";
//Firebase
import { IsCodeActive, UpdateRoom, DeleteRoom } from '../../Data/db';

const Settings = () => {
    IsCodeActive();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const titleRef = useRef();
    const descriptionRef = useRef();

    const [errorTitle, setErrorTitle] = useState(false);
    const [errorTitleText, setErrorTitleText] = useState('');

    const [errorDesc, setErrorDesc] = useState(false);
    const [errorDescText, setErrorDescText] = useState('');

    const validateFields = () => {
        if(title.length > 32){
            setErrorTitle(true);
            setErrorTitleText("Max symbols are 32");
            return true;
        }        
        setErrorTitle(false);
        setErrorTitleText('');

        if(description.length > 100){
            setErrorDesc(true);
            setErrorDescText("Max symbols are 100");
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

        await UpdateRoom(title, description);
        setOpenSuccessAlert(true);
    }

    const handleAlert = () => {
        setOpenModalAlert(true);
    }
    const handleClickModalAlert = async () => {
        await DeleteRoom();
        window.location.href = "/rooms";
    }
    return(
        <>
            <ThemeProvider theme={Theme}>
                <NaviagtionRoom/>

                <div className='settings-div'>
                    <div className="settings-form">   
                            <h1 className="settings-h1">Room Settings</h1>                                  
                            <TextField style={{width: "100%"}}
                                id="title" label="Title" variant="standard"  
                                ref={titleRef}                      
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}                        
                                margin="normal"     
                                error={errorTitle}
                                helperText={errorTitleText}                                                                          
                            />            
                            <br/>             
                            <TextField style={{width: "100%"}}
                                id="description" label="Description" variant="standard"
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
                            <div style={{display: "flex", justifyContent: "space-between", marginTop: 25}}>
                                <Button variant="contained" color="primary" onClick={handleClick}>Save</Button>
                                <Button variant="contained" color="error" onClick={handleAlert}>Delete</Button>
                            </div>                                       
                    </div>
                </div>           

                <AlertModal 
                    handleClose={handleCloseModalAlert} 
                    isOpen={openModalAlert} 
                    handleClick={handleClickModalAlert} 
                    description="Are you sure you want to delete the room?"
                />

            </ThemeProvider>

            { isOpenSuccessAlert ? (         
                <span className="footer">
                    <Collapse in={isOpenSuccessAlert}>
                        <Alert onClose={() => {setOpenSuccessAlert(!isOpenSuccessAlert)}} severity="success">Room saved!</Alert>
                    </Collapse>
                </span>
            ) : <></>}  
        </>
    );
}

export default Settings;