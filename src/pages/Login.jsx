import React from "react";
import { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Box, Backdrop, CircularProgress, TextField, Button, Link, ThemeProvider, Alert, Collapse, IconButton, InputAdornment, InputLabel, Input, FormControl, Typography } from "@mui/material";
import Theme from "../muiComponents/MUIBlackTheme";
import "../styles/login.css";
import Logo from "../images/LogoBlack.png";

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTranslation } from "react-i18next";
//Firebase
import { getAuth } from "firebase/auth";
import { AuthorizateUser, RemoveTestCode, SetUserToLocal } from "../Data/db";
import ButtonLanguage from "../components/ButtonLanguage";

const Login = () => {
    RemoveTestCode();

    const navigate = useNavigate();

    const { t, i18n } = useTranslation();

    const [backdropOpen, setBackdropOpen] = useState(false);
    const handleBackdrop = (state) => setBackdropOpen(state);

    const [error, setError] = useState("");
    const [isOpen, setOpen] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const emailRef = useRef();
    const passwordRef = useRef();

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleLink = () => {
        navigate("/registration");
    }

    const handleImageLink = () => {
        navigate("/");
    }

    const handleResetLink = () => {
        navigate("/reset");
    }

    const handleClick = async (e) => {
        e.preventDefault();
        if(validateFields()) return;

        handleBackdrop(true);
        const auth = getAuth();
        await AuthorizateUser(auth, email, password).then(async (e) => {
            if(e){                
                switch(e){
                    case 'auth/invalid-password':
                        setError(t("error_invalid_password"));    
                        break;
                    case 'auth/user-not-found':
                        setError(t("error_user_not_found"));    
                        break;
                    case 'auth/wrong-password':
                        setError(t("error_wrong_password"));    
                        break;
                    case 'auth/invalid-email':                        
                        setError(t("error_invalid_email"));    
                        break;
                    default:
                        setError(t("error_unknown"));    
                        break;        
                }        
                
                setOpen(true);
                handleBackdrop(false);
            }
            else{
                setError("");
                await SetUserToLocal();
                handleBackdrop(false);
                navigate("/rooms");               
            }
        })
    }

    const validateFields = () => {
        if(email === "" || password === ""){
            setError(t("error_empty_fields"));
            setOpen(true);
            return true;
        }
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
                            {t("sign_in")}
                        </Typography>                         
                        <TextField 
                            id="email" label="Email" variant="standard"  
                            ref={emailRef}                      
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}                        
                            margin="normal"
                            fullWidth={true}                                                                                               
                        />            
                        <br/>     
                        <FormControl variant="standard" sx={{width: 215, marginBottom: 1, marginTop: 2}}>
                            <InputLabel htmlFor="password">{t("password")}</InputLabel>
                            <Input                            
                                id="password" 
                                variant="standard"
                                ref={passwordRef}                               
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}                                                                                                
                                type={showPassword ? 'text' : 'password'}                                
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />                        
                        </FormControl>       
                        <br/><br/>                                   
                        <Button sx={{mb: 1}} variant="contained" color="primary" onClick={handleClick} fullWidth={true}>{t("accept")}</Button>                                    
                        
                        <Typography>
                            <Link onClick={handleResetLink} sx={{ color: "gray", fontSize: 14, "&:hover": { cursor: "pointer" }}}>
                                {t("forgot_password")}
                            </Link>     
                        </Typography>                   
                    </form>           
                    <Typography color={"white"} textAlign={"center"} mt={1}>
                        {t("do_not_have_account")} <Link onClick={handleLink} sx={{"&:hover": { cursor: "pointer" }}} color="primary">{t("sign_up_link")}</Link>
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
            { error !== "" || error !== undefined ? (         
                <span className="footer">
                    <Collapse in={isOpen}>
                        <Alert onClose={() => {setOpen(!isOpen)}} severity="error">{ error }</Alert>
                    </Collapse>
                </span>
            ) : <></>}     
        </>
    );
}
export default Login;