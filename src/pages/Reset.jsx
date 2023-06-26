import React from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Box, Backdrop, CircularProgress, TextField, Button, Link, ThemeProvider, Collapse, Alert, Typography } from "@mui/material";
import Theme from "../muiComponents/MUIBlackTheme";
import "../styles/login.css";
import Logo from "../images/LogoBlack.png";
import { useTranslation } from "react-i18next";

//Firebase
import { getAuth } from "firebase/auth";
import { RemoveTestCode, ResetPassword } from "../Data/db";
import { useContext } from "react";
import { Context } from "../index";
import ButtonLanguage from "../components/ButtonLanguage";

const Reset = () => {
    RemoveTestCode();

    const { auth } = useContext(Context);
    const navigate = useNavigate();

    const { t, i18n } = useTranslation();
    
    const [backdropOpen, setBackdropOpen] = useState(false);
    const handleBackdrop = (state) => setBackdropOpen(state);

    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorEmailText, setErrorEmailText] = useState('');

    const handleLink = () => {
        navigate("/login");
    }

    const handleImageLink = () => {
        navigate("/");
    }


    const [isOpenSuccessAlert, setOpenSuccessAlert] = useState(false); 
    const handleClick = async (e) => {
        e.preventDefault();
        if(validateFields()) return;

        handleBackdrop(true);

        await ResetPassword(auth, email).then(e => {
            if(e){
                setErrorEmailText(e);
                setErrorEmail(true);
            }
            else{
                setOpenSuccessAlert(true);     
            }
        })

        handleBackdrop(false);
    }

    const validateFields = () => {
        const emailRegular = new RegExp('^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$');
        
        if(email === ""){
            setErrorEmailText("Email field is empty.");
            setErrorEmail(true);
            return true;
        }

        if(!emailRegular.test(email)){
            setErrorEmailText("Incorrect email format.");
            setErrorEmail(true);
            return true;
        }

        setErrorEmailText("");
        setErrorEmail(false);
        
        return false;
    }
    return(
        <>
            <ThemeProvider theme={Theme}>
            <ButtonLanguage/>

            <div className="login-div">         
                <Link onClick={handleImageLink} sx={{"&:hover": { cursor: "pointer" }}}><img className="login-img" src={Logo} alt="CollegeClass"/></Link>                
                    <form autoComplete="off" className="login-form">                       
                        <Typography fontSize={28}>
                            {t("reset")}
                        </Typography>                               
                        <TextField 
                            id="email" label="Email" variant="standard"                    
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}                        
                            margin="normal"
                            fullWidth={true}         
                            error={errorEmail}
                            helperText={errorEmailText}                                                                                        
                        />                
                        <br/><br/>                                   
                        <Button sx={{mb: 1}} variant="contained" color="primary" onClick={handleClick} fullWidth={true}>{t("accept")}</Button>                                                           
                    </form>    
                    <Typography color={"white"} textAlign={"center"} mt={1}>
                        {t("remember_password")} <Link onClick={handleLink} sx={{"&:hover": { cursor: "pointer" }}} color="primary">{t("sign_in_link")}</Link>
                    </Typography>                                          
            </div>   

            <Backdrop                    
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
                    open={backdropOpen}                    
            >
                <Box sx={{m: "auto"}}>
                    <CircularProgress  />
                </Box>
            </Backdrop>  
            </ThemeProvider>

            { isOpenSuccessAlert ? (         
                <span className="footer">
                    <Collapse in={isOpenSuccessAlert}>
                        <Alert onClose={() => {setOpenSuccessAlert(!isOpenSuccessAlert)}} severity="success">{t("sent_password_reset")}</Alert>
                    </Collapse>
                </span>
            ) : <></>}   
        </>
    );
}
export default Reset;