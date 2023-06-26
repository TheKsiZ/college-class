import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
//Mui
import { Box, Button, Modal, TextField, Typography, FormControl, InputLabel, MenuItem } from '@mui/material';
import Select from '@mui/material/Select';
import "../styles/rooms.css";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
//Firebase
import { UpdateTask, UpdateLesson, IsUserStillInRoom } from "../Data/db";
import { useNavigate } from "react-router-dom";

const EditLessonModal = ({isOpen, handleClose, data, LoadLessons, handleBackdrop}) => {
    const navigate = useNavigate();
    if(!IsUserStillInRoom()){
        navigate('/rooms');
    }
    const { t, i18n } = useTranslation();
    const fileRef = useRef();    
    const [fileName, setFileName] = useState("");

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

    const [type, setType] = useState("");
    const handleTypeChange = (event) => {
        setType(event.target.value);
    };

    const [deadline, setDeadline] = useState(Date.now());
    const [openErrorDeadline, setErrorDeadline] = useState(false);
    const [errorDeadlineText, setErrorDeadlineText] = useState("");

    const handleClick = async () => {        
        if(validateFields()) return;        
        
        handleBackdrop(true);
        if(data.data.type === "lesson")
            await UpdateLesson(data.id, title, description, fileRef.current.files[0]);
        else
            await UpdateTask(data.id, title, description, type, deadline.valueOf(), fileRef.current.files[0]);
        
        await LoadLessons();
        handleClosing();
        handleClose();       
        
        handleBackdrop(false);
    }

    const handleClosing = () => {
        setDeadline(Date.now());
        setErrorDeadline(false);
        setErrorDeadlineText("");
        setFileName('');
        setErrorTitleText('');
        setErrorTitle(false);
        setErrorDescText('');
        setErrorDesc(false);
        setTitle('');
        setDescription('');
        setType('');
        handleClose();
    }

    const validateFields = () => {        
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

        if(data.data.type !== "lesson" && deadline.valueOf() < Date.now()){            
            setErrorDeadline(true);
            setErrorDeadlineText(t("error_invalid_date"));
            return true;
        }
        setErrorDeadline(false);
        setErrorDeadlineText("");

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
                    {t(data.data.type)}
                </Typography> 
                <TextField 
                    id="title" 
                    label={t("title")}
                    variant="standard"  
                    ref={titleRef}                      
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}                                            
                    margin="normal"                                                                                 
                    fullWidth={true}
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
                    fullWidth={true}
                    maxRows={4}
                    multiline  
                    error={openErrorDesc}
                    helperText={errorDescText}           
                />  
                <br/>
                <br/>

                {data.data.type === "lesson" ? <></> : 
                <>
                    <FormControl fullWidth={true}>
                        <InputLabel id="typeLabel">{t("type")}</InputLabel>
                        <Select                                                          
                            id="type"
                            value={type}
                            onChange={handleTypeChange}
                            displayEmpty
                            label={t("type")}
                        >                           
                            <MenuItem value="homework">{t("homework")}</MenuItem>
                            <MenuItem value="practice">{t("practice")}</MenuItem>
                            <MenuItem value="laboratory">{t("laboratory")}</MenuItem>
                        </Select>
                    </FormControl>
                    <br/>                             
                    <br/>
                    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={i18n.language}>
                        <DatePicker
                            label={t("deadline")}                            
                            value={deadline}
                            onChange={(newValue) => { setDeadline(newValue) }}
                            renderInput={
                                (params) => 
                                    <TextField 
                                        fullWidth={true}
                                        {...params} 
                                        error={openErrorDeadline}
                                        helperText={errorDeadlineText}
                                    />
                            }                        
                        />
                    </LocalizationProvider>
                    <br/><br/>
                </>}                

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

export default EditLessonModal;