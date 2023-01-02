import React from "react";
import { useRef, useState, useEffect } from "react";

//import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { TextField, Button, Link, ThemeProvider } from "@mui/material";
import Theme from "../muiComponents/MUIBlackTheme";

import "../styles/login.css";
import Logo from "../images/LogoBlack.png";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return(
        <>
            <div className="login-div">         
                <Link href="/"><img className="login-img" src={Logo} alt="CollegeClass"/></Link>
                <ThemeProvider theme={Theme}>
                    <form autoComplete="off" className="login-form">   
                        <h1 className="login-h1">Sign In</h1>                                  
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
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            margin="normal"
                            required    
                        />  
                        <br/><br/>                                  
                        <Button variant="contained" color="primary">Accept</Button>
                    </form>           
                    <p className="login-p">Do not have Account yet? <Link href="/registration" color="primary">Sign Up</Link></p>
                </ThemeProvider>
            </div>        
        </>
    );
}
export default Login;