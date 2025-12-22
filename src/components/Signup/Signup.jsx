import {useNavigate} from 'react-router'

function SignUp() {
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        const password = e.target[1].value;

        try {
            const response = await fetch('https://libro-de-los-juegos-server.onrender.com', {
                mode: "cors",
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
            <label for="confirm-password">Confirm Password</label>
            <input type="password" id="confirm-password" name="confirm-password"></input>
            <input type="submit" value="Create an account" ></input>
            <p>Already have an account?</p>
            <a href='/login'>Login</a>
        </form>
    )
}

export default SignUp