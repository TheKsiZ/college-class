import React, { useState, useContext } from 'react';
import { Context } from "../../index";
//Mui
import { Box, Backdrop, CircularProgress, ThemeProvider, TextField, Button, Alert, Collapse, FormControl, Input, InputLabel, InputAdornment, IconButton, Typography } from "@mui/material";
import Theme from "../../muiComponents/MUIBlackTheme";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Naviagtion from "../../components/Navigation";
import { useTranslation } from "react-i18next";
import "../../styles/userprofile.css";
//Firebase
import { UpdateUser, IsUserAuthorized, RemoveTestCode, CheckOldPassword } from '../../Data/db';

const UserProfile = () => {
    IsUserAuthorized();
    RemoveTestCode();

    const { t } = useTranslation();

    const { auth } = useContext(Context);

    const [backdropOpen, setBackdropOpen] = useState(false);
    const handleBackdrop = (state) => setBackdropOpen(state);

    const [email, setEmail] = useState('');    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');      
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [errorEmail, setErrorEmail] = useState(false);
    const [errorEmailText, setErrorEmailText] = useState('');   
    const [errorFirstName, setErrorFirstName] = useState(false);
    const [errorFirstNameText, setErrorFirstNameText] = useState('');
    const [errorLastName, setErrorLastName] = useState(false);
    const [errorLastNameText, setErrorLastNameText] = useState(''); 

    const [error, setError] = useState("");
    const [isOpen, setOpen] = useState(false);

    const [showOldPassword, setOldShowPassword] = useState(false);
    const handleClickShowOldPassword = () => setOldShowPassword((show) => !show);
    const handleMouseDownOldPassword = (event) => {
        event.preventDefault();
    };

    const [showNewPassword, setNewShowPassword] = useState(false);
    const handleClickShowNewPassword = () => setNewShowPassword((show) => !show);
    const handleMouseDownNewPassword = (event) => {
        event.preventDefault();
    };

    const validateFields = async () => {        
        const passwordRegular = new RegExp('^[a-zA-Z0-9!$%^-_=+]+$');
        if(!passwordRegular.test(newPassword) && newPassword.length > 0){
            setError(t("error_invalid_regular_password"));
            setOpen(true);
            return true;
        }
        if(newPassword.length > 0 && newPassword.length < 6){
            setError(t("error_password_length"));
            setOpen(true);
            return true;
        } 
        
        if(oldPassword.length === 0){
            setOpen(true);
            setError(t("error_old_password_length"));
            return true;
        }
            
        if(await CheckOldPassword(auth, oldPassword)){
            setOpen(true);
            setError(t("error_invalid_old_password"));
            return true;        
        }                        

        setError("");
        setOpen(false);

        const nameRegular = new RegExp('^[a-zA-Zа-яА-Я-]+$');               
        if(firstName.length > 24){
            setErrorFirstName(true);
            setErrorFirstNameText(t("error_invalid_name_length"));
            return true;
        }
        if(!nameRegular.test(firstName) && firstName.length > 0){
            setErrorFirstName(true);
            setErrorFirstNameText(t("error_invalid_regular_name"));
            return true;
        }        
        setErrorFirstName(false);
        setErrorFirstNameText('');
        
        if(lastName.length > 24){
            setErrorLastName(true);
            setErrorLastNameText(t("error_invalid_name_length"));
            return true;
        }
        if(!nameRegular.test(lastName) && lastName.length > 0){
            setErrorLastName(true);
            setErrorLastNameText(t("error_invalid_regular_name"));
            return true;
        }
        setErrorLastName(false);
        setErrorLastNameText('');        
        
        const emailRegular = new RegExp('^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$');
        if(!emailRegular.test(email) && email.length > 0){
            setErrorEmailText(t("error_invalid_email"));
            setErrorEmail(true);
            return true;
        }
        setErrorEmailText("");
        setErrorEmail(false);

        return false;        
    }    

    const [isOpenSuccessAlert, setOpenSuccessAlert] = useState(false); 
    
    const handleClick = async () => {         
        if(await validateFields()) return;
        
        handleBackdrop(true);
        await UpdateUser(auth, email, firstName, lastName, newPassword).then(e => {            
            if(e){
                if(e === "auth/email-already-in-use"){
                    setErrorEmailText(t("error_email_already_in_use"));
                    setErrorEmail(true);
                    handleBackdrop(false);
                    return;
                }   
                if(e){
                    setErrorEmailText(t("error_unknown"));
                    setErrorEmail(true);                    
                }                             
            }
            else{
                setEmail('');
                setFirstName('');
                setLastName('');
                setOldPassword('');
                setNewPassword('');
                setOpenSuccessAlert(true);        
            }
        });
        handleBackdrop(false);        
    }    
    
    return(
        <>
            <ThemeProvider theme={Theme}>
                <Naviagtion/>

                <div className='settings-div'>
                    <div className="settings-form">                        
                            <Typography fontSize={28}>
                                {t("user_profile_title")}
                            </Typography>                                                                      
                            <TextField sx={{mb: 1}}
                                id="email" label="Email" variant="standard"                                
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}                                        
                                error={errorEmail}
                                helperText={errorEmailText}                                              
                                fullWidth={true}
                            />                             
                            <TextField sx={{mb: 1}}
                                id="firstName" label={t("first_name")} variant="standard"                                                      
                                onChange={(e) => setFirstName(e.target.value)}
                                value={firstName}                          
                                error={errorFirstName}
                                helperText={errorFirstNameText} 
                                fullWidth={true}                                                                         
                            />            
                            
                            <TextField sx={{mb: 1}}
                                id="lastName" label={t("last_name")} variant="standard"                                
                                onChange={(e) => setLastName(e.target.value)}
                                value={lastName}                                     
                                error={errorLastName}
                                helperText={errorLastNameText}                                              
                                fullWidth={true}
                            />  

                            <FormControl variant="standard" fullWidth={true} sx={{mb: 1}}>
                                <InputLabel htmlFor="oldpassword">{t("old_password")}</InputLabel>
                                <Input                                                            
                                    id="oldpassword" 
                                    variant="standard"                                    
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    value={oldPassword}                                                                                                
                                    type={showOldPassword ? 'text' : 'password'}                                    
                                    endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowOldPassword}
                                        onMouseDown={handleMouseDownOldPassword}
                                        >
                                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                    }
                                />
                            </FormControl>  

                            <FormControl variant="standard" fullWidth={true} sx={{mb: 3}}>
                                <InputLabel htmlFor="newpassword">{t("new_password")}</InputLabel>
                                <Input                                                            
                                    id="newpassword" 
                                    variant="standard"                                    
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    value={newPassword}                                                                                                
                                    type={showNewPassword ? 'text' : 'password'}
                                    endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowNewPassword}
                                        onMouseDown={handleMouseDownNewPassword}
                                        >
                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                    }
                                />
                            </FormControl>  
                            <Button variant="contained" color="primary" onClick={handleClick} fullWidth={true}>{t("save")}</Button>                                                            
                    </div>
                </div>                           
            <Backdrop                    
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
                open={backdropOpen}                    
            >
                <Box sx={{m: "auto"}}>
                    <CircularProgress />
                </Box>
            </Backdrop>  
            </ThemeProvider>

            { isOpenSuccessAlert ? (         
                <span className="footer">
                    <Collapse in={isOpenSuccessAlert}>
                        <Alert onClose={() => {setOpenSuccessAlert(!isOpenSuccessAlert)}} severity="success">{t("user_saved")}</Alert>
                    </Collapse>
                </span>
            ) : <></>}  
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

export default UserProfile;