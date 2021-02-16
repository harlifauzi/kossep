import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Firebase } from '../../config';
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { RecipeCard } from '../../components';

const HalamanAkun = () => {
    const params = useParams();
    const history = useHistory();
    const [userData, setUserData] = useState({});
    const [posts, setPosts] = useState([]);
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);

    useEffect(() => {

        // get user data
        Firebase.database()
            .ref(`users/${params.key}/`)
            .once("value")
            .then(res => {
                if (res.val()){
                    const data = res.val();
                    setUserData(data);
                }
            })
        
        // get recipes data
        Firebase.database()
            .ref(`posts/`)
            .orderByChild("chef/uid")
            .equalTo(params.key)
            .once("value", orderDataPost)

        // get following data
        Firebase.database()
            .ref(`users/${params.key}/following/`)
            .once("value", orderDataFollowing)

        // get followers data
        Firebase.database()
            .ref(`users/${params.key}/followers/`)
            .once("value", orderDataFollowers)

        document.title = `Kossep | Profil`

    }, [])


    // order data posts from firebase and save to state posts
    const orderDataPost = (items) => {
        const data=[]

        items.forEach((item) => {
            const oldData = item.val();
            data.unshift(oldData);
        });

        console.log({dataPosts: data})
        setPosts(data);
    }


    // order data following from firebase and save to state following
    const orderDataFollowing = (items) => {
        const data=[]

        items.forEach((item) => {
            const oldData = item.val();
            const newData = oldData.uid;
            data.unshift(newData);
        });

        console.log({dataFollowing: data})
        setFollowing(data);
    }


    // order data followers from firebase and save to state following
    const orderDataFollowers = (items) => {
        const data=[]

        items.forEach((item) => {
            const oldData = item.val();
            const newData = oldData.uid;
            data.unshift(newData);
        });

        console.log({dataFollowers: data})
        setFollowers(data);
    }


    // view profile
    const lihatResep = (key) => {
        history.push(`/lihatresep/${key}`);
    }


    return (
        <div className="halamanakun-container">
            <div className="halamanakun-userinfo">
                <div className="halamanakun-userinfo-name">
                    <div className="halamanakun-userinfo-name-img">
                        {userData.photo ? (<img src={userData.photo} alt=""/>) : (<i className='bx bxs-user'></i>)}
                    </div>
                    <p>{userData.namaLengkap}</p>
                    <Button variant="info" onClick={() => history.push(`/pengaturanakun/${userData.uid}`)}>Edit profile</Button>
                </div>
                <div className="halamanakun-userinfo-popularity">
                    <p>{posts.length} <br></br> posts</p>
                    <div></div>
                    <p>{followers.length} <br></br> followers</p>
                    <div></div>
                    <p>{following.length} <br></br> following</p>
                </div>
            </div>
            <hr></hr>
            
            {/* when posts available */}
            {posts && (
            <div className="halamanakun-grid">

                {/* mapping posts */}
                {posts.map(recipe => (
                <RecipeCard recipe={recipe} lihatResep={lihatResep} type="profile" />
                ))}

            </div>
            )}

            {/* when zero posts */}
            {posts.length === 0 && (
            <div className="zero-posts">
                <i class='bx bx-book-open'></i>
                <p>Tidak ada resep</p>
            </div>
            )}
        </div>
    )
}

export default HalamanAkun
