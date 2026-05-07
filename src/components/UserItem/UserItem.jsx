import './UserItem.css';
import { useNavigate } from 'react-router';

function UserItem({user, children=null, className=null}) {
    const navigate = useNavigate();
    return (
            <div className={`user-item ${className}`}>
                <img className='profile-pic' src={'https://libro-de-los-juegos-server.onrender.com/static' + user?.icon} alt="icon" />
                {<span onClick={() => navigate(`/profile/${user._id}`)}>{user?.username}</span>}
                {children}
            </div>
    )
}

export default UserItem;