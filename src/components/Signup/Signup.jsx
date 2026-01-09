import {useNavigate} from 'react-router'
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import '../LogIn/LogIn.css';

function SignUp() {
    const navigate = useNavigate();
    const token = useContext(AuthContext);
    const user = useContext(UserContext)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        const password = e.target[1].value;

        try {
            const response = await fetch('https://libro-de-los-juegos-server.onrender.com/users', {
                // mode: "cors",
                method:'POST',
                headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({username, password}),
            });
            if (!response.ok) {
                throw new Error("Failed");
            }


            const response2 = await fetch('https://libro-de-los-juegos-server.onrender.com/auth/login', {
                method:'POST',
                headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({username, password}),
            });
            if (!response2.ok) {
                throw new Error("Failed");
            }
            // const code = await response.text();
            user.setUsername(username);
            token.setUser(response2.body);
            navigate(window.history.back(1));
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
            <p>Already have an account?</p>
            <a href='/login'>Login</a>
        </form>
    )
}

export default SignUp