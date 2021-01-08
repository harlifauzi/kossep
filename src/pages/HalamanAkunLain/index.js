import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Firebase } from '../../config';
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const HalamanAkunLain = () => {
	const params = useParams();
    const history = useHistory();
    const getMyData = localStorage.getItem("user");
    const myData = JSON.parse(getMyData);

	const [userData, setUserData] = useState({});
    const [posts, setPosts] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [followStatus, setFollowStatus] = useState();

	useEffect(() => {

        // get other user data
		Firebase.database()
			.ref(`users/${params.key}/`)
			.once('value')
			.then(res => {

				if(res.val){
					const data = res.val();
                    setUserData(data);
                    console.log({otherUserData: data})
                }
                
			})

        // get other user's posts data
		Firebase.database()
            .ref(`users/${params.key}/posts/`)
            .orderByChild("timeId")
            .once("value", orderDataPosts)

        // get other user's following data
        Firebase.database()
            .ref(`users/${params.key}/following/`)
            .once("value", orderDataFollowing)

        // get other user's followers data
        Firebase.database()
            .ref(`users/${params.key}/followers/`)
            .once("value", orderDataFollowers)

	}, [])

    // order other user's posts data and save to posts state
	const orderDataPosts = (items) => {
        const data=[]

        items.forEach((item) => {
            const oldData = item.val();
            const newData = {
                id: oldData.postId,
                data: oldData
            }
            data.unshift(newData);
        });

        console.log({otherUserDataPosts: data})
        setPosts(data);
    }

    // order other user's following data and save to followers state
    const orderDataFollowing = (items) => {
        const data=[]

        items.forEach((item) => {
            const oldData = item.val();
            const newData = oldData.uid;
            data.unshift(newData);
        });

        console.log({otherUserDataFollowers: data})
        setFollowing(data);
    }
    
    // order other user's followers data and save to followers state
    const orderDataFollowers = (items) => {
            const data=[]

            items.forEach((item) => {
                const oldData = item.val();
                const newData = oldData.uid;
                data.unshift(newData);
            });

            console.log({otherUserDataFollowers: data})
            setFollowers(data);
            
            if(data.includes(myData.uid)){
                setFollowStatus(true)
            } else {
                setFollowStatus(false)
            } 
	}
    
    // function when recipe clicked
	const lihatResep = (key) => {
        history.push(`/lihatresep/${key}`);
	}
    
    // function when follow / unfollow button clicked
	const onFollow = (userId) => {

        if(followers.includes(myData.uid)){

            // remove my uid on other user followers document
            Firebase.database()
            .ref(`users/${userData.uid}/followers/${myData.uid}/`)
            .remove();

            // remove other user uid on my following document
            Firebase.database()
            .ref(`users/${myData.uid}/following/${userData.uid}/`)
            .remove();

            // define my uid position on followers state
            const position = followers.indexOf(myData.uid)

            // remove my uid on followers state base on position const
            followers.splice(position, 1)

            // set followStatus state to false
            setFollowStatus(!followStatus);

        } else {

            // add my uid to other user followers document
            Firebase.database()
            .ref(`users/${userData.uid}/followers/${myData.uid}/`)
            .set(myData)

            // add other user uid to my following document
            Firebase.database()
            .ref(`users/${myData.uid}/following/${userData.uid}`)
            .set(userData);

            // add my uid to followers state
            followers.push(myData.uid)

            // set followStatus state to true
            setFollowStatus(!followStatus)

        }
	}

	return(
		<div className='halamanakunlain-container'>
			<div className="halamanakunlain-userinfo">
                <div className="halamanakunlain-userinfo-name">
                    <p>{userData.namaLengkap}</p>
					<Button 
						className="ml-auto mr-auto" 
						variant={followStatus?"primary":"light"}
						onClick={() => onFollow(userData.uid)}
					>{followStatus?"Berhenti mengikuti":"Ikuti"}</Button>
                </div>
                <div className="halamanakunlain-userinfo-popularity">
                    <p>{posts.length} <br></br> recipes</p>
                    <div></div>
                    <p>{followers.length} <br></br> followers</p>
                    <div></div>
                    <p>{following.length} <br></br> following</p>
                </div>
            </div>
			<hr></hr>
			{posts && (
            <div className="halamanakunlain-grid">

                {posts.map(recipe => (
                <div className="halamanakunlain-grid-item" key={recipe.id}>
                    <div className="halamanakunlain-grid-item-card">
                        <img onClick={() => lihatResep(recipe.id)} src={recipe.data.urlPhoto} />
                        <div className="halamanakunlain-grid-item-card-desc">
                            <h2 className="halamanakunlain-grid-item-card-desc-judul">{recipe.data.judul}</h2>
                            <p className="halamanakunlain-grid-item-card-desc-cerita">{recipe.data.cerita}</p>
                            <div className="halamanakunlain-grid-item-card-desc-info">
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

export default HalamanAkunLain;