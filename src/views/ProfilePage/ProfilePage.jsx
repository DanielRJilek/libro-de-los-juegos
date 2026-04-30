const API_URL = import.meta.env.VITE_API_URL;
import { useContext, useState, useEffect, use } from "react";
import { UserContext } from "../../context/UserContext";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import 'react-toastify/dist/ReactToastify.css';
import "./ProfilePage.css";

function ProfilePage() {
    const params = useParams();
    const navigate = useNavigate();
    const user = useContext(UserContext);
    const auth = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [ownProfile, setOwnProfile] = useState(false);
    const { instance } = useParams();

    useEffect(() => {
        if (error) {
            toast.error(error, {});
            const timer = setTimeout(() => {
                setError(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error])

    useEffect(() => {
        setLoading(true);
        setProfileData(null);
        if (instance) {
            getUserData();
        }
        
    }, [instance]);

    const getUserData = async () => {
        console.log(user.userID, instance);
        if (user.userID === instance) {
            setOwnProfile(true);
            setProfileData(user.userData);
            setLoading(false);
        }
        else {
            setOwnProfile(false);
            try {
                const response = await fetch(`${API_URL}/users/${instance}`, {
                    // mode: "cors",
                    method:'GET',
                    headers: {  'Authorization': `Bearer ${localStorage.getItem("token")}`,
                                "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" }, 
                });
                const data = await response.json();
                setProfileData(data);
                setLoading(false);
            }     
            catch (error) {
                console.log(error);
            }
        }
    }

    const displayFriends = () => {
        return (
            <span >
                <h2>Friends</h2>
                    {<ul>
                        {user?.userData?.friends?.length > 0 ? user?.userData.friends.map((friend) => {
                        return <li className='friend-list-item' key={friend.username} onClick={() => navigate(`/profile/${friend._id}`)}>
                            <img className="profile-pic" src={'https://libro-de-los-juegos-server.onrender.com/static' + friend.icon} alt="icon" />
                            {friend.username}</li>
                    }) : <li className='empty-li'></li  >}
                </ul>}
            </span>
        )
    }

    return (
        loading ? <ClipLoader color="#36d7b7" /> :
        <div className="profile">
            <div className="profile-header">
                <div className="profile-pic-holder">
                    <img className="profile-pic" src={'https://libro-de-los-juegos-server.onrender.com/static' + profileData?.icon} alt="icon" />
                </div>
                <h1>{profileData?.username}</h1>
                {ownProfile && <CiEdit className="edit-profile" onClick={() => navigate(`/profile/${user.userID}/edit`)}/>}

            </div>
            <div className="profile-content">
                {ownProfile? displayFriends() : <h2>Friends: {profileData?.friendCount}</h2>}
            </div>
        </div>
    );
}

export default ProfilePage;