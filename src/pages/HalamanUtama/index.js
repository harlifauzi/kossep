import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Firebase } from "../../config";
import "bootstrap/dist/css/bootstrap.min.css";
import { ILBanner } from "../../assets/illustrations";

const HalamanUtama = () => {
    const history = useHistory();
    const params = useParams();
    const [recipes, setRecipes] = useState([]);
    const [uidFollowers, setUidFollowers] = useState();
    const [siap, setSiap] = useState(false)

    useEffect(() => {
        getFollowersUid();
    }, []);

    useEffect(() => {
        if (uidFollowers){
            uidFollowers.map(item => {
                Firebase.database()
                    .ref("posts/")
                    .orderByChild("chef/uid")
                    .equalTo(item)
                    .once("value")
                    .then(res => {
                        if(res.val()){
                            const oldData = res.val();
                            const newData = [];
                            Object.keys(oldData).map(item => {
                                newData.push(oldData[item])
                            })
                            setRecipes(newData);
                            setSiap(true)
                        }
                    })
            })
        }
    }, [uidFollowers])

    const getFollowersUid = () => {
        Firebase.database()
            .ref(`users/${params.key}/following/`)
            .once("value")
            .then(res => {
                if (res.val()){
                    const oldDataFollowers = res.val();
                    const currentDataFollowers = [];
                    Object.keys(oldDataFollowers).map(item => {
                        currentDataFollowers.push(item)
                    })
                    setUidFollowers(currentDataFollowers);
                }
            })
    }

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
                    <i className='bx bx-outline'></i><p>Explore</p>
                </div>

                <div className='halamanutama-button-plus' onClick={() => history.push("/buatresep")}>
                    <i className='bx bx-plus'></i><p>Buat resep</p>
                </div>
            </div>

            {siap && (
            <div className="halamanutama-grid">

                {recipes.map(recipe => (
                <div className="halamanutama-grid-item" key={recipe.postId}>
                    <div className="halamanutama-grid-item-card">
                        <img onClick={() => lihatResep(recipe.postId)} src={recipe.urlPhoto} />
                        <div className="halamanutama-grid-item-card-desc">
                            <h2 className="halamanutama-grid-item-card-desc-judul">{recipe.judul}</h2>
                            <p className="halamanutama-grid-item-card-desc-cerita">{recipe.cerita}</p>
                            <div className="halamanutama-grid-item-card-desc-info">
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
                                    className="halamanutama-grid-item-card-desc-info-chef" 
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

export default HalamanUtama;
