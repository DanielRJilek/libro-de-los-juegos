import {useNavigate} from 'react-router'
import { AuthContext } from '../../context/AuthContext';
import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { ClipLoader } from "react-spinners";
import { IconContext } from 'react-icons';
import { IoAlertCircle } from "react-icons/io5";
import '../../views/Login/Login.css';
import { apiFetch } from '../../api/client';

function SignUp() {
    const navigate = useNavigate();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const auth = useContext(AuthContext);
    const user = useContext(UserContext);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        const password1 = e.target[1].value;
        const password2 = e.target[2].value;
        setLoading(true);
        try {
            await apiFetch('/users', {method: 'POST', body: {username, password1, password2}});
            const {id, token} = await apiFetch('/auth/login', {method: 'POST', body: {username, password: password1}});
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
}

export default SignUp