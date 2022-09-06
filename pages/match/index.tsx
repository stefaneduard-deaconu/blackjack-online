import styles from '../../styles/Match.module.scss'

import Image from "next/image";

import {useDispatch, useSelector} from "react-redux";
import {RootStore} from '../../redux/store'

import {useEffect, useState} from "react";

// connect to io
import io from 'socket.io-client'
import {
    CurrentPlayerType,
    MatchOption,
    MatchType,
    PlayerOption,
    PlayerType
} from "../../redux/actions/MatchActionTypes";

import {DEV_API_URL, PROD_API_URL} from "../../config/index.js";
import {isActionAvailable, playerHasSplitForHand} from "../../redux/reducers/matchReducer";
import PlayersHands from "../../components/match/PlayersHands";

let socket;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    socket = io(DEV_API_URL, {transports: ["websocket"]})
    console.log(DEV_API_URL)
} else {
    socket = io(PROD_API_URL, {transports: ["websocket"]})
    console.log(PROD_API_URL)

}


export default function Game() {


    // *** code for the joining a game, TODO turn it into a custom hook ***

    const [joinedMatch, setJoinedMatch] = useState('') // TODO also store to localHost :)


    const [option, setOption] = useState<PlayerOption>(PlayerOption.NONE) // TODO also store to localHost :)
    const [rivalOption, setRivalOption] = useState<PlayerOption>(PlayerOption.NONE) // TODO also store to localHost :)


    const [isWaitingPlayer, setWaitingPlayer] = useState<boolean>();
    // store which player (0 | 1 | 2) is playing right now (based on browser client and the order computed by the backend)
    const [thisPlayersOrder, setThisPlayersOrder] = useState<CurrentPlayerType>();

    useEffect(() => {
        socket.on('joined_room', (data) => {
            console.log(data)

            // TODO what will happen when the browser refreshes? :(
            setJoinedMatch(data.joinedId)
            setWaitingPlayer(data.waiting)
            setThisPlayersOrder(data.playerOrder);
        })
        // may remove the next event:
        socket.on('receive_rival_option', (data) => {
            console.log('receive_rival_option:', data)
            setRivalOption(data.option)
        })
        // match update event:
        socket.on('receive_match_update', (data) => {
            console.log('receive_match_update:', data)
            dispatch({
                type: MatchOption.UPDATE_STATE,
                payload: data.match
            })
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

    // // added event before unloading, so that the player will have clarity:
    // useEffect(() => {
    //     window.onbeforeunload = (e) => {
    //         e.preventDefault()
    //         return 'If you leave, the game ends and the opponent wins!' // TODO
    //     }
    // }, [])


    // *** code for the matchDispatcher ***


    // init dispatch
    const dispatch = useDispatch();
    // select the match state
    const matchState: MatchType = useSelector((state: RootStore) => state.match.match);
    const currentPlayer: PlayerType = useSelector(
        (state: RootStore) => state.match?.match?.players[state.match?.match?.currentPlayer]
    );

    // updating the match's state based on the Socket.IO changes:

    // TODO we need to know if this client is Player0 or Player1,
    //  which is stored after the first connection to the SocketIO Room


    // communicate with Socket.IO after each state update:
    const [hasFinishedTurn, setHasFinishedTurn] = useState(false);
    useEffect(() => {
        if (thisPlayersOrder == undefined) return;

        if (matchState.currentPlayer == 999) {
            // the game ended TODO we may do something here?
            //                  final match update..?
            return;
        }

        // if both players finished the game, the dealer is now playing:
        // TODO the data about the dealer should get to both players
        if (matchState.currentPlayer == 2) {
            console.log('AGAIN and AGAIN', matchState.currentPlayer, matchState)
            dispatch({
                type: MatchOption.MATCH_DEALERS_TURN
            })
            return;
        }

        let thisPlayer = matchState.players[thisPlayersOrder];
        // when the dispatch method ends up by changing the current player (STAND, BUST, DOUBLE, INSURANCE, SURRENDER)
        //  we should also send the new match data for update
        const optionsWhichEndTurn = [PlayerOption.STAND, PlayerOption.BUST, PlayerOption.DOUBLE, PlayerOption.INSURANCE, PlayerOption.SURRENDER];

        // console.log(thisPlayersOrder, matchState.currentPlayer)
        if (thisPlayersOrder == matchState.currentPlayer) {
            // it's the current browser's turn:
            socket.emit('update_match', {
                match: matchState,
                joinedMatch: joinedMatch
            })
            // console.log('UPDATE', )
        } else if (optionsWhichEndTurn.includes(thisPlayer.lastOption)) {
            // last update from this player:
            if (!hasFinishedTurn) {
                console.log('match sent to socket.io:', matchState)
                socket.emit('update_match', { // also updates the
                    match: matchState,
                    joinedMatch: joinedMatch
                })
                // console.log('LAST UPDATE',)
                setHasFinishedTurn(true);
            }

        }
    }, [matchState])


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

    // useEffect(() => {
    //     console.log('MATCH STATE: ', matchState)
    // }, [])


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

                                {/*<p>Our option: {option}</p>*/}
                                {/*<p>Their option: {rivalOption}</p>*/}

                                <ul style={{listStyleType: 'none'}}>
                                    {/* TODO add filtering, based on whether the option is available.. so we need to store whether the player*/}
                                    {/*  is making the first move now*/}
                                    {/*<h2>Options for player {matchState?.currentPlayer}</h2>*/}

                                    <h2>You are Player {thisPlayersOrder}</h2>
                                    {
                                        thisPlayersOrder == matchState?.currentPlayer ? (
                                            <p>
                                                It&apos;s your turn!
                                            </p>
                                        ) : (
                                            <p>Player {1 - thisPlayersOrder} is currently playing.</p>
                                        )
                                    }


                                    {/*options:*/}
                                    {
                                        thisPlayersOrder == matchState.currentPlayer &&
                                        <div>
                                            <h3>Your Options:</h3>
                                            {/* TODO list all hands AND implement the isActionAvailable function the right way,
                                                 even for multiple hands
                                                 :*/}

                                            {/* HIT */}
                                            {
                                                // isActionAvailable(PlayerOption.HIT, matchState.players[thisPlayersOrder]) &&
                                                new Array(currentPlayer?.hands.length)
                                                    .fill(0)
                                                    .map((_, index) => <button key={index}
                                                                               onClick={() => dispatch(
                                                                                   {
                                                                                       type: MatchOption.MATCH_HIT,
                                                                                       payload: {hand: index}
                                                                                   }
                                                                               )}
                                                        >
                                                            HIT (hand {index})
                                                        </button>
                                                    )
                                            }

                                            {/* STAND */}
                                            {
                                                // isActionAvailable(PlayerOption.STAND, matchState.players[thisPlayersOrder]) &&
                                                new Array(currentPlayer?.hands.length)
                                                    .fill(0)
                                                    .map((_, index) => <button key={index} onClick={() => {
                                                            dispatch(
                                                                {
                                                                    type: MatchOption.MATCH_STAND,
                                                                    payload: {hand: index}
                                                                }
                                                            )
                                                            console.log('STAND')
                                                            // setCurrentlyPlaying(false)
                                                        }}>
                                                            Stand (hand {index})
                                                        </button>
                                                    )
                                            }

                                            {/* DOUBLE */}
                                            {
                                                // isActionAvailable(PlayerOption.DOUBLE, matchState.players[thisPlayersOrder]) &&
                                                new Array(currentPlayer?.hands.length)
                                                    .fill(0)
                                                    .map((_, index) => <button key={index} onClick={() => dispatch(
                                                        {
                                                            type: MatchOption.MATCH_DOUBLE,
                                                            payload: {hand: index}
                                                        }
                                                    )}>
                                                        Double (hand {index})
                                                    </button>)
                                            }


                                            {/* SPLIT */}
                                            {
                                                isActionAvailable(PlayerOption.SPLIT, matchState.players[thisPlayersOrder]) &&
                                                matchState.players[thisPlayersOrder].hands
                                                    .filter(hand => playerHasSplitForHand(hand, matchState.players[thisPlayersOrder]))
                                                    .map((hand, handIndex) => {

                                                        return <button key={handIndex} onClick={() => dispatch(
                                                            {
                                                                type: MatchOption.MATCH_SPLIT,
                                                                payload: {hand: handIndex}
                                                            }
                                                        )}>
                                                            SPLIT (hand {handIndex})
                                                        </button>
                                                    })
                                            }


                                            {/* SURRENDER */}
                                            {
                                                isActionAvailable(PlayerOption.INSURANCE, matchState.players[thisPlayersOrder]) &&
                                                <button onClick={() => dispatch(
                                                    {
                                                        type: MatchOption.MATCH_SURRENDER
                                                    }
                                                )}>
                                                    Surrender
                                                    (get {Math.ceil(matchState.players[thisPlayersOrder].bet / 2)} dollars
                                                    back)
                                                </button>
                                            }


                                            {/*// TODO action which is available only as the first move:*/}

                                            {/* INSURANCE */}
                                            {
                                                isActionAvailable(PlayerOption.INSURANCE, matchState.players[thisPlayersOrder]) &&
                                                <button onClick={() => dispatch(
                                                    {
                                                        type: MatchOption.MATCH_INSURANCE
                                                    }
                                                )}>
                                                    Insurance
                                                </button>
                                            }


                                        </div>
                                    }


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

                                {
                                    matchState.players.map((player, index) => <div
                                        key={index}
                                        style={{color: ([PlayerOption.SURRENDER, PlayerOption.BUST].includes(player.lastOption) ? 'grey' : 'black')}}>

                                        <h2>Player 0 (bet={player.bet})</h2>
                                        <PlayersHands hands={player.hands} />
                                    </div>)
                                }

                                <div>
                                    <h2>Dealer</h2>
                                    <ul>
                                        {
                                            matchState.dealer.fullHand.cards.map((card, index) =>
                                                <li
                                                    key={index}>
                                                    {
                                                        ((matchState.currentPlayer == 0 || matchState.currentPlayer == 1) && index == 1) ? (
                                                            '?? ??'
                                                        ) : (
                                                            <>{card.house} {card.number}</>
                                                        )
                                                    }

                                                </li>
                                            )
                                        }
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


    // // TODO download all cards from
    //https://www.flaticon.com/free-icon/clubs_7806988?term=playing%20card&page=1&position=1&page=1&position=1&related_id=7806988&origin=search

    // better code for showing the dealer and players' hands:

    // return <div className={styles.container}>
    // <Head>
    // <title>Match ♦️ Blackjack 2.0 </title>
    // <meta name="description" content="Play Blackjack with your best friend"/>
    // </Head>
    // <div className={styles.container}>
    // <div className={styles.table}>
    // <div className={styles.dealer}>
    //
    // </div>
    // <div className={styles.players}>
    // <div className={`${styles.player} ${styles.p1}`}>
    // {/*TODO transform this into a Hand component*/}
    // <div className={styles.hand}>
    // <span className={styles.card}>
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
