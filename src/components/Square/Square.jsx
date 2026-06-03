import Man from '../Man/Man'
import './Square.css'

function Square({x, y, cell}) {
    const men = [];
    for (let i = 0; i < cell.p1; i++) men.push(<Man key={`p1-${i}`} playerNumber={1} position={[y, x]}/>);
    for (let i = 0; i < cell.p2; i++) men.push(<Man key={`p2-${i}`} playerNumber={2} position={[y, x]}/>);
    return (
        <div className="board-square" data-y={y} data-x={x} style={{gridArea: `${y + 1} / ${x + 1} / ${y + 2} / ${x + 2}`}}>
            {men}
        </div>
    )
}

export default Square