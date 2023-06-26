import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
//Mui
import { Box, Button, Modal, TextField, Link, Typography } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import "../styles/rooms.css";
import { SendTaskFile, GetIsUserTeacher, IsUserStillInRoom } from "../Data/db";

import TaskListModal from "./TaskListModal";
import { useNavigate } from "react-router-dom";

const OpenLessonModal = ({isOpen, handleClose, data, handleBackdrop}) => {          
    const navigate = useNavigate();
    if(!IsUserStillInRoom()){
        navigate('/rooms');
    }      

    const { t, i18n } = useTranslation();
    const [title, setTitle] = useState(data.data.title);
    const titleRef = useRef();
    
    const [description, setDescription] = useState(data.data.description);
    const descriptionRef = useRef();        

    const [deadline, setDeadline] = useState(data.data.deadline);       

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
        handleBackdrop(true);       
        await SendTaskFile(data.id, fileRef.current.files[0]);
        handleBackdrop(false);
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
                    InputProps={{
                        readOnly: true,
                    }}
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
                    maxRows={4}
                    multiline     
                    InputProps={{
                        readOnly: true,
                    }}
                    fullWidth={true}
                />  
                <br/><br/>
                {data.data.type === "lesson" ? <></> : 
                <>
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
                                    />
                            }                        
                            readOnly
                        />
                    </LocalizationProvider>
                    <br/><br/>
                </>}                
                
                {data.data.downloadLink !== undefined ? 
                    <><Typography sx={{mb: 2}}><Link href={data.data.downloadLink}>{t("download_file")}</Link></Typography></>
                : <></>}         

                {data.data.type === "lesson" || GetIsUserTeacher() ? <></> :
                <>
                    <Button variant="outlined" component="label" disabled={deadline < Date.now()} fullWidth={true}> 
                        {t("upload_file")}
                        <input type="file" ref={fileRef} onChange={handleChangeFile} hidden />
                    </Button>                    
                    <Typography>
                        {fileName}
                    </Typography>                                  
                    <br/>
                </>}       
                
                {fileName.length > 0 && !GetIsUserTeacher() ? 
                <>                    
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <Button sx={{marginRight: 1}} variant="contained" color="primary" onClick={handleSendFile} fullWidth={true}>{t("accept")}</Button>
                        <Button variant="contained" color="primary" onClick={handleClosing} fullWidth={true}>{t("close")}</Button>
                    </div>  
                </> 
                :
                !GetIsUserTeacher() ? 
                <>
                    <Button variant="contained" color="primary" onClick={handleClosing} fullWidth={true}>{t("close")}</Button>
                </> 
                :
                <></>}                                    
                
                {data.data.type !== "lesson" && GetIsUserTeacher() ? 
                <>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <Button sx={{marginRight: 1}} variant="contained" color="primary" onClick={handleOpenHomeworkListModal} fullWidth={true}>{t("look_files")}</Button>
                        <Button variant="contained" color="primary" onClick={handleClosing} fullWidth={true}>{t("close")}</Button>
                    </div>  
                </>
                : 
                GetIsUserTeacher() ?
                <>
                    <Button variant="contained" color="primary" onClick={handleClosing} fullWidth={true}>{t("close")}</Button>
                </>
                :
                <></>}

                <TaskListModal 
                    handleClose={handleCloseHomeworkListModal} 
                    isOpen={openHomeworkListModal} 
                    id={data.id}       
                    handleBackdrop={handleBackdrop}             
                />

            </Box>            
        </Modal>     
                                  
  );
}

export default OpenLessonModal;