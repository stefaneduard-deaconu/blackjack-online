import styles from '../../styles/Home.module.scss'
import HomeSection from "./HomeSection";

const HomeSections = () => {

    let sections = [
        {
            title: 'Play a game',
            btnText: 'Play',
            imgSrc: "/section-play.jpg",
            origWidth: 1573,
            origHeight: 1069
        },

        {
            title: 'See your stats',
            btnText: 'Play',
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