import React from "react";
import { Routes, Route } from 'react-router-dom';

import Home from "../pages/Home";
import Login from "../pages/Login";
import Reset from "../pages/Reset";
import Registration from "../pages/Registration";
import Rooms from "../pages/Rooms/Rooms";
import UserProfile from "../pages/Rooms/UserProfile";
import Room from "../pages/Room/Room";
import Users from "../pages/Room/Users";
import Statistics from "../pages/Room/Statistics";
import Settings from "../pages/Room/Settings";
import Test from "../pages/Room/Test";
import NotFound from "../pages/NotFound";

const Router = () => {
    return(        
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/reset" element={<Reset/>}/>
            <Route path="/registration" element={<Registration/>}/>        
            <Route path="/rooms" element={<Rooms/>}/>
            <Route path="/rooms/profile" element={<UserProfile/>}/>
            <Route path="/room" element={<Room/>}/>
            <Route path="/room/users" element={<Users/>}/>
            <Route path="/room/statistics" element={<Statistics/>}/>
            <Route path="/room/settings" element={<Settings/>}/>
            <Route path="/room/test" element={<Test/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    )
}

export default Router;