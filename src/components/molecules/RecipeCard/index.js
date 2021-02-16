import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ILNull } from "../../../assets";

const RecipeCard = ({recipe, lihatAkun, lihatResep}) => {
    return (
        <div className="halamanutama-grid-item" key={recipe.postId}>
            <div className="halamanutama-grid-item-card">
                <img onClick={() => lihatResep(recipe.postId)} src={recipe.urlPhoto} />
                <div className="halamanutama-grid-item-card-desc">
                    <h2
                        className="halamanutama-grid-item-card-desc-judul"
                        onClick={() => lihatResep(recipe.postId)}
                    >
                        {recipe.judul}
                    </h2>
                    <p className="halamanutama-grid-item-card-desc-cerita">
                        {recipe.cerita}
                    </p>
                    <div className="halamanutama-grid-item-card-desc-info">
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
                        <div
                            className="halamanutama-grid-item-card-desc-info-chef"
                            onClick={() => lihatAkun(recipe.chef.uid)}
                        >
                            {recipe.chef.photo ? (
                                <img src={recipe.chef.photo} alt="" />
                            ) : (
                                <img src={ILNull} alt="" />
                            )}
                            <p>{recipe.chef.namaLengkap}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;
