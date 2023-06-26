import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Button, FormControl, RadioGroup, Radio, FormControlLabel, Typography } from '@mui/material';
import "../../styles/test.css";
import RadioTextField from "./RadioTextField";
import { useEffect } from "react";
import { GetIsUserTeacher } from "../../Data/db";

const RadioTestItem = ({questions, questionIndex}) => {
    const { t, i18n } = useTranslation();
    let answer = questions[questionIndex]["answers"] === undefined ? [ [1, "", true] ] : questions[questionIndex]["answers"];  
    const [answers, setAnswers] = useState(answer);    
    const handleClickAdd = () => {
        const answer = [answers.length + 1, "", false];
        setAnswers(current => [...current, answer]);                         
    }

    const [radioValue, setRadioValue] = useState(1);
    
    const handleChange = (event) => {
        setRadioValue(event.target.value);  
        
        answers.map((item, index) => {
            if(index + 1 === parseInt(event.target.value, 10)){
                answers[index][2] = true;
            }
            else{
                answers[index][2] = false;
            }
        })

        questions[questionIndex]["answers"] = answers; 
    };

    useEffect(() => {
        questions[questionIndex]["answers"] = answers;          
    }, [answers]);

    useEffect(() => {
        setAnswers(questions[questionIndex]["answers"])
    }, [questions])

    return(        
        <FormControl fullWidth={true}>            
            <Typography>
                {t("answer")}:      
            </Typography>   
            <RadioGroup 
                name="radio-buttons-group"
                value={radioValue}
                onChange={handleChange}
            >
            {
                answers.map((item, index) => {
                    return(
                        <Box key={index} sx={{display: "flex", justifyContent: "space-between"}}>
                            <FormControlLabel value={index + 1} control={<Radio checked={answers[index][2]}/>} /> 
                            <RadioTextField questions={questions} questionIndex={questionIndex} answers={answers} index={index}/>
                        </Box>
                    )
                })
            }
            {
                GetIsUserTeacher() === true ?
                    <Button sx={{mt: 1}} variant="contained" onClick={handleClickAdd} size="small" fullWidth={true}>{t("add_options")}</Button>
                :
                    <></>
            }
            
            </RadioGroup>
        </FormControl>        
    )
}

export default RadioTestItem;