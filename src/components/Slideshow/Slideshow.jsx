import './Slideshow.css'
import { useEffect, useState } from 'react'
import img1 from '../../assets/slides/Alfonso.jpg'
import img2 from '../../assets/slides/Alfonso-todas-tablas.jpg'
import img3 from '../../assets/slides/Alquerque_in_Libro_de_los_juegos.jpg'
import img4 from '../../assets/slides/chess_players.png'
import img5 from '../../assets/slides/doblet.jpg'
import { ClipLoader } from "react-spinners";

function Slideshow() {
    const images = [
        {id: '0', src: img1, class: 'hidden'},
        {id: '1', src: img2, class: 'hidden'},
        {id: '2', src: img3, class: 'hidden'},
        {id: '3', src: img4, class: 'hidden'},
        {id: '4', src: img5, class: 'hidden'},
    ];
    const [index, setIndex] = useState(0);

    const nextImage = (oldIndex) => {
        if (oldIndex >= images.length - 1) {
            setIndex(0);
        }
        else {
            setIndex(oldIndex+1);
        }
    }    

    useEffect(() => {
        const interval = setInterval(() => {
            let oldIndex = index;
            nextImage(oldIndex);
        }, 4000);
        return () => {
            clearInterval(interval);
        }
    }, [index])

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, [])


    return (
        loading ? <ClipLoader></ClipLoader> :
        <div className="slideshow">
            <ul>
                {images.map((image) => (
                    <li key={image.id}>
                        <img src={image.src} className={`fade ${index==image.id ? `visible` : `hidden`}` }/>
                    </li>
                ))};
            </ul>
            
        </div>
    );
}

export default Slideshow