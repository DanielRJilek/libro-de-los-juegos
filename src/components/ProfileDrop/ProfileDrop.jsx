import './ProfileDrop.css'
import { IconContext } from 'react-icons';
import { CgProfile } from "react-icons/cg";
import { TbLogout2 } from "react-icons/tb";
import { CiEdit, CiCircleAlert } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import { IoPersonAddOutline, IoPlayOutline, IoAlertCircle } from "react-icons/io5";
import { PiCheckerboardFill } from "react-icons/pi";
import { useEffect, useRef, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL;

function ProfileDrop() {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const user = useContext(UserContext);
    const [userData, setUserData] = useState();
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);
    const [addingFriend, setAddingFriend] = useState(false);
    const [viewingFriends, setViewingFriends] = useState(false);
    const [viewingFriendRequests, setViewingFriendRequests] = useState(false);
    const [viewingInvites, setViewingInvites] = useState(false);
    const [viewingActiveGames, setViewingActiveGames] = useState(false);
    const options = [  ];
    const ProfilePic = user.profilePic;

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

    useEffect(() => {
        if (user.userID != null) {
            getMyData();
        }
    }, [user])

    const getMyData = async () => {
        try {
            const response = await fetch(`${API_URL}/users/${user.userID}/private`, {
                method:'GET',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
            });
            if (!response.ok) {
                const message = await response.json();
                setError(message.message);
                return;
            }
            const result = await response.json();
            setUserData(result);
        } 
        catch (error) {
            console.log(error)
        }
    }

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
            getMyData();
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
                body: JSON.stringify({username: user.username}),
            });
            if (!response.ok) {
                const message = await response.json();
                setError(message.message);
                return;
            }
            console.log(`navigating to ${API_URL}/games/${invite.table.title}/table/${invite.table._id}`)
            navigate(`${API_URL}/games/${invite.table.title}/table/${invite.table._id}`)
        } 
        catch (error) {
            setError(error.message);
        }
    }

    const declineInvite = async (id) => {
        try {
            const response = await fetch(`${API_URL}/users/${user.userID}/invites`, {
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
            getMyData();
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
                className='game-list-item' key={game._id}>{game.title.charAt(0).toUpperCase() + game.title.slice(1)} {' with '} 
                {otherPlayers.map((player) => player.username).join(', ')}</li>
        }
        else {
            const otherPlayers = game.players.filter((player) => player.username != user.username);
            if (otherPlayers.length == 0) {
                return <li onClick={() => 
                    {navigate(`${API_URL}/games/${game.title}/table/${game._id}/`)}}
                    className='game-list-item' key={game._id}>{game.title.charAt(0).toUpperCase() + game.title.slice(1)} {' lobby (empty)'}</li>
            }

            return <li onClick={() => 
                {navigate(`${API_URL}/games/${game.title}/table/${game._id}/`)}}
                className='game-list-item' key={game._id}>{game.title.charAt(0).toUpperCase() + game.title.slice(1)} {' lobby with '}   
                {otherPlayers.map((player) => player.username).join(', ')}</li>
        }
    }

    // const [Icon, setIcon] = useState(CgProfile)
    return (
        <IconContext.Provider value={{className:'icon'}}>
            <div className='icon-holder'>
                <ProfilePic onClick={toggleOpen}></ProfilePic>
                
                {(userData?.invites?.length || userData?.friendRequests?.length > 0) && 
                    <IoAlertCircle id='profile-alert' onClick={toggleOpen}></IoAlertCircle>}
                {open ? <div className='drop-options'>
                    <div className='drop-header'>
                        <ProfilePic></ProfilePic>
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
                        <li id='edit-profile'>
                            <CiEdit></CiEdit>
                            <span>Edit Profile</span>
                        </li>
                        <li id='view-invites'>
                            <IoPlayOutline></IoPlayOutline>
                            <span>
                                <span onClick={toggleViewingInvites}>Game Invites</span>
                                {userData?.invites?.length > 0 && <IoAlertCircle id='profile-alert'></IoAlertCircle>}
                                {viewingInvites && <ul>
                                    {userData?.invites?.length > 0 ? userData.invites.map((invite) => {
                                        console.log(invite);
                                    return <li className='friend-list-item' key={invite.id}> 
                                        {invite.sender.username} invites you to play {invite.table.title.charAt(0).toUpperCase() + invite.table.title.slice(1)}
                                        <button className='accept-button' onClick={() => 
                                            {acceptInvite(invite)}}>
                                        </button>
                                        <button className='decline-button' onClick={() => 
                                            {declineInvite(invite)}}>
                                        </button>
                                    </li>
                                }): <li className='empty-li'></li>}
                                </ul>}
                            </span>
                        </li>
                        <li id='view-active-games'>
                            <PiCheckerboardFill/>
                            <span>
                                <span onClick={toggleViewingActiveGames}>Active Games</span>
                                {viewingActiveGames 
                                    && <ul>
                                        {userData?.activeGames?.length > 0 ? userData.activeGames.map((game) => {
                                            return displayActiveGame(game);
                                        }) : <li className='empty-li'></li  >}
                                    </ul>}
                            </span>
                            
                        </li>
                        <li id='view-friends'>
                            <GoPeople></GoPeople>
                            <span >
                                <span onClick={toggleViewingFriends}>Friends</span>
                                {viewingFriends 
                                && <ul>
                                    {userData?.friends?.length > 0 ? userData.friends.map((friend) => {
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
                                {userData?.friendRequests?.length > 0 && <IoAlertCircle id='profile-alert'></IoAlertCircle>}
                                {viewingFriendRequests && <ul>
                                    {userData?.friendRequests?.length > 0 ? userData.friendRequests.map((friendRequest) => {
                                    return <li className='friend-list-item' key={friendRequest.username}>{friendRequest.username}
                                        <button className='accept-button' onClick={() => 
                                            {acceptFriendRequest(friendRequest._id)}}></button>
                                        <button className='decline-button' onClick={() => 
                                            {declineFriendRequest(friendRequest._id)}}></button>
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