export const MATCH_START_GAME = "MATCH_START_GAME"; // the cards get shuffled and the dealer deals two to each person
export const MATCH_DRAW = "MATCH_DRAW"; // a person (1 or 2 or 3=dealer?) is going to draw one card, with NO BET
export const MATCH_BET = "MATCH_BET"; // a person (1 or 2 or 3=dealer?) is going to double the BET and draw a card
export const MATCH_DOUBLE_HAND = "MATCH_DOUBLE_HAND"; // a person (1,2,3) ir he has two identical cards, is going to turn them into two hands :)

enum CardHouse {
    HOUSE_CLUB = '♣',
    HOUSE_HEART = '♥',
    HOUSE_DIAMOND = '♦',
    HOUSE_SPADE = '♠'
}

export type Card = {
    house: CardHouse,
    number: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14
}
export type DeckType = {
    cards: Card[]
}
// players' data:
export type CurrentPlayerType = 0 | 1 | 2
export type PlayerType = {
    hands: Card[][],  // each player will have multiple cards
    bet: number
}
// The second card will be face down...
export type DealerType = {
    firstCard: Card,
    secondCard: Card // will be face down :)
    fullHand: Card[]  // the hand he deals to himself at the end of round
    // the dealer will keep going until  reaching the maximum number
    // TODO other rules?
}

export type MatchSubtype2 = {}
// payload types:
export type MatchType = {
    deck: Card[],
    player1: PlayerType,
    player2: PlayerType,
    dealer: DealerType,
    currentPlayer: CurrentPlayerType,
    currentBet: number
}

// individual action types:


export interface MatchStartGame {
    type: typeof MATCH_START_GAME
    // take into account doubling the hand when starting the grame :)
}

export interface MatchDraw {
    type: typeof MATCH_DRAW,
    payload: number // which hand they draw for, because hands can be split when the first cards are equal
}

export interface MatchBet {
    type: typeof MATCH_BET,
    payload: number // raise the bet with a number of dollars
}

export interface MatchDoubleHand {
    type: typeof MATCH_DOUBLE_HAND,
}


// dispatch types:

export type MatchDispatchTypes = MatchStartGame | MatchDraw | MatchBet | MatchDoubleHand;

