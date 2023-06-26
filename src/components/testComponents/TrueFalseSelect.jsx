import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormControl, Select, MenuItem} from '@mui/material';
import "../../styles/test.css";
import { useEffect } from "react";

const TrueFalseSelect = ({questions, questionIndex, answers, index}) => {    
    const { t, i18n } = useTranslation();
    const [selectValue, setSelectValue] = useState(answers[index][0]);
    const handleTypeChange = (event) => {                     
        setSelectValue(event.target.value);
        answers[index][0] = event.target.value;     
        
        questions[questionIndex]["answers"] = answers; 
    };
    
    useEffect(() => {
        setSelectValue(answers[index][0]);
    }, [answers])

    return(
        <>
        <FormControl size="small">
            <Select                  
                sx={{minWidth: 100, mr: 1, mb: 1}}                  
                id="truefalse"                            
                value={selectValue}                                                        
                onChange={e => handleTypeChange(e)} 
            >
                <MenuItem value="true">{t("true")}</MenuItem>
                <MenuItem value="false">{t("false")}</MenuItem>
            </Select>
        </FormControl>
        </>
    )
}

export default TrueFalseSelect;