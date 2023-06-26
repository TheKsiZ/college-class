import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
//Mui
import NavigationRoom from "../../components/NavigationRoom";
import { Box, Backdrop, ThemeProvider, CircularProgress, SpeedDial, SpeedDialIcon, SpeedDialAction, Typography } from "@mui/material";
import Theme from "../../muiComponents/MUIBlackTheme";
import "../../styles/rooms.css";
import TaskIcon from '@mui/icons-material/Book';
import LessonIcon from '@mui/icons-material/ImportContacts';
import TestIcon from '@mui/icons-material/Ballot';

import CreateLessonModal from "../../components/CreateLessonModal";
import CreateTaskModal from "../../components/CreateTaskModal";
//Firebase
import { GetRoomCode, GetLesson, IsCodeActive, GetRoomByCode, RemoveTestCode, GetIsUserTeacher } from '../../Data/db';
import LessonCard from '../../components/LessonCard';
import { useNavigate } from 'react-router-dom';

const Room = () => {        
    IsCodeActive();
    RemoveTestCode();
    
    const navigate = useNavigate();

    const { t } = useTranslation();
    
    const [progress, setProgress] = useState(false);
    const [lessons, setLessons] = useState([]);
    const LoadLessons = async () => {      
        setLessons([]);  
        setProgress(false);
                       
        const room = await GetRoomByCode(GetRoomCode());                        
        await Promise.all(await room.lessons.map(async (element) => {            
            const data = await GetLesson(element);
            const lesson = {
                id: element.id,
                data: data,
            }             
            setLessons(lessons => [...lessons, lesson]);            
        }));
        setProgress(true);
    }
    useEffect(() => {
        LoadLessons();                
    }, []);

    const actions = [
        { icon: <LessonIcon />, name: t("lesson_action")},
        { icon: <TaskIcon />, name: t("task_action")},          
        { icon: <TestIcon />, name: t("test_action")},                
      ];

    const [open, setOpen] = useState(false);    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);        
    
    const [openModalCreateLesson, setOpenModalCreateLesson] = useState(false);
    const handleOpenModalCreateLesson = () => setOpenModalCreateLesson(true);
    const handleCloseModalCreateLesson = () => setOpenModalCreateLesson(false);

    const [openModalCreateTask, setOpenModalCreateTask] = useState(false);
    const handleOpenModalCreateTask = () => setOpenModalCreateTask(true);
    const handleCloseModalCreateTask = () => setOpenModalCreateTask(false);

    const [backdropOpen, setBackdropOpen] = useState(false);
    const handleBackdrop = (state) => setBackdropOpen(state);

    const handleClick = async (e, actionName) => {        
        switch(actionName){
            case t("lesson_action"):                
                handleOpenModalCreateLesson();                                
                break;
            case t("task_action"):
                handleOpenModalCreateTask();
                break;
            case t("test_action"):
                navigate("/room/test");
                break;
            default:
                break;
        }        
    }    

    return(        
        <>
            <ThemeProvider theme={Theme}>
                <NavigationRoom/>
                
                {!progress ? <CircularProgress className="rooms-div" /> : (
                    <div 
                        style={{
                            margin: "auto",                            
                            display: "flex", 
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "flex-start",

                        }}
                    >                        
                            {
                                lessons.length !== 0 ?
                                    lessons.map((el, index) => {                                      
                                        return(                                                                        
                                                <LessonCard     
                                                    key={index}                                        
                                                    data={el}                                            
                                                    LoadLessons={LoadLessons}
                                                    handleBackdrop={handleBackdrop}
                                                />                                    
                                        );                                         
                                    })
                                :
                                <>
                                    <Box sx={{ m: "auto", color: "#163526", textAlign: "center"}}>
                                        <Typography fontSize={48}>
                                            {t("empty")}
                                        </Typography>
                                        {
                                            GetIsUserTeacher() ?
                                            <Typography>
                                                {t("empty_room_teacher")}
                                            </Typography>
                                            :
                                            <Typography>
                                                {t("empty_room")}
                                            </Typography>
                                        }                                        
                                    </Box>   
                                </>
                            }                     
                    </div>
                )}

                <CreateLessonModal 
                    handleClose={handleCloseModalCreateLesson} 
                    isOpen={openModalCreateLesson}
                    LoadLessons={LoadLessons}
                    handleBackdrop={handleBackdrop}
                />
                <CreateTaskModal 
                    handleClose={handleCloseModalCreateTask} 
                    isOpen={openModalCreateTask}
                    LoadLessons={LoadLessons}
                    handleBackdrop={handleBackdrop}
                />

                {GetIsUserTeacher() ? 
                <>
                    <SpeedDial
                        ariaLabel="Create Lesson/Task/Test"
                        sx={{ position: 'fixed', bottom: 16, right: 16 }}
                        icon={<SpeedDialIcon />}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        open={open}
                    >
                        {actions.map((action) => (
                            <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                onClick={(e) => handleClick(e, action.name)}
                            />
                        ))}
                    </SpeedDial>  
                </> 
                : <></>}       

                <Backdrop                    
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
                    open={backdropOpen}                    
                >
                    <Box sx={{m: "auto"}}>
                        <CircularProgress  />
                    </Box>
                </Backdrop>         
            </ThemeProvider>
        </>
    );
}

export default Room;