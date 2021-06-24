import React from "react";
import { useHistory } from "react-router-dom";
import { ILLogo, ILNull } from "../../../assets";
import { Nav, Navbar, Dropdown, DropdownButton } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Firebase } from "../../../config";

const MyNavbar = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { loginStatus, dataUser } = useSelector(state => state);
    

    const signOut = () => {
        Firebase.auth().signOut();
        localStorage.removeItem("user");
        dispatch({type: 'UPDATE_LOGIN_STATUS', payload: false});
        dispatch({type: 'UPDATE_DATA_USER', payload: null});
        history.push("/");
    }


    return (
        <div className="mynavbar-wrapper">
            <Navbar className="mynavbar" collapseOnSelect expand="lg" variant="dark">
                <div className="mynavbar-logoContainer" onClick={() => history.push('/')}>
                    <img src={ILLogo} />
                </div>

                {loginStatus && (
                <DropdownButton
                    className="ml-auto"
                    variant="light"
                    menuAlign="right"
                    title={
                        dataUser.photo ? (
                            <img src={dataUser.photo} alt="" />
                        ) : (
                            <img src={ILNull} alt="" />
                        )
                    }
                    id="dropdown-menu-align-right"
                >
                    <Dropdown.Item href="#" onClick={() => history.push(`/halamanakun/${dataUser.uid}`)}>
                        Akun saya
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="#" onClick={signOut}>
                        Keluar
                    </Dropdown.Item>
                    <Dropdown.Item href="#" onClick={() => history.push("/aboutus")}>
                        About us
                    </Dropdown.Item>
                </DropdownButton>
                )}

                {!loginStatus && (
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
    );
};

export default MyNavbar;
