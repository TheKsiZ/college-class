import React, { useState } from "react";

import { TextField } from '@mui/material';
import "../../styles/test.css";
import { useEffect } from "react";
import { GetIsUserTeacher } from "../../Data/db";

const OrderTextField = ({questions, questionIndex, answers, index}) => {

    const [text, setText] = useState(answers[index][1]);
    const handleChange = (e) => {
        setText(e.target.value);
        answers[index][1] = e.target.value;

        questions[questionIndex]["answers"] = answers;        
    }

    useEffect(() => {
        setText(answers[index][1]);
    }, [answers])

    return(
        <TextField 
            id="option" 
            variant="standard" 
            sx={{flex: 1, mt: 1}} 
            fullWidth={true} 
            InputProps={{
                readOnly: !GetIsUserTeacher(),
            }}
            multiline
            value={text}
            onChange={handleChange}
        />
    )
}

export default OrderTextField;