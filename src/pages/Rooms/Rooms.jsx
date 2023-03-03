import React, { useState, useEffect } from "react";

//Components
import Navigation from "../../components/Navigation";
import RoomCard from "../../components/RoomCard";
//Mui
import { Box, ThemeProvider, SpeedDial, SpeedDialIcon, SpeedDialAction, Grid, CircularProgress } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import JoinIcon from '@mui/icons-material/Login';
import Theme from "../../muiComponents/MUIBlackTheme";

import "../../styles/rooms.css";
import Join from "../../components/Join";
import Create from "../../components/Create";

//Firebase
import { IsUserAuthorized, GetUserByRef, GetRoom, GetUser, SetUserToLocal } from "../../Data/db";


const Rooms = () => {    
    IsUserAuthorized(); 

    const [user, setUser] = useState(GetUser());  
    const handleSetUser = () => setUser(GetUser());

    const [rooms, setRooms] = useState([]);
    const [progress, setProgress] = useState(false);
    const LoadRooms = async () => {                
        await SetUserToLocal();
        handleSetUser();
        
        await user.rooms.map(async (element)=>{               
            const roomData = await GetRoom(element);                   
            const ownerData = await GetUserByRef(roomData.data.owner);            
            const room = {
                roomData: roomData,
                ownerData: ownerData,
            }
            setRooms(rooms => [...rooms, room]);
        })
        setProgress(true);
    }    
    useEffect(() => {
        LoadRooms();        
    }, []);

    const actions = [
        { icon: <JoinIcon />, name: 'Join' },
        { icon: <AddIcon />, name: 'Create'},                
      ];

    const [open, setOpen] = useState(false);    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);        
    
    const [openModalJoin, setOpenModalJoin] = useState(false);
    const handleOpenModalJoin = () => setOpenModalJoin(true);
    const handleCloseModalJoin = () => setOpenModalJoin(false);

    const [openModalCreate, setOpenModalCreate] = useState(false);
    const handleOpenModalCreate = () => setOpenModalCreate(true);
    const handleCloseModalCreate = () => setOpenModalCreate(false);

    const handleClick = (e, actionName) => {
        switch(actionName){
            case 'Join':
                setOpenModalJoin(true);
                break;
            case 'Create':
                setOpenModalCreate(true);
                break;
        }        
    }    

    return(
        <>            
            <ThemeProvider theme={Theme}>
                <Navigation/>                
                {!progress ? <CircularProgress className="rooms-div" /> : (
                    <Box sx={{m: 2}}>
                        <Grid container rowSpacing={1} columnSpacing={1} >                                                       
                            {rooms.map((el) => {                                 
                                return(
                                    <Grid item xs={3} key={el.roomData.id}>
                                        <RoomCard                                             
                                            data={el}                                                                                    
                                        />
                                    </Grid>
                                );                                         
                            })}
                        </Grid>
                    </Box>
                )}
                

                <Join handleClose={handleCloseModalJoin} isOpen={openModalJoin}/>                    
                <Create handleClose={handleCloseModalCreate} isOpen={openModalCreate}/>

                <SpeedDial
                    ariaLabel="Create/Join"
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
                            onClick={(e) => handleClick(e,action.name)}
                        />
                    ))}
                </SpeedDial>                
            </ThemeProvider>            
        </>
    );
}

export default Rooms;