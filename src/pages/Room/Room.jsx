import React, { useEffect, useState } from 'react';

//Mui
import NavigationRoom from "../../components/NavigationRoom";
import { Box, ThemeProvider, Grid, CircularProgress, SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import Theme from "../../muiComponents/MUIBlackTheme";
import "../../styles/rooms.css";
import LessonIcon from '@mui/icons-material/Book';
import HomeworkIcon from '@mui/icons-material/ImportContacts';

import CreateLessonModal from "../../components/CreateLessonModal";
import CreateHomeworkModal from "../../components/CreateHomeworkModal";
//Firebase
import { GetRoomCode, GetLesson, IsCodeActive, GetRoomByCode, IsUserTeacher } from '../../Data/db';
import LessonCard from '../../components/LessonCard';

const Room = () => {        
    IsCodeActive();
    const [isTeacher, setTeacher] = useState();
    
    const [progress, setProgress] = useState(false);
    const [lessons, setLessons] = useState([]);
    const LoadLessons = async () => {      
        setLessons([]);  
        setProgress(false);
         
        setTeacher(await IsUserTeacher());                
        const room = await GetRoomByCode(GetRoomCode());                        
        await room.lessons.map(async (element) => {            
            const data = await GetLesson(element);
            const lesson = {
                id: element.id,
                data: data,
            }             
            setLessons(lessons => [...lessons, lesson]);            
        });
        setProgress(true);
    }
    useEffect(() => {
        LoadLessons();                
    }, []);

    const actions = [
        { icon: <LessonIcon />, name: 'Create lesson' },
        { icon: <HomeworkIcon />, name: 'Create homework'},                
      ];

    const [open, setOpen] = useState(false);    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);        
    
    const [openModalCreateLesson, setOpenModalCreateLesson] = useState(false);
    const handleOpenModalCreateLesson = () => setOpenModalCreateLesson(true);
    const handleCloseModalCreateLesson = () => setOpenModalCreateLesson(false);

    const [openModalCreateHomework, setOpenModalCreateHomework] = useState(false);
    const handleOpenModalCreateHomework = () => setOpenModalCreateHomework(true);
    const handleCloseModalCreateHomework = () => setOpenModalCreateHomework(false);

    const handleClick = async (e, actionName) => {        
        switch(actionName){
            case 'Create lesson':                
                handleOpenModalCreateLesson();                                
                break;
            case 'Create homework':
                handleOpenModalCreateHomework();
                break;
        }        
    }    

    return(        
        <>
            <ThemeProvider theme={Theme}>
                <NavigationRoom/>
                
                {!progress ? <CircularProgress className="rooms-div" /> : (
                    <Box sx={{m: 2}}>
                        <Grid container rowSpacing={1} columnSpacing={1} >                                
                            {lessons.map((el, index) => {                                      
                                return(
                                    <Grid item xs={3} key={index}>
                                        <LessonCard 
                                            data={el}
                                            IsUserTeacher={isTeacher}
                                            LoadLessons={LoadLessons}
                                        />
                                    </Grid>
                                );                                         
                            })}
                        </Grid>
                    </Box>
                )}

                <CreateLessonModal 
                    handleClose={handleCloseModalCreateLesson} 
                    isOpen={openModalCreateLesson}
                    LoadLessons={LoadLessons}
                />
                <CreateHomeworkModal 
                    handleClose={handleCloseModalCreateHomework} 
                    isOpen={openModalCreateHomework}
                    LoadLessons={LoadLessons}
                />

                {isTeacher ? 
                <>
                    <SpeedDial
                        ariaLabel="Create Lesson/Homework"
                        sx={{ position: 'absolute', bottom: 16, right: 16 }}
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
            </ThemeProvider>
        </>
    );
}

export default Room;