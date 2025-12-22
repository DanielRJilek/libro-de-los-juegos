import Slideshow from '../../components/Slideshow/Slideshow';
import PlayNow from '../../components/PlayNow/PlayNow';

function Welcome() {
    const welcome_header = "Welcome to Libro de los Juegos, the Book of Games";
    const welcome_text = "Inspired by the medieval Spanish book describing popular board and table games of the time period, " +
        "immerse yourself in the world of medieval gaming. Create an account to challenge your friends online to " + 
        "a variety of multiplayer games. All for free.";
    return (
        <div id='welcome'>
            <Slideshow></Slideshow>
            <div id='welcome-right'>
                <div id='welcome-text-holder'>
                    <h1>{welcome_header}</h1>
                    <p>{welcome_text}</p>
                </div>
                <PlayNow></PlayNow>
            </div>
        </div>
    )
}

export default Welcome