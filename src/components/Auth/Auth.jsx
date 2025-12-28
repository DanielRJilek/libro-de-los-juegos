import { useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import LogIn from "../LogIn/LogIn";
import ProfileDrop from "../ProfileDrop/ProfileDrop";



function Auth() {
    const user = useContext(AuthContext);
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
            // const code = await response.text();
            user.setUser(null);
            // navigate('/MainMenu');
        } 
        catch (error) {
            console.log(error);
        }
    }
    return (
        user.user ? <ProfileDrop></ProfileDrop> : <button onClick={() => {navigate('/login')}}>Log In</button>
    )
}

export default Auth