import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Firebase } from "../../config";
import { v4 as uuidv4 } from "uuid";
import { Form, InputGroup, FormControl, Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

// <snackbar function>
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
// </snackbar function>

const LihatResep = () => {
  const params = useParams();
  const history = useHistory();
  const myData = JSON.parse(localStorage.getItem("user"));
  const [modal, setModal] = useState(false);
  const [resepUid, setResepUid] = useState("");
  const [resep, setResep] = useState();
  const [comment, setComment] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [recookFrom, setRecookFrom] = useState("");
  const [recookParam, setRecookParam] = useState("");
  const [recookBy, setRecookBy] = useState([]);

  // <snackbar function>
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
          return;
      }

      setOpen(false);
      history.push(`/halamanutama/${myData.uid}`)
  };
  // </snackbar function>

  useEffect(() => {
    setResep("");
    setComment("");
    setNewComment("");
    setRecookFrom("");
    setRecookParam("");
    setRecookBy("");

    Firebase.database()
      .ref(`posts/${params.key}/`)
      .once("value")
      .then((res) => {
        if (res.val()) {
          const data = res.val();
          console.log(data);
          setResep(data);
          setResepUid(data.chef.uid)

          Firebase.database()
            .ref(`posts/${data.recookFrom}/`)
            .once("value")
            .then(res => {
              if (res.val()){
                setRecookFrom(res.val());
              }
            })
        }
      });

    Firebase.database()
    .ref(`posts/${params.key}/recookBy`)
    .once("value")
    .then(res => {
      if(res.val()){
        const recookFrom = res.val();
        const data = [];
        Object.keys(recookFrom).map(item => {
          const newData = {
            id: item,
            data: recookFrom[item]
          }
          data.push(newData);
        })
        setRecookBy(data);
      }
    })

    Firebase.database()
      .ref(`posts/${params.key}/komentar`)
      .once("value")
      .then(res => {
        if (res.val()){
          const data = [];
          const oldData = res.val();
          Object.keys(oldData).map(item => {
            const newData = {
              id: item,
              data: oldData[item]
            }
            data.push(newData);
          })
          console.log(data);
          setComment(data);
        }
      })
  },[recookParam]);

  const OnRecookFrom = () => {
    history.push(`/lihatresep/${recookFrom.postId}`);
    setRecookParam(recookFrom.postId)
  }

  const onKirim = () => {
    const today = new Date();
    const waktuKomen = today.getTime();
    const byUser = JSON.parse(localStorage.getItem("user"));
    const id = uuidv4();
    
    const data = {
      waktuKomen,
      komen: newComment,
      byUser
    }

    const dataTemporary = {
      id: uuidv4(),
      data: {
        waktuKomen,
        komen: newComment,
        byUser
      }
    }

    console.log(data);
    Firebase.database()
      .ref(`posts/${params.key}/komentar/${id}`)
      .set(data);

    const currentComment = [...comment];
    currentComment.push(dataTemporary);
    setComment(currentComment);
    setNewComment("");
  }

  const onHapus = () => {
    Firebase.database()
      .ref(`posts/${params.key}`)
      .remove()
    setOpen(true);
  }

  return (
    <div className="lihatresep-container">
      <div className="lihatresep-formContainer">
        {resep && (
        <Form className="lihatresep-form">
          {recookFrom&&(
          <Button 
            className="lihatresep-recook-buttonInfo" 
            variant="warning"
            onClick={OnRecookFrom}
            >Recook "{recookFrom.judul}" by {recookFrom.chef.namaLengkap}
          </Button>
          )}
          <Form.Group>
            <h1 className="lihatresep-form-title">{resep.judul}</h1>
            <InputGroup className="mb-3">
              <img className="card-img-top" src={resep.urlPhoto} alt="" height={400}/>
            </InputGroup>
            <p className="lihatresep-tanggalDibuat">Dibuat pada {resep.waktuPost} oleh <span className="lihatresep-chef">{resep.chef.namaLengkap}</span></p>
            
            {/* <Form.Label>Judul</Form.Label> */}
            {/* <ListGroup.Item>{resep.judul}</ListGroup.Item> */}
          </Form.Group>

          <Form.Group>
            <Form.Label className="subtitle">Cerita</Form.Label>
            {/* <ListGroup.Item className="subtitle-value">{resep.cerita}</ListGroup.Item> */}
            <div className="subtitle-underline">
              <p>{resep.cerita}</p>
            </div>
          </Form.Group>

          <Form.Group>
            <Form.Label className="subtitle">Lama memasak</Form.Label>
            {/* <ListGroup.Item className="subtitle-borderRadius">{resep.waktu}</ListGroup.Item> */}
            <div className="subtitle-underline">
              <p>{resep.waktu}</p>
            </div>
          </Form.Group>

          <Form.Group>
            <Form.Label className="subtitle">Bahan-bahan</Form.Label>
            {resep.bahanResep.map((bahan, index) => (
              // <ListGroup.Item key={index}>{index+1}. {bahan.namaBahan}</ListGroup.Item>
              <div className="subtitle-underline" key={index}>
                <p>{index+1}. {bahan.namaBahan}</p>
              </div>
            ))}
          </Form.Group>

          <Form.Group>
            <Form.Label className="subtitle">Langkah-langkah</Form.Label>
            {resep.langkahResep.map((langkah, index) => (
              // <ListGroup.Item key={index}>{index+1}. {langkah.namaLangkah}</ListGroup.Item>
              <div className="subtitle-underline" key={index}>
                <p>{index+1}. {langkah.namaLangkah}</p>
              </div>
            ))}
          </Form.Group>

          <div className="lihatresep-recook-group">
            {myData.uid !== resepUid &&(
              <Button 
                className="lihatresep-buttonRecook" 
                variant="warning"
                onClick={() => history.push(`/recook/${resep.postId}`)}
              >Recook resep ini</Button>
            )}
            {recookBy && (
                <p className="lihatresep-recookBy">resep ini telah di <span className="recookText">recook</span> oleh <span className="recookOrang">{recookBy.length} orang</span></p>
            )}
          </div>
          {myData.uid === resepUid &&(
            <Button 
              className="lihatresep-buttonRecook ml-auto mr-0 lihatresep-recook-group" 
              variant="danger"
              onClick={() => setModal(true)}
            >Hapus resep ini</Button>
          )}
        </Form>
        )}
      </div>
      <div className="lihatresep-commentContainer">
        <div className="lihatresep-comment">
          <p className="subtitle judul">Komentar</p>
          {comment && (
            <div className="lihatresep-comment-list">
              {comment.map(comment => (
                <div className="lihatresep-comment-item" key={comment.id}>
                  <p className="subtitle">{comment.data.byUser.namaLengkap}</p>
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
              <Button variant="outline-secondary" onClick={onKirim}>Kirim</Button>
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
              <Button variant="primary" onClick={() => setModal(false)}>Kembali</Button>
              <Button variant="danger" onClick={onHapus}>Hapus</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
        )}
        {/* /modal */}

        {/* snackbar */}
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
              resep telah dihapus
          </Alert>
        </Snackbar>
        {/* /snackbar */}

      </div>
    </div>
  );
};

export default LihatResep;
