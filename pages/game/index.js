import Head from 'next/head'

import styles from '../../styles/Game.module.scss'
import appStyles from '../../styles/BlackjackApp.module.scss'
import Image from "next/image";

export default function Game() {

    // the logic for the application:

    /*
    The state will contain data about the current deck, the players (decks, hands, bets)
    Depending on the state, the options showed will also change..
     */

    // implement simple visuals, such as the table, the players, the cards, the dealer etc
    // TODO download cards from https://www.flaticon.com/free-icon/clubs_7806988?term=playing%20card&page=1&position=1&page=1&position=1&related_id=7806988&origin=search
    return <div className={styles.container}>
        <Head>
            <title>Game ♦️ Blackjack 2.0 </title>
            <meta name="description" content="Play Blackjack with your best friend"/>
        </Head>
        <div className={styles.container}>
            <div className={styles.table}>
                <div className={styles.dealer}>

                </div>
                <div className={styles.players}>
                    <div className={`${styles.player} ${styles.p1}`}>
                        {/*TODO transform this into a Hand component*/}
                        <div className={styles.hand}>
                            <span className={styles.card}>
                                <Image
                                    src={'/textures/cards/clubs9.png'}
                                    width={'100%'} height={'100%'}
                                >
                                </Image>
                            </span>
                            <span className={styles.card}>
                                <Image className={styles.card}
                                       src={'/textures/cards/clubs9.png'}
                                       width={'100%'} height={'100%'}
                                >
                                </Image>
                            </span>
                            <span className={styles.card}>
                                <Image className={styles.card}
                                       src={'/textures/cards/clubs9.png'}
                                       width={'100%'} height={'100%'}
                                >
                                </Image>
                            </span>
                            <span className={styles.card}>
                                <Image className={styles.card}
                                       src={'/textures/cards/clubs9.png'}
                                       width={'100%'} height={'100%'}
                                >
                                </Image>
                            </span>
                            <span className={styles.card}>
                                <Image className={styles.card}
                                       src={'/textures/cards/clubs9.png'}
                                       width={'100%'} height={'100%'}
                                >
                                </Image>
                            </span>
                            <span className={styles.card}>
                                <Image className={styles.card}
                                       src={'/textures/cards/clubs9.png'}
                                       width={'100%'} height={'100%'}
                                >
                                </Image>
                            </span>
                            <span className={styles.card}>
                                <Image className={styles.card}
                                       src={'/textures/cards/clubs9.png'}
                                       width={'100%'} height={'100%'}
                                >
                                </Image>
                            </span>
                            <span className={styles.card}>
                                <Image className={styles.card}
                                       src={'/textures/cards/clubs9.png'}
                                       width={'100%'} height={'100%'}
                                >
                                </Image>
                            </span>
                        </div>
                        <div className={styles.hand}>
                            <span className={styles.card}>
                                <Image
                                    src={'/textures/cards/clubs9.png'}
                                    width={'100%'} height={'100%'}
                                >
                                </Image>
                            </span>
                            <span className={styles.card}>
                                <Image className={styles.card}
                                       src={'/textures/cards/clubs9.png'}
                                       width={'100%'} height={'100%'}
                                >
                                </Image>
                            </span>
                            <span className={styles.card}>
                                <Image className={styles.card}
                                       src={'/textures/cards/clubs9.png'}
                                       width={'100%'} height={'100%'}
                                >
                                </Image>
                            </span>
                            <span className={styles.card}>
                                <Image className={styles.card}
                                       src={'/textures/cards/clubs9.png'}
                                       width={'100%'} height={'100%'}
                                >
                                </Image>
                            </span>
                            <span className={styles.card}>
                                <Image className={styles.card}
                                       src={'/textures/cards/clubs9.png'}
                                       width={'100%'} height={'100%'}
                                >
                                </Image>
                            </span>
                            <span className={styles.card}>
                                <Image className={styles.card}
                                       src={'/textures/cards/clubs9.png'}
                                       width={'100%'} height={'100%'}
                                >
                                </Image>
                            </span>
                            <span className={styles.card}>
                                <Image className={styles.card}
                                       src={'/textures/cards/clubs9.png'}
                                       width={'100%'} height={'100%'}
                                >
                                </Image>
                            </span>
                            <span className={styles.card}>
                                <Image className={styles.card}
                                       src={'/textures/cards/clubs9.png'}
                                       width={'100%'} height={'100%'}
                                >
                                </Image>
                            </span>
                        </div>
                        <div className={styles.bet}>

                            <div className={styles.betValue}>
                                200$
                            </div>
                            <div className={styles.betImage}>
                                <Image
                                    src={'/textures/poker-chip.png'}
                                    width={'100%'}
                                    height={'100%'}
                                >

                                </Image>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.player} ${styles.p2}`}>

                    </div>
                </div>
            </div>
        </div>
    </div>
}
