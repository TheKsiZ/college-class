import React, { useState, useRef } from "react";

//Mui
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Box, Button, Modal, TextField, Typography, MenuItem, FormControl, InputLabel } from '@mui/material';
import Select from '@mui/material/Select';
import "../styles/rooms.css";

//Firebase
import { CreateTask } from "../Data/db";

const CreateTestModal = ({isOpen, handleClose, LoadLessons}) => {

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

    const [type, setType] = useState("homework");
    const handleTypeChange = (event) => {
        setType(event.target.value);
    };

    const [deadline, setDeadline] = useState(Date.now());

    const [openErrorDeadline, setErrorDeadline] = useState(false);
    const [errorDeadlineText, setErrorDeadlineText] = useState("");

    const handleClick = async () => {
        if(validateFields()) return;

        await CreateTask(title, description, type, deadline.valueOf(), fileRef.current.files[0]);
        await LoadLessons();
        handleClosing();
        handleClose();        
    }

    const handleClosing = () => {
        setType("homework");
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
        if(title === ""){
            setErrorTitle(true);
            setErrorTitleText("Lesson must have a title");
            return true;
        }        
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

        if(deadline.valueOf() < Date.now()){            
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
                <h1 style={{margin: 0}}>Create a task</h1>
                <TextField 
                    id="title" 
                    label="Title" 
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
                    id="description"
                    label="Small description" 
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
                <FormControl>
                    <InputLabel id="typeLabel">Type</InputLabel>
                    <Select  
                        sx={{minWidth: 120}}                  
                        id="type"
                        value={type}
                        onChange={handleTypeChange}
                        displayEmpty
                        label="Type"
                    >                           
                        <MenuItem value="homework">Homework</MenuItem>
                        <MenuItem value="practice">Practice</MenuItem>
                        <MenuItem value="laboratory">Laboratory</MenuItem>
                    </Select>
                </FormControl>
                <br/>                             
                <br/>
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
                <br/>
                <br/>
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

export default CreateTestModal;