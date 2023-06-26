import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Box, Button, FormControl, Typography } from '@mui/material';
import "../../styles/test.css";
import CheckboxTextField from "./CheckboxTextField";
import CheckboxTest from "./CheckboxTest";
import { GetIsUserTeacher } from "../../Data/db";

const CheckboxTestItem = ({questions, questionIndex}) => {
    const { t, i18n } = useTranslation();
    let answer = questions[questionIndex]["answers"] === undefined ? [ [1, "", false] ] : questions[questionIndex]["answers"];
    const [answers, setAnswers] = useState(answer);    
    const handleClickAdd = () => {
        const answer = [answers.length + 1, "", false];
        setAnswers(current => [...current, answer]);                            
    }

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
            {
                answers.map((item, index) => {
                    return(
                        <Box key={index} sx={{display: "flex", justifyContent: "space-between"}}>
                            <CheckboxTest questions={questions} questionIndex={questionIndex} answers={answers} index={index}/> 
                            <CheckboxTextField questions={questions} questionIndex={questionIndex} answers={answers} index={index}/>
                        </Box>
                    )
                })
            }
            {
                GetIsUserTeacher() ?
                    <Button sx={{mt: 1}} variant="contained" onClick={handleClickAdd} size="small" fullWidth={true}>{t("add_options")}</Button>            
                :
                    <></>
            }
            
        </FormControl>        
    )
}

export default CheckboxTestItem;