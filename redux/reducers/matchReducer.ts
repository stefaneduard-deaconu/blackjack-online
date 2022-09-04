import {
    Card,
    CardHouse,
    CardNumber,
    DealerType,
    MatchDispatchTypes,
    MatchType,
    PlayerOption,
    PlayerType
} from "../actions/MatchActionTypes";


interface DefaultStateI {
    match: MatchType
}

const defaultState: DefaultStateI = {
    match: {
        deck: [],
        player1: {
            hands: [],
            bet: 0,
            remainingCash: 100,
            lastOption: PlayerOption.NONE,
            isChoosingFirstOption: true
        },
        player2: {
            hands: [],
            bet: 0,
            remainingCash: 100,
            lastOption: PlayerOption.NONE,
            isChoosingFirstOption: true
        },
        dealer: {
            firstCard: null,
            secondCard: null,
            fullHand: []
        },
        currentPlayer: 0,
        currentStartingBet: 5,
        currentBet: 0
    }
}


// TODO replace with the actual value, instead of a function call
const unsortedDeck: Card[] = (() => {
    const deck: Card[] = []
    // generate all cards
    const numbers: CardNumber[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    for (let number of numbers) {
        for (let house of [CardHouse.HOUSE_CLUB, CardHouse.HOUSE_DIAMOND, CardHouse.HOUSE_SPADE, CardHouse.HOUSE_HEART]) {
            deck.push({
                'house': house,
                'number': number
            })
        }
    }
    return deck;
})()

const reshuffledDeck = () => {
    return unsortedDeck
        .map(value => ({value, sort: Math.random()}))
        .sort((a, b) => a.sort - b.sort)
        .map(({value}) => value)
}

const generateInitialMatch = (): MatchType => {

    // for dispatch of type MATCH_START_GAME:
    const initialBet = 5;
    let newDeck: Card[],
        player1Init: PlayerType,
        player2Init: PlayerType,
        dealerInit: DealerType;


    newDeck = reshuffledDeck()

    player1Init = {
        hands: [newDeck.slice(0, 2)],
        bet: initialBet,
        remainingCash: defaultState.match.currentStartingBet - initialBet,
        lastOption: PlayerOption.NONE,
        isChoosingFirstOption: true
    }
    player2Init = {
        hands: [newDeck.slice(2, 4)],
        bet: initialBet,
        remainingCash: defaultState.match.currentStartingBet - initialBet,
        lastOption: PlayerOption.NONE,
        isChoosingFirstOption: true
    }
    dealerInit = {
        firstCard: newDeck[4],
        secondCard: newDeck[5],
        fullHand: []
    }

    return {
        deck: newDeck.slice(6),
        player1: player1Init,
        player2: player2Init,
        dealer: dealerInit,
        currentPlayer: 0,
        currentBet: initialBet,
        currentStartingBet: initialBet
    }
}

// for DRAW:
export const minValue = (card: Card) => {
    const {number} = card;
    if (number == 11) {
        return 1;
    }
    if (number > 11) {
        return 10;
    }
    return number;
}
export const maxValue = (card: Card) => {
    const {number} = card;
    if (number > 11) {
        return 10;
    }
    return number;
}

export const sumUpHandNoAces = (hand: Card[]): number => {
    return hand.reduce(
        (c1, c2) => c1 + (c2.number == 11 ? 0 : minValue(c2)),
        0
    )
}
export const isBust = (hand: Card[]): boolean => {
    let minSum = hand.reduce(
        (c1, c2) => c1 + minValue(c2),
        0
    )
    return minSum > 21;
}
export const isBlackjack = (hand: Card[]): boolean => {
    // compute all possible sums:
    // can be solved recursively, by computing both sums when the card is an ace,
    //  and checking which values is closest but less than 21

    // how many aces does the hand have?
    let countAces = hand.reduce(
        (prevSum, card) => prevSum + (
            card.number == 11 ? 1 : 0
        ),
        0
    )
    let sumWithoutAces = sumUpHandNoAces(
        hand.filter(({number}) => number != 11)
    )

    // if there are no aces
    if (countAces == 0) {
        return sumWithoutAces == 21;
    }

    // no matter if your have 1/2/3/4 aces, the rule is the same
    let possibleAceSums = [
        countAces, countAces - 1 + 11
    ];
    // only two posibilities, use all aces as ones, or one of them as 11
    return sumWithoutAces + possibleAceSums[0] == 11 ||
        sumWithoutAces + possibleAceSums[1] == 11;


}

export const handIsBUST = (player: PlayerType, handIndex: number): boolean => {
    return isBust(player.hands[handIndex])
}
export const playerHasBUST = (player: PlayerType): boolean => {
    if (!player) return false;

    let {hands} = player;
    for (const hand of hands) {
        if (!isBust(hand)) {
            return false;
        }
    }
    return true;
}
export type SplitCoord = {
    handIndex: number,
    cardIndex: number
}
export type SplitCoordsByNumber = Record<number, SplitCoord[]>

export const playersSplits = (player: PlayerType): SplitCoordsByNumber => {

    let hasAlreadySplit = player.splitByCard != null;
    let splitCoords: SplitCoordsByNumber = {}

    player.hands.forEach(
        (hand, handIndex) => {

            hand.forEach(
                (card, cardIndex) => {
                    let coord = {cardIndex: cardIndex, handIndex: handIndex}
                    splitCoords[card.number] = splitCoords[card.number]
                        ? [...splitCoords[card.number], coord]
                        : [coord]
                }
            )
        })


    // list with the card numbers which appear twice

    for (const splitCoordsKey in splitCoords) {
        let number = parseInt(splitCoordsKey)
        if (number in [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]) {
            if (hasAlreadySplit && number != player.splitByCard.number) {

            }
        }
    }

    return splitCoords;
}
export const playerHasSplit = (player: PlayerType) => {
    if (!player) {
        return false;
    } else {
        return Object.keys(playersSplits(player)).length > 0;
    }
}

export const PLAYER_OPTION_KEYS: number[] = Object.keys(
    PlayerOption
)
    .filter((item) => !isNaN(Number(item)))
    .map((item) => parseInt(item));

export const isOptionAvailable = (option: PlayerOption, player: PlayerType): boolean => {
    switch (option) {
        case PlayerOption.BLACKJACK:
            return player?.isChoosingFirstOption && isBlackjack(player?.hands[0]);
        case PlayerOption.INSURANCE:
            return player?.isChoosingFirstOption;
        case PlayerOption.SPLIT:
            return playerHasSplit(player);

        // if he didn't BUST, he can HIT, STAND and DOUBLE
        case PlayerOption.HIT:
        case PlayerOption.STAND:
        case PlayerOption.DOUBLE:
            return !playerHasBUST(player) && player?.remainingCash >= player?.bet;
        case PlayerOption.SURRENDER:
            return true;

    }
}

// function for computing state after HIT

const matchAfterHIT = (state: DefaultStateI, hand: number): MatchType => {

    let player: PlayerType = {
        ...(state.match.currentPlayer == 0 ? state.match.player1 : state.match.player2)
    };

    let match = {...state.match};

    // update deck
    let drawedCard: Card;
    let remainingCards: Card[];
    drawedCard = match.deck[0]
    remainingCards = match.deck.slice(1)
    match.deck = remainingCards;


    // update player's hand:
    player.hands[hand].push(drawedCard)
    // does the hand sums up to more than 21?
    if (isBust(player.hands[hand])) {
        player.state = 'LOST'
        // move to next player
        // draw can be called for 0 and 1, so we just add one
        match.currentPlayer += 1
    }

    // update player's data:
    if (match.currentPlayer == 0) {
        match.player1 = player
    } else if (match.currentPlayer == 1) {
        match.player2 = player
    }

    return match;
}

const pokemonReducer = (state: DefaultStateI, action: MatchDispatchTypes): DefaultStateI => {
    if (!state) {
        return defaultState;
    }


    switch (action.type) {
        case "MATCH_START_GAME":
            return {
                match: generateInitialMatch()
            }
        case "MATCH_HIT":
            return {
                match: matchAfterHIT(state, action.payload.hand)
            }
        case "MATCH_STAND":
            return {
                match: matchAfterSplit(state,)
            }
        case "MATCH_SPLIT":
            return {
                match: matchAfterSplit(state,)
            }
        default:
            return state;
    }
}

export default pokemonReducer;