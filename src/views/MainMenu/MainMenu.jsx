import './MainMenu.css'
import Header from '../../components/Header/Header';
import GameCard from '../../components/GameCard/GameCard';
import { useEffect, useState } from 'react';

function MainMenu() {
  // const gameTitles = [];
  // const gameImages = [];
  // const game = [];

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
      } 
      catch (error) {
      
      }
    }
    getGames();
    console.log(games);
  }, [])
  
    

  return (
    <div className="page" id='main-menu-page'>
      <Header></Header>
      <div id='main'>
        <div id='game-display'>
          <div id='game-preview'>
            <img src="null" alt="" />
          </div>
          <div id='game-about'>

          </div>
        </div>
        <div className='gallery'>
          {games.length > 0 && games.map((game) => {
            return <GameCard key={game.title} game={game}></GameCard>
          })}
        </div>
      </div>
    </div>
  )
}

export default MainMenu