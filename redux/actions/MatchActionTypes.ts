// used as dispatch actions types
export enum MatchOption {
    MATCH_START_GAME = "START_GAME",
    MATCH_HIT = "HIT",
    MATCH_STAND = "STAND",
    MATCH_SPLIT = "SPLIT",
    MATCH_DOUBLE = "BET",
    MATCH_SURRENDER = "SURRENDER",
    MATCH_INSURANCE = "INSURANCE",
    MATCH_DEALERS_TURN = "DEALERS_TURN",
    // extra:
    UPDATE_STATE = "UPDATE_STATE"
}

export enum CardHouse {
    HOUSE_CLUB = '♣',
    HOUSE_HEART = '♥',
    HOUSE_DIAMOND = '♦',
    HOUSE_SPADE = '♠'
}

export type CardNumber = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14
export type Card = {
    house: CardHouse,
    number: CardNumber
}
export type Hand = {
    cards: Card[],
    isStillPlaying: boolean, // whether actions such as HIT, STAND, DOUBLE, SPLIT are still available (you can SPLIT after you busted a hand)
    // state: 'BUST' | 'STAND/DOUBLE' // TODO do we still need a state for some cases?
}


// players' data:

export enum PlayerOption {
    NONE,
    STAND,
    HIT,
    DOUBLE,
    INSURANCE,
    SURRENDER,
    SPLIT,
    BLACKJACK,
    BUST
}

/**
 * 999 means that the dealer also played.
 */
export type CurrentPlayerType = 0 | 1 | 2 | 999

export type PlayerType = {
    hands: Hand[],  // each player will have multiple cards
    bet: number,
    remainingCash: number;
    lastOption: PlayerOption,
    isChoosingFirstOption: boolean,
    splitByCardNumber?: number // TODO after first SPLIT, you'll have to take this into account
}

// The second card will be face down...
export type DealerType = {
    fullHand: Hand  // the hand he deals to himself at the end of round
    // the dealer will keep going until  reaching the maximum number
    // TODO other rules?
}

export type MatchType = {
    deck: Card[],
    players: PlayerType[],
    dealer: DealerType,
    currentPlayer: CurrentPlayerType,
    currentStartingBet: number,
}
export type ChosenHand = {
    hand: number
}

// individual action types:


export interface MatchStartGame {
    // take into account doubling the hand when starting the game :)
    type: MatchOption,
    payload: null
}


export interface MatchHit {
    // Draw another card for one of the hands
    type: MatchOption
    payload: ChosenHand
}

export interface MatchStand {
    // Do nothing and keep the current hands
    type: MatchOption
    payload: ChosenHand
}

export interface MatchDouble {
    // double the bet for one of the hands and draw the last card for that hand
    type: MatchOption
    payload: ChosenHand
}

export interface MatchSplit {
    type: MatchOption,
    payload: null
}

export interface MatchSurrender {
    // Give up on the current cards, and keep 50% of the bets
    type: MatchOption,
    payload: null
}

export interface MatchInsurance {
    // WHEN THE DEALER HAS AN Ace, the player bets whether the Dealer has Blackjack. And they gan get back 250%
    type: MatchOption,
    payload: null
}

export interface MatchDealersTurn {
    type: MatchOption,
    payload: null
}

// extra:
export interface MatchUpdateState {
    type: MatchOption,
    payload: MatchType
}


// dispatch types:

export type MatchDispatchTypes =
    MatchStartGame
    | MatchHit
    | MatchStand
    | MatchDouble
    | MatchSplit
    | MatchSurrender
    | MatchInsurance
    | MatchDealersTurn
    | MatchUpdateState;

