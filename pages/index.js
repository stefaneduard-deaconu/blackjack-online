import Head from 'next/head'

import styles from '../styles/Home.module.scss'
import appStyles from '../styles/BlackjackApp.module.scss'

import HomeSections from "../components/home/HomeSections";

export default function Home() {

    let playerName = 'Hector';

    return (
        <div className={styles.container}>
            <Head>
                <title>Home ♦️ Blackjack 2.0 </title>
                <meta name="description" content="Application for playing blackjack simply for 2 players"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <div className="greetings">
                <h1>Hello, <span className={appStyles.primary}>{playerName}</span></h1>
                <p>
                    Let's have some fun!
                </p>
            </div>

            <HomeSections/>
        </div>
    )
}
