import React, { useState } from "react";

import OpenLessonModal from "../components/OpenLessonModal";
//Mui
import { Card, CardActions, CardContent, Button, Typography } from '@mui/material';
import AlertModal from "./AlertModal";
import { DeleteHomework, DeleteLesson } from "../Data/db";
import EditLessonModal from "./EditLessonModal";

const LessonCard = ({data, IsUserTeacher, LoadLessons}) => {        
    const date = new Date(data.data.creationDate);

    const [open, setOpen] = useState(false);    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);        

    const [openModalLesson, setOpenModalLesson] = useState(false);
    const handleOpenModalLesson = () => setOpenModalLesson(true);
    const handleCloseModalLesson = () => setOpenModalLesson(false);

    const [openModalEditLesson, setOpenModalEditLesson] = useState(false);
    const handleOpenModalEditLesson = () => setOpenModalEditLesson(true);
    const handleCloseModalEditLesson = () => setOpenModalEditLesson(false);

    const [openModalAlert, setOpenModalAlert] = useState(false);
    const handleOpenModalAlert = () => setOpenModalAlert(true);
    const handleCloseModalAlert = () => setOpenModalAlert(false);
    
    const handleClickAlert = async () => {
        if(data.data.isLesson)
            await DeleteLesson(data.id);
        else
            await DeleteHomework(data.id);
        await LoadLessons();
        handleCloseModalAlert();
    }
    return(                            
        <>
            <Card sx={{ minWidth: 150 }}>            
                <CardContent sx={{pb:0}}>     
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {data.data.isLesson ? "Lesson" : "Homework"} | {date.toDateString()}
                    </Typography>           
                    <Typography variant="h5" component="div">
                        {data.data.title}
                    </Typography>                
                    <Typography variant="body1">
                        {data.data.description}
                    </Typography>
                </CardContent>
                <CardActions style={{display: "flex", justifyContent: "space-between"}}>                    
                        <Button variant="contained" color="primary" onClick={handleOpenModalLesson} size="small">Open</Button>
                        {IsUserTeacher ?                         
                        <>
                            <Button variant="contained" color="primary" onClick={handleOpenModalEditLesson} size="small">Edit</Button>                                                 
                            <Button variant="contained" color="error" onClick={handleOpenModalAlert} size="small">Delete</Button>
                        </>
                        : <></> }
                     
                </CardActions>
            </Card>        
                        
            <OpenLessonModal 
                handleClose={handleCloseModalLesson} 
                isOpen={openModalLesson} 
                data={data}
                IsUserTeacher={IsUserTeacher}
            />
            <EditLessonModal
                handleClose={handleCloseModalEditLesson}
                isOpen={openModalEditLesson}            
                LoadLessons={LoadLessons}   
                data={data}             
            />
            <AlertModal 
                handleClose={handleCloseModalAlert} 
                isOpen={openModalAlert} 
                handleClick={handleClickAlert} 
                description={`Are you sure you want to delete the ${data.isLesson ? "lesson" : "homework"}?`}
            />
        </>
    );
}

export default LessonCard;