import {Hand} from "../../redux/actions/MatchActionTypes";


type PropTypes = {
    hands: Hand[]
}

const PlayersHands = ({hands}: PropTypes) => {


    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: 5}}>
            {
                hands.map((hand, handIndex) => {

                    let color = hand.isStillPlaying ? 'black' : 'gray';

                    return <div key={handIndex} style={{padding: 3, color: color}}>
                        Hand {handIndex} <br/>
                        {
                            hand.cards.map((card, cardIndex) => <span key={cardIndex} style={{fontSize: '1.4rem'}}>
                                    {card.house} {card.number}
                                </span>)
                        }

                    </div>
                })
            }
        </div>
    )
}

export default PlayersHands;