import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Firebase } from "../../config";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const HalamanEksplor = () => {
  const params = useParams();
  const history = useHistory();

  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // get all posts data
    Firebase.database()
      .ref("posts/")
      .orderByChild("timeId")
      .once("value", orderAllPostsData);
  }, []);


  // order all posts data and save to posts state
  const orderAllPostsData = (items) => {
    const data = [];

    items.forEach((item) => {
      const oldData = item.val();
      data.unshift(oldData);
    });

    setRecipes(data);
  };


  const lihatResep = (key) => {
    history.push(`/lihatresep/${key}`);
  }
  

  const lihatAkun = (key) => {
    const getDataAkun = localStorage.getItem("user");
    const dataAkun = JSON.parse(getDataAkun)

    if(dataAkun.uid===key){
        history.push(`/halamanakun/${key}`);
    } else {
        history.push(`/halamanakunlain/${key}`);
    }

  }


  const onCariResep = () => {
    console.log(search);
    Firebase.database()
      .ref("posts/")
      .orderByChild("judul")
      .startAt(`${search}`)
      .endAt(`${search}/uf8ff`)
      .once("value")
      .then(res => {
        if (res.val()){
          const oldData = res.val();
          const data = []
          Object.keys(oldData).map(item => {
            data.push(oldData[item])
          })
          setRecipes(data);
        } else {
          alert("Resep tidak ditemukan")
        }
      });
  }


    return (
        <div className="halamaneksplor-container">
            <InputGroup className="mb-3">
                <FormControl
                placeholder="tuliskan judul resep"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                className="halamaneksplor-searchbar"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
                <InputGroup.Append>
                <Button variant="danger" onClick={onCariResep}>cari resep</Button>
                </InputGroup.Append>
            </InputGroup>

            {recipes && (
            <div className="halamaneksplor-grid">

                {recipes.map(recipe => (
                <div className="halamaneksplor-grid-item" key={recipe.postId}>
                    <div className="halamaneksplor-grid-item-card">
                        <img onClick={() => lihatResep(recipe.postId)} src={recipe.urlPhoto} />
                        <div className="halamaneksplor-grid-item-card-desc">
                            <h2 className="halamaneksplor-grid-item-card-desc-judul">{recipe.judul}</h2>
                            <p className="halamaneksplor-grid-item-card-desc-cerita">{recipe.cerita}</p>
                            <div className="halamaneksplor-grid-item-card-desc-info">
                                <div>
                                    <i className='bx bxs-time' ></i>
                                    <p>{recipe.waktu}</p>
                                </div>
                                {recipe.biaya && (
                                <div>
                                    <i className='bx bxs-dollar-circle'></i>
                                    <p>Rp. {recipe.biaya}K</p>
                                </div>
                                )}
                                <div 
                                    className="halamaneksplor-grid-item-card-desc-info-chef" 
                                    onClick={() => lihatAkun(recipe.chef.uid)}>
                                        <i className='bx bxs-user' ></i>
                                        <p>{recipe.chef.namaLengkap}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ))}

            </div>
            )}
            
        </div>    
    );
};

export default HalamanEksplor;
