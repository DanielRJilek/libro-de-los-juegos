import './LogIn.css'
import {useNavigate} from 'react-router'
import { AuthContext } from '../../context/AuthContext';
import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { CgProfile } from "react-icons/cg";
import { ClipLoader } from "react-spinners";
import { IconContext } from 'react-icons';
import { IoAlertCircle } from "react-icons/io5";
const API_URL = import.meta.env.VITE_API_URL;


function LogIn() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const auth = useContext(AuthContext);
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        const password = e.target[1].value;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method:'POST',
                headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({username, password}),
            });
            setLoading(false);
            if (!response.ok) {
                // throw new Error("Failed");
                const message = await response.json();
                setError(message.message);
            }
            else {
                const {id, token} = await response.json();
                user.setUsername(username);
                user.setUserID(id.toString());
                auth.setAccessToken(token);
                // localStorage.setItem("token", token);
                
                navigate('/games');
            }
            
        } 
        catch (error) {
            console.log(error)
        }
    }
    if (loading) {
        return (<ClipLoader></ClipLoader>)
    }
    else {
        return (
            <form className='login-form' onSubmit={handleSubmit}>
                <label for="username">Username</label>
                <input className='login-input' type="text" id="username" name="username"></input>
                <label for="password">Password</label>
                <input className='login-input' type="password" id="password" name="password"></input>
                <button type="submit">Log In</button>
                <a href='/signup'>Create Account</a>
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
}

export default LogIn