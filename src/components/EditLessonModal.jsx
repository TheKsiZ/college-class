import React, { useState, useRef } from "react";

//Mui
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import "../styles/rooms.css";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
//Firebase
import { UpdateHomework, UpdateLesson } from "../Data/db";

const EditLessonModal = ({isOpen, handleClose, data, LoadLessons}) => {

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


    const [deadline, setDeadline] = useState(Date.now());
    const deadlineRef = useRef();
    const [openErrorDeadline, setErrorDeadline] = useState(false);
    const [errorDeadlineText, setErrorDeadlineText] = useState("");

    const handleClick = async () => {
        if(validateFields()) return;

        if(data.data.isLesson)
            await UpdateLesson(data.id, title, description, fileRef.current.files[0]);
        else
            await UpdateHomework(data.id, title, description, deadline.valueOf(), fileRef.current.files[0]);
        
        await LoadLessons();
        handleClosing();
        handleClose();        
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
        handleClose();
    }

    const validateFields = () => {        
        if(title.length > 32){
            setErrorTitle(true);
            setErrorTitleText("Max symbols are 32");
            return true;
        }
        setErrorTitle(false);
        setErrorTitleText("");

        if(description.length > 100){
            setErrorDesc(true);
            setErrorDescText("Max symbols are 100");
            return true;
        }
        setErrorDesc(false);
        setErrorDescText("");        

        if(!data.data.isLesson && deadline.valueOf() < Date.now()){            
            setErrorDeadline(true);
            setErrorDeadlineText("Incorrect date");
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
                <h1 style={{margin: 0}}>Edit a {data.data.isLesson ? "lesson" : "homework"}</h1>
                <TextField 
                    id="title" 
                    label="Title" 
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
                    label="Small description" 
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
                <br/>
                <br/>

                {data.data.isLesson ? <></> : 
                <>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                        label="Deadline"
                        inputFormat="DD/MM/yyyy"
                        value={deadline}
                        onChange={(newValue) => { setDeadline(newValue) }}
                        renderInput={
                            (params) => 
                                <TextField 
                                    {...params} 
                                    error={openErrorDeadline}
                                    helperText={errorDeadlineText}
                                />
                        }                        
                    />
                </LocalizationProvider>
                    <br/><br/>
                </>}                

                <Button variant="outlined" component="label"> 
                    Upload File
                    <input type="file" ref={fileRef} onChange={handleChangeFile} hidden />
                </Button>                
                <br/>
                <Typography>
                    {fileName}
                </Typography>
                <div style={{display: "flex", justifyContent: "space-between", marginTop: 25}}>
                    <Button variant="contained" color="primary" onClick={handleClick}>Accept</Button>
                    <Button variant="contained" color="primary" onClick={handleClosing}>Close</Button>
                </div>                
            </Box>            
        </Modal>     
                                  
  );
}

export default EditLessonModal;