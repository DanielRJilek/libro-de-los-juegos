import "./MusicPage.css";
import panPipes from '../../assets/images/CantigasDeSantaMariaPanPipes.jpg';
import cantigas160 from '../../assets/images/cantigas_160.jpg';
import anafil from '../../assets/images/Anafil_players.jpg';
import lute from '../../assets/images/lute.jpg';

const aboutMusic = `
    The Cantigas de Santa María (Canticles of Holy Mary) are a collection of 420 songs 
    written in the 13th century and attributed to King Alfonso X of Castile. Alfonso was 
    a great patron of the arts and a great lover of music. Every tenth song 
    is a hymn to the Virgin Mary, but every song mentions the Virgin Mary at least once. Modern historians attribute most of the songs to the 
    court musicians, but Alfonso X is accepted as the authentic composer of some of the songs.
    Like the Book of Games, the manuscript is decorated with beautiful illustrations called miniatures showing 
    musicians playing medieval instruments.
`

function MusicPage() {
    return (
        <div className="music-page animate-fade-in-up">
            <div className="music-panel animate-fade-in-up animate-delay-1">
                <div className="hero-banner music-hero">
                    <div className="hero-banner-images">
                        <img src={panPipes} alt='Musicians playing pan pipes in the Cantigas de Santa María' />
                        <img src={cantigas160} alt='Illustration from the Cantigas de Santa María' />
                        <img src={anafil} alt='Anafil trumpet players' />
                        <img src={lute} alt='Musician playing a medieval lute' />
                    </div>
                    <h1 className="games-title hero-banner-title">About the Music</h1>
                </div>
                <p className="music-content">{aboutMusic}</p>
            </div>
        </div>
    )
}

export default MusicPage
