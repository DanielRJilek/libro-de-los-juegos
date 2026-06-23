import './About.css';
import Slideshow from '../../components/Slideshow/Slideshow';

function About() {
    const about_text = "Inspired by the medieval Spanish book Libro de los Juegos, Spanish for book of games, play popular board and table games of the era. Libro de los Juegos was commissioned by the King of Spain himself, Alfonso X, a board game enthusiast and amateur musician. The artwork present on this site comes from the illustrations present in the original manuscript. " +
        "Create an account to challenge your friends online to a variety of authentic medieval games. All for free.";
    const about_header = "Welcome to the World of Medieval Gaming";

    return (
        <div id='about' className='animate-fade-in-up'>
            <h1 className='games-title animate-fade-in-up animate-delay-1'>About</h1>
            <h2 className='about-text animate-fade-in-up animate-delay-2'>{about_header}</h2>
            
            <p className='about-text animate-fade-in-up animate-delay-3'>{about_text}</p>
            <Slideshow></Slideshow>
        </div>
    )
}

export default About;