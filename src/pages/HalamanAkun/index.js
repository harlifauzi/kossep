import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Firebase } from '../../config';
import "bootstrap/dist/css/bootstrap.min.css";

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

        // get posts data
        Firebase.database()
            .ref(`users/${params.key}/posts/`)
            .orderByChild("timeId")
            .once("value", orderDataPost)

        // get following data
        Firebase.database()
            .ref(`users/${params.key}/following/`)
            .once("value", orderDataFollowing)

        // get followers data
        Firebase.database()
            .ref(`users/${params.key}/followers/`)
            .once("value", orderDataFollowers)

    }, [])

    // order data posts from firebase and save to state posts
    const orderDataPost = (items) => {
        const data=[]

        items.forEach((item) => {
            const oldData = item.val();
            const newData = {
                id: oldData.postId,
                data: oldData
            }
            data.unshift(newData);
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

    const lihatResep = (key) => {
        history.push(`/lihatresep/${key}`);
    }

    return (
        <div className="halamanakun-container">
            <div className="halamanakun-userinfo">
                <div className="halamanakun-userinfo-name">
                    <p>{userData.namaLengkap}</p>
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
            {posts && (
            <div className="halamanakun-grid">

                {posts.map(recipe => (
                <div className="halamanakun-grid-item" key={recipe.id}>
                    <div className="halamanakun-grid-item-card">
                        <img onClick={() => lihatResep(recipe.id)} src={recipe.data.urlPhoto} />
                        <div className="halamanakun-grid-item-card-desc">
                            <h2 className="halamanakun-grid-item-card-desc-judul">{recipe.data.judul}</h2>
                            <p className="halamanakun-grid-item-card-desc-cerita">{recipe.data.cerita}</p>
                            <div className="halamanakun-grid-item-card-desc-info">
                                <div>
                                    <i class='bx bxs-time' ></i>
                                    <p>{recipe.data.waktu}</p>
                                </div>
                                <div>
                                    <i class='bx bx-repost'></i>
                                    <p>recook 30x</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ))}

            </div>
            )}
        </div>
    )
}

export default HalamanAkun
