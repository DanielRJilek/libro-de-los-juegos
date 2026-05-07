import { useContext, useState, useEffect} from "react";
import { UserContext } from "../../context/UserContext";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import UserItem from "../../components/UserItem/UserItem"
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
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
    const [removeFriendModalOpen, setRemoveFriendModalOpen] = useState(false);
    const isFriend = !ownProfile && user?.userData?.friends?.some((friend) => friend._id === instance);

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
            try {
                const response = await fetch(`${API_URL}/users/${instance}`, {
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
            <div className="profile-friends">
                <span>Friends: {profileData?.friendCount}</span>
                    {<ul>
                        {user?.userData?.friends?.length > 0 ? user?.userData.friends.map((friend) => {
                        return <UserItem user={friend}></UserItem>
                    }) : <li className='empty-li'></li  >}
                </ul>}
            </div>
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

    const removeFriend = async () => {
        if (!instance) return;
        try {
            const response = await fetch(`${API_URL}/users/${user.userID}/friends/`, {
                method:'DELETE',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({friendID: instance}),
            });
            if (!response.ok) {
                const message = await response.json();
                setError(message.message || "Failed to remove friend.");
                return;
            }
            user.fetchPrivateData();
            toast.success("Friend removed.", {});
            navigate(`/profile/${instance}`);
        } catch (error) {
            setError(error.message);
        } finally {
            setRemoveFriendModalOpen(false);
        }
    }

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
            <div className="profile animate-fade-in-up">
                <div className="profile-header">
                    <div className="profile-pic-holder">
                        <CiEdit className="edit-profile-icon" onClick={() => toggleEditingIcon()}/>
                        <img className="profile-pic" src={'https://libro-de-los-juegos-server.onrender.com/static' + profileData?.icon} alt="icon" />
                    </div>
                    <h1>{profileData?.username}</h1>                   
                </div>
                {ownProfile &&  editIcon()}
                <div className="profile-content">
                    <span>Member since: {new Date(profileData?.memberSince).toLocaleDateString()}</span>
                    {/* <span>Last online: {new Date(profileData?.lastOnline).toLocaleDateString()}</span> */}
                    <span>Wins: {profileData?.gamesWon}</span>
                    <span>Games played: {profileData?.gamesPlayed}</span>
                    {ownProfile? displayFriends() : <span>Friends: {profileData?.friendCount}</span>}
                </div>
            </div>
        );
    }

    return (
        loading ? <ClipLoader color="#36d7b7" /> :
        <div className="profile animate-fade-in-up">
            <div className="profile-header">
                <div className="profile-pic-holder">
                    <img className="profile-pic" src={'https://libro-de-los-juegos-server.onrender.com/static' + profileData?.icon} alt="icon" />
                </div>
                <h1>{profileData?.username}</h1>
            </div>
            {isFriend && (
                <div className="profile-actions">
                    <button type="button" onClick={() => setRemoveFriendModalOpen(true)}>Remove Friend</button>
                </div>
            )}
            <div className="profile-content">
                <span>Member since: {new Date(profileData?.memberSince).toLocaleDateString()}</span>
                {/* <span>Last online: {new Date(profileData?.lastOnline).toLocaleDateString()}</span> */}
                <span>Wins: {profileData?.gamesWon}</span>
                <span>Games played: {profileData?.gamesPlayed}</span>
                {ownProfile? displayFriends() : <span>Friends: {profileData?.friendCount}</span>}
            </div>
            <ConfirmModal
                open={removeFriendModalOpen}
                onClose={() => setRemoveFriendModalOpen(false)}
                title="Remove this friend?"
                message={`This will remove ${profileData?.username} from your friends list.`}
                onConfirm={removeFriend}
                confirmLabel="Remove friend"
                pendingConfirmLabel="Removing…"
                cancelLabel="Cancel"
                variant="danger"
            />
        </div>
    );
}

export default ProfilePage;