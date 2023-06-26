import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Button, FormControl, Typography } from '@mui/material';
import "../../styles/test.css";
import TrueFalseSelect from "./TrueFalseSelect";
import TrueFalseTextField from "./TrueFalseTextField";
import { useEffect } from "react";
import { GetIsUserTeacher } from "../../Data/db";

const TrueFalseTestItem = ({questions, questionIndex}) => {
    const { t, i18n } = useTranslation();
    let answer = questions[questionIndex]["answers"] === undefined ? [ ['true', ""] ] : questions[questionIndex]["answers"];
    const [answers, setAnswers] = useState(answer);   
    const handleClickAdd = () => {
        const answer = ['true', ""]
        setAnswers(current => [...current, answer]);                 
    }

    useEffect(() => {
        questions[questionIndex]["answers"] = answers;        
    }, [answers])

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
                            <TrueFalseSelect questions={questions} questionIndex={questionIndex} answers={answers} index={index}/>
                            <TrueFalseTextField questions={questions} questionIndex={questionIndex} answers={answers} index={index}/>
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
        </FormControl>        
    )
}

export default TrueFalseTestItem;