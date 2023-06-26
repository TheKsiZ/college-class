import React, { useState } from "react";

import { FormControl, Select, MenuItem } from '@mui/material';
import "../../styles/test.css";
import { useEffect } from "react";

const OrderSelect = ({questions, questionIndex, answers, index}) => {
    
    const [order, setOrder] = useState(answers[index][0]);
    const handleTypeChange = (event) => {                     
        setOrder(event.target.value) 
        answers[index][0] = event.target.value;

        questions[questionIndex]["answers"] = answers;
    };
    
    useEffect(() => {
        setOrder(answers[index][0]);
    }, [answers])

    return(
        <>
        <FormControl size="small">
            <Select  
                sx={{minWidth: 75, mr: 1, mb: 1}}                  
                id="order"    
                value={order}                                                                
                onChange={e => handleTypeChange(e)} 
            >
                {            
                    answers.map((item, index) => {
                        return(
                            <MenuItem key={index} value={index+1}>{index+1}</MenuItem>   
                        )
                    })
                }
            </Select>
        </FormControl>
        </>
    )
}

export default OrderSelect;