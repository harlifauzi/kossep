import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Firebase } from "../../config";
import { RecipeCard, RecipeCardSkeleton, SearchBar } from '../../components';

const HalamanEksplor = () => {
    const history = useHistory();
    const userLoginStatus = localStorage.getItem("userLoginStatus");
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState("");
    const [skeleton, setSkeleton] = useState(false);


    useEffect(() => {
        document.title = "Kossep | Explore"
        
        getRecipes();

        return () => getRecipes();
    }, []);


    // get recipes
    const getRecipes = async () => {
        const recipes = await Firebase.database().ref('posts/').once('value')
            .then(res => res.val())
            .then(recipes => {return recipes});

        const oldRecipes = await Object.keys(recipes).map( async recipe => {
            const newRecipe = recipes[recipe];

            const chef = await Firebase.database().ref(`users/${newRecipe.chef.uid}/`).once('value')
                .then(res => res.val())
                .then(chef => {return chef});

            newRecipe.chef = chef;

            return newRecipe;
        })

        const newRecipes = await Promise.all(oldRecipes);

        const sortRecipes = newRecipes.sort((a, b) => b['timestamp'] - a['timestamp']);

        setSkeleton(true);
        setRecipes(sortRecipes);
    }


    // search recipe
    const onCariResep = async () => {
        const results = await Firebase.database().ref('posts/').orderByChild('judul').startAt(`${search}`).endAt(`${search}/uf8ff`).once('value')
            .then(res => res.val())
            .then(results => {return results});

        if(results){
            const oldResult = await Object.keys(results).map( async result => {
                const recipe = results[result];
    
                const chef = await Firebase.database().ref(`users/${recipe.chef.uid}/`).once('value')
                    .then(res => res.val())
                    .then(chef => {return chef});
    
                recipe.chef = chef;
    
                return(recipe);
            })
    
            const newRecipe = await Promise.all(oldResult);
    
            setRecipes(newRecipe);
        } else {
            alert('Resep tidak ditemukan!');
        }
    }


    // change text search input
    const onChangeCariResep = (e) => {
        setSearch(e.target.value);
    }


    // view recipes
    const lihatResep = (key) => {
        history.push(`/lihatresep/${key}`);
    }
  

    // view profile
    const lihatAkun = (key) => {
        const getDataAkun = localStorage.getItem("user");
        const dataAkun = JSON.parse(getDataAkun)

        if (userLoginStatus === "true"){
            if(dataAkun.uid===key){
                history.push(`/halamanakun/${key}`);
            } else {
                history.push(`/halamanakunlain/${key}`);
            }
        } else {
            history.push(`/halamanakunlain/${key}`);
        }

    }


    return (
        <div className="halamaneksplor-container">
            <SearchBar onChangeCariResep={onChangeCariResep} onCariResep={onCariResep} value={search} />

            {/* when recipes available */}
            {recipes && (
            <div className="halamaneksplor-grid">

                {/* mapping recipes */}
                {recipes.map(recipe => (
                <RecipeCard key={recipe.postId} recipe={recipe} lihatAkun={lihatAkun} lihatResep={lihatResep} />
                ))}

            </div>
            )}

            {/* when recipes are not available */}
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
