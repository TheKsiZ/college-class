import React, { useState } from "react";

import OpenLessonModal from "../components/OpenLessonModal";
import { useTranslation } from "react-i18next";
//Mui
import { Card, CardActions, CardContent, Button, Typography } from '@mui/material';
import AlertModal from "./AlertModal";
import { DeleteTask, DeleteLesson, SetTestCode, GetIsUserTeacher, DeleteTest, IsUserStillInRoom } from "../Data/db";
import EditLessonModal from "./EditLessonModal";
import { useNavigate } from "react-router-dom";

const LessonCard = ({data, LoadLessons, handleBackdrop}) => {        
    const date = new Date(data.data.creationDate);
    IsUserStillInRoom();
    const navigate = useNavigate();

    const { t, i18n } = useTranslation();

    const [openModalLesson, setOpenModalLesson] = useState(false);
    const handleOpenModalLesson = () => setOpenModalLesson(true);
    const handleCloseModalLesson = () => setOpenModalLesson(false);

    const [openModalEditLesson, setOpenModalEditLesson] = useState(false);
    const handleOpenModalEditLesson = () => setOpenModalEditLesson(true);
    const handleCloseModalEditLesson = () => setOpenModalEditLesson(false);

    const [openModalAlert, setOpenModalAlert] = useState(false);
    const handleOpenModalAlert = () => setOpenModalAlert(true);
    const handleCloseModalAlert = () => setOpenModalAlert(false);
    
    const handleClickAlert = async () => {

        handleBackdrop(true);
        if(data.data.type === "lesson")
            await DeleteLesson(data.id);
        else if(data.data.type === "test")
            await DeleteTest(data.id);
        else
            await DeleteTask(data.id);
        
        await LoadLessons();
        handleCloseModalAlert();

        handleBackdrop(false);
    }

    const handleOpenTest = () => {                
        SetTestCode(data.id);
        navigate("/room/test");        
    }

    const handleEditTest = () => {        
        SetTestCode(data.id);
        navigate("/room/test");        
    }

    return(                            
        <>
            <Card sx={{ width: 315, height: 150, minWidth: 295, minHeight: 150, margin: 1 }}>            
                <CardContent sx={{pb:0}}>     
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {t(data.data.type)} {"№" + data.data.index} | {date.toLocaleDateString(`${i18n.language}-${i18n.language.toUpperCase()}`)}
                    </Typography>           
                    <Typography variant="h5" component="div">
                        {
                            data.data.title.length > 17 ? 
                            <>
                                {data.data.title.slice(0, 17) + "..."}
                            </>
                            :
                            <>
                                {data.data.title}
                            </>
                        }                             
                    </Typography>                
                    <Typography variant="body1">
                        {
                            data.data.description.length > 27 ? 
                            <>
                                {data.data.description.slice(0, 27) + "..."}
                            </>
                            :
                            data.data.description.length === 0 ?
                            <>
                                <br/>   
                            </>
                            :
                            <>
                                {data.data.description}
                            </>
                        }                        
                    </Typography>
                </CardContent>
                <CardActions style={{display: "flex", justifyContent: "space-between"}}>  
                    {
                        data.data.type === "test" ?
                        <>
                            <Button variant="contained" color="primary" onClick={handleOpenTest} size="small" fullWidth={true}>{t("open")}</Button>
                            {GetIsUserTeacher() ?                         
                                <>
                                    <Button variant="contained" color="primary" onClick={handleEditTest} size="small" fullWidth={true}>{t("edit")}</Button>                                                 
                                    <Button variant="contained" color="error" onClick={handleOpenModalAlert} size="small" fullWidth={true}>{t("delete")}</Button>
                                </>                                                            
                            :<></>}
                        </>
                        :
                        <>
                            <Button variant="contained" color="primary" onClick={handleOpenModalLesson} size="small" fullWidth={true}>{t("open")}</Button>
                            {GetIsUserTeacher() ?                         
                            <>
                                <Button variant="contained" color="primary" onClick={handleOpenModalEditLesson} size="small" fullWidth={true}>{t("edit")}</Button>                                                 
                                <Button variant="contained" color="error" onClick={handleOpenModalAlert} size="small" fullWidth={true}>{t("delete")}</Button>
                            </>
                            : <></> }
                        </>
                    }                                                               
                </CardActions>
            </Card>        
                        
            <OpenLessonModal 
                handleClose={handleCloseModalLesson} 
                isOpen={openModalLesson} 
                data={data}                                
                handleBackdrop={handleBackdrop}
            />
            <EditLessonModal
                handleClose={handleCloseModalEditLesson}
                isOpen={openModalEditLesson}            
                LoadLessons={LoadLessons}   
                data={data}             
                handleBackdrop={handleBackdrop}
            />
            <AlertModal 
                handleClose={handleCloseModalAlert} 
                isOpen={openModalAlert} 
                handleClick={handleClickAlert} 
                description={t("alert_delete_lesson") + " " + t(data.data.type + "_delete") + "?"}                
            />
        </>
    );
}

export default LessonCard;