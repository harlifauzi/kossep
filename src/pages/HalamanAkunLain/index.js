import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Firebase } from '../../config';
import { Button } from "react-bootstrap";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { RecipeCard } from '../../components';
import { useSelector } from 'react-redux';

// <snackbar function>
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
// </snackbar function>

const HalamanAkunLain = () => {
	const params = useParams();
    const history = useHistory();
    const { loginStatus, dataUser } = useSelector(state => state);

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

        document.title = `Kossep | Profil`

    }, [])
    

    // order other user's posts data and save to posts state
	const orderDataPosts = (items) => {
        const data=[]

        items.forEach((item) => {
            const oldData = item.val();
            data.unshift(oldData);
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
            
            if ( loginStatus ){
                if(data.includes(dataUser.uid)){
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
        if( loginStatus ){
            if(followers.includes(dataUser.uid)){

                // remove my uid on other user followers document
                Firebase.database()
                .ref(`users/${userData.uid}/followers/${dataUser.uid}/`)
                .remove();
    
                // remove other user uid on my following document
                Firebase.database()
                .ref(`users/${dataUser.uid}/following/${userData.uid}/`)
                .remove();
    
                // define my uid position on followers state
                const position = followers.indexOf(dataUser.uid)
    
                // remove my uid on followers state base on position const
                followers.splice(position, 1)
    
                // set followStatus state to false
                setFollowStatus(!followStatus);
    
            } else {
                const myImportantData = {
                    namaLengkap: dataUser.namaLengkap,
                    email: dataUser.alamatEmail,
                    uid: dataUser.uid
                }
    
                const userImportantData = {
                    namaLengkap: userData.namaLengkap,
                    email: userData.alamatEmail,
                    uid: userData.uid
                }
    
                // add my uid to other user followers document
                Firebase.database()
                .ref(`users/${userData.uid}/followers/${dataUser.uid}/`)
                .set(myImportantData)
    
                // add other user uid to my following document
                Firebase.database()
                .ref(`users/${dataUser.uid}/following/${userData.uid}`)
                .set(userImportantData);
    
                // add my uid to followers state
                followers.push(dataUser.uid)
    
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
                <RecipeCard recipe={recipe} lihatResep={lihatResep} type='profile' />
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