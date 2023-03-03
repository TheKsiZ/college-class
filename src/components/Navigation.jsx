import React from "react";
import { useState } from "react";

//Mui
import { Link, AppBar, Toolbar, IconButton, Box, Typography, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import Image from 'mui-image';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from "../images/LogoWhite.png";

import "../styles/rooms.css";

//Firebase
import { GetUser, SignOut } from "../Data/db";

const Naviagtion = () => {

    const [user, setUser] = useState(GetUser());   

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
        window.location.href = "/rooms";
    }

    const handleUserProfileClick = () => {
        window.location.href = "/rooms/profile";
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
                <ListItem key="userprofile" disablePadding>
                    <ListItemButton onClick={handleUserProfileClick}>                        
                        <ListItemText primary="User Profile" />
                    </ListItemButton>
                </ListItem>                
            </List>                         
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
                            shift="right" distance="100px"
                            shiftDuration={1500}
                            bgColor="inherit"                                                         
                        />
                    </Link>                                
                    <Typography>Hello, {user.firstName}!</Typography>                                                                                                                 
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Naviagtion;