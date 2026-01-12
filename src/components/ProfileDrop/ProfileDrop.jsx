import './ProfileDrop.css'
import { IconContext } from 'react-icons';
import { CgProfile } from "react-icons/cg";
import { TbLogout2 } from "react-icons/tb";
import { CiEdit, CiCircleAlert } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import { IoPersonAddOutline, IoPlayOutline, IoAlertCircle } from "react-icons/io5";

import { useEffect, useRef, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router';

function ProfileDrop() {
    const auth = useContext(AuthContext);
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const toggleOpen = () => {
        open ? setOpen(false) : setOpen(true)
    }
    const options = [  ];
    const ProfilePic = user.profilePic;
    
    const logout = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://libro-de-los-juegos-server.onrender.com/auth/logout', {
                method:'POST',
                headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                
            });
            if (!response.ok) {
                throw new Error("Failed");
            }
            // localStorage.removeItem("token");
            auth.setAccessToken(null);
            user.setUsername(null);
            user.setUserID(null);
            navigate('/');
        } 
        catch (error) {
            console.log(error);
        }
    }

    const [friendRequests,setFriendRequests] = useState([]);
    useEffect(() => {
        const getFriendRequests = async () => {
            try {
                const userID = user.userID;
                const response = await fetch(`https://libro-de-los-juegos-server.onrender.com/users/${userID}/friends/requests`, {
                    method:'GET',
                    headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                                "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                });
                const result = await response.json();
                setFriendRequests(result);
            } 
            catch (error) {
            
            }
        }
        getFriendRequests();
    }, [user])

    const [friends,setFriends] = useState([]);
    useEffect(() => {
        const getFriends = async () => {
            try {
                const userID = user.userID;
                const response = await fetch(`https://libro-de-los-juegos-server.onrender.com/users/${userID}/friends`, {
                    method:'GET',
                    headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                                "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                });
                const result = await response.json();
                setFriends(result);
            } 
            catch (error) {
            
            }
        }
        getFriends();
    }, [user])

    const [addingFriend, setAddingFriend] = useState(false);
    const toggleAddingFriend = () => {
        addingFriend ? setAddingFriend(false) : setAddingFriend(true)
    }
    const sendFriendRequest = async (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        try {
            const response = await fetch(`https://libro-de-los-juegos-server.onrender.com/users/${user.userID}/friends/requests`, {
                method:'POST',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({username}),
            });
            if (!response.ok) {
                throw new Error("Failed");
            }
        } 
        catch (error) {
            console.log(error)
        }
    }

    const [viewingFriends, setViewingFriends] = useState(false);
    const toggleViewingFriends = () => {
        viewingFriends ? setViewingFriends(false) : setViewingFriends(true)
    }
    const [viewingFriendRequests, setViewingFriendRequests] = useState(false);
    const toggleViewingFriendRequests = () => {
        viewingFriendRequests ? setViewingFriendRequests(false) : setViewingFriendRequests(true)
    }
    const [viewingInvites, setViewingInvites] = useState(false);
    const toggleViewingInvites = () => {
        viewingInvites ? setViewingInvites(false) : setViewingInvites(true)
    }

    const [invites,setInvites] = useState([]);
    useEffect(() => {
        const getInvites = async () => {
            try {
                const userID = user.userID;
                const response = await fetch(`https://libro-de-los-juegos-server.onrender.com/users/${userID}/`, {
                    method:'GET',
                    headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                                "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                });
                const result = await response.json();
                setInvites(result.invites);
            } 
            catch (error) {
            
            }
        }
        getInvites();
    }, [user])

    const acceptFriendRequest = async (id) => {
        const friendID = id;
        try {
            const response = await fetch(`https://libro-de-los-juegos-server.onrender.com/users/${user.userID}/friends/`, {
                method:'POST',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({friendID}),
            });
            if (!response.ok) {
                throw new Error("Failed");
            }
            
        } 
        catch (error) {
            console.log(error)
        }
    }

    const declineFriendRequest = async (id) => {
        const friendID = id;
        try {
            const response = await fetch(`https://libro-de-los-juegos-server.onrender.com/users/${user.userID}/friends/requests`, {
                method:'DELETE',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({friendID}),
            });
            if (!response.ok) {
                throw new Error("Failed");
            }
            
        } 
        catch (error) {
            console.log(error)
        }
    }

    // const [Icon, setIcon] = useState(CgProfile)
    return (
        <IconContext.Provider value={{className:'icon'}}>
            <div className='icon-holder'>
                <ProfilePic onClick={toggleOpen}></ProfilePic>
                {invites?.length || friendRequests?.length > 0 && <IoAlertCircle id='profile-alert' onClick={toggleOpen}></IoAlertCircle>}
                {open ? <div className='drop-options'>
                    <div className='drop-header'>
                        <ProfilePic></ProfilePic>
                        {`${user.username}`}</div>
                    <ul id='profiledrop-options'>
                        <li id='edit-profile'>
                            <CiEdit></CiEdit>
                            <span>Edit Profile</span>
                        </li>
                        <li id='view-invites'>
                            <IoPlayOutline></IoPlayOutline>
                            <span >
                                <span onClick={toggleViewingInvites}>Game Invites</span>
                                {invites?.length > 0 && <IoAlertCircle id='profile-alert'></IoAlertCircle>}
                                {viewingInvites && <ul>
                                    {invites?.length > 0 ? invites.map((invite) => {
                                    return <li className='friend-list-item' key={invite}>{invite.game} {invite.sender}
                                        {/* <button className='accept-button' onClick={() => {acceptFriendRequest(friendRequest._id)}}></button>
                                        <button className='decline-button'></button> */}
                                    </li>
                                }): <li className='empty-li'></li>}
                                </ul>}
                            </span>
                        </li>
                        <li id='view-friends'>
                            <GoPeople></GoPeople>
                            <span >
                                <span onClick={toggleViewingFriends}>Friends</span>
                                {viewingFriends 
                                && <ul>
                                    {friends?.length > 0 ? friends.map((friend) => {
                                    return <li className='friend-list-item' key={friend.username}>{friend.username}</li>
                                }) : <li className='empty-li'></li  >}
                                </ul>}
                            </span>
                        </li>
                        <li id='add-friend'>
                            <IoPersonAddOutline></IoPersonAddOutline>
                            <span >
                                <span onClick={toggleAddingFriend}>Add Friend</span>
                                {addingFriend 
                                    &&  <form className='flex-row' onSubmit={sendFriendRequest}>
                                            <label for="username"></label>
                                            <input type="text" id="username" name="username"></input>
                                            <button className='go-button'>Go</button>
                                        </form>}
                            </span>
                        </li>
                        <li id='view-friend-requests'>
                            <GoPeople></GoPeople>
                            <span >
                                <span onClick={toggleViewingFriendRequests}>Friend Requests</span>
                                {friendRequests?.length > 0 && <IoAlertCircle id='profile-alert'></IoAlertCircle>}
                                {viewingFriendRequests && <ul>
                                    {friendRequests?.length > 0 ? friendRequests.map((friendRequest) => {
                                    return <li className='friend-list-item' key={friendRequest.username}>{friendRequest.username}
                                        <button className='accept-button' onClick={() => {acceptFriendRequest(friendRequest._id)}}></button>
                                        <button className='decline-button'></button>
                                    </li>
                                }): <li className='empty-li'></li>}
                                </ul>}
                            </span>
                        </li>
                        <li onClick={logout}>
                            <TbLogout2></TbLogout2>
                            <span>Log Out</span>
                        </li>
                    </ul>
                </div> : []}
            </div>
            
            
        </IconContext.Provider>
    )
}

export default ProfileDrop