import './MainMenu.css'
import Header from '../../components/Header/Header';

function MainMenu() {
  const gameTitles = [];
  const gameImages = [];
  const game = [];
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

        </div>
      </div>
    </div>
  )
}

export default MainMenu