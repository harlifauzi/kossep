import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Firebase } from "../../config";

const HalamanEksplor = () => {
  const params = useParams();
  const history = useHistory();

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // get all posts data
    Firebase.database()
      .ref("posts/")
      .orderByChild("timeId")
      .once("value", orderAllPostsData);
  });

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

    return (
        <div className="halamaneksplor-container">

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
                                    <i class='bx bxs-time' ></i>
                                    <p>{recipe.waktu}</p>
                                </div>
                                <div>
                                    <i class='bx bx-repost'></i>
                                    <p>recook 30x</p>
                                </div>
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
