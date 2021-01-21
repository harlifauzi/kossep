import React, { useEffect, useState, useRef } from 'react';
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useHistory, useParams } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';                  //snackbar
import MuiAlert from '@material-ui/lab/Alert';                      //snackbar
import Backdrop from '@material-ui/core/Backdrop';                  //backdrop
import CircularProgress from '@material-ui/core/CircularProgress';  //backdrop
import { makeStyles } from '@material-ui/core/styles';              //backdrop
import { Firebase } from '../../config';


// style backdrop
const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));
// /style backdrop


// <snackbar function>
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
// </snackbar function>


const PengaturanAkun = () => {

    // <snackbar function>
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("")
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        // history.push("/masuk");
    };
    // </snackbar function>

    const classes = useStyles();                                //backdrop
    const params = useParams();
    const history = useHistory();
    const textInput = useRef();
    const [userData, setUserData] = useState({});
    const [photo, setPhoto] = useState("");
    const [urlPhoto, setUrlPhoto] = useState("");
    const [openBackdrop, setOpenBackdrop] = useState(false);    //backdrop


    useEffect(() => {
        setPhoto(null);

        // get user data
        Firebase.database()
            .ref(`users/${params.key}/`)
            .once("value")
            .then(res => {
                setUserData(res.val())
            })
    }, [setOpen])


    // execute when photo state change
    useEffect(() => {
        if (photo) {
            postImage();
        }

        document.title = `Kossep | Pengaturan akun`
    }, [photo]);


    // upload to cloudinary
    const postImage = async () => {
        setOpenBackdrop(true);
        const data = new FormData();
        data.append("file", photo);
        data.append("upload_preset", "kossep");
        data.append("cloud_name", "harleykwen");
        await fetch("https://api.cloudinary.com/v1_1/harleykwen/image/upload", {
        method: "post",
        body: data,
        })
        .then(res => res.json())
        .then(data => {
            console.log({ successUpload: data });
            setUrlPhoto(data.url);

            // save to firebase
            Firebase.database()
                .ref(`users/${params.key}/photo/`)
                .remove();
            Firebase.database()
                .ref(`users/${params.key}/photo/`)
                .set(data.url);
            userData.photo = data.url
            setOpenBackdrop(false);
            setMessage("Berhasil upload foto");
            setMessageType("success")
            setOpen(true);
        })
        .catch(err => {
            setOpenBackdrop(false);
            setMessage("Gagal upload foto");
            setMessageType("error")
            setOpen(true);
        });
    };


    // when button non aktif clicked
    const onNonAktif = () => {
        setOpen(true)
    }


    return (
        <div className="pengaturanakun-container">
            <div className="pengaturanakun-img-container">
                <div className="pengaturanakun-img">
                    {/* check is photo available */}
                    {userData.photo ? (
                        <img src={userData.photo} altd="" />
                    ) : (
                        <i className='bx bxs-user'></i>
                    )}
                </div>
                <input 
                    type="file" 
                    accept="image/*" 
                    style={{display: "none"}} 
                    ref={textInput}
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file && file.type.substr(0, 5) === "image") {
                            setPhoto(file);
                        } else {
                            alert("gagal unggah foto")
                        }
                    }}
                />
                {/* check is photo available */}
                {userData.photo ? (<p onClick={() => textInput.current.click()}>Ganti foto</p>) : (<p onClick={() => textInput.current.click()}>Unggah Foto</p>)}
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
                <Alert onClose={handleClose} severity={messageType}>
                    {message}
                </Alert>
            </Snackbar>

            <Backdrop className={classes.backdrop} open={openBackdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>

        </div>
    )
}

export default PengaturanAkun
