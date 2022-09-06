import {
    Card,
    CardHouse,
    CardNumber,
    ChosenHand,
    DealerType,
    Hand,
    MatchDispatchTypes,
    MatchOption,
    MatchType,
    PlayerOption,
    PlayerType
} from "../actions/MatchActionTypes";
import {Simulate} from "react-dom/test-utils";


interface DefaultStateI {
    match: MatchType
}

const defaultState: DefaultStateI = {
    match: {
        deck: [],
        players: [
            {
                hands: [],
                bet: 0,
                remainingCash: 100,
                lastOption: PlayerOption.NONE,
                isChoosingFirstOption: true
            },
            {
                hands: [],
                bet: 0,
                remainingCash: 100,
                lastOption: PlayerOption.NONE,
                isChoosingFirstOption: true
            }],
        dealer: {
            fullHand: {cards: [], isStillPlaying: true}
        },
        currentPlayer: 0,
        currentStartingBet: 5
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
const reshuffledDeckWithSplit = () => {
    let shuffledRandomly = reshuffledDeck(),
        firstCard = shuffledRandomly[0]
    // add two cards with the same number for the first player:
    for (let i = 1; i < shuffledRandomly.length; i++) {
        if (firstCard.number == shuffledRandomly[i].number) {
            //swap with the second card in the array:
            let card: Card = shuffledRandomly[1]
            shuffledRandomly[1] = shuffledRandomly[i]
            shuffledRandomly[i] = card
            break;
        }
    }
    console.log(shuffledRandomly)
    return shuffledRandomly;
}

const generateInitialMatch = (): MatchType => {

    // for dispatch of type MATCH_START_GAME:
    const initialBet = 5;
    let newDeck: Card[],
        player1Init: PlayerType,
        player2Init: PlayerType,
        dealerInit: DealerType;


    // TODO remove later, only used for testing the SPLIT option
    // newDeck = reshuffledDeck()
    newDeck = reshuffledDeckWithSplit()


    player1Init = {
        hands: [{cards: newDeck.slice(0, 2), isStillPlaying: true}],
        bet: initialBet,
        remainingCash: defaultState.match.currentStartingBet - initialBet,
        lastOption: PlayerOption.NONE,
        isChoosingFirstOption: true
    }
    player2Init = {
        hands: [{cards: newDeck.slice(2, 4), isStillPlaying: true}],
        bet: initialBet,
        remainingCash: defaultState.match.currentStartingBet - initialBet,
        lastOption: PlayerOption.NONE,
        isChoosingFirstOption: true
    }
    dealerInit = {
        fullHand: {cards: newDeck.slice(4, 6), isStillPlaying: true}
    }

    return {
        deck: newDeck.slice(6),
        players: [player1Init, player2Init],
        dealer: dealerInit,
        currentPlayer: 0,
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
    if (!hand) {
        return false;
    }
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
    return isBust(player.hands[handIndex].cards)
}
export const playerHasBUST = (player: PlayerType): boolean => {
    if (!player) return false;

    let {hands} = player;
    for (const hand of hands) {
        if (!isBust(hand.cards)) {
            return false;
        }
    }
    return true;
}
export type SplitCoord = {
    handIndex: number,
    cardIndex: number
}
export type SplitCoordsByHandIndex = Record<number, SplitCoord[]> // TODO from handIndex to a pair of handIndex, cardIndex!!!


export const countCardsByNumber = (hand: Hand, cardNumber: number): number => {
    return hand.cards.reduce(
        (prevCnt, card) => prevCnt + ((card.number == cardNumber) ? 1 : 0),
        0
    )
}

export const playersSplitsAfterInitialCards = (player: PlayerType): SplitCoordsByHandIndex => {

    let splitCoords: SplitCoordsByHandIndex = {}
    let splitByCardNumber = player.splitByCardNumber;

    player.hands.forEach(
        (hand, handIndex) => {

            if (countCardsByNumber(hand, splitByCardNumber) >= 2) {
                splitCoords[handIndex] = hand.cards
                    .map((card, cardIndex) => {
                        if (card.number == splitByCardNumber) {
                            return {handIndex: handIndex, cardIndex: cardIndex} as SplitCoord
                        } else {
                            return null;
                        }
                    })
                    .filter((splitCoord?) => splitCoord != null);
            }
        })


    // list with the card numbers which appear twice

    return splitCoords;
}
export const playerHasSplitForHand = (hand: Hand, player: PlayerType): boolean => {
    // is used BOTH  before and after the initial split
    if (player.isChoosingFirstOption) {
        let card1 = player.hands[0].cards[0],
            card2 = player.hands[0].cards[1];
        return card1.number == card2.number;
    } else {
        return countCardsByNumber(hand, player.splitByCardNumber) >= 2;
    }
}

export const playerHasSplitAfterInitialCards = (player: PlayerType): boolean => {

    for (const hand of player.hands) {
        if (playerHasSplitForHand(hand, player)) {
            return true;
        }
    }
    return false;
}
export const playerHasSplit = (player: PlayerType): boolean => {
    if (!player) {
        return false;
    } else {
        if (player.hands.length == 0) {
            return false;
        }
        if (player.isChoosingFirstOption) {
            let card1 = player.hands[0].cards[0],
                card2 = player.hands[0].cards[1];
            return card1.number == card2.number;
        } else {
            return playerHasSplitAfterInitialCards(player);
        }
    }
}

export const PLAYER_OPTION_KEYS: number[] = Object.keys(
    PlayerOption
)
    .filter((item) => !isNaN(Number(item)))
    .map((item) => parseInt(item));

export const isActionAvailable = (option: PlayerOption, player: PlayerType): boolean => {
    // console.log(option, player)
    switch (option) {
        case PlayerOption.BLACKJACK:
            return player?.isChoosingFirstOption && isBlackjack(player?.hands[0]?.cards);
        case PlayerOption.INSURANCE:
            return player?.isChoosingFirstOption;
        case PlayerOption.SPLIT:
            return playerHasSplit(player);

        // if he didn't BUST, he can HIT, STAND and DOUBLE
        case PlayerOption.HIT:
            return !playerHasBUST(player);
        case PlayerOption.STAND:
        case PlayerOption.DOUBLE:
            return !playerHasBUST(player) && player?.remainingCash >= player?.bet;
        case PlayerOption.SURRENDER:
            return true;
        case PlayerOption.BUST:


    }
}

// function for computing state after HIT

const stateAfterHIT = (state: DefaultStateI, hand: number): DefaultStateI => {

    let player: PlayerType = {
        ...state.match.players[state.match.currentPlayer]
    };

    let match: MatchType = JSON.parse(JSON.stringify(state.match));

    // update deck
    let drawedCard: Card;
    let remainingCards: Card[];
    drawedCard = match.deck[0]
    remainingCards = match.deck.slice(1)
    match.deck = remainingCards;


    // update player's hand:
    player.hands[hand].cards.push(drawedCard)
    // does the hand sums up to more than 21?
    if (isBust(player.hands[hand].cards)) {
        player.lastOption = PlayerOption.BUST
        // move to next player
        // draw can be called for 0 and 1, so we just add one
        match.currentPlayer += 1
    }

    // update player's data:
    match.players[match.currentPlayer] = player;

    // store that the player already chose first option
    match.players[match.currentPlayer].isChoosingFirstOption = false;

    return {
        match: match
    };
}

// STAND

const stateAfterSTAND = (state: DefaultStateI, hand: number): DefaultStateI => {
    // deep copy:
    let match: MatchType = JSON.parse(JSON.stringify(state.match));

    // the current player says that he holds one of his hands (probably his only) AS IT IS
    match.players[match.currentPlayer].hands[hand].isStillPlaying = false;
    // if all other cards are not playing, we also add the player's option as STAND:
    let countAvailableHands = match.players[match.currentPlayer].hands
        .reduce((previousValue, hand) => hand.isStillPlaying ? 1 : 0, 0)
    if (countAvailableHands == 0) {
        // because at least one of the hands ended by saying STAND
        // TODO but what if the player already had other lastOption, such as ...
        match.players[match.currentPlayer].lastOption = PlayerOption.STAND;
        match.currentPlayer += 1
    }

    // store that the player already chose first option
    match.players[match.currentPlayer].isChoosingFirstOption = false;

    console.log('new match', match);
    return {match: match};
}

// DOUBLE

const stateAfterDOUBLE = (state: DefaultStateI, hand: number): DefaultStateI => {
    // deep copy:
    let match: MatchType = JSON.parse(JSON.stringify(state.match));


    // store that the player already chose first option
    match.players[match.currentPlayer].isChoosingFirstOption = false;

    console.log('new match', match)
    return {match: match};
}

// SPLIT

// TODO may be more complex
const stateAfterSPLIT = (state: DefaultStateI, handIndex: number): DefaultStateI => {
    // deep copy:
    let match: MatchType = JSON.parse(JSON.stringify(state.match));
    let player = match.players[match.currentPlayer];
    // TODO if you have two aces, you can only split and get one more card, that's all, after that the hands are not playable anymore
    // TODO CAN YOU SPLIT AFTER A BLACKJACK
    if (player.splitByCardNumber != null) { // actually use handIndex
        if (player.hands[handIndex].isStillPlaying) {
            let poppedCard: Card;
            // find and pop the first card with this number
            for (let i = 0; i < player.hands[handIndex].cards.length; i++) {
                if (player.hands[handIndex].cards[i].number == player.splitByCardNumber) {
                    poppedCard = player.hands[handIndex].cards.at(i)
                    player.hands[handIndex].cards = player.hands[handIndex].cards.splice(i, 1);
                    break;
                }
            }
            // add the card above into a new hand
            player.hands.push(
                {cards: [poppedCard], isStillPlaying: true}
            )
        }
    } else {
        if (player.hands[0].cards[0].number == 11) { // handIndex is not necessary
            // draw two cards
            let card1 = match.deck[0],
                card2 = match.deck[1];
            match.deck = match.deck.splice(2);

            // create the two new hands:
            player.hands = [
                {
                    cards: [player.hands[0].cards[0], card1],
                    isStillPlaying: false
                },
                {
                    cards: [player.hands[0].cards[1], card2],
                    isStillPlaying: false
                },
            ]

            player.lastOption = PlayerOption.SPLIT;
        } else {
            // both hands will still be playable, because there's no way to have 21+ with a single card:
            // create the two new hands:
            player.hands = [
                {
                    cards: [player.hands[0].cards[0]],
                    isStillPlaying: true
                },
                {
                    cards: [player.hands[0].cards[1]],
                    isStillPlaying: true
                },
            ]
        }
    }

    // store that the player already chose first option
    match.players[match.currentPlayer].isChoosingFirstOption = false;

    console.log('new match', match)
    return {match: match};
}

// SURRENDER

const stateAfterSURRENDER = (state: DefaultStateI): DefaultStateI => {
    // deep copy:
    let match: MatchType = JSON.parse(JSON.stringify(state.match));

    match.players[match.currentPlayer].lastOption = PlayerOption.SURRENDER;
    match.currentPlayer += 1

    // store that the player already chose first option
    match.players[match.currentPlayer].isChoosingFirstOption = false;

    console.log('new match', match)
    return {match: match};
}

// INSURANCE

const stateAfterINSURANCE = (state: DefaultStateI): DefaultStateI => {
    // deep copy:
    let match: MatchType = JSON.parse(JSON.stringify(state.match));


    // store that the player already chose first option
    match.players[match.currentPlayer].isChoosingFirstOption = false;

    console.log('new match', match)
    return {match: match};
}

// DEALERS_TURN

const stateAfterDEALERS_TURN = (state: DefaultStateI): DefaultStateI => {
    // deep copy:
    let match: MatchType = JSON.parse(JSON.stringify(state.match));

    // a simple rule for automated dealer:
    // while the books sum to less than 17, the dealer will draw another card
    let sum = match.dealer.fullHand.cards.reduce(
        (prevSum, hand) => prevSum + maxValue(hand),
        0
    )
    while (sum < 17) {
        let newCard = match.deck[0];
        match.deck = match.deck.splice(1)

        match.dealer.fullHand.cards.push(newCard)

        sum += newCard.number
    }

    // the dealer's turn ends:
    match.currentPlayer = 999; // end of game :)
    match.dealer.fullHand.isStillPlaying = false;

    console.log('new match', match)
    return {match: match};
}

const matchReducer = (state: DefaultStateI, action: MatchDispatchTypes): DefaultStateI => {
    if (!state) {
        return defaultState;
    }

    switch (action.type) {

        // used at the beginning of the game
        case MatchOption.MATCH_START_GAME:
            return {
                match: generateInitialMatch()
            }

        // used for socketIO updates
        case MatchOption.UPDATE_STATE:
            console.log('match update from reducer:', action.payload)
            return {
                match: action.payload as MatchType
            }

        // most frequently used options:
        case MatchOption.MATCH_HIT:
            return stateAfterHIT(state, (action.payload as ChosenHand).hand)
        case MatchOption.MATCH_STAND:
            return stateAfterSTAND(state, (action.payload as ChosenHand).hand)
        case  MatchOption.MATCH_DOUBLE:
            return stateAfterDOUBLE(state, (action.payload as ChosenHand).hand)

        // less frequently used options:
        case  MatchOption.MATCH_SPLIT:
            return stateAfterSPLIT(state, (action.payload as ChosenHand).hand)
        case MatchOption.MATCH_SURRENDER:
            return stateAfterSURRENDER(state)
        case  MatchOption.MATCH_INSURANCE:
            return stateAfterINSURANCE(state)

        // used after both player played their hands
        case  MatchOption.MATCH_DEALERS_TURN:
            return stateAfterDEALERS_TURN(state)
        default:
            return state;
    }
}

export default matchReducer;