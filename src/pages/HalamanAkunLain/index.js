import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Firebase } from '../../config';
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

// <snackbar function>
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
// </snackbar function>

const HalamanAkunLain = () => {
	const params = useParams();
    const history = useHistory();
    const getMyData = localStorage.getItem("user");
    const userLoginStatus = localStorage.getItem("userLoginStatus");
    const myData = JSON.parse(getMyData);

	const [userData, setUserData] = useState({});
    const [posts, setPosts] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [followStatus, setFollowStatus] = useState();


    // <snackbar function>
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("")
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
        return;
        }

        setOpen(false);
    };
    // </snackbar function>


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
            .ref(`posts/`)
            .orderByChild("chef/uid")
            .equalTo(params.key)
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


    // order other user's following data and save to folowing state
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
            
            if (userLoginStatus === "true"){
                if(data.includes(myData.uid)){
                    setFollowStatus(true);
                } else {
                    setFollowStatus(false);
                } 
            } else {
                setFollowStatus(false);
            }
    }
    
    
    // function when recipe clicked
	const lihatResep = (key) => {
        history.push(`/lihatresep/${key}`);
    }
    
    
    // function when follow / unfollow button clicked
	const onFollow = (userId) => {
        if(userLoginStatus === "true"){
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
                const myImportantData = {
                    namaLengkap: myData.namaLengkap,
                    email: myData.alamatEmail,
                    uid: myData.uid
                }
    
                const userImportantData = {
                    namaLengkap: userData.namaLengkap,
                    email: userData.alamatEmail,
                    uid: userData.uid
                }
    
                // add my uid to other user followers document
                Firebase.database()
                .ref(`users/${userData.uid}/followers/${myData.uid}/`)
                .set(myImportantData)
    
                // add other user uid to my following document
                Firebase.database()
                .ref(`users/${myData.uid}/following/${userData.uid}`)
                .set(userImportantData);
    
                // add my uid to followers state
                followers.push(myData.uid)
    
                // set followStatus state to true
                setFollowStatus(!followStatus)
            }
        } else {
            setMessage("Kamu harus masuk terlebih dahulu");
            setMessageType("error");
            setOpen(true)
        }
    }
    

	return(
		<div className='halamanakunlain-container'>
			<div className="halamanakunlain-userinfo">
                <div className="halamanakunlain-userinfo-name">
                    <div className="halamanakunlain-userinfo-name-img">
                        {userData.photo ? (<img src={userData.photo} alt=""/>) : (<i className='bx bxs-user'></i>)}
                    </div>
                    <p>{userData.namaLengkap}</p>
					<Button 
						className="ml-auto mr-auto" 
						variant={followStatus?"light":"light"}
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

            {/* when posts available */}
			{posts && (
            <div className="halamanakunlain-grid">
                {/* mapping posts */}
                {posts.map(recipe => (
                <div className="halamanakunlain-grid-item" key={recipe.id}>
                    {/* post card */}
                    <div className="halamanakunlain-grid-item-card">
                        <img onClick={() => lihatResep(recipe.id)} src={recipe.data.urlPhoto} />
                        <div className="halamanakunlain-grid-item-card-desc">
                            <h2 className="halamanakunlain-grid-item-card-desc-judul" onClick={() => lihatResep(recipe.id)}>{recipe.data.judul}</h2>
                            <p className="halamanakunlain-grid-item-card-desc-cerita">{recipe.data.cerita}</p>
                            <div className="halamanakunlain-grid-item-card-desc-info">
                                <div>
                                    <i className='bx bxs-time' ></i>
                                    <p>{recipe.data.waktu}</p>
                                </div>
                                {recipe.data.biaya && (
                                <div>
                                    <i className='bx bxs-dollar-circle'></i>
                                    <p>Rp. {recipe.data.biaya}K</p>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
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

            {/* snackbar */}
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={messageType}>
                    {message}
                </Alert>
            </Snackbar>
            {/* /snackbar */}
		</div>
	)
}

export default HalamanAkunLain;