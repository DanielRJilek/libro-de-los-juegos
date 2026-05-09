import './About.css';
import Slideshow from '../../components/Slideshow/Slideshow';

function About() {
    const about_text = "Inspired by the medieval Spanish book describing popular board and table games of the time period, " +
        "called the Libro de los Juegos. Create an account to challenge your friends online to " + 
        "a variety of multiplayer games. All for free.";
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