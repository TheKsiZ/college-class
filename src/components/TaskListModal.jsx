import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
//Mui
import { Box, List, ListItem, ListItemText, Link, Modal, FormControl, InputLabel, MenuItem, Typography } from '@mui/material';
import Select from '@mui/material/Select';
import "../styles/rooms.css";
import { GetLessonById, GetUserById, SetMark } from "../Data/db";

const TaskListModal = ({isOpen, handleClose, id, handleBackdrop}) => {
    const { t, i18n } = useTranslation();

    const [lesson, setLesson] = useState();
    const [users, setUsers] = useState([]);

    const loadUsers = async () => {        
        const lessonData = await GetLessonById(id);        
        setLesson(lessonData);
        
        if(lessonData.users === undefined) return;

        await lessonData.users.map(async (element) => {
            const user = await GetUserById(element.id);
            setUsers(users => [...users, user]);
        });               
    }

    useEffect(() => {
        loadUsers();
    }, []);


    let mark = 0;
    const handleTypeChange = async (event, userid) => {                     
        mark = event.target.value;

        handleBackdrop(true);
        await SetMark(id, userid, mark);
        handleBackdrop(false);
    };

    return(        
        <Modal            
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="modal" >
                <List sx={{ width: 400, maxWidth: 600, maxHeight: 400, height: 400, overflow: 'auto', bgcolor: 'background.paper'}}>  
                    {users.length === 0 ?                                       
                        <Typography fontSize={28} textAlign={"center"}>
                            {t("no_one_sent")}
                        </Typography>  
                                            
                    : <></>}                                                                                                                                                            
                    {users.map((el, index) => {                             
                        const date = new Date(lesson.users[index].creationDate);                
                        return(
                            <ListItem
                                sx={{"&:hover": { bgcolor: '#E7E7E7', transition: '0.5s' } }}                                        
                                key={index}
                                secondaryAction={
                                    lesson.type !== "laboratory" ?
                                        <FormControl>
                                            <InputLabel id="markLabel">{t("mark")}</InputLabel>
                                            <Select  
                                                sx={{minWidth: 120}}                  
                                                id="mark"                                                
                                                defaultValue={lesson.users[index].mark === undefined ? 0 : lesson.users[index].mark}
                                                onChange={ e => handleTypeChange(e, lesson.users[index].id)}                                          
                                                label={t("mark")}
                                            >   
                                                <MenuItem value={0}>0</MenuItem>   
                                                <MenuItem value={1}>1</MenuItem>
                                                <MenuItem value={2}>2</MenuItem>
                                                <MenuItem value={3}>3</MenuItem>
                                                <MenuItem value={4}>4</MenuItem>
                                                <MenuItem value={5}>5</MenuItem>
                                                <MenuItem value={6}>6</MenuItem>
                                                <MenuItem value={7}>7</MenuItem>
                                                <MenuItem value={8}>8</MenuItem>
                                                <MenuItem value={9}>9</MenuItem>
                                                <MenuItem value={10}>10</MenuItem>
                                            </Select>
                                        </FormControl>
                                        :
                                        <FormControl>
                                            <InputLabel id="markLabel">{t("mark")}</InputLabel>
                                            <Select  
                                                sx={{minWidth: 120}}                  
                                                id="mark"
                                                
                                                defaultValue={lesson.users[index].mark}
                                                onChange={ e => handleTypeChange(e, lesson.users[index].id)}                                                                                       
                                                label={t("mark")}
                                            >                           
                                                <MenuItem value="pass">{t("pass")}</MenuItem>
                                                <MenuItem value="fail">{t("fail")}</MenuItem>                                                
                                            </Select>
                                        </FormControl>                                      
                                }                                
                            >                            
                                <ListItemText 
                                    primary={`${date.toLocaleDateString(`${i18n.language}-${i18n.language.toUpperCase()}`)} | ${el.firstName} ${el.lastName}`}
                                    secondary={
                                        <Link href={lesson.users[index].downloadLink}>{t("download_file")}</Link>                        
                                    } 
                                />                                                                
                            </ListItem>
                        )                                    
                    })}                                       
                </List>
            </Box>
        </Modal>        
    );
}

export default TaskListModal;