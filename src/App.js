import React, { useEffect, useState } from "react";
import "./App.css";
import {
    BuatAkun,
    Masuk,
    HalamanUtama,
    BuatResep,
    LihatResep,
    HalamanAkun,
    HalamanAkunLain,
    HalamanEksplor,
    PengaturanAkun,
    Recook,
    AboutUs,
} from "./pages";
import { Route, Switch, useHistory } from "react-router-dom";
import { Firebase } from "./config";
import { Nav, Navbar, Dropdown, DropdownButton } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ILLogo, ILNull } from "./assets/illustrations";

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

    return (
        <div className="app-container">
            {/* Navbar */}
            {readyToRender && (
            <>
                <div className="app-navbar-wrapper">
                    <Navbar
                        className="app-navbar"
                        collapseOnSelect
                        expand="lg"
                        variant="dark"
                    >
                        <div
                            className="app-navbar-logoContainer"
                            onClick={() => history.push(`/halamanutama/${userLoginData.uid}`)}
                        >
                            <img src={ILLogo} />
                        </div>

                        {/* when user login true */}
                        {userLoginStatus && (
                        <DropdownButton
                            className="ml-auto"
                            variant="light"
                            menuAlign="right"
                            title={userLoginData.photo ? <img src={userLoginData.photo} alt="" />  : <img src={ILNull} alt="" />}
                            id="dropdown-menu-align-right"
                        >
                            <Dropdown.Item
                                href="#"
                                onClick={() => history.push(`/halamanakun/${userLoginData.uid}`)}
                            >
                                Akun saya
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                                href="#"
                                onClick={() => {
                                    Firebase.auth().signOut();
                                    localStorage.removeItem("user");
                                    setUserLoginStatus(false);
                                    history.push("/");
                                }}
                            >
                                Keluar
                            </Dropdown.Item>
                            <Dropdown.Item
                                href="#"
                                onClick={() => history.push("/aboutus")}
                            >
                                About us
                            </Dropdown.Item>
                        </DropdownButton>
                        )}

                        {/* when user login false */}
                        {!userLoginStatus && (
                        <>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                            <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="ml-auto">
                                <Nav.Link href="#" onClick={() => history.push("/buatakun")}>
                                    Buat akun
                                </Nav.Link>
                                <Nav.Link href="#" onClick={() => history.push("/masuk")}>
                                    Masuk
                                </Nav.Link>
                                <Nav.Link href="#" onClick={() => history.push("/aboutus")}>
                                    About us
                                </Nav.Link>
                            </Nav>
                            </Navbar.Collapse>
                        </>
                        )}
                    </Navbar>
                </div>
            {/* /Navbar */}

                <Switch>
                    <Route exact path="/halamanutama/:key" component={HalamanUtama} />
                    <Route path="/buatakun" component={BuatAkun} />
                    <Route path="/masuk" component={Masuk} />
                    <Route path="/buatresep" component={BuatResep} />
                    <Route path="/lihatresep/:key" component={LihatResep} />
                    <Route path="/halamanakun/:key" component={HalamanAkun} />
                    <Route path="/halamanakunlain/:key" component={HalamanAkunLain} />
                    <Route path="/halamaneksplor/:key" component={HalamanEksplor} />
                    <Route path="/pengaturanakun/:key" component={PengaturanAkun} />
                    <Route path="/recook/:key" component={Recook} />
                    <Route path="/aboutus" component={AboutUs} />
                </Switch>
            </>
        )}
        </div>
    );
};

export default App;