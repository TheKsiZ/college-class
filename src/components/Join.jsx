import React, { useState, useRef } from "react";

//Mui
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import "../styles/rooms.css";
import { useTranslation } from "react-i18next";
//Firebase
import { AddRoomToUser, SetRoomCode, ValidateRoomCode, IsAlreadyJoinedRoom, IsUserTeacher } from "../Data/db";
import { useNavigate } from "react-router-dom";
const Join = ({isOpen, handleClose, handleBackdrop}) => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const [code, setCode] = useState('');
    const codeRef = useRef();
    
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');

    const handleClick = async () => {
        if(await handleError()) return;

        handleBackdrop(true);
        SetRoomCode(code);
        await AddRoomToUser();
        await IsUserTeacher();
        handleBackdrop(false);
        
        navigate("/room");        
    }

    const handleError = async () => {                
        if(code === ""){
            setError(true);
            setErrorText(t("error_empty_code")); 
            return true;              
        }   

        if(!(await ValidateRoomCode(code))){
            setError(true);
            setErrorText(t("error_invalid_code"));
            return true;
        }

        if((await IsAlreadyJoinedRoom(code))){
            setError(true);
            setErrorText(t("error_already_in_room"));
            return true;
        }

        setError(false);
        setErrorText('');
        return false;
    }

    const handleClosing = () => {
        setError(false);
        setErrorText('');
        setCode('');
        handleClose();
    }

    return (         
        <Modal            
            open={isOpen}
            onClose={handleClosing}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="modal">            
                <Typography fontSize={28}>
                    {t("join_room")}
                </Typography>  
                <TextField 
                    id="code" 
                    label={t("code")} 
                    variant="standard"  
                    ref={codeRef}                      
                    onChange={(e) => setCode(e.target.value)}
                    value={code}                                            
                    margin="normal"   
                    error={error}     
                    helperText={(errorText)}     
                    fullWidth={true}                                                                    
                />  
                <br/><br/>
                <div style={{display: "flex", justifyContent: "space-between"}}>                    
                    <Button sx={{marginRight: 1}} variant="contained" color="primary" onClick={handleClick} fullWidth={true}>{t("accept")}</Button>
                    <Button  variant="contained" color="primary" onClick={handleClosing} fullWidth={true}>{t("close")}</Button>                    
                </div>
            </Box>
        </Modal>                               
  );
}

export default Join;