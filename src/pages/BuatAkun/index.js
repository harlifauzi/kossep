import React, { useState } from "react";
import { Firebase } from "../../config";
import { useHistory } from "react-router-dom";
import { ILSignUp } from "../../assets/illustrations";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

// <snackbar function>
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
// </snackbar function>

const BuatAkun = () => {
    const [namaLengkap, setNamaLengap] = useState("");
    const [alamatEmail, setAlamatEmail] = useState("");
    const [kataSandi, setKataSandi] = useState("");
    const history = useHistory();

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
            history.push("/");
        }
    };
    // </snackbar function>

    const onBuatAkun = () => {
        if( !namaLengkap ){
            setMessageType("error");
            setMessage("Oops, isi dulu nama yuk!");
            return setOpen(true);
        } else if ( !alamatEmail ){
            setMessageType("error");
            setMessage("Oops, isi dulu kata email yuk!");
            return setOpen(true);
        } else if ( !kataSandi ){
            setMessageType("error");
            setMessage("Oops, isi dulu kata sandi yuk!");
            return setOpen(true);
        }

        Firebase.auth()
        .createUserWithEmailAndPassword(alamatEmail, kataSandi)
            .then((res) => {
                console.log("success: ", res);
                const data = {
                    namaLengkap,
                    alamatEmail,
                    uid: res.user.uid,
                    posts: [],
                    followers: [],
                    following: []
                };
                console.log(data);
                Firebase.database()
                    .ref("users/" + res.user.uid + "/")
                    .set(data);
                    setMessageType("success");
                    setMessage("Yeay, akun kamu berhasil dibuat!");
                    setOpen(true);
                    history.push("/");
            })
            .catch((err) => {
                if( err.code === "auth/invalid-email" ){
                    setMessageType("error");
                    setMessage("Oops, email yang kamu masukkan tidak valid!")
                    setOpen(true);
                } else if( err.code === "auth/email-already-in-use" ){
                    setMessageType("error");
                    setMessage("Oops, email yang kamu masukkan sudah terdaftar!")
                    setOpen(true);
                } else if( err.code === "auth/weak-password" ){
                    setMessageType("error");
                    setMessage("Oops, minimal kata sandi 6 karakter ya!")
                    setOpen(true);
                }

                console.log("error: ", err);
                // alert(err.message);
            });
    };

    return (
        <div className="buatakun-container">
            <div className="buatakun-cards">
                <div className="buatakun-cards-left">
                    <h3>
                        Makan dikosan tetep assek bareng kossep!
                    </h3>
                    <div style={{ width: "100%" }}>
                        <div className="buatakun-cards-left-form">
                            <input
                                type="email"
                                placeholder="nama lengkap"
                                value={namaLengkap}
                                onChange={(e) => setNamaLengap(e.target.value)}
                            />
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
                            <button onClick={onBuatAkun}> Buat akun </button>
                        </div>
                    </div>
                    <p className="buatakun-cards-left-link">Sudah punya akun? <span onClick={() => history.push("/masuk")}>Klik disini</span></p>
                </div>
                <div className="buatakun-cards-right">
                    <img src={ILSignUp} />
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

export default BuatAkun;
