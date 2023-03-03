import React from "react";

//Mui
import { Box, Button, Modal } from '@mui/material';
import "../styles/rooms.css";

const AlertModal = ({isOpen, handleClose, handleClick, description}) => {    
    return(
        <Modal            
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="modal">
                <h1 style={{margin: 0}}>Alert!</h1>                   
                <p>{description}</p>
                <div style={{display: "flex", justifyContent: "space-between", marginTop: 25}}>
                    <Button variant="contained" color="error" onClick={handleClick}>Accept</Button>
                    <Button variant="contained" color="primary" onClick={handleClose}>Close</Button>
                </div>
            </Box>
        </Modal>           
    );
}

export default AlertModal;