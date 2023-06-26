import React, { useState, useEffect } from "react";
//Components
import Navigation from "../../components/Navigation";
import RoomCard from "../../components/RoomCard";
//Mui
import { Box, Backdrop, ThemeProvider, SpeedDial, SpeedDialIcon, SpeedDialAction, CircularProgress, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import JoinIcon from '@mui/icons-material/Login';
import Theme from "../../muiComponents/MUIBlackTheme";
import { useTranslation } from "react-i18next";
import "../../styles/rooms.css";
import Join from "../../components/Join";
import Create from "../../components/Create";
import { Context } from "../../index";
//Firebase
import { IsUserAuthorized, GetUserByRef, GetRoom, GetUser, SetUserToLocal, RemoveTestCode } from "../../Data/db";


const Rooms = () => {    
    IsUserAuthorized(); 
    RemoveTestCode();

    const { t } = useTranslation();

    const [user, setUser] = useState(GetUser());  
    const handleSetUser = () => setUser(GetUser());

    const [rooms, setRooms] = useState([]);
    const [progress, setProgress] = useState(false);

    const [backdropOpen, setBackdropOpen] = useState(false);
    const handleBackdrop = (state) => setBackdropOpen(state);

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
        { icon: <JoinIcon />, name: t("join_action") },
        { icon: <AddIcon />, name: t("create_action")},                
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
            case t("join_action"):
                handleOpenModalJoin();
                break;
            case t("create_action"):
                handleOpenModalCreate();
                break;
            default:
                break;
        }        
    }    

    return(
        <>            
            <ThemeProvider theme={Theme}>
                <Navigation/>                
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
                            rooms.length !== 0 ?
                                rooms.map((el, index) => {                                 
                                    return(
                                            <RoomCard 
                                                key={index}      
                                                data={el}                                                                                    
                                            />
                                    ); 
                                })
                            :
                            <>              
                                <Box sx={{ m: "auto", color: "#163526", textAlign: "center"}}>
                                    <Typography fontSize={48}>
                                        {t("empty")}
                                    </Typography>
                                    <Typography>
                                        {t("empty_rooms")}
                                    </Typography>
                                </Box>                                                  
                            </>
                        }
                    </div>
                )}                

                <Join
                    handleClose={handleCloseModalJoin} 
                    isOpen={openModalJoin}
                    handleBackdrop={handleBackdrop}
                />                    
                <Create 
                    handleClose={handleCloseModalCreate} 
                    isOpen={openModalCreate}
                    handleBackdrop={handleBackdrop}
                />

                <SpeedDial
                    ariaLabel="Create/Join"
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
                            onClick={(e) => handleClick(e,action.name)}
                        />
                    ))}
                </SpeedDial>     

            <Backdrop                    
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
                open={backdropOpen}                    
            >
                <Box sx={{m: "auto"}}>
                    <CircularProgress />
                </Box>
            </Backdrop>            
            </ThemeProvider>            
        </>
    );
}

export default Rooms;