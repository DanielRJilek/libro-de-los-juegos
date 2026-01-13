import { useContext } from 'react';
import './Dice.css'
import { AuthContext } from '../../../context/AuthContext';

function Dice({onClick}) {
    
    return (
        <button onClick={onClick}>Roll!</button>
    )
}

export default Dice