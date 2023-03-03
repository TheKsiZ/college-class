import React, { useState, useRef } from "react";

//Mui
import { Box, Button, Modal, TextField } from '@mui/material';
import "../styles/rooms.css"

//Firebase
import { CreateRoom } from "../Data/db";

const Create = ({isOpen, handleClose}) => {    

    const [title, setTitle] = useState('');
    const titleRef = useRef();

    const [openErrorTitle, setOpenErrorTitle] = useState(false);
    const [errorTitleText, setErrorTitleText] = useState("");
    
    const [description, setDescription] = useState('');
    const descriptionRef = useRef();

    const [openErrorDesc, setOpenErrorDesc] = useState(false);
    const [errorDescText, setErrorDescText] = useState("");

    const handleClick = async () => {
        if(validateFields()) return;

        await CreateRoom(title, description);
        
        handleClosing();
        window.location.href="/room";
    }

    const handleClosing = () => {
        setErrorTitleText('');
        setOpenErrorTitle(false);
        setErrorDescText('');
        setOpenErrorDesc(false);
        setTitle('');
        setDescription('');
        handleClose();
    }

    const validateFields = () => {
        if(title === ""){
            setErrorTitleText("Room must have a title");
            setOpenErrorTitle(true);
            return true;
        }
        if(title.length > 32){
            setErrorTitleText("Max symbols are 32");
            setOpenErrorTitle(true);
            return true;
        }
        setErrorTitleText("");
        setOpenErrorTitle(false);
        
        if(description.length > 100){
            setErrorDescText("Max symbols are 100");
            setOpenErrorDesc(true);
            return true;
        }
        setErrorDescText("");
        setOpenErrorDesc(false);

        return false;
    }

    return (         
        <Modal            
            open={isOpen}
            onClose={handleClosing}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="modal">                
                <h1 style={{margin: 0}}>Create a room</h1>
                <TextField 
                    id="title" 
                    label="Title" 
                    variant="standard"  
                    ref={titleRef}                      
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}                                            
                    margin="normal"                                                                                 
                    style={{width:235}}
                    error={openErrorTitle}
                    helperText={errorTitleText}
                    required                    
                />  
                <br/>
                <TextField 
                    id="description"
                    label="Small description" 
                    variant="standard"  
                    ref={descriptionRef}                      
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}                                            
                    margin="normal"
                    style={{width:235}}
                    maxRows={4}
                    multiline      
                    error={openErrorDesc}
                    helperText={errorDescText}
                />  
                
                <div style={{display: "flex", justifyContent: "space-between", marginTop: 25}}>
                    <Button variant="contained" color="primary" onClick={handleClick}>Accept</Button>
                    <Button variant="contained" color="primary" onClick={handleClosing}>Close</Button>
                </div>                
            </Box>            
        </Modal>     
                                  
  );
}

export default Create;