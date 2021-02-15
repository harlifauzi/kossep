import React, { useEffect, useState } from "react";
import "./App.css";
import { useHistory } from "react-router-dom";
import { Firebase, Routes } from "./config";
import { MyNavbar } from "./components";

const App = () => {
    const history = useHistory();
    const [userLoginStatus, setUserLoginStatus] = useState(false);
    const [userLoginData, setUserLoginData] = useState({});
    const [readyToRender, setReadyToRender] = useState();

    useEffect(() => {
        // check login user
        Firebase.auth().onAuthStateChanged(user => {
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
            } else {
                localStorage.setItem("userLoginStatus", JSON.stringify(false));
                setUserLoginStatus(false);
                setReadyToRender(true);
                history.push("/halamaneksplor/undifined");
            }
        });
    }, []);


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