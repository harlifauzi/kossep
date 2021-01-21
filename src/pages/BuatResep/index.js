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
    const [photo, setPhoto] = useState("");
    const [resep, setResep] = useState({
        postId: uuidv4(),
        judul: '',
        cerita: '',
        waktu: '',
        bahan: [{ item: "" }],
        langkah: [{ item: "" }],
        biaya: '',
        urlPhoto: '',
        chef: JSON.parse(localStorage.getItem("user")),
        waktuPost: '',
        timestamp: ''
    });


    // firing when photo state change
    useEffect(() => {
        document.title = "Kossep | Buat resep";
        if (photo) {
            postImage();
        }
    }, [photo]);


    // function form bahan
    const handleBahanChangeInput = (index, event) => {
        const values = [...resep.bahan];
        values[index][event.target.name] = event.target.value;
        setResep({...resep, bahan: values});
    };
    const handleBahanAddInput = () => {
        const values = [...resep.bahan, {item: ''}];
        setResep({...resep, bahan: values});
    };
    const handleBahanRemoveInput = (index) => {
        const values = [...resep.bahan];
        values.splice(index, 1);
        setResep({...resep, bahan: values});
    };


    // function form langkah
    const handleLangkahChangeInput = (index, event) => {
        const values = [...resep.langkah];
        values[index][event.target.name] = event.target.value;
        setResep({...resep, langkah: values});
    };
    const handleLangkahAddInput = () => {
        const values = [...resep.langkah, {item: ''}]
        setResep({...resep, langkah: values});
    };
    const handleLangkahRemoveInput = (index) => {
        const values = [...resep.langkah];
        values.splice(index, 1);
        setResep({...resep, langkah: values})
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
                setResep({...resep, urlPhoto: data.url})
                setOpenBackdrop(false);
            })
            .catch(err => {
                console.log(err);
                setOpenBackdrop(false);
            });
    };


    //function when button buat resep clicked
    const onBuatResep = () => {
        if ( resep.judul === '' || resep.cerita === '' || resep.waktu === '' || resep.biaya === '' || resep.urlPhoto === '' ){
            setMessageType('error');
            setMessage('pastikan semua data sudah diisi');
            setOpenSnackbar(true);
        } else {
            const today = new Date();
            const date = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
            setResep({...resep, waktuPost: date});
            setResep({...resep, timestamp: firebase.database.ServerValue.TIMESTAMP});
            Firebase.database()
                .ref(`posts/${resep.postId}/`)
                .set(resep)
                .then(res => {
                    setMessage("Resep telah dibuat")
                    setMessageType("success")
                    setOpenSnackbar(true)
                })
                .catch(err => {
                    setMessage("Gagal buat resep")
                    setMessageType("error")
                    setOpenSnackbar(true)
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
                        value={resep.judul}
                        onChange={(e) => setResep({...resep, judul: e.target.value})}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Cerita</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="cerita dibalik resep ini"
                        value={resep.cerita}
                        onChange={(e) => setResep({...resep, cerita: e.target.value})}
                    />
                    </Form.Group>

                    <Form.Group>
                    <Form.Label>Lama memasak</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="lama masak"
                        value={resep.waktu}
                        onChange={(e) => setResep({...resep, waktu: e.target.value})}
                    />
                </Form.Group>

                <Form.Group className="buatresep-bahan-wrapper">
                    <Form.Label>Bahan-bahan</Form.Label>
                    {resep.bahan.map((bahan, index) => (
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
                    {resep.langkah.map((langkah, index) => (
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
                        value={resep.biaya}
                        onChange={(e) => setResep({...resep, biaya: e.target.value})} 
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
                        {resep.urlPhoto === '' ? (
                            <p onClick={() => uploadPhoto.current.click()}>unggah foto</p>
                        ) : (
                            <>
                                <img src={resep.urlPhoto} alt='' />
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
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={messageType}>
                    {message}
                </Alert>
            </Snackbar>

        </div>
    );
};

export default BuatResep;