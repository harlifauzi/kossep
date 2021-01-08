import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Firebase } from "../../config";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ILBanner } from "../../assets/illustrations";

const HalamanUtama = () => {
    const history = useHistory();
    const params = useParams();
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {

        // get my following data for order recipes
        Firebase.database()
        .ref(`users/${params.key}/following/`)
        .once("value", orderDataFollowingRecipes);

    }, []);

    const orderDataFollowingRecipes = (items) => {
        if (items.val()) {
        const following = items.val();
        const data = [];
        Object.keys(following).map((user) => {
            const recipes = following[user].posts;
            Object.keys(recipes).map((recipe) => {
            const dataRecipe = {
                id: recipe,
                data: recipes[recipe],
            };
            data.unshift(dataRecipe);
            });
        });
        setRecipes(data);
        }
    };

    const lihatResep = (key) => {
        history.push(`/lihatresep/${key}`);
    };

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

            <div className="halamanutama-banner">
                <img src={ILBanner} />
            </div>
            
            <div className="halamanutama-button">
                <div className='halamanutama-button-explore' onClick={() => history.push(`/halamaneksplor/${params.key}`)}>
                    <i class='bx bx-outline'></i>
                </div>

                <div className='halamanutama-button-plus' onClick={() => history.push("/buatresep")}>
                    <i class='bx bx-plus'></i>
                </div>
            </div>

            {recipes && (
            <div className="halamanutama-grid">

                {recipes.map(recipe => (
                <div className="halamanutama-grid-item" key={recipe.id}>
                    <div className="halamanutama-grid-item-card">
                        <img onClick={() => lihatResep(recipe.id)} src={recipe.data.urlPhoto} />
                        <div className="halamanutama-grid-item-card-desc">
                            <h2 className="halamanutama-grid-item-card-desc-judul">{recipe.data.judul}</h2>
                            <p className="halamanutama-grid-item-card-desc-cerita">{recipe.data.cerita}</p>
                            <div className="halamanutama-grid-item-card-desc-info">
                                <div>
                                    <i class='bx bxs-time' ></i>
                                    <p>{recipe.data.waktu}</p>
                                </div>
                                <div>
                                    <i class='bx bx-repost'></i>
                                    <p>recook 30x</p>
                                </div>
                                <div 
                                    className="halamanutama-grid-item-card-desc-info-chef" 
                                    onClick={() => lihatAkun(recipe.data.chef.uid)}>
                                        <i className='bx bxs-user' ></i>
                                        <p>{recipe.data.chef.namaLengkap}</p>
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
