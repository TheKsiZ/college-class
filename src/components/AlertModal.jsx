import React from "react";

//Mui
import { Box, Button, Modal, Typography } from '@mui/material';
import "../styles/rooms.css";
import { useTranslation } from "react-i18next";

const AlertModal = ({isOpen, handleClose, handleClick, description}) => {    
    const { t } = useTranslation();
    return(
        <Modal            
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="modal">                
                <Typography fontSize={28}>
                    {t("alert")}
                </Typography>       
                <Typography sx={{mb: 5}}>
                    {description}
                </Typography>                                    
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <Button sx={{marginRight: 1}} variant="contained" color="error" onClick={handleClick} fullWidth={true}>{t("accept")}</Button>
                    <Button variant="contained" color="primary" onClick={handleClose} fullWidth={true}>{t("close")}</Button>
                </div>                                
            </Box>
        </Modal>           
    );
}

export default AlertModal;