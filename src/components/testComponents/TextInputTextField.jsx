import React, { useState } from "react";

import { TextField } from '@mui/material';
import "../../styles/test.css";
import { useEffect } from "react";
import { GetIsUserTeacher } from "../../Data/db";

const TextInputTextField = ({questions, questionIndex, answers, index}) => {    
        
    const [text, setText] = useState(answers[index]);
    const handleChange = (e) => {
        setText(e.target.value);
        answers[index] = e.target.value;

        questions[questionIndex]["answers"] = answers;        
    }

    useEffect(() => {
        setText(answers[index]);
    }, [answers])

    return(
        <TextField 
            id="option"
            label={GetIsUserTeacher() ? index+1 : ""} 
            variant="standard" 
            type="text"
            sx={{flex: 1}} 
            fullWidth={true} 
            multiline
            value={text}
            onChange={handleChange}
        />
    )
}

export default TextInputTextField;