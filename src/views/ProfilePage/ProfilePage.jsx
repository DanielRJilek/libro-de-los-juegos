import { useContext, useState, useEffect} from "react";
import { UserContext } from "../../context/UserContext";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import 'react-toastify/dist/ReactToastify.css';
import "./ProfilePage.css";

const API_URL = import.meta.env.VITE_API_URL;

function ProfilePage({edit=false}) {
    const params = useParams();
    const navigate = useNavigate();
    const user = useContext(UserContext);
    const auth = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [ownProfile, setOwnProfile] = useState(false);
    const { instance } = useParams();
    const [editingIcon, setEditingIcon] = useState(false);
    const [editingUsername, setEditingUsername] = useState(false);
    const [icons, setIcons] = useState([]);

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

    useEffect(() => {
        setLoading(true);
        setProfileData(null);
        if (instance) {
            getUserData();
        }
        
    }, []);

    const getUserData = async () => {
        console.log(user.userID, instance);
        if (user.userID === instance) {
            setOwnProfile(true);
            try {
                const response = await fetch(`${API_URL}/users/${instance}`, {
                    // mode: "cors",
                    method:'GET',
                    headers: {  'Authorization': `Bearer ${localStorage.getItem("token")}`,
                                "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" }, 
                });
                const data = await response.json();
                setProfileData(data);
                user.fetchPrivateData();
                setLoading(false);
            } catch (error) {
                console.log(error);
            }

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

    const getIcons = async () => {
        if (icons.length === 0) {
            const response = await fetch(`${API_URL}/users/icons`, {
                    method:'GET',
                    headers: {  'Authorization': `Bearer ${localStorage.getItem("token")}`,
                                "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                });
            const data = await response.json();
            setIcons(data);
        }
    }

    const toggleEditingIcon = () => {
        if (editingIcon) {
            setEditingIcon(false);
        }
        else {
            getIcons();
            setEditingIcon(true);
        }
    }

    const updateIcon = async (path) => {
        try {
            const response = await fetch(`${API_URL}/users/${user.userID}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ icon: path })
            });
            const data = await response.json();
            setProfileData(data);
            await getUserData();
            toast.success("Icon updated successfully", {});
            setEditingIcon(false);

        } catch (error) {
            toast.error("Error updating icon", {});
        }
        
    };

    const editIcon = () => {
        return (
            <>
                
                {editingIcon && (
                    <div className="icon-options">
                        {icons.map((icon) => (
                            <img key={icon._id} src={'https://libro-de-los-juegos-server.onrender.com/static' + icon.path} alt="icon" onClick={() => updateIcon(icon.path)} />
                        ))}
                    </div>
                )}
            </>
            )       
    }

    const editUsername = () => {
        return (<>
            <CiEdit className="edit-profile-icon"/>
        </>
        )
    }

    if (edit) {
        return (
            loading ? <ClipLoader color="#36d7b7" /> :
            <div className="profile">
                <div className="profile-header">
                    
                    <div className="profile-pic-holder">
                        
                        <CiEdit className="edit-profile-icon" onClick={() => toggleEditingIcon()}/>
                        <img className="profile-pic" src={'https://libro-de-los-juegos-server.onrender.com/static' + profileData?.icon} alt="icon" />
                        
                    </div>
                    
                    
                    <h1>{profileData?.username}</h1>
                    {/* {ownProfile && editUsername() } */}
                    

                </div>
                {ownProfile &&  editIcon()}
                <div className="profile-content">
                    {ownProfile? displayFriends() : <h2>Friends: {profileData?.friendCount}</h2>}
                </div>
            </div>
        );
    }

    return (
        loading ? <ClipLoader color="#36d7b7" /> :
        <div className="profile">
            <div className="profile-header">
                <div className="profile-pic-holder">
                    <img className="profile-pic" src={'https://libro-de-los-juegos-server.onrender.com/static' + profileData?.icon} alt="icon" />
                </div>
                <h1>{profileData?.username}</h1>
            </div>
            <div className="profile-content">
                {ownProfile? displayFriends() : <h2>Friends: {profileData?.friendCount}</h2>}
            </div>
        </div>
    );
}

export default ProfilePage;