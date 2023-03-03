import React, { useState, useRef } from "react";

//Mui
import { Box, Button, Modal, TextField } from '@mui/material';
import "../styles/rooms.css";

//Firebase
import { AddRoomToUser, SetRoomCode, ValidateRoomCode } from "../Data/db";
const Join = ({isOpen, handleClose}) => {

    const [code, setCode] = useState('');
    const codeRef = useRef();
    
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');

    const handleClick = async () => {
        if(await handleError()) return;
        SetRoomCode(code);
        await AddRoomToUser();
        window.location.href="/room";
    }

    const handleError = async () => {                
        if(code === ""){
            setError(true);
            setErrorText('Type a code'); 
            return true;              
        }   

        if(!(await ValidateRoomCode(code))){
            setError(true);
            setErrorText('Invalid code');
            return true;
        }

        setError(false);
        setErrorText('');
        return false;
    }

    const handleClosing = () => {
        setError(false);
        setErrorText('');
        setCode('');
        handleClose();
    }

    return (         
        <Modal            
            open={isOpen}
            onClose={handleClosing}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="modal">
                <h1 style={{margin: 0}}>Join to room</h1>
                <TextField 
                    id="code" 
                    label="Code" 
                    variant="standard"  
                    ref={codeRef}                      
                    onChange={(e) => setCode(e.target.value)}
                    value={code}                                            
                    margin="normal"   
                    error={error}     
                    helperText={(errorText)}                                                                         
                />  
                <div style={{display: "flex", justifyContent: "space-between", marginTop: 25}}>
                    <Button variant="contained" color="primary" onClick={handleClick}>Accept</Button>
                    <Button variant="contained" color="primary" onClick={handleClosing}>Close</Button>
                </div>
            </Box>
        </Modal>                               
  );
}

export default Join;