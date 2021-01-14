import React, { useEffect, useState } from "react";
import "./App.css";
import { BuatAkun, Masuk, HalamanUtama, BuatResep, LihatResep, HalamanAkun, HalamanAkunLain, HalamanEksplor, PengaturanAkun, Recook } from "./pages";
import { Route, Switch, useHistory } from "react-router-dom";
import { Firebase } from "./config";
import { Nav, Navbar, Dropdown, DropdownButton } from "react-bootstrap";
import { ILLogo } from './assets/illustrations'
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const history = useHistory();
  const [userStatus, setUserStatus] = useState(false);
  const [userData, setUserData] = useState({});
  const [userDefault, setUserDefault] = useState();

  useEffect(() => {
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        Firebase.database()
          .ref("users/" + user.uid + "/")
          .once("value")
          .then((res) => {
            if (res.val()) {
              const data = res.val();
              localStorage.setItem("user", JSON.stringify(data));
              setUserData(data);
              setUserStatus(true);
              setUserDefault(true);
              history.push(`/halamanutama/${data.uid}`);
            }
          });
      } else {
        setUserStatus(false);
        setUserDefault(true);
        history.push('/masuk')
      }
    });
  }, []);

  return (
    <div className="app-container">
      {/* Navbar */}
      {userDefault && (
        <>
          <Navbar
            className="app-navbar"
            collapseOnSelect
            expand="lg"
            variant="dark"
          >
            <div className='app-navbar-logoContainer' onClick={() => history.push(`/halamanutama/${userData.uid}`)}>
                <img src={ILLogo}/>
            </div>

            {userStatus && (
              <DropdownButton
                className="ml-auto"
                variant="light"
                menuAlign="right"
                title={userData.namaLengkap ? userData.namaLengkap : "loading"}
                id="dropdown-menu-align-right"
              >
                <Dropdown.Item href="#" onClick={() => history.push(`/halamanakun/${userData.uid}`)}>Akun saya</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  href="#"
                  onClick={() => {
                    Firebase.auth().signOut();
                    localStorage.removeItem("user");
                    setUserStatus(false);
                    history.push("/");
                  }}
                >
                  Keluar
                </Dropdown.Item>
              </DropdownButton>
            )}

            {!userStatus && (
              <>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="ml-auto">
                    <Nav.Link
                      href="#"
                      onClick={() => history.push("/buatakun")}
                    >
                      Buat akun
                    </Nav.Link>
                    <Nav.Link href="#" onClick={() => history.push("/masuk")}>
                      Masuk
                    </Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </>
            )}
          </Navbar>
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
          </Switch>
        </>
      )}
    </div>
  );
};

export default App;
