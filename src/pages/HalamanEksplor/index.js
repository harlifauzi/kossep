import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Firebase } from "../../config";
import { RecipeCard, RecipeCardSkeleton, SearchBar } from '../../components';
import { useSelector } from "react-redux";

const HalamanEksplor = () => {
    const history = useHistory();
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState("");
    const [skeleton, setSkeleton] = useState(false);
    const { loginStatus, dataUser } = useSelector(state => state);


    useEffect(() => {
        document.title = "Kossep | Explore"
        
        getRecipes();
    }, []);


    const getRecipes = async () => {
        const recipes = await Firebase.database().ref('posts/').once('value')
            .then(res => res.val());

        const oldRecipes = await Object.keys(recipes).map( async recipe => {
            const newRecipe = recipes[recipe];

            const chef = await Firebase.database().ref(`users/${newRecipe.chef.uid}/`).once('value')
                .then(res => res.val());

            newRecipe.chef = chef;

            return newRecipe;
        })

        const newRecipes = await Promise.all(oldRecipes);

        const sortRecipes = newRecipes.sort((a, b) => b['timestamp'] - a['timestamp']);

        setSkeleton(true);
        setRecipes(sortRecipes);
    }


    const onCariResep = async () => {
        const results = await Firebase.database().ref('posts/').orderByChild('judul').startAt(`${search}`).endAt(`${search}/uf8ff`).once('value')
            .then(res => res.val());

        if(results){
            const oldResult = await Object.keys(results).map( async result => {
                const recipe = results[result];
    
                const chef = await Firebase.database().ref(`users/${recipe.chef.uid}/`).once('value')
                    .then(res => res.val())
    
                recipe.chef = chef;
    
                return recipe;
            })
    
            const newRecipe = await Promise.all(oldResult);
    
            setRecipes(newRecipe);
        } else {
            alert('Resep tidak ditemukan!');
        }
    }


    const onChangeCariResep = (e) => {
        setSearch(e.target.value);
    }


    const lihatResep = (key) => {
        history.push(`/lihatresep/${key}`);
    }
  

    const lihatAkun = (key) => {
        if ( loginStatus ){
            if ( dataUser.uid === key ) {
                history.push(`/halamanakun/${key}`);
            } else {
                history.push(`/halamanakunlain/${key}`);
            }
        } 
        if ( !loginStatus ) history.push(`/halamanakunlain/${key}`);
    }


    return (
        <div className="halamaneksplor-container">
            <SearchBar onChangeCariResep={onChangeCariResep} onCariResep={onCariResep} value={search} />

            {recipes && (
            <div className="halamaneksplor-grid">

                {recipes.map(recipe => (
                <RecipeCard key={recipe.postId} recipe={recipe} lihatAkun={lihatAkun} lihatResep={lihatResep} />
                ))}

            </div>
            )}

            {!skeleton && (
            <div className="halamaneksplor-grid">
                <RecipeCardSkeleton />
                <RecipeCardSkeleton />
                <RecipeCardSkeleton />
            </div>
            )}
            
        </div>    
    );
};

export default HalamanEksplor;
