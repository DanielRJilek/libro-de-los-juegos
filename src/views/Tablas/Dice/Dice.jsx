import { useContext } from 'react';
import './Dice.css'
import { AuthContext } from '../../../context/AuthContext';

function Dice(instance) {
    const auth = useContext(AuthContext);
    const roll = async() => {
        try {
            const response = await fetch(`https://libro-de-los-juegos-server.onrender.com/games/doblet/${instance}/play`, {
                method:'POST',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
            });
            if (!response.ok) {
                throw new Error("Failed");
            }
            const {result} = await response.json();
        } 
        catch (error) {
            console.log(error)
        }
    }
    return (
        <button onClick={roll}>Roll!</button>
    )
}

export default Dice