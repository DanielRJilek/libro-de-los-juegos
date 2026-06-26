import './Piece.css'

function Piece({playerNumber, style, point, onClick, selected}) {
    const gradient = playerNumber === 1
        ? 'radial-gradient(rgb(230, 168, 75) 40%, rgb(250, 168, 75))' 
        : 'radial-gradient(rgb(117, 44, 37) 40%, rgb(187, 44, 37))'
    return (
        <div className={`piece${selected ? ' piece--selected' : ''}`} 
            onClick={() => onClick(point)} style={{backgroundImage: gradient,
            ...style
        }}>
            {/* <div className='piece-number'>{point}</div> */}
        </div>
    )
}

export default Piece