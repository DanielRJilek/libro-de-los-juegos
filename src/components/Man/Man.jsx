import './Man.css'

function Man({playerNumber, style}) {
    const gradient = playerNumber === 1
        ? 'radial-gradient(darkred 40%, red)'
        : 'radial-gradient(rgb(255, 217, 0) 40%, yellow)';
    return (
        <div className='man' style={{backgroundImage: gradient,
            ...style
        }}>
        </div>
    )
}

export default Man