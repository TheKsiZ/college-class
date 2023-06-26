import React, { useState, useRef } from "react";

//Mui
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import "../styles/rooms.css"
import { useTranslation } from "react-i18next";
//Firebase
import { CreateRoom } from "../Data/db";
import { useNavigate } from "react-router-dom";

const Create = ({isOpen, handleClose, handleBackdrop}) => {    
    const { t } = useTranslation();

    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const titleRef = useRef();
 
    const [openErrorTitle, setOpenErrorTitle] = useState(false);
    const [errorTitleText, setErrorTitleText] = useState("");
    
    const [description, setDescription] = useState('');
    const descriptionRef = useRef();

    const [openErrorDesc, setOpenErrorDesc] = useState(false);
    const [errorDescText, setErrorDescText] = useState("");

    const handleClick = async () => {
        if(validateFields()) return;

        handleBackdrop(true);
        await CreateRoom(title, description);
        
        handleClosing();
        handleBackdrop(false);
        navigate("/room");
    }

    const handleClosing = () => {
        setErrorTitleText('');
        setOpenErrorTitle(false);
        setErrorDescText('');
        setOpenErrorDesc(false);
        setTitle('');
        setDescription('');
        handleClose();
    }

    const validateFields = () => {
        if(title === ""){
            setErrorTitleText(t("error_empty_room_title"));
            setOpenErrorTitle(true);
            return true;
        }
        if(title.length > 18){
            setErrorTitleText(t("error_title_length"));
            setOpenErrorTitle(true);
            return true;
        }
        setErrorTitleText("");
        setOpenErrorTitle(false);
        
        if(description.length > 26){
            setErrorDescText(t("error_desc_length"));
            setOpenErrorDesc(true);
            return true;
        }
        setErrorDescText("");
        setOpenErrorDesc(false);

        return false;
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
                    {t("create_room")}
                </Typography>                         
                <TextField 
                    id="title" 
                    label={t("title")} 
                    variant="standard"  
                    ref={titleRef}                      
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}                                            
                    margin="normal"                                                                                 
                    style={{width:235}}
                    error={openErrorTitle}
                    helperText={errorTitleText}
                    required                    
                />  
                <br/>
                <TextField 
                    id="description"
                    label={t("description")}
                    variant="standard"  
                    ref={descriptionRef}                      
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}                                            
                    margin="normal"
                    style={{width:235}}
                    maxRows={4}
                    multiline      
                    error={openErrorDesc}
                    helperText={errorDescText}
                />  
                <br/><br/>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <Button sx={{marginRight: 1}} variant="contained" color="primary" onClick={handleClick} fullWidth={true}>{t("accept")}</Button>
                    <Button variant="contained" color="primary" onClick={handleClosing} fullWidth={true}>{t("close")}</Button>
                </div>                
            </Box>            
        </Modal>     
                                  
  );
}

export default Create;