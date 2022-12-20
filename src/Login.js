import React from "react";
import { useRef, useState, useEffect } from "react";
import "./styles/login.css";
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    return(
        <>
            <div className="login-div">
                <form autoComplete="off" className="login-form">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                    />
                    <button className="login-button">Sing In</button>
                </form>           
                
            </div>
            <p>Do not have Account yet? <a href="#">Sign Up</a></p>
        </>
    );
}
export default Login;