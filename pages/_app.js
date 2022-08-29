import appStyles from '../styles/BlackjackApp.module.scss'
import '../styles/globals.scss'

import Head from "next/head";



function BlackjackApp({Component, pageProps}) {
    return (
        <>
            <Head>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                <link rel="manifest" href="/site.webmanifest"/>
                <title>Blackjack 2.0</title>
            </Head>
            <nav className={appStyles.nav}>
                <a href="/">Home</a>
            </nav>
            <main className={appStyles.main}>
                <Component {...pageProps} />
            </main>
            <footer className={appStyles.footer}>
                <hr className={appStyles.footerHr}/>
                Built with 🔥Passion by <a href="https://stefanedeaconu.herokuapp.com" className={`${appStyles.primary} `}>Ștefan</a>.
            </footer>
        </>
    )
}

export default BlackjackApp
