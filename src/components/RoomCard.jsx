import React from "react";
import { Card, CardActions, CardContent, Button, Typography } from '@mui/material';
import { GetUserId, SetIsUserOwner, SetRoomCode } from "../Data/db";

const RoomCard = ({data}) => {    
    const handleClick = () => {        
        SetRoomCode(data.roomData.id);
        SetIsUserOwner(GetUserId() === data.ownerData.id);
        window.location.href='/room';
    }    
    return(                    
        <Card sx={{ minWidth: 150 }}>            
            <CardContent sx={{pb:0}}>     
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {data.ownerData.data.firstName} {data.ownerData.data.lastName}
                </Typography>           
                <Typography variant="h5" component="div">
                    {data.roomData.data.title}
                </Typography>                
                <Typography variant="body1">
                    {data.roomData.data.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained" color="primary" onClick={handleClick} size="small">Open</Button>
            </CardActions>
        </Card>        
    );
}

export default RoomCard;