import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Box, Backdrop, ThemeProvider, CircularProgress, Button, Collapse, Alert, TextField } from "@mui/material";
import Theme from "../../muiComponents/MUIBlackTheme";
import NaviagtionRoom from "../../components/NavigationRoom";

import { IsCodeActive, CreateTest, IsTestCodeActive, GetTestCode, GetTestData, GetIsUserTeacher, UpdateTest, SetTestMark } from '../../Data/db';
import "../../styles/test.css";
import Question from '../../components/Question';

const Test = () => {
    IsCodeActive();            
    if(!GetIsUserTeacher()){            
        IsTestCodeActive();
    } 
    const { t, i18n } = useTranslation();
    const [progress, setProgress] = useState(false);

    const [backdropOpen, setBackdropOpen] = useState(false);
    const handleBackdrop = (state) => setBackdropOpen(state);

    let data;
    const [questions, setQuestions] = useState([
        {
            type: "single_choice",
            description: ""
        }
    ]);  

    const LoadData = async () => {    
        if(GetTestCode()){
            data = await GetTestData();            
            
            setTitle(data.title);
            setDescription(data.description);                        

            if(!GetIsUserTeacher()) {
                let userData = JSON.parse(data.questions);                

                userData.map((question, index) => {
                    if(question["type"] === "single_choice"){
                        question["answers"].forEach(item => {
                            item[2] = false;
                        })
                        question["answers"][0][2] = true;
                    }

                    if(question["type"] === "multiple_choice"){
                        question["answers"].forEach(item => {
                            item[2] = false;
                        })                        
                    }

                    if(question["type"] === "order_indication" || question["type"] === "comparison"){
                        question["answers"].forEach(item => {
                            item[0] = 1;
                        })
                    }

                    if(question["type"] === "true_false"){
                        question["answers"].forEach(item => {
                            item[0] = "true";
                        })
                    }

                    if(question["type"] === "text_input")
                        question["answers"] = [""];
                })
                
                setQuestions(userData);
            }
            else {
                setQuestions(JSON.parse(data.questions));                
            }            
        }            
    }

    useEffect(() => {
        LoadData();                
    }, []);
    
    useEffect(() => {
        setProgress(true); 
    }, [questions])

    const handleClickAdd = () => {
        const question = {
            type: "single_choice",
            description: "",
        }                
        setQuestions(current => [...current, question]);        
    }

    const handleClose = (e, index) => {    
        if(questions.length <= 1) return;

        setQuestions(current => current.filter((question, i) => i !== index));
    }

    const [error, setError] = useState("");
    const [isAlertOpen, setAlertOpen] = useState(false);

    const [title, setTitle] = useState('');
    const [openErrorTitle, setOpenErrorTitle] = useState(false);
    const [errorTitleText, setErrorTitleText] = useState("");
    
    const [description, setDescription] = useState('');
    const [openErrorDesc, setOpenErrorDesc] = useState(false);
    const [errorDescText, setErrorDescText] = useState("");

    const validateFields = () => {
        if(title === ""){
            setErrorTitleText(t("error_empty_test_title"));
            setOpenErrorTitle(true);
            return true;
        }
        if(title.length > 32){
            setErrorTitleText(t("error_room_title_length"));
            setOpenErrorTitle(true);
            return true;
        }
        setErrorTitleText("");
        setOpenErrorTitle(false);
        
        if(description.length > 100){
            setErrorDescText(t("error_room_desc_length"));
            setOpenErrorDesc(true);
            return true;
        }
        setErrorDescText("");
        setOpenErrorDesc(false);

        return false;
    }

    const handleCreate = async (e) => {
        if(validateFields()) return;

        let flag = false;
        questions.forEach((question, index) => {            
            if(question.description === ""){
                setError(`${t("question")} №${index+1}. ${t("error_question_desc_empty")}`);
                setAlertOpen(true);
                flag = true;
                return;
            }
            
            if(question.type !== "text_input"){
                let isOptionEmpty = false;
                question["answers"].forEach((answer, answerIndex) => {
                    if(answer[1] === ""){
                        setError(`${t("question")} №${index+1}. ${t("option")} №${answerIndex+1} ${t("error_is_empty")}`);
                        setAlertOpen(true);
                        isOptionEmpty = true;
                        flag = true;
                        return;
                    }                    
                })

                if(isOptionEmpty){
                    return;
                }
            }

            if(question.type === "text_input"){
                let isOptionEmpty = false;
                question["answers"].forEach((answer, answerIndex) => {
                    if(answer === ""){
                        setError(`${t("question")} №${index+1}. ${t("option")} №${answerIndex+1} ${t("error_is_empty")}`);
                        setAlertOpen(true);
                        isOptionEmpty = true;
                        flag = true;
                        return;
                    }                    
                })

                if(isOptionEmpty){
                    return;
                }
            }

            if(question.type === "multiple_choice"){                
                let isAnyChecked = false;
                question["answers"].forEach((answer, answerIndex) => {
                    if(answer[2] === true){
                        isAnyChecked = true;                    
                    }                    
                })

                if(!isAnyChecked){
                    setError(`${t("question")} №${index+1}. ${t("error_check_option")}`);
                    setAlertOpen(true);
                    flag = true;
                    return;
                }
            }

            if(question.type === "order_indication" || question.type === "comparison"){
                let isSame = false;
                question["answers"].forEach((answer, answerIndex) => {                                                                      
                    for(let i = 0; i < question["answers"].length; i++){
                        if(i === answerIndex) continue;

                        if(answer[0] === question["answers"][i][0]){                            
                            setError(`${t("question")} №${index+1}. ${t("error_finish_order")}`);
                            setAlertOpen(true);                                                        
                            isSame = true;
                            flag = true;
                            break;                            
                        }
                    }
                    if(isSame) return;                        
                })

                if(isSame) return;
            }            
        })        

        if(!flag){
            handleBackdrop(true);
            await CreateTest(title, description, questions);
            handleBackdrop(false);
        }     
    }

    const handleUpdate = async (e) => {
        if(validateFields()) return;

        let flag = false;
        questions.forEach((question, index) => {            
            if(question.description === ""){
                setError(`${t("question")} №${index+1}. ${t("error_question_desc_empty")}`);
                setAlertOpen(true);
                flag = true;
                return;
            }
            
            if(question.type !== "text_input"){
                let isOptionEmpty = false;
                question["answers"].forEach((answer, answerIndex) => {
                    if(answer[1] === ""){
                        setError(`${t("question")} №${index+1}. ${t("option")} №${answerIndex+1} ${t("error_is_empty")}`);
                        setAlertOpen(true);
                        isOptionEmpty = true;
                        flag = true;
                        return;
                    }                    
                })

                if(isOptionEmpty){
                    return;
                }
            }

            if(question.type === "text_input"){
                let isOptionEmpty = false;
                question["answers"].forEach((answer, answerIndex) => {
                    if(answer === ""){
                        setError(`${t("question")} №${index+1}. ${t("option")} №${answerIndex+1} ${t("error_is_empty")}`);
                        setAlertOpen(true);
                        isOptionEmpty = true;
                        flag = true;
                        return;
                    }                    
                })

                if(isOptionEmpty){
                    return;
                }
            }

            if(question.type === "multiple_choice"){                
                let isAnyChecked = false;
                question["answers"].forEach((answer, answerIndex) => {
                    if(answer[2] === true){
                        isAnyChecked = true;                        
                    }                    
                })

                if(!isAnyChecked){
                    setError(`${t("question")} №${index+1}. ${t("error_check_option")}`);
                    setAlertOpen(true);
                    flag = true;
                    return;
                }
            }

            if(question.type === "order_indication" || question.type === "comparison"){
                let isSame = false;
                question["answers"].forEach((answer, answerIndex) => {                                                                      
                    for(let i = 0; i < question["answers"].length; i++){
                        if(i === answerIndex) continue;

                        if(answer[0] === question["answers"][i][0]){                            
                            setError(`${t("question")} №${index+1}. ${t("error_finish_order")}`);
                            setAlertOpen(true);                                                        
                            isSame = true;
                            flag = true;
                            break;                            
                        }
                    }
                    if(isSame) return;                        
                })

                if(isSame) return;
            }            
        })        
        
        if(!flag){
            handleBackdrop(true);
            await UpdateTest(GetTestCode(), title, description, questions);
            handleBackdrop(false);
        }        
    }

    const [mark, setMark] = useState(0);
    const [result, setResult] = useState(0);

    const handleFinish = async (e) => {        
        if(validateFields()) return;

        let flag = false;
        questions.forEach((question, index) => {            
            if(question.description === ""){
                setError(`${t("question")} №${index+1}. ${t("error_question_desc_empty")}`);
                setAlertOpen(true);
                flag = true;
                return;
            }
            
            if(question.type !== "text_input"){
                let isOptionEmpty = false;
                question["answers"].forEach((answer, answerIndex) => {
                    if(answer[1] === ""){
                        setError(`${t("question")} №${index+1}. ${t("option")} №${answerIndex+1} ${t("error_is_empty")}`);
                        setAlertOpen(true);
                        isOptionEmpty = true;
                        flag = true;
                        return;
                    }                    
                })

                if(isOptionEmpty){
                    return;
                }
            }

            if(question.type === "text_input"){
                let isOptionEmpty = false;
                question["answers"].forEach((answer, answerIndex) => {
                    if(answer === ""){
                        setError(`${t("question")} №${index+1}. ${t("option")} №${answerIndex+1} ${t("error_is_empty")}`);
                        setAlertOpen(true);
                        isOptionEmpty = true;
                        flag = true;
                        return;
                    }                    
                })

                if(isOptionEmpty){
                    return;
                }
            }

            if(question.type === "multiple_choice"){                
                let isAnyChecked = false;
                question["answers"].forEach((answer, answerIndex) => {
                    if(answer[2] === true){
                        isAnyChecked = true;
                        
                    }                    
                })

                if(!isAnyChecked){
                    setError(`${t("question")} №${index+1}. ${t("error_check_option")}`);
                    setAlertOpen(true);
                    flag = true;
                    return;
                }
            }

            if(question.type === "order_indication" || question.type === "comparison"){
                let isSame = false;
                question["answers"].forEach((answer, answerIndex) => {                                                                      
                    for(let i = 0; i < question["answers"].length; i++){
                        if(i === answerIndex) continue;

                        if(answer[0] === question["answers"][i][0]){                            
                            setError(`${t("question")} №${index+1}. ${t("error_finish_order")}`);
                            setAlertOpen(true);                                                        
                            isSame = true;
                            flag = true;
                            break;                            
                        }
                    }
                    if(isSame) return;                        
                })

                if(isSame) return;
            }            
        })        
        
        if(!flag){
            handleBackdrop(false);
            data = await GetTestData();            
            let testData = JSON.parse(data.questions);
                        
            let allPoints = 0;
            let userPoints = 0;
            questions.forEach((question, index) => {

                if(question["type"] === "single_choice"){
                    allPoints += 1;

                    let fail = false;                
                    question["answers"].forEach((answer, answerIndex) => {
                        if(answer[2] !== testData[index]["answers"][answerIndex][2]){
                            fail = true;                            
                        }
                    })

                    if(!fail){
                        userPoints += 1;
                    }
                }

                if(question["type"] === "multiple_choice"){
                    allPoints += 2;
                    
                    let fail = false;
                    question["answers"].forEach((answer, answerIndex) => {
                        if(answer[2] !== testData[index]["answers"][answerIndex][2]){
                            fail = true;                            
                        }
                    })

                    if(!fail){
                        userPoints += 2;
                    }
                }

                if(question["type"] === "order_indication" || question["type"] === "comparison"){
                    allPoints += 3;
                    
                    let fail = false;
                    question["answers"].forEach((answer, answerIndex) => {
                        if(answer[0] !== testData[index]["answers"][answerIndex][0]){
                            fail = true;                            
                        }
                    })

                    if(!fail){
                        userPoints += 3;
                    }
                }

                if(question["type"] === "true_false"){
                    allPoints += 4;
                    
                    let fail = false;
                    question["answers"].forEach((answer, answerIndex) => {
                        if(answer[0] !== testData[index]["answers"][answerIndex][0]){
                            fail = true;                            
                        }
                    })

                    if(!fail){
                        userPoints += 4;
                    }
                }

                if(question["type"] === "text_input"){
                    allPoints += 4;
                    
                    let fail = true;
                    testData[index]["answers"].forEach((answer) => {
                        if(answer === question["answers"][0]){
                            fail = false;
                        }
                    })

                    if(!fail){
                        userPoints += 4;
                    }
                }
            })

            let result = (userPoints * 100 / allPoints).toFixed(2); 
            let mark = 0;
            if(result == 100){
                mark = 10;
            }
            else if(result >= 95){
                mark = 9;
            }
            else if (result >= 85){
                mark = 8;
            }
            else if (result >= 75){
                mark = 7;
            }
            else if (result >= 65){
                mark = 6;
            }
            else if (result >= 55){
                mark = 5;
            }
            else if (result >= 45){
                mark = 4;
            }
            else if (result >= 35){
                mark = 3;
            }
            else if (result >= 25){
                mark = 2;
            }
            else if (result >= 15){
                mark = 1;
            }
            setResult(result);
            setMark(mark);
            setOpenSuccessAlert(true);
            await SetTestMark(GetTestCode(), mark);

            handleBackdrop(false);
        }  
    }

    const [isOpenSuccessAlert, setOpenSuccessAlert] = useState(false); 
    return(
        <>
        <ThemeProvider theme={Theme}>
            <NaviagtionRoom/> 
            {!progress ? 
                <CircularProgress className="users-div" /> 
                : 
                <>                                
                    <div className='test-box' >
                    <TextField 
                            id="title" 
                            label={t("title")} 
                            variant="standard"                                           
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}                                            
                            sx={{mb: 1 }}
                            InputProps={{
                                readOnly: !GetIsUserTeacher(),
                            }}
                            fullWidth={true}
                            error={openErrorTitle}
                            helperText={errorTitleText}
                            required                    
                        />                                  
                        <TextField 
                            id="description"
                            label={t("description")}
                            variant="standard"                                            
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}                                            
                            InputProps={{
                                readOnly: !GetIsUserTeacher(),
                            }}
                            fullWidth={true}
                            maxRows={4}
                            multiline      
                            error={openErrorDesc}
                            helperText={errorDescText}
                        />                          
                    </div>                                                                                                     
                        {
                            questions.map((question, index) => {                        
                                return(
                                    <Question key={index} index={index} questions={questions} handleClose={handleClose}/>       
                                )
                            })
                        }                   
                    <div className='test-div'>
                        {
                            GetIsUserTeacher() ?                                
                            <>
                                <Button variant="contained" sx={{mb: 3}} onClick={handleClickAdd} fullWidth={true}>{t("create_question")}</Button><br/>
                            </>                            
                            :
                            <></>                                
                        }                        
                        {                            
                            GetIsUserTeacher() ? 
                            (                                
                                !GetTestCode() ?
                                    <Button variant="contained" onClick={(event) => handleCreate(event)} color="error" fullWidth={true}>{t("create_test")}</Button>
                                :
                                    <Button variant="contained" onClick={(event) => handleUpdate(event)} color="error" fullWidth={true}>{t("update_test")}</Button>
                            )                             
                            :
                            <Button variant="contained" onClick={(event) => handleFinish(event)} color="error" fullWidth={true}>{t("finish_test")}</Button>                            
                        }                        
                    </div>        
                </>   
            }   

        <Backdrop                    
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
                open={backdropOpen}                    
            >
                <Box sx={{m: "auto"}}>
                    <CircularProgress  />
                </Box>
        </Backdrop>                           
        </ThemeProvider>
        

        { error !== "" || error !== undefined ? (         
                <span className="footer">
                    <Collapse in={isAlertOpen}>
                        <Alert onClose={() => {setAlertOpen(!isAlertOpen)}} severity="error">{ error }</Alert>
                    </Collapse>
                </span>
            ) : null}

        { isOpenSuccessAlert ? (         
                <span className="footer">
                    <Collapse in={isOpenSuccessAlert}>
                        <Alert onClose={() => {setOpenSuccessAlert(!isOpenSuccessAlert)}} severity="success">{`${t("finished_test")} ${result}%`} </Alert>
                    </Collapse>
                </span>
            ) : <></>} 
        </>
    )
}

export default Test;


// questions = [
//     question,
// ]

// question = {
//     type: "single",
//     description: "text",
//     answers: [
//          answer
//     ],
// }

//single or multi
//answer = [
//    [number, "text", true],
//    [number, "text", false],
//];

//order or comparison
//answer = [
//  [number, "text"]  
//]

//true or false
// answer = {
//     "true": "text",
//     "false": "text",
// }

//text inputs
// answer = [
//     "",
//     "",
// ]