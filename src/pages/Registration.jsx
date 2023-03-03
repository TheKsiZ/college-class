import React from "react";
import { useRef, useState, useEffect } from "react";

//Mui
import { TextField, Button, Link, ThemeProvider, Alert, Collapse } from "@mui/material";
import Theme from "../muiComponents/MUIBlackTheme";
import "../styles/registration.css";
import Logo from "../images/LogoBlack.png";

//Firebase
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AddUserToDatabase, CreateUser, SetUserToLocal } from "../Data/db";

const Registration = () => {
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

    const handleClick = async (e) => {
        e.preventDefault();
        if(validateFields()) return;

        const auth = getAuth();   
        await CreateUser(auth, email, password).then(async (e) => {
            if(e !== "" && e !== undefined && e !== null){
                setError(e);
                setOpen(true);
            }
            else{
                setError("");
                await AddUserToDatabase(firstName, lastName, email);
                await SetUserToLocal();
                window.location.href = "/rooms";
            }
        });

    }

    const validateFields = () => {
        const emailRegular = new RegExp('^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$');
        const nameRegular = new RegExp('^[a-zA-Z-]+$');
        const passwordRegular = new RegExp('^[a-zA-Z0-9!$%^-_=+]+$');
        if(email === "" || firstName === "" || lastName === "" || password === "" || confirmPassword === ""){
            setError("Please, fill all the fields.");
            setOpen(true);
            return true;
        }        
        if(password !== confirmPassword){
            setError("Passwords do not match.");            
            setOpen(true);
            return true;
        }
        if(password.length < 6){
            setError("Password length must be more than 6 characters.");
            setOpen(true);
            return true;
        }        
        if(!emailRegular.test(email)){
            setError("Incorrect email format.");
            setOpen(true);
            return true;
        }
        if(!nameRegular.test(firstName) || !nameRegular.test(lastName)){
            setError("Name must have only latin letters. (a-Z)");
            setOpen(true);
            return true;
        }
        if(!passwordRegular.test(password)){
            setError("Password must have only latin letters (a-Z), numbers (0-9) and special characters (!, $, %, ^, -, _, =, +)");
            setOpen(true);
            return true;
        }
        return false;
    }
    
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
                            ref={firstNameRef}                     
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}                        
                            margin="normal"
                            required                                                
                        />
                        <br/> 
                        <TextField 
                            id="lastName" label="Last Name" variant="standard"                        
                            ref={lastNameRef}
                            onChange={(e) => setLastName(e.target.value)}                        
                            value={lastName}                        
                            margin="normal"
                            required                                                
                        />    
                        <br/>  
                        <TextField 
                            id="email" label="Email" variant="standard"     
                            ref={emailRef}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}                        
                            margin="normal"
                            required                                                
                        />    
                        <br/>  
                        <TextField 
                            type="password"
                            id="password" label="Password" variant="standard"   
                            ref={passwordRef}                     
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}                                                    
                            margin="normal"
                            required                                                
                        />
                        <br/>      
                        <TextField 
                            type="password"
                            id="confirmPassword" label="Confirm Password" variant="standard"
                            ref={confirmPasswordRef}                        
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}                        
                            margin="normal"
                            required                                                
                        />                        
                        <br/><br/>                                  
                        <Button variant="contained" color="primary" onClick={handleClick}>Accept</Button>
                    </form>
                    <p className="registration-p">Already have an account? <Link href="/login" color="primary">Sign In</Link></p>
                </ThemeProvider>
            </div>
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