import React, { useState, useContext } from "react";
import { Context } from "../index";
//Mui
import { Link, AppBar, Toolbar, IconButton, Box, Typography, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import Image from 'mui-image';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from "../images/LogoWhite.png";

import "../styles/rooms.css";

//Firebase
import { useTranslation } from "react-i18next";
import { GetUser, SignOut } from "../Data/db";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

const Naviagtion = () => {
    const { auth } = useContext(Context);
    const navigate = useNavigate();

    const [user, setUser] = useState(GetUser());   
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
        navigate("/rooms");        
    }

    const handleUserProfileClick = () => {
        navigate("/rooms/profile");        
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
                <ListItem key="userprofile" disablePadding>
                    <ListItemButton onClick={handleUserProfileClick}>                        
                        <ListItemText primary={t("user_profile")} />
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
                    <Typography>{t("hello")}, {user.firstName}!</Typography>                                                                                                                 
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Naviagtion;