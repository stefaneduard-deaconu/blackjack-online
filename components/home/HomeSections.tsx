import styles from '../../styles/Home.module.scss'
import HomeSection from "./HomeSection";

const HomeSections = () => {

    let sections = [
        {
            title: 'Play a game',
            btnText: 'Play',
            imgSrc: "/section-play.jpg"
        },

        {
            title: 'See your stats',
            btnText: 'Play',
            imgSrc: "/section-stats.png"
        },

    ]
    return (
        <div className={styles.sections}>
            {
                sections.map(data => <HomeSection {...data} />)
            }
        </div>
    )
}


export default HomeSections;