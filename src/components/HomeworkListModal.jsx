import React, { useEffect, useState } from "react";

//Mui
import { Box, List, ListItem, ListItemText, Link, Modal } from '@mui/material';
import "../styles/rooms.css";
import { GetLessonById, GetUserById } from "../Data/db";

const HomeworkListModal = ({isOpen, handleClose, id}) => {
    const [lesson, setLesson] = useState();
    const [users, setUsers] = useState([]);

    const loadUsers = async () => {
        const lessonData = await GetLessonById(id);        
        setLesson(lessonData);
        await lessonData.users.map(async (element) => {
            const user = await GetUserById(element.id);
            setUsers(users => [...users, user]);
        });               
    }

    useEffect(() => {
        loadUsers();
    }, []);

    return(        
        <Modal            
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="modal">
                <List sx={{ width: 600, bgcolor: 'background.paper'}}>  
                    {users.length === 0 ? 
                    <>
                        <h1 style={{textAlign:'center', margin: 'auto'}}>No one has sent a file yet</h1>
                    </> 
                    : <></>}                                                                                                                                        
                    {users.map((el, index) => {        
                        const date = new Date(lesson.users[index].creationDate);                
                        return(
                            <ListItem
                                sx={{"&:hover": { bgcolor: '#E7E7E7', transition: '0.5s' } }}                                        
                                key={index}
                                secondaryAction={(
                                    <>
                                        <Link href={lesson.users[index].downloadLink}>Download file</Link>
                                    </>
                                )}                                
                            >                            
                                <ListItemText primary={`${date.toDateString()} | ${el.firstName} ${el.lastName}`} />                            
                            </ListItem>
                        )                                    
                    })}                                       
                </List>
            </Box>
        </Modal>        
    );
}

export default HomeworkListModal;