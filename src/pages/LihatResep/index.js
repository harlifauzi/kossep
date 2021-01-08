import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Firebase } from "../../config";
import { Form, InputGroup, ListGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const LihatResep = () => {
  const params = useParams();
  const [resep, setResep] = useState();

  useEffect(() => {
    Firebase.database()
      .ref(`posts/${params.key}/`)
      .once("value")
      .then((res) => {
        if (res.val()) {
          const data = res.val();
          setResep(data);
        }
      });
  }, []);
  return (
    <div className="lihatresep-container">
      {resep && (
      <Form className="lihatresep-form">
        <Form.Group>
          <Form.Label>Judul</Form.Label>
          <ListGroup.Item>{resep.judul}</ListGroup.Item>
        </Form.Group>

        <Form.Group>
          <Form.Label>Cerita</Form.Label>
          <ListGroup.Item>{resep.cerita}</ListGroup.Item>
        </Form.Group>

        <Form.Group>
          <Form.Label>Lama memasak</Form.Label>
          <ListGroup.Item>{resep.waktu}</ListGroup.Item>
        </Form.Group>

        <Form.Group>
          <Form.Label>Bahan-bahan</Form.Label>
          {resep.bahanResep.map((bahan, index) => (
            <ListGroup.Item key={index}>{index+1}. {bahan.namaBahan}</ListGroup.Item>
          ))}
        </Form.Group>

        <Form.Group>
          <Form.Label>Langkah-langkah</Form.Label>
          {resep.langkahResep.map((langkah, index) => (
            <ListGroup.Item key={index}>{index+1}. {langkah.namaLangkah}</ListGroup.Item>
          ))}
        </Form.Group>

        <InputGroup className="mb-3">
          <img className="card-img-top" src={resep.urlPhoto} alt="" height={400}/>
        </InputGroup>
      </Form>
      )}
    </div>
  );
};

export default LihatResep;
