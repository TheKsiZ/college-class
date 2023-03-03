import React from "react";
import { useRef, useState } from "react";

import { TextField, Button, Link, ThemeProvider, Alert, Collapse } from "@mui/material";
import Theme from "../muiComponents/MUIBlackTheme";
import "../styles/login.css";
import Logo from "../images/LogoBlack.png";

//Firebase
import { getAuth } from "firebase/auth";
import { AuthorizateUser, SetUserToLocal } from "../Data/db";

const Login = () => {
    const [error, setError] = useState("");
    const [isOpen, setOpen] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const emailRef = useRef();
    const passwordRef = useRef();

    const handleClick = async (e) => {
        e.preventDefault();
        if(validateFields()) return;

        const auth = getAuth();
        await AuthorizateUser(auth, email, password).then(async (e) => {
            if(e){
                setError(e);
                setOpen(true);
            }
            else{
                setError("");
                await SetUserToLocal();
                window.location.href = "/rooms";                
            }
        })
    }

    const validateFields = () => {
        if(email === "" || password === ""){
            setError("Please, fill all the fields.");
            setOpen(true);
            return true;
        }
        return false;
    }
    return(
        <>
            <div className="login-div">         
                <Link href="/"><img className="login-img" src={Logo} alt="CollegeClass"/></Link>
                <ThemeProvider theme={Theme}>
                    <form autoComplete="off" className="login-form">   
                        <h1 className="login-h1">Sign In</h1>                                  
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
                            id="password" label="Password" variant="standard"
                            ref={passwordRef}
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            margin="normal"
                            required    
                        />  
                        <br/><br/>                                  
                        <Button variant="contained" color="primary" onClick={handleClick}>Accept</Button>
                    </form>           
                    <p className="login-p">Do not have Account yet? <Link href="/registration" color="primary">Sign Up</Link></p>
                </ThemeProvider>
            </div>   
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