import React from "react";
import { Card, CardActions, CardContent, Button, Typography } from '@mui/material';
import { GetUserId, IsUserTeacher, SetIsUserOwner, SetRoomCode } from "../Data/db";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const RoomCard = ({data}) => {    
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleClick = async () => {        
        SetRoomCode(data.roomData.id);
        SetIsUserOwner(GetUserId() === data.ownerData.id);
        await IsUserTeacher();
        navigate("/room");        
    }    
    return(                    
        <Card sx={{ width: 295, height: 150, minWidth: 295, minHeight: 150, margin: 1 }}>            
            <CardContent sx={{pb:0}}>     
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {data.ownerData.data.firstName} {data.ownerData.data.lastName}
                </Typography>           
                <Typography variant="h5" component="div">
                    {
                        data.roomData.data.title                        
                    }                    
                </Typography>                
                <Typography variant="body1">
                    {
                        data.roomData.data.description
                    }   
                </Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained" color="primary" onClick={handleClick} size="small" fullWidth={true}>{t("open")}</Button>
            </CardActions>
        </Card>        
    );
}

export default RoomCard;