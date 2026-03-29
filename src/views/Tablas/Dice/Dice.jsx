import './Dice.css'
import { GiInvertedDice1, GiInvertedDice2, GiInvertedDice3, GiInvertedDice4, GiInvertedDice5, GiInvertedDice6 } from "react-icons/gi";
import { useState } from 'react';

function Dice({ result }) {
    const [rolling, setRolling] = useState(false);
    const [face, setFace] = useState(1);
    const diceIcons = [<GiInvertedDice1 />, <GiInvertedDice2 />, <GiInvertedDice3 />, <GiInvertedDice4 />, <GiInvertedDice5 />, <GiInvertedDice6 />];

    const nextFace = () => {
        let newFace = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
        if (newFace == face) {
            return nextFace();
        }
        return newFace;
    }

    const rollDice = async () => {
        setRolling(true);
        for (let i = 0; i < 12; i++) {
            await new Promise(resolve => setTimeout(resolve, 20 * i));
            setFace(nextFace());
        }
        setFace(result+1);
        setRolling(false);
    }
    
    return (
        <div className='dice'>
            {diceIcons[face-1]}
        </div>
    )  
}

export default Dice