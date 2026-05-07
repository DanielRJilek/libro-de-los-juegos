import './Man.css'

function Man({player, position}) {
    return (
        player.playerNumber==1 ? <div className='man' style={{backgroundImage: 'radial-gradient(darkred 40%, red)'}}>
            <div className='man-number'>{player.username}</div>
            <div className='man-position'>{position[0]}, {position[1]}</div>
        </div> 
        : <div className='man' style={{backgroundImage: 'radial-gradient(rgb(255, 217, 0) 40%, yellow)'}}>
            <div className='man-number'>{player.username}</div>
            <div className='man-position'>{position[0]}, {position[1]}</div>
        </div>
    )
}

export default Man