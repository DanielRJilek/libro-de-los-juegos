import { useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import ProfileDrop from "../ProfileDrop/ProfileDrop";
import { UserContext } from "../../context/UserContext";
const API_URL = import.meta.env.VITE_API_URL;

function Auth() {
    const auth = useContext(AuthContext);
    const user = useContext(UserContext)
    const navigate = useNavigate();
    
    return (
        (auth.accessToken && auth.accessToken != null && user.userID && user.userID != null) ? 
            <ProfileDrop></ProfileDrop> : <button onClick={() => {navigate('/login')}}>Log In</button>
    )
}

export default Auth