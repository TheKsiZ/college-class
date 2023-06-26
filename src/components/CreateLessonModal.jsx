import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
//Mui
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import "../styles/rooms.css";

//Firebase
import { CreateLesson } from "../Data/db";

const CreateLessonModal = ({isOpen, handleClose, LoadLessons, handleBackdrop}) => {

    const fileRef = useRef();    
    const [fileName, setFileName] = useState("");
    const { t, i18n } = useTranslation();
    const handleChangeFile = () => {
        let name = fileRef.current.files[0].name;
        name = name.length > 28 ? name.slice(0, 28) + "..." : name;
        setFileName(name);
    }


    const [title, setTitle] = useState('');
    const titleRef = useRef();

    const [openErrorTitle, setErrorTitle] = useState(false);
    const [errorTitleText, setErrorTitleText] = useState("");    
    
    const [description, setDescription] = useState('');
    const descriptionRef = useRef();

    const [openErrorDesc, setErrorDesc] = useState(false);
    const [errorDescText, setErrorDescText] = useState("");

    const handleClick = async () => {
        if(validateFields()) return;

        handleBackdrop(true);
        await CreateLesson(title, description, fileRef.current.files[0]);
        await LoadLessons();
        handleClosing();
        handleClose();  
        
        handleBackdrop(false);
    }

    const handleClosing = () => {
        setFileName('');
        setErrorTitleText('');
        setErrorTitle(false);
        setErrorDescText('');
        setErrorDesc(false);
        setTitle('');
        setDescription('');
        handleClose();
    }

    const validateFields = () => {        
        if(title === ""){
            setErrorTitle(true);
            setErrorTitleText(t("error_empty_lesson_title"));
            return true;
        }        
        if(title.length > 32){
            setErrorTitle(true);
            setErrorTitleText(t("error_room_title_length"));
            return true;
        }
        setErrorTitle(false);
        setErrorTitleText("");

        if(description.length > 100){
            setErrorDesc(true);
            setErrorDescText(t("error_room_desc_length"));
            return true;
        }
        setErrorDesc(false);
        setErrorDescText("");        

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
                    {t("lesson_action")}
                </Typography>    
                <TextField 
                    fullWidth={true}
                    id="title" 
                    label={t("title")}
                    variant="standard"  
                    ref={titleRef}                      
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}                                            
                    margin="normal"                                                                                 
                    style={{width:"100%"}}
                    error={openErrorTitle}
                    helperText={errorTitleText}
                    required                    
                />  
                <br/>
                <TextField 
                    fullWidth={true}
                    id="description"
                    label={t("description")}
                    variant="standard"  
                    ref={descriptionRef}                      
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}                                            
                    margin="normal"
                    style={{width:"100%"}}
                    maxRows={4}
                    multiline  
                    error={openErrorDesc}
                    helperText={errorDescText}           
                />  
                <br/>
                <br/>
                <Button variant="outlined" component="label" fullWidth={true}> 
                    {t("upload_file")}
                    <input type="file" ref={fileRef} onChange={handleChangeFile} hidden />
                </Button>                
                <br/>
                <Typography>
                    {fileName}
                </Typography>
                <br/>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <Button sx={{marginRight: 1}} variant="contained" color="primary" onClick={handleClick} fullWidth={true}>{t("accept")}</Button>
                    <Button variant="contained" color="primary" onClick={handleClosing} fullWidth={true}>{t("close")}</Button>
                </div>                
            </Box>            
        </Modal>     
                                  
  );
}

export default CreateLessonModal;