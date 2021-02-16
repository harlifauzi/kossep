import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Firebase } from "../../config";
import { RecipeCard, SearchBar } from '../../components';

const HalamanEksplor = () => {
    const history = useHistory();
    const userLoginStatus = localStorage.getItem("userLoginStatus");
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState("");


    useEffect( async () => {
        document.title = "Kossep | Explore"

        // get all posts data
        const getRecipes = await Firebase.database()
            .ref("posts/")
            .orderByChild("timestamp")
            .once("value", orderAllPostsData);
        
    }, []);


    // order all posts data and save to posts state
    const orderAllPostsData = (items) => {
        const recipes = items;
        const data = [];
        recipes.forEach(item => {
            const resep = item.val();
            data.unshift(resep);
        })
        setRecipes(data);
    };


    // view recipes when card is clicked
    const lihatResep = (key) => {
        history.push(`/lihatresep/${key}`);
    }
  

    // function view profile
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


    // function when search recipe clicked
    const onCariResep = () => {
        console.log(search);
        Firebase.database()
        .ref("posts/")
        .orderByChild("judul")
        .startAt(`${search}`)
        .endAt(`${search}/uf8ff`)
        .once("value")
        .then(res => {
            if (res.val()){
                const oldData = res.val();
                const data = [];
                Object.keys(oldData).map(item => {
                    data.push(oldData[item]);
                })
                setRecipes(data);
            } else {
                alert("Resep tidak ditemukan");
            }
        });
    }


    const onChangeCariResep = (e) => {
        setSearch(e.target.value);
    }


    return (
        <div className="halamaneksplor-container">
            <SearchBar onChangeCariResep={onChangeCariResep} onCariResep={onCariResep} value={search} />

            {/* when recipes available */}
            {recipes && (
            <div className="halamaneksplor-grid">

                {/* mapping recipes */}
                {recipes.map(recipe => (
                <RecipeCard recipe={recipe} lihatAkun={lihatAkun} lihatResep={lihatResep} />
                ))}

            </div>
            )}
            
        </div>    
    );
};

export default HalamanEksplor;
