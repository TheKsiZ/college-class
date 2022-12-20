import React from "react";
import { useRef, useState, useEffect } from "react";

const Registration = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return(
        <>
            <form autoComplete="off">
                <label htmlFor="firstName">First Name</label>
                <input
                    type="text"
                    id="firstName"
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                    required
                />
                <label htmlFor="lastName">Last Name</label>
                <input
                    type="text"
                    id="lastName"
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                    required
                />
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
                    type="text"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                />
                <label htmlFor="confirmPassword">Confrim Password</label>
                <input
                    type="text"
                    id="confirmPassword" 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    required
                />
                <button>Sing Up</button>
            </form>
        </>
    );
}

export default Registration;