import './LogIn.css'
import {useNavigate} from 'react-router'
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { CgProfile } from "react-icons/cg";

function LogIn() {
    const auth = useContext(AuthContext);
    const user = useContext(UserContext)
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        const password = e.target[1].value;

        try {
            const response = await fetch('https://libro-de-los-juegos-server.onrender.com/auth/login', {
                method:'POST',
                headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({username, password}),
            });
            // console.log(`response.body: ${response.body}`)
            if (!response.ok) {
                throw new Error("Failed");
            }
            // const code = await response.text();
            const {id, token} = await response.json();
            // console.log(id);
            // console.log(token);
            // console.log(response.body)
            // console.log(id);
            user.setUsername(username);
            user.setUserID(id.toString());
            // console.log(user.userID);
            auth.setAccessToken(token);
            navigate(window.history.back(1));
        } 
        catch (error) {
            console.log(error)
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <label for="username">Username</label>
            <input type="text" id="username" name="username"></input>
            <label for="password">Password</label>
            <input type="password" id="password" name="password"></input>
            <button type="submit">Log In</button>
            <a href='/signup'>Create Account</a>
        </form>
    )
}

export default LogIn