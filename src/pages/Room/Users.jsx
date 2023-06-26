import React, { useEffect, useState } from 'react';

import AlertModal from "../../components/AlertModal";
import { useTranslation } from "react-i18next";
//Mui
import { Backdrop, ThemeProvider, Box, List, ListItem, IconButton, ListItemText, Divider, Tooltip, CircularProgress } from "@mui/material";
import Theme from "../../muiComponents/MUIBlackTheme";
import NaviagtionRoom from "../../components/NavigationRoom";
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import "../../styles/users.css";
//Firebase
import { GetIsUserOwner, GetRoomByCode, GetRoomCode, GetUserByRef, IsCodeActive, SwitchToTeachers, SwitchToUsers, KickFromRoom, RemoveTestCode, IsUserTeacher, GetUserId } from '../../Data/db';

const Users = () => {
    IsCodeActive();
    RemoveTestCode();
    const { t } = useTranslation();

    const [backdropOpen, setBackdropOpen] = useState(false);
    const handleBackdrop = (state) => setBackdropOpen(state);

    const [users, setUsers] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [progress, setProgress] = useState(false);
    const LoadUsers = async () => {                
        const roomData = await GetRoomByCode(GetRoomCode());
        
        await roomData.teachers.map(async (element) => {
            const teacher = await GetUserByRef(element);                  
            setTeachers(teachers => [...teachers, teacher]);
        });        
        await roomData.users.map(async (element) => {
            const user = await GetUserByRef(element);                  
            setUsers(users => [...users, user]);
        });        
        setProgress(true);
    }
    useEffect(() => {
        LoadUsers();        
    }, []);

    const [id, setId] = useState('');
    const [descAlert, setDescAlert] = useState('');
    const [action, setAction] = useState('');
    const [openModalAlert, setOpenModalAlert] = useState(false);
    const handleOpenModalAlert = () => setOpenModalAlert(true);
    const handleCloseModalAlert = () => setOpenModalAlert(false);

    const handleClickModalAlert = async () => {  

        handleBackdrop(true);
        setUsers([]);
        setTeachers([]);              
        switch(action){
            case "kick":                
                await KickFromRoom(id); 
                break;
            case "teacher-move":                
                await SwitchToUsers(id);
                break;
            case "user-move":
                await SwitchToTeachers(id);
                break;
            default:
                break;
        }        
        setProgress(false);        
        await IsUserTeacher();
        await LoadUsers();

        handleBackdrop(false);
        handleCloseModalAlert();
    }

    const handleClickKick = async () => {                
        setDescAlert(t("alert_kick_user"));
        setAction("kick");
        handleOpenModalAlert(id);
    }
    const handleClickTeacherMove = async () => {        
        setDescAlert(t("alert_teacher_move"));
        setAction("teacher-move");
        handleOpenModalAlert(id);
    }
    const handleClickUserMove = async () => {
        setDescAlert(t("alert_user_move"));
        setAction("user-move");
        handleOpenModalAlert(id);
    }
    
    return(
        <>
            <ThemeProvider theme={Theme}>
                <NaviagtionRoom/>            

                {!progress ? <CircularProgress className="users-div" /> : (                                  
                    <Box className='users-list'>
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', borderRadius: 5, m: 1}}>                    
                            
                            {teachers.length !== 0 ? 
                            <>                        
                                <ListItem>
                                    <ListItemText primary={t("teachers")}/>
                                </ListItem>
                                <Divider/>
                                {teachers.map((el, index) => {
                                    return(
                                        <ListItem
                                            sx={{"&:hover": { bgcolor: '#E7E7E7', transition: '0.5s' }, borderRadius: 5 }}                                        
                                            key={index}
                                            secondaryAction={(
                                                GetIsUserOwner() ? 
                                                    <>
                                                        <Tooltip title={t("move_to_users")}>
                                                            <IconButton aria-label="options" onClick={() => {setId(el.id); handleClickTeacherMove();}}>
                                                                <ArrowDownwardIcon />
                                                            </IconButton>                                                                             
                                                        </Tooltip>   

                                                        {
                                                            el.id === GetUserId() ? <></>
                                                            :
                                                            <Tooltip title={t("kick")}>
                                                                <IconButton aria-label="options" onClick={() => {setId(el.id); handleClickKick()}}>
                                                                    <LogoutIcon />
                                                                </IconButton>  
                                                            </Tooltip>                       
                                                        }                                                            
                                                    </>
                                                    : <></>
                                            )}                                
                                        >                            
                                            <ListItemText primary={`${el.data.firstName} ${el.data.lastName}`} />                            
                                        </ListItem>
                                    )                                    
                                })}
                            </>
                            : <></>}
                                                        
                            {teachers.length !== 0 && users.length !== 0 ? <Divider/> : <></>}                    
                                                
                            {users.length !== 0 ? 
                            <>
                                <ListItem>
                                    <ListItemText primary={t("users_users")}/>                        
                                </ListItem>            
                                <Divider/>
                                {users.map((el, index) => {
                                    return(                                
                                        <ListItem                                     
                                            sx={{"&:hover": { bgcolor: '#E7E7E7', transition: '0.5s' }, borderRadius: 5 }}  
                                            key={index}                                      
                                            secondaryAction={(
                                                GetIsUserOwner() ? 
                                                    <>
                                                        <Tooltip title={t("move_to_teachers")}>
                                                            <IconButton aria-label="options" onClick={() => {setId(el.id); handleClickUserMove();}}>
                                                                <ArrowUpwardIcon />
                                                            </IconButton>                                                                             
                                                        </Tooltip>                    
                                                        {
                                                            el.id === GetUserId() ? <></>
                                                            :
                                                            <Tooltip title={t("kick")}>
                                                                <IconButton aria-label="options" onClick={() => {setId(el.id); handleClickKick()}}>
                                                                    <LogoutIcon />
                                                                </IconButton>  
                                                            </Tooltip>                       
                                                        }                          
                                                    </>
                                                : <></>
                                            )} 
                                        >                            
                                            <ListItemText primary={`${el.data.firstName} ${el.data.lastName}`} />                            
                                        </ListItem>
                                    )                                    
                                })}
                            </> 
                            : <></>}
                                       
                        </List>
                    </Box>     
                )}

                <AlertModal 
                    handleClose={handleCloseModalAlert} 
                    isOpen={openModalAlert} 
                    handleClick={handleClickModalAlert} 
                    description={descAlert}
                />

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

export default Users;