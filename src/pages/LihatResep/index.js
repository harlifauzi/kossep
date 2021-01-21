import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Firebase } from "../../config";
import { v4 as uuidv4 } from "uuid";
import { Form, InputGroup, FormControl, Button, Modal } from "react-bootstrap";
import { ILNull } from "../../assets"
import "bootstrap/dist/css/bootstrap.min.css";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

// <snackbar function>
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
// </snackbar function>

const LihatResep = () => {
    const params = useParams();
    const history = useHistory();
    const myData = JSON.parse(localStorage.getItem("user"));
    const userLoginStatus = localStorage.getItem("userLoginStatus")
    const [modal, setModal] = useState(false);
    const [resepUid, setResepUid] = useState("");
    const [resep, setResep] = useState();
    const [comment, setComment] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [commentReady, setCommentReady] = useState(false);
    const [recookFrom, setRecookFrom] = useState("");
    const [recookParam, setRecookParam] = useState("");
    const [recookBy, setRecookBy] = useState([]);


    // <snackbar function>
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("")
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
        return;
        }

        setOpen(false);
        if (message === "Resep telah dihapus"){
            // history.push(`/halamanutama/${myData.uid}`);
            history.goBack();
        }
    };
    // </snackbar function>


    useEffect(() => {
        setResep("");
        setComment("");
        setCommentReady(false)
        setNewComment("");
        setRecookFrom("");
        setRecookParam("");
        setRecookBy("");

        // get recipe data
        Firebase.database()
        .ref(`posts/${params.key}/`)
        .once("value")
        .then((res) => {
            if (res.val()) {
            const data = res.val();
            console.log(data);
            setResep(data);
            setResepUid(data.chef.uid);

            // get info recook from
            Firebase.database()
                .ref(`posts/${data.recookFrom}/`)
                .once("value")
                .then((res) => {
                if (res.val()) {
                    setRecookFrom(res.val());
                }
                });
            }
        });

        // get info recook by
        Firebase.database()
        .ref(`posts/${params.key}/recookBy`)
        .once("value")
        .then((res) => {
            if (res.val()) {
            const recookFrom = res.val();
            const data = [];
            Object.keys(recookFrom).map((item) => {
                const newData = {
                id: item,
                data: recookFrom[item],
                };
                data.push(newData);
            });
            setRecookBy(data);
            }
        });

        // get comments
        Firebase.database()
        .ref(`posts/${params.key}/komentar`)
        .once("value")
        .then((res) => {
            if (res.val()) {
                const data = [];
                const oldData = res.val();
                Object.keys(oldData).map((item) => {

                    Firebase.database()
                        .ref(`users/${oldData[item].byUser.uid}/`)
                        .once("value")
                        .then(res => {
                            const newData = {
                                id: item,
                                data: oldData[item],
                                photo: res.val().photo
                            }
                            setCommentReady(false)

                            data.unshift(newData)
                            setComment(data)
                            console.log(data)

                            setCommentReady(true)
                        })
                });
            }
        });

        document.title = `Kossep | Resep`
    }, [recookParam]);


    // view source recipe
    const OnRecookFrom = () => {
        history.push(`/lihatresep/${recookFrom.postId}`);
        setRecookParam(recookFrom.postId);
    };


    // function when button kirim clicked
    const onKirim = () => {
        if ( userLoginStatus === "true"){
            const today = new Date();
            const waktuKomen = today.getTime();
            const byUser = JSON.parse(localStorage.getItem("user"));
            const id = uuidv4();

            const data = {
                waktuKomen,
                komen: newComment,
                byUser,
            };

            const dataTemporary = {
                id: uuidv4(),
                data: {
                    waktuKomen,
                    komen: newComment,
                    byUser,
                },
                photo: byUser.photo
            };

            // set comment on recipe's database
            console.log(data);
            Firebase.database().ref(`posts/${params.key}/komentar/${id}`).set(data);

            setCommentReady(false)
            setComment([...comment, dataTemporary])
            setNewComment("");
            setCommentReady(true)
        } else {
            setMessageType("error");
            setMessage("Kamu harus masuk terlebih dahulu");
            setOpen(true);
        }
    };


    // function when button hapus clicked
    const onHapus = () => {
        Firebase.database().ref(`posts/${params.key}/`).remove();
        setMessage("Resep telah dihapus");
        setMessageType("error");
        setOpen(true);
    };


    // function view profile
    const onLihatProfile = (uid) => {
        if (userLoginStatus === "true"){
            if (myData.uid !== uid) {
                history.push(`/halamanakunlain/${uid}`);
            } else {
                history.push(`/halamanakun/${uid}`);
            }
        } else {
            history.push(`/halamanakunlain/${uid}`)
        }
    };


    return (
        <div className="lihatresep-container">

            <div className="lihatresep-formContainer">
                {/* when resep available */}
                {resep && (
                <Form className="lihatresep-form">
                    {recookFrom && (
                    <Button
                        className="lihatresep-recook-buttonInfo"
                        variant="warning"
                        onClick={OnRecookFrom}
                    >
                        Recook "{recookFrom.judul}" by {recookFrom.chef.namaLengkap}
                    </Button>
                    )}
                    <Form.Group>
                    <h1 className="lihatresep-form-title">{resep.judul}</h1>
                    <InputGroup className="mb-3">
                        <img
                            className="card-img-top"
                            src={resep.urlPhoto}
                            alt=""
                        />
                    </InputGroup>
                    <p
                        className="lihatresep-tanggalDibuat"
                        onClick={() => onLihatProfile(resep.chef.uid)}
                    >
                        Dibuat pada {resep.waktuPost} oleh{" "}
                        <span className="lihatresep-chef">
                        {resep.chef.namaLengkap}
                        </span>
                    </p>
                    </Form.Group>

                    <Form.Group>
                    <Form.Label className="subtitle">Cerita</Form.Label>
                    <div className="subtitle-underline">
                        <p>{resep.cerita}</p>
                    </div>
                    </Form.Group>

                    <Form.Group>
                    <Form.Label className="subtitle">Lama memasak</Form.Label>
                    <div className="subtitle-underline">
                        <p>{resep.waktu}</p>
                    </div>
                    </Form.Group>

                    <Form.Group>
                    <Form.Label className="subtitle">Bahan-bahan</Form.Label>
                    {resep.bahan.map((bahan, index) => (
                        <div className="subtitle-underline" key={index}>
                            <p className="subtitle-underline-number">
                                {index + 1}.
                            </p>
                            <p className="subtitle-underline-value">
                                {bahan.namaBahan}
                            </p>
                            <input type="checkbox" />
                        </div>
                    ))}
                    </Form.Group>

                    <Form.Group>
                    <Form.Label className="subtitle">Langkah-langkah</Form.Label>
                    {resep.langkah.map((langkah, index) => (
                        <div className="subtitle-underline" key={index}>
                            <p className="subtitle-underline-number">
                                {index + 1}.
                            </p>
                            <p className="subtitle-underline-value">
                                {langkah.namaLangkah}
                            </p>
                            <input type="checkbox" />
                        </div>
                    ))}
                    </Form.Group>

                    {/* if login status = true (get from local storage) */}
                    <div className="lihatresep-recook-group">
                    { userLoginStatus === "true" && (
                        <>
                        {myData.uid !== resepUid && (
                            <Button
                            className="lihatresep-buttonRecook"
                            variant="warning"
                            onClick={() => history.push(`/recook/${resep.postId}`)}
                            >
                            Recook resep ini
                            </Button>
                        )}
                        </>
                    )}
                    {recookBy && (
                        <p className="lihatresep-recookBy">
                            resep ini telah di <span className="recookText">recook</span>{" "}
                            oleh{" "}
                            <span className="recookOrang">{recookBy.length} orang</span>
                        </p>
                    )}
                    </div>

                    {/* if login status = true (get from local storage) */}
                    { userLoginStatus === "true" && (
                        <>
                            {myData.uid === resepUid && (
                            <Button
                                className="lihatresep-buttonRecook ml-auto mr-0 lihatresep-recook-group"
                                variant="danger"
                                onClick={() => setModal(true)}
                            >
                                Hapus resep ini
                            </Button>
                            )}
                        </>
                    )}
                </Form>
                )}
            </div>

            <div className="lihatresep-commentContainer">
                <div className="lihatresep-comment">
                    <div className="lihatresep-comment-judul">
                        <i class='bx bx-comment-detail'></i>
                        <p className="subtitle judul">Komentar</p>
                    </div>
                    {/* when comments available */}
                    {commentReady && (
                        <div className="lihatresep-comment-list">
                        {comment.map((comment) => (
                            <div className="lihatresep-comment-item" key={comment.id}>
                                <div>
                                    {comment.photo && (<img src={comment.photo} alt="" />)}
                                    {!comment.photo && (<img src={ILNull} alt="" />)}
                                    <p 
                                        className="subtitle"
                                        onClick={() => onLihatProfile(comment.data.byUser.uid)}
                                    >{comment.data.byUser.namaLengkap}</p>
                                </div>
                                <p>{comment.data.komen}</p>
                            </div>
                        ))}
                        </div>
                    )}
                    <InputGroup className="mb-3 lihatresep-comment-inputGroup">
                        <FormControl
                        placeholder="Tulis komentar disini"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        />
                        <InputGroup.Append>
                        <Button variant="outline-secondary" onClick={onKirim}>
                            Kirim
                        </Button>
                        </InputGroup.Append>
                    </InputGroup>
                </div>

                {/* modal */}
                {modal && (
                <div className="lihatresep-modal">
                    <Modal.Dialog className="m-auto">
                    <Modal.Body>
                        <p>Hapus resep ini?</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="primary" onClick={() => setModal(false)}>
                        Kembali
                        </Button>
                        <Button variant="danger" onClick={onHapus}>
                        Hapus
                        </Button>
                    </Modal.Footer>
                    </Modal.Dialog>
                </div>
                )}
                {/* /modal */}

                {/* snackbar */}
                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={messageType}>
                    {message}
                </Alert>
                </Snackbar>
                {/* /snackbar */}
            </div>

        </div>
    );
};

export default LihatResep;
