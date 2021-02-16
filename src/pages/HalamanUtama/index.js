import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Firebase } from "../../config";
import "bootstrap/dist/css/bootstrap.min.css";
import { ILBanner } from "../../assets/illustrations";
import { RecipeCard } from '../../components';

const HalamanUtama = () => {
    const history = useHistory();
    const params = useParams();
    const userLoginStatus = localStorage.getItem("userLoginStatus");
    const [recipes, setRecipes] = useState([]);
    const [siap, setSiap] = useState(false)                    


    useEffect(() => {
        document.title = "Kossep"

        if (userLoginStatus === "false"){
            history.push("/halamaneksplor/undifined")
        }
        
        Firebase.database()
            .ref(`users/${params.key}/following/`)
            .once("value", getFollowingUid)
    }, []);


    // get following uid for get recipes
    const getFollowingUid = (items) => {    
        items.forEach(item => {
            Firebase.database()
                .ref("posts/")
                .orderByChild("chef/uid")
                .equalTo(item.val().uid)
                .once("value")
                .then(res => {
                    const items = res;
                    
                    items.forEach(item => {
                        const recipe = item.val()
                        Firebase.database()
                            .ref(`users/${recipe.chef.uid}`)
                            .once("value")
                            .then(res => {
                                setSiap(false)
                                const chef = res.val();
                                recipe.chef = chef;
                                recipes.push(recipe)
                                setSiap(true)
                            })
                    })
                })
        })
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
                <RecipeCard recipe={recipe} lihatResep={lihatResep} lihatAkun={lihatAkun} />
                ))}

            </div>
            )}

        </div>
    );
};

export default HalamanUtama;
