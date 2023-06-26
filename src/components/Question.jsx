import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
//Mui
import { TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Typography } from '@mui/material';
import "../styles/test.css";

import RadioTestItem from "./testComponents/RadioTestItem";
import CloseIcon from '@mui/icons-material/Close';
import CheckboxTestItem from "./testComponents/CheckboxTestItem";
import TextInputTestItem from "./testComponents/TextInputTestItem";
import OrderTestItem from "./testComponents/OrderTestItem";
import ComparisonTestItem from "./testComponents/ComparisonTestItem";
import TrueFalseTestItem from "./testComponents/TrueFalseTestItem";
import { GetIsUserTeacher } from "../Data/db";

const Question = ({index, questions, handleClose}) => {    
    const [description, setDescription] = useState(questions[index]["description"]);    
    const { t, i18n } = useTranslation();
    const handleChange = (e) => {
        setDescription(e.target.value);
        questions[index]["description"] = e.target.value;
    }

    const [type, setType] = useState(questions[index]["type"]);
    const handleTypeChange = async (event) => {                     
        setType(event.target.value);                 

        if(questions[index]["answers"] !== undefined){
            delete questions[index]["answers"];
        }

        questions[index]["type"] = event.target.value;    
    };

    useEffect(() => {
        setType(questions[index]["type"]);
        setDescription(questions[index]["description"]);
    }, [questions]);

    return(
        <div className='test-box' style={{position: "relative"}}>
            {
                GetIsUserTeacher() ?
                <>
                    <div style={{position: "absolute", top: -5, right: -5}}>
                        <IconButton onClick={(e) => handleClose(e, index)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <FormControl fullWidth={true} sx={{mb: 2}}>           
                        <InputLabel id="typeLabel">{t("type")}</InputLabel>
                        <Select                                          
                            id="type"
                            value={type}
                            onChange={handleTypeChange}
                            displayEmpty
                            label={t("type")}
                        >   
                            <MenuItem value="single_choice">{t("single_choice")}</MenuItem>                        
                            <MenuItem value="multiple_choice">{t("multiple_choice")}</MenuItem>  
                            <MenuItem value="order_indication">{t("order_indication")}</MenuItem>  
                            <MenuItem value="comparison">{t("comparison")}</MenuItem>                                     
                            <MenuItem value="true_false">{t("true_false")}</MenuItem>                              
                            <MenuItem value="text_input">{t("text_input")}</MenuItem>          
                        </Select>
                    </FormControl>    
                </>
                :
                <>
                
                </>
            }

            <Typography>
                {`${t("question")} №${index+1}`} 
            </Typography>        
            <TextField 
                id="description"
                label={t("question_desc")}
                variant="standard"  
                InputProps={{
                    readOnly: !GetIsUserTeacher(),
                }}
                onChange={handleChange}
                value={description}                                                            
                fullWidth={true}
                maxRows={7}
                multiline           
                sx={{mb: 2}}
            />
            
            {
                type === "single_choice" ?
                    (
                        <RadioTestItem questions={questions} questionIndex={index}/>                        
                    )
                :
                type === "multiple_choice" ?
                    (
                        <CheckboxTestItem questions={questions} questionIndex={index}/>
                    )
                :
                type === "order_indication" ?
                    (
                        <OrderTestItem questions={questions} questionIndex={index}/>
                    )
                :
                type === "comparison" ?
                    (
                        <ComparisonTestItem questions={questions} questionIndex={index}/>
                    )
                :
                type === "true_false" ?
                    (
                        <TrueFalseTestItem questions={questions} questionIndex={index}/>
                    )
                :
                type === "text_input" ?
                    (                        
                        <TextInputTestItem questions={questions} questionIndex={index}/>                   
                    )
                :                
                <></>                
            }
        </div>
    );
}

export default Question;