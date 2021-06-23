import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Firebase } from "../../config";
import { ILBanner } from "../../assets/illustrations";
import { RecipeCard, RecipeCardSkeleton } from '../../components';
import { useSelector } from "react-redux";

const HalamanUtama = () => {
    const history = useHistory();
    const params = useParams();
    const [recipes, setRecipes] = useState([]); 
    const [skeleton, setSkeleton] = useState(false);
    const { loginStatus, dataUser } = useSelector(store => store);


    useEffect(() => {
        if (!loginStatus) history.replace("/halamaneksplor/undifined");

        if (loginStatus) {
            document.title = "Kossep";
            getRecipes();
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps


    const getRecipes = async () => {
        const followings = await Firebase.database().ref(`users/${dataUser.uid}/following/`).once('value')
            .then(response => response.val())
            .catch(error => error);
    
        if(followings){
            const oldRecipes = await Object.keys(followings).map( async following => {
                const dataChef = await Firebase.database().ref(`users/${following}/`).once('value')
                    .then(response => response.val());
                    
                const dataRecipes = await Firebase.database().ref(`posts/`).orderByChild('chef/uid').equalTo(following).once('value')
                    .then(response => response.val());
                    
                const newDataRecipes = await Object.keys(dataRecipes).map(recipe => {
                    let newRecipe = dataRecipes[recipe];
                    newRecipe.chef = dataChef;
                    return newRecipe;
                });
    
                return newDataRecipes;
            })
    
            const newRecipes = await Promise.all(oldRecipes);
    
            let arrRecipe = [];
            Object.keys(newRecipes).map(recipe => {
                newRecipes[recipe].map(recipe => arrRecipe.push(recipe));
                return recipe;
            });
    
            const sortRecipes = arrRecipe.sort((a, b) => b['timestamp'] - a['timestamp']);
    
            setSkeleton(true);
            setRecipes(sortRecipes);
        } else return;
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
                <img src={ILBanner} alt=""/>
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
                <RecipeCard key={recipe.postId} recipe={recipe} lihatResep={lihatResep} lihatAkun={lihatAkun} />
                ))}

            </div>
            )}

            {/* if recipes are not available */}
            {!skeleton && (
            <div className="halamanutama-grid">
                <RecipeCardSkeleton />
                <RecipeCardSkeleton />
                <RecipeCardSkeleton />
            </div>
            )}

        </div>
    );
};

export default HalamanUtama;
