import React from "react";
import { useState } from "react";

//Mui
import { Link, AppBar, Toolbar, IconButton, Box, Typography, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import Image from 'mui-image';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from "../images/LogoWhite.png";

import "../styles/rooms.css";
//Firebase
import { GetIsUserOwner, GetRoomCode, GetUserId, KickFromRoom, RemoveRoomCode, SetUserToLocal, SignOut } from "../Data/db";

const NaviagtionRoom = () => {    

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
        window.location.href = "/room";
    }

    const handleRoomsClick = () => {     
        window.location.href = "/rooms";
    }

    const handleUsersClick = () => {
        window.location.href = "/room/users";
    }

    const handleSettingsClick = () => {
        window.location.href = "/room/settings";
    }

    const handleLeaveClick = async () => {
        await KickFromRoom(GetUserId());
        await SetUserToLocal();
        RemoveRoomCode();
        window.location.href = "/rooms";
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
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>                
            </List>     
            <List>                
                <ListItem key="rooms" disablePadding>
                    <ListItemButton onClick={handleRoomsClick}>                        
                        <ListItemText primary="Rooms" />
                    </ListItemButton>
                </ListItem>                
            </List>            
            <List>                
                <ListItem key="users" disablePadding>
                    <ListItemButton onClick={handleUsersClick}>
                        <ListItemText primary="Users" />
                    </ListItemButton>
                </ListItem>                
            </List>            
            {GetIsUserOwner() ? 
                <List>                
                    <ListItem key="settings" disablePadding>
                        <ListItemButton onClick={handleSettingsClick}>                        
                            <ListItemText primary="Settings" />
                        </ListItemButton>
                    </ListItem>                
                </List>      
            : <></>}
            {!GetIsUserOwner() ? 
                <List>                
                    <ListItem key="leave" disablePadding>
                        <ListItemButton onClick={handleLeaveClick}>                        
                            <ListItemText primary="Leave from room" />
                        </ListItemButton>
                    </ListItem>                
                </List>      
            : <></>}
            <List style={{position:"absolute", bottom: "0px", width: "100%"}}>                
                <ListItem key="signout" disablePadding>
                    <ListItemButton onClick={SignOut}>                        
                        <ListItemText primary="Sign Out" />
                    </ListItemButton>
                </ListItem>                
            </List>                  
        </Box>
    );

    return(
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
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
                        <Typography>Code: {GetRoomCode()}</Typography>                                                                                                
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default NaviagtionRoom;