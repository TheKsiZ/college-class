import React from "react";
import {Routes, Route} from 'react-router-dom';

import Home from "../pages/Home";
import Login from "../pages/Login";
import Registration from "../pages/Registration";
import Rooms from "../pages/Rooms";
import NotFound from "../pages/NotFound";

const Router = () => {
    return(
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/registration" element={<Registration/>}/>        
            <Route path="/rooms" element={<Rooms/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    )
}

export default Router;