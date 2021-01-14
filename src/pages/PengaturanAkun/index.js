import React, { useEffect, useState } from 'react';
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useHistory, useParams } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Firebase } from '../../config';

// <snackbar function>
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
// </snackbar function>

const PengaturanAkun = () => {

    // <snackbar function>
    const [open, setOpen] = React.useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        // history.push("/masuk");
    };
    // </snackbar function>

    const params = useParams();
    const history = useHistory();
    const [userData, setUserData] = useState({});

    useEffect(() => {
        setUserData(JSON.parse(localStorage.getItem("user")));
        console.log(userData);
        console.log(params);
    }, [])

    const onNonAktif = () => {
        setOpen(true)
    }

    return (
        <div className="pengaturanakun-container">
            <div className="pengaturanakun-img-container">
                <div className="pengaturanakun-img">
                    <i className='bx bxs-user'></i>
                </div>
                <p className="pengaturanakun-link" type="file" onClick={onNonAktif}>Ubah</p>
            </div>
            <div className="pengaturanakun-bio-container">
                <p>Bio</p>
                <p className="pengaturanakun-link" onClick={onNonAktif}>Ubah</p>
            </div>
            <div className="pengaturanakun-nama-container">
                <p>{userData ? userData.namaLengkap : "Nama"}</p>
                <p className="pengaturanakun-link" onClick={onNonAktif}>Ubah</p>
            </div>
            <div className="pengaturanakun-email-container">
                <p>{userData ? userData.alamatEmail : "Email"}</p>
                <p className="pengaturanakun-link" onClick={onNonAktif}>Ubah</p>
            </div>
            <div className="pengaturanakun-katasandi-container">
                <p>Kata sandi</p>
                <p className="pengaturanakun-link" onClick={onNonAktif}>Ubah</p>
            </div>
            <Button className="pengaturanakun-button" variant="danger" onClick={onNonAktif}>Nonaktifkan akun</Button>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    fitur ini belum tersedia
                </Alert>
            </Snackbar>
        </div>
    )
}

export default PengaturanAkun
