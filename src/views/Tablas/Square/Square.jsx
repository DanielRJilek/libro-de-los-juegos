import Man from '../Man/Man'
import './Square.css'

function Square({x,y, count, player}) {
    return (
        <div className='board-square'>
            {Array.from({length: count}, () => <Man player={player}></Man>)}
        </div>
    )
}

export default Square