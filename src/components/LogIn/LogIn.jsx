import './LogIn.css'
import {useNavigate} from 'react-router'

function LogIn() {
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
            if (!response.ok) {
                throw new Error("Failed");
            }
            // const code = await response.text();
            navigate('/MainMenu');
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
            <input type="submit" value="Log In" ></input>
            <a href='/signup'>Create Account</a>
        </form>
    )
}

export default LogIn