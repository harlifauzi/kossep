import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Firebase } from "../../config";
import "bootstrap/dist/css/bootstrap.min.css";
import { ILBanner } from "../../assets/illustrations";

const HalamanUtama = () => {
    const history = useHistory();
    const params = useParams();
    const userLoginStatus = localStorage.getItem("userLoginStatus");
    const [recipes, setRecipes] = useState([]);
    const [siap, setSiap] = useState(false)


    useEffect(() => {
        if (userLoginStatus === "false"){
            history.push("/halamaneksplor/undifined")
        }
        Firebase.database()
            .ref(`users/${params.key}/following/`)
            .once("value", getFollowingUid)
    }, []);


    // get following uid for get recipes
    const getFollowingUid = (items) => {
        console.log(items.val());
        items.forEach(item => {
            console.log(item.val().uid)
            Firebase.database()
                .ref("posts/")
                .orderByChild("chef/uid")
                .equalTo(item.val().uid)
                .once("value", getRecipesData)
        })
    }


    // get recipes
    const getRecipesData = (items) => {
        setSiap(false)
        items.forEach(item => {
            console.log(item.val());
            recipes.push(item.val());
        })
        console.log(recipes);
        setSiap(true)
    }


    // view recipe
    const lihatResep = (key) => {
        history.push(`/lihatresep/${key}`);
    };


    // view profile
    const lihatAkun = (key) => {
        const getDataAkun = localStorage.getItem("user");
        const dataAkun = JSON.parse(getDataAkun);
        if (dataAkun.uid === key) {
            history.push(`/halamanakun/${key}`);
        } else {
            history.push(`/halamanakunlain/${key}`);
        }
    };


    return (
        <div className="halamanutama-container">

            {/* banner */}
            <div className="halamanutama-banner">
                <img src={ILBanner} />
            </div>
            
            {/* buttons */}
            <div className="halamanutama-button">
                {/* explore button */}
                <div className='halamanutama-button-explore' onClick={() => history.push(`/halamaneksplor/${params.key}`)}>
                    <i className='bx bx-outline'></i><p>Explore</p>
                </div>

                {/* create recipe button */}
                <div className='halamanutama-button-plus' onClick={() => history.push("/buatresep")}>
                    <i className='bx bx-plus'></i><p>Buat resep</p>
                </div>
            </div>

            {/* if recipes available */}
            {recipes && (
            <div className="halamanutama-grid">

                {/* mapping recipes */}
                {recipes.map(recipe => (
                // recipes card
                <div className="halamanutama-grid-item" key={recipe.postId}>
                    <div className="halamanutama-grid-item-card">
                        <img onClick={() => lihatResep(recipe.postId)} src={recipe.urlPhoto} />
                        <div className="halamanutama-grid-item-card-desc">
                            <h2 className="halamanutama-grid-item-card-desc-judul" onClick={() => lihatResep(recipe.postId)}>{recipe.judul}</h2>
                            <p className="halamanutama-grid-item-card-desc-cerita">{recipe.cerita}</p>
                            <div className="halamanutama-grid-item-card-desc-info">
                                <div>
                                    <i className='bx bxs-time' ></i>
                                    <p>{recipe.waktu}</p>
                                </div>
                                {recipe.biaya && (
                                <div>
                                    <i className='bx bxs-dollar-circle'></i>
                                    <p>Rp. {recipe.biaya}K/porsi</p>
                                </div>
                                )}
                                <div 
                                    className="halamanutama-grid-item-card-desc-info-chef" 
                                    onClick={() => lihatAkun(recipe.chef.uid)}
                                >
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

export default HalamanUtama;
