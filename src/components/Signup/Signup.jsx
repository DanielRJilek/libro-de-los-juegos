import {useNavigate} from 'react-router'
import { AuthContext } from '../../context/AuthContext';
import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { ClipLoader } from "react-spinners";
import { IconContext } from 'react-icons';
import { IoAlertCircle } from "react-icons/io5";
import '../LogIn/LogIn.css';
const API_URL = import.meta.env.VITE_API_URL;

function SignUp() {
    const navigate = useNavigate();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const auth = useContext(AuthContext);
    const user = useContext(UserContext)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        const password1 = e.target[1].value;
        const password2 = e.target[2].value;
        console.log(username, password1, password2);
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/users`, {
                // mode: "cors",
                method:'POST',
                headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({username, password1, password2}),
            });
            if (!response.ok) {
                const message = await response.json();
                setError(message.message);
                return;
            }


            const response2 = await fetch('https://libro-de-los-juegos-server.onrender.com/auth/login', {
                method:'POST',
                headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({username, password1}),
            });
            if (!response2.ok) {
                throw new Error("Failed");
            }
            // const code = await response.text();
            user.setUsername(username);
            // auth.setAccessToken(response2.body);
            const {id, token} = await response2.json();
            auth.setAccessToken(token);
            // localStorage.setItem("token", JSON.stringify(token));
            navigate('/games');
        } 
        catch (error) {
            console.log(error)
        }
    }
    return (
        <form className='login-form' onSubmit={handleSubmit}>
            <label for="username">Username</label>
            <input className='login-input' type="text" id="username" name="username"></input>
            <label for="password">Password</label>
            <input className='login-input' type="password" id="password" name="password"></input>
            <label for="confirm-password">Confirm Password</label>
            <input className='login-input' type="password" id="confirm-password" name="confirm-password"></input>
            <button type="submit">Create an account</button>
            <div>
                <span>Already have an account? </span>
                <a href='/login'>Login</a>
            </div>
            
            <div className='error'>
                {(error && error != null) ? 
                <IconContext.Provider value={{className:'icon'}}>
                    <IoAlertCircle ></IoAlertCircle>
                    {error}
                </IconContext.Provider>
                : ''}
            </div>
            
        </form>
    )
}

export default SignUp