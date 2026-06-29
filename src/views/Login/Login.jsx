import './Login.css'
import {useNavigate} from 'react-router'
import { AuthContext } from '../../context/AuthContext';
import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { ClipLoader } from "react-spinners";
import { IconContext } from 'react-icons';
import { IoAlertCircle } from "react-icons/io5";
import { apiFetch } from '../../api/client';

function Login() {
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
            const {id, token} = await apiFetch('/auth/login', {method: 'POST', body: {username, password}});
            user.setUsername(username);
            user.setUserID(id.toString());
            auth.setAccessToken(token);
            navigate('/games');
        } 
        catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }
    if (loading) {
        return (<ClipLoader></ClipLoader>)
    }
    else {
        return (
            <form className='login-form animate-fade-in-up' onSubmit={handleSubmit}>
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

export default Login