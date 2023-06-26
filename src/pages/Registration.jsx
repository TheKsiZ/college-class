import React from "react";
import { useRef, useState } from "react";

//Mui
import { Box, Backdrop, CircularProgress, TextField, Button, Link, ThemeProvider, Alert, Collapse, IconButton, InputAdornment, InputLabel, Input, FormControl, Typography } from "@mui/material";
import Theme from "../muiComponents/MUIBlackTheme";
import "../styles/registration.css";
import Logo from "../images/LogoBlack.png";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTranslation } from "react-i18next";
//Firebase
import { getAuth } from "firebase/auth";
import { AddUserToDatabase, CreateUser, RemoveTestCode, SetUserToLocal } from "../Data/db";
import { useNavigate } from "react-router-dom";
import ButtonLanguage from "../components/ButtonLanguage";

const Registration = () => {
    RemoveTestCode();

    const navigate = useNavigate();

    const { t, i18n } = useTranslation();

    const [backdropOpen, setBackdropOpen] = useState(false);
    const handleBackdrop = (state) => setBackdropOpen(state);

    const [error, setError] = useState("");
    const [isOpen, setOpen] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const [showConfirmPassword, setShowConfrimPassword] = useState(false);
    const handleClickShowConfirmPassword = () => setShowConfrimPassword((show) => !show);
    const handleMouseDownConfirmPassword = (event) => {
        event.preventDefault();
    };

    const handleLink = () => {
        navigate("/login");
    }

    const handleImageLink = () => {
        navigate("/");
    }

    const handleClick = async (e) => {
        e.preventDefault();
        if(validateFields()) return;

        const auth = getAuth();
        handleBackdrop(true);
        await CreateUser(auth, email, password).then(async (e) => {
            if(e !== "" && e !== undefined && e !== null){                
                switch(e){
                    case 'auth/email-already-exists':
                        setError(t("error_email_already_in_use"));
                        break;  
                    case 'auth/email-already-in-use':
                        setError(t("error_email_already_in_use"));
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
                await AddUserToDatabase(firstName.charAt(0).toUpperCase() + firstName.slice(1), lastName.charAt(0).toUpperCase() + lastName.slice(1), email);
                await SetUserToLocal();
                handleBackdrop(false);

                navigate("/rooms");
            }
        });

    }

    const validateFields = () => {
        const emailRegular = new RegExp('^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$');
        const nameRegular = new RegExp('^[a-zA-Zа-яА-Я-]+$');
        const passwordRegular = new RegExp('^[a-zA-Z0-9!$%^-_=+]+$');
        if(email === "" || firstName === "" || lastName === "" || password === "" || confirmPassword === ""){
            setError(t("error_empty_fields"));
            setOpen(true);
            return true;
        }        
        if(password !== confirmPassword){
            setError(t("error_password_do_not_match"));            
            setOpen(true);
            return true;
        }
        if(password.length < 6){
            setError(t("error_password_length"));
            setOpen(true);
            return true;
        }        
        if(!emailRegular.test(email)){            
            setError(t("error_invalid_email"));
            setOpen(true);
            return true;
        }
        if(firstName.length > 24 || lastName.length > 24){
            setOpen(true);
            setError(t("error_invalid_name_length"));
            return true;
        }
        if(!nameRegular.test(firstName) || !nameRegular.test(lastName)){
            setError(t("erorr_invalid_regular_name"));
            setOpen(true);
            return true;
        }
        if(!passwordRegular.test(password)){
            setError(t("error_invalid_regular_password"));
            setOpen(true);
            return true;
        }
        return false;
    }
    
    return(
        <>
            <ThemeProvider theme={Theme}>
            <ButtonLanguage/>

            <div className="registration-div">
                <Link onClick={handleImageLink} sx={{"&:hover": { cursor: "pointer" } }}><img className="registration-img" src={Logo} alt="CollegeClass"/></Link>
                
                    <form autoComplete="off" className="registration-form">                        
                        <Typography fontSize={28}>
                            {t("sign_up")}
                        </Typography>  
                        <TextField                             
                            id="firstName" label={t("first_name")} variant="standard"   
                            ref={firstNameRef}                     
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}                        
                            margin="normal"                            
                            fullWidth={true}
                        />
                        <br/> 
                        <TextField 
                            id="lastName" label={t("last_name")} variant="standard"                        
                            ref={lastNameRef}
                            onChange={(e) => setLastName(e.target.value)}                        
                            value={lastName}                        
                            margin="normal"                             
                            fullWidth={true}
                        />    
                        <br/>  
                        <TextField 
                            id="email" label="Email" variant="standard"     
                            ref={emailRef}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}                        
                            margin="normal"                            
                            fullWidth={true}                                 
                        />    
                        <br/>
                        <FormControl variant="standard" fullWidth={true} sx={{ marginTop: 2,}}>
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
                        <br/>
                        <FormControl variant="standard" fullWidth={true} sx={{marginTop: 2,}}>
                            <InputLabel htmlFor="confirmPassword">{t("confirm_password")}</InputLabel>
                            <Input                            
                                id="confirmPassword" 
                                variant="standard"
                                ref={confirmPasswordRef}                               
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}                                                                                                 
                                type={showConfirmPassword ? 'text' : 'password'}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowConfirmPassword}
                                    onMouseDown={handleMouseDownConfirmPassword}
                                    >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                            />
                        </FormControl>                              
                        <br/><br/>                                  
                        <Button variant="contained" color="primary" onClick={handleClick} fullWidth={true}>{t("accept")}</Button>
                    </form>
                    <Typography color={"white"} textAlign={"center"} mt={1}>
                        {t("have_account")} <Link onClick={handleLink} sx={{"&:hover": { cursor: "pointer" } }} color="primary">{t("sign_in_link")}</Link>
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
            ) : null}
        </>
    );
}

export default Registration;