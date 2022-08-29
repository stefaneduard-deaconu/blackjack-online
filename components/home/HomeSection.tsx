import styles from '../../styles/Home.module.scss'

type Props = {
    title: string,
    btnText: string,
    imgSrc: string,
}


const HomeSection = ({
                         title, btnText, imgSrc
                     }: Props) => {

    return (
        <div className={styles.section}>
            <div className={styles.content}>
                <h2 className={styles.h2}>{title}</h2>
                <button className={styles.button}><span className={styles.span}>{btnText}</span></button>
            </div>
            <div className={styles.image}><img src={imgSrc} alt=""/></div>
        </div>

    )
}

export default HomeSection;
