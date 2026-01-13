// to do: make modular lobby

import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context/UserContext";
import Header from "../../../components/Header/Header";
import { AuthContext } from "../../../context/AuthContext";

function DobletLobby() {
    const user = useContext(UserContext);
    const auth = useContext(AuthContext);
    const [lobby, setLobby] = useState(null);
    const [addingPlayer, setAddingPlayer] = useState(false);
    const toggleAddingPlayer = () => {
        addingPlayer ? setAddingPlayer(false) : setAddingPlayer(true)
    }

    const createGame = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://libro-de-los-juegos-server.onrender.com/games/doblet`, {
                method:'POST',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
            });
            if (!response.ok) {
                throw new Error("Failed");
            }
            const result = await response.json();
            setLobby(result.id);
        } 
        catch (error) {
            console.log(error)
        }
    }


    const addPlayer = async (e) => {
        e.preventDefault();
        const username = e.target[0].value;
        try {
            const response = await fetch(`https://libro-de-los-juegos-server.onrender.com/games/doblet/${lobby}/players`, {
                method:'POST',
                headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                            "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                body: JSON.stringify({username}),
            });
            if (!response.ok) {
                throw new Error("Failed");
            }
        } 
        catch (error) {
            console.log(error)
        }
    }

    const [players, setPlayers] = useState(null);
    useEffect(() => {
        const getPlayers = async () => {
            try {
                const userID = user.userID;
                const response = await fetch(`https://libro-de-los-juegos-server.onrender.com/games/doblet/${lobby}/players`, {
                    method:'GET',
                    headers: {  'Authorization': `Bearer ${auth.accessToken}`,
                                "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
                });
                const result = await response.json();
                setInvites(result.invites);
            } 
            catch (error) {
            
            }
        }
        getPlayers();
    }, [user])

    return (
        <div className="lobby-page">
            <Header></Header>
            <button onClick={createGame}>Create Game</button>
            <span >
                <span onClick={toggleAddingPlayer}>Add Player</span>
                {addingPlayer
                    &&  <form className='flex-row' onSubmit={addPlayer}>
                            <label for="username"></label>
                            <input type="text" id="username" name="username"></input>
                            <button className='go-button'>Go</button>
                        </form>}
            </span>
        </div>
    )
}

export default DobletLobby