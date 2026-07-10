import './About.css';
import chessPlayers from '../../assets/images/chess_players.png';
import allTablas from '../../assets/images/Alfonso-todas-tablas.jpg';
import morris from "../../assets/images/Nine_Men's_Morris_with_dice_in_Libro_de_los_juegos.jpg";
import alfonso from '../../assets/images/Alfonso.jpg';

function About() {
    const about_text = `Inspired by the medieval Spanish book Libro de los Juegos, 
        Spanish for book of games, play popular board and table games of the era. 
        Libro de los Juegos was commissioned by the King of Spain himself, Alfonso X, 
        a board game enthusiast and amateur musician. The artwork present on this site comes 
        from the illustrations present in the original manuscript. Create an account to 
        challenge your friends online to a variety of authentic medieval games. All for free.
    `;
    const about_header = "Welcome to the World of Medieval Gaming";

    return (
        <div id='about' className='animate-fade-in-up'>
            <div className='about-panel animate-fade-in-up animate-delay-1'>
                <div className='hero-banner about-hero'>
                    <div className='hero-banner-images'>
                        <img src={chessPlayers} alt='Medieval players at a game of chess' />
                        <img src={allTablas} alt='Alfonso X and companions playing tables' />
                        <img src={morris} alt="Nine men's morris played with dice" />
                    </div>
                    <h1 className='games-title hero-banner-title'>About</h1>
                </div>
                <h2 className='about-text about-heading'>{about_header}</h2>
                <p className='about-text'>{about_text}</p>
                <img className='about-figure' src={alfonso} alt='King Alfonso X of Castile' />
            </div>
        </div>
    )
}

export default About;
