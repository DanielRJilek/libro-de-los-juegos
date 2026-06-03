import './Dice.css'
import { BsDice1Fill, BsDice2Fill, BsDice3Fill, BsDice4Fill, BsDice5Fill, BsDice6Fill } from "react-icons/bs";
import { useState, useEffect, useRef } from 'react';

function Dice({ value, active }) {
    const [face, setFace] = useState(value);
    const isFirstRender = useRef(true);
    const diceIcons = [<BsDice1Fill/>, 
                        <BsDice2Fill/>, 
                        <BsDice3Fill/>, 
                        <BsDice4Fill/>, 
                        <BsDice5Fill/>, 
                        <BsDice6Fill/>];

    const nextFace = (currentFace) => {
        let newFace = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
        if (newFace == currentFace) {
            return nextFace(currentFace);
        }
        return newFace;
    }

    const rollDice = async (newValue) => {
        let currentFace = face;
        for (let i = 0; i < 12; i++) {
            await new Promise(resolve => setTimeout(resolve, 20 * i));
            currentFace = nextFace(currentFace);
            setFace(currentFace);
        }
        setFace(newValue);
    }

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        rollDice(value);
    }, [value]);
    
    return (
        <div className={`dice ${active ? 'active' : ''}`}>
            {diceIcons[face-1]}
        </div>
    )  
}

export default Dice