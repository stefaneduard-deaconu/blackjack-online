import styles from '../../styles/Home.module.scss'
import HomeSection from "./HomeSection";

const HomeSections = () => {

    let sections = [
        {
            title: 'Play a game',
            btnText: 'Play',
            btnHref: '/game',
            imgSrc: "/section-game.jpg",
            origWidth: 1573,
            origHeight: 1069
        },

        {
            title: 'See your stats',
            btnText: 'Stats',
            btnHref: '/stats',
            imgSrc: "/section-stats.png",
            origWidth: 3000,
            origHeight: 1600
        },

    ]
    return (
        <div className={styles.sections}>
            {
                sections.map((data, idx) => <HomeSection key={idx} {...data} />)
            }
        </div>
    )
}


export default HomeSections;