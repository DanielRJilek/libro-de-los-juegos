import './MainMenu.css'
import GameCard from '../../components/GameCard/GameCard';
import { useEffect, useState } from 'react';
import { ClipLoader } from "react-spinners";

function MainMenu() {
  const [loading, setLoading] = useState(true);
  const [games,setGames] = useState([]);
  useEffect(() => {
    const getGames = async () => {
      try {
        const response = await fetch('https://libro-de-los-juegos-server.onrender.com/games', {
          method:'GET',
          headers: { "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" },
        });
        const result = await response.json();
        setGames(result);
        setLoading(false);
      } 
      catch (error) {
      
      }
    }
    getGames();
  }, [])
  
  return (
    <>
      <span className='games-title animate-fade-in-up'>Games</span>        
        {!loading ? <div className='gallery animate-fade-in-up animate-delay-1'>
          {games.length > 0 && games.map((game) => {
            return <GameCard key={game.title} game={game}></GameCard>
          })} 
        </div> : <ClipLoader></ClipLoader>}

    </>
        
      
  )
}

export default MainMenu