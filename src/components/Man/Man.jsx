import './Man.css'

function Man({player, position}) {
    return (
        player.playerNumber==1 ? <div className='man' style={{backgroundImage: 'radial-gradient(darkred 40%, red)'}}>
        </div> 
        : <div className='man' style={{backgroundImage: 'radial-gradient(rgb(255, 217, 0) 40%, yellow)'}}>
        </div>
    )
}

export default Man