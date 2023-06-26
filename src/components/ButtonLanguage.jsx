import React from "react";
import { useTranslation } from "react-i18next";
import { Button, } from "@mui/material";
import { useContext } from "react";
import { Context } from "../index";
const ButtonLanguage = () => {
    const { t, i18n } = useTranslation();
    const {setTranslation} = useContext(Context);
    const changeLanguage = (language) => {
        setTranslation(language);
    }    

    return(
        <div style={{ position: "absolute", right: 10, top: 10 }}>
                    {
                        i18n.language === "ru" ?
                        <Button 
                            sx={{
                                backgroundColor: "none",
                                borderColor: "#163526",
                                border: 2,
                            }}
                            onClick={() => changeLanguage("en")}
                        >
                            EN
                        </Button>
                        :
                        <Button 
                            sx={{
                                backgroundColor: "none",
                                borderColor: "#163526",
                                border: 2,
                            }}
                            onClick={() => changeLanguage("ru")}
                        >
                            РУ
                        </Button>
                    }                                        
            </div>
    );
}

export default ButtonLanguage;