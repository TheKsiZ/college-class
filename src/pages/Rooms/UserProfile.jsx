import React, { useEffect, useState, useRef } from 'react';

import AlertModal from "../../components/AlertModal";
//Mui
import { ThemeProvider, TextField, Button, Alert, Collapse } from "@mui/material";
import Theme from "../../muiComponents/MUIBlackTheme";
import Naviagtion from "../../components/Navigation";
import "../../styles/userprofile.css";
//Firebase
import { UpdateUser, IsUserAuthorized } from '../../Data/db';

const UserProfile = () => {
    IsUserAuthorized();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const firstNameRef = useRef();
    const lastNameRef = useRef();    

    const [errorFirstName, setErrorFirstName] = useState(false);
    const [errorFirstNameText, setErrorFirstNameText] = useState('');
    const [errorLastName, setErrorLastName] = useState(false);
    const [errorLastNameText, setErrorLastNameText] = useState('');    

    const validateFields = () => {        
        const nameRegular = new RegExp('^[a-zA-Z-]+$');        
        let flag = false;
        if(firstName.length > 24){
            setErrorFirstName(true);
            setErrorFirstNameText("Max symbols are 24");
            flag = true;
        }
        if(!nameRegular.test(firstName) && firstName.length > 0){
            setErrorFirstName(true);
            setErrorFirstNameText("Name must have only latin letters. (a-Z)");
            flag = true;
        }        
        setErrorFirstName(false);
        setErrorFirstNameText('');

        if(lastName.length > 24){
            setErrorLastName(true);
            setErrorLastNameText("Max symbols are 24");
            flag = true;
        }
        if(!nameRegular.test(lastName) && lastName.length > 0){
            setErrorLastName(true);
            setErrorLastNameText("Name must have only latin letters. (a-Z)");
            flag = true;
        }
        setErrorLastName(false);
        setErrorLastNameText('');        

        return flag;
    }    

    const [isOpenSuccessAlert, setOpenSuccessAlert] = useState(false); 
    const handleClick = async () => {        
        if(validateFields()) return;

        await UpdateUser(firstName, lastName);
        setOpenSuccessAlert(true);
    }    
    
    return(
        <>
            <ThemeProvider theme={Theme}>
                <Naviagtion/>

                <div className='settings-div'>
                    <div className="settings-form">   
                            <h1 className="settings-h1">Change Name</h1>                                  
                            <TextField style={{width: "100%"}}
                                id="firstName" label="First Name" variant="standard"  
                                ref={firstNameRef}                      
                                onChange={(e) => setFirstName(e.target.value)}
                                value={firstName}                        
                                margin="normal"     
                                error={errorFirstName}
                                helperText={errorFirstNameText}                                                                          
                            />            
                            <br/>             
                            <TextField style={{width: "100%"}}
                                id="lastName" label="Last Name" variant="standard"
                                ref={lastNameRef}                            
                                onChange={(e) => setLastName(e.target.value)}
                                value={lastName}
                                margin="normal"                                        
                                error={errorLastName}
                                helperText={errorLastNameText}              
                            />  
                            <br/><br/>                                                   
                            <Button variant="contained" color="primary" onClick={handleClick}>Save</Button>                                                            
                    </div>
                </div>                           

            </ThemeProvider>

            { isOpenSuccessAlert ? (         
                <span className="footer">
                    <Collapse in={isOpenSuccessAlert}>
                        <Alert onClose={() => {setOpenSuccessAlert(!isOpenSuccessAlert)}} severity="success">User saved!</Alert>
                    </Collapse>
                </span>
            ) : <></>}  
        </>
    );
}

export default UserProfile;