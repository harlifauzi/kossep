import React, { useEffect, useState } from "react";
import { Firebase } from "../../config";
import { useHistory } from "react-router-dom";
import { ILSignIn } from '../../assets/illustrations';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

// <snackbar function>
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
// </snackbar function>

const Masuk = () => {
    const history = useHistory();
    const [alamatEmail, setAlamatEmail] = useState("");
    const [kataSandi, setKataSandi] = useState("");
    const [userData, setUserData] = useState("")

    // <snackbar function>
    const [open, setOpen] = React.useState(false);
    const [messageType, setMessageType] = useState("");
    const [message, setMessage] = useState("");
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        if(messageType==="success"){
            // history.push(`/halamanutama/${userData.uid}`);
        }
    };
    // </snackbar function>


    useEffect(() => {
        document.title = "Kossep | Masuk"
    })


    const onMasuk = () => {
        if( !alamatEmail ){
            setMessageType("error");
            setMessage("Oops, isi email dulu yuk!");
            return setOpen(true);
        } else if ( !kataSandi ){
            setMessageType("error");
            setMessage("Oops, isi kata sandi dulu yuk!");
            return setOpen(true);
        }

        Firebase.auth()
        .signInWithEmailAndPassword(alamatEmail, kataSandi)
            .then(res => {
                setUserData(res.user)
                setMessageType("success");
                setMessage("Yeay, kamu berhasil masuk!");
                setOpen(true);
            })
            .catch(err => {
                if (err.code === "auth/user-not-found") {
                    setMessage("Oops, email yang kamu masukan tidak terdaftar!");
                    setMessageType("error");
                    setOpen(true);
                } else if (err.code === "auth/invalid-email") {
                    setMessage("Oops, email yang kamu masukan tidak valid!");
                    setMessageType("error");
                    setOpen(true);
                } else if (err.code === "auth/wrong-password") {
                    setMessage("Oops, kata sandi yang kamu masukkan salah!");
                    setMessageType("error");
                    setOpen(true);
                }
            });
    };

    return (
        <div className="masuk-container">
            <div className="masuk-cards">
                <div className="masuk-cards-left">
                    <h3>
                        Makan apa ya hari ini? <br></br> Kuy liat resep terbaru!
                    </h3>
                <div style={{ width: "100%" }}>
                    <div className="masuk-cards-left-form">
                        <input
                            type="email"
                            placeholder="alamat email"
                            value={alamatEmail}
                            onChange={(e) => setAlamatEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="kata sandi"
                            value={kataSandi}
                            onChange={(e) => setKataSandi(e.target.value)}
                        />
                        <button onClick={onMasuk}> Masuk </button>
                    </div>
                </div>
                <p className="masuk-cards-left-link">Belum punya akun? <span onClick={() => history.push("/buatakun")}>Klik disini</span></p>
            </div>
            <div className="masuk-cards-right">
                <img src={ILSignIn} />
            </div>
        </div>

        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={messageType}>
                {message}
            </Alert>
        </Snackbar>
      </div>
    );
};

export default Masuk;
