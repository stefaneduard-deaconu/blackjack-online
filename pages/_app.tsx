import appStyles from '../styles/BlackjackApp.module.scss'
import '../styles/globals.scss'

import Head from "next/head";
import Link from "next/link";
import {Provider} from "react-redux";
import store from '../redux/store.ts'


function BlackjackApp({Component, pageProps}) {
    return (
        <Provider store={store}>
            <Head>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                <link rel="manifest" href="/site.webmanifest"/>
                <title>Blackjack 2.0</title>
            </Head>
            <nav className={appStyles.nav}>
                <Link href="/">Home</Link>
                <Link href="/match">Match</Link>
                <Link href="/stats">Stats</Link>
            </nav>
            <main className={appStyles.main}>
                <Component {...pageProps} />
            </main>
            <footer className={appStyles.footer}>
                <hr className={appStyles.footerHr}/>
                Built with 🔥Passion by <a href="https://stefanedeaconu.herokuapp.com" className={`${appStyles.primary} `}>Ștefan</a>
            </footer>
        </Provider>
    )
}

export default BlackjackApp
