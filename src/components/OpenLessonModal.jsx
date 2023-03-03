import React, { useState, useRef } from "react";

//Mui
import { Box, Button, Modal, TextField, Link, Typography } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import "../styles/rooms.css";
import { SendHomeworkFile } from "../Data/db";

import HomeworkListModal from "./HomeworkListModal";

const OpenLessonModal = ({isOpen, handleClose, data, IsUserTeacher}) => {          
          
    const [title, setTitle] = useState(data.data.title);
    const titleRef = useRef();
    
    const [description, setDescription] = useState(data.data.description);
    const descriptionRef = useRef();        

    const [deadline, setDeadline] = useState(data.data.deadline);
    const deadlineRef = useRef();    

    const fileRef = useRef();
    const [fileName, setFileName] = useState('');
    const handleChangeFile = () => {
        const name = fileRef.current.files[0].name;
        setFileName(name);
    }
    const handleClosing = () => {
        setFileName('');
        handleClose();
    }
    const handleSendFile = async () => {
        await SendHomeworkFile(data.id, fileRef.current.files[0]);
        handleClosing();
    }

    const [openHomeworkListModal, setOpenHomeworkListModal] = useState(false);
    const handleOpenHomeworkListModal = () => setOpenHomeworkListModal(true);
    const handleCloseHomeworkListModal = () => setOpenHomeworkListModal(false);

    return (         
        <Modal            
            open={isOpen}
            onClose={handleClosing}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="modal">                
                <h1 style={{margin: 0}}>{data.data.isLesson ? "Lesson" : "Homework"}</h1>
                <TextField 
                    id="title" 
                    label="Title" 
                    variant="standard"  
                    ref={titleRef}                      
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}                                            
                    margin="normal"                                                                                 
                    style={{width:235}}                                        
                    disabled
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
                    disabled        
                />  
                <br/><br/>
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
                                    />
                            }                        
                            readOnly
                        />
                    </LocalizationProvider>
                    <br/><br/>
                </>}                
                
                {data.data.downloadLink !== undefined ? 
                    <><Link href={data.data.downloadLink}>Download file</Link><br/><br/></>
                : <></>}         

                {data.data.isLesson || IsUserTeacher ? <></> :
                <>
                    <Button variant="outlined" component="label" disabled={deadline < Date.now()}> 
                        Upload File
                        <input type="file" ref={fileRef} onChange={handleChangeFile} hidden />
                    </Button>                    
                    <Typography>
                        {fileName}
                    </Typography>                                  
                    <br/>
                </>}       
                
                {fileName.length > 0 ? 
                <>                    
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <Button variant="contained" color="primary" onClick={handleSendFile}>Accept</Button>
                        <Button variant="contained" color="primary" onClick={handleClosing}>Close</Button>
                    </div>  
                </> 
                : <></>}                                    
                
                {IsUserTeacher ? 
                <>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <Button variant="contained" color="primary" onClick={handleOpenHomeworkListModal}>Look Files</Button>
                        <Button variant="contained" color="primary" onClick={handleClosing}>Close</Button>
                    </div>  
                </>
                : <></>}

                {!IsUserTeacher && fileName.length === 0 ? 
                <>
                    <Button variant="contained" color="primary" onClick={handleClosing}>Close</Button>
                </>
                : <></>}

                <HomeworkListModal 
                    handleClose={handleCloseHomeworkListModal} 
                    isOpen={openHomeworkListModal} 
                    id={data.id}                    
                />

            </Box>            
        </Modal>     
                                  
  );
}

export default OpenLessonModal;