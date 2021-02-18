import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ILNull } from "../../../assets";

const RecipeCard = ({recipe, lihatAkun, lihatResep, type}) => {
    return (
        <div className="recipecard" key={recipe.postId}>
            <div className="recipecard-card">
                <img onClick={() => lihatResep(recipe.postId)} src={recipe.urlPhoto} alt=''/>
                <div className="recipecard-card-desc">
                    <h2
                        className="recipecard-card-desc-judul"
                        onClick={() => lihatResep(recipe.postId)}
                    >
                        {recipe.judul}
                    </h2>
                    <p className="recipecard-card-desc-cerita">
                        {recipe.cerita}
                    </p>
                    <div className="recipecard-card-desc-info">
                        <div>
                            <i className="bx bxs-time"></i>
                            <p>{recipe.waktu}</p>
                        </div>
                        {recipe.biaya && (
                        <div>
                            <i className="bx bxs-dollar-circle"></i>
                            <p>Rp. {recipe.biaya}K/porsi</p>
                        </div>
                        )}
                        {type !== 'profile' && (
                        <div
                            className="recipecard-card-desc-info-chef"
                            onClick={() => lihatAkun(recipe.chef.uid)}
                        >
                            {recipe.chef.photo ? (
                                <img src={recipe.chef.photo} alt="" />
                            ) : (
                                <img src={ILNull} alt="" />
                            )}
                            <p>{recipe.chef.namaLengkap}</p>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;
