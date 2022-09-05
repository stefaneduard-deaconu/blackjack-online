import styles from '../../styles/Match.module.scss'

import Image from "next/image";

import {useDispatch, useSelector} from "react-redux";
import {RootStore} from '../../redux/store'

import {useState, useEffect} from "react";

// connect to io
import io from 'socket.io-client'
import {
    MatchType,
    PlayerOption, MatchOption,
    PlayerType
} from "../../redux/actions/MatchActionTypes";

const socket = io("http://localhost:3001", {transports: ["websocket"]})


export default function Game() {


    // *** code for the joining a game, TODO turn it into a custom hook ***

    const [joinedMatch, setJoinedMatch] = useState('') // TODO also store to localHost :)


    const [option, setOption] = useState<PlayerOption>(PlayerOption.NONE) // TODO also store to localHost :)
    const [rivalOption, setRivalOption] = useState<PlayerOption>(PlayerOption.NONE) // TODO also store to localHost :)


    const [isWaitingPlayer, setWaitingPlayer] = useState<boolean>();

    useEffect(() => {
        socket.on('joined_room', (data) => {
            console.log(data)

            setJoinedMatch(data.joinedId)
            // TODO what will happened when refreshing the browser? :(

            setWaitingPlayer(data.waiting)
        })
        socket.on('receive_rival_option', (data) => {
            console.log('receive_rival_option:', data)
            setRivalOption(data.option)
        })
    }, [socket]) // the callback reruns for each emitted event

    const joinMatch = () => {
        socket.emit('join_room')
        setWaitingPlayer(true)
    }
    const setAndSendOption = (opt: PlayerOption) => {
        socket.emit('send_option', {
            joinedId: joinedMatch,
            option: opt
        })
        // also run option for our user
        setOption(opt)
    }

    // added event before unloading, so that the player will have clarity:
    useEffect(() => {
        window.onbeforeunload = (e) => {
            e.preventDefault()
            return 'If you leave, the game ends and the opponent wins!'
        }
    }, [])


    // *** code for the matchDispatcher ***


    // init dispatch
    const dispatch = useDispatch();
    // select the match state
    const matchState: MatchType = useSelector((state: RootStore) => state.match.match);
    const currentPlayer: PlayerType = useSelector(
        (state: RootStore) => (
            state.match.match.currentPlayer == 0
                ? state.match.match.player1
                : state.match.match.player2
        )
    );

    // event handlers:

    // // TODO example of using an Action
    // const handleSubmit = () => {
    //     dispatch(GetPokemon(pokemonName))
    // }

    // useEffect

    useEffect(() => {
        // when the game starts, we will dispatch starting the game:
        if (joinedMatch) {
            dispatch({
                type: MatchOption.MATCH_START_GAME,
            })
        }
    }, [joinedMatch])

    useEffect(() => {
        console.log('MATCH STATE: ', matchState)
    })


    return (
        <div className={styles.container}>
            {
                isWaitingPlayer ? (
                    <div className={styles.loading}>
                        Finding a worthy opponent..
                        {/*// https://www.flaticon.com/free-icon/loading_189768?term=loading&page=1&position=5&page=1&position=5&related_id=189768&origin=search*/}
                        <div className={styles.image}>
                            <Image src={'/textures/loading.png'} width={32} height={32}/>
                        </div>
                    </div>
                ) : (
                    joinedMatch ? (
                        <>
                            <div className={styles.game}>
                                <h1>Match#{joinedMatch}</h1>
                                <hr/>
                                <p>Our option: {option}</p>
                                <p>Their option: {rivalOption}</p>

                                <ul style={{listStyleType: 'none'}}>
                                    {/* TODO add filtering, based on whether the option is available.. so we need to store whether the player*/}
                                    {/*  is making the first move now*/}
                                    <h2>Options for player {matchState.currentPlayer}</h2>

                                    {/*options:*/}

                                    {/* TODO list all hands:*/}
                                    {
                                        new Array(currentPlayer?.hands.length)
                                            .fill(0)
                                            .map((_, index) => <button key={index}
                                                                       onClick={() => dispatch(
                                                                           {
                                                                               type: MatchOption.MATCH_HIT,
                                                                               payload: {
                                                                                   hand: index
                                                                               }
                                                                           }
                                                                       )}
                                                >
                                                    HIT (hand {index})
                                                </button>
                                            )
                                    }


                                    <button onClick={() => dispatch(
                                        {
                                            type: MatchOption.MATCH_STAND,
                                            payload: matchState.currentPlayer
                                        }
                                    )}>
                                        Stand
                                    </button>

                                    <button onClick={() => dispatch(
                                        {
                                            type: MatchOption.MATCH_DOUBLE
                                        }
                                    )}>
                                        Double
                                    </button>

                                    {/*TODO a better way, but currently it does not work.*/}
                                    {/*  because we would need to create a way to dynamically call the dispatch*/}
                                    {/*{*/}
                                    {/*    PLAYER_OPTION_KEYS*/}
                                    {/*        .filter(option => isOptionAvailable(option, currentPlayer))*/}
                                    {/*        .map(*/}
                                    {/*            (label, index) => <li>*/}
                                    {/*                <button  key={index} onClick={() => setAndSendOption(label)}>{label}</button>*/}
                                    {/*            </li>*/}
                                    {/*        )*/}
                                    {/*}*/}
                                </ul>
                            </div>


                            {/*section for showing the cards*/}

                            <div style={{fontSize: '1.1rem'}}>
                                <p>Current bet={matchState.currentBet}</p>

                                <div
                                    style={{color: ([PlayerOption.SURRENDER, PlayerOption.BUST].includes(matchState.player1.lastOption) ? 'grey' : 'black')}}>

                                    <h2>Player 0 (bet={matchState.player1.bet})</h2>
                                    <ul>
                                        {
                                            matchState.player1.hands.map((hand, index) => <li key={index}>
                                                {hand.map((card, index) => <li
                                                    key={index}>{card.house} {card.number}</li>)}
                                            </li>)
                                        }
                                    </ul>
                                </div>
                                <div
                                    style={{color: ([PlayerOption.SURRENDER, PlayerOption.BUST].includes(matchState.player2.lastOption) ? 'grey' : 'black')}}>

                                    <h2>Player 1 (bet={matchState.player2.bet})</h2>
                                    <ul>
                                        {
                                            matchState.player2.hands.map((hand, index) => <li key={index}>
                                                {hand.map((card, index) => <li
                                                    key={index}>{card?.house} {card?.number}</li>)}
                                            </li>)
                                        }
                                    </ul>
                                </div>

                                <div>
                                    <h2>Dealer</h2>
                                    <ul>
                                        <li>
                                            {matchState.dealer.firstCard?.house} {matchState.dealer.firstCard?.number}
                                        </li>
                                        <li>
                                            {/*{matchState.dealer.secondCard?.house} {matchState.dealer.secondCard?.number}*/}
                                            ?? ??
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </>

                    ) : (
                        <>
                            <div className={styles.playButtonContainer}>
                                <button className={styles.button} onClick={joinMatch}>
                                    <span className={styles.span}>
                                        Play
                                    </span>
                                </button>
                            </div>
                        </>
                    )
                )
            }


        </div>
    )


    // // TODO download all cards from https://www.flaticon.com/free-icon/clubs_7806988?term=playing%20card&page=1&position=1&page=1&position=1&related_id=7806988&origin=search

    // better code for showing the dealer and players' hands:

    // return <div className={styles.container}>
    //     <Head>
    //         <title>Match ♦️ Blackjack 2.0 </title>
    //         <meta name="description" content="Play Blackjack with your best friend"/>
    //     </Head>
    //     <div className={styles.container}>
    //         <div className={styles.table}>
    //             <div className={styles.dealer}>
    //
    //             </div>
    //             <div className={styles.players}>
    //                 <div className={`${styles.player} ${styles.p1}`}>
    //                     {/*TODO transform this into a Hand component*/}
    //                     <div className={styles.hand}>
    //                         <span className={styles.card}>
    //                             <Image
    //                                 src={'/textures/cards/clubs9.svg'}
    //                                 width={'100%'} height={'100%'}
    //                             >
    //                             </Image>
    //                         </span>
    //                         <span className={styles.card}>
    //                             <Image className={styles.card}
    //                                    src={'/textures/cards/clubs9.svg'}
    //                                    width={'100%'} height={'100%'}
    //                             >
    //                             </Image>
    //                         </span>
    //                         <span className={styles.card}>
    //                             <Image className={styles.card}
    //                                    src={'/textures/cards/clubs9.svg'}
    //                                    width={'100%'} height={'100%'}
    //                             >
    //                             </Image>
    //                         </span>
    //                         <span className={styles.card}>
    //                             <Image className={styles.card}
    //                                    src={'/textures/cards/clubs9.svg'}
    //                                    width={'100%'} height={'100%'}
    //                             >
    //                             </Image>
    //                         </span>
    //                         <span className={styles.card}>
    //                             <Image className={styles.card}
    //                                    src={'/textures/cards/clubs9.svg'}
    //                                    width={'100%'} height={'100%'}
    //                             >
    //                             </Image>
    //                         </span>
    //                         <span className={styles.card}>
    //                             <Image className={styles.card}
    //                                    src={'/textures/cards/clubs9.svg'}
    //                                    width={'100%'} height={'100%'}
    //                             >
    //                             </Image>
    //                         </span>
    //                         <span className={styles.card}>
    //                             <Image className={styles.card}
    //                                    src={'/textures/cards/clubs9.svg'}
    //                                    width={'100%'} height={'100%'}
    //                             >
    //                             </Image>
    //                         </span>
    //                         <span className={styles.card}>
    //                             <Image className={styles.card}
    //                                    src={'/textures/cards/clubs9.svg'}
    //                                    width={'100%'} height={'100%'}
    //                             >
    //                             </Image>
    //                         </span>
    //                     </div>
    //                     <div className={styles.hand}>
    //                         <span className={styles.card}>
    //                             <Image
    //                                 src={'/textures/cards/clubs9.svg'}
    //                                 width={'100%'} height={'100%'}
    //                             >
    //                             </Image>
    //                         </span>
    //                         <span className={styles.card}>
    //                             <Image className={styles.card}
    //                                    src={'/textures/cards/clubs9.svg'}
    //                                    width={'100%'} height={'100%'}
    //                             >
    //                             </Image>
    //                         </span>
    //                         <span className={styles.card}>
    //                             <Image className={styles.card}
    //                                    src={'/textures/cards/clubs9.svg'}
    //                                    width={'100%'} height={'100%'}
    //                             >
    //                             </Image>
    //                         </span>
    //                         <span className={styles.card}>
    //                             <Image className={styles.card}
    //                                    src={'/textures/cards/clubs9.svg'}
    //                                    width={'100%'} height={'100%'}
    //                             >
    //                             </Image>
    //                         </span>
    //                         <span className={styles.card}>
    //                             <Image className={styles.card}
    //                                    src={'/textures/cards/clubs9.svg'}
    //                                    width={'100%'} height={'100%'}
    //                             >
    //                             </Image>
    //                         </span>
    //                         <span className={styles.card}>
    //                             <Image className={styles.card}
    //                                    src={'/textures/cards/clubs9.svg'}
    //                                    width={'100%'} height={'100%'}
    //                             >
    //                             </Image>
    //                         </span>
    //                         <span className={styles.card}>
    //                             <Image className={styles.card}
    //                                    src={'/textures/cards/clubs9.svg'}
    //                                    width={'100%'} height={'100%'}
    //                             >
    //                             </Image>
    //                         </span>
    //                         <span className={styles.card}>
    //                             <Image className={styles.card}
    //                                    src={'/textures/cards/clubs9.svg'}
    //                                    width={'100%'} height={'100%'}
    //                             >
    //                             </Image>
    //                         </span>
    //                     </div>
    //                     <div className={styles.bet}>
    //
    //                         <div className={styles.betValue}>
    //                             200$
    //                         </div>
    //                         <div className={styles.betImage}>
    //                             <Image
    //                                 src={'/textures/poker-chip.png'}
    //                                 width={'100%'}
    //                                 height={'100%'}
    //                             >
    //
    //                             </Image>
    //                         </div>
    //                     </div>
    //                 </div>
    //                 <div className={`${styles.player} ${styles.p2}`}>
    //
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // </div>

}
