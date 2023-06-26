import React from "react";
import { useNavigate } from "react-router-dom";

//Mui
import { Box, Button, ThemeProvider, Typography } from "@mui/material";
import Image from 'mui-image';
import Logo from "../images/LogoBlack.png";
import Theme from "../muiComponents/MUIBlackTheme";
import "../styles/home.css";
import { RemoveTestCode } from "../Data/db";
import { useTranslation } from "react-i18next";
import ButtonLanguage from "../components/ButtonLanguage";



const Home = () => {
    RemoveTestCode();
    
    const { t, i18n } = useTranslation();

    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/login");
    }
    
    return(
        <>
            <ThemeProvider theme={Theme}>
                <ButtonLanguage/>

                <div className="home-div"> 
                <Box sx={{width: 460}}>
                    <Image                                 
                        sx={{mb: 3}}
                        src={Logo} alt="College Class" 
                                                 
                        duration={5000} easing="ease"
                        showLoading={true} errorIcon={false}    
                        shift="bottom" 
                        shiftDuration={1500}
                        bgColor="inherit" 
                        fit="contain"                                                        
                    />  

                    <Typography sx={{fontSize: 28}}>
                        {t("home_description")}
                    </Typography>
                                            
                    <Button className="home-button" sx={{mt: 3}} variant="contained" color="primary" onClick={handleClick}>{t("home_button")}</Button>
                </Box>                   
                </div>
                <div className="footer">                    
                    <div style={{display: "flex", justifyContent: "space-between" , padding: 20}}>
                        <Typography>
                            {t("home_footer_about")}
                        </Typography>
                        <Typography>                           
                            {t("home_footer_credits")}
                        </Typography>
                    </div>
                </div>                
            </ThemeProvider>
        </>
    );
}

export default Home;