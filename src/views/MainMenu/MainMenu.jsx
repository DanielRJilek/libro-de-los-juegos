import './MainMenu.css'
import Header from '../../components/Header/Header';
import GameCard from '../../components/GameCard/GameCard';
import { useEffect, useState } from 'react';
import { ClipLoader } from "react-spinners";

function MainMenu() {
  // const gameTitles = [];
  // const gameImages = [];
  // const game = [];
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
    <div className="page" id='main-menu-page'>
      <Header></Header>
      <div id='main'>
        <span className='games-title'>Games</span>
        <div id='game-display'>
          {/* <div id='game-preview'>
            <img src="null" alt="" />
          </div>
          <div id='game-about'>

          </div> */}
        </div>
        
        {!loading ? <div className='gallery'>
          {games.length > 0 && games.map((game) => {
            return <GameCard key={game.title} game={game}></GameCard>
          })} 
        </div> : <ClipLoader></ClipLoader>}
      </div>
    </div>
  )
}

export default MainMenu