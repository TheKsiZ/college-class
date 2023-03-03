import React, { useEffect, useState } from 'react';

import AlertModal from "../../components/AlertModal";
//Mui
import { ThemeProvider, Box, List, ListItem, IconButton, ListItemText, Divider, Tooltip, CircularProgress } from "@mui/material";
import Theme from "../../muiComponents/MUIBlackTheme";
import NaviagtionRoom from "../../components/NavigationRoom";
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import "../../styles/users.css";
//Firebase
import { GetIsUserOwner, GetRoomByCode, GetRoomCode, GetUserByRef, IsCodeActive, SwitchToTeachers, SwitchToUsers, KickFromRoom } from '../../Data/db';

const Users = () => {
    IsCodeActive();

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
        await LoadUsers();
        handleCloseModalAlert();
    }

    const handleClickKick = async () => {        
        setDescAlert("Are you sure you want to kick the user?");
        setAction("kick");
        handleOpenModalAlert(id);
    }
    const handleClickTeacherMove = async () => {        
        setDescAlert("Are you sure you want to move the user to Users?");
        setAction("teacher-move");
        handleOpenModalAlert(id);
    }
    const handleClickUserMove = async () => {
        setDescAlert("Are you sure you want to move the user to Teachers?");
        setAction("user-move");
        handleOpenModalAlert(id);
    }

    return(
        <>
            <ThemeProvider theme={Theme}>
                <NaviagtionRoom/>            

                {!progress ? <CircularProgress className="users-div" /> : (                                  
                    <Box className='users-list'>
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>                    
                            
                            {teachers.length !== 0 ? 
                            <>                        
                                <ListItem>
                                    <ListItemText primary={"Teachers"}/>
                                </ListItem>
                                <Divider/>
                                {teachers.map((el, index) => {
                                    return(
                                        <ListItem
                                            sx={{"&:hover": { bgcolor: '#E7E7E7', transition: '0.5s' } }}                                        
                                            key={index}
                                            secondaryAction={(
                                                GetIsUserOwner() ? 
                                                    <>
                                                        <Tooltip title="Move to Users">
                                                            <IconButton aria-label="options" onClick={() => {setId(el.id); handleClickTeacherMove();}}>
                                                                <ArrowDownwardIcon />
                                                            </IconButton>                                                                             
                                                        </Tooltip>                    
                                                        <Tooltip title="Kick">
                                                            <IconButton aria-label="options" onClick={() => {setId(el.id); handleClickKick()}}>
                                                                <LogoutIcon />
                                                            </IconButton>  
                                                        </Tooltip>                       
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
                                    <ListItemText primary={"Users"}/>                        
                                </ListItem>            
                                <Divider/>
                                {users.map((el, index) => {
                                    return(                                
                                        <ListItem                                     
                                            sx={{"&:hover": { bgcolor: '#E7E7E7', transition: '0.5s' } }}  
                                            key={index}                                      
                                            secondaryAction={(
                                                GetIsUserOwner() ? 
                                                    <>
                                                        <Tooltip title="Move to Teachers">
                                                            <IconButton aria-label="options" onClick={() => {setId(el.id); handleClickUserMove();}}>
                                                                <ArrowUpwardIcon />
                                                            </IconButton>                                                                             
                                                        </Tooltip>                    
                                                        <Tooltip title="Kick">
                                                            <IconButton aria-label="options" onClick={() => {setId(el.id); handleClickKick()}}>
                                                                <LogoutIcon />
                                                            </IconButton>  
                                                        </Tooltip>                       
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

            </ThemeProvider>
        </>
    );
}

export default Users;