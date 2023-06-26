import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Button, FormControl, Typography} from '@mui/material';
import "../../styles/test.css";

import TextInputTextField from "./TextInputTextField";
import { useEffect } from "react";
import { GetIsUserTeacher } from "../../Data/db";

const TextInputTestItem = ({questions, questionIndex}) => {
    const { t, i18n } = useTranslation();
    let answer = questions[questionIndex]["answers"] === undefined ? [""] : questions[questionIndex]["answers"];
    const [answers, setAnswers] = useState(answer);    
    const handleClickAdd = () => {
        const answer = "";
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
                            <TextInputTextField questions={questions} questionIndex={questionIndex} answers={answers} index={index}/>                            
                        </Box>                        
                    )
                })
            }
            {
                GetIsUserTeacher() ? 
                    <Button sx={{mt: 1}} variant="contained" onClick={handleClickAdd} size="small" fullWidth={true}>{t("add_answers")}</Button>            
                :
                <></>
            }            
        </FormControl>        
    )
}

export default TextInputTestItem;