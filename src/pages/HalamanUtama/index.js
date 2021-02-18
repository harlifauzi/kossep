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


    useEffect(() => {
        document.title = "Kossep"

        if (userLoginStatus === "false"){
            history.push("/halamaneksplor/undifined")
        }

        getRecipes();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps


    // get recipes from following
    const getRecipes = async () => {
        const followings = await Firebase.database().ref(`users/${params.key}/following/`).once('value')
            .then(res => res.val())
            .then(datas => { return datas })
            .catch(error => {return error});
    
        if(followings){
            const oldRecipes = await Object.keys(followings).map( async following => {
                const dataChef = await Firebase.database().ref(`users/${following}/`).once('value')
                    .then(res => res.val())
                    .then(user => {return user});
                    
                const dataRecipes = await Firebase.database().ref(`posts/`).orderByChild('chef/uid').equalTo(following).once('value')
                    .then(res => res.val())
                    .then(recipes => {return recipes});
                    
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

        </div>
    );
};

export default HalamanUtama;
