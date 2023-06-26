import React, { useState } from "react";

import { TextField } from '@mui/material';
import "../../styles/test.css";
import { useEffect } from "react";
import { GetIsUserTeacher } from "../../Data/db";

const ComparisonTextField = ({questions, questionIndex, answers, index}) => {

    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    const alphabet = alpha.map((x) => String.fromCharCode(x));

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
            label={alphabet[index]} 
            variant="standard"
            sx={{flex: 1}}
            fullWidth={true} 
            value={text}
            InputProps={{
                readOnly: !GetIsUserTeacher(),
            }}
            multiline
            onChange={handleChange}
        />
    )
}

export default ComparisonTextField;