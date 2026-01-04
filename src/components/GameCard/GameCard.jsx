import { useNavigate } from 'react-router'
import './GameCard.css'

function GameCard({game}) {

    const navigate = useNavigate();

    return (
        <div className='game-card' onClick={() => {navigate('/games/' + game.title.toLowerCase())}}>
            <img src={'https://libro-de-los-juegos-server.onrender.com/static' + game.image} alt="" />
            <span>{game.title}</span>
        </div>
    )
}

export default GameCard