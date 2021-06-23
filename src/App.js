import React, { useEffect, useState } from "react";
import "./App.css";
import { useHistory } from "react-router-dom";
import { Firebase, Routes } from "./config";
import { MyNavbar } from "./components";
import { useDispatch, useSelector } from "react-redux";

const App = () => {
    const history = useHistory();
    const [userLoginStatus, setUserLoginStatus] = useState(false);
    const [userLoginData, setUserLoginData] = useState({});
    const [readyToRender, setReadyToRender] = useState();
    const stateGlobal = useSelector(state => state);
    const dispatch = useDispatch();

    useEffect( async () => {
        checkUser();
    }, []);


    const checkUser = () => {
        Firebase.auth().onAuthStateChanged( async (user) => {
            if(user){
                const responseDataUser = await Firebase.database().ref(`users/${user.uid}`).once('value').then(res => res.val());
                dispatch({type: 'UPDATE_DATA_USER', payload: responseDataUser});
                dispatch({type: 'UPDATE_LOGIN_STATUS', payload: true});
                console.log(stateGlobal);
            }
        })

        Firebase.auth().onAuthStateChanged(user => {
            console.log(user)
            if (user) {
                Firebase.database()
                    .ref(`users/${user.uid}/`)
                    .once("value")
                    .then(res => {
                        if (res.val()) {
                            const data = res.val();
                            localStorage.setItem("user", JSON.stringify(data));
                            localStorage.setItem("userLoginStatus", JSON.stringify(true));
                            setUserLoginData(data);
                            setUserLoginStatus(true);
                            setReadyToRender(true);
                            history.push(`/halamanutama/${data.uid}`);
                        }
                    });
                
                // const dataUser = Firebase.database().ref(`users/${user.uid}`).once('value').then(res => res.val());
                // console.log({dataUser})
            } else {
                localStorage.setItem("userLoginStatus", JSON.stringify(false));
                setUserLoginStatus(false);
                setReadyToRender(true);
                history.push("/halamaneksplor/undifined");
            }
        });
    }


    const signOut = () => {
        Firebase.auth().signOut();
        localStorage.removeItem("user");
        setUserLoginStatus(false);
        history.push("/");
    }


    return (
        <div className="app-container">
            {readyToRender && (
            <>
                <MyNavbar userLoginStatus={userLoginStatus} userLoginData={userLoginData} signOut={signOut}/>

                <Routes />
            </>
            )}
        </div>
    );
};

export default App;