import Man from '../Man/Man'
import './Square.css'

function Square({x,y, pieces, maxPieces}) {
    console.log(x, y, pieces, maxPieces);
    return (
        <div className='board-square'>
            {pieces?.map((piece, index) => (
                <Man key={`${x}-${y}-${index}`} player={piece.player} position={[x,y]}></Man>
            ))}
        </div>
    )
}

export default Square