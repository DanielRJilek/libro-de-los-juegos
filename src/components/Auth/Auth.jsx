import { useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import LogIn from "../LogIn/LogIn";
import ProfileDrop from "../ProfileDrop/ProfileDrop";
import { UserContext } from "../../context/UserContext";



function Auth() {
    const auth = useContext(AuthContext);
    const user = useContext(UserContext)
    const navigate = useNavigate();

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
            localStorage.removeItem("token");
            navigate('/');
        } 
        catch (error) {
            console.log(error);
        }
    }
    return (
        auth.accessToken ? <ProfileDrop></ProfileDrop> : <button onClick={() => {navigate('/login')}}>Log In</button>
    )
}

export default Auth