import './ProfileDrop.css'
import UserItem from '../UserItem/UserItem';
import { IconContext } from 'react-icons';
import { TbLogout2 } from "react-icons/tb";
import { CiEdit } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import { IoPersonAddOutline, IoPlayOutline, IoAlertCircle } from "react-icons/io5";
import { PiCheckerboardFill } from "react-icons/pi";
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Invite from '../Invite/Invite';
import { NOTIFICATION_TYPE } from '../../socket';

const API_URL = import.meta.env.VITE_API_URL;

function ProfileDrop() {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const user = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [addingFriend, setAddingFriend] = useState(false);
    const [viewingFriends, setViewingFriends] = useState(false);
    const [viewingFriendRequests, setViewingFriendRequests] = useState(false);
    const [viewingInvites, setViewingInvites] = useState(false);
    const [viewingActiveGames, setViewingActiveGames] = useState(false);

    const toggleOpen = () => {
        open ? setOpen(false) : setOpen(true)
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

    const logout = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/auth/logout`, {
                method:'POST',
                headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                
            });
            if (!response.ok) {
                const message = await response.json();
                toast.error(message.message, {autoClose: 2000});
                return;
            }
            auth.setAccessToken(null);
            user.setUsername(null);
            user.setUserID(null);
            navigate('/');
        } 
        catch (error) {
            toast.error(error.message, {autoClose: 2000});
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
                toast.error(message.message, {autoClose: 2000});
                return;
            }
            toggleAddingFriend();
            toast.success("Friend Request Sent!", {
            });
        } 
        catch (error) {
            toast.error(error.message, {autoClose: 2000});
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
                    return <Invite invite={invite} type={NOTIFICATION_TYPE.GAME_INVITE} onDone={() => {}}/>
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
                        return <Invite invite={friendRequest} type={NOTIFICATION_TYPE.FRIEND_REQUEST} onDone={() => {}}/>
                    }): <li className='empty-li'></li>}
                    </ul>}
                </span>
            </>
        )
    }

    return (
        <IconContext.Provider value={{className:'icon'}}>
            <div className='icon-holder profile-drop'>
                <button className='profile-pic-holder' onClick={toggleOpen}>
                    <img className='profile-pic' src={'https://libro-de-los-juegos-server.onrender.com/static' + user?.userData?.icon} alt="icon" />
                </button>
                
                {(user?.userData?.invites?.length || user?.userData?.friendRequests?.length > 0) && 
                    <IoAlertCircle id='profile-alert' onClick={toggleOpen}></IoAlertCircle>}
                {open ? <div className='drop-options animate-fade-in-up animate-delay-1'>
                    <div className='drop-header' onClick={() => {navigate(`/profile/${user.userID}`)}}>
                        <button className='profile-pic-holder' >
                            <img className='profile-pic' src={'https://libro-de-los-juegos-server.onrender.com/static' + user?.userData?.icon} alt="" />
                        </button>
                        {`${user.username}`}</div>
                    <ul id='profiledrop-options'>
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