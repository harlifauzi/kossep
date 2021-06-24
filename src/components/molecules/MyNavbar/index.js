import React from "react";
import { useHistory } from "react-router-dom";
import { ILLogo, ILNull } from "../../../assets";
import { Nav, Navbar, Dropdown, DropdownButton } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const MyNavbar = ({ userLoginData, userLoginStatus, signOut }) => {
    const history = useHistory();


    return (
        <div className="mynavbar-wrapper">
            <Navbar className="mynavbar" collapseOnSelect expand="lg" variant="dark">
                <div className="mynavbar-logoContainer" onClick={() => history.push('/')}>
                    <img src={ILLogo} />
                </div>

                {/* when user login true */}
                {userLoginStatus && (
                <DropdownButton
                    className="ml-auto"
                    variant="light"
                    menuAlign="right"
                    title={
                        userLoginData.photo ? (
                            <img src={userLoginData.photo} alt="" />
                        ) : (
                            <img src={ILNull} alt="" />
                        )
                    }
                    id="dropdown-menu-align-right"
                >
                    <Dropdown.Item href="#" onClick={() => history.push(`/halamanakun/${userLoginData.uid}`)}>
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
    );
};

export default MyNavbar;
