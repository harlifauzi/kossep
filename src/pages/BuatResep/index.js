import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Firebase } from "../../config";
import firebase from 'firebase';
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


// snackbar
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


// backdrop
const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));


const BuatResep = () => {
    // backdrop
    const classes = useStyles();            
    const [openBackdrop, setOpenBackdrop] = useState(false);


    // snackbar
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [messageType, setMessageType] = useState("");
    const [message, setMessage] = useState("");
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
        if(messageType==="success"){
            history.push(`/halamanutama/${resep.chef.uid}`);
        }
    };

    const uploadPhoto = useRef();
    const history = useHistory();

    const [judul, setJudul] = useState('');
    const [cerita, setCerita] = useState('');
    const [waktu, setWaktu] = useState('');
    const [bahan, setBahan] = useState([{item: ''}]);
    const [langkah, setLangkah] = useState([{item: ''}]);
    const [biaya, setBiaya] = useState('');
    const [urlPhoto, setUrlPhoto] = useState('');

    const [photo, setPhoto] = useState("");
    const resep = {
        postId: '',
        judul,
        cerita,
        waktu,
        bahan,
        langkah,
        biaya,
        urlPhoto,
        chef: JSON.parse(localStorage.getItem("user")),
        waktuPost: '',
        timestamp: ''
    };


    // firing when photo state change
    useEffect(() => {
        document.title = "Kossep | Buat resep";
        if (photo) {
            postImage();
        }
    }, [photo]);


    // function form bahan
    const handleBahanChangeInput = (index, event) => {
        const values = [...bahan];
        values[index][event.target.name] = event.target.value;
        setBahan(values);
    };
    const handleBahanAddInput = () => {
        setBahan([...bahan, {item: ''}]);
    };
    const handleBahanRemoveInput = (index) => {
        const values = [...bahan];
        values.splice(index, 1);
        setBahan(values);
    };


    // function form langkah
    const handleLangkahChangeInput = (index, event) => {
        const values = [...langkah];
        values[index][event.target.name] = event.target.value;
        setLangkah(values);
    };
    const handleLangkahAddInput = () => {
        setLangkah([...langkah, {item: ''}]);
    };
    const handleLangkahRemoveInput = (index) => {
        const values = [...langkah];
        values.splice(index, 1);
        setLangkah(values);
    };


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
                setOpenBackdrop(false);
            })
            .catch(err => {
                console.log(err);
                setOpenBackdrop(false);
            });
    };


    //function when button buat resep clicked
    const onBuatResep = async () => {
        if ( resep.judul === '' || resep.cerita === '' || resep.waktu === '' || resep.biaya === '' || resep.urlPhoto === '' ){
            setMessageType('error');
            setMessage('pastikan semua data sudah diisi');
            setOpenSnackbar(true);
        } else {
            const today = new Date();
            const date = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
            
            resep.waktuPost = date;
            resep.timestamp = firebase.database.ServerValue.TIMESTAMP;
            resep.postId = uuidv4();

            Firebase.database()
                .ref(`posts/${resep.postId}/`)
                .set(resep)
                .then(res => {
                    setMessage("Resep telah dibuat");
                    setMessageType("success");
                    setOpenSnackbar(true);
                })
                .catch(err => {
                    setMessage("Gagal buat resep");
                    setMessageType("error");
                    setOpenSnackbar(true);
                });
        }
    };


    return (
        <div className="buatresep-container">
            <Form className="buatresep-form">
                <Form.Group>
                    <Form.Label>Judul</Form.Label>
                    <Form.Control
                        className="buatresep-form-judul"
                        type="text"
                        placeholder="judul"
                        value={judul}
                        onChange={(e) => setJudul(e.target.value)}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Cerita</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="cerita dibalik resep ini"
                        value={cerita}
                        onChange={(e) => setCerita(e.target.value)}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Lama memasak</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="lama masak"
                        value={waktu}
                        onChange={(e) => setWaktu(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="buatresep-bahan-wrapper">
                    <Form.Label>Bahan-bahan</Form.Label>
                    {bahan.map((bahan, index) => (
                        <InputGroup className="mb-3" key={index}>
                        <p>{index+1}.</p>
                        <FormControl
                            className="buatresep-bahan-formcontrol"
                            placeholder="nama bahan"
                            aria-describedby="basic-addon2"
                            name="item"
                            type="text"
                            value={bahan.item}
                            onChange={(event) => handleBahanChangeInput(index, event)}
                        />
                        <InputGroup.Append>
                            <Button
                            variant="outline-secondary"
                            onClick={() => handleBahanRemoveInput(index)}
                            >
                            hapus
                            </Button>
                        </InputGroup.Append>
                        </InputGroup>
                    ))}
                    <Button variant="warning" onClick={handleBahanAddInput}>
                        tambah
                    </Button>
                </Form.Group>

                <Form.Group className="buatresep-langkah-wrapper">
                    <Form.Label>Langkah-langkah</Form.Label>
                    {langkah.map((langkah, index) => (
                        <InputGroup className="mb-3" key={index}>
                        <p>{index+1}.</p>
                        <FormControl
                            className="buatresep-langkah-formcontrol"
                            placeholder="nama langkah"
                            aria-describedby="basic-addon2"
                            name="item"
                            type="text"
                            value={langkah.item}
                            onChange={(event) => handleLangkahChangeInput(index, event)}
                        />
                        <InputGroup.Append>
                            <Button
                            variant="outline-secondary"
                            onClick={() => handleLangkahRemoveInput(index)}
                            >
                            hapus
                            </Button>
                        </InputGroup.Append>
                        </InputGroup>
                    ))}
                    <Button variant="warning" onClick={handleLangkahAddInput}>
                        tambah
                    </Button>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Biaya</Form.Label>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                        <InputGroup.Text>Rp.</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl 
                        aria-label="Amount (to the nearest dollar)"
                        value={biaya}
                        onChange={(e) => setBiaya(e.target.value)} 
                        maxLength={2}
                        />
                        <InputGroup.Append>
                        <InputGroup.Text>K/porsi</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                </Form.Group>

                <InputGroup className="mb-3">
                    <FormControl
                        aria-describedby="basic-addon1"
                        ref={uploadPhoto}
                        style={{display: 'none'}}
                        type="file"
                        accept="image/*" 
                        onChange={(e) => setPhoto(e.target.files[0])}
                    />
                </InputGroup>

                <div className='buatresep-form-photo'>
                        {urlPhoto === '' ? (
                            <p onClick={() => uploadPhoto.current.click()}>unggah foto</p>
                        ) : (
                            <>
                                <img src={urlPhoto} alt='' />
                                <p 
                                    className='ubah-foto'
                                    onClick={() => uploadPhoto.current.click()}
                                >
                                    ubah foto
                                </p>
                            </>
                        )}
                </div>

                <Button
                    variant="warning"
                    className="ml-auto mr-auto"
                    onClick={onBuatResep}
                    style={{width: '100%'}}
                >
                    Buat resep
                </Button>
            </Form>

            {/* backdrop */}
            <Backdrop className={classes.backdrop} open={openBackdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* snackbar */}
            <Snackbar open={openSnackbar} autoHideDuration={1500} onClose={handleClose}>
                <Alert onClose={handleClose} severity={messageType}>
                    {message}
                </Alert>
            </Snackbar>

        </div>
    );
};

export default BuatResep;