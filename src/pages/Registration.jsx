import React from "react";
import { useRef, useState, useEffect } from "react";
import { TextField, Button, Link, ThemeProvider } from "@mui/material";
import Theme from "../muiComponents/MUIBlackTheme";

import "../styles/registration.css";
import Logo from "../images/LogoBlack.png";

const Registration = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return(
        <>
            <div className="registration-div">
                <Link href="/"><img className="registration-img" src={Logo} alt="CollegeClass"/></Link>
                <ThemeProvider theme={Theme}>
                    <form autoComplete="off" className="registration-form">
                        <h1 className="registration-h1">Sign Up</h1> 
                        <TextField 
                            className="registration-input"
                            id="firstName" label="First Name" variant="standard"                        
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}                        
                            margin="normal"
                            required                                                
                        />     
                        <br/> 
                        <TextField 
                            id="lastName" label="Last Name" variant="standard"                        
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}                        
                            margin="normal"
                            required                                                
                        />    
                        <br/>  
                        <TextField 
                            id="email" label="Email" variant="standard"                        
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}                        
                            margin="normal"
                            required                                                
                        />    
                        <br/>  
                        <TextField 
                            id="password" label="Password" variant="standard"                        
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}                        
                            margin="normal"
                            required                                                
                        />
                        <br/>      
                        <TextField 
                            id="confirmPassword" label="Confirm Password" variant="standard"                        
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}                        
                            margin="normal"
                            required                                                
                        />                        
                        <br/><br/>                                  
                        <Button variant="contained" color="primary">Accept</Button>
                    </form>
                    <p className="registration-p">Already have an account? <Link href="/login" color="primary">Sign In</Link></p>
                </ThemeProvider>
            </div>
        </>
    );
}

export default Registration;