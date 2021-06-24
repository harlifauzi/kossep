import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
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
import { useSelector } from "react-redux";


// backdrop
const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));


// snackbar
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const Recook = () => {
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

    const params = useParams();
    const history = useHistory();
    const { dataUser, loginStatus } = useSelector(state => state);
    const uploadPhoto = useRef();
    const [currentRecipe, setCurrentRecipe] = useState();
    const [judul, setJudul] = useState("");
    const [cerita, setCerita] = useState("");
    const [waktu, setWaktu] = useState("");
    const [bahan, setBahan] = useState([{ item: "" }]);
    const [langkah, setLangkah] = useState([{ item: "" }]);
    const [biaya, setBiaya] = useState("")
    const [urlPhoto, setUrlPhoto] = useState("");
    const [recookFrom, setRecookFrom] = useState("");
    const [photo, setPhoto] = useState("");
    const resep = {
        postId: uuidv4(),
        judul,
        cerita,
        waktu,
        bahan,
        langkah,
        biaya,
        urlPhoto,
        chef: dataUser,
        waktuPost: '',
        timestamp: '',
        recookFrom: currentRecipe,
    };


    useEffect(() => {
        if ( !loginStatus ) history.replace('/eksplor');

        // get recipe data for recok
        Firebase.database()
            .ref(`posts/${params.key}/`)
            .once("value")
            .then(res => {
                if(res.val()){
                    const oldData = res.val();
                    setCurrentRecipe(oldData);

                    setJudul(oldData.judul);
                    setCerita(oldData.cerita);
                    setWaktu(oldData.waktu);
                    setRecookFrom(oldData.postId);
                    setBiaya(oldData.biaya);
                    setUrlPhoto(oldData.urlPhoto);

                    const newDataBahan = [];
                    oldData.bahan.map(item => {
                        newDataBahan.push(item);
                    });
                    setBahan(newDataBahan);

                    const newDataLangkah = [];
                    oldData.langkah.map(item => {
                        newDataLangkah.push(item);
                    });
                    setLangkah(newDataLangkah);
                }
            })
            .catch(err => {
                alert("resep tidak ditemukan");
            });

        document.title = `Kossep | Recook`
    }, []);


    // execute when photo state change
    useEffect(() => {
        if(photo){
            postImage();
        }
    }, [photo])


    // function form bahan
    const handleBahanChangeInput = (index, event) => {
        const values = [...bahan];
        values[index][event.target.name] = event.target.value;
        setBahan(values);
    };
    const handleBahanAddInput = () => {
        setBahan([...bahan, {item: ''}])
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
        setLangkah([...langkah, {item: ''}])
    };
    const handleLangkahRemoveInput = (index) => {
        const values = [...langkah];
        values.splice(index, 1);
        setLangkah(values);
    };


    // upload to cloudinary
    const postImage = async () => {
        setOpenBackdrop(true)
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

    // buat resep
    const onRecook = () => {
        const today = new Date();
        const date = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
        resep.waktuPost = date;
        resep.timestamp = firebase.database.ServerValue.TIMESTAMP;

        Firebase.database()
            .ref(`posts/${resep.postId}/`)
            .set(resep);

        Firebase.database()
            .ref(`posts/${currentRecipe.postId}/recookBy/`)
            .push(resep.postId);

        setMessage("Recook berhasil");
        setMessageType("success");
        setOpenSnackbar(true);
    };


    return (
        <div className="recook-container">
            <Form className="recook-form">
                {/* when recipe available */}
                {currentRecipe&&(
                    <Button 
                        className="recook-buttonInfo" 
                        variant="warning"
                        onClick={() => history.push(`/lihatresep/${params.key}`)}
                        >
                        Recook "{currentRecipe.judul}" by {currentRecipe.chef.namaLengkap}
                    </Button>
                )}
                <Form.Group>
                    <Form.Label>Judul</Form.Label>
                    <Form.Control
                        className="recook-form-judul"
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
        
                <Form.Group className="recook-bahan-wrapper">
                    <Form.Label>Bahan-bahan</Form.Label>
                    {bahan.map((bahan, index) => (
                    <InputGroup className="mb-3" key={index}>
                        <p>{index+1}.</p>
                        <FormControl
                            className="recook-bahan-formcontrol"
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
        
                <Form.Group className="recook-langkah-wrapper">
                    <Form.Label>Langkah-langkah</Form.Label>
                    {langkah.map((langkah, index) => (
                    <InputGroup className="mb-3" key={index}>
                        <p>{index+1}.</p>
                        <FormControl
                            className="recook-langkah-formcontrol"
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
                        style={{display: 'none'}}
                        ref={uploadPhoto}
                        aria-describedby="basic-addon1"
                        type="file"
                        accept='image/*'
                        onChange={(e) => setPhoto(e.target.files[0])}
                    />
                </InputGroup>

                <div className='recook-form-photo'>
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
                    style={{width: '100%'}}
                    variant="warning"
                    className="ml-auto mr-auto"
                    onClick={onRecook}
                >
                    Recook
                </Button>

                {/* backdrop */}
                <Backdrop className={classes.backdrop} open={openBackdrop}>
                    <CircularProgress color="inherit" />
                </Backdrop>

                {/* snackbat */}
                <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={messageType}>
                        {message}
                    </Alert>
                </Snackbar>
            </Form>
        </div>
    )
}

export default Recook