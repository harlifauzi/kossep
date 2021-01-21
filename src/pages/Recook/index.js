import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Firebase } from "../../config";
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


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


const Recook = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const params = useParams();
    const history = useHistory();
    const [currentRecipe, setCurrentRecipe] = useState();
    const [judul, setJudul] = useState("");
    const [cerita, setCerita] = useState("");
    const [waktu, setWaktu] = useState("");
    const [bahanResep, setBahanResep] = useState([{ namaBahan: "" }]);
    const [langkahResep, setLangkahResep] = useState([{ namaLangkah: "" }]);
    const [biaya, setBiaya] = useState("")
    const [urlPhoto, setUrlPhoto] = useState("");
    const [photo, setPhoto] = useState("");
    const [recookFrom, setRecookFrom] = useState("");
    const dataPost = {
        postId: "",
        judul,
        cerita,
        waktu,
        bahanResep,
        langkahResep,
        biaya,
        urlPhoto,
        chef: JSON.parse(localStorage.getItem("user")),
        waktuPost: "",
        timeId: "",
        recookFrom,
    };


    // <snackbar function>
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [messageType, setMessageType] = useState("");
    const [message, setMessage] = useState("");
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        if(messageType==="success"){
            history.push(`/halamanutama/${dataPost.chef.uid}`);
        }
    };
    // </snackbar function>


    // function form bahan
    const handleBahanChangeInput = (index, event) => {
        const values = [...bahanResep];
        values[index][event.target.name] = event.target.value;
        setBahanResep(values);
    };
    const handleBahanAddInput = () => {
        setBahanResep([...bahanResep, { namaBahan: "" }]);
    };
    const handleBahanRemoveInput = (index) => {
        const values = [...bahanResep];
        values.splice(index, 1);
        setBahanResep(values);
    };


    // function form langkah
    const handleLangkahChangeInput = (index, event) => {
        const values = [...langkahResep];
        values[index][event.target.name] = event.target.value;
        setLangkahResep(values);
    };
    const handleLangkahAddInput = () => {
        setLangkahResep([...langkahResep, { namaLangkah: "" }]);
    };
    const handleLangkahRemoveInput = (index) => {
        const values = [...langkahResep];
        values.splice(index, 1);
        setLangkahResep(values);
    };


    // upload to cloudinary
    const postImage = async () => {
        setOpen(true)
        const data = new FormData();
        data.append("file", photo);
        data.append("upload_preset", "kossep");
        data.append("cloud_name", "harleykwen");
        await fetch("https://api.cloudinary.com/v1_1/harleykwen/image/upload", {
        method: "post",
        body: data,
        })
        .then((res) => res.json())
        .then((data) => {
            console.log({ successUpload: data });
            setUrlPhoto(data.url);
            setOpen(false)
        })
        .catch((err) => {
            console.log(err)
            setOpen(false)
        });
    };

    // buat resep
    const onRecook = () => {
        const today = new Date();
        const date = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
        dataPost.postId = uuidv4();
        dataPost.waktuPost = date;
        dataPost.timeId = today.getTime();
        console.log({ dataPost });

        Firebase.database()
        .ref(`posts/${dataPost.postId}/`)
        .set(dataPost);

        Firebase.database()
        .ref(`posts/${currentRecipe.postId}/recookBy/${dataPost.postId}/`)
        .set(dataPost);

        setMessage("Recook berhasil")
        setMessageType("success")
        setOpenSnackbar(true)

        // history.push(`/halamanutama/${dataPost.chef.uid}`);
    };


    useEffect(() => {
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

                    const newDataBahan = [];
                    oldData.bahan.map(item => {
                        newDataBahan.push(item);
                    })
                    setBahanResep(newDataBahan);

                    const newDataLangkah = [];
                    oldData.langkah.map(item => {
                        newDataLangkah.push(item);
                    })
                    setLangkahResep(newDataLangkah);
                }
            })
            .catch(err => {
                alert("resep tidak ditemukan");
            })

        document.title = `Kossep | Recook`
    }, []);


    // execute when photo state change
    useEffect(() => {
        if(photo){
            postImage();
        }
    }, [photo])


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
                    {bahanResep.map((bahan, index) => (
                    <InputGroup className="mb-3" key={index}>
                        <p>{index+1}.</p>
                        <FormControl
                            className="recook-bahan-formcontrol"
                            placeholder="nama bahan"
                            aria-describedby="basic-addon2"
                            name="namaBahan"
                            type="text"
                            value={bahan.namaBahan}
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
                    {langkahResep.map((langkah, index) => (
                    <InputGroup className="mb-3" key={index}>
                        <p>{index+1}.</p>
                        <FormControl
                            className="recook-langkah-formcontrol"
                            placeholder="nama langkah"
                            aria-describedby="basic-addon2"
                            name="namaLangkah"
                            type="text"
                            value={langkah.namaLangkah}
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
                    type="file"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    />
                </InputGroup>
        
                <Button
                    variant="warning"
                    className="ml-auto mr-auto"
                    onClick={onRecook}
                >
                    Recook
                </Button>

                {/* backdrop */}
                <Backdrop className={classes.backdrop} open={open}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                {/* /backdrop */}

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