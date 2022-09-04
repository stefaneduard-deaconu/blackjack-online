import io from 'socket.io-client'
import {useEffect, useState} from "react";

const socket = io.connect("http://localhost:3001")

const IO = () => {

    const [joinedMatch, setJoinedMatch] = useState('') // TODO also store to localHost :)

    enum PlayerOption {
        NONE = 'NONE',
        STAND = 'STAND',
        HIT = 'HIT',
        DOUBLE = 'DOUBLE',
        INSURANCE = 'INSURANCE',
        SURRENDER = 'SURRENDER',
        SPLIT = 'SPLIT',
        BLACKJACK = 'BLACKJACK'
    }

    const PLAYER_OPTION_KEYS = Object.keys(PlayerOption).filter((item) => {
        return isNaN(Number(item));
    });

    const [option, setOption] = useState<PlayerOption>(PlayerOption.NONE) // TODO also store to localHost :)
    const [rivalOption, setRivalOption] = useState<PlayerOption>(PlayerOption.NONE) // TODO also store to localHost :)


    const [isWaitingPlayer, setWaitingPlayer] = useState<boolean>();

    useEffect(() => {
        socket.on('joined_room', (data) => {
            console.log(data)

            setJoinedMatch(data.joinedId)
            // TODO what will happend when refreshing the browser? :(

            setWaitingPlayer(data.waiting)
        })
        socket.on('receive_rival_option', (data) => {
            console.log('receive_rival_option:', data)
            setRivalOption(data.option)
        })
    }, [socket]) // the callback reruns for each emitted event

    const joinMatch = () => {
        socket.emit('join_room')
    }
    const setAndSendOption = (opt: Option) => {
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

    return (
        <div>
            <h3><i>If you refresh, the game will stop and your opponent will win</i></h3>
            {
                !joinedMatch &&
                <button onClick={joinMatch}>Play</button>
            }


            {

                isWaitingPlayer ? (
                    <div className="loading">
                        Loading...
                    </div>
                ) : (
                    joinedMatch ? (
                        <h1>Joined Match#{joinedMatch}</h1>
                    ) : (
                        <></>
                    )
                )
            }
            {joinedMatch && (<>
                    <h1>Our option: {option}</h1>
                    <h1>Their option: {rivalOption}</h1>
                </>
            )}

            <ul type={'none'}>
                {/* TODO add filtering, based on whether the option is available.. so we need to store whether the player*/}
                {/*  is making the first move now*/}
                {PLAYER_OPTION_KEYS.map(label => <li>
                    <button onClick={() => setAndSendOption(label)}>{label}</button>
                </li>)}
            </ul>
        </div>
    )

    // const [room, setRoom] = useState('')
    // const [joinedMatch, setJoinedRoom] = useState('')
    //
    // const [message, setMessage] = useState('')
    // const [messages, setMessages] = useState<string[]>([])
    // useEffect(() => {
    //     socket.on('joined_room', (data) => {
    //         console.log('JOINED room: ', data.room)
    //         setJoinedRoom(data.room)
    //     })
    //     socket.on('receive_messages', (data) => {
    //         console.log(`Room ${joinedMatch}: `, data.messages)
    //         setMessages(data.messages)
    //     })
    // }, [socket]) // the callback reruns for each emitted event
    //
    // const joinMatch = () => {
    //     if (room === '') return;
    //     socket.emit('join_room', {
    //         'room': room
    //     })
    // }
    // const sendMessageToRoom = () => {
    //     socket.emit('send_message', {
    //         'room': room,
    //         'message': message
    //     })
    //     setMessages([...messages, message])
    // }
    //
    // return (
    //     <div>
    //         <input type="text" placeholder={'Room'} onChange={(e) => {
    //             setRoom(e.target.value)
    //         }}/>
    //         <button onClick={joinMatch}>Join Room</button>
    //         <input type="text" placeholder={'Message'} onChange={(e) => {
    //             setMessage(e.target.value)
    //         }}/>
    //         <button onClick={sendMessageToRoom}>Send Message</button>
    //         <h1>Message:</h1>
    //         {messages.map((text) => <p>{text}</p>)}
    //     </div>
    // )
}

export default IO;