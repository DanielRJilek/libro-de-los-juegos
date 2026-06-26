import './Invite.css';
import { UserContext } from '../../context/UserContext';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { NOTIFICATION_TYPE } from '../../socket';
import { GoCheck } from 'react-icons/go';
import { IoClose } from 'react-icons/io5';
const API_URL = import.meta.env.VITE_API_URL;

function Invite({invite, type, onDone}) {
    const user = useContext(UserContext);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const isFriendRequest = type === NOTIFICATION_TYPE.FRIEND_REQUEST;

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
                toast.error(message.message, {autoClose: 2000});
                return;
            }
            user.fetchPrivateData();
            toast.success("Friend Request Accepted!", {
            });            
        } 
        catch (error) {
            toast.error(error.message, {autoClose: 2000});
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
                toast.error(message.message, {autoClose: 2000});
                return;
            }
            user.fetchPrivateData();
            toast.error("Friend Request Declined!", {autoClose: 2000});
        } 
        catch (error) {
            toast.error(error.message, {autoClose: 2000});
        }
    }

    const acceptInvite = async (invite) => {
        try {
            const response = await fetch(`${API_URL}/games/${invite.table.title}/table/${invite.table._id}/players`, {
                method:'POST',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({username: user.userData.username}),
            });
            if (!response.ok) {
                const message = await response.json();
                toast.error(message.message, {autoClose: 2000});
                return;
            }
            user.fetchPrivateData();
            navigate(`${API_URL}/games/${invite.table.title}/table/${invite.table._id}`)
        } 
        catch (error) {
            toast.error(error.message, {autoClose: 2000});
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
                toast.error(message.message, {autoClose: 2000});
                return;
            }
            user.fetchPrivateData();
        }
        catch (error) {
            toast.error(error.message, {autoClose: 2000});
        }
    }

    const handleAccept = () => {
        if (isFriendRequest) acceptFriendRequest(invite._id);
        else acceptInvite(invite);
        onDone();
    };
    const handleDecline = () => {
        if (isFriendRequest) declineFriendRequest(invite._id);
        else declineInvite(invite);
        onDone();
    };

    return (
        <li className='user-item' key={invite.id}> 
            <span className='capitalize'>
                {isFriendRequest ? `${invite.username} wants to be your friend` : 
                `${invite.sender.username} invites you to play ${invite.table.title}`}
            </span>
            <div className='accept-decline-holder'>
                <div className='accept-button'>
                    <GoCheck onClick={handleAccept}></GoCheck>
                </div>
                
                <div className='decline-button'>
                    <IoClose onClick={handleDecline}>
                    </IoClose>
                </div>
            </div>
        </li>
    )
}

export default Invite;