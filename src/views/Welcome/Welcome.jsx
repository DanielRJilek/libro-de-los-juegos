import Slideshow from '../../components/Slideshow/Slideshow';
import WelcomeButtons from '../../components/WelcomeButtons/WelcomeButtons';
import './Welcome.css';

function Welcome() {
    const welcome_text = "Inspired by the medieval Spanish book describing popular board and table games of the time period, " +
        "immerse yourself in the world of medieval gaming. Create an account to challenge your friends online to " + 
        "a variety of multiplayer games." + "\n" + "All for free.";
    return (
        <div id='welcome'>
            <Slideshow></Slideshow>
            <div id='welcome-right' className='welcome-pane animate-fade-in-up animate-delay-1'>
                <div id='welcome-text-holder' className='animate-fade-in-up animate-delay-2'>
                    {/* <h1>{welcome_header}</h1> */}
                    <p>{welcome_text}</p>
                </div>
                <WelcomeButtons></WelcomeButtons>
            </div>
        </div>
    )
}

export default Welcome