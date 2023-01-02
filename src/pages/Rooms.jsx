import React from "react";
//    <Button  color="inherit" sx={{ flexGrow: 1 }}  >Sign Out</Button>   
import { Button, Link, ThemeProvider, AppBar, Toolbar, IconButton, Box } from "@mui/material";
import Image from 'mui-image';
import MenuIcon from '@mui/icons-material/Menu';
import Theme from "../muiComponents/MUIBlackTheme";
import Logo from "../images/LogoWhite.png";
import "../styles/rooms.css";
const Rooms = () => {
    return(
        <>
            <ThemeProvider theme={Theme}>
                <Box >
                    <AppBar position="static" >
                        <Toolbar>
                            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                                <MenuIcon/>
                            </IconButton>
                            
                            <Link href="/">
                                <Image                                 
                                    src={Logo} alt="College Class" 
                                    height="10%" width="20%" fit="contain"
                                    duration={5000} easing="ease"
                                    showLoading={true} errorIcon={false}    
                                    shift="bottom" distance="100px"
                                    shiftDuration={1500}
                                    bgColor="inherit"   
                                    sx={{display: 'flex', justifyContent: 'center', width: '100%', flexGrow: 1}}                     
                                />
                            </Link>   

                                          
                        </Toolbar>
                    </AppBar>
                </Box>
                <p>Rooms main page</p>
                <Button variant="contained">Create</Button>
                <Button variant="contained">Join</Button>
            </ThemeProvider>
            
            
        </>
    );
}

export default Rooms;