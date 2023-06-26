import React, { useContext } from "react";
import { Context } from "../index";
//Mui
import { Link, AppBar, Toolbar, IconButton, Box, Typography, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import Image from 'mui-image';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from "../images/LogoWhite.png";

import "../styles/rooms.css";
import { useTranslation } from "react-i18next";
//Firebase
import { GetIsUserOwner, GetRoomCode, GetUserId, IsUserStillInRoom, KickFromRoom, RemoveRoomCode, SetUserToLocal, SignOut } from "../Data/db";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useEffect } from "react";

const NaviagtionRoom = () => {        
    const { auth } = useContext(Context);
    const navigate = useNavigate();
    
    IsUserStillInRoom();

    const { t, i18n } = useTranslation();
    const {setTranslation} = useContext(Context);
    const changeLanguage = (language) => {
        setTranslation(language);
    } 

    //Sidebar
    const [state, setState] = React.useState({        
        left: false,                
    });

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
        }

        setState({ ...state, "left": open });
    };

    const handleHomeClick = () => {        
        navigate("/room")
    }

    const handleRoomsClick = () => {     
        navigate("/rooms");
    }

    const handleUsersClick = () => {
        navigate("/room/users")
    }

    const handleStatisticsClick =  () => {
        navigate("/room/statistics")     
    }

    const handleSettingsClick =  () => {
        navigate("/room/settings")       
    }

    const handleLeaveClick = async () => {
        await KickFromRoom(GetUserId());
        await SetUserToLocal();
        RemoveRoomCode();
        navigate("/rooms");
    }
    
    const handleSignOut = () => {
        signOut(auth).then().catch((e) => console.log(e));
        SignOut();
        navigate("/login");
    }

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>                
                <ListItem key="home" disablePadding>
                    <ListItemButton onClick={handleHomeClick}>                        
                        <ListItemText primary={t("home")} />
                    </ListItemButton>
                </ListItem>                
            </List>                          
            <List>                
                <ListItem key="users" disablePadding>
                    <ListItemButton onClick={handleUsersClick}>
                        <ListItemText primary={t("users")} />
                    </ListItemButton>
                </ListItem>                
            </List>      
            <List>                
                <ListItem key="statistics" disablePadding>
                    <ListItemButton onClick={handleStatisticsClick}>
                        <ListItemText primary={t("statistics")} />
                    </ListItemButton>
                </ListItem>                
            </List>        
            {GetIsUserOwner() ? 
                <List>                
                    <ListItem key="settings" disablePadding>
                        <ListItemButton onClick={handleSettingsClick}>                        
                            <ListItemText primary={t("settings")} />
                        </ListItemButton>
                    </ListItem>                
                </List>      
            : <></>}
            <List>                
                <ListItem key="rooms" disablePadding>
                    <ListItemButton onClick={handleRoomsClick}>                        
                        <ListItemText primary={t("rooms")} />
                    </ListItemButton>
                </ListItem>                
            </List>   
            {
                i18n.language === "ru" ?
                <List>                
                    <ListItem key="language" disablePadding>
                        <ListItemButton onClick={() => changeLanguage("en")}>                        
                            <ListItemText primary="English" />
                        </ListItemButton>
                    </ListItem>                
                </List>        
                :
                <List>                
                    <ListItem key="language" disablePadding>
                        <ListItemButton onClick={() => changeLanguage("ru")}>                        
                            <ListItemText primary="Русский" />
                        </ListItemButton>
                    </ListItem>                
                </List>    
            }       
            {!GetIsUserOwner() ? 
                <List>                
                    <ListItem key="leave" disablePadding>
                        <ListItemButton onClick={handleLeaveClick}>                        
                            <ListItemText primary={t("leave_room")} />
                        </ListItemButton>
                    </ListItem>                
                </List>      
            : <></>}                     
            <List style={{position:"absolute", bottom: "0px", width: "100%"}}>                
                <ListItem key="signout" disablePadding>
                    <ListItemButton onClick={handleSignOut}>                        
                        <ListItemText primary={t("sign_out")} />
                    </ListItemButton>
                </ListItem>                
            </List>                  
        </Box>
    );

    return(
        <Box sx={{flexGrow: 1, mt: 8}}>
            <AppBar position="fixed">
                <Toolbar>
                        <React.Fragment key="left">
                            <IconButton onClick={toggleDrawer(true)} size="large" edge="start" color="inherit" aria-label="menu">
                                <MenuIcon/>
                            </IconButton>                                                                                                                                               
                            <Drawer                                        
                                anchor="left"
                                open={state["left"]}
                                onClose={toggleDrawer(false)}
                            >
                                {list("left")}
                            </Drawer>
                        </React.Fragment>
                        
                        <Link href="/" sx={{ml: 2, flexGrow: 1}}>
                            <Image                                 
                                src={Logo} alt="College Class" 
                                height="10%" width="200px" fit="contain"
                                duration={5000} easing="ease"
                                showLoading={true} errorIcon={false}    
                                shift="bottom" distance="100px"
                                shiftDuration={1500}
                                bgColor="inherit"                                                         
                            />
                        </Link>                                        
                        <Typography>{t("code")}: {GetRoomCode()}</Typography>                                                                                                
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default NaviagtionRoom;