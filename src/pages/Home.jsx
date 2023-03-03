import React from "react";
//import Typed from "react-typed";
//Mui
import { Box, Button, ThemeProvider } from "@mui/material";
import Image from 'mui-image';
import Logo from "../images/LogoBlack.png";
import Theme from "../muiComponents/MUIBlackTheme";
import "../styles/home.css";

const Home = () => {
    
    const handleClick = () => {
        window.location.href = "/login";
    }
    
    return(
        <>
            <ThemeProvider theme={Theme}>
                <div className="home-div">
                    <Image                                 
                        sx={{mb: 3}}
                        src={Logo} alt="College Class" 
                        height="10%" width="600px" fit="contain"
                        duration={5000} easing="ease"
                        showLoading={true} errorIcon={false}    
                        shift="bottom" distance="100px"
                        shiftDuration={1500}
                        bgColor="inherit"                                                         
                    />
                    <div className="animated-text">
                        <p>Easy to learn. Easy to study.</p>
                        {/* <Typed 
                            strings={[
                                "Easy to learn.",
                                "Easy to study.",
                                "Knowledge is power!"   
                            ]}
                            typeSpeed={150}
                            backSpeed={100}
                            loop
                        /> */}
                    </div>                    
                    <Button className="home-button" sx={{mt: 3}} variant="contained" color="primary" onClick={handleClick}>Join now!</Button>
                </div>
            </ThemeProvider>
        </>
    );
}

export default Home;