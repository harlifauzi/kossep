import React, { useEffect } from "react";
import "./App.css";
import { Firebase, Routes } from "./config";
import { MyNavbar } from "./components";
import { useDispatch } from "react-redux";


const App = () => {
    const dispatch = useDispatch();


    useEffect(() => {
        checkUser();
    }, []);


    const checkUser = () => {
        Firebase.auth().onAuthStateChanged( async (user) => {
            if(user){
                const responseDataUser = await Firebase.database().ref(`users/${user.uid}`).once('value').then(res => res.val());
                dispatch({type: 'UPDATE_DATA_USER', payload: responseDataUser});
                dispatch({type: 'UPDATE_LOGIN_STATUS', payload: true});
                localStorage.setItem("user", JSON.stringify(responseDataUser));
                localStorage.setItem("userLoginStatus", JSON.stringify(true));
            } else {
                localStorage.setItem("userLoginStatus", JSON.stringify(false));
            }
        })
    }


    return (
        <div className="app-container">
            <MyNavbar/>
            <Routes />
        </div>
    );
};


export default App;