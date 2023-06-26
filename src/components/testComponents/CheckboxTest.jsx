import React, { useState } from "react";

import { FormControlLabel, Checkbox} from '@mui/material';
import "../../styles/test.css";
import { useEffect } from "react";

const CheckboxTest = ({questions, questionIndex, answers, index}) => {

    const [checkboxValue, setCheckboxValue] = useState(answers[index][2]);
    
    const handleChange = (event) => {              
        setCheckboxValue(event.target.checked);                
        answers[index][2] = !answers[index][2];  
        
        questions[questionIndex]["answers"] = answers;
    };

    useEffect(() => {
        setCheckboxValue(answers[index][2]);      
    }, [answers])

    return(
        <FormControlLabel                             
            control={
                <Checkbox 
                    onChange={handleChange} 
                    checked={checkboxValue}
                />
            } 
        />        
    )
}

export default CheckboxTest;