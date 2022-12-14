import styles from '../../styles/Home.module.scss'
import Image from "next/image";

type Props = {
    title: string,
    btnText: string,
    btnHref: string,
    imgSrc: string,
    origWidth: number,
    origHeight: number,
}


const HomeSection = ({
                         title, btnText, btnHref,
                         imgSrc,
                         origWidth, origHeight
                     }: Props) => {

    return (
        <div className={styles.section}>
            <div className={styles.content}>
                <h2 className={styles.h2}>{title}</h2>
                <button className={styles.button}
                        onClick={e => document.location.href = btnHref}
                >
                    <span className={styles.span}>{btnText}</span>
                </button>
            </div>
            <div className={styles.image}><Image src={imgSrc} alt="" width={origWidth} height={origHeight}/></div>
        </div>

    )
}

export default HomeSection;
