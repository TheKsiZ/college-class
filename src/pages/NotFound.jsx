import React from "react";
import "../styles/home.css";
import { RemoveTestCode } from "../Data/db";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
const NotFound = () => {
    RemoveTestCode();

    const { t, i18n } = useTranslation();
    return(
        <div className="home-div">
            <Typography variant="h1">
                404
            </Typography>
            <Typography>
                {t("page_not_found")}
            </Typography>            
        </div>
    )
}

export default NotFound;