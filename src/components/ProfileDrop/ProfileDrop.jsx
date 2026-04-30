import './ProfileDrop.css'
import { IconContext } from 'react-icons';
import { CgProfile } from "react-icons/cg";
import { TbLogout2 } from "react-icons/tb";
import { CiEdit, CiCircleAlert } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import { IoPersonAddOutline, IoPlayOutline, IoAlertCircle } from "react-icons/io5";
import { PiCheckerboardFill } from "react-icons/pi";
import { GoCheck } from "react-icons/go";
import { IoClose } from "react-icons/io5";

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import UserItem from '../UserItem/UserItem';

const API_URL = import.meta.env.VITE_API_URL;

function ProfileDrop() {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const user = useContext(UserContext);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);
    const [addingFriend, setAddingFriend] = useState(false);
    const [viewingFriends, setViewingFriends] = useState(false);
    const [viewingFriendRequests, setViewingFriendRequests] = useState(false);
    const [viewingInvites, setViewingInvites] = useState(false);
    const [viewingActiveGames, setViewingActiveGames] = useState(false);
    const options = [  ];

    const toggleOpen = () => {
        open ? setOpen(false) : setOpen(true)
        setError();
    }
    const toggleAddingFriend = () => {
        addingFriend ? setAddingFriend(false) : setAddingFriend(true)
    }
    const toggleViewingFriends = () => {
        viewingFriends ? setViewingFriends(false) : setViewingFriends(true)
    }
    const toggleViewingFriendRequests = () => {
        viewingFriendRequests ? setViewingFriendRequests(false) : setViewingFriendRequests(true)
    }
    const toggleViewingInvites = () => {
        viewingInvites ? setViewingInvites(false) : setViewingInvites(true)
    }
    const toggleViewingActiveGames = () => {
        viewingActiveGames ? setViewingActiveGames(false) : setViewingActiveGames(true)
    }
    
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error])

    const logout = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/auth/logout`, {
                method:'POST',
                headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                
            });
            if (!response.ok) {
                const message = await response.json();
                setError(message.message);
                return;
            }
            auth.setAccessToken(null);
            user.setUsername(null);
            user.setUserID(null);
            navigate('/');
        } 
        catch (error) {
            console.log(error);
        }
    }

    const sendFriendRequest = async (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        try {
            const response = await fetch(`${API_URL}/users/${user.userID}/friends/requests`, {
                method:'POST',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({username}),
            });
            if (!response.ok) {
                const message = await response.json();
                setError(message.message);
                return;
            }
            toggleAddingFriend();
            toast.success("Friend Request Sent!", {
            });
        } 
        catch (error) {
            console.log(error)
        }
    }

    const acceptFriendRequest = async (id) => {
        const friendID = id;
        try {
            const response = await fetch(`${API_URL}/users/${user.userID}/friends/`, {
                method:'POST',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({friendID}),
            });
            if (!response.ok) {
                const message = await response.json();
                setError(message.message);
                return;
            }
            user.fetchPrivateData();
            toast.success("Friend Request Accepted!", {
            });            
        } 
        catch (error) {
            console.log(error)
        }
    }

    const declineFriendRequest = async (id) => {
        const friendID = id;
        try {
            const response = await fetch(`${API_URL}/users/${user.userID}/friends/requests`, {
                method:'DELETE',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({friendID}),
            });
            if (!response.ok) {
                const message = await response.json();
                setError(message.message);
                return;
            }
            user.fetchPrivateData();
            toast.update({render: "Friend Request Declined!", type: toast.TYPE.ERROR, autoClose: 3000});
        } 
        catch (error) {
            console.log(error)
        }
    }

    const acceptInvite = async (invite) => {
        try {
            console.log(invite);
            const response = await fetch(`${API_URL}/games/${invite.table.title}/table/${invite.table._id}/players`, {
                method:'POST',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({username: user.userData.username}),
            });
            if (!response.ok) {
                const message = await response.json();
                setError(message.message);
                return;
            }
            console.log(`navigating to ${API_URL}/games/${invite.table.title}/table/${invite.table._id}`);
            user.fetchPrivateData();
            navigate(`${API_URL}/games/${invite.table.title}/table/${invite.table._id}`)
        } 
        catch (error) {
            setError(error.message);
        }
    }

    const declineInvite = async (id) => {
        try {
            const response = await fetch(`${API_URL}/users/${user.userID}/friends/invites`, {
                method:'DELETE',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({inviteID: id}),
            });
            if (!response.ok) {
                const message = await response.json();
                setError(message.message);
                return;
            }
            user.fetchPrivateData();
        }
        catch (error) {
            console.log(error)
        }
    }

    const displayActiveGame = (game) => {
        if (game.started) {
            const otherPlayers = game.players.filter((player) => player.username != user.username);
            return <li onClick={() => 
                {navigate(`${API_URL}/games/${game.title}/table/${game._id}/play`)}} 
                className='game-list-item' key={game._id}>
                    <span className='capitalize'>{game.title}</span> {' with '} 
                {otherPlayers.map((player) => player.username).join(', ')}</li>
        }
        else {
            const otherPlayers = game.players.filter((player) => player.username != user.username);
            if (otherPlayers.length == 0) {
                return <li onClick={() => 
                    {navigate(`${API_URL}/games/${game.title}/table/${game._id}/`)}}
                    className='game-list-item' key={game._id}>
                        <span className='capitalize'>{game.title}</span> {' lobby (empty)'}</li>
            }

            return <li onClick={() => 
                {navigate(`${API_URL}/games/${game.title}/table/${game._id}/`)}}
                
                className='game-list-item' key={game._id}>
                    <span className='capitalize'>{game.title}</span> {' lobby with '}   
                {otherPlayers.map((player) => player.username).join(', ')}
                </li>
        }
    }

    const viewInvites = () => {
        return (
        <>
            <IoPlayOutline className='li-icon'></IoPlayOutline>
            <span>
                <span onClick={toggleViewingInvites}>Game Invites</span>
                {user?.userData?.invites?.length > 0 && <IoAlertCircle id='profile-alert'></IoAlertCircle>}
                {viewingInvites && <ul>
                    {user?.userData?.invites?.length > 0 ? user?.userData.invites.map((invite) => {
                        console.log(invite);
                    return <li className='user-item' key={invite.id}> 
                        <span className='capitalize'>{invite.sender.username} invites you to play {invite.table.title}</span>
                        <div className='accept-decline-holder'>
                            <div className='accept-button'>
                                <GoCheck onClick={() => 
                                {acceptInvite(invite)}}></GoCheck>
                            </div>
                            
                            <div className='decline-button'>
                                <IoClose onClick={() => 
                                {declineInvite(invite)}}>
                                </IoClose>
                            </div>
                        </div>
                        
                        
                    </li>
                }): <li className='empty-li'></li>}
                </ul>}
            </span>
        </>
        )
    }
    
    const viewActiveGames = () => {
        return (
            <>
                <PiCheckerboardFill className='li-icon'/>
                <span>
                    <span onClick={toggleViewingActiveGames}>Active Games</span>
                    {viewingActiveGames 
                        && <ul>
                            {user?.userData?.activeGames?.length > 0 ? user?.userData.activeGames.map((game) => {
                                return displayActiveGame(game);
                            }) : <li className='empty-li'></li  >}
                        </ul>}
                </span>
            </>
        )
    }

    const viewFriends = () => {
        return (
            <>
                <GoPeople className='li-icon'></GoPeople>
                <span >
                    <span onClick={toggleViewingFriends}>Friends</span>
                    {viewingFriends 
                    && <ul>
                        {user?.userData?.friends?.length > 0 ? user?.userData.friends.map((friend) => {
                        return <li className='friend-list-item' key={friend.username}>
                            <UserItem user={friend}></UserItem>
                        </li>
                    }) : <li className='empty-li'></li  >}
                    </ul>}
                </span>
            </>
        )
    }

    const addFriend = () => {
        return (
            <>
                <IoPersonAddOutline className='li-icon'></IoPersonAddOutline>
                <span>
                    <span onClick={toggleAddingFriend}>Add Friend</span>
                    {addingFriend 
                        &&  <form className='flex-row' onSubmit={sendFriendRequest}>
                                <label for="username"></label>
                                <input type="text" id="username" name="username"></input>
                                <button className='go-button'>Go</button>
                            </form>}
                </span>
            </>
        )
    }

    const viewFriendRequests = () => {
        return (
            <>
                <GoPeople className='li-icon'></GoPeople>
                <span >
                    <span onClick={toggleViewingFriendRequests}>Friend Requests</span>
                    {user?.userData?.friendRequests?.length > 0 && <IoAlertCircle id='profile-alert'></IoAlertCircle>}
                    {viewingFriendRequests && <ul>
                        {user?.userData?.friendRequests?.length > 0 ? user?.userData.friendRequests.map((friendRequest) => {
                        return <li className='friend-list-item' key={friendRequest.username}>{friendRequest.username}
                        <div className='accept-decline-holder'>
                            <div className='accept-button'>
                                <GoCheck onClick={() => 
                                {acceptFriendRequest(friendRequest._id)}}>
                                </GoCheck>
                            </div>
                            <div className='decline-button'>
                                <IoClose onClick={() => 
                                {declineFriendRequest(friendRequest._id)}}>
                                </IoClose>
                            </div>
                        </div>
                            
                            
                        </li>
                    }): <li className='empty-li'></li>}
                    </ul>}
                </span>
            </>
        )
    }

    return (
        <IconContext.Provider value={{className:'icon'}}>
            <div className='icon-holder'>
                <button className='profile-pic-holder' onClick={toggleOpen}>
                    <img className='profile-pic' src={'https://libro-de-los-juegos-server.onrender.com/static' + user?.userData?.icon} alt="icon" />
                </button>
                
                {(user?.userData?.invites?.length || user?.userData?.friendRequests?.length > 0) && 
                    <IoAlertCircle id='profile-alert' onClick={toggleOpen}></IoAlertCircle>}
                {open ? <div className='drop-options'>
                    <div className='drop-header' onClick={() => {navigate(`/profile/${user.userID}`)}}>
                        <button className='profile-pic-holder' >
                            <img className='profile-pic' src={'https://libro-de-los-juegos-server.onrender.com/static' + user?.userData?.icon} alt="" />
                        </button>
                        {`${user.username}`}</div>
                    <ul id='profiledrop-options'>
                        <div className='error'>
                            {(error && error != null) ? 
                                <IconContext.Provider value={{className:'icon'}}>
                                    <IoAlertCircle ></IoAlertCircle>
                                    {error}
                                </IconContext.Provider>
                                : ''}  
                        </div>
                        <li id='edit-profile' onClick={() => navigate(`/profile/${user.userID}/edit`)}>
                            <CiEdit className='li-icon'></CiEdit>
                            <span>Edit Profile</span>
                        </li>
                        <li id='view-invites'>
                            {viewInvites()}
                        </li>
                        <li id='view-active-games'>
                            {viewActiveGames()}
                        </li>
                        <li id='view-friends'>
                            {viewFriends()}
                        </li>
                        <li id='add-friend'>
                            {addFriend()}
                        </li>
                        <li id='view-friend-requests'>
                            {viewFriendRequests()}
                        </li>
                        <li onClick={logout}>
                            <TbLogout2 className='li-icon'></TbLogout2>
                            <span>Log Out</span>
                        </li>
                    </ul>
                </div> : []}
            </div>
        </IconContext.Provider>
    )
}

export default ProfileDrop